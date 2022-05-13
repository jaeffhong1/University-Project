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
    params: {
        name: string;
        type: TExternalSourceFieldType;
        description: string;
    }[]
}
export default class ExternalSourcesPageOnboard extends React.Component<IProps, IState> {

    static fieldState: {name: string, description: string, type: TExternalSourceFieldType}[] = [{'name': '', 'type': "string", 'description': ''}, {'name': '', 'type': "number", 'description': ''}, {'name': '', 'type': "boolean", 'description': ''}, {'name': '', 'type': "date", 'description': ''}]
    static paramState: {name: string, description: string, type: TExternalSourceFieldType}[] = [{'name': '', 'type': "string", 'description': ''}]

    constructor(props: IProps) {
        super(props);
        this.state = {
            name: "",
            url: "",
            root: "",
            fields: [],
            params: [],
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
                    title: "Autofill",
                    element: ".AutofillButton",
                    intro: "Clicking this button will autofill the fields for the given URL."
                },
                {
                    title: "Parameters",
                    element: ".paramSelector",
                    intro: "Here you can add in any parameters that the url would take in."
                },
                {
                    title: 'Parameters <p></p> example.org?start_date=2020-01-01',
                    element: ".StringEntryParam",
                    intro: 'For the given url above, you would input "start_date".'
                },
                {
                    title: 'Parameters <p></p> example.org?start_date=2020-01-01',
                    element: ".StringExampleEntryParam",
                    intro: 'For the given url above, you would input examples of what the input would look like. For example, "2015-04-03,2010-05-05" <p></p> This is to allow other users to know what input they need to provide to use the API.'
                },
                {
                    title: 'Enter the root of the JSON <p></p>  {"data":[{"total_cases":8452}]}',
                    element: ".SourceRootStart",
                    intro: 'For the given output above, you would input "data".'
                },
                {
                    title: "Fields",
                    element: ".AllFields",
                    intro: "Currently we support strings, numbers, booleans and dates."
                },
                {
                    title: 'String input <p></p> {"data":[{"location": "China"}]}',
                    element: ".StringEntry",
                    intro: 'For the given output above, you would input "location".'
                },
                {
                    title: 'Number input <p></p> {"data":[{"total_cases": 25}]}',
                    element: ".NumberEntry",
                    intro: 'For the given output above, you would input "total_cases".'
                },
                {
                    title: 'Date input <p></p> {"data":[{"time": 2022-03-05}]}',
                    element: ".dateEntry",
                    intro: 'For the given output above, you would input "time".'
                },
                {
                    title: 'Date Format input <p></p> {"data":[{"time": 2022-03-05}]}',
                    element: ".dateEntryFormat",
                    intro: 'For the given output above, you would input "YYYY-MM-DD"<p></p> Y(year), M(month), D(day), t(hour), m(minutes), s(seconds).'
                },
                {
                    title: "Adding extra fields",
                    element: ".DropDown",
                    intro: 'Using this dropdown menu, you may add extra fields.'
                },
                {
                    title: "Removing fields",
                    element: ".boolButton",
                    intro: 'Using this button, you may remove the field.'
                },
                {
                    title: "Submitting",
                    element: ".SubmitButton",
                    intro: 'When you are done, you may click this button to add in this API.'
                },
            ]
        }
    }

    onFinish(values: {root: string, url: string, name: string}) {
        let es: IExternalSource;
        try {
            es = {"name": values.name, "url": values.url, "root": values.root, "fields": ExternalSourcesPageOnboard.fieldState, "params": ExternalSourcesPageOnboard.paramState};
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

    handleAddParam(e: any) {
        const domElement = e.domEvent.target.innerText;
        var paramTypes: TExternalSourceFieldType = "string"; 
        switch (domElement) {
            case ("Date"):
                paramTypes = "date";
                break;
            case ("String"):
                paramTypes = "string";
                break;
            case ("Number"):
                paramTypes = "number";
                break;
            case ("Boolean"):
                paramTypes = "boolean";
                break;
        }
        const newParam = {'name': '', 'type': paramTypes, 'description': ''};
        const newParamsState = ExternalSourcesPageOnboard.paramState;
        newParamsState.push(newParam);

        this.setState({params: newParamsState});
    }


    handleRemoveField(x: any, index: number) {
        const newFieldsState = ExternalSourcesPageOnboard.fieldState;
        newFieldsState.splice(index, 1);
        this.setState({fields: newFieldsState});
    }

    handleRemoveParam(x: any, index: number) {
        const newParamsState = ExternalSourcesPageOnboard.paramState;
        newParamsState.splice(index, 1);
        this.setState({params: newParamsState});
    }
    

    handleStringChange(index: number, e: any): void {
        const newFieldsState = ExternalSourcesPageOnboard.fieldState;
        newFieldsState[index]["name"] = e.target.value;
        this.setState({fields: newFieldsState});
    }

    handleParamStringChange(index: number, e: any): void {
        const newParamsState = ExternalSourcesPageOnboard.paramState;
        newParamsState[index]["name"] = e.target.value;
        this.setState({params: newParamsState});
    }

    handleParamExampleChange(index: number, e: any): void {
        const newParamsState = ExternalSourcesPageOnboard.paramState;
        newParamsState[index]["description"] = e.target.value;
        this.setState({params: newParamsState});
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
        window.location.href = "/";
    };

    toggleSteps = () => {
        this.setState((prevState) => ({ stepsEnabled: !prevState.stepsEnabled }));
    };
    
    dataSources: string[] = ["string", "number", "date"];// boolean, array, dictioanry
    render() {

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
                <Menu.Item key="4">
                Boolean
                </Menu.Item>
            </Menu>
        );

        const param_menu = (
            <Menu onClick={this.handleAddParam.bind(this)}>
                <Menu.Item key="1">
                    Date
                </Menu.Item>
                <Menu.Item key="2">
                    String
                </Menu.Item>
                <Menu.Item key="3">
                    Number
                </Menu.Item>
                <Menu.Item key="4">
                    Boolean
                </Menu.Item>
            </Menu>
        );

        return <div style={{padding: '0.5em', width: '50%', margin: 'auto'}}>
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
            <Form
                style={{marginTop: 24, height:'100%'}}
                name="basic"
                labelCol={{ span: 3 }}
                wrapperCol={{ span: 16 }}
                initialValues={{ remember: true }}
                onFinish={this.onFinish.bind(this)}
                onFinishFailed={this.onFinishFailed.bind(this)}
                autoComplete="off"
            >
                <Form.Item style={{padding: 0}}>
                    <h3 className="ApiStructure" style={{left: '0%', marginLeft: '0em'}}>
                        Enter in the API details
                    </h3>
                </Form.Item>
                <Form.Item
                    label="Name"
                    name="name"
                    rules={[{ required: true, message: 'Please enter the API name' }]}
                >   
                    <Input 
                        //@ts-ignore
                        size={"default"} 
                        className="APIname"
                        placeholder="Please name your API" 
                    />
                </Form.Item>
                <Form.Item
                    label="API URL"
                    name="url"
                    rules={[{ required: true, message: 'Please enter the API url' }]}
                >
                    <Input 
                        //@ts-ignore
                        size="default" 
                        defaultValue="example.org"
                        className="APIurl"
                        placeholder="Input the url of the API" 
                    />
                </Form.Item>

                <Form.Item style={{ marginBottom: "0px" }}>
                    <Button 
                        //@ts-ignore
                        size="default" 
                        className="AutofillButton" 
                        type="primary" 
                        disabled={false}
                    >
                    Autofill fields and root
                    </Button>
                </Form.Item>

                <Form.Item
                    label="Information"
                >
                    {ExternalSourcesPageOnboard.paramState.map((x:any, index:any) =>  {
                        switch(x["type"]) {
                            case "date":
                                return (
                                    <div key={index} className="ParamEntry">
                                        <Input.Group compact>
                                                <Input
                                                    style={{ width: '20%' }}
                                                    className="DateEntryParam"
                                                    //@ts-ignore
                                                    size="default"
                                                    placeholder={x["type"]}
                                                    onChange = {this.handleParamStringChange.bind(this, index)}

                                                />
                                                <Input
                                                    style={{ width: '70%' }}
                                                    className="DateEntryParam"
                                                    //@ts-ignore
                                                    size="default"
                                                    placeholder="Examples, seperated with commas"
                                                    onChange = {this.handleParamExampleChange.bind(this, index)}

                                                />
                                            <Button 
                                                style={{ width: '10%' }}
                                                //@ts-ignore
                                                size="default"
                                                className="RemoveFieldWeirdParam" 
                                                onClick={this.handleRemoveParam.bind(this, x, index)}
                                                type="primary"
                                                danger
                                            >
                                                <MinusCircleOutlined />
                                            </Button>
                                        </Input.Group>
                                    </div>
                                )
                            case "string":
                                return (
                                    <div key={index} className="ParamEntry">
                                        <Input.Group compact>
                                                <Input
                                                    style={{ width: '20%' }}
                                                    className="StringEntryParam"
                                                    defaultValue="start_date"
                                                    //@ts-ignore
                                                    size="default"
                                                    placeholder={x["type"]}
                                                    onChange = {this.handleParamStringChange.bind(this, index)}

                                                />
                                                <Input
                                                    style={{ width: '70%' }}
                                                    className="StringExampleEntryParam"
                                                    defaultValue="2015-04-03,2010-05-05"
                                                    //@ts-ignore
                                                    size="default"
                                                    placeholder="Examples, seperated with commas"
                                                    onChange = {this.handleParamExampleChange.bind(this, index)}

                                                />
                                            <Button 
                                                style={{ width: '10%' }}
                                                //@ts-ignore
                                                size="default"
                                                className="RemoveFieldWeirdParam" 
                                                onClick={this.handleRemoveParam.bind(this, x, index)}
                                                type="primary"
                                                danger
                                            >
                                                <MinusCircleOutlined />
                                            </Button>
                                        </Input.Group>
                                    </div>
                                )
                            case "number":
                                return (
                                    <div key={index} className="ParamEntry">
                                        <Input.Group compact>
                                                <Input
                                                    bordered={true}
                                                    style={{ width: '20%' }}
                                                    className="NumberEntryParam"
                                                    //@ts-ignore
                                                    size="default"
                                                    placeholder={x["type"]}
                                                    onChange = {this.handleParamStringChange.bind(this, index)}
                                                />
                                                <Input
                                                    style={{ width: '70%' }}
                                                    className="DateEntryParam"
                                                    //@ts-ignore
                                                    size="default"
                                                    placeholder="Examples, seperated with commas"
                                                    onChange = {this.handleParamExampleChange.bind(this, index)}

                                                />
                                            <Button 
                                                style={{ width: '10%' }}
                                                //@ts-ignore
                                                size="default"
                                                className="RemoveFieldWeirdParam" 
                                                onClick={this.handleRemoveParam.bind(this, x, index)}
                                                type="primary"
                                                danger
                                            >
                                                <MinusCircleOutlined />
                                            </Button>
                                        </Input.Group>
                                        
                                    </div>
                                )
                            case "boolean":
                                return (
                                    <div key={index} className="FieldEntry">
                                        <Input.Group compact>
                                                <Input
                                                    bordered={true}
                                                    style={{ width: '20%' }}
                                                    className="BooleanEntryParam"
                                                    //@ts-ignore
                                                    size="default"
                                                    placeholder={x["type"]}
                                                    onChange = {this.handleParamStringChange.bind(this, index)}
                                                />
                                                <Input
                                                    style={{ width: '70%' }}
                                                    className="DateEntryParam"
                                                    //@ts-ignore
                                                    size="default"
                                                    placeholder="Examples, seperated with commas"
                                                    onChange = {this.handleParamExampleChange.bind(this, index)}

                                                />
                                            <Button 
                                                style={{ width: '10%' }}
                                                //@ts-ignore
                                                size="default" 
                                                className="RemoveFieldWeirdParam" 
                                                onClick={this.handleRemoveParam.bind(this, x, index)}
                                                type="primary"
                                                danger
                                            >
                                                <MinusCircleOutlined />
                                            </Button>
                                        </Input.Group>
                                        
                                    </div>
                                )
                        }
                    })}
                    <Dropdown 
                        className="DropDownParam"
                        overlay={param_menu}>
                        <Button 
                            //@ts-ignore
                            size="default"
                            className="paramSelector"
                            style={{ width: '100%' }}
                        >
                            Add a param
                            <DownOutlined />
                        </Button>
                    </Dropdown>
                </Form.Item>
                <Form.Item style={{padding: 0}}>
                    <h3 className="ApiStructure" style={{left: '0%', marginLeft: '0em'}}>
                        Enter in the structure of the JSON returned by the API
                    </h3>
                </Form.Item>
                <Form.Item
                    label="Root"
                    name="root"
                >
                    <Input
                        className="SourceRootStart"
                        defaultValue="data"
                        //@ts-ignore
                        size="default"
                        placeholder="Root"
                    />
                </Form.Item>
                <Form.Item
                    label="Fields"
                    className="AllFields"
                >
                    {ExternalSourcesPageOnboard.fieldState.map((x:any, index:any) =>  {
                        switch(x["type"]) {
                            case "date":
                                return (
                                        <Input.Group key={index} style={{left: '0%'}} compact>
                                            <Input
                                                style={{ width: '40%' }}
                                                className="dateEntry"
                                                //@ts-ignore
                                                size="default"
                                                defaultValue="time"
                                                placeholder={x["type"]}
                                                onChange = {this.handleDateChange.bind(this, index)}
                                            />
                                            <Input
                                                style={{ width: '50.2%' }}
                                                className="dateEntryFormat"
                                                //@ts-ignore
                                                size="default"
                                                defaultValue="YYYY-MM-DD"
                                                placeholder="Format: Y:M:D:t:m:s"
                                                onChange = {this.handleFormatChange.bind(this, index)}
                                            />
                                            <Button 
                                                style={{ width: '10%' }}
                                                //@ts-ignore
                                                size="default" 
                                                danger
                                                onClick={this.handleRemoveField.bind(this, x, index)}
                                                type="primary"
                                            >
                                                <MinusCircleOutlined />
                                            </Button>
                                        </Input.Group>
                                )
                            case "string":
                                return (
                                        <Input.Group key={index} style={{left: '0%'}} compact>
                                                <Input
                                                    style={{ width: '90%' }}
                                                    className="StringEntry"
                                                    //@ts-ignore
                                                    size="default"
                                                    defaultValue="location"
                                                    placeholder={x["type"]}
                                                    onChange = {this.handleStringChange.bind(this, index)}
                                                />
                                            <Button 
                                                style={{ width: '10%' }}
                                                //@ts-ignore
                                                size="default" 
                                                onClick={this.handleRemoveField.bind(this, x, index)}
                                                type="primary"
                                                danger
                                            >
                                                <MinusCircleOutlined />
                                            </Button>
                                        </Input.Group>
                                )
                            case "number":
                                return (
                                        <Input.Group key={index} className="FieldEntry" style={{left: '0%'}} compact>
                                                <Input
                                                    bordered={true}
                                                    style={{ width: '90%' }}
                                                    className="NumberEntry"
                                                    //@ts-ignore
                                                    size="default"
                                                    defaultValue="total_cases"
                                                    placeholder={x["type"]}
                                                    onChange = {this.handleStringChange.bind(this, index)}
                                                />
                                            
                                            <Button 
                                                style={{ width: '10%' }}
                                                //@ts-ignore
                                                size="default" 
                                                onClick={this.handleRemoveField.bind(this, x, index)}
                                                type="primary"
                                                danger
                                            >
                                                <MinusCircleOutlined />
                                            </Button>
                                        </Input.Group>
                                )
                            case "boolean":
                                return (
                                        <Input.Group key={index} className="FieldEntry" style={{left: '0%'}} compact>
                                                <Input
                                                    bordered={true}
                                                    style={{ width: '90%' }}
                                                    //@ts-ignore
                                                    size="default"
                                                    placeholder={x["type"]}
                                                    onChange = {this.handleStringChange.bind(this, index)}
                                                />
                                            
                                            <Button 
                                                style={{ width: '10%' }}
                                                className="boolButton"
                                                //@ts-ignore
                                                size="default" 
                                                onClick={this.handleRemoveField.bind(this, x, index)}
                                                type="primary"
                                                danger
                                            >
                                                <MinusCircleOutlined />
                                            </Button>
                                        </Input.Group>
                                )
                        }
                    })}
                    <Dropdown 
                        className="DropDown"
                        overlay={menu}
                    >
                        <Button 
                            //@ts-ignore
                            size="default" 
                            className="FieldSelector"
                            style={{left: '0%', width: '100%'}} 
                        >
                                Add a field
                            <DownOutlined />
                        </Button>
                    </Dropdown>
                </Form.Item>
                <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
                    <Button 
                        //@ts-ignore
                        size="default" 
                        className="SubmitButton" 
                        type="primary" 
                        htmlType="submit"
                    >
                    Submit
                    </Button>
                </Form.Item>
            </Form>
        </div>
    }
}