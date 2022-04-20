//import Plot from "react-plotly.js";
// mosaic
import "@blueprintjs/core/lib/css/blueprint.css";
import React from 'react';
//import "@blueprintjs/icons/lib/css/blueprint-icons.css";
import { Mosaic, MosaicNode, MosaicWindow } from 'react-mosaic-component';
import 'react-mosaic-component/react-mosaic-component.css';
// data
import DataStore from '../../../datastore';
import SourceAdaptorEpiWatch from "./sources/epiwatch";
import { TExternalSources, IExternalSource } from "./sources/ExternalSource";
import SourceAdaptorf0b5, { parseDate } from "./sources/f0b5";
import SourceAdaptorIHeartTeams from "./sources/iheartteams";
// widgets
//import SourceSelector from "./SourceSelectors";
import { CasesAgainstTime } from './widgets/CasesAgainstTime';
import CountReports from './widgets/CountReports';
import { GenericSelector } from "./widgets/GenericsSelector";
import { HeatMap } from './widgets/HeatMap';
import { Tally } from './widgets/Tally';
import { TreeMap } from './widgets/TreeMap';
import Twitter from './widgets/Twitter';
import Widget, { WidgetProps } from "./widgets/Widget";

export type TReport = {
    diseases: string[];
    syndromes: string[];
    event_date: Date;
    location: {
        lat: number;
        long: number;
    };
};

export type TSource = {
    meta: {
        start: Date;
        end: Date;
        /* name of the source */
        dataSource: string;
    };
    reports: TReport[];
};

export type TSources = {[name: string]: TSource};

export type TReactComponent =
    | typeof React.Component
    | ((p: WidgetProps) => JSX.Element);

const allWidgets: { [key: string]: TReactComponent } = {
    "Cases against time": CasesAgainstTime,
    "Count reports": CountReports,
    "Heat Map": HeatMap,
    "Tree Map": TreeMap,
    Twitter: Twitter,
    Tally: Tally,
    'Generic Selector': GenericSelector,
};

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
    Epiwatch: new SourceAdaptorEpiWatch(),
    IHeartTeams: new SourceAdaptorIHeartTeams(),
};

export async function fetchSource(
    sourceName: string,
    startDate: string,
    endDate: string,
    location: string,
    keyTerms: string
): Promise<TSource> {
    const reports = await sourceAdaptors[sourceName].fetch(
        startDate,
        endDate,
        location,
        keyTerms
    );

    const meta = {
        start: parseDate(startDate),
        end: parseDate(endDate),
        dataSource: sourceName,
    };
    const source = {
        meta: meta,
        reports: reports.filter((report: TReport) => {
            if (!report.event_date) return false;
            if (report.event_date.valueOf() < meta.start.valueOf())
                return false;
            if (report.event_date.valueOf() > meta.end.valueOf()) return false;
            return true;
        }),
    };

    // call the callback
    return source;
}

export function dateToString(date: Date): string {
    return `${date.getUTCFullYear()}-${String(date.getUTCMonth()).padStart(
        2,
        "0"
    )}-${String(date.getUTCDate()).padStart(2, "0")}T00:00:00`;
}

const titleMap: Record<string, string> = {
    window0: "Select a widget",
    SourceSelector: "Source selector",
};

interface Props {
    datastore: DataStore;
    externalSources: TExternalSources | null;
    setExternalSources: (s: {[name: string]: IExternalSource}) => void;
}
interface State {
    source: TSource | null;
    mos: MosaicNode<string>;
    windowCount: number;
}

export default class DashboardHome extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {
            source: null,
            mos: {
                direction: "row",
                first: "window0",
                second: "window1",
                splitPercentage: 80,
            },
            windowCount: 2,
        }
    }

    componentDidUpdate() {
        console.log('fetch sources if needed')
        if (
            this.state.source == null ||
            this.props.datastore.GetDataSource() != this.state.source.meta.dataSource ||
            this.props.datastore.GetStartTime() != dateToString(this.state.source.meta.start) ||
            this.props.datastore.GetEndTime() != dateToString(this.state.source.meta.end)
        ) {
            console.log("fetching new source");
            // get the data source, times and reports
            const sourcePromise: Promise<TSource> = fetchSource(
                this.props.datastore.GetDataSource(),
                this.props.datastore.GetStartTime(),
                this.props.datastore.GetEndTime(),
                "Sydney",
                "COVID-19,Fever,Cough,Dengue"
            );
            // set the source when we retrieve the values
            sourcePromise.then((value) => {
                console.log("========= source obtained")
                this.setState({
                    source: value
                })
            });
        }
    }

    componentDidMount() {
        //this.fetchSourcesIfNeeded()
    }

    render() {

        if (this.props.externalSources == null)
            return <p>Loading external sources, please wait</p>

        return (
            <main className="widgetWindow" style={{ height: "100%", border: '1px solid rgb(235, 237, 240)' }}>
                <div id="mosaic" style={{ height: "100%" }}>
                    <Mosaic<string>
                        resize={{}}
                        // onRelease={(newNode: MosaicNode<string> | null) => {
                        //     if (newNode !== null)
                        //         // @ts-ignore
                        //         setMos(newNode);
                        // }}
                        renderTile={(id, path) => {
                            if (this.props.externalSources == null)
                                throw new Error("null sources")
                                
                            return <MosaicWindow<string>
                                path={path}
                                createNode={(id, path) => {
                                    const name = "window" + this.state.windowCount.toString();
                                    this.setState({
                                        windowCount: this.state.windowCount + 1
                                    })
                                    titleMap[name] = name;
                                    return name;
                                }}
                                title={titleMap[id]}
                            >
                                <Widget
                                    globalSource={this.state.source}
                                    sourceAdaptors={sourceAdaptors}
                                    mosaic={{ titleMap, id }}
                                    allWidgets={allWidgets}
                                    externalSources={this.props.externalSources}
                                    setExternalSources={this.props.setExternalSources}
                                />
                            </MosaicWindow>
                        }}
                        initialValue={this.state.mos}
                        onRelease={(mos: MosaicNode<string> | null) => {
                            if (mos)
                                this.setState({mos})
                        }}
                    />
                </div>
            </main>
        );
    }
}
