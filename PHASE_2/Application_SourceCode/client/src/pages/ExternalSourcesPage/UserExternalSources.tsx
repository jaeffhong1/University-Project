import { PlusOutlined } from '@ant-design/icons';
import { Button, Collapse, Descriptions, List, Space, Table, Typography } from "antd";
import React from "react";
import { IExternalSource, TExternalSources } from "../Dashboard/DashboardHome/sources/ExternalSource";
import './AllExternalSources.css';

const { Panel } = Collapse;
const { Title, Text } = Typography;

export class UserExternalSourcesPage extends React.Component<{
    userExternalSources: TExternalSources,
    setUserExternalSources: (s: {[name: string]: IExternalSource}) => void
}> {
    handleAddApi() {
        window.location.href = "/externalSources/add";
    }

    removeApi(name: string, object: IExternalSource) {
        const newEs = {...this.props.userExternalSources}
        delete(newEs[name])
        this.props.setUserExternalSources(newEs);
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
        if (!this.props.userExternalSources)
            return <p>Loading external sources, please wait...</p>

        const dataSource:any = []
        for (let es of Object.values(this.props.userExternalSources)) {
            dataSource.push({
                key: es.name,
                name: es.name,
                url: es.url,
                root: es.root,
                fields: es.fields,
                params: es.params
            })
        }
        console.log('rendering', this.props.userExternalSources)

        return (
            <div style={{padding: '0.5em'}}>
                <List>
                    <List.Item key="0">
                        <Button onClick={this.handleAddApi} type='primary'>Add your own data source</Button>
                    </List.Item>
                </List>
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
                <Title level={3}>Connected Sources</Title>
                <Collapse>
                    {dataSource.map((es:any, index:any) => (
                        <Panel 
                            style={{padding: 0}}
                            header={
                                <>
                                    <p>{es.name}</p>
                                    <div onClick={(e => e.stopPropagation())}>
                                        <Button 
                                            style={{ position: 'absolute', right: '1em'}}
                                            onClick={this.removeApi.bind(this, es.name, dataSource[index])} 
                                            danger
                                        >
                                            Disconnect from dashboard
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
                                dataSource={es.fields.map((f:any) => {
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