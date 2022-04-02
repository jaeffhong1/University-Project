import { useState } from 'react';
import { useLocation } from "react-router-dom";

import { Menu, Dropdown, Button, message, Tooltip, Checkbox, Modal } from 'antd';
import { InfoOutlined } from '@ant-design/icons';

export default function BreadCrumb() {

    const dataSources = [
        {
            name: "CIDRAP",
            description: "CIDRAP is a datasource. Here is a description about it."
        },
        {
            name: "Health API",
            description: "Health API is a datasource. Here is a description about it."
        }
    ];

    function handleButtonClick(e) {
        message.info('Select a datasource using the dropdown');
    }

    function handleMenuClick(e) {
        //message.info('Click on menu item.');
        //console.log('click', e);
    }

    const [dataSourceSelection, setDataSourceSelection] = useState(0);
    function handleCheckboxChange(id) {
        setDataSourceSelection(id);
    }

    const [isModalVisible, setIsModalVisible] = useState(false);

    const showModal = () => {
        setIsModalVisible(true);
    };
    
    const handleOk = () => {
        setIsModalVisible(false);
    };
    
    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const [modalTitle, setModalTitle] = useState("NO TITLE");
    const [modalText, setModalText] = useState("NO TEXT");

    function handleInfoClick(id) {

        // before showing the modal, set the modal title and description
        // get the datasource title/description details from the datasource id provided
        setModalTitle(dataSources[id].name);
        setModalText(dataSources[id].description);
        
        // show the modal
        showModal();
    }

    return (

        <>
            <Modal 
                title={modalTitle} 
                visible={isModalVisible} 
                onOk={handleOk}
                footer={[
                    <Button key="ok" type="primary" onClick={handleOk}>
                        Ok
                    </Button>
                ]}
            >
                <p>{modalText}</p>
            </Modal>

            <Dropdown.Button 
                onClick={handleButtonClick} 
                overlay={(
                    <Menu onClick={handleMenuClick}>
                        {
                            dataSources.map((value, index) => {
                                return (
                                    <Menu.Item key={index}>
                                        <Checkbox onChange={() => handleCheckboxChange(index)} checked={dataSourceSelection == index}>
                                            <span style={{marginRight: '2em'}}>{value.name}</span>

                                            <Tooltip title="Info">
                                                <Button style={{float: 'right', position: 'absolute', right: '0.4em'}} shape="circle" size="small" icon={<InfoOutlined />}  onClick={() => handleInfoClick(index)}/>
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