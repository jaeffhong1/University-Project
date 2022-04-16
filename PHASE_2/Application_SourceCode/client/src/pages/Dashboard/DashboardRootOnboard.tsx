import { LaptopOutlined, NotificationOutlined, UserOutlined } from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import { Steps } from 'intro.js-react';
import React from 'react';
import { Link } from 'react-router-dom';
import DashboardHeader from '../../components/DashboardHeader';
import DataStore from '../../datastore';
import './dashboard.css';
import DashboardHome from './DashboardHome/DashboardHome';
import { TExternalSources } from './DashboardHome/sources/ExternalSource';





// extract styled components from import 
const { SubMenu } = Menu;
const { Content, Sider } = Layout;

interface IProps {
    datastore: DataStore
    externalSources: TExternalSources | null;
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
                    element: ".Dashboard",
                    intro: "Click here to create a new dashboard"
                },
                {
                    element: ".date_picker",
                    intro: "Click this to select from a date range"
                },
                {
                    element: ".key_terms",
                    intro: "Click this to search for key terms"
                },
                {
                    element: ".ant-btn.ant-btn-default.ant-btn-icon-only.ant-dropdown-trigger",
                    intro: "Click this to select from a drop-down-list of data sources"
                },
                {
                    element: ".widgetWindow",
                    intro: "This section shows you all your widgets"
                },
                {
                    element: ".widgetWindow",
                    intro: "When you change the date range, key terms or data source, all the widgets will automatically update"
                },
                {
                    element: ".mosaic-window-toolbar.draggable",
                    intro: "These widgets are draggable by dragging your mouse on this part"
                },
                {
                    element: ".mosaic-default-control.bp4-button.bp4-minimal.split-button.bp4-icon-add-column-right",
                    intro: "Multiple widget windows can be created with this button"
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
        if (!this.props.externalSources)
            <p>Loading external sources, please wait</p>

        return (
            <main className='main'>
                <Steps
                    enabled={this.state.stepsEnabled}
                    steps={this.state.steps}
                    initialStep={this.state.initialStep}
                    options={{
                        showProgress: true,
                        disableInteraction: true,
                        showBullets: false,
                        exitOnOverlayClick: false,
                        doneLabel: "Finish"
                    }}
                    onExit={this.onExit}
                />
                <Layout className="site-layout-background" style={{ padding: 0, background: 'white' }}>
                    <Sider className="site-layout-background" width={200}>
                        <Menu
                            mode="inline"
                            style={{height: '100%'}}
                            selectedKeys={['DashboardHome']}//[this.getCurrentPage()]}
                        >
                            <Menu.Item className="Dashboard" key="dashboard" style={{marginTop: 0}}><Link to="/dashboard">Dashboard Brief</Link></Menu.Item>
                            <SubMenu key="sub1" icon={<UserOutlined />} title="Disease Cases">
                                <Menu.Item key="diseases"><Link to="/dashboard/disease-cases/diseases">Diseases</Link></Menu.Item>
                                <Menu.Item key="syndromes">Syndromes</Menu.Item>
                            </SubMenu>
                            <SubMenu key="sub2" icon={<LaptopOutlined />} title="Countries">
                                <Menu.Item key="4">Current disease cases</Menu.Item>
                                <Menu.Item key="5">Case timeline</Menu.Item>
                            </SubMenu>
                            <SubMenu key="sub3" icon={<NotificationOutlined />} title="Another Field">
                                <Menu.Item key="6">option9</Menu.Item>
                                <Menu.Item key="7">option10</Menu.Item>
                                <Menu.Item key="8">option11</Menu.Item>
                                <Menu.Item key="9">option12</Menu.Item>
                            </SubMenu>
                            <SubMenu key="sub4" icon={<LaptopOutlined />} title="MarketPlace">
                                <Menu.Item key="upload"><Link to="/dashboard/market-place/upload">Upload Dashboards</Link></Menu.Item>
                                <Menu.Item key="browse"><Link to="/dashboard/market-place/browse">Browse Dashboards</Link></Menu.Item>
                            </SubMenu>
                        </Menu>
                    </Sider>

                    <Content>
                        <DashboardHeader datastore={this.props.datastore} />
                        <DashboardHome datastore={this.props.datastore} externalSources={this.props.externalSources} />
                    </Content>
                </Layout>
            </main>
        );
    }
}