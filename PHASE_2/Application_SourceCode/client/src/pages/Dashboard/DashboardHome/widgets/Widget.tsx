import { Button, DatePicker, Input, Modal, Select } from 'antd'
import moment from 'moment'
import React from 'react'
import {
    dateToString,
    fetchSource,
    TReactComponent,
    TSource,
    TSources
} from '../DashboardHome'
import { TExternalSources } from '../sources/ExternalSource'
import { SourceAdaptor } from '../SourceSelectors'
import WidgetSelector from './WidgetSelector'

interface Props {
    mosaic: {
        id: string
        titleMap: Record<string, string>
    }
    globalSource: TSource | null
    sourceAdaptors: { [key: string]: SourceAdaptor }
    externalSources: TExternalSources
    allWidgets: { [key: string]: TReactComponent }
}

export interface WidgetProps {
    allWidgets: { [key: string]: TReactComponent }
    source: TSource
    externalSources: TExternalSources
}

interface State {
    selectedSourceName: keyof TSources
    type: string
    source: TSource | 'global'
    selectingLocalSource: boolean

    localSourceName: string | null
    localLocation: string
    localKeyTerms: string
    localDates: {
        start: string
        end: string
    } | null
    loadingLocalSource: boolean
}

export default class Widget extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {
            type: 'select',
            selectedSourceName: 'Epiwatch',
            source: 'global',
            selectingLocalSource: false,
            localDates: null,
            localSourceName: null,
            localLocation: '',
            localKeyTerms: '',
            loadingLocalSource: false,
        }
    }

    render() {
        if (this.state.type === 'select') {
            return (
                <WidgetSelector
                    setType={(type) => this.setState({ type })}
                    allWidgets={this.props.allWidgets}
                />
            )
        } else if (this.props.globalSource == null) {
            return <p>Global source is loading, please wait</p>
        } else {
            const T = this.props.allWidgets[this.state.type]
            if (T === undefined) {
                return (
                    <p>
                        Unknown widget type <code>{this.state.type}</code>
                    </p>
                )
            }
            return (
                <>
                    <Button
                        onClick={() =>
                            this.setState({ selectingLocalSource: true })
                        }
                    >
                        Select local state
                    </Button>
                    <Modal
                        visible={this.state.selectingLocalSource}
                        title="Select local source"
                        onCancel={() =>
                            this.setState({ selectingLocalSource: false })
                        }
                        onOk={() => {
                            ;(async () => {
                                if (!this.state.localSourceName) {
                                    alert("need to choose local source name")
                                    return;
                                }
                                this.setState({ loadingLocalSource: true })
                                let start, end
                                if (this.state.localDates) {
                                    start = this.state.localDates.start
                                    end = this.state.localDates.end
                                } else if (this.props.globalSource) {
                                    start = dateToString(
                                        this.props.globalSource.meta.start,
                                    )
                                    end = dateToString(
                                        this.props.globalSource.meta.end,
                                    )
                                } else {
                                    console.error(
                                        "local source and global source hasn't loaded yet",
                                    )
                                    return
                                }
                                const resp = await fetchSource(
                                    this.state.localSourceName,
                                    start,
                                    end,
                                    this.state.localLocation,
                                    this.state.localKeyTerms,
                                )
                                this.setState({
                                    source: resp,
                                    selectingLocalSource: false,
                                    loadingLocalSource: false,
                                })
                            })()
                        }}
                        okText="Use specified local source"
                        cancelText="Use global source"
                    >
                        <Select
                            style={{ width: '100%' }}
                            placeholder="Choose a source"
                            onChange={(value: string) => {
                                this.setState({
                                    localSourceName: value,
                                })
                            }}
                            value={this.state.localSourceName}
                        >
                            {Object.keys(this.props.sourceAdaptors).map(
                                (sourceName) => (
                                    <Select.Option
                                        value={sourceName}
                                        key={sourceName}
                                    >
                                        {sourceName}
                                    </Select.Option>
                                ),
                            )}
                        </Select>
                        <DatePicker.RangePicker
                            className="date_picker"
                            showTime={true}
                            defaultValue={[
                                moment(this.props.globalSource.meta.start),
                                moment(this.props.globalSource.meta.end),
                            ]}
                            onCalendarChange={(
                                _,
                                dateStrings: [string, string],
                            ) => {
                                this.setState({
                                    localDates: {
                                        start: dateStrings[0].replace(' ', 'T'),
                                        end: dateStrings[1].replace(' ', 'T'),
                                    },
                                })
                            }}
                        />
                        <Input
                            value={this.state.localKeyTerms}
                            onChange={(e: React.ChangeEvent) =>
                                this.setState({
                                    // @ts-ignore
                                    localKeyTerms: e.target.value,
                                })
                            }
                            placeholder="Key terms (comma separated)"
                        />
                        <Input
                            value={this.state.localLocation}
                            onChange={(e: React.ChangeEvent) =>
                                this.setState({
                                    // @ts-ignore
                                    localLocation: e.target.value,
                                })
                            }
                            placeholder="Location"
                        />
                        {this.state.loadingLocalSource && (
                            <p>Loading local source...</p>
                        )}
                    </Modal>
                    <T
                        source={
                            this.state.source === 'global'
                                ? this.props.globalSource
                                : this.state.source
                        }
                        externalSources={this.props.externalSources}
                        allWidgets={this.props.allWidgets}
                    />
                </>
            )
        }
    }
}
