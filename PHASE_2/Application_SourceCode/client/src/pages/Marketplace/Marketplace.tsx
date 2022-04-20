import React from "react";
import { IExternalSource, TExternalSources } from "../Dashboard/DashboardHome/sources/ExternalSource";
import { AllExternalSourcesPage } from '../../pages/ExternalSourcesPage/AllExternalSourcesPage';
import { UserExternalSourcesPage } from '../../pages/ExternalSourcesPage/UserExternalSources';
import { Button, message, Space, Table, Collapse, Typography, Descriptions, List } from "antd";

const { Panel } = Collapse;
const { Title, Text } = Typography;

interface Props {
    userExternalSources: TExternalSources | null,
    externalSources: TExternalSources | null,
    setUserExternalSources: (s: {[name: string]: IExternalSource}) => void,
    setExternalSources: (s: {[name: string]: IExternalSource}) => void
}
interface State {}
//<UserExternalSourcesPage userExternalSources={this.props.userExternalSources} setUserExternalSources={this.props.setUserExternalSources.bind(this)}/>


export class Marketplace extends React.Component<Props, State> {
    componentDidMount() {
        let userData:any = localStorage.getItem('userExternalSources');
        if (userData == null) {
            userData = [];
        } else {
            userData = JSON.parse(userData);
        }
        localStorage.setItem('userExternalSources', JSON.stringify(userData));
        this.props.setUserExternalSources(userData);
    }
    render() {
        if (!this.props.userExternalSources)
            return <p>Loading external sources, please wait...</p>


        return <div style={{padding: '0.5em'}}>
            <UserExternalSourcesPage userExternalSources={this.props.userExternalSources} setUserExternalSources={this.props.setUserExternalSources.bind(this)}/>
            <AllExternalSourcesPage userExternalSources={this.props.userExternalSources} externalSources={this.props.externalSources} setExternalSources={this.props.setUserExternalSources.bind(this)}/> 
        </div>
    }
}