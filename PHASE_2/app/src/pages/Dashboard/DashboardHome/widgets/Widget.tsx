
import { useState } from "react";
import { TSource } from "../../../../App";
import CountReports from "./CountReports";
import WidgetSelector from "./WidgetSelector";

interface Props {
    mosaic: {
        id: string,
        titleMap: Record<string, string>
    },
    source: TSource,
}

export default function Widget(props: Props): JSX.Element {
    const [type, setType] = useState("select");
    if (type === "select") {
        return <WidgetSelector setType={setType} />
    } else if (type === "CountReports") {
        return <CountReports source={props.source} />
    } else {
        return <p>Unknown widget type <code>{type}</code></p>
    }
}