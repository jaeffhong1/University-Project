import { Row, Col, Divider } from 'antd';
import { Card } from 'antd';
import { Progress } from 'antd';

import Plot from 'react-plotly.js';

export default function Brief() {


    return (
        <main className='main' style={{margin: '1.5em'}}>
          <h2>Welcome to the dashboard</h2>

            <Divider orientation="left">Highlights</Divider>

            <Row gutter={[16, 24]}>
                <Col className="gutter-row" span={12}>
                    <Card title="Current Cases By Top 5 Countries">
                        <Plot
                            data={[{
                                x: [1, 2, 3],
                                y: [2, 6, 3],
                                type: 'scatter',
                                mode: 'lines+markers',
                                marker: {color: 'red'},
                            },
                            {
                                type: 'bar', x: [1, 2, 3], y: [2, 5, 3]},
                            ]}
                            layout={{
                                autosize: true,
                                //title: 'A Fancy Plot',
                                showlegend: false,
                                margin: {
                                    autoexpand: false,
                                    t: 2, // remove margin for title
                                    b: 5,
                                    l: 15,
                                    r: 15, // right margin
                                    pad: 4,
                                }
                            }}
                        />
                    </Card>
                </Col>
                <Col className="gutter-row" span={12}>
                    <Card title="Current Cases By Top 5 Countries">
                        <Plot
                            data={
                                [
                                    {
                                        x: [1, 2, 3, 4],
                                        y: [10, 11, 12, 13],
                                        mode: 'markers',
                                        marker: {
                                            color: 'red',
                                            size: [40, 60, 80, 100]
                                        },
                                    },
                                ]
                            }

                            layout={{
                                showlegend: false,
                                margin: {
                                    autoexpand: false,
                                    t: 2, // remove margin for title
                                    b: 5,
                                    l: 15,
                                    r: 15, // right margin
                                    pad: 4,
                                }
                            }}
                        />
                    </Card>
                </Col>
                <Col className="gutter-row" span={12}>
                    <Card title="Card title">
                        <p>Card content</p>
                        <p>Card content</p>
                        <p>Card content</p>
                    </Card>
                </Col>
                <Col className="gutter-row" span={12}>
                    <Card title="Progress" bodyStyle={{alignContent: 'center'}}>
                        <Progress type="circle" percent={75} style={{marginLeft: '2em'}}/>
                        <Progress type="circle" percent={70} status="exception"  style={{marginLeft: '2em'}}/>
                        <Progress type="circle" percent={100}  style={{marginLeft: '2em'}}/>
                        <Progress type="circle" percent={12} style={{marginLeft: '2em'}}/>
                    </Card>
                </Col>
            </Row>

            <Divider orientation="left">Insights</Divider>
        </main>
    );
}