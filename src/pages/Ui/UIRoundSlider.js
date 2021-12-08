import React, { Component } from 'react';
import { Container, Row, Col, Card, CardBody } from "reactstrap";

import { CircleSlider } from "react-circle-slider";

//Import Breadcrumb
import Breadcrumbs from '../../components/Common/Breadcrumb';

class UIRoundSlider extends Component {
    constructor(props) {
        super(props);
        this.state={
            breadcrumbItems : [
                { title : "UI Elements", link : "#" },
                { title : "Round Slider", link : "#" },
            ],
            value: 45,
            value2: 30,
            value3: 50,
            value4: 60,
            value5: 70,
            value6: 80,
            value7: 60,
            value8: 70,
            value9: 80,
        }
    }

    handleChange = value => {
        this.setState({ value : value });
    };

    handleChange2 = value => {
        this.setState({ value2 : value });
    };

    handleChange3 = value => {
        this.setState({ value3 : value });
    };

    handleChange4 = value => {
        this.setState({ value4 : value });
    };

    handleChange5 = value => {
        this.setState({ value5 : value });
    };

    handleChange6 = value => {
        this.setState({ value6 : value });
    };

    handleChange7 = value => {
        this.setState({ value7 : value });
    };

    handleChange8 = value => {
        this.setState({ value8 : value });
    };

    handleChange9 = value => {
        this.setState({ value9 : value });
    };

    render() {
        return (
            <React.Fragment>
                <div className="page-content">
                    <Container fluid>

                    <Breadcrumbs title="Round Slider" breadcrumbItems={this.state.breadcrumbItems} />

                    <Row>
                            <Col xs={12}>
                                <Card>
                                    <CardBody>
        
                                        <h4 className="card-title">Slider Types</h4>
        
                                        <Row>
                                            <Col xl={4} sm={6}>
                                                <div className="text-center mt-4">
                                                    <h5 className="font-size-14 mb-4">Default</h5>

                                                    <div dir="ltr">
                                                        
                                                        <CircleSlider showTooltip={true} value={this.state.value} onChange={this.handleChange} />
                                                       
                                                    </div>
                                                </div>
                                            </Col>
                                            <Col xl={4} sm={6}>
                                                <div className="text-center mt-4">
                                                    <h5 className="font-size-14 mb-4">Min range</h5>

                                                    <div dir="ltr">
                                                        <CircleSlider showTooltip={true} value={this.state.value2} min={10} onChange={this.handleChange2} />
                                                        
                                                    </div>
                                                </div>
                                            </Col>

                                            <Col xl={4} sm={6}>
                                                <div className="text-center mt-4">
                                                    <h5 className="font-size-14 mb-4">Max range</h5>

                                                    <div dir="ltr">
                                                        <CircleSlider showTooltip={true} value={this.state.value3} max={80} onChange={this.handleChange3} />
                                                        
                                                    </div>
                                                </div>
                                            </Col>
                                        </Row>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>

                        <Row>
                            <Col xs={12}>
                                <Card>
                                    <CardBody>
        
                                        <h4 className="card-title">Custom Colors</h4>
        
                                        <Row>
                                            <Col xl={4} sm={6}>
                                                <div className="text-center mt-4">
                                                    <h5 className="font-size-14 mb-4">Custom progress color</h5>

                                                    <div dir="ltr">
                                                        
                                                        <CircleSlider showTooltip={true} progressColor="#6C7290" value={this.state.value4} onChange={this.handleChange4} />
                                                       
                                                    </div>
                                                </div>
                                            </Col>
                                            <Col xl={4} sm={6}>
                                                <div className="text-center mt-4">
                                                    <h5 className="font-size-14 mb-4">Custom gradient color</h5>

                                                    <div dir="ltr">
                                                        <CircleSlider showTooltip={true}  gradientColorFrom="#FEA346" gradientColorTo="#F8616D" value={this.state.value5} onChange={this.handleChange5} />
                                                        
                                                    </div>
                                                </div>
                                            </Col>

                                            <Col xl={4} sm={6}>
                                                <div className="text-center mt-4">
                                                    <h5 className="font-size-14 mb-4">Tooltip Color & Size</h5>

                                                    <div dir="ltr">
                                                        <CircleSlider showTooltip={true} progressColor="#6656B6" tooltipColor="#6ab6e1"  tooltipSize={26} value={this.state.value6} onChange={this.handleChange6} />
                                                        
                                                    </div>
                                                </div>
                                            </Col>
                                        </Row>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>

                        <Row>
                            <Col xs={12}>
                                <Card>
                                    <CardBody>
        
                                        <h4 className="card-title">Other</h4>
        
                                        <Row>
                                            <Col xl={4} sm={6}>
                                                <div className="text-center mt-4">
                                                    <h5 className="font-size-14 mb-4">Size</h5>

                                                    <div dir="ltr">
                                                        
                                                        <CircleSlider size={140} knobRadius={20} showTooltip={true} value={this.state.value7} onChange={this.handleChange7} />
                                                       
                                                    </div>
                                                </div>
                                            </Col>
                                            <Col xl={4} sm={6}>
                                                <div className="text-center mt-4">
                                                    <h5 className="font-size-14 mb-4">Exact sizes</h5>

                                                    <div dir="ltr">
                                                        <CircleSlider showTooltip={true} knobRadius={15} size={140} progressWidth={10} circleWidth={25} progressColor="#6AB6E1" value={this.state.value8} onChange={this.handleChange8} />
                                                        
                                                    </div>
                                                </div>
                                            </Col>

                                            <Col xl={4} sm={6}>
                                                <div className="text-center mt-4">
                                                    <h5 className="font-size-14 mb-4">Percentage & Knob Color</h5>

                                                    <div dir="ltr">
                                                        <CircleSlider howPercentage={true} shadow={true} showTooltip={true} knobColor="#ff5722"  tooltipSize={26} value={this.state.value9} onChange={this.handleChange9} />
                                                        
                                                    </div>
                                                </div>
                                            </Col>
                                        </Row>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                    
                    </Container> 
                </div>
            </React.Fragment>
        );
    }
}

export default UIRoundSlider;