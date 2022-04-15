// mosaic
//import "@blueprintjs/core/lib/css/blueprint.css";
//import "@blueprintjs/icons/lib/css/blueprint-icons.css";
//import 'react-mosaic-component/react-mosaic-component.css';

// styled components
import { Layout, Menu, Typography } from 'antd';
import 'antd/dist/antd.css';
import './App.css'; // custom styles
// react
import React from 'react';
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
// import components
import Breadcrumb from './components/Breadcrumb';
import { DataSourceSelect } from './components/DataSourceSelect';
import DashboardRoot from './pages/Dashboard/DashboardRoot';
import DashboardRootOnboard from './pages/Dashboard/DashboardRootOnboard';
import MarketPlaceOnboardUpload from './pages/Dashboard/MarketPlaceOnboardUpload';
import MarketPlaceOnboardBrowse from './pages/Dashboard/MarketPlaceOnboardBrowse';
import DiseaseBrowseOnboard from './pages/Dashboard/DiseaseBrowseOnboard';
import DashboardHome from './pages/Dashboard/DashboardHome/DashboardHome';
import Diseases from './pages/Dashboard/DiseaseCases/Diseases/Diseases';
import Upload from './pages/Dashboard/MarketPlace/Upload/uploadDashboards';
import Browse from './pages/Dashboard/MarketPlace/Browse/browseDashboards';
// import my pages
import Home from './pages/Home/Home';
import PageNotFound from './pages/PageNotFound/PageNotFound';
// import datastore
import DataStore from "./datastore";

// extract styled components
const { Header, Content, Footer } = Layout;
const { Text } = Typography;

export type TReport = {
    diseases: string[],
    syndromes: string[],
    event_date: string,
    // event_date_obj: Date,
    locations: string[],
}

export type TSource = {
    url: string,
    date_of_publication: string,
    // date_of_publication_obj: Date,
    headline: string,
    main_text: string,
    reports: TReport[]
}[]

interface IProps {}
interface IState {
    datastore: DataStore
}

export class App extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props); 
    }

    state: IState = {
        datastore: new DataStore(this)
    }

    datastoreUpdate() {
        // the datastore object will call this function to tell the app to update state
        // this will automatically update the prop "datastore" given to any children who will need to check for updates themselves
        this.setState({});
    }

    render() {
        return (
            <div id="app">
                <BrowserRouter>
                    <Layout className="layout">
                        <Header className="navbar">
                            <Text className="logo" style={{fontSize: '1.5em', fontFamily: 'Montserrat-Light-Alt1, sans-serif'}}>HEALTH DASHBOARD</Text>
                            <Menu theme="dark" mode="horizontal">
                                <Menu.Item key="1"><Link to="/">Home</Link></Menu.Item>
                                <Menu.Item key="2"><Link to="/dashboard">Dashboard</Link></Menu.Item>
                            </Menu>
                        </Header>

                        <Content style={{marginLeft: '2em', marginRight: '2em', minHeight: '58em'}}>
                            <Breadcrumb/>
                            <div className='content'>
                                <Routes>
                                    <Route path="/" element={<Home datastore={this.state.datastore}/>} />
                                    <Route path="/dashboardOnboard" element={<DashboardRootOnboard datastore={this.state.datastore}/>}/>
                                    <Route path="/marketPlaceOnboardUpload" element={<MarketPlaceOnboardUpload datastore={this.state.datastore}/>}/>
                                    <Route path="/marketPlaceOnboardBrowse" element={<MarketPlaceOnboardBrowse datastore={this.state.datastore}/>}/>
                                    <Route path="/diseaseBrowseOnboard" element={<DiseaseBrowseOnboard datastore={this.state.datastore}/>}/>
                                    <Route path="/dashboard" element={<DashboardRoot datastore={this.state.datastore}/>}>
                                        <Route path="/dashboard/" element={<DashboardHome datastore={this.state.datastore}/>} />
                                        <Route path="/dashboard/disease-cases/diseases" element={<Diseases />} />
                                        <Route path="/dashboard/market-place/upload" element={<Upload />} />
                                        <Route path="/dashboard/market-place/browse" element={<Browse />} />
                                    </Route>
                                    <Route path="*" element={<PageNotFound/>}/>
                                </Routes>
                            </div>
                        </Content>

                        <Footer>Disease Dashboard ©2022</Footer>
                    </Layout>
                </BrowserRouter>
            </div>
        );
    }
}

export default App;