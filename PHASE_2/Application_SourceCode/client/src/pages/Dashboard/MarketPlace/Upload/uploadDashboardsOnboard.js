import { Table, Button, Input, message } from 'antd';
import { useState } from "react";
import { Link } from "react-router-dom";
import { CloudUploadOutlined } from "@ant-design/icons";
import { all_uploads } from '../Browse/browseDashboardsOnboard';
export default function Upload() {

    const [currentState, setCurrentState] = useState([
        {
            key: '1',
            dashboard: 'first dashboard',
            upload: "/dashboard",
            description: "",
        },
    ]);

    const handleInputChange = (rowIndex) => event => {
        const newInputState = [...currentState];
        newInputState[rowIndex]["description"] = event.target.value;
        setCurrentState(newInputState);
    }


    const columns = [
        {
          title: 'Your dashboards',
          dataIndex: 'dashboard',
          className: 'uploadDashboards',
          key: 'dashboard',
          render: (value, record, rowIndex) => (
            <Link to="/dashboard">{currentState[rowIndex]["dashboard"]}
            </Link>
          ),
        },
        {
          title: 'Description',
          dataIndex: 'description',
          className: 'uploadDescriptions',
          key: 'description',
          render: (text, record, rowIndex) => (
            <Input
                placeholder="Enter a short description of your dashboard"
                value={text}
                onChange={handleInputChange(rowIndex)}
            />
          )
        },
        {
          title: 'To upload',
          dataIndex: 'upload',
          className: 'uploadUpload',
          key: 'upload',
          render: (value, record, rowIndex) => (
            <Button
                type="primary"
                size="large"
                shape="round"
                onClick={() => uploadDashboards(rowIndex)}>
                Upload
                <CloudUploadOutlined />
            </Button>
          )
        },
    ];


    function uploadDashboards(rowIndex) {
        const msg = currentState[rowIndex]["dashboard"] + " has been uploaded with description " + currentState[rowIndex]["description"];
        //addDashboard(currentState[rowIndex]["title"], currentState[rowIndex]["description"]);
        const obj = {};
        obj["key"] = all_uploads.length + 1;
        obj["dashboards"] = currentState[rowIndex]["dashboard"];
        obj["description"] = currentState[rowIndex]["description"];
        obj["upload"] = currentState[rowIndex]["upload"];
        all_uploads.push(obj);
        message.info(msg);
    }

    return (
        <div className="main">
            <Table className="uploadTable" columns={columns} dataSource={currentState} pagination={false}/>
        </div>
    );
}
