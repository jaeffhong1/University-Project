import { Table, Tag, Space } from 'antd';

const columns = [
    {
      title: 'Disease Name',
      dataIndex: 'name',
      key: 'name',
      render: text => <a>{text}</a>,
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: 'Start date',
      dataIndex: 'start_date',
      key: 'start_date',
    },
    {
        title: 'Finish date',
        dataIndex: 'finish_date',
        key: 'finish_date',
    },
    {
      title: 'Tags',
      key: 'tags',
      dataIndex: 'tags',
      render: tags => (
        <>
          {tags.map(tag => {
            let color = tag.length > 5 ? 'geekblue' : 'green';
            return (
              <Tag color={color} key={tag}>
                {tag.toUpperCase()}
              </Tag>
            );
          })}
        </>
      ),
    },
];
  
const data = [
    {
        key: '1',
        name: 'COVID-19',
        location: 'Ultimo, Sydney',
        start_date: '11/2/22',
        finish_date: '21/2/22',
        tags: ['tag1', 'tag2'],
    },
    {
        key: '2',
        name: 'COVID-19',
        location: 'Ultimo, Sydney',
        start_date: '12/2/22',
        finish_date: '21/2/22',
        tags: ['tag1', 'tag2'],
    },
    {
        key: '3',
        name: 'COVID-19',
        location: 'Sydney, Sydney',
        start_date: '15/3/22',
        finish_date: 'N/A',
        tags: ['tag1', 'tag2'],
    },
    {
        key: '4',
        name: 'COVID-19',
        location: 'Sydney, Sydney',
        start_date: '15/3/22',
        finish_date: 'N/A',
        tags: ['tag1', 'tag2'],
    },
    {
        key: '5',
        name: 'COVID-19',
        location: 'Sydney, Sydney',
        start_date: '15/3/22',
        finish_date: 'N/A',
        tags: ['tag1', 'tag2'],
    },
    {
        key: '6',
        name: 'Influenza',
        location: 'Sydney, Sydney',
        start_date: '15/3/22',
        finish_date: 'N/A',
        tags: ['tag1', 'tag2'],
    },
    {
        key: '7',
        name: 'Influenza',
        location: 'Sydney, Sydney',
        start_date: '15/3/22',
        finish_date: 'N/A',
        tags: ['tag1', 'tag2'],
    },
];
  
export default function Diseases() {
    return (
        <div className="main">
            <Table columns={columns} dataSource={data} pagination={false}/>
        </div>
    );
}