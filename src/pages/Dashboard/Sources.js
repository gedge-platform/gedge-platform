import React, { Component } from 'react';
import { Card, CardBody, Col, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Table } from "reactstrap";
import { Link } from "react-router-dom";

//Import Images
import img1 from "../../assets/images/companies/img-1.png";
import img2 from "../../assets/images/companies/img-2.png";
import img3 from "../../assets/images/companies/img-3.png";

class Sources extends Component {
    constructor(props) {
        super(props);
        this.state = {
            menu: false,
        }
    }

    render() {
        return (
            <React.Fragment>
                <Col lg={12}>
                    <Card>
                        <CardBody>
                            <Dropdown className="float-right" isOpen={this.state.menu} toggle={() => this.setState({ menu: !this.state.menu })} >
                                <DropdownToggle tag="i" className="arrow-none card-drop">
                                    <i className="mdi mdi-dots-vertical"></i>
                                </DropdownToggle>
                                <DropdownMenu right>

                                    <DropdownItem href="">Sales Report</DropdownItem>

                                    <DropdownItem href="">Export Report</DropdownItem>

                                    <DropdownItem href="">Profit</DropdownItem>

                                    <DropdownItem href="">Action</DropdownItem>
                                </DropdownMenu>
                            </Dropdown>

                            <h4 className="card-title mb-3">Sources</h4>

                            <div>
                                <div className="text-center">
                                    <p className="mb-2">Total sources</p>
                                    <h4>$ 7652</h4>
                                    <div className="text-success">
                                        <i className="mdi mdi-menu-up font-size-14"> </i>2.2 %
                                    </div>
                                </div>

                                <div className="table-responsive mt-4">
                                    <Table hover className=" mb-0 table-centered table-nowrap">
                                        <tbody>
                                            <tr>
                                                <td style={{ width: "60px" }}>
                                                    <div className="avatar-xs">
                                                        <div className="avatar-title rounded-circle bg-light">
                                                            <img src={img1} alt="" height="20" />
                                                        </div>
                                                    </div>
                                                </td>

                                                <td>
                                                    <h5 className="font-size-14 mb-0">Source 1</h5>
                                                </td>
                                                <td><div id="spak-chart1"></div></td>
                                                <td>
                                                    <p className="text-muted mb-0">$ 2478</p>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <div className="avatar-xs">
                                                        <div className="avatar-title rounded-circle bg-light">
                                                            <img src={img2} alt="" height="20" />
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <h5 className="font-size-14 mb-0">Source 2</h5>
                                                </td>

                                                <td><div id="spak-chart2"></div></td>
                                                <td>
                                                    <p className="text-muted mb-0">$ 2625</p>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <div className="avatar-xs">
                                                        <div className="avatar-title rounded-circle bg-light">
                                                            <img src={img3} alt="" height="20" />
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <h5 className="font-size-14 mb-0">Source 3</h5>
                                                </td>
                                                <td><div id="spak-chart3"></div></td>
                                                <td>
                                                    <p className="text-muted mb-0">$ 2856</p>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </Table>
                                </div>

                                <div className="text-center mt-4">
                                    <Link to="#" className="btn btn-primary btn-sm">View more</Link>
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                </Col>
            </React.Fragment>
        );
    }
}

export default Sources;