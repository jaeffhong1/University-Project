import { Data as PlotlyData } from "plotly.js";
import React from "react";
import Plot from "react-plotly.js";
import { TArticle, TSource } from "../App";
import "./plotly.css";
import { WidgetProps } from "./Widget";


const DURATION = {
    'Second': 1,
    'Minute': 60,
    'Hour': 60 * 60,
    'Day': 24 * 60 * 60,
    'Week': 7 * 24 * 60 * 60,
    'Month': 30 * 7 * 24 * 60 * 60
}

interface State {
    data: {
        plotdata: PlotlyData[],
        source: TSource;
    } | null;
    binWidth: keyof typeof DURATION
}

function makeBinsAndCounts(start: number, end: number, width: number, articles: TArticle[]): [Date[], {[key: string]: number[]}] {
    const bins = []
    for (let i = 0; i < (end - start) / width + 1; i++) {
        bins.push(start + i * width)
    }
    console.log(bins)
    const counts: {[key: string]: number[]} = {}
    for (let article of articles) {
        for (let report of article.reports) {
            const t = report.event_date_obj.valueOf() / 1000
            // some reports are included because another report in the same article matched
            if (t < start || t > end)
                continue;
            const i = Math.floor((t - start) / width)
            console.assert(i <= bins.length, `${i} ${counts.length} ${report.event_date_obj}`)
            for (let dis of report.diseases) {
                if (counts[dis] == undefined) {
                    counts[dis] = []
                    counts[dis].length = bins.length
                }
                if (!counts[dis][i]) counts[dis][i] = 0;
                counts[dis][i]++;
            }
        }
    }
    return [bins.map(x => new Date(x * 1000)), counts]
}

function makeData(source: TSource, binWidth: keyof typeof DURATION): {data: {
    source: TSource,
    plotdata: PlotlyData[]
}} {
    const [bins, counts] = makeBinsAndCounts(
        source.meta.start.valueOf() / 1000,
        source.meta.end.valueOf() / 1000,
        DURATION[binWidth],
        source.articles
    )
    const plotdata = []
    for (let dis of Object.keys(counts)) {
        plotdata.push({
            x: bins,
            y: counts[dis],
            type: 'bar',
            name: dis,
        })
    }
    return {
        data: {
            source,
            // @ts-ignore
            plotdata,
        }
    }
}

export class CasesAgainstTime extends React.Component<WidgetProps, State> {
    constructor(props: WidgetProps) {
        super(props)
        this.state = {
            data: null,
            binWidth: 'Day'
        }
    }

    static getDerivedStateFromProps(props: WidgetProps, currentState: State) {
        if (currentState.data != null && currentState.data.source === props.source)
            return null;

        return makeData(props.source, currentState.binWidth)
      }

    render() {
        if (this.state.data == null)
            return <p>Computing graph points from props</p>

        return <React.Fragment>
            <p>
                <select value={this.state.binWidth} onChange={(e) => {
                    // @ts-ignore
                    const binWidth: keyof typeof DURATION = e.target.value;
                    this.setState({binWidth, data: makeData(this.props.source, binWidth).data})
                }} style={{margin: '0 8px'}}>
                    {["Month", "Week", "Day"].map((k: string) => <option key={k} value={k}>{k}</option>)}
                </select>
            </p>
            <Plot 
                data={ this.state.data.plotdata }
                layout={{autosize: true, title: 'Reports Against Time', barmode: 'stack'}}
            />
        </React.Fragment>

    }
}