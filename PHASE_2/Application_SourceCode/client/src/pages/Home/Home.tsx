import React from 'react';
import { DataStore } from '../../datastore';

interface IProps {
    datastore: DataStore,
}

interface IState {
    selectedDataSource: string
}

export default class Home extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props); 
    }

    state: IState = {
        selectedDataSource: this.props.datastore.GetSelectedDataSource()
    }

    componentDidUpdate(prevProps: IProps) {
        console.log("UPDATED HOME!");
        
        // check if we need to update our state from the datastore prop
        if(this.state.selectedDataSource !== this.props.datastore.GetSelectedDataSource()) {
            console.log(prevProps.datastore.GetSelectedDataSource() + " --> " + this.props.datastore.GetSelectedDataSource())
            this.setState({selectedDataSource: this.props.datastore.GetSelectedDataSource()});
        }
    }

    render() {
        return (
            <main className='main' style={{padding: '1em'}}>
                <h2>Welcome to the Disease Dashboard</h2>
                <p>
                    Testing to see if datastore changes propagate to children: 
                </p>
                <strong>datastore.GetSelectedDataSource() = { this.state.selectedDataSource }</strong>
            </main>
        );
    }
}