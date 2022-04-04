import React, { useState } from "react";
import { TReactComponent } from "../DashboardHome";

interface Props {
    setType: (type: string) => void;
    allWidgets: {[key: string]: TReactComponent }
}

export default function WidgetSelector(props: Props) {
    const [type, setType] = useState(Object.keys(props.allWidgets)[0]);
    return (
        <p style={{margin: '24px 12px'}}>
            <select value={type} onChange={(e) => setType(e.target.value)} style={{margin: '0 8px'}}>
                {Object.keys(props.allWidgets).map((k: string) => <option key={k} value={k}>{k}</option>)}
            </select>
            <button type="button" onClick={(e: React.MouseEvent) => {
                console.log("Select", type)
                props.setType(type)
            }}>Select</button>
        </p>
    )
}