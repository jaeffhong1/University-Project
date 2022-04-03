import { TReport } from "../App";
import { SourceAdaptor } from "../SourceSelectors";


export function parseDate(s: string): Date {
    let date, time;
    if (s.includes(' ')) {
        [date, time] = s.split(' ')
    } else {
        [date, time] = s.split('T')
    }
    const [year, month, day] = date.split('-')
    const [hour, minute, second] = time.split(':')
    // ignore time zone
    return new Date(Date.UTC(
        parseInt(year, 10),
        month == 'xx' ? 0 : parseInt(month, 10),
        day == 'xx' ? 1 : parseInt(day, 10),
        hour == 'xx' ? 0 : parseInt(hour, 10),
        minute == 'xx' ? 0 : parseInt(minute, 10),
        second == 'xx' ? 0 : parseInt(second, 10),
    ))
}
export default class SourceAdaptorf0b5 implements SourceAdaptor {

    async fetch(start: string, end: string, location: string, keyTerms: string): Promise<TReport[]> {
        const name = `source-cache__f0b5__01__-${start}-${end}-${location}-${keyTerms}`

        console.group("fetch for", name)
        // const resp = await CacheSystem.fetch(name, `http://seng3011.duckdns.org/article/filter?location=${location}&start_date=${start}&end_date=${end}&key_terms=${keyTerms}`)
        const resp = await fetch(`http://seng3011.duckdns.org/article/filter?location=${location}&start_date=${start}&end_date=${end}&key_terms=${keyTerms}`)
        console.groupEnd()
        if (resp.status !== 200)
        {
            console.error(resp)
            if (resp.status === 400) {
                alert("[400]: " + (await resp.json()).message)
                throw new Error("err")
            }
            alert('f0b5' + resp.status + ' ' + await resp.text())
            throw new Error("stop")
        }
        const reports: TReport[] = []
        const obj = await resp.json()
        for (let article of obj) {
            for (let report of article.reports) {
                reports.push({
                    diseases: report.diseases,
                    event_date: parseDate(report.event_date),
                    location: {
                        long: 0, // FIXME
                        lat: 0,
                    },
                    syndromes: [],
                })
            }
        }
        return obj
    }

    // addDateObjects(articles: TArticle[]) {
    //     for (let article of articles) {
    //         if (article.date_of_publication && !article.date_of_publication_obj)
    //             article.date_of_publication_obj = parseDate(article.date_of_publication)
    //         for (let report of article.reports) {
    //             if (report.event_date && !report.event_date_obj)
    //                 report.event_date_obj = parseDate(report.event_date)
    //         }
    //     }
    // }
}