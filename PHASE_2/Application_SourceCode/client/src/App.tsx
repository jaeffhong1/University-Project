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
import { DataSourceSelect } from './components/DataSourceSelect';
import DashboardHome from './pages/Dashboard/DashboardHome/DashboardHome';
import DashboardRoot from './pages/Dashboard/DashboardRoot';
import DashboardRootOnboard from './pages/Dashboard/DashboardRootOnboard';
import DiseaseBrowseOnboard from './pages/Dashboard/DiseaseBrowseOnboard';
import AllExternalSourcesPageOnboard from './pages/ExternalSourcesPage/AllExternalSourceOnboard';
import ExternalSourcesPageOnboard from './pages/ExternalSourcesPage/ExternalSourcesOnboard';
import { IExternalSource, TExternalSources } from './pages/Dashboard/DashboardHome/sources/ExternalSource';
import Diseases from './pages/Dashboard/DiseaseCases/Diseases/Diseases';
import { ExternalSourcesPage } from './pages/ExternalSourcesPage/ExternalSourcesPage';
import { AllExternalSourcesPage } from './pages/ExternalSourcesPage/AllExternalSourcesPage';
import Upload from './pages/Dashboard/MarketPlace/Upload/uploadDashboards';
import Browse from './pages/Dashboard/MarketPlace/Browse/browseDashboards';
import MarketPlaceOnboardBrowse from './pages/Dashboard/MarketPlaceOnboardBrowse';
import MarketPlaceOnboardUpload from './pages/Dashboard/MarketPlaceOnboardUpload';
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
    externalSources: TExternalSources | null,
}

export class App extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props); 
        (async () => {
            // const resp = await CacheSystem.fetch("external-apis-000", 10, "http://seng3011.duckdns.org/marketplace/api/get")
            // if (typeof resp !== "string") {
            //     console.error(resp)
            //     throw new Error("fetching external sources failed")
            // }
            // const externalSources = JSON.parse(resp) as TExternalSources;
            // for (let es of Object.values(externalSources)) {
            //     // @ts-ignore
            //     es.fields = es.params; // they're swapped in the db rn
            // }
            // this.setState({externalSources: externalSources})
        })()
    }

    state: IState = {
        datastore: new DataStore(this),
        externalSources: {
            "covidtracking": {
                "name": "covidtracking",
                "url": "https://api.covidtracking.com/v1/us/daily.json",
                "fields": [
                    {"name": "date", "type": "date-concatenated-number", "description": "date as a number"},
                    {"name": "states", "type": "number", "description": "unknown"},
                    {"name": "positive", "type": "number", "description": "positive tests"},
                    {"name": "negative", "type": "number", "description": "negative tests"},
                    {"name": "pending", "type": "number", "description": "pending tests"},
                    {"name": "hospitalizedCurrently", "type": "number", "description": "Number of people hospitalized during this period"},
                    {"name": "hospitalizedCumulative", "type": "number", "description": "Number of people hospitalized"},
                    {"name": "inIcuCurrently", "type": "number", "description": "TODO"},
                    {"name": "inIcuCumulative", "type": "number", "description": "TODO"},
                    {"name": "onVentilatorCurrently", "type": "number", "description": "TODO"},
                    {"name": "onVentilatorCumulative", "type": "number", "description": "TODO"},
                    {"name": "death", "type": "number", "description": "TODO"},
                    {"name": "hospitalized", "type": "number", "description": "TODO"},
                    {"name": "totalTestResults", "type": "number", "description": "TODO"},
                    {"name": "total", "type": "number", "description": "TODO"},
                    {"name": "posNeg", "type": "number", "description": "TODO"},
                    {"name": "deathIncrease", "type": "number", "description": "TODO"},
                    {"name": "hospitalizedIncrease", "type": "number", "description": "TODO"},
                    {"name": "negativeIncrease", "type": "number", "description": "TODO"},
                    {"name": "positiveIncrease", "type": "number", "description": "TODO"},
                    {"name": "totalTestResultsIncrease", "type": "number", "description": "TODO"},

                    {"name": "hash", "type": "string", "description": "TODO"},
                    {"name": "dateChecked", "type": "date", "description": "TODO"},
                    {"name": "lastModified", "type": "date", "description": "TODO"},
                ],
                "root": "",
                "params": []
            },
            "NSW": {
                "name": "NSW",
                "url": "https://nswdac-covid-19-postcode-heatmap.azurewebsites.net/datafiles/postcode_daily_cases.json",
                "root": "data",
                "fields": [
                    {"name": "date", "type": "date", "description": "the date"},
                    {"name": "postcode", "type": "string", "description": "the postcode"},
                    {"name": "total_cases", "type": "number", "description": "total number of cases"},
                    {"name": "active_cases", "type": "number", "description": "number of active cases"},
                ],
                "params": []
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
                                    <Route path="/dashboardOnboard" element={<DashboardRootOnboard datastore={this.state.datastore} externalSources={this.state.externalSources}/>}/>
                                    <Route path="/marketPlaceOnboardUpload" element={<MarketPlaceOnboardUpload datastore={this.state.datastore}/>}/>
                                    <Route path="/marketPlaceOnboardBrowse" element={<MarketPlaceOnboardBrowse datastore={this.state.datastore}/>}/>
                                    <Route path="/diseaseBrowseOnboard" element={<DiseaseBrowseOnboard datastore={this.state.datastore}/>}/>
                                    <Route path="/externalOnboard" element={<AllExternalSourcesPageOnboard/>}/>
                                    <Route path="/external-sourcesOnboard" element={<ExternalSourcesPageOnboard/>}/>
                                    <Route path="/dashboard" element={<DashboardRoot datastore={this.state.datastore}/>}>
                                        <Route path="/dashboard/" element={<DashboardHome datastore={this.state.datastore} externalSources={this.state.externalSources}/>} />
                                        <Route path="/dashboard/disease-cases/diseases" element={<Diseases />} />
                                        <Route path="/dashboard/external-sources" element={
                                            <ExternalSourcesPage externalSources={this.state.externalSources} setExternalSources={this.setExternalSources.bind(this)} />
                                            } />
                                        <Route path="/dashboard/all-external-sources" element={
                                            <AllExternalSourcesPage externalSources={this.state.externalSources} setExternalSources={this.setExternalSources.bind(this)} />
                                            } />
                                        <Route path="/dashboard/market-place/upload" element={<Upload />} />
                                        <Route path="/dashboard/market-place/browse" element={<Browse />} />
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