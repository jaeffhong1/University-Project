import { Select } from "antd";
import React from "react";
import { TReactComponent } from "../DashboardHome";
import { TExternalSourceFieldType } from "../sources/ExternalSource";
import { GenericScatter } from "./generics/GenericScatter";
import { WidgetProps } from "./Widget";

const { Option } = Select;

const allGenericWidgets: {[key: string]: TReactComponent} = {
    'Scatter Plot': GenericScatter,
}

export class GenericSelector extends React.Component<
    WidgetProps,
    {
        externalSourceName: string | null;
        fields: string[];
        generic: string | null
    }
> {
    constructor(props: WidgetProps) {
        super(props);
        this.state = {
            externalSourceName: null,
            fields: [],
            generic: null,
        };
    }

    handleNameChange(value: string) {
        this.setState({ externalSourceName: value, fields: [], generic: null });
    }

    handleFieldsChange(fields: string[]) {
        // this.setState({externalSourceName: value})
        this.setState({ fields, generic: null });
    }

    handleGenericChange(value: string) {
        this.setState({ generic: value });
    }

    render() {
        return (
            <>
                <Select
                    style={{ width: "100%", margin: 8 }}
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
                {this.state.externalSourceName !== null && (
                    <Select
                        style={{ width: "100%", margin: 8 }}
                        mode="multiple"
                        allowClear
                        placeholder="Select fields"
                        onChange={this.handleFieldsChange.bind(this)}
                        value={this.state.fields}
                    >
                        {this.props.externalSources[
                            this.state.externalSourceName
                        ].fields.map((field) => (
                            <Option key={field.name}>
                                <code>{field.name}</code>: {field.description} (
                                <code>{field.type}</code>)
                            </Option>
                        ))}
                    </Select>
                )}
                {this.state.fields.length > 0 && (
                    <Select
                        placeholder="Select a generic widget"
                        onChange={this.handleGenericChange.bind(this)}
                        style={{ width: "100%", margin: 8 }}
                        allowClear
                        value={this.state.generic}
                    >
                        {Object.keys(allGenericWidgets)
                            .filter((name: string) => {
                                const wid = allGenericWidgets[name]
                                // @ts-ignore
                                const supports = wid.supports
                                if (!supports)
                                    return false;
                                if (this.state.externalSourceName === null)
                                    throw new Error("assertion error") // help typescript a little
                                const fieldTypes: {[key:string]: TExternalSourceFieldType} = {}
                                for (let field of this.props.externalSources[this.state.externalSourceName].fields) {
                                    fieldTypes[field.name] = field.type
                                }
                                return supports(fieldTypes, this.state.fields);
                            })
                            .map((name: string) => (
                                <Option key={name}>{name}</Option>
                            ))}
                    </Select>
                )}
            </>
        );
    }
}
