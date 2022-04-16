import React from "react";
import Plot from "react-plotly.js";
import CacheSystem from "../CacheSystem";
import { TSource } from "../DashboardHome";
import "./plotly.css";

interface Props {
    source: TSource;
}
interface State {
    counts: any;
}

type Counts = any;

async function getCounts(): Promise<Counts> {
    const url = new URL(
        "http://seng3011.duckdns.org:8086/front-end/twitter-counts"
    );
    url.searchParams.append("query", "sick OR tired");
    url.searchParams.append("granularity", "day");
    const data = await CacheSystem.fetch(
        "twitter-counts-02",
        url.toString(),
        {}
    );
    if (typeof data !== "string") {
        console.error(data);
        throw new Error();
    }
    const x = [];
    const y = [];
    for (let item of JSON.parse(data).data) {
        x.push(item.start);
        y.push(item.tweet_count);
    }
    return { x, y };
}

export default class Twitter extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            counts: {
                x: [],
                y: [],
            },
        };
    }

    componentDidMount() {
        console.log("foobar");
        getCounts().then((c) => {
            console.log("yo", c);
            this.setState({ ...this.state, counts: c });
        });
    }

    render() {
        // return <p><code>{JSON.stringify(this.state)}</code></p>
        return (
            <Plot
                data={[
                    {
                        x: this.state.counts.x,
                        y: this.state.counts.y,
                        type: "bar",
                        mode: "lines+markers",
                    },
                ]}
                layout={{
                    autosize: true,
                    title: "Twitter counting sick OR tired",
                }}
            />
        );
    }
}
