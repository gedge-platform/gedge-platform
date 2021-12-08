import React, { Component } from "react";

// availity-reactstrap-validation
import { AvForm, AvField } from "availity-reactstrap-validation";
import { Link } from "react-router-dom";

import { Row, Col, Button, Container, Label, FormGroup } from "reactstrap";

// import images
import logodark from "../../assets/images/logo-dark.png";

class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    componentDidMount() {
        document.body.classList.add("auth-body-bg");
    }

    componentWillUnmount() {
        document.body.classList.remove("auth-body-bg");
    }

    render() {
        return (
            <React.Fragment>
                <div className="home-btn d-none d-sm-block">
                    <Link to="/"><i className="mdi mdi-home-variant h2 text-white"></i></Link>
                </div>
                <div>
                    <Container fluid className="p-0">
                        <Row className="no-gutters">
                            <Col lg={4}>
                                <div className="authentication-page-content p-4 d-flex align-items-center min-vh-100">
                                    <div className="w-100">
                                        <Row className="justify-content-center">
                                            <Col lg={9}>
                                                <div>
                                                    <div className="text-center">
                                                        <div>
                                                            <Link to="#" className="logo"><img src={logodark} height="50" alt="logo" /></Link>
                                                        </div>

                                                        <h4 className="font-size-18 mt-4">Register account</h4>
                                                        <p className="text-muted">Get your account now.</p>
                                                    </div>

                                                    <div className="p-2 mt-5">
                                                        <AvForm className="form-horizontal" >

                                                            <FormGroup className="auth-form-group-custom mb-4">
                                                                <i className="ri-mail-line auti-custom-input-icon"></i>
                                                                <Label htmlFor="useremail">Email</Label>
                                                                <AvField name="email" validate={{ email: true, required: true }} type="email" className="form-control" id="useremail" placeholder="Enter email" />
                                                            </FormGroup>

                                                            <FormGroup className="auth-form-group-custom mb-4">
                                                                <i className="ri-user-2-line auti-custom-input-icon"></i>
                                                                <Label htmlFor="username">Username</Label>
                                                                <AvField name="username" type="text" className="form-control" id="username" placeholder="Enter username" />
                                                            </FormGroup>

                                                            <FormGroup className="auth-form-group-custom mb-4">
                                                                <i className="ri-lock-2-line auti-custom-input-icon"></i>
                                                                <Label htmlFor="userpassword">Password</Label>
                                                                <AvField name="password" type="password" className="form-control" id="userpassword" placeholder="Enter password" />
                                                            </FormGroup>


                                                            <div className="text-center">
                                                                <Button color="primary" className="w-md waves-effect waves-light" type="submit">{this.props.loading ? "Loading ..." : "Register"}</Button>
                                                            </div>

                                                            <div className="mt-4 text-center">
                                                                <p className="mb-0">By registering you agree to the GM-Tool <Link to="#" className="text-primary">Terms of Use</Link></p>
                                                            </div>
                                                        </AvForm>
                                                    </div>

                                                    <div className="mt-5 text-center">
                                                        <p>Already have an account ? <Link to="/auth-login" className="font-weight-medium text-primary"> Login</Link> </p>
                                                        <p>© 2021 Gedge Platform</p>
                                                    </div>
                                                </div>

                                            </Col>
                                        </Row>
                                    </div>
                                </div>
                            </Col>
                            <Col lg={8}>
                                <div className="authentication-bg">
                                    <div className="bg-overlay"></div>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </div>
            </React.Fragment>
        );
    }
}

export default Register;
