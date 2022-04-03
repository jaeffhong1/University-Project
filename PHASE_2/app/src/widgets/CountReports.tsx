import { WidgetProps } from "./Widget"


export default function CountReports(props: WidgetProps) {
    let c = 0;
    for (let art of props.source.articles) {
        c += art.reports.length;
    }
    return (
        <>
            <p>Report Count: {c}</p>
        </>
    )
}