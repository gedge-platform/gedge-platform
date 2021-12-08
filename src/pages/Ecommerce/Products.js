import React, { Component } from 'react';
import { Container, Card, CardBody, Row, Col, Collapse, CardHeader, Input, Label, Pagination, PaginationItem, PaginationLink, Breadcrumb, BreadcrumbItem } from "reactstrap";
import { Link } from "react-router-dom";

// RangeSlider
import Nouislider from "nouislider-react";
import "nouislider/distribute/nouislider.css";

//Import Breadcrumb
import Breadcrumbs from '../../components/Common/Breadcrumb';
import Detail from '../Ecommerce/Detail';
// import ResponsiveTables from '../Tables/ResponsiveTables';
//Import Product Images
import product1 from "../../assets/images/product/img-1.png";
import product2 from "../../assets/images/product/img-2.png";
import product3 from "../../assets/images/product/img-3.png";
import product4 from "../../assets/images/product/img-4.png";
import product5 from "../../assets/images/product/img-5.png";
import product6 from "../../assets/images/product/img-6.png";

class Products extends Component {
    constructor(props) {
        super(props);
        this.state = {
            breadcrumbItems: [
                { title: "Ecommerce", link: "#" },
                { title: "Products", link: "#" },
            ],
            electronic: false,
            fashion: true,
            baby: false,
            fitness: false,
            discount: true,
            size: true,
            rating: false,
        }
    }

    render() {
        return (
            <React.Fragment>

                <div className="page-content">
                    <Container fluid>
                        <Breadcrumbs title="Products" breadcrumbItems={this.state.breadcrumbItems} />

                        <Detail />

                        <Row>

                            <Col xl={3} lg={4}>
                                <Card>
                                    <CardHeader className="bg-transparent border-bottom">
                                        <h5 className="mb-0">Filters</h5>
                                    </CardHeader>

                                    <CardBody>
                                        <h5 className="font-size-14 mb-3">Categories</h5>

                                        <div id="accordion" className="custom-accordion categories-accordion mb-3">
                                            <div className="categories-group-card">
                                                <Link to="#" onClick={() => this.setState({ electronic: !this.state.electronic, fashion: false, baby: false, fitness: false })} className={this.state.electronic ? "categories-group-list accordian-bg-products" : "categories-group-list"}>
                                                    <i className="mdi mdi-desktop-classic font-size-16 align-middle mr-2"></i> Electronic
                                                    <i className={this.state.electronic === true ? "mdi mdi-minus float-right accor-minus-icon" : "mdi mdi-plus float-right accor-plus-icon"}></i>
                                                </Link>

                                                <Collapse isOpen={this.state.electronic} id="collapseOne">
                                                    <div>
                                                        <ul className="list-unstyled categories-list mb-0">
                                                            <li><Link to="#"><i className="mdi mdi-circle-medium mr-1"></i> Mobile</Link></li>
                                                            <li><Link to="#"><i className="mdi mdi-circle-medium mr-1"></i> Mobile accessories</Link></li>
                                                            <li><Link to="#"><i className="mdi mdi-circle-medium mr-1"></i> Computers</Link></li>
                                                            <li><Link to="#"><i className="mdi mdi-circle-medium mr-1"></i> Laptops</Link></li>
                                                            <li><Link to="#"><i className="mdi mdi-circle-medium mr-1"></i> Speakers</Link></li>
                                                        </ul>
                                                    </div>
                                                </Collapse>
                                            </div>

                                            <div className="categories-group-card">
                                                <Link to="#" className={this.state.fashion ? "categories-group-list accordian-bg-products" : "categories-group-list"} onClick={() => this.setState({ fashion: !this.state.fashion, electronic: false, baby: false, fitness: false })}>
                                                    <i className="mdi mdi-hanger font-size-16 align-middle mr-2"></i> Fashion
                                                    <i className={this.state.fashion === true ? "mdi mdi-minus float-right accor-minus-icon" : "mdi mdi-plus float-right accor-plus-icon"}></i>
                                                </Link>
                                                <Collapse isOpen={this.state.fashion} id="collapseTwo">
                                                    <div>
                                                        <ul className="list-unstyled categories-list mb-0">
                                                            <li className="active"><Link to="#"><i className="mdi mdi-circle-medium mr-1"></i> Clothing</Link></li>
                                                            <li><Link to="#"><i className="mdi mdi-circle-medium mr-1"></i> Footwear</Link></li>
                                                            <li><Link to="#"><i className="mdi mdi-circle-medium mr-1"></i> Watches</Link></li>
                                                            <li><Link to="#"><i className="mdi mdi-circle-medium mr-1"></i> Sportswear</Link></li>
                                                        </ul>
                                                    </div>
                                                </Collapse>
                                            </div>

                                            <div className="categories-group-card">
                                                <Link to="#" onClick={() => this.setState({ baby: !this.state.baby, fashion: false, electronic: false, fitness: false })} className={this.state.baby ? "categories-group-list accordian-bg-products" : "categories-group-list"} >
                                                    <i className="mdi mdi-pinwheel-outline font-size-16 align-middle mr-2"></i> Baby & Kids
                                                    <i className={this.state.baby === true ? "mdi mdi-minus float-right accor-minus-icon" : "mdi mdi-plus float-right accor-plus-icon"}></i>
                                                </Link>
                                                <Collapse isOpen={this.state.baby} id="collapseThree">
                                                    <div>
                                                        <ul className="list-unstyled categories-list mb-0">
                                                            <li><Link to="#"><i className="mdi mdi-circle-medium mr-1"></i> Clothing</Link></li>
                                                            <li><Link to="#"><i className="mdi mdi-circle-medium mr-1"></i> Footwear</Link></li>
                                                            <li><Link to="#"><i className="mdi mdi-circle-medium mr-1"></i> Toys</Link></li>
                                                            <li><Link to="#"><i className="mdi mdi-circle-medium mr-1"></i> Baby care</Link></li>
                                                        </ul>
                                                    </div>
                                                </Collapse>
                                            </div>

                                            <div className="categories-group-card">
                                                <Link to="#" onClick={() => this.setState({ fitness: !this.state.fitness, fashion: false, baby: false, electronic: false })} className={this.state.fitness ? "categories-group-list accordian-bg-products" : "categories-group-list"}>
                                                    <i className="mdi mdi-dumbbell font-size-16 align-middle mr-2"></i> Fitness
                                                    <i className={this.state.fitness === true ? "mdi mdi-minus float-right accor-minus-icon" : "mdi mdi-plus float-right accor-plus-icon"}></i>
                                                </Link>
                                                <Collapse isOpen={this.state.fitness} id="collapseFour">
                                                    <div>
                                                        <ul className="list-unstyled categories-list mb-0">
                                                            <li><Link to="#"><i className="mdi mdi-circle-medium mr-1"></i> Gym equipment</Link></li>
                                                            <li><Link to="#"><i className="mdi mdi-circle-medium mr-1"></i> Yoga mat</Link></li>
                                                            <li><Link to="#"><i className="mdi mdi-circle-medium mr-1"></i> Dumbbells</Link></li>
                                                            <li><Link to="#"><i className="mdi mdi-circle-medium mr-1"></i> Protein supplements</Link></li>
                                                        </ul>
                                                    </div>
                                                </Collapse>
                                            </div>
                                        </div>
                                    </CardBody>

                                    <CardBody className="border-top">
                                        <div>
                                            <h5 className="font-size-14 mb-4">Price</h5>
                                            <br />
                                            <Nouislider range={{ min: 0, max: 600 }} tooltips={true} start={[100, 500]} connect />
                                        </div>
                                    </CardBody>

                                    <div className="custom-accordion">
                                        <CardBody className="border-top">
                                            <div>
                                                <h5 className="font-size-14 mb-0"><Link to="#" className="text-dark d-block" onClick={() => this.setState({ discount: !this.state.discount })} >Discount <i className={this.state.discount === true ? "mdi mdi-minus float-right accor-minus-icon" : "mdi mdi-plus float-right accor-plus-icon"}></i></Link></h5>

                                                <Collapse isOpen={this.state.discount} id="collapseExample1">

                                                    <div className="mt-4">
                                                        <div className="custom-control custom-radio mt-2">
                                                            <Input type="radio" id="productdiscountRadio6" name="productdiscountRadio1" className="custom-control-input" />
                                                            <Label className="custom-control-label" htmlFor="productdiscountRadio6">50% or more</Label>
                                                        </div>
                                                        <div className="custom-control custom-radio mt-2">
                                                            <Input type="radio" id="productdiscountRadio5" name="productdiscountRadio1" className="custom-control-input" />
                                                            <Label className="custom-control-label" htmlFor="productdiscountRadio5">40% or more</Label>
                                                        </div>
                                                        <div className="custom-control custom-radio mt-2">
                                                            <Input type="radio" id="productdiscountRadio4" name="productdiscountRadio1" className="custom-control-input" />
                                                            <Label className="custom-control-label" htmlFor="productdiscountRadio4">30% or more</Label>
                                                        </div>
                                                        <div className="custom-control custom-radio mt-2">
                                                            <Input type="radio" id="productdiscountRadio3" name="productdiscountRadio1" className="custom-control-input" />
                                                            <Label className="custom-control-label" htmlFor="productdiscountRadio3">20% or more</Label>
                                                        </div>
                                                        <div className="custom-control custom-radio mt-2">
                                                            <Input type="radio" id="productdiscountRadio2" name="productdiscountRadio1" className="custom-control-input" />
                                                            <Label className="custom-control-label" htmlFor="productdiscountRadio2">10% or more</Label>
                                                        </div>
                                                        <div className="custom-control custom-radio mt-2">
                                                            <Input type="radio" id="productdiscountRadio1" name="productdiscountRadio1" className="custom-control-input" />
                                                            <Label className="custom-control-label" htmlFor="productdiscountRadio1">Less than 10%</Label>
                                                        </div>
                                                    </div>

                                                </Collapse>
                                            </div>
                                        </CardBody>

                                        <CardBody className="border-top">
                                            <div>
                                                <h5 className="font-size-14 mb-0"><Link to="#" className="text-dark d-block" onClick={() => this.setState({ size: !this.state.size })}>Size <i className={this.state.size === true ? "mdi mdi-minus float-right accor-minus-icon" : "mdi mdi-plus float-right accor-plus-icon"}></i></Link></h5>

                                                <Collapse isOpen={this.state.size} id="collapseExample2">

                                                    <div className="mt-4">
                                                        <div className="custom-control custom-radio mt-2">
                                                            <Input type="radio" id="productsizeRadio1" name="productsizeRadio" className="custom-control-input" />
                                                            <Label className="custom-control-label" htmlFor="productsizeRadio1">X-Large</Label>
                                                        </div>
                                                        <div className="custom-control custom-radio mt-2">
                                                            <Input type="radio" id="productsizeRadio2" name="productsizeRadio" className="custom-control-input" />
                                                            <Label className="custom-control-label" htmlFor="productsizeRadio2">Large</Label>
                                                        </div>
                                                        <div className="custom-control custom-radio mt-2">
                                                            <Input type="radio" id="productsizeRadio3" name="productsizeRadio" className="custom-control-input" />
                                                            <Label className="custom-control-label" htmlFor="productsizeRadio3">Medium</Label>
                                                        </div>
                                                        <div className="custom-control custom-radio mt-2">
                                                            <Input type="radio" id="productsizeRadio4" name="productsizeRadio" className="custom-control-input" />
                                                            <Label className="custom-control-label" htmlFor="productsizeRadio4">Small</Label>
                                                        </div>
                                                    </div>

                                                </Collapse>
                                            </div>
                                        </CardBody>
                                        <CardBody className="border-top">
                                            <div>
                                                <h5 className="font-size-14 mb-0"><Link to="#" className="collapsed text-dark d-block" onClick={() => this.setState({ rating: !this.state.rating })}>Customer Rating <i className={this.state.rating === true ? "mdi mdi-minus float-right accor-minus-icon" : "mdi mdi-plus float-right accor-plus-icon"}></i></Link></h5>

                                                <Collapse isOpen={this.state.rating} id="collapseExample3">

                                                    <div className="mt-4">
                                                        <div className="custom-control custom-radio mt-2">
                                                            <Input type="radio" id="productratingRadio1" name="productratingRadio1" className="custom-control-input" />
                                                            <Label className="custom-control-label" htmlFor="productratingRadio1">4 <i className="mdi mdi-star text-warning"></i>  & Above</Label>
                                                        </div>
                                                        <div className="custom-control custom-radio mt-2">
                                                            <Input type="radio" id="productratingRadio2" name="productratingRadio1" className="custom-control-input" />
                                                            <Label className="custom-control-label" htmlFor="productratingRadio2">3 <i className="mdi mdi-star text-warning"></i>  & Above</Label>
                                                        </div>
                                                        <div className="custom-control custom-radio mt-2">
                                                            <Input type="radio" id="productratingRadio3" name="productratingRadio1" className="custom-control-input" />
                                                            <Label className="custom-control-label" htmlFor="productratingRadio3">2 <i className="mdi mdi-star text-warning"></i>  & Above</Label>
                                                        </div>
                                                        <div className="custom-control custom-radio mt-2">
                                                            <Input type="radio" id="productratingRadio4" name="productratingRadio1" className="custom-control-input" />
                                                            <Label className="custom-control-label" htmlFor="productratingRadio4">1 <i className="mdi mdi-star text-warning"></i></Label>
                                                        </div>
                                                    </div>

                                                </Collapse>
                                            </div>
                                        </CardBody>
                                    </div>
                                </Card>
                            </Col>
                            <Col lg={9}>
                                <Card>
                                    <CardBody>
                                        <div>
                                            <Row>
                                                <Col md={6}>
                                                    <div>
                                                        <h5>Clothes & Accessories</h5>
                                                        <Breadcrumb listClassName="p-0 bg-transparent mb-2">
                                                            <BreadcrumbItem ><Link to="#">Fashion</Link></BreadcrumbItem>
                                                            <BreadcrumbItem ><Link to="#">Clothing</Link></BreadcrumbItem >
                                                            <BreadcrumbItem active>T-shirts</BreadcrumbItem >
                                                        </Breadcrumb>
                                                    </div>
                                                </Col>

                                                <Col md={6}>
                                                    <div className="form-inline float-md-right">
                                                        <div className="search-box ml-2">
                                                            <div className="position-relative">
                                                                <Input type="text" className="form-control rounded" placeholder="Search..." />
                                                                <i className="mdi mdi-magnify search-icon"></i>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Col>

                                            </Row>

                                            <ul className="list-inline my-3 ecommerce-sortby-list">
                                                <li className="list-inline-item"><span className="font-weight-medium font-family-secondary">Sort by:</span></li>
                                                <li className="list-inline-item active ml-1"><Link to="#">Popularity</Link></li>
                                                <li className="list-inline-item ml-1"><Link to="#">Newest</Link></li>
                                                <li className="list-inline-item ml-1"><Link to="#">Discount</Link></li>
                                            </ul>

                                            <Row className="no-gutters">
                                                <Col xl={4} sm={6}>
                                                    <div className="product-box">
                                                        <div className="product-img">
                                                            <div className="product-ribbon badge badge-warning">
                                                                Trending
                                                            </div>
                                                            <div className="product-like">
                                                                <Link to="#">
                                                                    <i className="mdi mdi-heart-outline"></i>
                                                                </Link>
                                                            </div>
                                                            <img src={product1} alt="" className="img-fluid mx-auto d-block" />
                                                        </div>

                                                        <div className="text-center">
                                                            <p className="font-size-12 mb-1">Blue color, T-shirt</p>
                                                            <h5 className="font-size-15"><Link to="#" className="text-dark">Full sleeve T-shirt</Link></h5>

                                                            <h5 className="mt-3 mb-0">$240</h5>
                                                        </div>
                                                    </div>
                                                </Col>


                                                <Col xl={4} sm={6}>
                                                    <div className="product-box">
                                                        <div className="product-img">
                                                            <div className="product-ribbon badge badge-primary">
                                                                - 25 %
                                                            </div>
                                                            <div className="product-like">
                                                                <Link to="#">
                                                                    <i className="mdi mdi-heart-outline"></i>
                                                                </Link>
                                                            </div>
                                                            <img src={product2} alt="" className="img-fluid mx-auto d-block" />
                                                        </div>

                                                        <div className="text-center">
                                                            <p className="font-size-12 mb-1">Half sleeve, T-shirt</p>
                                                            <h5 className="font-size-15"><Link to="#" className="text-dark">Half sleeve T-shirt </Link></h5>

                                                            <h5 className="mt-3 mb-0"><span className="text-muted mr-2"><del>$240</del></span>$225</h5>
                                                        </div>
                                                    </div>
                                                </Col>
                                                <Col xl={4} sm={6}>
                                                    <div className="product-box">
                                                        <div className="product-img">
                                                            <div className="product-like">
                                                                <Link to="#">
                                                                    <i className="mdi mdi-heart text-danger"></i>
                                                                </Link>
                                                            </div>
                                                            <img src={product3} alt="" className="img-fluid mx-auto d-block" />
                                                        </div>

                                                        <div className="text-center">
                                                            <p className="font-size-12 mb-1">Green color, Hoodie</p>
                                                            <h5 className="font-size-15"><Link to="#" className="text-dark">Hoodie (Green)</Link></h5>

                                                            <h5 className="mt-3 mb-0"><span className="text-muted mr-2"><del>$290</del></span>$275</h5>
                                                        </div>
                                                    </div>
                                                </Col>
                                                <Col xl={4} sm={6}>
                                                    <div className="product-box">
                                                        <div className="product-img">
                                                            <div className="product-like">
                                                                <Link to="#">
                                                                    <i className="mdi mdi-heart-outline"></i>
                                                                </Link>
                                                            </div>
                                                            <img src={product4} alt="" className="img-fluid mx-auto d-block" />
                                                        </div>

                                                        <div className="text-center">
                                                            <p className="font-size-12 mb-1">Gray color, Hoodie</p>
                                                            <h5 className="font-size-15"><Link to="#" className="text-dark">Hoodie (Green)</Link></h5>

                                                            <h5 className="mt-3 mb-0"><span className="text-muted mr-2"><del>$290</del></span>$275</h5>
                                                        </div>
                                                    </div>
                                                </Col>

                                                <Col xl={4} sm={6}>
                                                    <div className="product-box">
                                                        <div className="product-img">
                                                            <div className="product-like">
                                                                <Link to="#">
                                                                    <i className="mdi mdi-heart text-danger"></i>
                                                                </Link>
                                                            </div>
                                                            <img src={product5} alt="" className="img-fluid mx-auto d-block" />
                                                        </div>

                                                        <div className="text-center">
                                                            <p className="font-size-12 mb-1">Blue color, T-shirt</p>
                                                            <h5 className="font-size-15"><Link to="#" className="text-dark">Full sleeve T-shirt</Link></h5>

                                                            <h5 className="mt-3 mb-0">$242</h5>
                                                        </div>
                                                    </div>
                                                </Col>
                                                <Col xl={4} sm={6}>
                                                    <div className="product-box">
                                                        <div className="product-img">
                                                            <div className="product-ribbon badge badge-primary">
                                                                - 22 %
                                                            </div>
                                                            <div className="product-like">
                                                                <Link to="#">
                                                                    <i className="mdi mdi-heart-outline"></i>
                                                                </Link>
                                                            </div>
                                                            <img src={product6} alt="" className="img-fluid mx-auto d-block" />

                                                        </div>

                                                        <div className="text-center">
                                                            <p className="font-size-12 mb-1">Black color, T-shirt</p>
                                                            <h5 className="font-size-15"><Link to="#" className="text-dark">Half sleeve T-shirt </Link></h5>

                                                            <h5 className="mt-3 mb-0"><span className="text-muted mr-2"><del>$240</del></span>$225</h5>
                                                        </div>
                                                    </div>
                                                </Col>
                                            </Row>

                                            <Row className="mt-4">
                                                <Col sm={6}>
                                                    <div>
                                                        <p className="mb-sm-0 mt-2">Page <span className="font-weight-bold">2</span> Of <span className="font-weight-bold">113</span></p>
                                                    </div>
                                                </Col>
                                                <Col sm={6}>
                                                    <div className="float-sm-right">
                                                        <Pagination className="pagination-rounded mb-sm-0">
                                                            <PaginationItem disabled>
                                                                <PaginationLink href="#" ><i className="mdi mdi-chevron-left"></i></PaginationLink>
                                                            </PaginationItem>
                                                            <PaginationItem>
                                                                <PaginationLink href="#" >1</PaginationLink>
                                                            </PaginationItem>
                                                            <PaginationItem active>
                                                                <PaginationLink href="#" >2</PaginationLink>
                                                            </PaginationItem>
                                                            <PaginationItem>
                                                                <PaginationLink href="#" >3</PaginationLink>
                                                            </PaginationItem>
                                                            <PaginationItem>
                                                                <PaginationLink hrefo="#" >4</PaginationLink>
                                                            </PaginationItem>
                                                            <PaginationItem>
                                                                <PaginationLink href="#" >5</PaginationLink>
                                                            </PaginationItem>
                                                            <PaginationItem>
                                                                <PaginationLink href="#" ><i className="mdi mdi-chevron-right"></i></PaginationLink>
                                                            </PaginationItem>
                                                        </Pagination>
                                                    </div>
                                                </Col>
                                            </Row>
                                        </div>
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

export default Products;