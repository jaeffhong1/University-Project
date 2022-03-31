import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";
import { Mosaic, MosaicWindow } from 'react-mosaic-component';
import 'react-mosaic-component/react-mosaic-component.css';
import './App.css';
import SourceSelector from "./SourceSelectors";
import Widget from "./widgets/Widget";

let count = 0;

export type TReport = {
  diseases: string[],
  syndromes: string[],
  event_date: string,
  // event_date_obj: Date,
  locations: string[],
}

export type TSource = {
  url: string,
  date_of_publication: string,
  // date_of_publication_obj: Date,
  headline: string,
  main_text: string,
  reports: TReport[]
}[]

const titleMap: Record<string, string> = {
  window0: "Select a widget",
  SourceSelector: "Source selector",
};

const source: TSource = []

function App() {
  return (
    <div id="app">
      <Mosaic<string>
        resize={{

        }}
        renderTile={(id, path) => (
          <MosaicWindow<string> path={path} createNode={() => {
            const name = 'window' + (++count)
            titleMap[name] = name
            return name
          }} title={titleMap[id]}>
            {id == "SourceSelector" ? <SourceSelector /> : <Widget source={source} mosaic={{titleMap, id}} />}
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
