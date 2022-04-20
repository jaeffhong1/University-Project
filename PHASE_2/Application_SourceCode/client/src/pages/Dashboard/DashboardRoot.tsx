import { Layout, Menu } from 'antd';
import React from 'react';
import { Outlet, useOutletContext } from 'react-router-dom';
import DashboardHeader from '../../components/DashboardHeader';
import DataStore from '../../datastore';
import './dashboard.css';
import DashboardHome from './DashboardHome/DashboardHome';
import { TExternalSources, IExternalSource } from './DashboardHome/sources/ExternalSource';

// extract styled components from import 
const { SubMenu } = Menu;
const { Content, Sider } = Layout;

interface IProps {
    datastore: DataStore
    externalSources: TExternalSources | null;
    setExternalSources: (s: {[name: string]: IExternalSource}) => void;
}
interface IState {
    datastore: DataStore
}

export default class DashboardRoot extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);
    }

    state: IState = {
        datastore: this.props.datastore
    }

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
                            <DashboardHome datastore={this.props.datastore} externalSources={this.props.externalSources} setExternalSources={this.props.setExternalSources}></DashboardHome>
                        </div>
                    </Content>
                </Layout>
            </main>
        );
    }
}
