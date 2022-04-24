const ErrNotListRepeatingObject = 'ErrNotListOfRepeatingObject'

function isObject(element: any): boolean {
    return element.constructor.name === 'Object'
}

function min(a: number, b: number) {
    if (a < b) return a
    return b
}

function ensureListOfRepeatingObjects(data: any) {
    if (!Array.isArray(data))
        throw {
            name: ErrNotListRepeatingObject,
            message: 'data is not a list',
            details: data,
        }

    if (data.length === 0)
        throw {
            name: ErrNotListRepeatingObject,
            message: 'empty list',
        }

    let fields: { [key: string]: any } = {}
    for (let key of Object.keys(data[0])) {
        fields[key] = typeof data[0][key]
    }

    for (let i = 1; i < min(data.length, 20); i++) {
        if (!isObject(data[i])) {
            throw {
                name: ErrNotListRepeatingObject,
                message: 'list contains a non-object',
            }
        }
        for (let [key, value] of Object.entries(data[i])) {
            if (fields[key] !== typeof value) {
                throw {
                    name: ErrNotListRepeatingObject,
                    message: "key '" + key + "' is inconsistent",
                }
            }
        }
    }
}

function isListOfRepeatingObjects(data: any): boolean {
    try {
        ensureListOfRepeatingObjects(data)
    } catch (e: any) {
        if (e.name === ErrNotListRepeatingObject) return false
        throw e
    }
    return true
}

function findListOfRepeatingObjects(data: any) {
    const q = [
        // [path, object]
        [[], data],
    ]
    const possibilities = [
        // [path, object]
    ]

    while (q.length > 0) {
        // @ts-ignore
        const [path, obj] = q.shift()
        for (let key of Object.keys(obj)) {
            if (isListOfRepeatingObjects(obj[key])) {
                possibilities.push([[...path, key], obj[key]])
            } else if (isObject(obj[key])) {
                q.push([[...path, key], obj[key]])
            } else {
                console.log(key, 'fail')
            }
        }
    }

    if (possibilities.length === 0)
        throw new Error('no list of repeating objects found')
    if (possibilities.length > 1) {
        console.warn(
            'more than one list of repeating objects, choosing the longest list',
        )
        let longest = []
        for (let list of Object.values(possibilities)) {
            if (list.length > longest.length) {
                longest = list
            }
        }
        return longest
    }
    return possibilities[0]
}

const regexes = {
    dateISO8601: /^\d{4}-\d{1,2}-\d{1,2}$/,
    dateSlash: /^\d{1,2}\/\d{1,2}\/\d{4}$/,
}

function matchDate(data: any[], fieldName: string) {
    const dateFormats = {
        iso8601: true, // YYYY-MM-DD
        slash: true, // DD/MM/YYYY or MM/DD/YYYY
        numberDate: true, // YYYYMMDD, as a number
    }
    const slashHigherThan12 = { first: false, second: false }

    for (let i = 0; i < min(10, data.length); i++) {
        if (typeof data[i][fieldName] === 'number') {
            dateFormats.iso8601 = false
            dateFormats.slash = false
            if (data[i][fieldName] < 19000000 || data[i][fieldName] > 30000000)
                dateFormats.numberDate = false
            continue
        }
        dateFormats.numberDate = false

        if (!regexes.dateISO8601.test(data[i][fieldName])) {
            dateFormats.iso8601 = false
        }

        if (!regexes.dateSlash.test(data[i][fieldName])) {
            dateFormats.slash = false
        } else {
            const [first, second, third] = data[i][fieldName].split('/')
            if (parseInt(first) > 12) slashHigherThan12.first = true
            else if (parseInt(second) > 12) slashHigherThan12.second = true
        }
    }

    let keyTrue: keyof typeof dateFormats | null = null
    for (let format of Object.keys(
        dateFormats,
    ) as (keyof typeof dateFormats)[]) {
        if (dateFormats[format]) {
            if (keyTrue === null) {
                keyTrue = format
            } else {
                throw new Error(
                    `multiple date formats match for field '${fieldName}': ${keyTrue} and ${format}`,
                )
            }
        }
    }
    if (keyTrue === null) return null // nothing matched

    if (keyTrue === 'slash') {
        if (!slashHigherThan12.first && !slashHigherThan12.second) {
            console.warn(
                'cannot tell between MM/DD/YYYY and DD/MM/YYYY, assuming former',
            )
            return 'date-/'
        } else if (slashHigherThan12.first && slashHigherThan12.second) {
            console.warn(
                'slash date matched (MM/DD/YYYY) but found both MM > 12 and DD > 12, probably not a date then?',
            )
            return null
        } else if (slashHigherThan12.first) {
            return 'date-/'
        } else if (slashHigherThan12.second) {
            return 'date-/-american'
        }
    }
    return keyTrue
}

export type TField = {name: string, type: string, description: string | null}
export type TFields = {[name: string]: TField}

export function infer(data: any): {root: string, fields: TFields} {
    if (!Array.isArray(data) && !isObject(data))
        throw new Error('expected an object or a list at the root')

    let root
    if (isObject(data)) {
        const ret = findListOfRepeatingObjects(data)
        root = ret[0].join('.')
        data = ret[1]
    } else {
        root = null
    }

    ensureListOfRepeatingObjects(data)

    const fields: { [key: string]: any } = {}
    for (let field of Object.keys(data[0])) {
        fields[field] = typeof data[0][field]
    }

    for (let name of Object.keys(fields)) {
        if (fields[name] === 'string' || fields[name] === 'number') {
            // maybe it's a date
            const dateType = matchDate(data, name)
            if (dateType) {
                fields[name] = dateType
            }
        }
    }

    const schema: {
        [key: string]: { name: string; type: any; description: null | string }
    } = {}
    for (let name of Object.keys(fields)) {
        schema[name] = {
            name: name,
            type: fields[name],
            description: null,
        }
    }

    return {
        root: root,
        fields: schema,
    }
}
