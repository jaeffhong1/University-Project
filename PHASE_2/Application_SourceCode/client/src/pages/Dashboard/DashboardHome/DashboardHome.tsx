//import Plot from "react-plotly.js";
// mosaic
import "@blueprintjs/core/lib/css/blueprint.css";
import React, { useEffect, useState } from 'react';
//import "@blueprintjs/icons/lib/css/blueprint-icons.css";
import { Mosaic, MosaicNode, MosaicWindow } from 'react-mosaic-component';
import 'react-mosaic-component/react-mosaic-component.css';
// data
import DataStore from '../../../datastore';
import SourceAdaptorEpiWatch from "./sources/epiwatch";
import { TExternalSources } from "./sources/ExternalSource";
import SourceAdaptorf0b5, { parseDate } from "./sources/f0b5";
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
    diseases: string[],
    syndromes: string[],
    event_date: Date,
    location: {
      lat: number,
      long: number,
    }
  }
  
export type TSource = {
    meta: {
        start: Date,
        end: Date,
        dataSource: string
    },
    reports: TReport[]
}

const titleMap: Record<string, string> = {
    window0: "Select a widget",
    SourceSelector: "Source selector",
};
export type TReactComponent = typeof React.Component | ((p: WidgetProps) => JSX.Element)

const allWidgets: {[key: string]: TReactComponent } = {
  'Cases against time': CasesAgainstTime,
  'Count reports': CountReports,
  'Heat Map': HeatMap,
  'TreeMap': TreeMap,
  'Twitter': Twitter,
  'Tally': Tally,
  'GenericSelector': GenericSelector,
}

interface SourceAdaptor {
    fetch: (start: string, end: string, location: string, keyTerms: string) => Promise<TReport[]>
}

const sourceAdaptors: {[key: string]: SourceAdaptor} = {
    "f0b5": new SourceAdaptorf0b5(),
    "Epiwatch": new SourceAdaptorEpiWatch(),
}

// callback method to call when the DashboardHome's source should be updated
interface SourceSetter {
    (source: TSource): void
}

async function fetchSource(sourceName: string, startDate: string, endDate: string, location: string, keyTerms: string): Promise<TSource> {

    const reports = await sourceAdaptors[sourceName].fetch(startDate, endDate, location, keyTerms)
    
    const meta = {
        start: parseDate(startDate),
        end: parseDate(endDate),
        dataSource: sourceName
    }
    const source = {
        meta: meta,
        reports: reports.filter((report: TReport) => {
            if (!report.event_date)
                return false;
            if (report.event_date.valueOf() < meta.start.valueOf())
                return false;
            if (report.event_date.valueOf() > meta.end.valueOf())
                return false;
            return true;
        }),
    }

    // call the callback
    return source
}

function dateToString(date: Date): string {
    return `${date.getUTCFullYear()}-${String(date.getUTCMonth()).padStart(2, '0')}-${String(date.getUTCDate()).padStart(2, '0')}T00:00:00`;
}

const DashboardHome = (props: {datastore: DataStore, externalSources: TExternalSources}) => {

    const [source, setSource] = useState<TSource|null>(null)

    // choose what happens when the props have changed
    useEffect(() => {

        if (source == null 
         || props.datastore.GetDataSource() != source.meta.dataSource 
         || props.datastore.GetStartTime() != dateToString(source.meta.start)
         || props.datastore.GetEndTime() != dateToString(source.meta.end)) {

            // get the data source, times and reports
            const sourcePromise: Promise<TSource> = fetchSource(
                props.datastore.GetDataSource(), 
                props.datastore.GetStartTime(),
                props.datastore.GetEndTime(),
                "Sydney",
                "COVID-19,Fever,Cough,Dengue"
            );
            // set the source when we retrieve the values
            sourcePromise.then(value => {
                setSource(value);
            })
        }

        
    }, [props.datastore.GetDataSource(), props.datastore.GetStartTime(), props.datastore.GetEndTime()]);

    const val: MosaicNode<string> = {
        direction: 'row',
        first: 'window0',
        second: 'window1',
        splitPercentage: 80
    }
    const [mos, setMos] = useState(val)

    const titleMap: Record<string, string> = {
        window0: "Select a widget",
        window1: "Select a widget",
    };

    const [count, setCount] = useState(5);

    return (
        <main className='main' style={{ height: '100%'}}>
            <div id="mosaic" style={{height: '100%'}}>
                <Mosaic<string>
                    resize={{}}
                    onRelease={(newNode: MosaicNode<string> | null) => {
                        if (newNode !== null)
                            // @ts-ignore
                            setMos(newNode)
                        }
                    }
                    renderTile={(id, path) => (
                        <MosaicWindow<string> 
                            path={path} 
                            createNode={() => {
                                setCount(count + 1)
                                const name = 'window' + count.toString()
                                titleMap[name] = name
                                return name
                            }} 
                            title={titleMap[id]}
                        >
                            <Widget source={source} mosaic={{ titleMap, id }} allWidgets={allWidgets} externalSources={props.externalSources} />
                        </MosaicWindow>
                    )}
                    // @ts-ignore
                    initialValue={mos}
                />
            </div>
        </main>
    );
}

export default DashboardHome;