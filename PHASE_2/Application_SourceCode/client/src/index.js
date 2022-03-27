import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

// import components
import Breadcrumb from './components/Breadcrumb';

// import my pages
import Home from './pages/Home/Home';
import Dashboard from './pages/Dashboard/Dashboard';
import PageNotFound from './pages/PageNotFound/PageNotFound';
import Brief from './pages/Dashboard/Brief/Brief';
import Diseases from './pages/Dashboard/DiseaseCases/Diseases/Diseases';

// styled components
import 'antd/dist/antd.css';
import { Layout, Menu, Typography } from 'antd';
import './index.css';

// extract styled components
const { Header, Content, Footer } = Layout;
const { Text } = Typography;

ReactDOM.render(
    <BrowserRouter>
        <Layout className="layout">
            <Header className="navbar">
                <Text type="default" className="logo" style={{fontSize: '1.5em'}}>Blatant JS Bloat</Text>
                <Menu theme="dark" mode="horizontal">
                    <Menu.Item key="1"><Link to="/">Home</Link></Menu.Item>
                    <Menu.Item key="2"><Link to="/dashboard">Dashboard</Link></Menu.Item>
                </Menu>
            </Header>

            <Content style={{marginLeft: '2em', marginRight: '2em', minHeight: '58em'}}>
                <Breadcrumb style={{ margin: '1em 0.2em 1em 0.1em' }} />
                <div className='content'>
                    <Routes>
                        <Route path="/" element={<Home/>} />
                        <Route path="/dashboard" element={<Dashboard/>}>
                            <Route path="/dashboard/" element={<Brief />} />
                            <Route path="/dashboard/disease-cases/diseases" element={<Diseases />} />
                        </Route>
                        <Route path="*" element={<PageNotFound/>}/>
                    </Routes>
                </div>
            </Content>

            <Footer>Disease Dashboard ©2022</Footer>
        </Layout>
  </BrowserRouter>,
  document.getElementById('root')
);