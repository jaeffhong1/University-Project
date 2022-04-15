import React from "react";
import Plot from "react-plotly.js";
import { TExternalSourceFieldType } from "../../sources/ExternalSource";

interface Props {
    axes: any[][]
}

export class GenericScatter extends React.Component<Props> {

    static supports(fields: { [fieldName: string]: TExternalSourceFieldType; }, axes: string[]): boolean {
        if (axes.length !== 2) 
            return false;
        const [xaxis, yaxis] = axes;
        return (fields[xaxis] == "number" || fields[xaxis] == "date") && (fields[yaxis] == "number")
    }

    render() {
        return <Plot
            data={[{ type: "scatter", x: this.props.axes[0], y: this.props.axes[1] }]}
            layout={{autosize: true}}
         />
    }

}