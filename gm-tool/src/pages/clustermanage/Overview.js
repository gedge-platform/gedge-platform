import React, { Component } from "react";
import {
  Container,
  Card,
  CardBody,
  CardText,
  Row,
  Col,
  Nav,
  NavItem,
  NavLink,
  TabPane,
  TabContent,
  Table,
  CardTitle,
} from "reactstrap";
import { Link } from "react-router-dom";
import classnames from "classnames";
import Detail from "../Ecommerce/Detail";
import EarningReports from "../Dashboard/EarningReports";
import LineApexChart from "../Charts/Apexcharts";
class Overview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // breadcrumbItems: [
      //     { title: "Utility", link: "#" },
      //     { title: "FAQs", link: "#" },
      // ],
      activeTab: "1",
    };
    this.toggleTab = this.toggleTab.bind(this);
  }

  toggleTab(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab,
      });
    }
  }

  render() {
    return (
      <React.Fragment>
        <Row className="justify-content-center">
          <Col lg={12}>
            <div>
              <Nav pills className="pricing-nav-tabs">
                <NavItem>
                  <NavLink
                    className={classnames({
                      active: this.state.activeTab === "1",
                    })}
                    onClick={() => {
                      this.toggleTab("1");
                    }}
                  >
                    APP 리소스
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={classnames(
                      { active: this.state.activeTab === "2" },
                      "ml-1"
                    )}
                    onClick={() => {
                      this.toggleTab("2");
                    }}
                  >
                    물리 리소스
                  </NavLink>
                </NavItem>
              </Nav>
            </div>
          </Col>
        </Row>
        <div></div>
        <Row>
          <Col xl={12} sm={12}>
            <TabContent activeTab={this.state.activeTab}>
              <TabPane tabId="1">
                <Card>
                  <CardText>
                    <div className="table-responsive">
                      {/* <Table className=" table-centered mb-0 table-nowrap"> */}
                      <Table
                        hover
                        className=" mb-0 table-centered table-nowrap"
                      >
                        <thead>
                          <tr>
                            <th
                              className="border-top-0"
                              style={{ width: "110px" }}
                              scope="col"
                            >
                              서비스
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <div class="div-content-detail">
                              <div class="div-content-detail-0">
                                <div className="avatar-xs">
                                  <div className="avatar-title rounded-circle bg-light">
                                    {" "}
                                    img
                                  </div>
                                </div>
                              </div>
                              <div class="div-content-detail-1">
                                <div>
                                  <div class="div-content-text-1">
                                    <a>redis-7qgzmk-headless</a>
                                  </div>
                                  <div class="div-contetn-text-2">
                                    <a>Headless</a>
                                  </div>
                                </div>
                              </div>
                              <div class="div-content-detail-2">
                                <div>
                                  <div class="div-content-text-1">Off</div>
                                  <div class="div-content-text-2">
                                    Application Governance
                                  </div>
                                </div>
                              </div>
                              <div class="div-content-detail-2">
                                <div>
                                  <div class="div-content-text-1">None</div>
                                  <div class="div-content-text-2">
                                    ClusterIP
                                  </div>
                                </div>
                              </div>
                            </div>
                          </tr>
                        </tbody>
                      </Table>
                    </div>
                    <div className="table-responsive">
                      <Table
                        hover
                        className=" mb-0 table-centered table-nowrap"
                      >
                        <thead>
                          <tr>
                            <th
                              className="border-top-0"
                              style={{ width: "110px" }}
                              scope="col"
                            >
                              디플로이먼트
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <div class="div-content-detail">
                              <div class="div-content-detail-0">
                                <div className="avatar-xs">
                                  <div className="avatar-title rounded-circle bg-light">
                                    img
                                  </div>
                                </div>
                              </div>
                              <div class="div-content-detail-1">
                                <div>
                                  <div class="div-content-text-1">
                                    <a>redis-7qgzmk-master</a>
                                  </div>
                                  <div class="div-contetn-text-2">
                                    <a>Updated at 21 hours ago</a>
                                  </div>
                                </div>
                              </div>
                              <div class="div-content-detail-2">
                                <div>
                                  <div class="div-content-text-1">
                                    Running (1/1)
                                  </div>
                                  <div class="div-content-text-2">Status</div>
                                </div>
                              </div>
                              <div class="div-content-detail-2">
                                <div>
                                  <div class="div-content-text-1">v1.0.0</div>
                                  <div class="div-content-text-2">Version</div>
                                </div>
                              </div>
                            </div>
                          </tr>
                        </tbody>
                      </Table>
                    </div>
                  </CardText>
                </Card>
              </TabPane>
            </TabContent>
          </Col>
        </Row>

        <Row>
          <Col xl={12} sm={12}>
            <TabContent activeTab={this.state.activeTab}>
              <TabPane tabId="2">
                {/* <LineApexChart /> */}

                <EarningReports />
              </TabPane>
            </TabContent>
          </Col>
        </Row>
      </React.Fragment>
    );
  }
}

export default Overview;
