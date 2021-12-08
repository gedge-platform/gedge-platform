import React, { Component } from 'react';
import { Container, Card, CardBody, Row, Col, Table, InputGroup, InputGroupAddon, Button, Input } from "reactstrap";
import { Link } from "react-router-dom";

//Import Breadcrumb
import Breadcrumbs from '../../components/Common/Breadcrumb';

//Import Images
import img1 from "../../assets/images/product/img-1.png";
import img2 from "../../assets/images/product/img-2.png";
import img3 from "../../assets/images/product/img-3.png";
import img4 from "../../assets/images/product/img-4.png";

class Cart extends Component {
    constructor(props) {
        super(props);
        this.state={
            breadcrumbItems : [
                { title : "Ecommerce", link : "#" },
                { title : "Cart", link : "#" },
            ],
            products : [
                //Unique Id must be required
                { id : 1, img : img1, name : "Full sleeve T-shirt", desc : "Blue", price : 240, data_attr : 2, total : 480 },
                { id : 2, img : img2, name : "Half sleeve T-shirt", desc : "Red", price : 225, data_attr : 4, total : 225 },
                { id : 3, img : img3, name : "Hoodie (Green)", desc : "Green", price : 275, data_attr : 1, total : 550 },
                { id : 4, img : img4, name : "Hoodie (Grey)", desc : "Grey", price : 275, data_attr : 2, total : 275 },
            ]
        }
        this.countUP.bind(this);
        this.countDown.bind(this);
        this.removeCartItem.bind(this);
    }

    removeCartItem = (id) => {


        let products = this.state.products;

        var filtered = products.filter(function (item) {
            return item.id !== id;
        });

        this.setState({ products: filtered });
    }

    countUP = (id, prev_data_attr) => {
        this.setState({
            products: this.state.products.map(p => (p.id === id ? { ...p, data_attr: prev_data_attr + 1 } : p))
        });
    }

    countDown = (id, prev_data_attr) => {
        this.setState({
            products: this.state.products.map(p => (p.id === id ? { ...p, data_attr: prev_data_attr - 1 } : p))
        });
    }

    render() {
        return (
            <React.Fragment>
                <div className="page-content">
                    <Container fluid>

                    <Breadcrumbs title="Cart" breadcrumbItems={this.state.breadcrumbItems} />

                        <Row>
                            <Col lg={12}>
                                <Card>
                                    <CardBody>
                                        <div className="table-responsive">
                                            <Table className="table-centered mb-0 table-nowrap">
                                                <thead className="bg-light">
                                                    <tr>
                                                        <th style={{width:"120px"}}>Product</th>
                                                        <th>Product Desc</th>
                                                        <th>Price</th>
                                                        <th>Quantity</th>
                                                        <th>Total</th>
                                                        <th className="text-center">Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        this.state.products.map((product, key) =>
                                                            <tr key={key}>
                                                                <td>
                                                                    <img src={product.img} alt="product-img"
                                                                        title="product-img" className="avatar-md" />
                                                                </td>
                                                                <td>
                                                                    <h5 className="font-size-14 text-truncate"><Link to={"/ecommerce-product-detail/" + product.id} className="text-dark">{product.name}</Link></h5>
                                                                    <p className="mb-0">Color : <span className="font-weight-medium">{product.desc}</span></p>
                                                                </td>
                                                                <td>
                                                                    $ {product.price}
                                                                </td>
                                                                <td>
                                                                    <div style={{width:"120px"}} className="product-cart-touchspin">
                                                                        <InputGroup>
                                                                            <InputGroupAddon addonType="prepend" className="input-group-btn">
                                                                                <Button color="primary" className="bootstrap-touchspin-down" onClick={() => { this.countDown(product.id, product.data_attr) }}>-</Button>
                                                                            </InputGroupAddon>
                                                                            
                                                                            <Input type="text" value={product.data_attr} readOnly/>
                                                                            <InputGroupAddon addonType="append" className="input-group-btn">
                                                                                <Button color="primary" className="bootstrap-touchspin-down" onClick={() => { this.countUP(product.id, product.data_attr) }}>+</Button>
                                                                            </InputGroupAddon>
                                                                        </InputGroup>
                                                                    </div>
                                                                </td>
                                                                <td>
                                                                    $ {product.total}
                                                                </td>
                                                                <td style={{width:"90px"}} className="text-center">
                                                                    <Link to="#" onClick={() => this.removeCartItem(product.id)} className="action-icon text-danger"> <i className="mdi mdi-trash-can font-size-18"></i></Link>
                                                                </td>
                                                            </tr>
                                                        )
                                                    }
                                                    <tr className="bg-light text-right">
                                                        
                                                        <th scope="row" colSpan="5">
                                                            Sub Total :
                                                        </th>
                                                        
                                                        <td>
                                                            $ 1530
                                                        </td>
                                                    </tr>
                                                    <tr className="bg-light text-right">
                                                        
                                                        <th scope="row" colSpan="5">
                                                            Discount :
                                                        </th>
                                                        
                                                        <td>
                                                            - $ 30
                                                        </td>
                                                    </tr>
                                                    <tr className="bg-light text-right">
                                                        
                                                        <th scope="row" colSpan="5">
                                                            Shipping Charge :
                                                        </th>
                                                        
                                                        <td>
                                                            $ 25
                                                        </td>
                                                    </tr>
                                                    <tr className="bg-light text-right">
                                                        
                                                        <th scope="row" colSpan="5">
                                                            Total :
                                                        </th>
                                                        
                                                        <td>
                                                            $ 1525
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </Table>
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

export default Cart;