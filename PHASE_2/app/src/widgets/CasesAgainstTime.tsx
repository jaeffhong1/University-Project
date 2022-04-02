import React from "react";
import Plot from "react-plotly.js";
import { TArticle, TSource } from "../App";
import "./plotly.css";
import { WidgetProps } from "./Widget";

interface State {
    data: {
        bins: string[],
        counts: number[],
        source: TSource;
    } | null;
}

enum Duration {
    SECOND = 1,
    MINUTE = 60,
    HOUR = 60 * 60,
    DAY = 24 * 60 * 60,
    WEEK = 7 * 24 * 60 * 60,
}

function makeBinsAndCounts(start: number, end: number, width: number, articles: TArticle[]): [Date[], number[]] {
    const bins = []
    for (let i = 0; i < (end - start) / width; i++) {
        bins.push(start + i * width)
    }
    const counts = []
    counts.length = bins.length
    for (let article of articles) {
        for (let report of article.reports) {
            const t = report.event_date_obj.valueOf() / 1000
            console.assert(t >= start)
            const i = (t - start) / width
            console.assert(i < counts.length)
            if (!counts[i]) counts[i] = 0;
            counts[i]++;
        }
    }
    return [bins.map(x => new Date(x * 1000)), counts]
}

export class CasesAgainstTime extends React.Component<WidgetProps, State> {
    constructor(props: WidgetProps) {
        super(props)
        this.state = {
                data: null
        }
    }

    static getDerivedStateFromProps(props: WidgetProps, currentState: State) {
        if (currentState.data != null && currentState.data.source === props.source)
            return null;

        const [bins, counts] = makeBinsAndCounts(
            props.source.meta.start.valueOf() / 1000,
            props.source.meta.end.valueOf() / 1000,
            Duration.DAY,
            props.source.articles
        )
        console.log(bins)
        console.log(counts)
        return {
            data: {
                source: props.source,
                bins: bins,
                counts: counts,
            }
        }
      }

    render() {
        // return <pre><code>Source={JSON.stringify(this.props.source, null, 2)}</code></pre>
        if (this.state.data == null)
            return <p>Computing graph points from props</p>

        return <Plot 
                data={
                    [
                        {
                            x: this.state.data.bins,
                            y: this.state.data.counts,
                            type: 'bar',
                            mode: 'lines+markers',
                        },
                    ]
                }
                layout={{autosize: true, title: 'Cases Against Time'}}
            />

    }
}