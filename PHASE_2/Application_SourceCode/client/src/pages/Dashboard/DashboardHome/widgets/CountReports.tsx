import { WidgetProps } from "./Widget";

export default function CountReports(props: WidgetProps) {
    return (
        <>
            <p>Report Count: {props.source.reports.length}</p>
        </>
    );
}
