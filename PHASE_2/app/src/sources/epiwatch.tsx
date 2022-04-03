import { TArticle } from "../App"
import { SourceAdaptor } from "../SourceSelectors"


export default class SourceAdaptorEpiWatch implements SourceAdaptor {

    async fetch(start: string, end: string, location: string, keyTerms: string): Promise<TArticle[]> {
        const name = `source-cache__epiwatch__04__full`
        const item = localStorage.getItem(name)
        if (item !== null) {
            return JSON.parse(item) // assume the right structure
        }
        console.group("fetch for", name)
        const url = 'http://seng3011.duckdns.org/static/combinedData.json'
        const resp = await fetch(url)
        if (resp.status !== 200) {
            alert('combined data' + await resp.text())
            throw new Error("stop")
        }
        const orig = await resp.json()
        for (let article of orig) {
            if (article['publication-date'])
                article.date_of_publication_obj = new Date(article['publication-date'])
            for (let report of article.reports) {
                if (report.event_date)
                    report.event_date_obj = new Date(report.event_date)
                // report.event_date = report.event_date || report.date_of_publication || article.date_of_publication
            }
        }
        localStorage.setItem(name, JSON.stringify(orig))
        console.groupEnd()
        return orig
    }
}