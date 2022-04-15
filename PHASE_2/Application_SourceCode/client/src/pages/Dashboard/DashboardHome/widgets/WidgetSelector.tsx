import React, { useState, useEffect, useRef } from "react";
import { TReactComponent } from "../DashboardHome";
import { Card, Button, Row, Col } from 'antd';

interface Props {
    setType: (type: string) => void;
    allWidgets: {[key: string]: TReactComponent }
}

export default function WidgetSelector(props: Props) {
    
    const [colWidth, setColWidth] = useState(12);
    const [buttonSize, setButtonSize] = useState("large");
    const [buttonTextSize, setButtonTextSize] = useState("16px");

    // get a reference to this component
    const ref = useRef(null);

    // check for changes in widget width
    useEffect(() => {
        if (ref?.current != null && ref?.current['clientWidth'] < 350) {
            setColWidth(24);

            // even smaller? also reduce button size and font
            if (ref?.current['clientWidth'] < 200) {
                setButtonSize("small");
                setButtonTextSize("10px");
            } else {
                setButtonSize("large");
                setButtonTextSize("16px");
            }
        } else {
            // normal settings
            setColWidth(12); // two cols per row
            setButtonSize("large");
            setButtonTextSize("16px");
        }
    }, [ref?.current != null ? ref?.current['clientWidth'] : ref]);

    return (
        <div ref={ref} style={{padding: '1em', paddingTop: '2em'}}>
            <Row gutter={[16, { xs: 4, sm: 8, md: 16, lg: 32 }]}>
                {
                    Object.keys(props.allWidgets).map((value, index) => {
                        return (
                            <Col key={index} className="gutter-row" span={colWidth}>
                                <Button 
                                    type="dashed" 
                                    // @ts-ignore - ignore buttonSize: string failing for internal antd "SizeType"
                                    size={buttonSize}
                                    block
                                    onClick={(e: React.MouseEvent) => {
                                        props.setType(value)
                                    }}
                                    style={{fontSize: buttonTextSize}}
                                >
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