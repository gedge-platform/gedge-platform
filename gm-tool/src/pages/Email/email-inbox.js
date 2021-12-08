import React, { Component } from 'react';
import { Container, Card, CardBody, Row, Col, Table, UncontrolledTooltip, Alert, Input, Label, Modal, ModalHeader, ModalBody, ModalFooter, Button, FormGroup } from "reactstrap";
import { Link } from "react-router-dom";

import { AvForm, AvField } from "availity-reactstrap-validation";

//Import Breadcrumb
import Breadcrumbs from '../../components/Common/Breadcrumb';
import TypeChecker from 'typeco';

import SearchField from '../Tables/SearchField';
const exampleList = [
    {
        customer: "Carolyn Harvey",
        email: "CarolynHarvey@rhyta.com",
        phone: "580-464-4694",
        balance: "$ 3245",
        date: "06 Apr, 2020",
    },
    {
        customer: "Angelyn Hardin",
        email: "AngelynHardin@dayrep.com",
        phone: "913-248-2690",
        balance: "$ 2435",
        date: "05 Apr, 2020",
    },
    {
        customer: "Carrie Thompson	",
        email: "CarrieThompson@rhyta.com",
        phone: "734-819-9286",
        balance: "$ 2653",
        date: "04 Apr, 2020",
    },
    {
        customer: "Kathleen Haller",
        email: "KathleenHaller@dayrep.com",
        phone: "313-742-3333",
        balance: "$ 2135",
        date: "03 Apr, 2020",
    },
    {
        customer: "Martha Beasley",
        email: "MarthaBeasley@teleworm.us",
        phone: "301-330-5745",
        balance: "$ 2698",
        date: "02 Apr, 2020",
    },
    {
        customer: "Kathryn Hudson",
        email: "KathrynHudson@armyspy.com",
        phone: "414-453-5725",
        balance: "$ 2758",
        date: "02 Apr, 2020",
    },
    {
        customer: "Robert Bott",
        email: "RobertBott@armyspy.com",
        phone: "712-237-9899",
        balance: "$ 2836",
        date: "01 Apr, 2020",
    },
    {
        customer: "Mary McDonald",
        email: "MaryMcDonald@armyspy.com",
        phone: "317-510-25554",
        balance: "$ 3245",
        date: "31 Mar, 2020",
    },
    {
        customer: "Keith Rainey",
        email: "KeithRainey@jourrapide.com	",
        phone: "214-712-1810",
        balance: "$ 3125",
        date: "30 Mar, 2020",
    },
    {
        customer: "Anthony Russo",
        email: "AnthonyRusso@jourrapide.com",
        phone: "412-371-8864",
        balance: "$ 2456",
        date: "30 Mar, 2020",
    },
    {
        customer: "Donna Betz",
        email: "DonnaBetz@jourrapide.com",
        phone: "626-583-5779",
        balance: "$ 3423",
        date: "29 Mar, 2020",
    },
    {
        customer: "Angie Andres",
        email: "AngieAndres@armyspy.com",
        phone: "213-494-4527",
        balance: "$ 3245",
        date: "28 Apr, 2020"
    }
];
const getMatchedList = (searchText) => {
    if (TypeChecker.isEmpty(searchText)) return exampleList;
    return exampleList.filter(item => item.customer.toLowerCase().includes(searchText.toLowerCase()));
};
const ExampleList = props => (
    <div className="list-example">
        {/* <div className="list-header">
            <ul>
                <li> Name </li>
                <li> Email </li>
            </ul>
        </div> */}
        <div className="list-body">
            {
                props.list.map((item, index) => (
                    <ul key={index}>
                        <tr> {item.customer} </tr>
                        <tr> {item.email} </tr>
                    </ul>))
            }
        </div>
    </div>
);
class EmailInbox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            onSearchClickExampleList: [...exampleList],
            breadcrumbItems: [
                { title: "프로젝트", link: "#" },
                { title: "시스템 프로젝트", link: "#" },
            ],
            isAlertOpen: false,
            modal_static: false,
        }
        this.addCustomer.bind(this);
        this.onSearchClickExample = this.onSearchClickExample.bind(this);
    }

    addCustomer = (event, values) => {
        //Assign values to the variables
        var name = values.custname;
        var cEmail = values.custemail;
        var phonenumber = values.phonenumber;
        var newBalance = "$ " + values.wBalance;
        var d = new Date();
        var day = d.getDate();
        var mon = d.getMonth();
        var y = d.getFullYear();
        var date = day + "/" + mon + "/" + y;
        let demoData = this.state.data;

        //push data to the varible
        demoData.push({ customer: name, email: cEmail, phone: phonenumber, balance: newBalance, date: date })

        //update data state
        this.setState({ data: demoData });

        //show alert for success message
        this.setState({ isAlertOpen: true });

        //update state for closing
        setTimeout(() => {
            this.setState({ modal_static: false });
        }, 2000);
    }
    onSearchClickExample(value) {
        this.setState({
            onSearchClickExampleList: getMatchedList(value),
        });
    }


    render() {
        return (
            <React.Fragment>
                <div className="page-content">
                    <Container fluid>

                        <Breadcrumbs title="시스템 프로젝트" breadcrumbItems={this.state.breadcrumbItems} />

                        <Row>
                            <Col lg={12}>
                                <Card>
                                    <div>
                                        {/* <h5>Example: onSearchClick  </h5> */}

                                        {/* {exampleSnippets.onSearchClickExample} */}

                                        <SearchField
                                            placeholder="Search item"
                                            onSearchClick={this.onSearchClickExample}
                                        />
                                        <ExampleList
                                            list={this.state.onSearchClickExampleList}
                                        />
                                    </div>
                                    {/* <CardBody>
                                        <div>
                                            <Link to="ecommerce-add-product" onClick={() => this.setState({ modal_static: true, isAlertOpen: false })} className="btn btn-success mb-2"><i className="mdi mdi-plus mr-2"></i> 추가</Link>
                                        </div>
                                        <div className="table-responsive mt-3">
                                            <Table className="table-centered datatable dt-responsive nowrap " style={{ borderCollapse: "collapse", borderSpacing: 0, width: "100%" }}>
                                                <thead className="thead-light">
                                                    <tr>
                                                        <th style={{ width: "20px" }}>
                                                            <div className="custom-control custom-checkbox">
                                                                <Input type="checkbox" className="custom-control-input" id="customercheck" />
                                                                <Label className="custom-control-label" htmlFor="customercheck">&nbsp;</Label>
                                                            </div>
                                                        </th>
                                                        <th>이름</th>
                                                        <th>상태</th>
                                                        <th>워크스페이스</th>
                                                        <th>CPU</th>
                                                        <th>메모리</th>
                                                        <th>파드</th>
                                                        <th style={{ width: "120px" }}>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        this.state.exampleList.map((item, index) =>
                                                            <tr key={index}>
                                                                <td>
                                                                    <div className="custom-control custom-checkbox">
                                                                        <Input type="checkbox" className="custom-control-input" id={"customercheck" + index} />
                                                                        <Label className="custom-control-label" htmlFor={"customercheck" + index}>&nbsp;</Label>
                                                                    </div>
                                                                </td>

                                                                <td>{item.customer}</td>
                                                                <td>{item.email}<div className="badge badge-soft-warning font-size-12"></div></td>
                                                                <td>{item.phone}</td>

                                                                <td>
                                                                    {item.balance}
                                                                </td>
                                                                <td>
                                                                    {item.date}
                                                                </td>
                                                                <td>
                                                                    {item.date}
                                                                </td>
                                                                <td>
                                                                    <Link to="/dashboard" className="mr-3 text-primary" id={"edit" + index}><i className="mdi mdi-pencil font-size-18"></i></Link>
                                                                    <UncontrolledTooltip target={"edit" + index} placement="top">
                                                                        Edit
                                                                    </UncontrolledTooltip>
                                                                    <Link to="#" className="text-danger" id={"delete" + index}><i className="mdi mdi-trash-can font-size-18"></i></Link>
                                                                    <UncontrolledTooltip target={"delete" + index} placement="top">
                                                                        Delete
                                                                    </UncontrolledTooltip>
                                                                </td>
                                                            </tr>
                                                        )
                                                    }
                                                </tbody>
                                            </Table>
                                        </div>
                                    </CardBody> */}
                                </Card>
                            </Col>
                        </Row>

                        <Modal
                            isOpen={this.state.modal_static}
                            toggle={this.tog_static}
                            backdrop="static"
                            centered
                            size="lg"
                        >
                            <ModalHeader toggle={() => this.setState({ modal_static: false })}>
                                Add Customer Details
                            </ModalHeader>
                            <ModalBody>
                                <AvForm onValidSubmit={this.addCustomer}>
                                    <Row>
                                        <Col lg={12}>
                                            <Alert color="success" isOpen={this.state.isAlertOpen} toggle={() => this.setState({ isAlertOpen: false })}>
                                                Data Added Successfully...!
                                            </Alert>
                                            <FormGroup>
                                                <Label htmlFor="name">Customer Name</Label>
                                                <AvField
                                                    name="custname"
                                                    type="text"
                                                    className="form-control"
                                                    id="custname"
                                                    placeholder="Enter Customer Name"
                                                    required
                                                />
                                            </FormGroup>
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col lg={4}>
                                            <FormGroup>
                                                <Label htmlFor="email">Email</Label>
                                                <AvField
                                                    name="custemail"
                                                    type="email"
                                                    className="form-control"
                                                    id="custemail"
                                                    placeholder="Enter Email"
                                                    required
                                                />
                                            </FormGroup>
                                        </Col>

                                        <Col lg={4}>
                                            <FormGroup>
                                                <Label htmlFor="email">Phone Number</Label>
                                                <AvField
                                                    name="phonenumber"
                                                    type="number"
                                                    className="form-control"
                                                    id="phonenumber"
                                                    placeholder="Enter Phone Number"
                                                    required
                                                />
                                            </FormGroup>
                                        </Col>

                                        <Col lg={4}>
                                            <FormGroup>
                                                <Label htmlFor="email">Wallet Balance</Label>
                                                <AvField
                                                    name="wBalance"
                                                    type="number"
                                                    className="form-control"
                                                    id="wBalance"
                                                    placeholder="Wallet Balance"
                                                    required
                                                />
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                    <ModalFooter>
                                        <Button type="button" color="light" onClick={() => this.setState({ modal_static: false })}>Calcel</Button>
                                        <Button type="submit" color="primary">Add</Button>
                                    </ModalFooter>

                                </AvForm>

                            </ModalBody>
                        </Modal>

                    </Container>
                </div>
            </React.Fragment>
        );
    }
}

export default EmailInbox;