import { TReport } from "../DashboardHome"
import { SourceAdaptor } from "../SourceSelectors"


export default class SourceAdaptorEpiWatch implements SourceAdaptor {

    async fetch(start: string, end: string, location: string, keyTerms: string): Promise<TReport[]> {
        const name = `source-cache__epiwatch__04__full`
        // const item = localStorage.getItem(name)
        // if (item !== null) {
        //     return JSON.parse(item) // assume the right structure
        // }

        console.group("fetch for", name)
        const url = 'http://seng3011.duckdns.org/static/combinedData.json'
        const resp = await fetch(url)
        if (resp.status !== 200) {
            alert('combined data' + await resp.text())
            throw new Error("stop")
        }
        const orig = await resp.json()
        const reports: TReport[] = []
        for (let article of orig) {
            for (let report of article.reports) {
                if (report.event_date) {
                    reports.push({
                        diseases: report.diseases.split(', '),
                        syndromes: [],
                        location: {
                            long: report.report_location.long,
                            lat: report.report_location.lat,
                        },
                        event_date: new Date(report.event_date),
                    })
                }
            }
        }
        // localStorage.setItem(name, reports)
        console.groupEnd()
        return reports
    }
}