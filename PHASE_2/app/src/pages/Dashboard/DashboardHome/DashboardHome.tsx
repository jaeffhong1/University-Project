import { useState } from 'react';
import { useLocation } from "react-router-dom";

import { Row, Col, Divider } from 'antd';
import { Card } from 'antd';
import { Progress } from 'antd';

//import Plot from "react-plotly.js";

// mosaic
//import "@blueprintjs/core/lib/css/blueprint.css";
//import "@blueprintjs/icons/lib/css/blueprint-icons.css";
import { Mosaic, MosaicWindow } from 'react-mosaic-component';
//import 'react-mosaic-component/react-mosaic-component.css';

// widgets
import SourceSelector from "./SourceSelectors";
import Widget from "./widgets/Widget";

import { TSource } from "../../../App";

interface Props {
    source: TSource;
}

const DashboardHome = (props: Props) => {
//export default function DashboardHome() {

    const titleMap: Record<string, string> = {
        window0: "Select a widget",
        SourceSelector: "Source selector",
    };

    const [count, setCount] = useState(0);

    type ViewId = 'a' | 'b' | 'c' | 'new';

    const TITLE_MAP: Record<ViewId, string> = {
        a: 'Left Window',
        b: 'Top Right Window',
        c: 'Bottom Right Window',
        new: 'New Window',
    };

    return (
        <main className='main' style={{ height: '100%'}}>
            <div id="mosaic" style={{height: '100%'}}>
                <Mosaic<string>
                    renderTile={(id, path) => (
                        <MosaicWindow<string> 
                            path={path} 
                            createNode={() => {
                                const name = 'window' + count;
                                setCount(count + 1);
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