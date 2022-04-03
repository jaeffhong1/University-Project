import React from "react";
import Plot from "react-plotly.js";
import { WidgetProps } from "./Widget";

interface State {
    data: {
        lon: number[],
        lat: number[],
        z: number[] // magnitudes
    } | null;
}
export class HeatMap extends React.Component<WidgetProps, State> {
    constructor(p: WidgetProps) {
        super(p)
        this.state = {
            data: {
                lon: [],
                lat: [],
                z: [],
            }
        }

    }

    static getDerivedStateFromProps(props: WidgetProps, currentState: State) {
        const lon = []
        const lat = []
        const z = []
        for (let article of props.source.articles) {
            for (let report of article.reports) {
                if (!report.event_date_obj)
                    continue
                    
                // @ts-ignore
                lon.push(report.report_location.long)
                // @ts-ignore
                lat.push(report.report_location.lat)
                z.push(1)
            }
        }
        return {
            data: {lon, lat, z}
        }
    }

    render() {
        return <Plot
            data={[{type: "densitymapbox", hoverinfo: 'skip', ...this.state.data}]}
            layout={{autosize: true, mapbox: {style: "outdoors"}}}
            config={{mapboxAccessToken: "pk.eyJ1IjoibWF0aDIwMDEiLCJhIjoiY2wxaXVwNmJjMGRuYjNkbjFnOWV6NDgzYSJ9.W74ZnmyRdpYXMR12Sr0qQQ"}}
         />
    }
}