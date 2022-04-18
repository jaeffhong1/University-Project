import { Button, Form, Table } from "antd";
import TextArea from "antd/lib/input/TextArea";
import React from "react";
import { IExternalSource, TExternalSources } from "../Dashboard/DashboardHome/sources/ExternalSource";

function validateExternalSource(externalSource: any): string | null {
    if (!('url' in externalSource))
        return "missing url field"
    // FIXME: check the other things
    return null // no error
}

export class ExternalSourcesPage extends React.Component<{
    externalSources: TExternalSources | null;
    setExternalSources: (s: {[name: string]: IExternalSource}) => void
}> {
    onFinish(values: {json: string, name: string}) {
        let es: IExternalSource;
        try {
            es = JSON.parse(values.json)
        } catch (e) {
            // FIXME: show good looking modal
            alert("error: " + e + "\n\n" + values.json)
            return
        }

        const errorMessage = validateExternalSource(es)
        if (errorMessage !== null) {
            // FIXME: show good looking modal
            alert("error: " + errorMessage)
            return
        }

        this.props.setExternalSources({...this.props.externalSources, [values.name]: es})
    }
    

    onFinishFailed() {
        // FIXME
        alert("failed for some reason")
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
        const columns = [
            { key: 'json', dataIndex: 'json', title: "JSON" },
        ]
        return <div style={{padding: '12px'}}>
            <Table dataSource={dataSource} columns={columns} />
            <Form
                style={{marginTop: 24}}
                name="basic"
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 16 }}
                initialValues={{ remember: true }}
                onFinish={this.onFinish.bind(this)}
                onFinishFailed={this.onFinishFailed.bind(this)}
                autoComplete="off"
                >
                <Form.Item
                    label="Name"
                    name="name"
                    rules={[{ required: true, message: 'Please enter the name' }]}
                >
                    <TextArea />
                </Form.Item>
                <Form.Item
                    label="Information (JSON)"
                    name="json"
                    rules={[{ required: true, message: 'Please enter the information' }]}
                >
                    <TextArea placeholder="grep code base for IExternalSource to see the expected structure" />
                </Form.Item>

                <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
                    <Button type="primary" htmlType="submit">
                    Submit
                    </Button>
                </Form.Item>
                </Form>
        </div>
    }
}