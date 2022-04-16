import { Button, Form, Table, Input, Dropdown, Menu, Checkbox, Tooltip, Space } from "antd";
import TextArea from "antd/lib/input/TextArea";
import React, {useState} from "react";
import { IExternalSource, TExternalSourceFieldType } from "../Dashboard/DashboardHome/sources/ExternalSource";
import { DownOutlined, PlusOutlined } from '@ant-design/icons';
import { format } from "path";
import './AllExternalSources.css'
export class AllExternalSourcesPage extends React.Component<{
    externalSources: {[name: string]: IExternalSource},
    setExternalSources: (s: {[name: string]: IExternalSource}) => void
}> {

    handleAddApi() {
        window.location.href = "/dashboard/external-sources";
    }

    addApi(name: string, object: IExternalSource) {
        let es: IExternalSource;
        es = {"name": object.name, "url": object.url, "fields": object.fields, "root": object.root};
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
        const dataSource = []
        let i = 0;
        for (let es of Object.values(this.props.externalSources)) {
            dataSource.push({
                key: '' + (i++),
                json: JSON.stringify(es),
            })
        }


        const allDataSources:any = []
        for (let es of dataSource) {
            const dataDict = JSON.parse(es.json);
            allDataSources.push(dataDict);
        }

        var fieldTypes: TExternalSourceFieldType = "string"; 
        const newField = {'name': 'example', 'type': fieldTypes, 'description': 'examplle'};
        const example:IExternalSource = {"name":"ExampleAPI","url":"example.org","fields":[newField],"root":"data"}

        if (!(this.containsObject(example, allDataSources))) {
            allDataSources.push(example)
        }
        const columns = [
            { key: 'json', dataIndex: 'json', title: "JSON" },
        ]

        const types = ['date', 'string', 'number']
        return <div style={{padding: '12px'}}>
            <Table dataSource={dataSource} columns={columns} />

            <Space size={[50,100]} wrap>
                <Button size="large" className="addAPI" onClick={this.handleAddApi}>
                    Add an API
                    <PlusOutlined style={{color: "blue"}} className="plusIcon"/>
                </Button>

                {allDataSources.map((data:any, index:any) => (
                    <Button size="large" className="DifferentAPI" onClick={this.addApi.bind(this, data.name, allDataSources[index])} key={index}>{data.name} <PlusOutlined className="plusIcon"/> </Button>
                ))}
            </Space>
        </div>
    }
}