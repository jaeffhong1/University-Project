import React from 'react';
import DataStore from '../../datastore';

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
        selectedDataSource: this.props.datastore.GetDataSource()
    }

    componentDidUpdate(prevProps: IProps) {
        // check if we need to update our state from the datastore prop
        if(this.state.selectedDataSource !== this.props.datastore.GetDataSource()) {
            console.log(prevProps.datastore.GetDataSource() + " --> " + this.props.datastore.GetDataSource())
            this.setState({selectedDataSource: this.props.datastore.GetDataSource()});
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