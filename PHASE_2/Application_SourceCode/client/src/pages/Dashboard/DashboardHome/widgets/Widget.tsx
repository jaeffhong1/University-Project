import { useState } from "react";
import { TReactComponent, TSource } from "../DashboardHome";
import { TExternalSources } from "../sources/ExternalSource";
import WidgetSelector from "./WidgetSelector";
import Datastore from "../../../../datastore";

interface Props {
    mosaic: {
        id: string;
        titleMap: Record<string, string>;
    },
    source: TSource | null,
    externalSources: TExternalSources,
    allWidgets: { [key: string]: TReactComponent },
}

export interface WidgetProps {
    allWidgets: { [key: string]: TReactComponent };
    source: TSource;
    externalSources: TExternalSources;
}

export default function Widget(props: Props): JSX.Element {
    const [type, setType] = useState("select");
    if (type === "select") {
        return (
            <WidgetSelector setType={setType} allWidgets={props.allWidgets} />
        );
    } else if (props.source == null) {
        return <p>Loading sources, please wait...</p>;
    } else {
        const T = props.allWidgets[type];
        if (T === undefined) {
            return (
                <p>
                    Unknown widget type <code>{type}</code>
                </p>
            );
        }
        return (
            <T
                source={props.source}
                externalSources={props.externalSources}
                allWidgets={props.allWidgets}
            />
        );
    }
}