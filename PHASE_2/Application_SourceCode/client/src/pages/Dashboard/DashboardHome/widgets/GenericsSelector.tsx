import { Col, Row, Select } from "antd";
import React from "react";
import { TReactComponent } from "../DashboardHome";
import { WidgetProps } from "./Widget";

const { Option } = Select;

export class GenericSelector extends React.Component<
    WidgetProps,
    {
        externalSourceName: string | null;
        fields: string[] | null;
        generic: TReactComponent | null;
    }
> {
    constructor(props: WidgetProps) {
        super(props);
        this.state = {
            externalSourceName: null,
            fields: null,
            generic: null,
        };
    }
    handleNameChange(value: string) {
        this.setState({ externalSourceName: value });
    }
    handleFieldsChange(value: any) {
        // this.setState({externalSourceName: value})
        console.log(value);
    }

    render() {
        return (
            <Row gutter={[16, 16]}>
                <Col span={6}>
                    <Select
                        style={{ width: '100%' }}
                        onChange={this.handleNameChange.bind(this)}
                        value={this.state.externalSourceName}
                        placeholder="External source"
                    >
                        {Object.keys(this.props.externalSources).map(
                            (name: string) => (
                                <Option key={name}>{name}</Option>
                            )
                        )}
                    </Select>
                </Col>
                <Col span={12}>
                    {this.state.externalSourceName !== null && (
                        <Select
                            style={{ width: "100%" }}
                            mode="multiple"
                            allowClear
                            placeholder="Select fields"
                            onChange={this.handleFieldsChange.bind(this)}
                        >
                            {this.props.externalSources[
                                this.state.externalSourceName
                            ].fields.map((field) => (
                                <Option key={field.name}>
                                    {field.name}: {field.description} (
                                    <code>{field.type}</code>)
                                </Option>
                            ))}
                        </Select>
                    )}
                </Col>
            </Row>
        );
    }
}
