import { InfoOutlined } from '@ant-design/icons';
import { Button, Checkbox, Dropdown, Menu, Modal, Tooltip, Select } from 'antd';
import React from 'react';
import DataStore from '../datastore';
import './DataSourceSelect.css';

const { Option } = Select;

interface IProps {
    datastore: DataStore,
}

interface IState {
   selectedDataSource: string,
   isModalVisible: boolean,
   modalTitle: string,
   modalDescription: string
   isDropdownVisible: boolean,
}

export class DataSourceSelect extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props); 
    }

    dataSources: any[] = [
        {
            name: "f0b5",
            url: "https://www.cidrap.umn.edu/",
            description: "desc"
        },
        {
            name: "Epiwatch",
            url: "https://www.epiwatch.org/",
            description: "desc"
        },
        {
            name: "IHeartTeams",
            url: "http://outbreaks.globalincidentmap.com/",
            description: "desc"
        },
        {
            name: "123",
            url: "f0b5.com",
            description: "desc"
        }
    ];
    
    state: IState = {
        selectedDataSource: this.props.datastore.GetDataSource(),
        isModalVisible: false,
        modalTitle: "",
        modalDescription: "",
        isDropdownVisible: false,
    }


    //const [dataSourceSelection, setDataSourceSelection] = useState(0);
    handleCheckboxChange(id: string): void {
        // update the data store
        this.props.datastore.SetDataSource(id);

        // the datastore will force this component to update
    }

    componentDidUpdate(prevProps: IProps) {
        // check if we need to update our state from the datastore prop
        if(this.state.selectedDataSource !== this.props.datastore.GetDataSource()) {
            this.setState({selectedDataSource: this.props.datastore.GetDataSource()});
        }
    }

    //const [isModalVisible, setIsModalVisible] = useState(false);

    showModal = () => {
        this.setState((previousState, props) => ({
            isModalVisible: true
        }));
    }
    
    handleOk = () => {
        this.setState((previousState, props) => ({
            isModalVisible: false
        }));
    }
    
    handleCancel = () => {
        this.setState((previousState, props) => ({
            isModalVisible: false
        }));
    }

    //const [modalTitle, setModalTitle] = useState("NO TITLE");
    //const [modalText, setModalText] = useState("NO TEXT");

    handleInfoClick(id: string): void {
        // before showing the modal, set the modal title and description
        // get the datasource title/description details from the datasource id provided
        this.setState((previousState, props) => ({
            modalTitle: id
        }));
        
        // try to get the description matching the id
        let description: string|undefined = DataStore.DataSourceDescription.get(id);
        if (typeof description == 'undefined') {
            this.setState((previousState, props) => ({
                modalDescription: "Failed to retrieve description."
            }));
        } else if (typeof description == 'string') {
            let descriptionString: string = description;
            this.setState((previousState, props) => ({
                modalDescription: descriptionString
            }));
        }
        // show the modal
        this.showModal();
    }

    handleChange = (value: any, option: any) => {
        // update the data store
        this.props.datastore.SetDataSource(value);

        // the datastore will force this component to update
    }

    public render() {
        return (
            <div>
                <Select value={this.state.selectedDataSource} style={{width: '15em'}} onChange={this.handleChange}>
                    {
                        this.dataSources.map((value, index) => {
                            return (
                                <Option value={value.name} key={index}>
                                    {value.name}
                                    <br />
                                    <small><a href={value.url}>{value.url}</a></small>
                                </Option>
                            )
                        })
                    }
                    
                </Select>
            </div>
        );
    }
}