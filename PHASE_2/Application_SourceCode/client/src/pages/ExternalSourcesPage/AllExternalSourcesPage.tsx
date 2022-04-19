import { Button, Form, Table, Input, Dropdown, Menu, Checkbox, Tooltip, Space } from "antd";
import TextArea from "antd/lib/input/TextArea";
import React, {useState} from "react";
import { Link } from "react-router-dom";
import { IExternalSource, TExternalSourceFieldType, TExternalSources } from "../Dashboard/DashboardHome/sources/ExternalSource";
import { DownOutlined, PlusOutlined } from '@ant-design/icons';
import './AllExternalSources.css'
export class AllExternalSourcesPage extends React.Component<{
    externalSources: TExternalSources | null,
    setExternalSources: (s: {[name: string]: IExternalSource}) => void
}> {

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
                json: JSON.stringify(es),
            })
        }


        const allDataSources:any = []
        for (let es of dataSource) {
            const dataDict = JSON.parse(es.json);
            allDataSources.push(dataDict);
        }

        var fieldTypes: TExternalSourceFieldType = "string"; 
//        const newField = {'name': 'example', 'type': fieldTypes, 'description': 'examplle'};
 //       const example:IExternalSource = {"name":"ExampleAPI","url":"example.org","fields":[newField],"root":"data"}

  //      if (!(this.containsObject(example, allDataSources))) {
  //          allDataSources.push(example)
  //      }
        const columns = [
            { key: 'json', dataIndex: 'json', title: "JSON" },
        ]

        const types = ['date', 'string', 'number']
        return (
            <div>
                <Table 
                    dataSource={dataSource} 
                    columns={columns} 
                    pagination={false}
                />

                <Space size={[50,100]} wrap style={{padding: '3em', width: '60%', margin: 'auto'}}>
                    <Button size="large" className="addAPI" key={0}>
                        <Link to="add">
                            Add an API&nbsp;
                            <PlusOutlined style={{color: "blue"}} className="plusIcon"/>
                        </Link>
                    </Button>

                    {allDataSources.map((data:any, index:any) => (
                        <Button size="large" className="DifferentAPI" onClick={this.addApi.bind(this, data.name, allDataSources[index])} key={index+1}>{data.name} <PlusOutlined className="plusIcon"/> </Button>
                    ))}
                </Space>
            </div>
        )
    }
}