import React from "react";
import { PageHeader, Button, Input, DatePicker } from "antd";
import { useLocation } from "react-router-dom";
import { HistoryRouterProps } from "react-router-dom";
import moment, { Moment } from 'moment';
import { RangeValue } from 'rc-picker/lib/interface'
import { DataSourceSelect } from "./DataSourceSelect";
import DataStore from "../datastore";

interface IProps {
    datastore: DataStore,
}
interface IState {
    selectedDataSource: string,
    startTime: string,
    endTime: string
}

export default class DashboardHeader extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);
    }

    state: IState = {
        selectedDataSource: this.props.datastore.GetDataSource(),
        startTime: this.props.datastore.GetStartTime(),
        endTime: this.props.datastore.GetEndTime()
    }

    private getMomentTimes(): [Moment, Moment]  {
        // ant requires time data in the form of Moment objects:
        let start:Moment = moment(this.state.startTime);
        let end: Moment = moment(this.state.endTime);

        let tuple: [Moment, Moment] = [start, end];
        return tuple;
    }

    componentDidUpdate(prevProps: IProps) {
        // check if we need to update our state from the datastore prop
        if(this.state.selectedDataSource !== this.props.datastore.GetDataSource()) {
            this.setState({selectedDataSource: this.props.datastore.GetDataSource()});
        }
        if(this.state.startTime !== this.props.datastore.GetStartTime()) {
            this.setState({startTime: this.props.datastore.GetStartTime()});
        }
        if(this.state.endTime !== this.props.datastore.GetEndTime()) {
            this.setState({endTime: this.props.datastore.GetEndTime()});
        }
    }

    handleCalendarChange = (dates: RangeValue<Moment>, dateStrings: [string, string], info: any) => {
        //console.log(dates);
        //console.log(dateStrings);
        
        // update datastore
        this.props.datastore.SetStartTime(dateStrings[0]);
        this.props.datastore.SetEndTime(dateStrings[1]);

        // datastore will update our state for us (through prop propagation)
    }

    render() {
        return (
            <PageHeader
                style={{borderBottom: '1px solid rgb(235, 237, 240)', height: '4em', paddingTop: '0.5em', paddingBottom: '0.4em'}}
                ghost={false}
                //onBack={() => window.history.back()}
                title="Dashboard"
                subTitle="Welcome to your dashboard"
                extra={[
                    <DatePicker.RangePicker 
                        className="date_picker"
                        key="1" 
                        showTime={true} 
                        defaultValue={this.getMomentTimes()}
                        onCalendarChange={this.handleCalendarChange}
                    />,
                    //<Button className="key_terms" key="2">Key terms</Button>,
                    <DataSourceSelect key="3" datastore={this.props.datastore} />
                ]}
            />
        )
    }
    
}



