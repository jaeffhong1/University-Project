import { TArticle } from "../App"
import CacheSystem from "../CacheSystem"
import { SourceAdaptor } from "../SourceSelectors"

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
            alert(await resp.text())
            throw new Error("stop")
        }
        return JSON.parse(resp) as TArticle[];;
        // const source = {
        //     meta: {
        //         start: parseDate(start),
        //         end: parseDate(end),
        //     },
        //     articles,
        // }
    }
}