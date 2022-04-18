import React from "react";
import Plot from "react-plotly.js";
import { TExternalSourceFieldType } from "../../sources/ExternalSource";
import { GenericWidgetProps } from "./GenericWidget";


export class GenericHistogram extends React.Component<GenericWidgetProps> {
    static supports(
        fields: { [fieldName: string]: TExternalSourceFieldType },
        axes: string[]
    ): boolean {
        console.log(axes.length, '1')
        return axes.length >= 1;
    }

    render() {
        return (
            <Plot
                // data={[ { type: "histogram", x: this.props.axes[0], }, ]}
                data={this.props.axes.map((ax, i) => {
                    return { type: "histogram", x: ax, histnorm: 'probability', name: this.props.axisNames[i] }
                })}
                layout={{
                    autosize: true,
                    xaxis: { title: 'counts' },
                    yaxis: { title: 'probabilty' },
                }}
            />
        );
    }
}
