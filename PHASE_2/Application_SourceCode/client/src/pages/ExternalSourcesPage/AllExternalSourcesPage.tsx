import { PlusOutlined } from '@ant-design/icons';
import { Button, message, Space, Table, Collapse, Typography, Descriptions, List } from "antd";
import React from "react";
import { IExternalSource, TExternalSources } from "../Dashboard/DashboardHome/sources/ExternalSource";
import './AllExternalSources.css';

const { Panel } = Collapse;
const { Title, Text } = Typography;

export class AllExternalSourcesPage extends React.Component<{
    userExternalSources: TExternalSources | null,
    externalSources: TExternalSources | null,
    setExternalSources: (s: {[name: string]: IExternalSource}) => void
}> {

    addApi(name: string, object: IExternalSource) {
        let es: IExternalSource;
        es = {"name": object.name, "url": object.url, "fields": object.fields, "root": object.root, "params":object.params};
        if (this.props.userExternalSources != null && name in this.props.userExternalSources) {
            message.info("API already in your external sources!");
            return;
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

        this.props.setExternalSources(new_es);
        message.info("Api Added!");
    }

    containsObject(obj:IExternalSource, list:IExternalSource[]) {
        var i;
        for (i = 0; i < list.length; i++) {
            if (list[i].name === "ExampleAPI") {
                return true;
            }
        }
    
        return false;
    }

    render() {
        if (!this.props.externalSources)
            return <p>Loading external sources, please wait...</p>

        const dataSource:any = []
        for (let es of Object.values(this.props.externalSources)) {
            dataSource.push({
                key: es.name,
                name: es.name,
                url: es.url,
                root: es.root,
                fields: es.fields,
                params: es.params
            })
        }

        const columns = [
            { key: 'name', dataIndex: 'name', title: "API Name" },
            { key: 'url', dataIndex: 'url', title: "URL" },
            { key: 'root', dataIndex: 'root', title: "Root" },
            { key: 'fields', dataIndex: 'fields', title: "Fields" },
        ]

        return (
            <div style={{padding: '0.5em'}}>
                <br />
                <Title level={3}>Global Marketplace</Title>
                
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
                <Collapse>
                    {Object.values(this.props.externalSources).map((es, index) => (
                        <Panel 
                            style={{padding: 0}}
                            header={
                                <>
                                    <p>{es.name}</p>
                                    <div onClick={(e => e.stopPropagation())}>
                                        <Button 
                                            type='primary' 
                                            disabled={this.props.userExternalSources !== null && es.name in this.props.userExternalSources}
                                            style={{position: 'absolute', right: '1em'}}
                                            onClick={this.addApi.bind(this, es.name, dataSource[index])} 
                                        >
                                            Add source
                                        </Button>
                                    </div>
                                </>
                            } 
                            key={index}
                        >
                            <div>
                                <div style={{width: '80%', margin: 'auto'}}>
                                    
                                    
                                </div>
                            </div>
                            <Descriptions bordered>
                                <Descriptions.Item label="API Address" span={3}>
                                    <a href={es.url}>{es.url}</a> 
                                </Descriptions.Item>
                                <Descriptions.Item label="API Root" span={3}>
                                    <Text>{es.root}</Text>
                                </Descriptions.Item>

                            </Descriptions>
                            
                            <Table 
                                dataSource={es.fields.map(f => {
                                    // use all this as key to be as unique as possible
                                    return {key: f.name + f.type, ...f}
                                })} 
                                pagination={false} columns={[
                                    { key: 'name', dataIndex: 'name', title: "Name" },
                                    { key: 'type', dataIndex: 'type', title: "Type" },
                                    { key: 'description', dataIndex: 'description', title: "Description" },
                                ]} 
                            />
                        </Panel>
                    ))}
                </Collapse>        
            </div>
        )
    }
}