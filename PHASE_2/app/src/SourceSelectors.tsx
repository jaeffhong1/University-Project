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
            this.props.setSource(source)
        })
    }

    render() {
        return <p>Selected source for you</p>
    }
}