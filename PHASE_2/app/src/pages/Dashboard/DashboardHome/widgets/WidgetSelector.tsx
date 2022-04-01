import { useState } from "react";

interface Props {
    setType: (type: string) => void;
}

export default function WidgetSelector(props: Props) {
    const [type, setType] = useState("CountReports");
    return (
        <p style={{margin: '24px 12px'}}>
            <select value={type} onChange={(e) => setType(e.target.value)} style={{margin: '0 8px'}}>
                <option value="CountReports">Count Reports</option>
            </select>
            <button type="button" onClick={() => {
                console.log({type})
                props.setType(type)
            }}>Select</button>
        </p>
    )
}