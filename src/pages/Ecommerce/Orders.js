import React, { Component } from 'react';
import { Container, Card, CardBody, Row, Col, Nav, NavItem, NavLink, UncontrolledTooltip, Input, Label, Button } from "reactstrap";
import { Link } from "react-router-dom";
import classnames from 'classnames';

import { MDBDataTable } from "mdbreact";
import "./datatables.scss";

//Import Breadcrumb
import Breadcrumbs from '../../components/Common/Breadcrumb';

class Orders extends Component {
    constructor(props) {
        super(props);
        this.state = {
            breadcrumbItems: [
                { title: "클러스터 관리", link: "#" },
                { title: "코어 클라우드 관리", link: "#" },
            ],
            activeTab: '1',
        }
        this.toggleTab = this.toggleTab.bind(this);
    }

    toggleTab(tab) {
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab
            });
        }
    }

    componentDidMount() {
        document.getElementsByClassName("pagination")[0].classList.add("pagination-rounded");
    }

    render() {
        const data = {
            columns: [
                {
                    label: <div className="custom-control custom-checkbox"> <Input type="checkbox" className="custom-control-input" id="ordercheck" /><Label className="custom-control-label" htmlFor="ordercheck">&nbsp;</Label></div>,
                    field: "checkbox",
                    sort: "asc",
                    width: 28
                },
                {
                    label: "Order ID",
                    field: "id",
                    sort: "asc",
                    width: 78
                },
                {
                    label: "Date",
                    field: "date",
                    sort: "asc",
                    width: 93
                },
                {
                    label: "Billing Name",
                    field: "billingName",
                    sort: "asc",
                    width: 109
                },
                {
                    label: "Total",
                    field: "total",
                    sort: "asc",
                    width: 48
                },
                {
                    label: "Payment Status",
                    field: "status",
                    sort: "asc",
                    width: 135
                },
                // {
                //     label: "//invoice",
                //     field: "//invoice",
                //     sort: "asc",
                //     width: 110
                // },
                {
                    label: "Action",
                    field: "action",
                    sort: "asc",
                    width: 120
                },
            ],
            rows: [
                {
                    checkbox:
                        <div className="custom-control custom-checkbox">
                            <Input type="checkbox" className="custom-control-input" id="ordercheck1" />
                            <Label className="custom-control-label" htmlFor="ordercheck1">&nbsp;</Label>
                        </div>,
                    id: <Link to="maps-google" className="text-dark font-weight-bold">#NZ1572</Link>,
                    date: "04 Apr, 2020",
                    billingName: "Walter Brown",
                    total: "$172",
                    status: <div className="badge badge-soft-success font-size-12">running</div>,
                    //invoice: <Button className="btn-rounded" color="light">//invoice <i className="mdi mdi-download ml-2"></i></Button>,
                    action: <><Link to="#" className="mr-3 text-primary" id="edit1"><i className="mdi mdi-pencil font-size-18"></i></Link>
                        <UncontrolledTooltip placement="top" target="edit1">
                            Edit
                        </UncontrolledTooltip >
                        <Link to="#" className="text-danger" id="delete1"><i className="mdi mdi-trash-can font-size-18"></i></Link>
                        <UncontrolledTooltip placement="top" target="delete1">
                            Delete
                        </UncontrolledTooltip >
                    </>
                },
                {
                    checkbox:
                        <div className="custom-control custom-checkbox">
                            <Input type="checkbox" className="custom-control-input" id="ordercheck2" />
                            <Label className="custom-control-label" htmlFor="ordercheck2">&nbsp;</Label>
                        </div>,
                    id: <Link to="#" className="text-dark font-weight-bold">#NZ1571</Link>,
                    date: "03 Apr, 2020",
                    billingName: "Jimmy Barker",
                    total: "$165",
                    status: <div className="badge badge-soft-warning font-size-12">unpaid</div>,
                    //invoice: <Button className="btn-rounded" color="light">//invoice <i className="mdi mdi-download ml-2"></i></Button>,
                    action: <><Link to="#" className="mr-3 text-primary" id="edit2"><i className="mdi mdi-pencil font-size-18"></i></Link>
                        <UncontrolledTooltip placement="top" target="edit2">
                            Edit
                        </UncontrolledTooltip >
                        <Link to="#" className="text-danger" id="delete2"><i className="mdi mdi-trash-can font-size-18"></i></Link>
                        <UncontrolledTooltip placement="top" target="delete2">
                            Delete
                        </UncontrolledTooltip >
                    </>
                },
                {
                    checkbox:
                        <div className="custom-control custom-checkbox">
                            <Input type="checkbox" className="custom-control-input" id="ordercheck3" />
                            <Label className="custom-control-label" htmlFor="ordercheck3">&nbsp;</Label>
                        </div>,
                    id: <Link to="#" className="text-dark font-weight-bold">#NZ1570</Link>,
                    date: "03 Apr, 2020",
                    billingName: "Donald Bailey",
                    total: "$146",
                    status: <div className="badge badge-soft-success font-size-12">Paid</div>,
                    //invoice: <Button className="btn-rounded" color="light">//invoice <i className="mdi mdi-download ml-2"></i></Button>,
                    action: <><Link to="#" className="mr-3 text-primary" id="edit3"><i className="mdi mdi-pencil font-size-18"></i></Link>
                        <UncontrolledTooltip placement="top" target="edit3">
                            Edit
                        </UncontrolledTooltip >
                        <Link to="#" className="text-danger" id="delete3"><i className="mdi mdi-trash-can font-size-18"></i></Link>
                        <UncontrolledTooltip placement="top" target="delete3">
                            Delete
                        </UncontrolledTooltip >
                    </>
                },
                {
                    checkbox:
                        <div className="custom-control custom-checkbox">
                            <Input type="checkbox" className="custom-control-input" id="ordercheck4" />
                            <Label className="custom-control-label" htmlFor="ordercheck4">&nbsp;</Label>
                        </div>,
                    id: <Link to="#" className="text-dark font-weight-bold">#NZ1569</Link>,
                    date: "02 Apr, 2020",
                    billingName: "Paul Jones",
                    total: "$183",
                    status: <div className="badge badge-soft-success font-size-12">Paid</div>,
                    //invoice: <Button className="btn-rounded" color="light">//invoice <i className="mdi mdi-download ml-2"></i></Button>,
                    action: <><Link to="#" className="mr-3 text-primary" id="edit4"><i className="mdi mdi-pencil font-size-18"></i></Link>
                        <UncontrolledTooltip placement="top" target="edit4">
                            Edit
                        </UncontrolledTooltip >
                        <Link to="#" className="text-danger" id="delete5"><i className="mdi mdi-trash-can font-size-18"></i></Link>
                        <UncontrolledTooltip placement="top" target="delete5">
                            Delete
                        </UncontrolledTooltip >
                    </>
                },
                {
                    checkbox:
                        <div className="custom-control custom-checkbox">
                            <Input type="checkbox" className="custom-control-input" id="ordercheck6" />
                            <Label className="custom-control-label" htmlFor="ordercheck6">&nbsp;</Label>
                        </div>,
                    id: <Link to="#" className="text-dark font-weight-bold">#NZ1568</Link>,
                    date: "04 Apr, 2020",
                    billingName: "Walter Brown",
                    total: "$172",
                    status: <div className="badge badge-soft-danger font-size-12">running</div>,
                    //invoice: <Button className="btn-rounded" color="light">//invoice <i className="mdi mdi-download ml-2"></i></Button>,
                    action: <><Link to="#" className="mr-3 text-primary" id="edit6"><i className="mdi mdi-pencil font-size-18"></i></Link>
                        <UncontrolledTooltip placement="top" target="edit6">
                            Edit
                        </UncontrolledTooltip >
                        <Link to="#" className="text-danger" id="delete6"><i className="mdi mdi-trash-can font-size-18"></i></Link>
                        <UncontrolledTooltip placement="top" target="delete6">
                            Delete
                        </UncontrolledTooltip >
                    </>
                },
                {
                    checkbox:
                        <div className="custom-control custom-checkbox">
                            <Input type="checkbox" className="custom-control-input" id="ordercheck7" />
                            <Label className="custom-control-label" htmlFor="ordercheck7">&nbsp;</Label>
                        </div>,
                    id: <Link to="#" className="text-dark font-weight-bold">#NZ1567</Link>,
                    date: "04 Apr, 2020",
                    billingName: "Walter Brown",
                    total: "$172",
                    status: <div className="badge badge-soft-warning font-size-12">unpaid</div>,
                    //invoice: <Button className="btn-rounded" color="light">//invoice <i className="mdi mdi-download ml-2"></i></Button>,
                    action: <><Link to="#" className="mr-3 text-primary" id="edit7"><i className="mdi mdi-pencil font-size-18"></i></Link>
                        <UncontrolledTooltip placement="top" target="edit7">
                            Edit
                        </UncontrolledTooltip >
                        <Link to="#" className="text-danger" id="delete7"><i className="mdi mdi-trash-can font-size-18"></i></Link>
                        <UncontrolledTooltip placement="top" target="delete7">
                            Delete
                        </UncontrolledTooltip >
                    </>
                },
                {
                    checkbox:
                        <div className="custom-control custom-checkbox">
                            <Input type="checkbox" className="custom-control-input" id="ordercheck8" />
                            <Label className="custom-control-label" htmlFor="ordercheck8">&nbsp;</Label>
                        </div>,
                    id: <Link to="#" className="text-dark font-weight-bold">#NZ1566</Link>,
                    date: "04 Apr, 2020",
                    billingName: "Walter Brown",
                    total: "$172",
                    status: <div className="badge badge-soft-success font-size-12">Paid</div>,
                    //invoice: <Button className="btn-rounded" color="light">//invoice <i className="mdi mdi-download ml-2"></i></Button>,
                    action: <><Link to="#" className="mr-3 text-primary" id="edit9"><i className="mdi mdi-pencil font-size-18"></i></Link>
                        <UncontrolledTooltip placement="top" target="edit9">
                            Edit
                        </UncontrolledTooltip >
                        <Link to="#" className="text-danger" id="delete9"><i className="mdi mdi-trash-can font-size-18"></i></Link>
                        <UncontrolledTooltip placement="top" target="delete9">
                            Delete
                        </UncontrolledTooltip >
                    </>
                },
                {
                    checkbox:
                        <div className="custom-control custom-checkbox">
                            <Input type="checkbox" className="custom-control-input" id="ordercheck10" />
                            <Label className="custom-control-label" htmlFor="ordercheck10">&nbsp;</Label>
                        </div>,
                    id: <Link to="#" className="text-dark font-weight-bold">#NZ1565</Link>,
                    date: "04 Apr, 2020",
                    billingName: "Walter Brown",
                    total: "$172",
                    status: <div className="badge badge-soft-success font-size-12">Paid</div>,
                    //invoice: <Button className="btn-rounded" color="light">//invoice <i className="mdi mdi-download ml-2"></i></Button>,
                    action: <><Link to="#" className="mr-3 text-primary" id="edit10"><i className="mdi mdi-pencil font-size-18"></i></Link>
                        <UncontrolledTooltip placement="top" target="edit10">
                            Edit
                        </UncontrolledTooltip >
                        <Link to="#" className="text-danger" id="delete10"><i className="mdi mdi-trash-can font-size-18"></i></Link>
                        <UncontrolledTooltip placement="top" target="delete10">
                            Delete
                        </UncontrolledTooltip >
                    </>
                },
                {
                    checkbox:
                        <div className="custom-control custom-checkbox">
                            <Input type="checkbox" className="custom-control-input" id="ordercheck11" />
                            <Label className="custom-control-label" htmlFor="ordercheck11">&nbsp;</Label>
                        </div>,
                    id: <Link to="#" className="text-dark font-weight-bold">#NZ1564</Link>,
                    date: "04 Apr, 2020",
                    billingName: "Walter Brown",
                    total: "$172",
                    status: <div className="badge badge-soft-success font-size-12">Paid</div>,
                    //invoice: <Button className="btn-rounded" color="light">//invoice <i className="mdi mdi-download ml-2"></i></Button>,
                    action: <><Link to="#" className="mr-3 text-primary" id="edit11"><i className="mdi mdi-pencil font-size-18"></i></Link>
                        <UncontrolledTooltip placement="top" target="edit11">
                            Edit
                        </UncontrolledTooltip >
                        <Link to="#" className="text-danger" id="delete11"><i className="mdi mdi-trash-can font-size-18"></i></Link>
                        <UncontrolledTooltip placement="top" target="delete11">
                            Delete
                        </UncontrolledTooltip >
                    </>
                },
                {
                    checkbox:
                        <div className="custom-control custom-checkbox">
                            <Input type="checkbox" className="custom-control-input" id="ordercheck12" />
                            <Label className="custom-control-label" htmlFor="ordercheck12">&nbsp;</Label>
                        </div>,
                    id: <Link to="#" className="text-dark font-weight-bold">#NZ1563</Link>,
                    date: "04 Apr, 2020",
                    billingName: "Walter Brown",
                    total: "$172",
                    status: <div className="badge badge-soft-warning font-size-12">unpaid</div>,
                    //invoice: <Button className="btn-rounded" color="light">//invoice <i className="mdi mdi-download ml-2"></i></Button>,
                    action: <><Link to="#" className="mr-3 text-primary" id="edit12"><i className="mdi mdi-pencil font-size-18"></i></Link>
                        <UncontrolledTooltip placement="top" target="edit12">
                            Edit
                        </UncontrolledTooltip >
                        <Link to="#" className="text-danger" id="delete12"><i className="mdi mdi-trash-can font-size-18"></i></Link>
                        <UncontrolledTooltip placement="top" target="delete12">
                            Delete
                        </UncontrolledTooltip >
                    </>
                },
                {
                    checkbox:
                        <div className="custom-control custom-checkbox">
                            <Input type="checkbox" className="custom-control-input" id="ordercheck13" />
                            <Label className="custom-control-label" htmlFor="ordercheck13">&nbsp;</Label>
                        </div>,
                    id: <Link to="#" className="text-dark font-weight-bold">#NZ15632</Link>,
                    date: "04 Apr, 2020",
                    billingName: "Walter Brown",
                    total: "$172",
                    status: <div className="badge badge-soft-success font-size-12">Paid</div>,
                    //invoice: <Button className="btn-rounded" color="light">//invoice <i className="mdi mdi-download ml-2"></i></Button>,
                    action: <><Link to="#" className="mr-3 text-primary" id="edit13"><i className="mdi mdi-pencil font-size-18"></i></Link>
                        <UncontrolledTooltip placement="top" target="edit13">
                            Edit
                        </UncontrolledTooltip >
                        <Link to="#" className="text-danger" id="delete13"><i className="mdi mdi-trash-can font-size-18"></i></Link>
                        <UncontrolledTooltip placement="top" target="delete13">
                            Delete
                        </UncontrolledTooltip >
                    </>
                },
            ]
        }
        return (
            <React.Fragment>
                <div className="page-content">
                    <Container fluid>

                        <Breadcrumbs title="Orders" breadcrumbItems={this.state.breadcrumbItems} />

                        <Row>
                            <Col lg={12}>
                                <Card>
                                    <CardBody className="pt-0">
                                        <Nav tabs className="nav-tabs-custom mb-4">
                                            <NavItem>
                                                <NavLink onClick={() => { this.toggleTab('1'); }} className={classnames({ active: this.state.activeTab === '1' }, "font-weight-bold p-3")}>All Orders</NavLink>
                                            </NavItem>
                                            <NavItem>
                                                <NavLink onClick={() => { this.toggleTab('2'); }} className={classnames({ active: this.state.activeTab === '2' }, "p-3 font-weight-bold")}>Active</NavLink>
                                            </NavItem>
                                            <NavItem>
                                                <NavLink onClick={() => { this.toggleTab('3'); }} className={classnames({ active: this.state.activeTab === '3' }, " p-3 font-weight-bold")}>Unpaid</NavLink>
                                            </NavItem>
                                        </Nav>
                                        <div>
                                            <Link to="ecommerce-add-product" onClick={() => this.setState({ modal_static: true, isAlertOpen: false })} className="btn btn-success mb-2"><i className="mdi mdi-plus mr-2"></i> 추가</Link>
                                        </div>
                                        <MDBDataTable responsive data={data} className="mt-4" />
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

export default Orders;