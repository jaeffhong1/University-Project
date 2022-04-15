import React from 'react';
import { Routes, Route, Link, Outlet, useLocation } from 'react-router-dom';

import { Layout, Menu, Breadcrumb } from 'antd';
import { UserOutlined, LaptopOutlined, NotificationOutlined } from '@ant-design/icons';

import './dashboard.css';
import DashboardHeader from '../../components/DashboardHeader';

import DataStore from '../../datastore';

// extract styled components from import 
const { SubMenu } = Menu;
const { Content, Sider } = Layout;

interface IProps {
    datastore: DataStore
}
interface IState {}

export default class DashboardRoot extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);
    }

    state: IState = {}

    // get the currently selected keys
    //const location = useLocation();
    //let names = location.pathname.split("/");
    //let currentPage = names[names.length - 1];

    private getCurrentPage(): string {
        //let names = this.state.location.pathname.split("/");
        //let currentPage = names[names.length - 1];
        //return currentPage;
        return "";
    }

    public render() {
        return (
            <main className='main'>
                <Layout className="site-layout-background" style={{ padding: 0, background: 'white' }}>
                    <Sider className="site-layout-background" width={200}>
                        <Menu
                            mode="inline"
                            style={{height: '100%'}}
                            selectedKeys={['DashboardHome']}//[this.getCurrentPage()]}
                        >
                            <Menu.Item key="dashboard" style={{marginTop: 0}}><Link to="/dashboard">Dashboard Brief</Link></Menu.Item>
                            <SubMenu key="sub1" icon={<UserOutlined />} title="Disease Cases">
                                <Menu.Item key="diseases"><Link to="/dashboard/disease-cases/diseases">Diseases</Link></Menu.Item>
                                <Menu.Item key="syndromes">Syndromes</Menu.Item>
                            </SubMenu>
                            <SubMenu key="sub2" icon={<LaptopOutlined />} title="Countries">
                                <Menu.Item key="4">Current disease cases</Menu.Item>
                                <Menu.Item key="5">Case timeline</Menu.Item>
                            </SubMenu>
                            <SubMenu key="sub3" icon={<NotificationOutlined />} title="Another Field">
                                <Menu.Item key="6">option9</Menu.Item>
                                <Menu.Item key="7">option10</Menu.Item>
                                <Menu.Item key="8">option11</Menu.Item>
                                <Menu.Item key="9">option12</Menu.Item>
                            </SubMenu>
                            <SubMenu className="marketPlace" key="sub4" icon={<LaptopOutlined />} title="MarketPlace">
                                <Menu.Item className="marketUpload" key="upload"><Link to="/dashboard/market-place/upload">Upload Dashboards</Link></Menu.Item>
                                <Menu.Item className="marketBrowse" key="browse"><Link to="/dashboard/market-place/browse">Browse Dashboards</Link></Menu.Item>
                            </SubMenu>
                        </Menu>
                    </Sider>

                    <Content>
                        <DashboardHeader datastore={this.props.datastore} />
                        <div style={{ minHeight: 280 }}>
                            <Outlet />
                        </div>
                    </Content>
                </Layout>
            </main>
        );
    }
}