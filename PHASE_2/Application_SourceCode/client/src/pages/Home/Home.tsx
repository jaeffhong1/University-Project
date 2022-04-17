import React from 'react';
import DataStore from '../../datastore';
import { Button, Layout, Menu, Space } from 'antd';
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import './Home.css'

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

    handlePageChangeDisease() {
        window.location.href = "/diseaseBrowseOnboard";
    }

    handlePageChangeExternal() {
        window.location.href = "/externalOnboard";
    }

    handlePageDashboard() {
        window.location.href = "/dashboard";
    }

    handlePageMarketUpload() {
        window.location.href = "/dashboard/market-place/upload";
    }

    handlePageMarketBrowse() {
        window.location.href = "/dashboard/market-place/browse";
    }

    handlePageDiseaseBrowse() {
        window.location.href = "/dashboard/disease-cases/diseases";
    }

    handleApiBrowse() {
        window.location.href = "/dashboard/all-external-sources";
    }
    render() {
        return (
            <main style={{padding: '1em'}}>
                <div className='container'>

                    <h1 style={{ color:"white" }} className="welcomeMessage">Welcome to F0B5 Disease Website</h1>
                    <strong style={{ color:"red" }} className="familiarMessage">
                        If you are familiar with our website, please proceed to the Dashboard page directly.
                    </strong>
                    <p style={{ color:"white" }} className="introMessage">Harness the power of AI and open-source data to capture early epidemic signals globally and rapid epidemic detection, leading to the prevention of global spread.</p>
                </div>
                <div className='features'>
                    <h2 style={{color:"white"}} className="services">Our features</h2>
                    <Space className="FirstFeatures" size={[50,100]} wrap>
                        <Button 
                        className="DashboardHome"
                        type="default"
                        size="large"
                        shape="round"
                        onClick={this.handlePageDashboard}>
                        Customisable widgets
                        </Button>

                        <Button 
                        className="MarketPlaceUpload"
                        type="default"
                        size="large"
                        shape="round"
                        onClick={this.handlePageMarketUpload}>
                        Uploading dashboards
                        </Button>

                        <Button 
                        className="MarketPlaceBrowse"
                        type="default"
                        size="large"
                        shape="round"
                        onClick={this.handlePageMarketBrowse}>
                        Browsing dashboards
                        </Button>
                    </Space>

                    <Space className="MoreFeatures" size={[50,100]} wrap>
                        <Button 
                        className="InputApi"
                        type="default"
                        size="large"
                        shape="round"
                        onClick={this.handleApiBrowse}>
                        Browse/Add API
                        </Button>

                        <Button 
                        className="BrowseDisease"
                        type="default"
                        size="large"
                        shape="round"
                        onClick={this.handlePageDiseaseBrowse}>
                        Browse all reports
                        </Button>
                    </Space>
    
                    <h2 style={{color:"white"}} className="demos">Our demos</h2>

                    <Space align="center" className="allDemos" size={[50,100]} wrap>
                        <Button
                        className="MarketPlaceOnboard"
                        type="default"
                        shape="round"
                        size="large"
                        onClick={this.handlePageChangeMarket}>
                        MarketPlace Demo
                        </Button>

                        <Button
                        className="DashboardOnboard"
                        type="default"
                        size="large"
                        shape="round"
                        onClick={this.handlePageChangeDashboard}>
                        Dashboard Brief Demo
                        </Button>

                        <Button
                        className="DiseaseOnboard"
                        type="default"
                        size="large"
                        shape="round"
                        onClick={this.handlePageChangeDisease}>
                        Disease Demo
                        </Button>

                        <Button
                        className="ExternalOnboard"
                        type="default"
                        size="large"
                        shape="round"
                        onClick={this.handlePageChangeExternal}>
                        External API Demo
                        </Button>
                    </Space>
                </div>
            </main>
        );
    }
}