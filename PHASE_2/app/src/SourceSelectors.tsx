import React from "react";
import { TSource } from "./App";
import CacheSystem from "./CacheSystem";

interface Props {
    setSource: (s: TSource) => void;
}

export default class SourceSelector extends React.Component<Props> {
    componentDidMount() {
        // const p = CacheSystem.fetch('sydney-covid-cases-01', 'http://seng3011.duckdns.org/article/filter?location=Sydney&start_date=2022-01-01Txx:xx:xx&end_date=2022-02-01Txx:xx:xx&key_terms=COVID-19', {})
        const p = CacheSystem.fetch('tmp', 'http://seng3011.duckdns.org/article/filter?location=Sydney&start_date=2022-01-01Txx:xx:xx&end_date=2022-02-01Txx:xx:xx&key_terms=COVID-19', undefined)
        p.then(resp => {
            if (typeof resp != "string") {
                console.error(resp)
                throw new Error("stop")
            }
            const source = JSON.parse(resp)
            this.addDateObjects(source)
            this.props.setSource(source)
        })
    }

    parseDate(s: string): Date {
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

    addDateObjects(source: TSource) {
        for (let article of source) {
            article.date_of_publication_obj = this.parseDate(article.date_of_publication)
            for (let report of article.reports) {
                report.event_date_obj = this.parseDate(report.event_date)
            }
        }
    }

    render() {
        return <p>Selected source for you</p>
    }
}