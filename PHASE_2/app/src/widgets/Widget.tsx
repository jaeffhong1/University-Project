
import { useState } from "react";
import { TReactComponent, TSource } from "../App";
import WidgetSelector from "./WidgetSelector";

interface Props {
    mosaic: {
        id: string,
        titleMap: Record<string, string>
    },
    source: TSource | null,
    allWidgets: {[key: string]: TReactComponent }
}

export interface WidgetProps {
    source: TSource;
}

export default function Widget(props: Props): JSX.Element {
    const [type, setType] = useState("select");
    if (type === "select") {
        return <WidgetSelector setType={setType} allWidgets={props.allWidgets} />
    } else if (props.source == null) {
        return <p>Loading sources, please wait...</p>
    } else {
        const T = props.allWidgets[type];
        if (T === undefined) {
            return <p>Unknown widget type <code>{type}</code></p>
        }
        return <T source={props.source} />
    }
}