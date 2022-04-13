import React, { useState } from 'react';

import { Menu, Dropdown, Button, message, Tooltip, Checkbox, Modal } from 'antd';
import { InfoOutlined } from '@ant-design/icons';

import './DataSourceSelect.css';

import { DataStore } from '../datastore';

interface IProps {
    datastore: DataStore,
}

interface IState {
   selectedDataSource: string,
   isModalVisible: boolean,
   modalTitle: string,
   modalDescription: string
}

export class DataSourceSelect extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props); 
    }

    dataSources: string[] = ["f0b5", "IHeartTeams", "1 group 2 group 3 group 4"];
    
    state: IState = {
        selectedDataSource: this.props.datastore.GetSelectedDataSource(),
        isModalVisible: false,
        modalTitle: "",
        modalDescription: ""
    }

    handleButtonClick(e: any): void {
        //message.info('Select a datasource using the dropdown');
    }

    handleMenuClick(e: any): void {
        //message.info('Click on menu item.');
        //console.log('click', e);
    }

    //const [dataSourceSelection, setDataSourceSelection] = useState(0);
    handleCheckboxChange(id: string): void {
        
        // update the state
        this.setState((prevState, props) => ({
            selectedDataSource: id
        }));


        // update the data store
        this.props.datastore.SetSelectedDataSource(id);
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

    public render() {
        return (
            <>
                <Modal 
                    title={this.state.modalTitle}
                    visible={this.state.isModalVisible}
                    onOk={this.handleOk}
                    footer={[
                        <Button key="ok" type="primary" onClick={this.handleOk}>
                            Ok
                        </Button>
                    ]}
                >
                    <p>{this.state.modalDescription}</p>
                </Modal>

                <Dropdown.Button 
                    onClick={this.handleButtonClick} 
                    overlay={(
                        <Menu onClick={this.handleMenuClick}>
                            {
                                this.dataSources.map((value, index) => {
                                    return (
                                        <Menu.Item key={index}>
                                            <Checkbox onChange={() => this.handleCheckboxChange(value)} checked={this.props.datastore.selectedDataSources[0] == value}>
                                                <span style={{marginRight: '2em'}}>{value}</span>

                                                <Tooltip title="Info">
                                                    <Button style={{float: 'right', position: 'absolute', right: '0.4em'}} shape="circle" size="small" icon={<InfoOutlined />}  onClick={() => this.handleInfoClick(value)}/>
                                                </Tooltip>
                                            </Checkbox>
                                        </Menu.Item>
                                    )
                                })
                            }
                        </Menu>
                    )}
                >
                    Data Sources
                </Dropdown.Button>
            </>
        );
    }
}