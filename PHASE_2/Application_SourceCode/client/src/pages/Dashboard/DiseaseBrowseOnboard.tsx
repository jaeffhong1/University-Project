import React from 'react';
import { Routes, Route, Link, Outlet, useLocation } from 'react-router-dom';

import { Layout, Menu, Breadcrumb } from 'antd';
import { UserOutlined, LaptopOutlined, NotificationOutlined } from '@ant-design/icons';

import './dashboard.css';
import Diseases from '../../pages/Dashboard/DiseaseCases/Diseases/Diseases';

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

export default class DiseaseBrowseOnboard extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);
        this.state = {
            stepsEnabled: true,
            initialStep: 0,
            steps: [
                {
                    element: ".allDiseases",
                    intro: "Click here to access the disease database"
                },
                {
                    element: ".browseDiseases",
                    intro: "Click here to see all reports of diseases"
                },
                {
                    element: ".diseaseNames",
                    intro: "This column lists the name of the disease"
                },
                {
                    element: ".diseaseLocations",
                    intro: "This column lists the locations where the disease occured"
                },
                {
                    element: ".diseaseStarts",
                    intro: "This column lists when the disease started"
                },
                {
                    element: ".diseaseEnds",
                    intro: "This column lists when the disease ended"
                },
                {
                    element: ".diseaseTags",
                    intro: "This column lists the tags of the disease"
                },
                {
                    element: ".diseaseTable",
                    intro: "An example of reports of diseases"
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
                            openKeys={["sub1"]}
                            className="allStuff"
                            mode="inline"
                            style={{height: '100%'}}
                            selectedKeys={['DashboardHome']}//[this.getCurrentPage()]}
                        >
                            <Menu.Item className="Dashboard" key="dashboard" style={{marginTop: 0}}><Link to="/dashboard">Dashboard Brief</Link></Menu.Item>
                            <Menu.Item key="external-sources"><Link to="/dashboard/all-external-sources">External Sources</Link></Menu.Item>
                            <SubMenu className="allDiseases" key="sub1" icon={<UserOutlined />} title="Disease Cases">
                                <Menu.Item className="browseDiseases" key="diseases"><Link to="/dashboard/disease-cases/diseases">Diseases</Link></Menu.Item>
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
                        <Diseases/>
                    </Content>
                </Layout>
            </main>
        );
    }
}