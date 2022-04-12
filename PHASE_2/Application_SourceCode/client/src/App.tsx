// mosaic
import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";
import { Layout, Menu, Typography } from 'antd';
// styled components
import 'antd/dist/antd.css';
import React from 'react';
import 'react-mosaic-component/react-mosaic-component.css';
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import './App.css';
// import components
import Breadcrumb from './components/Breadcrumb';
import DataSourceSelect from './components/DataSourceSelect';
import Dashboard from './pages/Dashboard/Dashboard';
import DashboardHome from './pages/Dashboard/DashboardHome/DashboardHome';
import Diseases from './pages/Dashboard/DiseaseCases/Diseases/Diseases';
import Upload from './pages/Dashboard/MarketPlace/Upload/uploadDashboard';
// import my pages
import Home from './pages/Home/Home';
import PageNotFound from './pages/PageNotFound/PageNotFound';


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

function App() {

    // type TReport = {
    //     diseases: string[],
    //     syndromes: string[],
    //     event_date: string,
    //     // event_date_obj: Date,
    //     locations: string[],
    // }

    // type TSource = {
    //     url: string,
    //     date_of_publication: string,
    //     // date_of_publication_obj: Date,
    //     headline: string,
    //     main_text: string,
    //     reports: TReport[]
    // }[]

    // const source: TSource = []

    return (
        <div id="app">
            <BrowserRouter>
                <Layout className="layout">
                    <Header className="navbar">
                        <Text className="logo" style={{fontSize: '1.5em'}}>Health</Text>
                        <Menu theme="dark" mode="horizontal">
                            <Menu.Item key="1"><Link to="/">Home</Link></Menu.Item>
                            <Menu.Item key="2"><Link to="/dashboard">Dashboard</Link></Menu.Item>
                            <Menu.Item key="3" className="dataSourceSelect">
                                <DataSourceSelect/>
                            </Menu.Item>
                        </Menu>
                    </Header>

                    <Content style={{marginLeft: '2em', marginRight: '2em', minHeight: '58em'}}>
                        <Breadcrumb/>
                        <div className='content'>
                            <Routes>
                                <Route path="/" element={<Home/>} />
                                <Route path="/dashboard" element={<Dashboard/>}>
                                    <Route path="/dashboard/" element={<DashboardHome />} />
                                    <Route path="/dashboard/disease-cases/diseases" element={<Diseases />} />
                                    <Route path="/dashboard/market-place/upload" element={<Upload />} />
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

export default App;
