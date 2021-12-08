import React, { Component } from 'react';
import { Container, Row, Col, Input, Button } from "reactstrap";
import { Link } from "react-router-dom";

//Import Countdown
import Countdown from "react-countdown";

//Import Logo
import logodark from '../../assets/images/logo-dark.png';

class CommingSoon extends Component {
    constructor() {
        super();
        this.renderer.bind(this)
    }

    renderer = ({ days, hours, minutes, seconds, completed }) => {
        if (completed) {
            // Render a completed state
            return <span>You are good to go!</span>;
        } else {
            // Render a countdown
            return <>
                <div className="coming-box">{days} <span>Days</span></div> <div className="coming-box">{hours} <span>Hours</span></div> <div className="coming-box">{minutes} <span>Minutes</span></div> <div className="coming-box">{seconds} <span>Seconds</span></div>
            </>
        }
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
                                    <div className="w-100 py-4">
                                        <Row className="justify-content-center">
                                            <Col lg={9}>
                                                <div>
                                                    <div className="text-center">
                                                        <div>
                                                            <Link to="/" className="logo"><img src={logodark} height="20" alt="logo" /></Link>
                                                        </div>

                                                        <h4 className="font-size-18 mt-4">Let's get started with GM-Tool</h4>
                                                        <p className="text-muted">It will be as simple as Occidental in fact it will be Occidental.</p>
                                                    </div>

                                                    <div className="p-2 mt-5">
                                                        <div className="counter-number">
                                                            <Countdown
                                                                date="2020/12/31"
                                                                renderer={this.renderer}
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="input-section mt-5">
                                                        <Row>
                                                            <Col>
                                                                <div className="position-relative">
                                                                    <Input type="email" className="form-control" required placeholder="Enter email address..." />
                                                                </div>
                                                            </Col>
                                                            <Col xs={{ size: "auto" }}>
                                                                <Button type="submit" color="primary" className=" w-md waves-effect waves-light">Subscribe</Button>
                                                            </Col>
                                                        </Row>
                                                    </div>
                                                </div>

                                            </Col>
                                        </Row>
                                    </div>
                                </div>
                            </Col>
                            <Col lg={8}>
                                <div className="authentication-bg comingsoon-bg">
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

export default CommingSoon;