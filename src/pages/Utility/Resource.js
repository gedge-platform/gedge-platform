import React, { Component } from 'react';
import { Container, Card, CardBody, Row, Col, Nav, NavItem, NavLink, TabPane, TabContent, Button } from "reactstrap";
import classnames from 'classnames';

//Import Components
import Accordian from "./accordian";

//Import Breadcrumb
import Breadcrumbs from '../../components/Common/Breadcrumb';
import Detail from "../Ecommerce/Detail";
import Sources from '../Dashboard/Sources';
import EarningReports from "../Dashboard/EarningReports"
class Resource extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // breadcrumbItems: [
            //     { title: "Utility", link: "#" },
            //     { title: "FAQs", link: "#" },
            // ],
            activeTab: '1',
        }
        this.toggleTab = this.toggleTab.bind(this);
    }

    toggleTab(tab) {
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab
            });
        }
    }

    render() {
        return (
            <React.Fragment>
                {/* <div className="page-content">
                    <Container fluid> */}

                {/* <Breadcrumbs title="FAQs" breadcrumbItems={this.state.breadcrumbItems} /> */}
                <Row>
                    <Card>
                        <CardBody>
                            <Row>
                                {/* <Col lg="7"> */}
                                <div>
                                    <Nav pills className="pricing-nav-tabs">
                                        <NavItem>
                                            <NavLink className={classnames({ active: this.state.activeTab === '1' })} onClick={() => { this.toggleTab('1'); }}>
                                                앱 리소스
                                            </NavLink>
                                        </NavItem>
                                        <NavItem>
                                            <NavLink className={classnames({ active: this.state.activeTab === '2' })} onClick={() => { this.toggleTab('2'); }}>
                                                물리 리소스
                                            </NavLink>
                                        </NavItem>

                                        {/* <NavItem>
                                                            <NavLink className={classnames({ active: this.state.activeTab === '3' })} onClick={() => { this.toggleTab('3'); }}>
                                                                Pricing & Plans
                                                            </NavLink>
                                                        </NavItem> */}
                                    </Nav>

                                    <TabContent activeTab={this.state.activeTab} className="pt-5">
                                        <TabPane tabId="1">

                                            <div className="custom-accordion-arrow">

                                                <EarningReports />

                                            </div>


                                        </TabPane>
                                        <TabPane tabId="2">
                                            <div>
                                                {/* <div className="text-center mb-5">
                                                            <h5>Privacy Policy</h5>
                                                            <p>Neque porro quisquam est, qui dolorem ipsum quia</p>
                                                        </div> */}

                                                <div id="privacy-accordion" className="custom-accordion-arrow">
                                                    {/* accoridan */}
                                                    <Accordian
                                                        question1="Why do we use it ?"
                                                        answer1="If several languages coalesce, the grammar of the resulting language is more simple and regular than that of the individual languages. The new common language will be more simple and regular than the existing European languages."

                                                        question2="What is Lorem Ipsum ?"
                                                        answer2="It will be as simple as Occidental; in fact, it will be Occidental. To an English person, it will seem like simplified English, as a skeptical Cambridge friend of mine told me what Occidental."

                                                        question3="Where can I get some ?"
                                                        answer3="Everyone realizes why a new common language would be desirable: one could refuse to pay expensive translators. To achieve this, it would be necessary to have uniform grammar, pronunciation and more common words."

                                                        question4="Where does it come from ?"
                                                        answer4="To an English person, it will seem like simplified English, as a skeptical Cambridge friend of mine told me what Occidental is. The European languages are members of the same family. Their separate existence is a myth."

                                                        question5="Where can I get some ?"
                                                        answer5="To an English person, it will seem like simplified English, as a skeptical Cambridge friend of mine told me what Occidental is. The European languages are members of the same family. Their separate existence is a myth."
                                                    />

                                                </div>
                                            </div>
                                        </TabPane>


                                    </TabContent>
                                </div>
                                {/* </Col> */}
                            </Row>
                        </CardBody>
                    </Card>

                </Row>
                {/* </Container>
                </div> */}
            </React.Fragment>
        );
    }
}

export default Resource;