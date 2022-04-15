import React from "react";
import Plot from "react-plotly.js";
import { WidgetProps } from "./Widget";

interface State {
    cache: {
        diseases: string[];
        counts: number[];
    } | null;
}
export class Tally extends React.Component<WidgetProps, State> {
    constructor(p: WidgetProps) {
        super(p);
        this.state = {
            cache: null,
        };
    }

    static getDerivedStateFromProps(props: WidgetProps, currentState: State) {
        const cache: { [disease: string]: number } = {};
        for (let report of props.source.reports) {
            for (let d of report.diseases) {
                if (!(d in cache)) cache[d] = 0;
                cache[d]++;
            }
        }
        const diseases = [];
        const counts = [];
        const keys = Object.keys(cache);
        keys.sort();
        for (let key of keys) {
            diseases.push(key);
            counts.push(cache[key]);
        }
        return { cache: { diseases, counts } };
    }

    render() {
        if (this.state.cache === null) return <p>Loading, please wait</p>;

        return (
            <Plot
                data={[
                    {
                        type: "bar",
                        x: this.state.cache.diseases,
                        y: this.state.cache.counts,
                    },
                ]}
                layout={{ autosize: true }}
            />
        );
    }
}
