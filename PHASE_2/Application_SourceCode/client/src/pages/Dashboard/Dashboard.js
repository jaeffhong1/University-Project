import { Routes, Route, Link, Outlet, useLocation } from 'react-router-dom';

import { Layout, Menu, Breadcrumb } from 'antd';
import { UserOutlined, LaptopOutlined, NotificationOutlined } from '@ant-design/icons';

import './dashboard.css';

// extract styled components from import 
const { SubMenu } = Menu;
const { Content, Sider } = Layout;

export default function Home() {

    // get the currently selected keys
    const location = useLocation();
    let names = location.pathname.split("/");
    let currentPage = names[names.length - 1];

    return (
        <main className='main'>
            <Layout className="site-layout-background" style={{ padding: 0, background: 'white' }}>
                <Sider className="site-layout-background" width={200}>
                    <Menu
                        mode="inline"
                        style={{height: '100%'}}
                        selectedKeys={[currentPage]}
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
                    </Menu>
                </Sider>

                <Content>
                    <div style={{ minHeight: 280 }}>
                        <Outlet />
                    </div>
                </Content>
            </Layout>
        </main>
    );
}