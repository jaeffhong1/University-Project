import React from "react";
import { IExternalSource, TExternalSources } from "../Dashboard/DashboardHome/sources/ExternalSource";

interface Props {
    userExternalSources: TExternalSources | null,
    externalSources: TExternalSources | null,
    setUserExternalSources: (s: {[name: string]: IExternalSource}) => void,
    setExternalSources: (s: {[name: string]: IExternalSource}) => void
}
interface State {}

export class Marketplace extends React.Component<Props, State> {
    
}