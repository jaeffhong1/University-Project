import { LaptopOutlined, NotificationOutlined, UserOutlined } from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import { Steps } from 'intro.js-react';
import React from 'react';
import { Outlet } from 'react-router-dom';
import DashboardHeader from '../../components/DashboardHeader';

import DataStore from '../../datastore';
import './dashboard.css';
import DashboardHome from './DashboardHome/DashboardHome';
import { TExternalSources, IExternalSource } from './DashboardHome/sources/ExternalSource';



// extract styled components from import 
const { SubMenu } = Menu;
const { Content, Sider } = Layout;

interface IProps {
    datastore: DataStore
    externalSources: TExternalSources | null;
    setExternalSources: (s: {[name: string]: IExternalSource}) => void;
}

interface IState {
    stepsEnabled: boolean,
    initialStep: number,
    hintsEnabled: boolean,
    steps: {element: string, intro: string}[],
    hints: {element: string, hint: string, hintPosition: string}[]
}

export default class DashboardRootOnboard extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);
        this.state = {
            stepsEnabled: true,
            initialStep: 0,
            steps: [
                {
                    element: ".userDashboard",
                    intro: "Click here to create a new dashboard."
                },
                {
                    element: ".date_picker",
                    intro: "Click this to select from a date range."
                },
                {
                    element: ".ant-btn.ant-btn-default.ant-btn-icon-only.ant-dropdown-trigger",
                    intro: "Click this to select from a drop-down-list of data sources."
                },
                {
                    element: ".widgetWindow",
                    intro: "This section shows you all your widgets."
                },
                {
                    element: ".widgetWindow",
                    intro: "When you change the date range or data source, all the widgets will automatically update."
                },
                {
                    element: ".mosaic-window-toolbar.draggable",
                    intro: "These widgets are draggable by dragging your mouse on this section."
                },
                {
                    element: ".mosaic-default-control.bp4-button.bp4-minimal.split-button.bp4-icon-add-column-right",
                    intro: "Multiple widget windows can be created with this button."
                },
                {
                    element: ".ant-row",
                    intro: "There are currently 6 available widgets that can be created. Have fun."
                }
            ],
            hintsEnabled: false,
            hints: [
                {
                    element: ".site-layout-background",
                    hint: "Hello testing",
                    hintPosition: "middle-right"
                }
            ]
        };
    }

    onExit = () => {
        this.setState(() => ({ stepsEnabled: false }));
        window.location.href = "/";
    };

    toggleSteps = () => {
        this.setState((prevState) => ({ stepsEnabled: !prevState.stepsEnabled }));
    };


    public render() {

        return (
            <main className='main'>
                <Steps
                    enabled={this.state.stepsEnabled}
                    steps={this.state.steps}
                    initialStep={this.state.initialStep}
                    options={{
                        showProgress: true,
                        disableInteraction: false,
                        showBullets: false,
                        exitOnOverlayClick: false,
                        doneLabel: "Finish"
                    }}
                    onExit={this.onExit}
                />
                <Layout className="site-layout-background" style={{ padding: 0, background: 'white' }}>
                    <Sider className="site-layout-background" width={0}>
                    </Sider>

                    <Content>
                        <DashboardHeader datastore={this.props.datastore} />
                        <div style={{ minHeight: 280 }}>
                            <Outlet />
                            <DashboardHome datastore={this.props.datastore} externalSources={this.props.externalSources} setExternalSources={this.props.setExternalSources.bind(this)}/>
                        </div>
                    </Content>
                </Layout>
            </main>
        );
    }
}