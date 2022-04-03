import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";
import React, { useState } from "react";
import { Mosaic, MosaicWindow } from 'react-mosaic-component';
import 'react-mosaic-component/react-mosaic-component.css';
import './App.css';
import SourceSelector from "./SourceSelectors";
import { CasesAgainstTime } from "./widgets/CasesAgainstTime";
import CountReports from "./widgets/CountReports";
import { HeatMap } from "./widgets/HeatMap";
import Widget, { WidgetProps } from "./widgets/Widget";

let count = 3;

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
}

function App() {
  const [source, setSource] = useState<TSource|null>(null);
  return (
    <div id="app">
      <Mosaic<string>
        resize={{}}
        renderTile={(id, path) => (
          <MosaicWindow<string> path={path} createNode={() => {
            const name = 'window' + (++count)
            titleMap[name] = name
            return name
          }} title={titleMap[id]}>
            {id == "SourceSelector" ? <SourceSelector setSource={setSource}/> : <Widget source={source} mosaic={{titleMap, id}} allWidgets={allWidgets}  />}
          </MosaicWindow>
        )}
        initialValue={{
          direction: 'row',
          first: 'SourceSelector',
          second: 'window0',
          splitPercentage: 20
        }}
      />
    </div>
  );
}

export default App;
