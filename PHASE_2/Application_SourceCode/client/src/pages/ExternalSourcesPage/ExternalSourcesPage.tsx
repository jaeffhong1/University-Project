import { Button, Form, Table, Input, Dropdown, Menu, Checkbox, Tooltip, message } from "antd";
import React from "react";
import { IExternalSource, TExternalSourceFieldType, TExternalSources } from "../Dashboard/DashboardHome/sources/ExternalSource";
import './ExternalSourcesPage.css'
import { DownOutlined, MinusCircleOutlined } from '@ant-design/icons';

function validateExternalSource(externalSource: any): string | null {
    if (!('url' in externalSource))
        return "missing url field"
    // FIXME: check the other things
    return null // no error
}

export class ExternalSourcesPage extends React.Component<{
    userExternalSources: TExternalSources | null,
    externalSources: TExternalSources | null,
    setUserExternalSources: (s: {[name: string]: IExternalSource}) => void,
    setExternalSources: (s: {[name: string]: IExternalSource}) => void
}> {

    static fieldState: {name: string, description: string, type: TExternalSourceFieldType}[] = []
    static paramState: {name: string, description: string, type: TExternalSourceFieldType}[] = []

    onFinish(values: {root: string, url: string, name: string}) {
        let es: IExternalSource;
        try {
            es = {"name": values.name, "url": values.url, "root": values.root, "fields": ExternalSourcesPage.fieldState, "params": ExternalSourcesPage.paramState};
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

        this.props.setExternalSources({...this.props.externalSources, [values.name]: es})
        this.props.setUserExternalSources({...this.props.userExternalSources, [values.name]: es})
        message.info("Your API has successfully been added")
    }
    

    onFinishFailed() {
        // FIXME
        alert("failed for some reason")
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
            case ("Boolean"):
                fieldTypes = "boolean";
                break;
        }
        const newField = {'name': '', 'type': fieldTypes, 'description': ''};
        const newFieldsState = ExternalSourcesPage.fieldState;
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
        const newParamsState = ExternalSourcesPage.paramState;
        newParamsState.push(newParam);

        this.setState({params: newParamsState});
    }


    handleRemoveField(x: any, index: number) {
        const newFieldsState = ExternalSourcesPage.fieldState;
        newFieldsState.splice(index, 1);
        this.setState({fields: newFieldsState});
    }

    handleRemoveParam(x: any, index: number) {
        const newParamsState = ExternalSourcesPage.paramState;
        newParamsState.splice(index, 1);
        this.setState({params: newParamsState});
    }
    

    handleStringChange(index: number, e: any): void {
        const newFieldsState = ExternalSourcesPage.fieldState;
        newFieldsState[index]["name"] = e.target.value;
        this.setState({fields: newFieldsState});
    }

    handleParamStringChange(index: number, e: any): void {
        const newParamsState = ExternalSourcesPage.paramState;
        newParamsState[index]["name"] = e.target.value;
        this.setState({params: newParamsState});
    }

    handleParamExampleChange(index: number, e: any): void {
        const newParamsState = ExternalSourcesPage.paramState;
        newParamsState[index]["description"] = e.target.value;
        this.setState({params: newParamsState});
    }

    handleDateChange(index: number, e: any): void {
        const newFieldsState = ExternalSourcesPage.fieldState;
        newFieldsState[index]["name"] = e.target.value;
        this.setState({fields: newFieldsState});
    }

    handleFormatChange(index: number, e: any): void {
        const newFieldsState = ExternalSourcesPage.fieldState;
        newFieldsState[index]["description"] = e.target.value;
        this.setState({fields: newFieldsState});
    }
    
    dataSources: string[] = ["string", "number", "date", "boolean"];// boolean, array, dictioanry
    render() {
        if (!this.props.externalSources)
            return <p>Loading external sources, please wait...</p>
        const dataSource = []
        let i = 0;
        for (let es of Object.values(this.props.externalSources)) {
            dataSource.push({
                key: '' + (i++),
                json: JSON.stringify(es),
            })
        }

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

        return <div style={{padding: '12px'}}>
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
                    <Input addonAfter="API Name" size="large" placeholder="Please name your API" />
                </Form.Item>
                <Form.Item
                    label="Information (URL)"
                    name="url"
                    rules={[{ required: true, message: 'Please enter the API url' }]}
                >
                    <Input addonAfter="API Url" size="large" placeholder="Input the url of the API" />
                </Form.Item>
                <Form.Item
                    label="Information (PARAMS)"
                >
                    {ExternalSourcesPage.paramState.map((x:any, index:any) =>  {
                        switch(x["type"]) {
                            case "date":
                                return (
                                    <div key={index} className="ParamEntry">
                                        <Input.Group compact>
                                                <Input
                                                    style={{ width: '30%' }}
                                                    className="DateEntryParam"
                                                    size="large"
                                                    placeholder={x["type"]}
                                                    onChange = {this.handleParamStringChange.bind(this, index)}

                                                />
                                                <Input
                                                    style={{ width: '65.5%' }}
                                                    className="DateEntryParam"
                                                    size="large"
                                                    placeholder="Examples, seperated with commas"
                                                    onChange = {this.handleParamExampleChange.bind(this, index)}

                                                />
                                            <Button size="large" className="RemoveFieldWeirdParam" onClick={this.handleRemoveParam.bind(this, x, index)}>
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
                                                    style={{ width: '30%' }}
                                                    className="StringEntryParam"
                                                    size="large"
                                                    placeholder={x["type"]}
                                                    onChange = {this.handleParamStringChange.bind(this, index)}

                                                />
                                                <Input
                                                    style={{ width: '65.5%' }}
                                                    className="DateEntryParam"
                                                    size="large"
                                                    placeholder="Examples, seperated with commas"
                                                    onChange = {this.handleParamExampleChange.bind(this, index)}

                                                />
                                            <Button size="large" className="RemoveFieldWeirdParam" onClick={this.handleRemoveParam.bind(this, x, index)}>
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
                                                    style={{ width: '30%' }}
                                                    className="NumberEntryParam"
                                                    size="large"
                                                    placeholder={x["type"]}
                                                    onChange = {this.handleParamStringChange.bind(this, index)}
                                                />
                                                <Input
                                                    style={{ width: '65.5%' }}
                                                    className="DateEntryParam"
                                                    size="large"
                                                    placeholder="Examples, seperated with commas"
                                                    onChange = {this.handleParamExampleChange.bind(this, index)}

                                                />
                                            <Button size="large" className="RemoveFieldWeirdParam" onClick={this.handleRemoveParam.bind(this, x, index)}>
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
                                                    style={{ width: '30%' }}
                                                    className="BooleanEntryParam"
                                                    size="large"
                                                    placeholder={x["type"]}
                                                    onChange = {this.handleParamStringChange.bind(this, index)}
                                                />
                                                <Input
                                                    style={{ width: '65.5%' }}
                                                    className="DateEntryParam"
                                                    size="large"
                                                    placeholder="Examples, seperated with commas"
                                                    onChange = {this.handleParamExampleChange.bind(this, index)}

                                                />
                                            <Button size="large" className="RemoveFieldWeirdParam" onClick={this.handleRemoveParam.bind(this, x, index)}>
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
                        <Button size="large" className="paramSelector">
                            Add a param
                            <DownOutlined />
                        </Button>
                    </Dropdown>
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
                        size="large"
                        placeholder="Root"
                    />
                </Form.Item>
                <Form.Item
                    label="Information (FIELDS)"
                >
                    {ExternalSourcesPage.fieldState.map((x:any, index:any) =>  {
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
                            case "boolean":
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
                <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
                    <Button size="large" className="SubmitButton" type="primary" htmlType="submit">
                    Submit
                    </Button>
                </Form.Item>
                </Form>
        </div>
    }
}