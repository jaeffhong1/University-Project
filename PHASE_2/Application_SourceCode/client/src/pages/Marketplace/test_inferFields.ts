// deno run <this file>
// @ts-ignore
import { infer } from './inferFields.tsx'

function assert(cond: boolean, message = ''): asserts cond {
    if (!cond) throw new Error('[assertion error]: ' + message)
}

function isObject(element: any): boolean {
    if (element == null || element == undefined) return false
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
                date: {
                    name: 'date',
                    type: 'date-concatenated-number',
                    description: null,
                },
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

const table = {
    // url: data structure
    'https://api.coronavirus.data.gov.uk/v1/data': {
        root: 'data',
        fields: {
            date: { name: 'date', type: 'date-iso-8601', description: null },
            areaName: { name: 'areaName', type: 'string', description: null },
            areaCode: { name: 'areaCode', type: 'string', description: null },
            confirmedRate: {
                name: 'confirmedRate',
                type: 'number',
                description: null,
            },
            latestBy: { name: 'latestBy', type: 'number', description: null },
            confirmed: { name: 'confirmed', type: 'number', description: null },
            deathNew: { name: 'deathNew', type: 'number', description: null },
            death: { name: 'death', type: 'number', description: null },
            deathRate: { name: 'deathRate', type: 'number', description: null },
        },
    },
    'https://www.covid-19.sa.gov.au/__data/assets/file/0004/145849/covid_19_daily.json':
        {
            root: 'laboratory_daily.data',
            fields: {
                x: {
                    description: null,
                    name: 'x',
                    type: 'date-/',
                },
                y: {
                    description: null,
                    name: 'y',
                    type: 'number',
                },
            },
        },
    'https://nswdac-covid-19-postcode-heatmap.azurewebsites.net/datafiles/postcode_daily_cases.json':
        {
            root: 'data',
            fields: {
                date: {
                    description: null,
                    name: 'date',
                    type: 'date-iso-8601',
                },
                postcode: {
                    description: null,
                    name: 'postcode',
                    type: 'string',
                },
                total_cases: {
                    description: null,
                    name: 'total_cases',
                    type: 'number',
                },
                active_cases: {
                    description: null,
                    name: 'active_cases',
                    type: 'number',
                },
            },
        },
    'https://opendata.ecdc.europa.eu/covid19/casedistribution/json/': {
        root: 'records',
        fields: {
            dateRep: { name: 'dateRep', type: 'date-/', description: null },
            day: { name: 'day', type: 'string', description: null },
            month: { name: 'month', type: 'string', description: null },
            year: { name: 'year', type: 'string', description: null },
            cases: { name: 'cases', type: 'number', description: null },
            deaths: { name: 'deaths', type: 'number', description: null },
            countriesAndTerritories: {
                name: 'countriesAndTerritories',
                type: 'string',
                description: null,
            },
            geoId: { name: 'geoId', type: 'string', description: null },
            countryterritoryCode: {
                name: 'countryterritoryCode',
                type: 'string',
                description: null,
            },
            popData2019: {
                name: 'popData2019',
                type: 'number',
                description: null,
            },
            continentExp: {
                name: 'continentExp',
                type: 'string',
                description: null,
            },
            'Cumulative_number_for_14_days_of_COVID-19_cases_per_100000': {
                name: 'Cumulative_number_for_14_days_of_COVID-19_cases_per_100000',
                type: 'string',
                description: null,
            },
        },
    },
    'https://api.covidtracking.com/v1/us/daily.json': {
        root: null,
        fields: {
            date: {
                description: null,
                name: 'date',
                type: 'date-concatenated-number',
            },
            states: {
                description: null,
                name: 'states',
                type: 'number',
            },
            positive: {
                description: null,
                name: 'positive',
                type: 'number',
            },
            negative: {
                description: null,
                name: 'negative',
                type: 'number',
            },
            pending: {
                description: null,
                name: 'pending',
                type: 'number',
            },
            hospitalized: {
                description: null,
                name: 'hospitalized',
                type: 'number',
            },
            hospitalizedCurrently: {
                description: null,
                name: 'hospitalizedCurrently',
                type: 'number',
            },
            hospitalizedCumulative: {
                description: null,
                name: 'hospitalizedCumulative',
                type: 'number',
            },
            inIcuCurrently: {
                description: null,
                name: 'inIcuCurrently',
                type: 'number',
            },
            inIcuCumulative: {
                description: null,
                name: 'inIcuCumulative',
                type: 'number',
            },
            onVentilatorCurrently: {
                description: null,
                name: 'onVentilatorCurrently',
                type: 'number',
            },
            onVentilatorCumulative: {
                description: null,
                name: 'onVentilatorCumulative',
                type: 'number',
            },
            death: {
                description: null,
                name: 'death',
                type: 'number',
            },
            totalTestResults: {
                description: null,
                name: 'totalTestResults',
                type: 'number',
            },
            recovered: {
                description: null,
                name: 'recovered',
                type: 'object',
            },
            total: {
                description: null,
                name: 'total',
                type: 'number',
            },
            posNeg: {
                description: null,
                name: 'posNeg',
                type: 'number',
            },
            deathIncrease: {
                description: null,
                name: 'deathIncrease',
                type: 'number',
            },
            hospitalizedIncrease: {
                description: null,
                name: 'hospitalizedIncrease',
                type: 'number',
            },
            negativeIncrease: {
                description: null,
                name: 'negativeIncrease',
                type: 'number',
            },
            positiveIncrease: {
                description: null,
                name: 'positiveIncrease',
                type: 'number',
            },
            totalTestResultsIncrease: {
                description: null,
                name: 'totalTestResultsIncrease',
                type: 'number',
            },
            lastModified: {
                description: null,
                name: 'lastModified',
                type: 'date',
            },
            dateChecked: {
                description: null,
                name: 'dateChecked',
                type: 'date',
            },
            hash: {
                description: null,
                name: 'hash',
                type: 'string',
            },
        },
    },
}
for (let [url, expected] of Object.entries(table)) {
    // @ts-ignore
    const resp = await fetch(url)
    // @ts-ignore
    const data = await resp.json()
    let out
    try {
        out = infer(data)
    } catch (e) {
        console.error(`failed for ${url}`)
        throw e
    }
    if (!objectEquals(out, expected)) {
        console.error(`Data didn't match for ${url}`)
        console.log(JSON.stringify(expected))
        console.log(JSON.stringify(out))
    }
}
