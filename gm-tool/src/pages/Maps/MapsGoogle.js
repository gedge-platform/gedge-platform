import React, { Component } from "react";
import { TabContent, TabPane, Collapse, NavLink, NavItem, CardText, Nav, Card, Row, Col, CardBody, CardHeader, Container } from "reactstrap";

import { Link } from "react-router-dom";
import FormXeditable from "../../pages/Forms/FormXeditable";
//Import Breadcrumb
import Breadcrumbs from '../../components/Common/Breadcrumb';

import classnames from "classnames";
import Shops from "../Ecommerce/Shops";
import Detail from "../Ecommerce/Detail";
import LatestTransactions from "../Dashboard/LatestTransactions";
//chart
import RevenueAnalytics from "../Dashboard/RevenueAnalytics";
import Resource from "../Utility/Resource";
import EarningReports from "../Dashboard/EarningReports"
class UiTabsAccordions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      breadcrumbItems: [
        { title: "UI Elements", link: "#" },
        { title: "Tabs & Accordions", link: "#" },
      ],
      activeTab: "1",
      activeTab1: "5",
      activeTab2: "9",
      activeTab3: "13",
      customActiveTab: "1",
      activeTabJustify: "5",
      col1: true,
      col2: false,
      col3: false,
      col5: true
    };
    this.toggle = this.toggle.bind(this);
    this.toggle1 = this.toggle1.bind(this);

    this.t_col1 = this.t_col1.bind(this);
    this.t_col2 = this.t_col2.bind(this);
    this.t_col3 = this.t_col3.bind(this);
    this.t_col5 = this.t_col5.bind(this);

    this.toggle2 = this.toggle2.bind(this);
    this.toggle3 = this.toggle3.bind(this);

    this.toggleCustomJustified = this.toggleCustomJustified.bind(this);
    this.toggleCustom = this.toggleCustom.bind(this);
  }


  t_col1() {
    this.setState({ col1: !this.state.col1, col2: false, col3: false });
  }
  t_col2() {
    this.setState({ col2: !this.state.col2, col1: false, col3: false });
  }
  t_col3() {
    this.setState({ col3: !this.state.col3, col1: false, col2: false });
  }
  t_col5() {
    this.setState({ col5: !this.state.col5 });
  }

  toggle(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
  }
  toggle1(tab) {
    if (this.state.activeTab1 !== tab) {
      this.setState({
        activeTab1: tab
      });
    }
  }
  toggle2(tab) {
    if (this.state.activeTab2 !== tab) {
      this.setState({
        activeTab2: tab
      });
    }
  }
  toggle3(tab) {
    if (this.state.activeTab3 !== tab) {
      this.setState({
        activeTab3: tab
      });
    }
  }

  toggleCustomJustified(tab) {
    if (this.state.activeTabJustify !== tab) {
      this.setState({
        activeTabJustify: tab
      });
    }
  }

  toggleCustom(tab) {
    if (this.state.customActiveTab !== tab) {
      this.setState({
        customActiveTab: tab
      });
    }
  }

  render() {
    return (
      <React.Fragment>
        <div className="page-content">
          <Container fluid>
            <Breadcrumbs title="Tabs & Accordions" breadcrumbItems={this.state.breadcrumbItems} />

            <Row>
              <Col xl={12}>
                <Card>
                  <CardBody>
                    <h4 className="card-title">Justify Tabs</h4>
                    <p className="card-title-desc">
                      Use the tab JavaScript plugin—include it individually or through the compiled{" "} <code className="highlighter-rouge">bootstrap.js</code> file—to extend our navigational tabs and pills to create tabbable panes of local content, even via dropdown menus.
                    </p>
                    <Card>
                    </Card>
                    <Card>
                    <Nav pills className="navtab-bg nav-justified">
                      <NavItem>
                        <NavLink
                          style={{ cursor: "pointer" }}
                          className={classnames({
                            active: this.state.activeTab1 === "5"
                          })}
                          onClick={() => {
                            this.toggle1("5");
                          }}
                        >
                          서비스 정보
                        </NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink
                          style={{ cursor: "pointer" }}
                          className={classnames({
                            active: this.state.activeTab1 === "6"
                          })}
                          onClick={() => {
                            this.toggle1("6");
                          }}
                        >
                          메타 데이터
                        </NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink
                          style={{ cursor: "pointer" }}
                          className={classnames({
                            active: this.state.activeTab1 === "7"
                          })}
                          onClick={() => {
                            this.toggle1("7");
                          }}
                        >
                          모니터링
                        </NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink
                          style={{ cursor: "pointer" }}
                          className={classnames({
                            active: this.state.activeTab1 === "8"
                          })}
                          onClick={() => {
                            this.toggle1("8");
                          }}
                        >
                          Settings
                        </NavLink>
                      </NavItem>
                    </Nav>
</Card>
                    <TabContent activeTab={this.state.activeTab1}>
                      <TabPane tabId="5" className="p-3">
                        <Row>
                          <Col sm="12">
                            <CardText>

                              <Shops />
                            </CardText>
                          </Col>
                        </Row>
                      </TabPane>
                      <TabPane tabId="6" className="p-3">
                        <Row>
                          <Col sm="12">
                            <CardText>
                              <LatestTransactions />
                            </CardText>
                          </Col>
                        </Row>
                      </TabPane>
                      <TabPane tabId="7" className="p-3">
                        <Row>
                          <Col sm="12">
                            <CardText>
                              <RevenueAnalytics />
                            </CardText>
                          </Col>
                        </Row>
                      </TabPane>

                      <TabPane tabId="8" className="p-3">
                        <Row>
                          <Col sm="12">
                            <CardText>
                              <Row>
                                <Col lg="4">
                                  <Detail />


                                </Col>
                                <Col lg="8">
                                  <EarningReports />
                                  <Resource />

                                </Col>
                              </Row>
                              {/* <FormXeditable /> */}
                            </CardText>
                          </Col>
                        </Row>
                      </TabPane>
                    </TabContent>
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

export default UiTabsAccordions;
