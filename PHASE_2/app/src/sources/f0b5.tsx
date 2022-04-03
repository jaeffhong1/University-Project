import { TArticle } from "../App";
import CacheSystem from "../CacheSystem";
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

    async fetch(start: string, end: string, location: string, keyTerms: string): Promise<TArticle[]> {
        const name = `source-cache__f0b5__01__-${start}-${end}-${location}-${keyTerms}`

        console.group("fetch for", name)
        const resp = await CacheSystem.fetch(name, `http://seng3011.duckdns.org/article/filter?location=${location}&start_date=${start}&end_date=${end}&key_terms=${keyTerms}`)
        console.groupEnd()

        if (typeof resp != "string") {
            console.error(resp)
            if (resp.status === 400) {
                alert("[400]: " + (await resp.json()).message)
                throw new Error("err")
            }
            alert('f0b5' + await resp.text())
            throw new Error("stop")
        }
        const obj = JSON.parse(resp)
        this.addDateObjects(obj)
        return obj
    }

    addDateObjects(articles: TArticle[]) {
        for (let article of articles) {
            if (article.date_of_publication && !article.date_of_publication_obj)
                article.date_of_publication_obj = parseDate(article.date_of_publication)
            for (let report of article.reports) {
                if (report.event_date && !report.event_date_obj)
                    report.event_date_obj = parseDate(report.event_date)
            }
        }
    }
}