import React from "react";
import { WidgetProps } from "./Widget";


export class CasesAgainstTime extends React.Component<WidgetProps> {

    render() {
        return <pre><code>Source={JSON.stringify(this.props.source)}</code></pre>
    }
}