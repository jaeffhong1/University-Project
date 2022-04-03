import React from "react";
import { TArticle, TSource } from "./App";
import CacheSystem from "./CacheSystem";
import "./SourceSelector.css";

interface Props {
    setSource: (s: TSource) => void;
}

function parseDate(s: string): Date {
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

interface State {
    startDate: string;
    endDate: string;
}

export default class SourceSelector extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props)
        const today = new Date();
        this.state = {
            startDate: '2022-01-01',
            endDate: `${today.getUTCFullYear()}-${String(today.getUTCMonth()).padStart(2, '0')}-${String(today.getUTCDate()).padStart(2, '0')}`,
        }
    }
    
    async fetchSource() {
        const start = this.state.startDate + 'Txx:xx:xx'
        const end = this.state.endDate + 'Txx:xx:xx'
        const location = 'Sydney'
        const keyTerms = 'COVID-19'
        const name = `source-cache-${start}-${end}-${location}-${keyTerms}`
        console.log("fetch for", name)
        const resp = await CacheSystem.fetch(name, `http://seng3011.duckdns.org/article/filter?location=${location}&start_date=${start}&end_date=${end}&key_terms=${keyTerms}`)
        console.log("done")
        if (typeof resp != "string") {
            console.error(resp)
            if (resp.status === 400) {
                alert("[400]: " + (await resp.json()).message)
                return
            }
            throw new Error("stop")
        }
        const articles = JSON.parse(resp) as TArticle[];
        const source = {
            meta: {
                start: parseDate(start),
                end: parseDate(end),
            },
            articles,
        }
        this.addDateObjects(source)
        // console.log('set source')
        this.props.setSource(source)
    }

    componentDidMount() {
        this.fetchSource()
    }

    addDateObjects(source: TSource) {
        if (source === null) throw new Error("stop")
        for (let article of source.articles) {
            article.date_of_publication_obj = parseDate(article.date_of_publication)
            for (let report of article.reports) {
                report.event_date_obj = parseDate(report.event_date)
            }
        }
    }

    render() {
        return <form action="#" onSubmit={(e) => e.preventDefault()}>
            <p>
                From: 
                <input type="date" value={this.state.startDate} onChange={e => this.setState({'startDate': e.target.value})} />
                <input type="time" defaultValue='00:00:00'/>
            </p>
            <p>
                To:
                <input type="date" value={this.state.endDate} onChange={e => this.setState({'endDate': e.target.value})} />
                <input type="time" defaultValue='00:00:00' />
            </p>
            <p><button onClick={() => this.fetchSource()}>Fetch</button></p>
        </form>
    }
}