import { PlusOutlined ,MinusOutlined } from '@ant-design/icons';
import { Button, Space, Table } from "antd";
import React from "react";
import { Link } from 'react-router-dom';
import { IExternalSource, TExternalSources } from "../Dashboard/DashboardHome/sources/ExternalSource";
import './AllExternalSources.css';

export class UserExternalSourcesPage extends React.Component<{
    externalSources: TExternalSources | null,
    setExternalSources: (s: {[name: string]: IExternalSource}) => void
}> {
    handleAddApi() {
        window.location.href = "/dashboard/external-sources";
    }

    removeApi(name: string, object: IExternalSource) {
        let es: IExternalSource;
        let new_es: TExternalSources = {...this.props.externalSources};
        delete new_es[name];
        this.props.setExternalSources(new_es);


        let userData:any = localStorage.getItem('userExternalSources');
        userData = JSON.parse(userData);

        let i = 0;
        while (i < userData.length) {
            if (userData[i]['name'] == name) {
                userData.splice(i, 1);
                i -= 1;
            }
            i += 1;
        }
        localStorage.setItem('userExternalSources', JSON.stringify(userData));  
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
        const localLength = localStorage.length;
        let local_i = localLength - 5;
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
        let userData:any = localStorage.getItem('userExternalSources');
        if (userData == null) {
            userData = [];
        } else {
            userData = JSON.parse(userData);
        }
        for (let data of dataSource) {
            let alreadyIn = 0;
            for (let externalData of userData) {
                if (data['name'] == externalData['name']) {
                    alreadyIn = 1;
                    break;
                }
            }
            if (!(alreadyIn)) {
                userData.push(data);
            }
        }
        
        localStorage.setItem('userExternalSources', JSON.stringify(userData));  

        for (let userExternal of userData) {
            let alreadyIn = 0;
            for (let data of dataSource) {
                if (data['name'] == userExternal['name']) {
                    alreadyIn = 1;
                    break;
                }
            }
            if (!(alreadyIn)) {
                dataSource.push(userExternal);
            }
        }
        
        const columns = [
            { key: 'name', dataIndex: 'name', title: "API Name" },
            { key: 'url', dataIndex: 'url', title: "URL" },
            { key: 'root', dataIndex: 'root', title: "Root" },
            { key: 'fields', dataIndex: 'fields', title: "Fields" },
        ]


        return <div style={{padding: '0.5em'}}>
            {Object.values(dataSource).map((es:any, index:any) => (
                <div key={index}>
                    <h2>
                        {es.name} 
                        <small>
                            <a href={es.url}>{es.url}</a> 
                            <code style={{marginLeft: 12}}>root='{es.root}'</code>
                        </small>
                    </h2>
                    
                    <Table dataSource={es.fields} pagination={false} columns={[
                        { key: 'name', dataIndex: 'name', title: "Name" },
                        { key: 'type', dataIndex: 'type', title: "Type" },
                        { key: 'description', dataIndex: 'description', title: "Description" },
                    ]} />
                </div>
            ))}

            <Space size={[50,100]} wrap>
                <Button size="large" className="addAPI" key="0">
                    
                    <Link to="/externalSources/add">
                        Add an API
                        <PlusOutlined style={{color: "blue"}} className="plusIcon"/>
                    </Link>
                    
                </Button>

                {dataSource.map((data:any, index:any) => (
                    <Button size="large" className="DifferentAPI" onClick={this.removeApi.bind(this, data.name, dataSource[index])} key={index+1}>{data.name} <MinusOutlined className="plusIcon"/> </Button>
                ))}
            </Space>
        </div>
    }
}