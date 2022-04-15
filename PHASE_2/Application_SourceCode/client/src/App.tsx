// mosaic
//import "@blueprintjs/core/lib/css/blueprint.css";
//import "@blueprintjs/icons/lib/css/blueprint-icons.css";
//import 'react-mosaic-component/react-mosaic-component.css';

// styled components
import { Layout, Menu, Typography } from 'antd';
import 'antd/dist/antd.css';
// react
import React from 'react';
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import './App.css'; // custom styles
// import components
import Breadcrumb from './components/Breadcrumb';
// import datastore
import DataStore from "./datastore";
import DashboardHome from './pages/Dashboard/DashboardHome/DashboardHome';
import { IExternalSource, TExternalSources } from './pages/Dashboard/DashboardHome/sources/ExternalSource';
import DashboardRoot from './pages/Dashboard/DashboardRoot';
import Diseases from './pages/Dashboard/DiseaseCases/Diseases/Diseases';
import { ExternalSourcesPage } from './pages/ExternalSourcesPage/ExternalSourcesPage';
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

interface IProps {}
interface IState {
    datastore: DataStore;
    externalSources: {[key: string]: IExternalSource},
}

export class App extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props); 
    }

    state: IState = {
        datastore: new DataStore(this),
        externalSources: {
            "foo": {
                url: "http://foo.org",
                fields: [
                    {name: "first", description: "the first field", type: "string"},
                    {name: "second", description: "the second field", type: "string"},
                    {name: "hello", description: "the blah field", type: "string"},
                    {name: "world", description: "woooooo", type: "string"},
                ],
                root: "data",
            },
            "bar": {
                url: "http://bar.org",
                fields: [{name: "firstbar", description: "the first field", type: "string"}],
                root: "data",
            }
        },
    }

    datastoreUpdate() {
        // the datastore object will call this function to tell the app to update state
        // this will automatically update the prop "datastore" given to any children who will need to check for updates themselves
        this.setState({});
    }

    setExternalSources(externalSources: TExternalSources) {
        this.setState({ externalSources })
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
                                    <Route path="/dashboard" element={<DashboardRoot datastore={this.state.datastore}/>}>
                                        <Route path="/dashboard/" element={<DashboardHome datastore={this.state.datastore} externalSources={this.state.externalSources}/>} />
                                        <Route path="/dashboard/disease-cases/diseases" element={<Diseases />} />
                                        <Route path="/dashboard/external-sources" element={
                                            <ExternalSourcesPage externalSources={this.state.externalSources} setExternalSources={this.setExternalSources.bind(this)} />
                                            } />
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
