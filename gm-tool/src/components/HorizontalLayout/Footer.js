import React from "react";
import { Container, Row, Col } from "reactstrap";

const Footer = () => {
    return (
        <React.Fragment>
            <footer className="footer">
                <Container fluid>
                    <Row>
                        <Col sm={6}>
                            {new Date().getFullYear()} © GEdge Platform
                        </Col>
                        <Col sm={6}>
                            <div className="text-sm-right d-none d-sm-block">
                                COPYRIGHT 2021 INNOGRID - CLOUD STRATEGY & PLANNING DEPARTMENT
                            </div>
                        </Col>
                    </Row>
                </Container>
            </footer>
        </React.Fragment>
    );
};

export default Footer;
