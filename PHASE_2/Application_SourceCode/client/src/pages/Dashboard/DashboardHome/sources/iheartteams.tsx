import { SourceAdaptor, TReport } from "../DashboardHome";

export function parseDate(s: string): Date {
    let date, time;
    if (s.includes(" ")) {
        [date, time] = s.split(" ");
    } else {
        [date, time] = s.split("T");
    }
    const [year, month, day] = date.split("-");
    const [hour, minute, second] = time.split(":");
    // ignore time zone
    return new Date(
        Date.UTC(
            parseInt(year, 10),
            month == "xx" ? 0 : parseInt(month, 10),
            day == "xx" ? 1 : parseInt(day, 10),
            hour == "xx" ? 0 : parseInt(hour, 10),
            minute == "xx" ? 0 : parseInt(minute, 10),
            second == "xx" ? 0 : parseInt(second, 10)
        )
    );
}
export default class SourceAdaptorIHeartTeams implements SourceAdaptor {
    async fetch(
        start: string,
        end: string,
        location: string,
        keyTerms: string
    ): Promise<TReport[]> {
        const name = `source-cache__iheartteams__01__-${start}-${end}-${location}-${keyTerms}`;

        console.group("fetch for", name);
        // const resp = await CacheSystem.fetch(name, `http://seng3011.duckdns.org/article/filter?location=${location}&start_date=${start}&end_date=${end}&key_terms=${keyTerms}`)
        const resp = await fetch(
            `http://seng3011.duckdns.org/other-team/iheartteams?location=${location}&start_date=${start}&end_date=${end}&key_terms=${keyTerms}`
        );
        console.groupEnd();
        if (resp.status !== 200) {
            console.error(resp);
            alert("ihearteams" + resp.status + " " + (await resp.text()));
            throw new Error("stop");
        }
        const reports: TReport[] = [];
        const obj = await resp.json();
        for (let report of obj) {
            if (report.locations.length > 1) {
                console.warn("i heart teams: got a report with more than one location!")
            }
            reports.push({
                diseases: report.diseases,
                event_date: parseDate(report.event_date),
                location: report.locations[0],
                syndromes: report.syndromes,
            });
        }
        return reports;
    }
}
