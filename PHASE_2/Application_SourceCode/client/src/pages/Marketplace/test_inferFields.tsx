import { infer } from "./inferFields"

function assert(cond: boolean, message = ''): asserts cond {
    if (!cond) throw new Error('[assertion error]: ' + message)
}

function isObject(element: any): boolean {
    return element.constructor.name === 'Object'
}

function objectEquals(a: any, b: any) {
    if (a === b) return true

    if (typeof a !== typeof b) return false

    if (typeof a === 'number' || typeof b === 'string') return a == b

    if (!isObject(a) || !isObject(b)) return false

    const ak = new Set(Object.keys(a))
    const bk = new Set(Object.keys(b))
    if (ak.size !== bk.size) return false

    for (let k of ak.values()) {
        if (!bk.delete(k)) return false
        if (!objectEquals(a[k], b[k])) return false
    }
    if (bk.size > 0) return false

    return true
}

const data = {
    data: [
        {
            date: '2022-04-22',
            total_cases: 8787,
            postcode: '2000',
            active_cases: 690,
        },
        {
            date: '2022-04-21',
            total_cases: 8747,
            postcode: '2000',
            active_cases: 693,
        },
        {
            date: '2022-04-20',
            total_cases: 8690,
            postcode: '2000',
            active_cases: 687,
        },
        {
            date: '2022-04-19',
            total_cases: 8622,
            postcode: '2000',
            active_cases: 681,
        },
        {
            date: '2022-04-18',
            total_cases: 8550,
            postcode: '2000',
            active_cases: 716,
        },
        {
            date: '2022-04-17',
            total_cases: 8507,
            postcode: '2000',
            active_cases: 774,
        },
        {
            date: '2022-04-16',
            total_cases: 8470,
            postcode: '2000',
            active_cases: 802,
        },
        {
            date: '2022-04-15',
            total_cases: 8430,
            postcode: '2000',
            active_cases: 831,
        },
        {
            date: '2022-04-14',
            total_cases: 8373,
            postcode: '2000',
            active_cases: 807,
        },
        {
            date: '2022-04-13',
            total_cases: 8315,
            postcode: '2000',
            active_cases: 834,
        },
        {
            date: '2022-04-12',
            total_cases: 8260,
            postcode: '2000',
            active_cases: 860,
        },
        {
            date: '2022-04-11',
            total_cases: 8195,
            postcode: '2000',
            active_cases: 882,
        },
        {
            date: '2022-04-10',
            total_cases: 8137,
            postcode: '2000',
            active_cases: 935,
        },
        {
            date: '2022-04-09',
            total_cases: 8090,
            postcode: '2000',
            active_cases: 967,
        },
        {
            date: '2022-04-08',
            total_cases: 8041,
            postcode: '2000',
            active_cases: 975,
        },
    ],
}
assert(
    objectEquals(infer(data), {
        root: 'data',
        fields: {
            date: { name: 'date', type: 'iso8601', description: null },
            total_cases: {
                name: 'total_cases',
                type: 'number',
                description: null,
            },
            postcode: { name: 'postcode', type: 'string', description: null },
            active_cases: {
                name: 'active_cases',
                type: 'number',
                description: null,
            },
        },
    }),
)

assert(
    objectEquals(
        infer({
            foo: {
                bar: {
                    hello: [
                        {
                            date: 20200323,
                            disease: 'covid',
                            location: 'foo bar',
                        },
                        { date: 20210807, disease: 'foo', location: 'foo bar' },
                        { date: 20281201, disease: 'bar', location: 'foo bar' },
                        { date: 20220308, disease: 'yeo', location: 'foo bar' },
                    ],
                },
            },
        }),
        {
            root: 'foo.bar.hello',
            fields: {
                date: { name: 'date', type: 'numberDate', description: null },
                disease: { name: 'disease', type: 'string', description: null },
                location: {
                    name: 'location',
                    type: 'string',
                    description: null,
                },
            },
        },
    ),
)
console.log('test passes!')