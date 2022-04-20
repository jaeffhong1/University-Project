import { Button, message, Space, Table, Collapse, Typography, Descriptions, List } from "antd";
import TextArea from "antd/lib/input/TextArea";
import React, {useState} from "react";
import { Link } from 'react-router-dom';
import { IExternalSource, TExternalSourceFieldType } from "../Dashboard/DashboardHome/sources/ExternalSource";
import { DownOutlined, PlusOutlined, UserOutlined, LaptopOutlined, NotificationOutlined } from '@ant-design/icons';
import { format } from "path";
import './AllExternalSources.css'
import { Steps } from 'intro.js-react'

const { Panel } = Collapse;
const { Title, Text } = Typography;

interface IProps {
}

interface IState {
    stepsEnabled: boolean,
    initialStep: number,
    steps: {title: string, element: string, intro: string}[]
}
export default class AllExternalSourcesPageOnboard extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);
        this.state = {
            stepsEnabled: true,
            initialStep: 0,
            steps: [
                {
                    title: "",
                    element: ".ApiMarketPlace",
                    intro: "Click here to access the API Marketplace."
                },
                {
                    title: "",
                    element: ".APItable",
                    intro: "Here is an example of an API added by another user. Clicking the arrow will expand it's contents."
                },
                {
                    title: "",
                    element: ".ApiUrl",
                    intro: "This row will contain the URL the API uses to return its data."
                },
                {
                    title: "",
                    element: ".ExampleUrl",
                    intro: "This example API uses 'example.org' for its URL."
                },
                {
                    title: "",
                    element: ".ApiRoot",
                    intro: "This row will contain the root of the data the API returns."
                },
                {
                    title: "",
                    element: ".ExampleRoot",
                    intro: "This example API uses 'data' for its root."
                },
                {
                    title: "",
                    element: ".ApiTableInfo",
                    intro: "This section shows the different fields of the data that the API returns."
                },
                {
                    title: "",
                    element: ".name",
                    intro: "This column displays the name of the field."
                },
                {
                    title: "",
                    element: ".type",
                    intro: "This column displays the type of the field."
                },
                {
                    title: "",
                    element: ".description",
                    intro: "This column displays the description of the field."
                },
                {
                    title: "",
                    element: ".ApiTableInfo",
                    intro: "This example API contains a field '{stringOne: hello}' which is of type String."
                },
                {
                    title: "{data: [{ stringOne: example }, { stringOne: example2 }]}",
                    element: ".APItable",
                    intro: "Overall, this 'example.org' API will return a JSON array that will look something like above."
                },
                {
                    title: "",
                    element: ".addToCollection",
                    intro: "To add this API to your collection, simply click this button."
                },
                {
                    title: "",
                    element: ".addOwnButton",
                    intro: "To add your own API, simply click this button."
                },
                {
                    title: "",
                    element: ".externalApiDemo",
                    intro: "This newly added API will show up in your personal external sources. Good luck!"
                }
            ]
        }
    }
    handleAddApi() {
        window.location.href = "/external-sourcesOnboard";
    }

    onExit = () => {
        this.setState(() => ({ stepsEnabled: false }));
        window.location.href = "/";
    };

    toggleSteps = () => {
        this.setState((prevState) => ({ stepsEnabled: !prevState.stepsEnabled }));
    };

    render() {
        const dataSource:any = []
        const allDataSources:any = []

        var fieldTypes: TExternalSourceFieldType = "string"; 
        var paramTypes: TExternalSourceFieldType = "date"; 
        const newField = {'name': 'stringOne', 'type': fieldTypes, 'description': 'example'};
        const newParam = {'name': 'paramDate', 'type': paramTypes, 'description': 'paramExample'};
        const example:IExternalSource = {"name":"ExampleAPI","url":"example.org","fields":[newField],"root":"data", "params":[newParam]}

        const newData = {key: '0', json: JSON.stringify(example)}
        dataSource.push(newData)

        allDataSources.push(example);

        const columns = [
            { key: 'name', dataIndex: 'name', title: "API Name" },
            { key: 'url', dataIndex: 'url', title: "URL" },
            { key: 'root', dataIndex: 'root', title: "Root" },
            { key: 'fields', dataIndex: 'fields', title: "Fields" },
        ]

        return (
            <div style={{padding: '0.5em'}}>
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
                <Title level={3}>Your selected data sources</Title>
                
                <List>
                    <List.Item key="0">
                        <Button className="addOwnButton" type='primary'>Add your own</Button>
                    </List.Item>
                </List>
                <br />
                <Space size={[50,100]} wrap style={{display: 'none'}}>

                    {dataSource.map((data:any, index:any) => (
                        <Button 
                            size="large" 
                            className="DifferentAPI" 
                            
                            key={index}
                        >
                            {data.name}&nbsp;
                            <PlusOutlined className="plusIcon"/> 
                        </Button>
                    ))}
                </Space>
                <br />
                <Title level={3}>Use an existing data source</Title>
                <Collapse className="APItable" defaultActiveKey={['0']}> 
                    {Object.values(allDataSources).map((es:any, index:any) => (
                        <Panel 
                            style={{padding: 0}}
                            header={
                                <>
                                    <p>{es.name}</p>
                                    <Button 
                                        className="addToCollection"
                                        type='primary' 
                                        style={{position: 'absolute', right: '1em'}}
                                    >
                                        Add to collection
                                    </Button>
                                </>
                            } 
                            key={index}
                        >
                            <div>
                                <div style={{width: '80%', margin: 'auto'}}>
                                    
                                    
                                </div>
                            </div>
                            <Descriptions bordered>
                                <Descriptions.Item className="ApiUrl" label="API Address" span={3}>
                                    <a className="ExampleUrl" href={es.url}>{es.url}</a> 
                                </Descriptions.Item>
                                <Descriptions.Item className="ApiRoot" label="API Root" span={3}>
                                    <Text className="ExampleRoot">{es.root}</Text>
                                </Descriptions.Item>

                            </Descriptions>
                            
                            <Table 
                                className="ApiTableInfo"
                                dataSource={es.fields.map((f:any) => {
                                    // use all this as key to be as unique as possible
                                    return {key: f.name + f.type, ...f}
                                })} 
                                pagination={false} columns={[
                                    { className:"name", key: 'name', dataIndex: 'name', title: "Name" },
                                    { className:"type", key: 'type', dataIndex: 'type', title: "Type" },
                                    { className:"description", key: 'description', dataIndex: 'description', title: "Description" },
                                ]} 
                            />
                        </Panel>
                    ))}
                </Collapse>        
            </div>
        )
    }
}