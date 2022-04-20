import { WidgetProps } from "./Widget";
import { useEffect } from "react";


export default function CountReports(props: WidgetProps) {

    console.log(props.source.meta.dataSource);

    return (
        <>
            <p>Report Count: {props.source.reports.length}</p>
        </>
    );
}
