import React, { useEffect } from "react";
import { TReactComponent } from "../DashboardHome";

interface Props {}

export default function HiddenWidget(props: Props) {
    return (
        <div style={{display: 'none'}}></div>
    )
}