import React, { Component } from 'react';
import { Container, Card, CardBody, Row, Col, Nav, NavItem, NavLink, TabContent, TabPane, Table, Media,Input, Button, InputGroup, InputGroupAddon } from "reactstrap";
import { Link } from "react-router-dom";
import classnames from 'classnames';

//Import Breadcrumb
import Breadcrumbs from '../../components/Common/Breadcrumb';

//Import Product Images
import img1 from "../../assets/images/product/img-1.png";
import img5 from "../../assets/images/product/img-5.png";
import img3 from "../../assets/images/product/img-3.png";
import img4 from "../../assets/images/product/img-4.png";

class ProductDetail extends Component {
    constructor(props) {
        super(props);
        this.state={
            breadcrumbItems : [
                { title : "Ecommerce", link : "#" },
                { title : "Product Details", link : "#" },
            ],
            activeTab: '1',
            activeTab2: '1',
        }
        this.toggleTab = this.toggleTab.bind(this);
        this.toggleTab2 = this.toggleTab2.bind(this);
        this.imageShow = this.imageShow.bind(this);
    }

    toggleTab(tab) {
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab
            });
        }
    }

    toggleTab2(tab) {
        if (this.state.activeTab2 !== tab) {
            this.setState({
                activeTab2: tab
            });
        }
    }

    imageShow(img, id) {
        var expandImg = document.getElementById("expandedImg" + id);
        expandImg.src = img;
    }
    
    render() {
        return (
            <React.Fragment>
                <div className="page-content">
                    <Container fluid>

                    <Breadcrumbs title="Product Details" breadcrumbItems={this.state.breadcrumbItems} />
                        
                        <Row>
                            <Col lg={12}>
                                <Card>
                                    <CardBody>
                                        <Row>
                                            <Col xl={5}>
                                                <div className="product-detail">
                                                    <Row>
                                                        <Col xs={3}>
                                                            <Nav pills className="flex-column" id="v-pills-tab" role="tablist" aria-orientation="vertical">
                                                                <NavLink
                                                                    className={classnames({ active: this.state.activeTab === '1' })}
                                                                    onClick={() => { this.toggleTab('1'); }}
                                                                >
                                                                    <img src={img1} alt="" onClick={() => { this.imageShow(img1, 1) }} className="img-fluid mx-auto d-block tab-img rounded"/>
                                                                </NavLink>
                                                                <NavLink
                                                                    className={classnames({ active: this.state.activeTab === '2' })}
                                                                    onClick={() => { this.toggleTab('2'); }}
                                                                >
                                                                    <img src={img5} alt="" onClick={() => { this.imageShow(img5, 1) }} className="img-fluid mx-auto d-block tab-img rounded"/>
                                                                </NavLink>
                                                                <NavLink
                                                                    className={classnames({ active: this.state.activeTab === '3' })}
                                                                    onClick={() => { this.toggleTab('3'); }}
                                                                >
                                                                    <img src={img3} onClick={() => { this.imageShow(img3, 1) }} alt="" className="img-fluid mx-auto d-block tab-img rounded"/>
                                                                </NavLink>
                                                                <NavLink
                                                                    className={classnames({ active: this.state.activeTab === '4' })}
                                                                    onClick={() => { this.toggleTab('4'); }}
                                                                >
                                                                    <img src={img4} alt="" onClick={() => { this.imageShow(img4, 1) }} className="img-fluid mx-auto d-block tab-img rounded"/>
                                                                </NavLink>
                                                            </Nav>
                                                        </Col>
                                                        <Col md={8} xs={9}>
                                                            <TabContent activeTab={this.state.activeTab} id="v-pills-tabContent">
                                                                <TabPane tabId="1">
                                                                    <div className="product-img">
                                                                        <img src={img1} id="expandedImg1" alt="" className="img-fluid mx-auto d-block"/>
                                                                    </div>
                                                                </TabPane>
                                                                <TabPane tabId="2">
                                                                    <div className="product-img">
                                                                        <img src={img5} id="expandedImg2" alt="" className="img-fluid mx-auto d-block"/>
                                                                    </div>
                                                                </TabPane>
                                                                <TabPane tabId="3">
                                                                    <div className="product-img">
                                                                        <img src={img3} id="expandedImg3" alt="" className="img-fluid mx-auto d-block"/>
                                                                    </div>
                                                                </TabPane>
                                                                <TabPane tabId="4">
                                                                    <div className="product-img">
                                                                        <img src={img4} id="expandedImg4" alt="" className="img-fluid mx-auto d-block"/>
                                                                    </div>
                                                                </TabPane>
                                                            </TabContent>
                                                            <Row className="text-center mt-2">
                                                                <Col sm={6}>
                                                                    <Button color="primary" block type="button" className="waves-effect waves-light mt-2 mr-1">
                                                                        <i className="mdi mdi-cart mr-2"></i> Add to cart
                                                                    </Button>
                                                                </Col>
                                                                <Col sm={6}>
                                                                    <Button color="light" block type="button" className="btn-block waves-effect  mt-2 waves-light">
                                                                        <i className="mdi mdi-shopping mr-2"></i>Buy now
                                                                    </Button>
                                                                </Col>
                                                            </Row>
                                                            
                                                        </Col>
                                                    </Row>
                                                </div>
                                            </Col>
                                            <Col xl={7}>
                                                <div className="mt-4 mt-xl-3">
                                                    <Link to="#" className="text-primary">T-shirt</Link>
                                                    <h5 className="mt-1 mb-3">Full sleeve Blue color t-shirt</h5>

                                                    <div className="d-inline-flex">
                                                        <div className="text-muted mr-3">
                                                            <span className="mdi mdi-star text-warning mr-1"></span>
                                                            <span className="mdi mdi-star text-warning mr-1"></span>
                                                            <span className="mdi mdi-star text-warning mr-1"></span>
                                                            <span className="mdi mdi-star text-warning mr-1"></span>
                                                            <span className="mdi mdi-star mr-1"></span>
                                                        </div>
                                                        <div className="text-muted">( 132 )</div>
                                                    </div>
                                                    
                                                    <h5 className="mt-2"><del className="text-muted mr-2">$252</del>$240 <span className="text-danger font-size-12 ml-2">25 % Off</span></h5>
                                                    <p className="mt-3">To achieve this, it would be necessary to have uniform pronunciation</p>
                                                    <hr className="my-4"/>

                                                    <Row>
                                                        <Col md={6}>
                                                            <div>
                                                                <h5 className="font-size-14"><i className="mdi mdi-location"></i> Delivery location</h5>
                                                                <div className="form-inline">
                                                                    
                                                                    <InputGroup className="mb-3">
                                                                        <Input type="text" className="form-control" placeholder="Enter Delivery pincode "/>
                                                                        <InputGroupAddon addonType="append">
                                                                          <Button color="light" type="button">Check</Button>
                                                                        </InputGroupAddon>
                                                                    </InputGroup>
                                                                </div>

                                                                <h5 className="font-size-14">Specification :</h5>
                                                                <ul className="list-unstyled product-desc-list">
                                                                    <li><i className="mdi mdi-circle-medium mr-1 align-middle"></i> Full Sleeve</li>
                                                                    <li><i className="mdi mdi-circle-medium mr-1 align-middle"></i> Cotton</li>
                                                                    <li><i className="mdi mdi-circle-medium mr-1 align-middle"></i> All Sizes available</li>
                                                                    <li><i className="mdi mdi-circle-medium mr-1 align-middle"></i> 4 Different Color</li>
                                                                </ul>
                                                                  
                                                            </div>
                                                        </Col>

                                                        <div>
                                                            <h5 className="font-size-14">Services :</h5>
                                                            <ul className="list-unstyled product-desc-list">
                                                                <li><i className="mdi mdi-sync text-primary mr-1 align-middle font-size-16"></i> 10 Days Replacement</li>
                                                                <li><i className="mdi mdi-currency-usd-circle text-primary mr-1 align-middle font-size-16"></i> Cash on Delivery available</li>
                                                            </ul>
                                                        </div>
                                                    </Row>

                                                    <Row>
                                                        <Col md={6}>
                                                            <div className="product-color mt-3">
                                                                <h5 className="font-size-14">Color :</h5>
                                                                <Link to="#" className="active">
                                                                    <div className="product-color-item">
                                                                        <img src={img1} alt="" className="avatar-md"/>
                                                                    </div>
                                                                    <p>Blue</p>
                                                                </Link>
                                                                <Link to="#" className="ml-1">
                                                                    <div className="product-color-item">
                                                                        <img src={img5} alt="" className="avatar-md"/>
                                                                    </div>
                                                                    <p>Cyan</p>
                                                                </Link>
                                                                <Link to="#" className="ml-1">
                                                                    <div className="product-color-item">
                                                                        <img src={img3} alt="" className="avatar-md"/>
                                                                    </div>
                                                                    <p>Green</p>
                                                                </Link>
                                                            </div>
                                                        </Col>

                                                        <Col md={6}>
                                                            <div className="product-color mt-3">
                                                                <h5 className="font-size-14">Size :</h5>
                                                                <Link to="#" className="active ml-1">
                                                                    <div className="product-color-item">
                                                                        <div className="avatar-xs">
                                                                            <span className="avatar-title bg-transparent text-body">S</span>
                                                                        </div>
                                                                    </div>
                                                                    
                                                                </Link>
                                                                <Link to="#" className="ml-1">
                                                                    <div className="product-color-item">
                                                                        <div className="avatar-xs">
                                                                            <span className="avatar-title bg-transparent text-body">M</span>
                                                                        </div>
                                                                    </div>
                                                                </Link>
                                                                <Link to="#" className="ml-1">
                                                                    <div className="product-color-item">
                                                                        <div className="avatar-xs">
                                                                            <span className="avatar-title bg-transparent text-body">L</span>
                                                                        </div>
                                                                    </div>
                                                                </Link>
                                                                <Link to="#" className="ml-1">
                                                                    <div className="product-color-item">
                                                                        <div className="avatar-xs">
                                                                            <span className="avatar-title bg-transparent text-body">XL</span>
                                                                        </div>
                                                                    </div>
                                                                </Link>
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                    
                                                </div>
                                            </Col>
                                        </Row>

                                        <div className="mt-4">
                                            <h5 className="font-size-14 mb-3">Product description: </h5>
                                            <div className="product-desc">
                                                <Nav tabs className="nav-tabs-custom" role="tablist">
                                                    <NavItem>
                                                      <NavLink id="desc-tab"  className={classnames({ active: this.state.activeTab2 === '1' })} onClick={() => { this.toggleTab2('1'); }} >Description</NavLink>
                                                    </NavItem>
                                                    <NavItem>
                                                      <NavLink id="specifi-tab" className={classnames({ active: this.state.activeTab2 === '2' })} onClick={() => { this.toggleTab2('2'); }}>Specifications</NavLink>
                                                    </NavItem>
                                                </Nav>
                                                <TabContent activeTab={this.state.activeTab2} className="border border-top-0 p-4">
                                                    <TabPane tabId="1" role="tabpanel">
                                                        <div>
                                                            <p>If several languages coalesce, the grammar of the resulting language is more simple and regular than that of the individual </p>
                                                            <p>To achieve this, it would be necessary to have uniform grammar, pronunciation and more common several languages coalesce, the grammar of the resulting.</p>
                                                            <p>It will be as simple as occidental in fact.</p>

                                                            <div>
                                                                <p className="mb-2"><i className="mdi mdi-circle-medium mr-1 align-middle"></i> If several languages coalesce</p>
                                                                <p className="mb-2"><i className="mdi mdi-circle-medium mr-1 align-middle"></i> To an English person, it will seem like simplified</p>
                                                                <p className="mb-0"><i className="mdi mdi-circle-medium mr-1 align-middle"></i> These cases are perfectly simple.</p>
                                                            </div>
                                                        </div>
                                                    </TabPane>
                                                    <TabPane tabId="2" id="specifi" role="tabpanel">
                                                        <div className="table-responsive">
                                                            <Table className="table-nowrap mb-0">
                                                                <tbody>
                                                                    <tr>
                                                                        <th scope="row" style={{width: "400px"}}>Category</th>
                                                                        <td>T-Shirt</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <th scope="row">Brand</th>
                                                                        <td>Jack & Jones</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <th scope="row">Color</th>
                                                                        <td>Blue</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <th scope="row">Material</th>
                                                                        <td>Cotton</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <th scope="row">Weight</th>
                                                                        <td>140 G</td>
                                                                    </tr>
                                                                </tbody>
                                                            </Table>
                                                        </div>
                                                    </TabPane>
                                                </TabContent>
                                            </div>
                                        </div>

                                        <div className="mt-4">
                                            <h5 className="font-size-14">Reviews : </h5>
                                            <div className="d-inline-flex mb-3">
                                                <div className="text-muted mr-3">
                                                    <span className="mdi mdi-star text-warning mr-1"></span>
                                                    <span className="mdi mdi-star text-warning mr-1"></span>
                                                    <span className="mdi mdi-star text-warning mr-1"></span>
                                                    <span className="mdi mdi-star text-warning mr-1"></span>
                                                    <span className="mdi mdi-star mr-1"></span>
                                                </div>
                                                <div className="text-muted">( 132  customer Review)</div>
                                            </div>
                                            <div className="border p-4 rounded">
                                                <Media className="border-bottom pb-3">
                                                    <Media body>
                                                        <p className="text-muted mb-2">To an English person, it will seem like simplified English, as a skeptical Cambridge</p>
                                                        <h5 className="font-size-15 mb-3">James</h5>

                                                        <ul className="list-inline product-review-link mb-0">
                                                            <li className="list-inline-item">
                                                                <Link to="#"><i className="mdi mdi-thumb-up align-middle mr-1"></i> Like</Link>
                                                            </li>
                                                            <li className="list-inline-item ml-1">
                                                                <Link to="#"><i className="mdi mdi-message-text align-middle mr-1"></i> Comment</Link>
                                                            </li>
                                                        </ul>
                                                    </Media>
                                                    <p className="float-sm-right font-size-12">11 Feb, 2020</p>
                                                </Media>
                                                <Media className="border-bottom py-3">
                                                    <Media body>
                                                        <p className="text-muted mb-2">Everyone realizes why a new common language would be desirable</p>
                                                        <h5 className="font-size-15 mb-3">David</h5>

                                                        <ul className="list-inline product-review-link mb-0">
                                                            <li className="list-inline-item">
                                                                <Link to="#"><i className="mdi mdi-thumb-up align-middle mr-1"></i> Like</Link>
                                                            </li>
                                                            <li className="list-inline-item ml-1">
                                                                <Link to="#"><i className="mdi mdi-message-text align-middle mr-1"></i> Comment</Link>
                                                            </li>
                                                        </ul>
                                                    </Media>
                                                    <p className="float-sm-right font-size-12">22 Jan, 2020</p>
                                                </Media>
                                                <Media className="py-3">
                                                    <Media body>
                                                        <p className="text-muted mb-2">If several languages coalesce, the grammar of the resulting </p>
                                                        <h5 className="font-size-15 mb-3">Scott</h5>

                                                        <ul className="list-inline product-review-link mb-0">
                                                            <li className="list-inline-item">
                                                                <Link to="#"><i className="mdi mdi-thumb-up align-middle mr-1"></i> Like</Link>
                                                            </li>
                                                            <li className="list-inline-item ml-1">
                                                                <Link to="#"><i className="mdi mdi-message-text align-middle mr-1"></i> Comment</Link>
                                                            </li>
                                                        </ul>
                                                    </Media>
                                                    <p className="float-sm-right font-size-12">04 Jan, 2020</p>
                                                </Media>
                                            </div>
                                        </div>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>

                        <Row>
                            <Col lg={12}>
                                <Card>
                                    <CardBody>
                                        <Row>
                                            <Col md={4}>
                                                <Media>
                                                    <div className="avatar-sm mr-3">
                                                        <span className="avatar-title bg-light rounded-circle text-primary font-size-24">
                                                            <i className="ri-checkbox-circle-line"></i>
                                                        </span>
                                                    </div>
                                                    <Media body className="align-self-center overflow-hidden">
                                                        <h5>Free Shipping</h5>
                                                        <p className="text-muted mb-0">Sed ut perspiciatis unde</p>
                                                    </Media>
                                                </Media>
                                            </Col>
                                            <Col md={4}>
                                                <Media className="mt-4 mt-md-0">
                                                    <div className="avatar-sm mr-3">
                                                        <span className="avatar-title bg-light rounded-circle text-primary font-size-24">
                                                            <i className="ri-exchange-line"></i>
                                                        </span>
                                                    </div>
                                                    <Media body className="align-self-center overflow-hidden">
                                                        <h5>Easy Return</h5>
                                                        <p className="text-muted mb-0">Neque porro quisquam est</p>
                                                    </Media>
                                                </Media>
                                            </Col>
                                            <Col md={4}>
                                                <Media className="mt-4 mt-md-0">
                                                    <div className="avatar-sm mr-3">
                                                        <span className="avatar-title bg-light rounded-circle text-primary font-size-24">
                                                            <i className="ri-money-dollar-circle-line"></i>
                                                        </span>
                                                    </div>
                                                    <Media body className="align-self-center overflow-hidden">
                                                        <h5>Cash on Delivery</h5>
                                                        <p className="text-muted mb-0">Ut enim ad minima quis</p>
                                                    </Media>
                                                </Media>
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

export default ProductDetail;