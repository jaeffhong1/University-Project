import { TSource } from "../../../../App";

interface Props {
    source: TSource
}

export default function CountReports(props: Props) {
    return (
        <p>Article Count: {props.source.length}</p>
    )
}