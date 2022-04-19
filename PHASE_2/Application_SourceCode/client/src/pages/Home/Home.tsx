import React from 'react';
import DataStore from '../../datastore';
import { Button, Layout, Menu, Space, Carousel, Typography, Row, Col, Card, Dropdown } from 'antd';
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import './Home.css'
const { Text, Title } = Typography;
const { Content } = Layout;

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

    handleGetStartedButtonClick() {

    }

    handleGetStartedMenuClick() {

    }

    render() {
        return (
            <main>
                <div style={{padding: '5em', position: 'absolute', zIndex: '100'}}>
                    <Title level={1} style={{ color:"white", left: '4em' }}>F0B5 Disease data dashboard</Title>
                    <Title level={3} style={{ color:"white", left: '4em' }}>Health and disease data you can trust.</Title>
                </div>
                <Carousel autoplay>
                    <div className="img img1"></div>
                    <div className="img img2"></div>
                    <div className="img img3"></div>
                </Carousel>

                
                <Content style={{backgroundColor: 'rgb(235, 237, 240)'}}>
                    <div style={{width: '80%', margin: 'auto', padding: '2em'}}>
                        <Row>
                            <Col span={10}>
                                <div className="dashboard-img"></div>
                            </Col>
                            <Col span={6}>
                                <div className="verticallyCentreDiv" style={{paddingRight: '2em'}}>
                                    <Title level={4} style={{textAlign: 'right'}}>
                                        View your dashboard, or begin our quick tutorial to see what tools we offer.
                                    </Title>
                                </div>
                            </Col>
                            <Col span={8}>
                                <div className="verticallyCentreDiv" style={{}}>
                                    <Button style={{marginRight: '0.5em'}}>Your Dashboard</Button>
                                    <Dropdown.Button 
                                        type="primary"
                                        onClick={this.handleGetStartedButtonClick} 
                                        overlay={
                                            <Menu onClick={this.handleGetStartedMenuClick}>
                                                <Menu.Item key="1">
                                                    <Link to="/dashboard/onboard">Dashboard guide</Link>
                                                </Menu.Item>
                                                <Menu.Item key="2">
                                                    <Link to="/externalSources/onboard">External sources guide</Link>
                                                </Menu.Item>
                                                <Menu.Item key="3">
                                                    <Link to="/externalSources/add/onboard">Adding external sources guide</Link>
                                                </Menu.Item>
                                            </Menu>
                                        }
                                    >
                                        <Link to="/dashboard/onboard">Get started</Link>
                                    </Dropdown.Button>
                                </div>
                            </Col>
                        </Row>
                    </div>
                    


                </Content >

                <Content style={{backgroundColor: '#001529'}}>
                    <div style={{width: '80%', margin: 'auto', padding: '2em', color: 'rgb(235, 237, 240)'}}>
                        <Title level={3} type="secondary" style={{color: 'rgb(235, 237, 240)'}}>Features</Title>

                        <Row gutter={16}>
                            <Col span={8}>
                                <Card size="small" title="Customisable Dashboard" bordered={false} style={{height: '20vh'}} extra={<Link to="/dashboard/onboard">See how</Link>}>
                                    <p>Display multiform data. Gain insight on incoming disease data in all forms, all from your customisable and dynamic dashboard.</p>
                                </Card>
                            </Col>
                            <Col span={8}>
                                <Card size="small" title="Choose the data you trust" bordered={false} style={{height: '20vh'}}>
                                    <p>Include only the data sources you trust. </p>
                                </Card>
                            </Col>
                            <Col span={8}>
                                <Card size="small" title="Extend with more APIs" bordered={false} style={{height: '20vh'}} extra={<Link to="/externalSources/add/onboard">See how</Link>}>
                                    <p>Connect other's or your own API and you'll still have access to our powerful data displays.</p>
                                </Card>
                            </Col>
                        </Row>
                    </div>
                </Content>
            </main>
        );
    }
}