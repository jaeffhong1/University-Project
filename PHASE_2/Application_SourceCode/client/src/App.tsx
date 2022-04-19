// mosaic
//import "@blueprintjs/core/lib/css/blueprint.css";
//import "@blueprintjs/icons/lib/css/blueprint-icons.css";
//import 'react-mosaic-component/react-mosaic-component.css';

// styled components
import { Layout, Menu, Typography } from 'antd';
import 'antd/dist/antd.css';
// react
import React, { JSXElementConstructor } from 'react';
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import './App.css'; // custom styles
// import datastore
import DataStore from "./datastore";
import CacheSystem from './pages/Dashboard/DashboardHome/CacheSystem';
import DashboardHome from './pages/Dashboard/DashboardHome/DashboardHome';
import { IExternalSource, TExternalSources } from './pages/Dashboard/DashboardHome/sources/ExternalSource';
import DashboardRoot from './pages/Dashboard/DashboardRoot';
import DashboardRootOnboard from './pages/Dashboard/DashboardRootOnboard';
import AllExternalSourcesPageOnboard from './pages/ExternalSourcesPage/AllExternalSourceOnboard';
import ExternalSourcesPageOnboard from './pages/ExternalSourcesPage/ExternalSourcesOnboard';
import { AllExternalSourcesPage } from './pages/ExternalSourcesPage/AllExternalSourcesPage';
import { ExternalSourcesPage } from './pages/ExternalSourcesPage/ExternalSourcesPage';
import { UserExternalSourcesPage } from './pages/ExternalSourcesPage/UserExternalSources';
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
    userExternalSources: TExternalSources | null
}

export class App extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props); 
    }

    componentDidMount() {
        (async () => {
            const resp = await CacheSystem.fetch("external-apis-000", 10, "http://seng3011.duckdns.org/marketplace/api/get")
            if (typeof resp !== "string") {
                console.error(resp)
                throw new Error("fetching external sources failed")
            }
            const externalSources = JSON.parse(resp) as TExternalSources;
            this.setState({externalSources: externalSources})
        })()
    }

    state: IState = {
        datastore: new DataStore(this),
        externalSources: null,
        userExternalSources: {},
        // externalSources: {
        //     "covidtracking": {
        //         "name": "covidtracking",
        //         "url": "https://api.covidtracking.com/v1/us/daily.json",
        //         "fields": [
        //             {"name": "date", "type": "date-concatenated-number", "description": "date as a number"},
        //             {"name": "states", "type": "number", "description": "unknown"},
        //             {"name": "positive", "type": "number", "description": "positive tests"},
        //             {"name": "negative", "type": "number", "description": "negative tests"},
        //             {"name": "pending", "type": "number", "description": "pending tests"},
        //             {"name": "hospitalizedCurrently", "type": "number", "description": "Number of people hospitalized during this period"},
        //             {"name": "hospitalizedCumulative", "type": "number", "description": "Number of people hospitalized"},
        //             {"name": "inIcuCurrently", "type": "number", "description": "TODO"},
        //             {"name": "inIcuCumulative", "type": "number", "description": "TODO"},
        //             {"name": "onVentilatorCurrently", "type": "number", "description": "TODO"},
        //             {"name": "onVentilatorCumulative", "type": "number", "description": "TODO"},
        //             {"name": "death", "type": "number", "description": "TODO"},
        //             {"name": "hospitalized", "type": "number", "description": "TODO"},
        //             {"name": "totalTestResults", "type": "number", "description": "TODO"},
        //             {"name": "total", "type": "number", "description": "TODO"},
        //             {"name": "posNeg", "type": "number", "description": "TODO"},
        //             {"name": "deathIncrease", "type": "number", "description": "TODO"},
        //             {"name": "hospitalizedIncrease", "type": "number", "description": "TODO"},
        //             {"name": "negativeIncrease", "type": "number", "description": "TODO"},
        //             {"name": "positiveIncrease", "type": "number", "description": "TODO"},
        //             {"name": "totalTestResultsIncrease", "type": "number", "description": "TODO"},

        //             {"name": "hash", "type": "string", "description": "TODO"},
        //             {"name": "dateChecked", "type": "date", "description": "TODO"},
        //             {"name": "lastModified", "type": "date", "description": "TODO"},
        //         ],
        //         "root": "",
        //         "params": []
        //     },
        //     "NSW": {
        //         "name": "NSW",
        //         "url": "https://nswdac-covid-19-postcode-heatmap.azurewebsites.net/datafiles/postcode_daily_cases.json",
        //         "root": "data",
        //         "fields": [
        //             {"name": "date", "type": "date", "description": "the date"},
        //             {"name": "postcode", "type": "string", "description": "the postcode"},
        //             {"name": "total_cases", "type": "number", "description": "total number of cases"},
        //             {"name": "active_cases", "type": "number", "description": "number of active cases"},
        //         ],
        //         "params": []
        //     }
        // },
    }

    datastoreUpdate() {
        // the datastore object will call this function to tell the app to update state
        // this will automatically update the prop "datastore" given to any children who will need to check for updates themselves
        this.setState({});
        console.log("APP UOPDATED STATE FROM DATASTROE");
    }

    setExternalSources(externalSources: TExternalSources) {
        this.setState({ externalSources })
    }

    setUserExternalSources(userExternalSources: TExternalSources) {
        this.setState({ userExternalSources })
    }

    spacedContent(content: JSX.Element) {
        return (
            <div style={{marginLeft: '2em', marginRight: '2em', minHeight: '58em', paddingTop: '1em'}}>
                {content}
            </div>
        )
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
                                <Menu.Item key="3"><Link to="/externalSources/">Marketplace</Link></Menu.Item>
                                <Menu.Item key="4"><Link to="/externalSources/user">User Sources</Link></Menu.Item>
                            </Menu>
                        </Header>
                        
                        <Content style={{minHeight: '58em'}}>
                            <div className='content'>
                                <Routes>
                                    <Route index element={<Home datastore={this.state.datastore}/>} />
                                    <Route path="externalSources" element={this.spacedContent(<AllExternalSourcesPage userExternalSources={this.state.userExternalSources} externalSources={this.state.externalSources} setExternalSources={this.setUserExternalSources.bind(this)} />)} /> 
                                    <Route path="externalSources/add" element={this.spacedContent(<ExternalSourcesPage userExternalSources={this.state.userExternalSources} externalSources={this.state.externalSources} setUserExternalSources={this.setUserExternalSources.bind(this)} setExternalSources={this.setExternalSources.bind(this)} />)} />
                                    <Route path="externalSources/user" element={this.spacedContent(<UserExternalSourcesPage externalSources={this.state.userExternalSources} setExternalSources={this.setUserExternalSources.bind(this)} />)} />
                                        
                                    <Route path="externalSources/add/onboard" element={this.spacedContent(<ExternalSourcesPageOnboard/>)}/>
                                    <Route path="externalSources/onboard" element={this.spacedContent(<AllExternalSourcesPageOnboard/>)}/>
                                    
                                    <Route path="dashboard" element={this.spacedContent(<DashboardRoot datastore={this.state.datastore}/>)}>
                                        <Route index element={<DashboardHome datastore={this.state.datastore} externalSources={this.state.externalSources}/>} />
                                    </Route>
                                    <Route path="dashboard/onboard" element={this.spacedContent(<DashboardRootOnboard datastore={this.state.datastore} externalSources={this.state.externalSources}/>)}/>
                                    <Route path="*" element={this.spacedContent(<PageNotFound/>)}/>
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