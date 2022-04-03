import { WidgetProps } from "./Widget"


export default function CountReports(props: WidgetProps) {
    return (
        <>
            <p>Article Count: {props.source.articles.length}</p>
        </>
    )
}