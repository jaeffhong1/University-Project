import { Button, Form, Table, Input, Dropdown, Menu, Checkbox, Tooltip, Space, Layout } from "antd";
import TextArea from "antd/lib/input/TextArea";
import React, {useState} from "react";
import { Link } from 'react-router-dom';
import { IExternalSource, TExternalSourceFieldType } from "../Dashboard/DashboardHome/sources/ExternalSource";
import { DownOutlined, PlusOutlined, UserOutlined, LaptopOutlined, NotificationOutlined } from '@ant-design/icons';
import { format } from "path";
import './AllExternalSources.css'
import { Steps } from 'intro.js-react'

const { SubMenu } = Menu;
const { Content, Sider } = Layout;
interface IProps {
}

interface IState {
    stepsEnabled: boolean,
    initialStep: number,
    steps: {element: string, intro: string}[]
}
export default class AllExternalSourcesPageOnboard extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);
        this.state = {
            stepsEnabled: true,
            initialStep: 0,
            steps: [
                {
                    element: ".ExternalSourcesMarket",
                    intro: "Click here to access other API's"
                },
                {
                    element: ".APItable",
                    intro: "This will list the information related to the other API's in the marketplace"
                },
                {
                    element: ".ant-table-row.ant-table-row-level-0",
                    intro: "This example API uses the example.org URL and has fields containing a string with root \"data\""
                },
                {
                    element: ".DifferentAPI",
                    intro: "To add this API click on this button"
                },
                {
                    element: ".addAPI",
                    intro: "Lets have a go adding our own API"
                },
                
            ]
        }
    }
    handleAddApi() {
        window.location.href = "/external-sourcesOnboard";
    }

    onExit = () => {
        this.setState(() => ({ stepsEnabled: false }));
    };

    toggleSteps = () => {
        this.setState((prevState) => ({ stepsEnabled: !prevState.stepsEnabled }));
    };

    render() {

        const dataSource = []
        const allDataSources:any = []

        var fieldTypes: TExternalSourceFieldType = "string"; 
        const newField = {'name': 'example', 'type': fieldTypes, 'description': 'examplle'};
        const example:IExternalSource = {"name":"ExampleAPI","url":"example.org","fields":[newField],"root":"data", "params":[]}

        const newData = {key: '0', json: JSON.stringify(example)}
        dataSource.push(newData)

        allDataSources.push(example);
        const columns = [
            { key: 'json', dataIndex: 'json', title: "JSON" },
        ]

        const types = ['date', 'string', 'number']
        return <div style={{padding: '12px'}}>
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
                        <Menu.Item className="ExternalSourcesMarket" key="external-sources"><Link to="/dashboard/all-external-sources">External Sources</Link></Menu.Item>
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

                <div style={{padding: '12px'}}>
                    <Table className="APItable" dataSource={dataSource} columns={columns} />

                    <Space size={[50,100]} wrap>
                        <Button size="large" className="addAPI" onClick={this.handleAddApi}>
                            Add an API
                            <PlusOutlined style={{color: "blue"}} className="plusIcon"/>
                        </Button>

                        {allDataSources.map((data:any, index:any) => (
                            <Button size="large" className="DifferentAPI" key={index}>{data.name} <PlusOutlined className="plusIcon"/> </Button>
                        ))}
                    </Space>
                </div>
            </Layout>
        </div>
    }
}