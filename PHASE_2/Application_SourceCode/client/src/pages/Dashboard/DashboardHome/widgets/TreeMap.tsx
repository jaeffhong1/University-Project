import { Data } from "plotly.js";
import React from "react";
import Plot from "react-plotly.js";
import { TReport, TSource } from "../DashboardHome";
import "./plotly.css";
import { WidgetProps } from "./Widget";

const hardcoded_data: any[] = [
    {
        type: "treemap",
        ids: [
            "1COVID-19",
            "1Cough",
            "1Fever",
            "1Dengue",
            "2Cough",
            "2Fever",
            "1Botulism",
            "1Hantavirus",
            "1Rubella",
            "1Zika",
            "1Monkeypox",
            "1Listeriosis",
            "1Smallpox",
        ],
        labels: [
            "COVID-19",
            "Cough",
            "Fever",
            "Dengue",
            "Cough",
            "Botulism",
            "Hantavirus",
            "Rubella",
            "Zika",
            "Monkeypox",
            "Listeriosis",
            "Smallpox",
        ],
        parents: [
            "",
            "1COVID-19",
            "1COVID-19",
            "",
            "1Dengue",
            "1Dengue",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
        ],

        values: [
            12324, 10000, 2324, 6000, 1443, 0, 10, 2, 1231, 321, 1321, 1, 11,
        ],
        branchvalues: "total", // not remainder
    },
];

const layout: any = {
    autosize: true,
    title: "Disease Distribution TreeMap",
    showlegend: false,
    margin: {
        autoexpand: false,
        t: 50, // remove margin for title
        b: 5,
        l: 15,
        r: 15, // right margin
        pad: 4,
    },
};

interface State {
    data: Data[];
}

export class TreeMap extends React.Component<WidgetProps, State> {
    constructor(props: WidgetProps) {
        super(props);
        this.state = {
            data: [], // array of reports
        };
    }

    static getDerivedStateFromProps(props: WidgetProps, currentState: State) {
        let diseaseCounts: Map<string, number> = new Map<string, number>();

        for (let report of props.source.reports) {
            console.log(report.diseases);
            for (let disease of report.diseases) {
                let val: number | undefined = diseaseCounts.get(disease);
                if (typeof val == "undefined") {
                    diseaseCounts.set(disease, 1);
                } else {
                    diseaseCounts.set(disease, val + 1);
                }
            }
        }

        let values: number[] = Array.from(diseaseCounts.values());
        let parents: string[] = [];
        for (let value of values) {
            parents.push(""); // add the parent to global
        }

        let data: Data[] = [
            {
                type: "treemap",
                labels: Array.from(diseaseCounts.keys()),
                parents: parents,
                values: values,
                branchvalues: "total", // not remainder
            },
        ];

        //console.log(data);
        return {
            data: data,
        };
    }

    render() {
        let data: Data[];
        //data = hardcoded_data
        data = this.state.data;
        console.log(data);

        return (
            <React.Fragment>
                <Plot data={data} layout={layout} />
            </React.Fragment>
        );
    }
}
