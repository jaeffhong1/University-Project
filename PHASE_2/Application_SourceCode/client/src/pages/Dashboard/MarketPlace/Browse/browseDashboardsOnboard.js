import { Table, Button, message } from 'antd';
import { CloudDownloadOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

export const all_uploads = [{"key": 1, "dashboards": "first dashboard", "description": "", "upload": "/dashboard"}];

const columns = [
    {
      className: 'browseDashboards',
      title: 'Dashboards',
      dataIndex: 'dashboards',
      key: 'dashboards',
      render: (value, record, rowIndex) => (
        <Link to={all_uploads[rowIndex]["upload"]}>{all_uploads[rowIndex]["dashboards"]}
        </Link>
      ),
    },
    {
      className: 'browseDescriptions',
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      className: 'browseAdd',
      title: 'To add',
      dataIndex: 'add',
      key: 'add',
      render: (value, record, rowIndex) => (
        <Button
            type="primary"
            size="large"
            shape="round"
            onClick={() => addDashboards(rowIndex)}>
            Add
            <CloudDownloadOutlined />
        </Button>
      )
    },

];

function addDashboards(rowIndex) {
    message.info("Sucessfully added");
}

export default function Browse() {
    return (
        <div className="main">
            <Table className="browseTable" columns={columns} dataSource={all_uploads} pagination={false}/>
        </div>
    );
}