import React from "react";
import Plot from "react-plotly.js";
import { TExternalSourceFieldType } from "../../sources/ExternalSource";
import { GenericWidgetProps } from "./GenericWidget";

export class GenericBoxPlot extends React.Component<GenericWidgetProps> {
    static supports(
        fields: { [fieldName: string]: TExternalSourceFieldType },
        axes: string[]
    ): boolean {
        return axes.length >= 1;
    }

    render() {
        return (
            <Plot
                data={this.props.axes.map((ax, i) => {
                    return { type: "box", y: ax, name: this.props.axisNames[i], boxpoints: 'outliers' }
                })}
                layout={{
                    autosize: true,
                    xaxis: { title: this.props.axisNames[0] },
                    yaxis: { title: this.props.axisNames[1] },
                }}
            />
        );
    }
}