import React from 'react';
import { Routes, Route, Link, Outlet, useLocation } from 'react-router-dom';

import { Layout, Menu, Breadcrumb } from 'antd';
import { UserOutlined, LaptopOutlined, NotificationOutlined } from '@ant-design/icons';

import './dashboard.css';
import DashboardHeader from '../../components/DashboardHeader';
import Browse from '../../pages/Dashboard/MarketPlace/Browse/browseDashboardsOnboard';

import DataStore from '../../datastore';

import { Steps } from 'intro.js-react'

// extract styled components from import 
const { SubMenu } = Menu;
const { Content, Sider } = Layout;

interface IProps {
    datastore: DataStore
}

interface IState {
    stepsEnabled: boolean,
    initialStep: number,
    hintsEnabled: boolean,
    steps: {element: string, intro: string}[],
    hints: {element: string, hint: string, hintPosition: string}[]
}

export default class MarketPlaceOnboardBrowse extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);
        this.state = {
            stepsEnabled: true,
            initialStep: 0,
            steps: [
                {
                    element: ".MarketBrowse",
                    intro: "Your newly uploaded dashboard will show up in the browse dashboards page"
                },
                {
                    element: ".browseDashboards",
                    intro: "This column will show all uploaded dashboards"
                },
                {
                    element: ".browseDescriptions",
                    intro: "This column will show the description of the dashboard"
                },
                {
                    element: ".browseAdd",
                    intro: "This column contains the button to add the dashboard to your dashboard brief"
                },
                {
                    element: ".browseTable",
                    intro: "An example of an uploaded dashboard"
                },
                {
                    element: ".Dashboard",
                    intro: "Any newly added dashboards will show up in your dashboard brief. Good luck!"
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
                    <Sider className="site-layout-background" width={200}>
                        <Menu
                            openKeys={["sub4"]}
                            className="allStuff"
                            mode="inline"
                            style={{height: '100%'}}
                            selectedKeys={['DashboardHome']}//[this.getCurrentPage()]}
                        >
                            <Menu.Item className="Dashboard" key="dashboard" style={{marginTop: 0}}><Link to="/dashboard">Dashboard Brief</Link></Menu.Item>
                            <Menu.Item key="external-sources"><Link to="/dashboard/all-external-sources">External Sources</Link></Menu.Item>
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
                            <SubMenu className="MarketPlace" key="sub4" icon={<LaptopOutlined />} title="MarketPlace">
                                <Menu.Item className="MarketUpload" key="upload"><Link to="/dashboard/market-place/upload">Upload Dashboards</Link></Menu.Item>
                                <Menu.Item className="MarketBrowse" key="browse"><Link to="/dashboard/market-place/browse">Browse Dashboards</Link></Menu.Item>
                            </SubMenu>
                        </Menu>
                    </Sider>

                    <Content>
                        <Browse/>
                    </Content>
                </Layout>
            </main>
        );
    }
}