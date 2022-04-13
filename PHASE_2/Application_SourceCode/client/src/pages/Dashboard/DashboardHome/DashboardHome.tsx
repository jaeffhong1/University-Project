//import Plot from "react-plotly.js";
// mosaic
//import "@blueprintjs/core/lib/css/blueprint.css";
//import "@blueprintjs/icons/lib/css/blueprint-icons.css";
import React, { useState } from 'react';
import { Mosaic, MosaicNode, MosaicWindow } from 'react-mosaic-component';
//import 'react-mosaic-component/react-mosaic-component.css';
// widgets
import SourceSelector from "./SourceSelectors";
import { CasesAgainstTime } from './widgets/CasesAgainstTime';
import CountReports from './widgets/CountReports';
import { HeatMap } from './widgets/HeatMap';
import { TreeMap } from './widgets/TreeMap';
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
}

const DashboardHome = (props: {}) => {
//export default function DashboardHome() {

    let count = 10;
    const [source, setSource] = useState<TSource|null>(null);
    const val: MosaicNode<string> = {
            direction: 'row',
            first: 'SourceSelector',
            second: 'window0',
            splitPercentage: 20
        }
    const [mos, setMos] = useState(val)

    const titleMap: Record<string, string> = {
        window0: "Select a widget",
        SourceSelector: "Source selector",
    };

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
                    <MosaicWindow<string> path={path} createNode={() => {
                        const name = 'window' + (++count)
                        titleMap[name] = name
                        return name
                    }} title={titleMap[id]}>
                        {id == "SourceSelector" ? <SourceSelector setSource={setSource}/> : <Widget source={source} mosaic={{titleMap, id}} allWidgets={allWidgets}  />}
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