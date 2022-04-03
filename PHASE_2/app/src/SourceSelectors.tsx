import React from "react";
import { TArticle, TSource } from "./App";
import SourceAdaptorEpiWatch from "./sources/epiwatch";
import SourceAdaptorf0b5 from "./sources/f0b5";
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

export interface SourceAdaptor {
    fetch: (start: string, end: string, location: string, keyTerms: string) => Promise<TArticle[]>
}

const sourceAdaptors: {[key: string]: SourceAdaptor} = {
    f0b5: new SourceAdaptorf0b5(),
    epiwatch: new SourceAdaptorEpiWatch(),
}

interface State {
    startDate: string;
    endDate: string;
    sourceName: keyof typeof sourceAdaptors;
}

export default class SourceSelector extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props)
        const today = new Date();
        this.state = {
            startDate: '2022-01-01',
            endDate: `${today.getUTCFullYear()}-${String(today.getUTCMonth()).padStart(2, '0')}-${String(today.getUTCDate()).padStart(2, '0')}`,
            sourceName: 'f0b5',
        }
    }
    
    async fetchSource() {

        const start = this.state.startDate + 'Txx:xx:xx'
        const end = this.state.endDate + 'Txx:xx:xx'
        const location = 'Sydney'
        const keyTerms = 'COVID-19'

        let articles;
        try {
            articles = await sourceAdaptors[this.state.sourceName].fetch(start, end, location, keyTerms)
        } catch (e: any) {
            alert(e)
            return;
        }
        
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
        return <>
            <form action="#" onSubmit={(e) => e.preventDefault()}>
                {/* @ts-ignore */}
                <div onChange={(e) => this.setState({sourceName: e.target.value})}>
                    <p> <input type="radio" id="source-f0b5" value="f0b5" name="source" /> <label htmlFor="source-f0b5">f0b5</label> </p>
                    <p> <input type="radio" id="source-epiwatch" value="epiwatch" name="source" /> <label htmlFor="source-epiwatch">EpiWatch</label> </p>
                </div>
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
        </> 
    }
}