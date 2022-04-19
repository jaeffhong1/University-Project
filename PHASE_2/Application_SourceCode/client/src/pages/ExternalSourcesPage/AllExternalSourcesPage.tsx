import { PlusOutlined } from '@ant-design/icons';
import { Button, message, Space, Table } from "antd";
import React from "react";
import { IExternalSource, TExternalSources, TExternalSourceFieldType } from "../Dashboard/DashboardHome/sources/ExternalSource";
import './AllExternalSources.css';
import { UserExternalSourcesPage } from './UserExternalSources';
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
        this.props.setExternalSources({...this.props.userExternalSources, [name]: es})
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
        let i = 0;
        for (let es of Object.values(this.props.externalSources)) {
            dataSource.push({
                key: '' + (i++),
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


        return <div style={{padding: '0.5em'}}>
            {Object.values(this.props.externalSources).map((es, index) => (
                <div key={index}>
                    <h2>{es.name} <small><a href={es.url}>{es.url}</a> <code style={{marginLeft: 12}}>root='{es.root}'</code></small></h2>
                    
                    <Table dataSource={es.fields} pagination={false} columns={[
                        { key: 'name', dataIndex: 'name', title: "Name" },
                        { key: 'type', dataIndex: 'type', title: "Type" },
                        { key: 'description', dataIndex: 'description', title: "Description" },
                    ]} />
                </div>
            ))}

            <Space size={[50,100]} wrap>
                {dataSource.map((data:any, index:any) => (
                    <Button 
                        size="large" 
                        className="DifferentAPI" 
                        onClick={this.addApi.bind(this, data.name, dataSource[index])} 
                        key={index}
                    >
                        {data.name}&nbsp;
                        <PlusOutlined className="plusIcon"/> 
                    </Button>
                ))}
            </Space>
        </div>
    }
}