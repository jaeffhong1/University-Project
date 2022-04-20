import { PlusOutlined ,MinusOutlined } from '@ant-design/icons';
import { Button, message, Space, Table, Collapse, Typography, Descriptions, List } from "antd";
import React from "react";
import { Link } from 'react-router-dom';
import { IExternalSource, TExternalSources } from "../Dashboard/DashboardHome/sources/ExternalSource";
import './AllExternalSources.css';

const { Panel } = Collapse;
const { Title, Text } = Typography;

export class UserExternalSourcesPage extends React.Component<{
    userExternalSources: TExternalSources | null,
    setUserExternalSources: (s: {[name: string]: IExternalSource}) => void
}> {
    handleAddApi() {
        window.location.href = "/externalSources/add";
    }

    removeApi(name: string, object: IExternalSource) {
        let es: IExternalSource;
        let new_es: TExternalSources = {};

        let userData:any = localStorage.getItem('userExternalSources');
        if (userData == null) {
            userData = [];
        } else {
            userData = JSON.parse(userData);
        }

        let i = 0;
        while (i < userData.length) {
            if (userData[i]['name'] == name) {
                userData.splice(i, 1);
                i -= 1;
            }
            i += 1;
        }


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
        userData = localStorage.getItem('userExternalSources');
        this.props.setUserExternalSources(new_es);
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


    componentDidMount() {
        let userData:any = localStorage.getItem('userExternalSources');
        if (userData == null) {
            userData = [];
        } else {
            userData = JSON.parse(userData);
        }
        this.props.setUserExternalSources(userData);
        localStorage.setItem('userExternalSources', JSON.stringify(userData));
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

        return (
            <div style={{padding: '0.5em'}}>
                <Title level={3}>Your selected data sources</Title>
                
                <List>
                    <List.Item key="0">
                        <Button onClick={this.handleAddApi} type='primary'>Add your own</Button>
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
                <Title level={3}>All owned data source</Title>
                <Collapse>
                    {dataSource.map((es:any, index:any) => (
                        <Panel 
                            style={{padding: 0}}
                            header={
                                <>
                                    <p>{es.name}</p>
                                    <div onClick={(e => e.stopPropagation())}>
                                        <Button 
                                            type='primary' 
                                            style={{position: 'absolute', right: '1em'}}
                                            onClick={this.removeApi.bind(this, es.name, dataSource[index])} 
                                        >
                                            Remove from collection
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