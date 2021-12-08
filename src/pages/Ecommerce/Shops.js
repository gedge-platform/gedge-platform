import React, { Component } from 'react';
import { Container, Card, CardBody, Row, Col, Media, Table, Dropdown, DropdownMenu, DropdownItem, DropdownToggle, ButtonDropdown, Modal, ModalHeader, ModalBody, Form, Input, Label, FormGroup, Button } from "reactstrap";
import { Link } from "react-router-dom";

//Import Breadcrumb
import Breadcrumbs from '../../components/Common/Breadcrumb';

//Import Images

import RevenueAnalytics from "../Dashboard/RevenueAnalytics"
import EarningReports from '../Dashboard/EarningReports';
class Shops extends Component {
    constructor(props) {
        super(props);
        this.state = {
            breadcrumbItems: [
                { title: "Ecommerce", link: "#" },
                { title: "Shops", link: "#" },
            ],

        }
    }

    render() {

        return (
            <React.Fragment>

                <Card>
                    <Row>
                        {/* 클러스터 detail 정보 */}
                        <Col lg={4}>
                            <Card className="checkout-order-summary">
                                <CardBody>
                                    {/* <div className="p-3 bg-light mb-4"> */}
                                    <h5 className="text-dark font-weight-bold">클러스터 이름 </h5>
                                    <Card>
                                    </Card>
                                    <Row>
                                        <div>
                                            <Link
                                                onClick={() =>
                                                    this.setState({ isModal: !this.state.modal })
                                                }
                                                to="#"
                                                className="popup-form btn btn-primary"
                                            >
                                                정보수정
                                            </Link>
                                        </div>
                                        <Modal
                                            size="xl"
                                            isOpen={this.state.isModal}
                                            centered={true}
                                            toggle={() =>
                                                this.setState({ isModal: !this.state.isModal })
                                            }
                                        >
                                            <ModalHeader
                                                toggle={() =>
                                                    this.setState({ isModal: !this.state.isModal })
                                                }
                                            >
                                                Form
                                            </ModalHeader>
                                            <ModalBody>
                                                <Form>
                                                    <Row>
                                                        <Col lg={4}>
                                                            <FormGroup>
                                                                <Label htmlFor="name">Name</Label>
                                                                <Input
                                                                    type="text"
                                                                    className="form-control"
                                                                    id="name"
                                                                    placeholder="Enter Name"
                                                                    required
                                                                />
                                                            </FormGroup>
                                                        </Col>
                                                        <Col lg={4}>
                                                            <FormGroup>
                                                                <Label htmlFor="email">Email</Label>
                                                                <Input
                                                                    type="email"
                                                                    className="form-control"
                                                                    id="email"
                                                                    placeholder="Enter Email"
                                                                    required
                                                                />
                                                            </FormGroup>
                                                        </Col>
                                                        <Col lg={4}>
                                                            <FormGroup>
                                                                <Label htmlFor="password">Password</Label>
                                                                <Input
                                                                    type="text"
                                                                    className="form-control"
                                                                    id="password"
                                                                    placeholder="Enter Password"
                                                                    required
                                                                />
                                                            </FormGroup>
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col lg={12}>
                                                            <FormGroup>
                                                                <Label htmlFor="subject">Subject</Label>
                                                                <textarea
                                                                    className="form-control"
                                                                    id="subject"
                                                                    rows="3"
                                                                ></textarea>
                                                            </FormGroup>
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col lg={12}>
                                                            <div className="text-right">
                                                                <Button
                                                                    type="submit"
                                                                    color="primary"
                                                                >
                                                                    Submit
                                                                </Button>
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                </Form>
                                            </ModalBody>
                                        </Modal>
                                        <Col sm={3}>
                                            {/* 정보 수정 */}
                                            {/* 더보기 */}

                                            <Dropdown
                                                isOpen={this.state.singlebtn}
                                                toggle={() =>
                                                    this.setState({ singlebtn: !this.state.singlebtn })
                                                }
                                            >
                                                <DropdownToggle color="primary" caret>
                                                    더보기{" "}
                                                    <i className="mdi mdi-chevron-down"></i>
                                                </DropdownToggle>
                                                <DropdownMenu>
                                                    <DropdownItem>서비스 수정</DropdownItem>
                                                    <DropdownItem>접근 수정</DropdownItem>
                                                    <DropdownItem>수정(YAML)</DropdownItem>
                                                    <DropdownItem>삭제</DropdownItem>
                                                </DropdownMenu>
                                            </Dropdown>
                                        </Col>

                                        {/* <h4 className="card-title">Popup with form</h4> */}




                                    </Row>
                                    {/* </div> */}
                                    <div className="table-responsive">

                                        <Table responsive className="mb-0">
                                            <thead>
                                                <tr>
                                                    <th style={{ width: "100%" }}>상세정보</th>
                                                    {/* <th>Examples</th> */}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>클러스터</td>
                                                    <td>

                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>쿠버네티스 버전</td>
                                                    <td>

                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>역할</td>
                                                    <td>

                                                    </td>
                                                </tr>

                                                <tr>
                                                    <td>생성자</td>
                                                    <td>

                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        생성일
                                                    </td>
                                                    <td>

                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        업데이트일
                                                    </td>
                                                    <td>

                                                    </td>
                                                </tr>
                                            </tbody>
                                        </Table>

                                    </div>
                                </CardBody>
                            </Card>
                        </Col>
                        <Col lg={8}>
                            {/* 서비스 정보  */}
                            <Card>
                                <CardBody>
                                    <RevenueAnalytics />

                                </CardBody>
                            </Card>
                            <Card>
                                <CardBody>
                                    <h4 className="card-title">워크로드 정보</h4>
                                    <EarningReports />
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Card>
                {/* </Container>
                </div> */}
            </React.Fragment >
        );
    }
}

export default Shops;