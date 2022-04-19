import { LaptopOutlined, NotificationOutlined, UserOutlined } from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import DashboardHeader from '../../components/DashboardHeader';
import DataStore from '../../datastore';
import './dashboard.css';




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
                    <Sider className="site-layout-background" width={0}>
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