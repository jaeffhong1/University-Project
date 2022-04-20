import { Button, Form, Table, Input, Dropdown, Menu, Checkbox, Tooltip, message, Divider } from "antd";
import React from "react";
import { IExternalSource, TExternalSourceFieldType, TExternalSources } from "../Dashboard/DashboardHome/sources/ExternalSource";
import './ExternalSourcesPage.css'
import { DownOutlined, MinusCircleOutlined } from '@ant-design/icons';
import CacheSystem from '../../pages/Dashboard/DashboardHome/CacheSystem';

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

        let userData:any = localStorage.getItem('userExternalSources');
        if (userData == null) {
            userData = [];
        } else {
            userData = JSON.parse(userData);
        }
        userData.push(es);
        
        let new_es: TExternalSources = {};
        for (let data of userData) {
            let key_object:any = {};
            key_object["name"] = data["name"]
            key_object["url"] = data["url"]
            key_object["root"] = data["root"]
            key_object["fields"] = data["fields"]
            key_object["params"] = data["params"]
            new_es[data["name"]] = key_object;
        }

        localStorage.setItem('userExternalSources', JSON.stringify(userData));  

        this.props.setExternalSources({...this.props.externalSources, [values.name]: es});
        this.props.setUserExternalSources(new_es);

        let new_params_list:any = [];
        let parameters:any = "";
        for (parameters of ExternalSourcesPage.paramState) {
            let new_param:any = {};
            new_param["name"] = parameters["name"];
            new_param["type"] = parameters["type"];
            String(new_param["type"]);
            new_param["description"] = parameters["description"];
            new_params_list.push(new_param);
        }

        let new_fields_list:any = [];
        let the_fields:any = "";
        for (the_fields of ExternalSourcesPage.fieldState) {
            let new_field:any = {};
            new_field["name"] = the_fields["name"];
            new_field["type"] = the_fields["type"];
            String(new_field["type"]);
            new_field["description"] = the_fields["description"];
            new_fields_list.push(new_field);
        }

        // [{"name": "test", "type": "string", "description": "test"}]

        let add_link = "http://seng3011.duckdns.org/marketplace/api/add";
        (async () => {
        const response = await fetch(add_link, {method: 'POST',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                         body: `{
                             "name": "${values.name}",
                             "root": "${values.root}",
                             "url": "${values.url}",
                             "params": ${JSON.stringify(new_params_list)},
                             "fields": ${JSON.stringify(new_fields_list)}
                        }`,    
        });
        response.json().then(data=>{console.log(data)});
        })();
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

        return <div style={{padding: '0.5em', width: '50%', margin: 'auto'}}>
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
                        placeholder="Input the url of the API" 
                    />
                </Form.Item>
                <Form.Item
                    label="Information"
                >
                    {ExternalSourcesPage.paramState.map((x:any, index:any) =>  {
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
                        //@ts-ignore
                        size="default"
                        placeholder="Root"
                    />
                </Form.Item>
                <Form.Item
                    label="Fields"
                >
                    {ExternalSourcesPage.fieldState.map((x:any, index:any) =>  {
                        switch(x["type"]) {
                            case "date":
                                return (
                                        <Input.Group key={index} style={{left: '0%'}} compact>
                                            <Input
                                                style={{ width: '40%' }}
                                                className="dateEntry"
                                                //@ts-ignore
                                                size="default"
                                                placeholder={x["type"]}
                                                onChange = {this.handleDateChange.bind(this, index)}
                                            />
                                            <Input
                                                style={{ width: '50.2%' }}
                                                //@ts-ignore
                                                size="default"
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
                                                    //@ts-ignore
                                                    size="default"
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
                                                    //@ts-ignore
                                                    size="default"
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