import { PlusOutlined } from '@ant-design/icons';
import { Button, Space, Table } from "antd";
import React from "react";
import { IExternalSource, TExternalSources } from "../Dashboard/DashboardHome/sources/ExternalSource";
import './AllExternalSources.css';
export class AllExternalSourcesPage extends React.Component<{
    externalSources: TExternalSources | null,
    setExternalSources: (s: {[name: string]: IExternalSource}) => void
}> {

    handleAddApi() {
        window.location.href = "/dashboard/external-sources";
    }

    addApi(name: string, object: IExternalSource) {
        let es: IExternalSource;
        es = {"name": object.name, "url": object.url, "fields": object.fields, "root": object.root, "params":object.params};
        this.props.setExternalSources({...this.props.externalSources, [name]: es})
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

        const dataSource = []
        let i = 0;
        for (let es of Object.values(this.props.externalSources)) {
            dataSource.push({
                key: '' + (i++),
                name: es.name,
                url: es.url,
                root: <code>'{es.root}'</code>,
                fields: <Table dataSource={es.fields} columns={[
                    { key: 'name', dataIndex: 'name', title: "Name" },
                    { key: 'description', dataIndex: 'description', title: "Description" }
                ]} />
            })
        }

        const columns = [
            { key: 'name', dataIndex: 'name', title: "API Name" },
            { key: 'url', dataIndex: 'url', title: "URL" },
            { key: 'root', dataIndex: 'root', title: "Root" },
            { key: 'fields', dataIndex: 'fields', title: "Fields" },
        ]


        return <div style={{padding: '12px'}}>
            {Object.values(this.props.externalSources).map(es => (
                <>
                    <h2>{es.name} <small><a href={es.url}>{es.url}</a> <code style={{marginLeft: 12}}>root='{es.root}'</code></small></h2>
                    
                    <Table dataSource={es.fields} columns={[
                        { key: 'name', dataIndex: 'name', title: "Name" },
                        { key: 'type', dataIndex: 'type', title: "Type" },
                        { key: 'description', dataIndex: 'description', title: "Description" },
                    ]} />
                </>
            ))}

            <Space size={[50,100]} wrap>
                <Button size="large" className="addAPI" onClick={this.handleAddApi}>
                    Add an API
                    <PlusOutlined style={{color: "blue"}} className="plusIcon"/>
                </Button>
            </Space>
        </div>
    }
}