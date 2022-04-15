import React, { useState } from "react";
import { TReactComponent } from "../DashboardHome";
import { Card, Button, Row, Col } from 'antd';

interface Props {
    setType: (type: string) => void;
    allWidgets: {[key: string]: TReactComponent }
}

export default function WidgetSelector(props: Props) {
    //const [type, setType] = useState(Object.keys(props.allWidgets)[0]);

    console.log(Object.keys(props.allWidgets));

    return (
        <div style={{padding: '2em'}}>
            <Row gutter={[12, { xs: 4, sm: 8, md: 16, lg: 32 }]}>
                {
                    Object.keys(props.allWidgets).map((value, index) => {
                        return (
                            <Col className="gutter-row" span={12} key={index}>
                                <Button type="dashed" size="large" block onClick={(e: React.MouseEvent) => {
                                    props.setType(value)
                                }}>
                                    {value}
                                </Button>
                            </Col>
                        )
                    })
                }
            </Row>
        </div>

        
    )
}