import React, { Component } from 'react';
import { Row, Card, CardBody, Col, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap";
import { Link } from "react-router-dom";

//Import Vector Map Component
import Vector from "./Vectormap";

class RevenueByLocations extends Component {
    constructor(props) {
        super(props);
        this.state = {
            menu : false
        }
    }
    
    render() {
        return (
            <React.Fragment>
                            <Col lg={4}>
                                <Card>
                                    <CardBody>
                                        <Dropdown className="float-right" isOpen={this.state.menu} toggle={() => this.setState({menu : !this.state.menu})}>
                                            <DropdownToggle tag="i" className="darrow-none card-drop" aria-expanded="false">
                                                <i className="mdi mdi-dots-vertical"></i>
                                            </DropdownToggle>
                                            <DropdownMenu right>
                                                
                                                <DropdownItem href="">Sales Report</DropdownItem>
                                                
                                                <DropdownItem href="">Export Report</DropdownItem>
                                                
                                                <DropdownItem href="">Profit</DropdownItem>
                                                
                                                <DropdownItem href="">Action</DropdownItem>
                                            </DropdownMenu>
                                        </Dropdown>

                                        <h4 className="card-title mb-4">Revenue by Locations</h4>

                                        <div id="usa-vectormap" style={{height: "196px"}}>
                                        <Vector
                                          value="us_aea"
                                          width="200"
                                          color="#e8ecf4"
                                        />
                                        </div>

                                        <Row className="justify-content-center">
                                            <Col xl={5} md={6}>
                                                <div className="mt-2">
                                                    <div className="clearfix py-2">
                                                        <h5 className="float-right font-size-16 m-0">$ 2542</h5>
                                                        <p className="text-muted mb-0 text-truncate">California :</p>
                                                        
                                                    </div>
                                                    <div className="clearfix py-2">
                                                        <h5 className="float-right font-size-16 m-0">$ 2245</h5>
                                                        <p className="text-muted mb-0 text-truncate">Nevada :</p>
                                                        
                                                    </div>
                                                </div>
                                            </Col>
                                            <Col xl={{size:5, offset:1}} md={6}>
                                                <div className="mt-2">
                                                    <div className="clearfix py-2">
                                                        <h5 className="float-right font-size-16 m-0">$ 2156</h5>
                                                        <p className="text-muted mb-0 text-truncate">Montana :</p>
                                                        
                                                    </div>
                                                    <div className="clearfix py-2">
                                                        <h5 className="float-right font-size-16 m-0">$ 1845</h5>
                                                        <p className="text-muted mb-0 text-truncate">Texas :</p>
                                                        
                                                    </div>
                                                </div>
                                            </Col>
                                        </Row>
                                        <div className="text-center mt-4">
                                            <Link to="#" className="btn btn-primary btn-sm">Learn more</Link>
                                        </div>
                                        
                                    </CardBody>
                                </Card>
                            </Col>
            </React.Fragment>
        );
    }
}

export default RevenueByLocations;