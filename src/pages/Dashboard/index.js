import React, { Component } from "react";
import { Container, Row, Col } from "reactstrap";

//Import Breadcrumb
import Breadcrumbs from '../../components/Common/Breadcrumb';

//Import Components
import MiniWidgets from "./MiniWidgets";
import RevenueAnalytics from "./RevenueAnalytics";
import SalesAnalytics from "./SalesAnalytics";
import EarningReports from "./EarningReports";
import Sources from "./Sources";
import RecentlyActivity from "./RecentlyActivity";
import RevenueByLocations from "./RevenueByLocations";
import ChatBox from "./ChatBox";
import LatestTransactions from "./LatestTransactions";

class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            breadcrumbItems: [
                // { title : "GEdgePlatform", link : "#" },
                // { title : "Dashboard", link : "#" },
            ],
            reports: [
                { icon: "ri-stack-line", title: "Number of Sales", value: "1452", rate: "2.4%", desc: "From previous period" },
                { icon: "ri-store-2-line", title: "Sales Revenue", value: "$ 38452", rate: "2.4%", desc: "From previous period" },
                { icon: "ri-briefcase-4-line", title: "Average Price", value: "$ 15.4", rate: "2.4%", desc: "From previous period" },
            ]
        }
    }

    render() {
        return (
            <React.Fragment>
                <div className="page-content">
                    <Container fluid>
                        <Breadcrumbs title="Dashboard" breadcrumbItems={this.state.breadcrumbItems} />
                        
                        <Row>
                            <Col xl={6}>
                            <iframe src="http://192.168.150.179:16686/" width="100%" scrolling="auto" height="500" frameborder="0" />
                            </Col>

                            <Col xl={6}>
                            <iframe src="http://192.168.150.194:30835/" width="100%" scrolling="auto" height="500" frameborder="0" />

                            </Col>
                        </Row>

                        <Row>
                            <br />
                        </Row>
                        <Row>
                            <Col xl={8}>
                                <Row>
                                    <MiniWidgets reports={this.state.reports} />
                                </Row>
                                <RevenueAnalytics />
                            </Col>

                            <Col xl={4}>
                                <SalesAnalytics />
                                <EarningReports />

                            </Col>
                        </Row>
                       

                        {/* <Row>
                            <Col xl={8}>
                                <Row>
                                    <MiniWidgets reports={this.state.reports} />
                                </Row>
                                <RevenueAnalytics />
                            </Col>

                            <Col xl={4}>
                                <SalesAnalytics />
                                <EarningReports />

                            </Col>
                        </Row>


                        <Row>
                            <Sources />
                            <RecentlyActivity />
                            <RevenueByLocations />

                        </Row>


                        <Row>
                            <ChatBox />
                            <LatestTransactions />
                        </Row> */}

                    </Container>
                </div>
            </React.Fragment>
        );
    }
}

export default Dashboard;
