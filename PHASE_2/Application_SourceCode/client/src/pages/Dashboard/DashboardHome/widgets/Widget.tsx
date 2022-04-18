
import { useState } from "react";
import { TReactComponent, TSource } from "../DashboardHome";
import WidgetSelector from "./WidgetSelector";
import HiddenWidget from './HiddenWidget';

interface Props {
    mosaic: {
        id: string,
        titleMap: Record<string, string>
    },
    source: TSource | null,
    allWidgets: {[key: string]: TReactComponent },
    initialWidgetType: string
}

export interface WidgetProps {
    source: TSource;
}

export default function Widget(props: Props): JSX.Element {
    // initialise the widget type
    const [widgetType, setWidgetType] = useState(props.initialWidgetType);

    if (widgetType === "WidgetSelector") {
        return <WidgetSelector setType={setWidgetType} allWidgets={props.allWidgets} />
    } else if (widgetType === "HiddenWidget") {
        return <HiddenWidget></HiddenWidget>
    } else if (props.source == null) {
        return <p>Loading sources, please wait...</p>
    } else {
        const T = props.allWidgets[widgetType];
        if (T === undefined) {
            return <p>Unknown widget type <code>{widgetType}</code></p>
        }
        return <T source={props.source} />
    }
}