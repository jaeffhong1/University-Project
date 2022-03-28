import { useLocation } from "react-router-dom";

import { Menu, Dropdown, Button, message, Space, Tooltip } from 'antd';

export default function BreadCrumb() {

    function handleButtonClick(e) {
        message.info('Click on left button.');
        console.log('click left button', e);
    }

    function handleMenuClick(e) {
        message.info('Click on menu item.');
        console.log('click', e);
    }

    return (

    <Dropdown.Button 
        onClick={handleButtonClick} 
        overlay={(
            <Menu onClick={handleMenuClick}>
                <Menu.Item key="1">
                    1st menu item
                </Menu.Item>
                <Menu.Item key="2">
                    2nd menu item
                </Menu.Item>
                <Menu.Item key="3">
                    3rd menu item
                </Menu.Item>
            </Menu>
        )}
    >
        Data Sources
    </Dropdown.Button>
    );
}