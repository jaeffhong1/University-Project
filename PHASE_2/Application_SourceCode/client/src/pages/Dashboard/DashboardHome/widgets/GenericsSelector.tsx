import { Button, Select } from "antd";
import React from "react";
import CacheSystem from "../CacheSystem";
import { TExternalSourceFieldType, TExternalSources } from "../sources/ExternalSource";
import { GenericBoxPlot } from "./generics/GenericBoxPlot";
import { GenericHistogram } from "./generics/GenericHistogram";
import { GenericScatter } from "./generics/GenericScatter";
import { WidgetProps } from "./Widget";

const { Option } = Select;

const allGenericWidgets: { [key: string]: typeof React.Component } = {
    "Scatter Plot": GenericScatter,
    "Histogram": GenericHistogram,
    "Box Plots": GenericBoxPlot,
};

export class GenericSelector extends React.Component<
    WidgetProps,
    {
        externalSourceName: string | null;
        fields: string[];
        generic: string | null;
        axes: any[][] | null; // data fetched from the external source, formatted by axis
    }
> {
    constructor(props: WidgetProps) {
        super(props);
        this.state = {
            externalSourceName: null,
            fields: [],
            generic: null,
            axes: null,
        };

        let userData:any = localStorage.getItem('userExternalSources');
        let new_es: TExternalSources = {};
        if (userData == null) {
            userData = [];
        } else {
            userData = JSON.parse(userData);
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
        this.props.setExternalSources(new_es);
    }

    handleNameChange(value: string) {
        this.setState({
            externalSourceName: value,
            fields: [],
            generic: null,
            axes: null,
        });
    }

    handleFieldsChange(fields: string[]) {
        this.setState({ fields, generic: null, axes: null });
    }

    handleGenericChange(value: string) {
        this.setState({ generic: value, axes: null });
        (async () => {
            if (!this.state.externalSourceName) throw new Error("assertion");
            const src =
                this.props.externalSources[this.state.externalSourceName];
            const url = new URL(
                "http://seng3011.duckdns.org:8086/front-end/forward"
            );
            url.searchParams.append("url", src.url);
            const resp = await CacheSystem.fetch(url.toString() + "-01", 60 * 60, url.toString());
            if (typeof resp !== "string") {
                alert("response != 200:" + (await resp.text()));
                return;
            }
            let items = JSON.parse(resp)
            if (src.root !== null && src.root != "") {
                const parts = src.root.split('.')
                for (let part of parts) {
                    items = items[part]
                }
            }
            // FIXME: ensure items is in the right format

            const axesDict: { [field: string]: any[] } = {};
            for (let item of items) {
                for (let field of this.state.fields) {
                    if (!axesDict[field]) axesDict[field] = [];
                    let v = item[field];
                    // @ts-ignore
                    const type = src.fields.find(e => e.name == field).type
                    if (type == "date-concatenated-number") {
                        // date is number like: 20210307
                        const year = Math.floor(v / 1e4)
                        const month = (v - year) / 1e2
                        const day = v % 100;
                        v = (new Date(year, month, day)).toDateString()
                    }
                    axesDict[field].push(v);
                }
            }

            const axes = [];
            for (let field of Object.values(axesDict)) {
                axes.push(field);
            }

            this.setState({ axes });
        })();
    }

    render() {
        if (this.state.generic) {
            if (this.state.axes === null) {
                return <p>Loading data from the API, please wait...</p>;
            } else {
                const T = allGenericWidgets[this.state.generic];
                return <>
                    <Button onClick={() => this.setState({generic: null})} style={{marginBottom: '12px'}}>Re-select</Button>
                    <T axes={this.state.axes} axisNames={this.state.fields} />;
                </>
            }
        }
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
                                const wid = allGenericWidgets[name];
                                // @ts-ignore
                                const supports = wid.supports;
                                if (!supports) return false;
                                if (this.state.externalSourceName === null)
                                    throw new Error("assertion error"); // help typescript a little
                                const fieldTypes: {
                                    [key: string]: TExternalSourceFieldType;
                                } = {};
                                for (let field of this.props.externalSources[
                                    this.state.externalSourceName
                                ].fields) {
                                    fieldTypes[field.name] = field.type;
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
