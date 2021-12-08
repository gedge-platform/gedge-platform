import React, { Component } from 'react';
import { Container, Row, Col } from "reactstrap";
import { Link } from "react-router-dom";

//Import images
import errorImg from "../../assets/images/error-img.png";

class Error500 extends Component {
    render() {
        return (
            <React.Fragment>
                <div className="my-5 pt-5">
                    <Container>
                        <Row>
                            <Col lg={12}>
                                <div className="text-center my-5">
                                    <h1 className="font-weight-bold text-error">5 <span className="error-text">0<img src={errorImg} alt="" className="error-img"/></span> 0</h1>
                                    <h3 className="text-uppercase">Internal Server Error</h3>
                                    <div className="mt-5 text-center">
                                        <Link to="/" className="btn btn-primary waves-effect waves-light">Back to Dashboard</Link>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </div>
            </React.Fragment>
        );
    }
}

export default Error500;