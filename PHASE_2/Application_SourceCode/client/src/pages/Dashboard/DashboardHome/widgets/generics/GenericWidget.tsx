import { TExternalSourceFieldType } from "../../sources/ExternalSource";

export interface GenericWidgetProps {
    axes: any[][];
    axisNames: string[];
}
export interface GenericWidget {
    /**
     * Takes a list of fields to plot, and returns whether this widget can plot them
     *
     * fields.length = number of dimensions of the plot
     * look at scatter plot for an example
     */
    supports(
        fields: { [fieldName: string]: TExternalSourceFieldType },
        axis: string[]
    ): boolean;
}
