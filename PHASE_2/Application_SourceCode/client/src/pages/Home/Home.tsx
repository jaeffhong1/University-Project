import React from 'react';
import DataStore from '../../datastore';
import { Button, Layout, Menu, Typography } from 'antd';
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";

interface IProps {
    datastore: DataStore,
}

interface IState {
    selectedDataSource: string
}

export default class Home extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props); 
    }

    state: IState = {
        selectedDataSource: this.props.datastore.GetDataSource()
    }

    componentDidUpdate(prevProps: IProps) {
        // check if we need to update our state from the datastore prop
        if(this.state.selectedDataSource !== this.props.datastore.GetDataSource()) {
            console.log(prevProps.datastore.GetDataSource() + " --> " + this.props.datastore.GetDataSource())
            this.setState({selectedDataSource: this.props.datastore.GetDataSource()});
        }
    }

    handlePageChangeDashboard() {
        window.location.href = "/dashboardOnboard";
    }

    handlePageChangeMarket() {
        window.location.href = "/marketPlaceOnboardUpload";
    }

    render() {
        return (
            <main className='main' style={{padding: '1em'}}>
                <h2>Welcome to the Disease Dashboard</h2>
                <p>
                    If you are familiar with our website, please proceed to the Dashboard page directly
                </p>
                <strong>Below are links to demos for our various functions!</strong>
                <p>

                </p>
                <Button
                id="DashboardOnboard"
                type="primary"
                size="large"
                shape="round"
                onClick={this.handlePageChangeDashboard}>
                Dashboard Brief Demo
                </Button>
                <p>

                </p>
                <Button
                id="MarketPlaceOnboard"
                type="primary"
                size="large"
                shape="round"
                onClick={this.handlePageChangeMarket}>
                MarketPlace Demo
                </Button>

                <p>
                    Testing to see if datastore changes propagate to children: 
                </p>
                <strong>datastore.GetSelectedDataSource() = { this.state.selectedDataSource }</strong>
            </main>
        );
    }
}