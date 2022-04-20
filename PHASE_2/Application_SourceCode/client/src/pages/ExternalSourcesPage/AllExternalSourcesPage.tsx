import { PlusOutlined } from '@ant-design/icons';
import { Button, Collapse, Descriptions, message, Space, Table, Typography } from "antd";
import React from "react";
import { IExternalSource, TExternalSources } from "../Dashboard/DashboardHome/sources/ExternalSource";
import './AllExternalSources.css';

const { Panel } = Collapse;
const { Title, Text } = Typography;

export class AllExternalSourcesPage extends React.Component<{
    userExternalSources: TExternalSources,
    externalSources: TExternalSources,
    setExternalSources: (s: {[name: string]: IExternalSource}) => void
}> {

    addApi(name: string, object: IExternalSource) {
        let es: IExternalSource;
        es = {"name": object.name, "url": object.url, "fields": object.fields, "root": object.root, "params":object.params};
        if (this.props.userExternalSources != null && name in this.props.userExternalSources) {
            message.info("API already in your external sources!");
            return;
        }

        const newEs = {...this.props.userExternalSources, [object.name]: es}
        this.props.setExternalSources(newEs);
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

        // console.log('render', this.props.userExternalSources, this.props.externalSources)

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
                                            disabled={es.name in this.props.userExternalSources}
                                            style={{position: 'absolute', right: '1em'}}
                                            onClick={this.addApi.bind(this, es.name, dataSource[index])} 
                                        >
                                            Connect to dashboard
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