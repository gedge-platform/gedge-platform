import React, { Component } from 'react';
import { Container, Card, CardBody, Row, Col, Media, Table, Dropdown, DropdownMenu, DropdownItem, DropdownToggle, ButtonDropdown, Modal, ModalHeader, ModalBody, Form, Input, Label, FormGroup, Button } from "reactstrap";
import { Link } from "react-router-dom";

//Import Breadcrumb
import Breadcrumbs from '../../components/Common/Breadcrumb';

//Import Images
import img1 from "../../assets/images/companies/img-1.png";
import img2 from "../../assets/images/companies/img-2.png";
import img3 from "../../assets/images/companies/img-3.png";
import img4 from "../../assets/images/companies/img-4.png";
import img5 from "../../assets/images/companies/img-5.png";
import img6 from "../../assets/images/companies/img-6.png";
import img7 from "../../assets/images/companies/img-7.png";
import img8 from "../../assets/images/companies/img-8.png";

class Shops extends Component {
    constructor(props) {
        super(props);
        this.state = {
            breadcrumbItems: [
                { title: "Ecommerce", link: "#" },
                { title: "Shops", link: "#" },
            ],
            shops: [
                { img: img1, name: "Nedick's", owner: "Wayne McClain", products: "86", balance: "12,456" },
                { img: img2, name: "Brendle's", owner: "David Marshall", products: "72", balance: "10,352" },
                { img: img3, name: "Tech Hifi", owner: "Katia Stapleton", products: "75", balance: "9,963" },
                { img: img4, name: "Lafayette", owner: "Andrew Bivens", products: "65", balance: "14,568" },
                { img: img5, name: "Packer", owner: "Mae Rankin", products: "82", balance: "16,445" },
                { img: img6, name: "Micro Design", owner: "Brian Correa", products: "71", balance: "11,523" },
                { img: img7, name: "Keeney's", owner: "Dean Odom", products: "66", balance: "13,478" },
                { img: img8, name: "Tech Hifi", owner: "John McLeroy", products: "58", balance: "14,654" },
            ]
        }
    }
    render() {
        return (
            <React.Fragment>
                {/* <div className="page-content">
                    <Container fluid> */}

                {/* <h4 className="card-title mb-4">Revenue Analytics</h4> */}
                {/* <Breadcrumbs title="SERVICE NAME" breadcrumbItems={this.state.breadcrumbItems} /> */}

                {/* <Row>
                            {
                                this.state.shops.map((shop, key) =>
                                    <Col xl={3} sm={6} key={key}>
                                        <Card>
                                            <CardBody>
                                                <div className="text-center">
                                                    <img src={shop.img} alt="" className="avatar-sm mt-2 mb-4" />
                                                    <Media body>
                                                        <h5 className="text-truncate"><Link to="#" className="text-dark">{shop.name}</Link></h5>
                                                        <p className="text-muted">
                                                            <i className="mdi mdi-account mr-1"></i> {shop.owner}
                                                        </p>
                                                    </Media>
                                                </div>

                                                <hr className="my-4" />

                                                <Row className="text-center">
                                                    <Col xs={6}>
                                                        <p className="text-muted mb-2">Products</p>
                                                        <h5>{shop.products}</h5>
                                                    </Col>
                                                    <Col xs={6}>
                                                        <p className="text-muted mb-2">Wallet Balance</p>
                                                        <h5>${shop.balance}</h5>
                                                    </Col>
                                                </Row>
                                            </CardBody>
                                        </Card>
                                    </Col>
                                )
                            }
                        </Row> */}
                <Card>
                    <Row>
                        {/* 클러스터 detail 정보 */}
                        {/* <Col lg={4}> */}
                        {/* <Card className="checkout-order-summary"> */}
                        <CardBody>
                            {/* <div className="p-3 bg-light mb-4"> */}
                            {/* <h5 className="font-size-14 mb-0">Order Summary <span className="float-right ml-2">#SK2356</span></h5> */}
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
                                <Table className="table-centered mb-0 table-nowrap">
                                    <thead>
                                        <tr>
                                            <th className="border-top-0" style={{ width: "110px" }} scope="col">Product</th>
                                            <th className="border-top-0" scope="col">Product Desc</th>
                                            <th className="border-top-0" scope="col">Price</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <th scope="row"><img src={img1} alt="product-img" title="product-img" className="avatar-md" /></th>
                                            <td>
                                                <h5 className="font-size-14 text-truncate"><Link to="/ecommerce-product-detail" className="text-dark">Full sleeve T-shirt</Link></h5>
                                                <p className="text-muted mb-0">$ 240 x 2</p>
                                            </td>
                                            <td>$ 480</td>
                                        </tr>
                                        <tr>
                                            <th scope="row"><img src={img2} alt="product-img" title="product-img" className="avatar-md" /></th>
                                            <td>
                                                <h5 className="font-size-14 text-truncate"><Link to="/ecommerce-product-detail" className="text-dark">Half sleeve T-shirt</Link></h5>
                                                <p className="text-muted mb-0">$ 225 x 1</p>
                                            </td>
                                            <td>$ 225</td>
                                        </tr>
                                        <tr>
                                            <td colSpan="2">
                                                <h6 className="m-0 text-right">Sub Total:</h6>
                                            </td>
                                            <td>
                                                $ 705
                                            </td>
                                        </tr>
                                        <tr>
                                            <td colSpan="3">
                                                <div className="bg-soft-primary p-3 rounded">
                                                    <h5 className="font-size-14 text-primary mb-0"><i className="fas fa-shipping-fast mr-2"></i> Shipping <span className="float-right">Free</span></h5>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td colSpan="2">
                                                <h6 className="m-0 text-right">Total:</h6>
                                            </td>
                                            <td>
                                                $ 705
                                            </td>
                                        </tr>
                                    </tbody>
                                </Table>

                            </div>
                        </CardBody>
                        {/* </Card> */}
                        {/* </Col> */}
                    </Row>
                </Card>
                {/* </Container>
                </div> */}
            </React.Fragment >
        );
    }
}

export default Shops;