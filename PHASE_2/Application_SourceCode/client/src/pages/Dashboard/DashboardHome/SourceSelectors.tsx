import React from "react";
import { TReport, TSource } from "./DashboardHome";
import SourceAdaptorEpiWatch from "./sources/epiwatch";
import SourceAdaptorf0b5, { parseDate } from "./sources/f0b5";
import "./SourceSelector.css";

interface Props {
    setSource: (s: TSource) => void;
}

export interface SourceAdaptor {
    fetch: (
        start: string,
        end: string,
        location: string,
        keyTerms: string
    ) => Promise<TReport[]>;
}

const sourceAdaptors: { [key: string]: SourceAdaptor } = {
    f0b5: new SourceAdaptorf0b5(),
    epiwatch: new SourceAdaptorEpiWatch(),
};

interface State {
    startDate: string;
    endDate: string;
    sourceName: keyof typeof sourceAdaptors;
}

export default class SourceSelector extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        const today = new Date();
        this.state = {
            startDate: "2022-01-01",
            endDate: `${today.getUTCFullYear()}-${String(
                today.getUTCMonth()
            ).padStart(2, "0")}-${String(today.getUTCDate()).padStart(2, "0")}`,
            sourceName: "f0b5",
        };
    }

    async fetchSource() {
        const start = this.state.startDate + "Txx:xx:xx";
        const end = this.state.endDate + "Txx:xx:xx";
        const location = "Sydney";
        const keyTerms = "COVID-19,Fever,Cough,Dengue";

        const reports = await sourceAdaptors[this.state.sourceName].fetch(
            start,
            end,
            location,
            keyTerms
        );

        const meta = {
            start: parseDate(start),
            end: parseDate(end),
        };
        const source = {
            meta: meta,
            reports: reports.filter((report: TReport) => {
                if (!report.event_date) return false;
                if (report.event_date.valueOf() < meta.start.valueOf())
                    return false;
                if (report.event_date.valueOf() > meta.end.valueOf())
                    return false;
                return true;
            }),
        };
        // console.group('reports.length', source.reports.length)
        // console.log(source.reports)
        // console.log(reports)
        // console.groupEnd()
        //this.props.setSource(source)
    }

    componentDidMount() {
        this.fetchSource();
    }

    render() {
        return (
            <>
                <form
                    action="#"
                    onSubmit={(e) => e.preventDefault()}
                    className="source-selector"
                >
                    <div
                        onChange={(e) =>
                            // @ts-ignore
                            this.setState({ sourceName: e.target.value })
                        }
                    >
                        <div>
                            <input
                                type="radio"
                                id="source-f0b5"
                                value="f0b5"
                                name="source"
                            />
                            <label htmlFor="source-f0b5" defaultChecked={true}>
                                f0b5
                            </label>
                            <blockquote>
                                Source:{" "}
                                <a href="https://www.cidrap.umn.edu/">
                                    www.cidrap.umn.edu
                                </a>
                            </blockquote>
                        </div>
                        <div>
                            <input
                                type="radio"
                                id="source-epiwatch"
                                value="epiwatch"
                                name="source"
                            />
                            <label htmlFor="source-epiwatch">EpiWatch</label>
                            <blockquote>
                                Source:{" "}
                                <a href="https://www.epiwatch.org/">EpiWatch</a>
                            </blockquote>
                        </div>
                    </div>
                    <p>
                        From:
                        <input
                            className="sourceSelectorInput"
                            type="date"
                            value={this.state.startDate}
                            onChange={(e) =>
                                this.setState({ startDate: e.target.value })
                            }
                        />
                        <input
                            className="sourceSelectorInput"
                            type="time"
                            defaultValue="00:00:00"
                        />
                    </p>
                    <p>
                        To:
                        <input
                            className="sourceSelectorInput"
                            type="date"
                            value={this.state.endDate}
                            onChange={(e) =>
                                this.setState({ endDate: e.target.value })
                            }
                        />
                        <input
                            className="sourceSelectorInput"
                            type="time"
                            defaultValue="00:00:00"
                        />
                    </p>
                    <p>
                        <button onClick={() => this.fetchSource()}>
                            Fetch
                        </button>
                    </p>
                </form>
            </>
        );
    }
}
