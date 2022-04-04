//import Plot from "react-plotly.js";
// mosaic
//import "@blueprintjs/core/lib/css/blueprint.css";
//import "@blueprintjs/icons/lib/css/blueprint-icons.css";
import { Mosaic, MosaicWindow } from 'react-mosaic-component';
import { TSource } from "../../../App";
//import 'react-mosaic-component/react-mosaic-component.css';
// widgets
import SourceSelector from "./SourceSelectors";
import Widget from "./widgets/Widget";




interface Props {
    source: TSource;
}

const DashboardHome = (props: Props) => {
//export default function DashboardHome() {

    let _count = 0;

    const titleMap: Record<string, string> = {
        window0: "Select a widget",
        SourceSelector: "Source selector",
    };

    // const [count, setCount] = useState(10);

    return (
        <main className='main' style={{ height: '100%'}}>
            <div id="mosaic" style={{height: '100%'}}>
                <Mosaic<string>
                    renderTile={(id, path) => (
                        <MosaicWindow<string> 
                            path={path} 
                            createNode={() => {
                                const name = 'window' + (++_count);
                                
                                titleMap[name] = name;
                                return name;
                            }} 
                            title={titleMap[id]}
                        >
                            {id == "SourceSelector" ? <SourceSelector /> : <Widget source={props.source} mosaic={{titleMap, id}} />}
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
        </main>
    );
}

export default DashboardHome;