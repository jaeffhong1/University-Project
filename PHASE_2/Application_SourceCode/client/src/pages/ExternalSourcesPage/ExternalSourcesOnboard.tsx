import { Layout, Button, Form, Table, Space, Input, Dropdown, Menu, Checkbox, Tooltip, message } from "antd";
import React from "react";
import { Routes, Route, Link, Outlet, useLocation } from 'react-router-dom';
import { UserOutlined, LaptopOutlined, PlusOutlined, NotificationOutlined, DownOutlined, MinusCircleOutlined } from '@ant-design/icons';

import { IExternalSource, TExternalSourceFieldType } from "../Dashboard/DashboardHome/sources/ExternalSource";
import './ExternalSourcesPage.css'
import { Steps } from 'intro.js-react'
import DashboardRoot from "../Dashboard/DashboardRoot";

const { SubMenu } = Menu;
const { Content, Sider } = Layout;

function validateExternalSource(externalSource: any): string | null {
    if (!('url' in externalSource))
        return "missing url field"
    // FIXME: check the other things
    return null // no error
}

interface IProps {
}

interface IState {
    stepsEnabled: boolean,
    initialStep: number,
    steps: {title: string, element: string, intro: string}[],

    name: string,
    url: string;
    root: string,
    fields: {
        name: string;
        type: TExternalSourceFieldType;
        description: string;
    }[],
}
export default class ExternalSourcesPageOnboard extends React.Component<IProps, IState> {

    static fieldState: {name: string, description: string, type: TExternalSourceFieldType}[] = [{'name': '', 'type': "string", 'description': ''}, {'name': '', 'type': "number", 'description': ''}, {'name': '', 'type': "date", 'description': ''}]

    constructor(props: IProps) {
        super(props);
        this.state = {
            name: "",
            url: "",
            root: "",
            fields: [],
            stepsEnabled: true,
            initialStep: 0,
            steps: [
                {
                    title: "Name your API",
                    element: ".APIname",
                    intro: ""
                },
                {
                    title: "Enter the url of the API",
                    element: ".APIurl",
                    intro: "Example: example.org"
                },
                {
                    title: 'Enter the root of the JSON <p></p>  {"data":[{"total_cases":8452}]}',
                    element: ".SourceRootStart",
                    intro: 'For the given output above, you would input "data" (without the quotation marks) '
                },
                {
                    title: "Fields",
                    element: ".AllFields",
                    intro: "Currently we support strings, numbers and dates"
                },
                {
                    title: 'String input <p></p> {"data":[{"location": "China"}]} ',
                    element: ".StringEntry",
                    intro: 'For the given output above, you would input "location" (without the quotation marks)'
                },
                {
                    title: 'Number input <p></p> {"data":[{"total_cases": 25}]}',
                    element: ".NumberEntry",
                    intro: 'For the given output above, you would input "total_cases" (without the quotation marks)'
                },
                {
                    title: 'Date input <p></p> {"data":[{"time": 2022-03-05}]}',
                    element: ".dateEntry",
                    intro: 'For the given output above, you would input "time" (without the quotation marks)'
                },
                {
                    title: 'Date Format input <p></p> {"data":[{"time": 2022-03-05}]}',
                    element: ".dateEntryFormat",
                    intro: 'For the given output above, you would input "YYYY-MM-DD" (without the quotation marks) <p></p> Y(year), M(month), D(day), t(hour), m(minutes), s(seconds)'
                },
                {
                    title: "Adding extra fields",
                    element: ".DropDown",
                    intro: 'Using this dropdown menu, you may add extra fields'
                },
                {
                    title: "Removing fields",
                    element: ".RemoveField",
                    intro: 'Using this button, you may remove the field'
                },
                {
                    title: "Submitting",
                    element: ".SubmitButton",
                    intro: 'When you are done, you may click this button to add in this API'
                },
            ]
        }
    }

    onFinish(values: {root: string, url: string, name: string}) {
        let es: IExternalSource;
        try {
            es = {"name": values.name, "url": values.url, "root": values.root, "fields": ExternalSourcesPageOnboard.fieldState};
        } catch (e) {
            // FIXME: show good looking modal
            alert("error: " + e + "\n\n" + values.url)
            return
        }

        const errorMessage = validateExternalSource(es)
        if (errorMessage !== null) {
            // FIXME: show good looking modal
            alert("error: " + errorMessage)
            return
        }
        message.info("Your API has successfully been added")
    }
    

    onFinishFailed() {
        // FIXME
        //alert("failed for some reason")
    }

    handleAddField(e: any) {
        console.log(e)
        const domElement = e.domEvent.target.innerText;
        var fieldTypes: TExternalSourceFieldType = "string"; 
        switch (domElement) {
            case ("Date"):
                fieldTypes = "date";
                break;
            case ("String"):
                fieldTypes = "string";
                break;
            case ("Number"):
                fieldTypes = "number";
                break;
        }
        const newField = {'name': '', 'type': fieldTypes, 'description': ''};
        const newFieldsState = ExternalSourcesPageOnboard.fieldState;
        newFieldsState.push(newField);

        this.setState({fields: newFieldsState});
    }


    handleRemoveField(x: any, index: number) {
        const newFieldsState = ExternalSourcesPageOnboard.fieldState;
        newFieldsState.splice(index, 1);
        this.setState({fields: newFieldsState});
    }

    handleStringChange(index: number, e: any): void {
        const newFieldsState = ExternalSourcesPageOnboard.fieldState;
        newFieldsState[index]["name"] = e.target.value;
        this.setState({fields: newFieldsState});
    }

    handleDateChange(index: number, e: any): void {
        const newFieldsState = ExternalSourcesPageOnboard.fieldState;
        newFieldsState[index]["name"] = e.target.value;
        this.setState({fields: newFieldsState});
    }

    handleFormatChange(index: number, e: any): void {
        const newFieldsState = ExternalSourcesPageOnboard.fieldState;
        newFieldsState[index]["description"] = e.target.value;
        this.setState({fields: newFieldsState});
    }

    onExit = () => {
        this.setState(() => ({ stepsEnabled: false }));
        //window.location.href = "/";
    };

    toggleSteps = () => {
        this.setState((prevState) => ({ stepsEnabled: !prevState.stepsEnabled }));
    };
    
    dataSources: string[] = ["string", "number", "date"];// boolean, array, dictioanry
    render() {

        const dataSource = []
        const allDataSources:any = []

        var fieldTypes: TExternalSourceFieldType = "string"; 
        const newField = {'name': 'example', 'type': fieldTypes, 'description': 'examplle'};
        const example:IExternalSource = {"name":"ExampleAPI","url":"example.org","fields":[newField],"root":"data"}

        const newData = {key: '0', json: JSON.stringify(example)}
        dataSource.push(newData)

        allDataSources.push(example);
        const menu = (
            <Menu onClick={this.handleAddField.bind(this)}>
                <Menu.Item key="1">
                Date
                </Menu.Item>
                <Menu.Item key="2">
                String
                </Menu.Item>
                <Menu.Item key="3">
                Number
                </Menu.Item>
            </Menu>
        );

        return <div>
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
            </Layout>

            <div className="OnboardLayout" style={{padding: '12px'}}>
                <Form
                    style={{marginTop: 24}}
                    name="basic"
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 16 }}
                    initialValues={{ remember: true }}
                    onFinish={this.onFinish.bind(this)}
                    onFinishFailed={this.onFinishFailed.bind(this)}
                    autoComplete="off"
                    >
                    <Form.Item
                        label="Name"
                        name="name"
                        rules={[{ required: true, message: 'Please enter the API name' }]}
                    >
                        <Input className="APIname" addonAfter="API Name" size="large" placeholder="Please name your API" />
                    </Form.Item>
                    <Form.Item
                        label="Information (URL)"
                        name="url"
                        rules={[{ required: true, message: 'Please enter the API url' }]}
                    >
                        <Input className="APIurl" addonAfter="API Url" size="large" placeholder="Input the url of the API" />
                    </Form.Item>
                    <h2 className="ApiStructure">
                        Enter in the structure of the JSON returned by the API
                    </h2>
                    <Form.Item
                        label="Information (ROOT)"
                        name="root"
                    >
                        <Input
                            className="SourceRootStart"
                            addonAfter=":[{"
                            size="large"
                            placeholder="Root"
                        />
                    </Form.Item>
                    <Form.Item
                        className="AllFields"
                        label="Information (FIELDS)"
                    >
                        {ExternalSourcesPageOnboard.fieldState.map((x:any, index:any) =>  {
                            switch(x["type"]) {
                                case "date":
                                    return (
                                        <div key={index} className="DateEntry">
                                            <Input.Group compact>
                                                    <Input
                                                        style={{ width: '27.7%' }}
                                                        className="dateEntry"
                                                        size="large"
                                                        placeholder={x["type"]}
                                                        onChange = {this.handleDateChange.bind(this, index)}
                                                    />
                                                    <Input
                                                        style={{ width: '27.7%' }}
                                                        className="dateEntryFormat"
                                                        size="large"
                                                        placeholder="date format (Y:M:D:t:m:s)"
                                                        onChange = {this.handleFormatChange.bind(this, index)}
                                                    />
                                                <Button size="large" className="RemoveField" onClick={this.handleRemoveField.bind(this, x, index)}>
                                                    <MinusCircleOutlined />
                                                </Button>
                                            </Input.Group>
                                        </div>
                                    )
                                case "string":
                                    return (
                                        <div key={index} className="FieldEntry">
                                            <Input.Group compact>
                                                    <Input
                                                        style={{ width: '55.4%' }}
                                                        className="StringEntry"
                                                        size="large"
                                                        placeholder={x["type"]}
                                                        onChange = {this.handleStringChange.bind(this, index)}

                                                    />
                                                <Button size="large" className="RemoveFieldWeird" onClick={this.handleRemoveField.bind(this, x, index)}>
                                                    <MinusCircleOutlined />
                                                </Button>
                                            </Input.Group>
                                        </div>
                                    )
                                case "number":
                                    return (
                                        <div key={index} className="FieldEntry">
                                            <Input.Group compact>
                                                    <Input
                                                        bordered={true}
                                                        style={{ width: '55.4%' }}
                                                        className="NumberEntry"
                                                        size="large"
                                                        placeholder={x["type"]}
                                                        onChange = {this.handleStringChange.bind(this, index)}
                                                    />
                                                
                                                <Button size="large" className="RemoveFieldWeird" onClick={this.handleRemoveField.bind(this, x, index)}>
                                                    <MinusCircleOutlined />
                                                </Button>
                                            </Input.Group>
                                            
                                        </div>
                                    )
                            }
                        })}
                        <Dropdown 
                            className="DropDown"
                            overlay={menu}>
                            <Button size="large" className="FieldSelector">
                                Add a field
                                <DownOutlined />
                            </Button>
                        </Dropdown>
                    </Form.Item>
                    <p>
                    </p>
                    <Input
                        className="SourceRootEnd"
                        addonAfter=" }]"
                        size="large"
                        disabled={true}
                    />
                    <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
                        <Button size="large" className="SubmitButton" type="primary" htmlType="submit">
                        Submit
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    }
}