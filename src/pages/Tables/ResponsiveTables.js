import React, { Component } from "react";

import { Row, Col, Card, CardBody, Container, Table } from "reactstrap";
//Import Breadcrumb
import Breadcrumbs from '../../components/Common/Breadcrumb';


class ResponsiveTables extends Component {
    constructor(props) {
        super(props);
        this.state = {
            breadcrumbItems: [
                { title: "Tables", link: "#" },
                { title: "Responsive Table", link: "#" },
            ],
        };
    }

    render() {

        return (
            <React.Fragment>
                <div className="page-content">
                    <Container fluid>

                        <Breadcrumbs title="Responsive Table" breadcrumbItems={this.state.breadcrumbItems} />

                        <Row>
                            <Col xs={12}>
                                <Card>
                                    <CardBody>
                                        <h4 className="card-title">Example</h4>
                                        <p className="card-title-desc">This is an experimental awesome solution for responsive tables with complex data.</p>

                                        <div className="table-rep-plugin">
                                            <div className="table-responsive mb-0" data-pattern="priority-columns">
                                                <Table id="tech-companies-1" striped bordered responsive>
                                                    <thead>
                                                        <tr>
                                                            <th>Company</th>
                                                            <th data-priority="1">Last Trade</th>
                                                            <th data-priority="3">Trade Time</th>
                                                            <th data-priority="1">Change</th>
                                                            <th data-priority="3">Prev Close</th>
                                                            <th data-priority="3">Open</th>
                                                            <th data-priority="6">Bid</th>
                                                            <th data-priority="6">Ask</th>
                                                            <th data-priority="6">1y Target Est</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <th>GOOG <span className="co-name">Google Inc.</span></th>
                                                            <td>597.74</td>
                                                            <td>12:12PM</td>
                                                            <td>14.81 (2.54%)</td>
                                                            <td>582.93</td>
                                                            <td>597.95</td>
                                                            <td>597.73 x 100</td>
                                                            <td>597.91 x 300</td>
                                                            <td>731.10</td>
                                                        </tr>
                                                        <tr>
                                                            <th>AAPL <span className="co-name">Apple Inc.</span></th>
                                                            <td>378.94</td>
                                                            <td>12:22PM</td>
                                                            <td>5.74 (1.54%)</td>
                                                            <td>373.20</td>
                                                            <td>381.02</td>
                                                            <td>378.92 x 300</td>
                                                            <td>378.99 x 100</td>
                                                            <td>505.94</td>
                                                        </tr>
                                                        <tr>
                                                            <th>AMZN <span className="co-name">Amazon.com Inc.</span></th>
                                                            <td>191.55</td>
                                                            <td>12:23PM</td>
                                                            <td>3.16 (1.68%)</td>
                                                            <td>188.39</td>
                                                            <td>194.99</td>
                                                            <td>191.52 x 300</td>
                                                            <td>191.58 x 100</td>
                                                            <td>240.32</td>
                                                        </tr>
                                                        <tr>
                                                            <th>ORCL <span className="co-name">Oracle Corporation</span></th>
                                                            <td>31.15</td>
                                                            <td>12:44PM</td>
                                                            <td>1.41 (4.72%)</td>
                                                            <td>29.74</td>
                                                            <td>30.67</td>
                                                            <td>31.14 x 6500</td>
                                                            <td>31.15 x 3200</td>
                                                            <td>36.11</td>
                                                        </tr>
                                                        <tr>
                                                            <th>MSFT <span className="co-name">Microsoft Corporation</span></th>
                                                            <td>25.50</td>
                                                            <td>12:27PM</td>
                                                            <td>0.66 (2.67%)</td>
                                                            <td>24.84</td>
                                                            <td>25.37</td>
                                                            <td>25.50 x 71100</td>
                                                            <td>25.51 x 17800</td>
                                                            <td>31.50</td>
                                                        </tr>
                                                        <tr>
                                                            <th>CSCO <span className="co-name">Cisco Systems, Inc.</span></th>
                                                            <td>18.65</td>
                                                            <td>12:45PM</td>
                                                            <td>0.97 (5.49%)</td>
                                                            <td>17.68</td>
                                                            <td>18.23</td>
                                                            <td>18.65 x 10300</td>
                                                            <td>18.66 x 24000</td>
                                                            <td>21.12</td>
                                                        </tr>
                                                        <tr>
                                                            <th>YHOO <span className="co-name">Yahoo! Inc.</span></th>
                                                            <td>15.81</td>
                                                            <td>12:25PM</td>
                                                            <td>0.11 (0.67%)</td>
                                                            <td>15.70</td>
                                                            <td>15.94</td>
                                                            <td>15.79 x 6100</td>
                                                            <td>15.80 x 17000</td>
                                                            <td>18.16</td>
                                                        </tr>
                                                        <tr>
                                                            <th>GOOG <span className="co-name">Google Inc.</span></th>
                                                            <td>597.74</td>
                                                            <td>12:12PM</td>
                                                            <td>14.81 (2.54%)</td>
                                                            <td>582.93</td>
                                                            <td>597.95</td>
                                                            <td>597.73 x 100</td>
                                                            <td>597.91 x 300</td>
                                                            <td>731.10</td>
                                                        </tr>
                                                        <tr>
                                                            <th>AAPL <span className="co-name">Apple Inc.</span></th>
                                                            <td>378.94</td>
                                                            <td>12:22PM</td>
                                                            <td>5.74 (1.54%)</td>
                                                            <td>373.20</td>
                                                            <td>381.02</td>
                                                            <td>378.92 x 300</td>
                                                            <td>378.99 x 100</td>
                                                            <td>505.94</td>
                                                        </tr>
                                                        <tr>
                                                            <th>AMZN <span className="co-name">Amazon.com Inc.</span></th>
                                                            <td>191.55</td>
                                                            <td>12:23PM</td>
                                                            <td>3.16 (1.68%)</td>
                                                            <td>188.39</td>
                                                            <td>194.99</td>
                                                            <td>191.52 x 300</td>
                                                            <td>191.58 x 100</td>
                                                            <td>240.32</td>
                                                        </tr>
                                                        <tr>
                                                            <th>ORCL <span className="co-name">Oracle Corporation</span></th>
                                                            <td>31.15</td>
                                                            <td>12:44PM</td>
                                                            <td>1.41 (4.72%)</td>
                                                            <td>29.74</td>
                                                            <td>30.67</td>
                                                            <td>31.14 x 6500</td>
                                                            <td>31.15 x 3200</td>
                                                            <td>36.11</td>
                                                        </tr>
                                                        <tr>
                                                            <th>MSFT <span className="co-name">Microsoft Corporation</span></th>
                                                            <td>25.50</td>
                                                            <td>12:27PM</td>
                                                            <td>0.66 (2.67%)</td>
                                                            <td>24.84</td>
                                                            <td>25.37</td>
                                                            <td>25.50 x 71100</td>
                                                            <td>25.51 x 17800</td>
                                                            <td>31.50</td>
                                                        </tr>
                                                        <tr>
                                                            <th>CSCO <span className="co-name">Cisco Systems, Inc.</span></th>
                                                            <td>18.65</td>
                                                            <td>12:45PM</td>
                                                            <td>0.97 (5.49%)</td>
                                                            <td>17.68</td>
                                                            <td>18.23</td>
                                                            <td>18.65 x 10300</td>
                                                            <td>18.66 x 24000</td>
                                                            <td>21.12</td>
                                                        </tr>
                                                        <tr>
                                                            <th>YHOO <span className="co-name">Yahoo! Inc.</span></th>
                                                            <td>15.81</td>
                                                            <td>12:25PM</td>
                                                            <td>0.11 (0.67%)</td>
                                                            <td>15.70</td>
                                                            <td>15.94</td>
                                                            <td>15.79 x 6100</td>
                                                            <td>15.80 x 17000</td>
                                                            <td>18.16</td>
                                                        </tr>
                                                        <tr>
                                                            <th>GOOG <span className="co-name">Google Inc.</span></th>
                                                            <td>597.74</td>
                                                            <td>12:12PM</td>
                                                            <td>14.81 (2.54%)</td>
                                                            <td>582.93</td>
                                                            <td>597.95</td>
                                                            <td>597.73 x 100</td>
                                                            <td>597.91 x 300</td>
                                                            <td>731.10</td>
                                                        </tr>
                                                        <tr>
                                                            <th>AAPL <span className="co-name">Apple Inc.</span></th>
                                                            <td>378.94</td>
                                                            <td>12:22PM</td>
                                                            <td>5.74 (1.54%)</td>
                                                            <td>373.20</td>
                                                            <td>381.02</td>
                                                            <td>378.92 x 300</td>
                                                            <td>378.99 x 100</td>
                                                            <td>505.94</td>
                                                        </tr>
                                                        <tr>
                                                            <th>AMZN <span className="co-name">Amazon.com Inc.</span></th>
                                                            <td>191.55</td>
                                                            <td>12:23PM</td>
                                                            <td>3.16 (1.68%)</td>
                                                            <td>188.39</td>
                                                            <td>194.99</td>
                                                            <td>191.52 x 300</td>
                                                            <td>191.58 x 100</td>
                                                            <td>240.32</td>
                                                        </tr>
                                                        <tr>
                                                            <th>ORCL <span className="co-name">Oracle Corporation</span></th>
                                                            <td>31.15</td>
                                                            <td>12:44PM</td>
                                                            <td>1.41 (4.72%)</td>
                                                            <td>29.74</td>
                                                            <td>30.67</td>
                                                            <td>31.14 x 6500</td>
                                                            <td>31.15 x 3200</td>
                                                            <td>36.11</td>
                                                        </tr>
                                                        <tr>
                                                            <th>MSFT <span className="co-name">Microsoft Corporation</span></th>
                                                            <td>25.50</td>
                                                            <td>12:27PM</td>
                                                            <td>0.66 (2.67%)</td>
                                                            <td>24.84</td>
                                                            <td>25.37</td>
                                                            <td>25.50 x 71100</td>
                                                            <td>25.51 x 17800</td>
                                                            <td>31.50</td>
                                                        </tr>
                                                        <tr>
                                                            <th>CSCO <span className="co-name">Cisco Systems, Inc.</span></th>
                                                            <td>18.65</td>
                                                            <td>12:45PM</td>
                                                            <td>0.97 (5.49%)</td>
                                                            <td>17.68</td>
                                                            <td>18.23</td>
                                                            <td>18.65 x 10300</td>
                                                            <td>18.66 x 24000</td>
                                                            <td>21.12</td>
                                                        </tr>
                                                        <tr>
                                                            <th>YHOO <span className="co-name">Yahoo! Inc.</span></th>
                                                            <td>15.81</td>
                                                            <td>12:25PM</td>
                                                            <td>0.11 (0.67%)</td>
                                                            <td>15.70</td>
                                                            <td>15.94</td>
                                                            <td>15.79 x 6100</td>
                                                            <td>15.80 x 17000</td>
                                                            <td>18.16</td>
                                                        </tr>
                                                        <tr>
                                                            <th>GOOG <span className="co-name">Google Inc.</span></th>
                                                            <td>597.74</td>
                                                            <td>12:12PM</td>
                                                            <td>14.81 (2.54%)</td>
                                                            <td>582.93</td>
                                                            <td>597.95</td>
                                                            <td>597.73 x 100</td>
                                                            <td>597.91 x 300</td>
                                                            <td>731.10</td>
                                                        </tr>
                                                        <tr>
                                                            <th>AAPL <span className="co-name">Apple Inc.</span></th>
                                                            <td>378.94</td>
                                                            <td>12:22PM</td>
                                                            <td>5.74 (1.54%)</td>
                                                            <td>373.20</td>
                                                            <td>381.02</td>
                                                            <td>378.92 x 300</td>
                                                            <td>378.99 x 100</td>
                                                            <td>505.94</td>
                                                        </tr>
                                                        <tr>
                                                            <th>AMZN <span className="co-name">Amazon.com Inc.</span></th>
                                                            <td>191.55</td>
                                                            <td>12:23PM</td>
                                                            <td>3.16 (1.68%)</td>
                                                            <td>188.39</td>
                                                            <td>194.99</td>
                                                            <td>191.52 x 300</td>
                                                            <td>191.58 x 100</td>
                                                            <td>240.32</td>
                                                        </tr>
                                                        <tr>
                                                            <th>ORCL <span className="co-name">Oracle Corporation</span></th>
                                                            <td>31.15</td>
                                                            <td>12:44PM</td>
                                                            <td>1.41 (4.72%)</td>
                                                            <td>29.74</td>
                                                            <td>30.67</td>
                                                            <td>31.14 x 6500</td>
                                                            <td>31.15 x 3200</td>
                                                            <td>36.11</td>
                                                        </tr>
                                                        <tr>
                                                            <th>MSFT <span className="co-name">Microsoft Corporation</span></th>
                                                            <td>25.50</td>
                                                            <td>12:27PM</td>
                                                            <td>0.66 (2.67%)</td>
                                                            <td>24.84</td>
                                                            <td>25.37</td>
                                                            <td>25.50 x 71100</td>
                                                            <td>25.51 x 17800</td>
                                                            <td>31.50</td>
                                                        </tr>
                                                        <tr>
                                                            <th>CSCO <span className="co-name">Cisco Systems, Inc.</span></th>
                                                            <td>18.65</td>
                                                            <td>12:45PM</td>
                                                            <td>0.97 (5.49%)</td>
                                                            <td>17.68</td>
                                                            <td>18.23</td>
                                                            <td>18.65 x 10300</td>
                                                            <td>18.66 x 24000</td>
                                                            <td>21.12</td>
                                                        </tr>
                                                        <tr>
                                                            <th>YHOO <span className="co-name">Yahoo! Inc.</span></th>
                                                            <td>15.81</td>
                                                            <td>12:25PM</td>
                                                            <td>0.11 (0.67%)</td>
                                                            <td>15.70</td>
                                                            <td>15.94</td>
                                                            <td>15.79 x 6100</td>
                                                            <td>15.80 x 17000</td>
                                                            <td>18.16</td>
                                                        </tr>
                                                        <tr>
                                                            <th>GOOG <span className="co-name">Google Inc.</span></th>
                                                            <td>597.74</td>
                                                            <td>12:12PM</td>
                                                            <td>14.81 (2.54%)</td>
                                                            <td>582.93</td>
                                                            <td>597.95</td>
                                                            <td>597.73 x 100</td>
                                                            <td>597.91 x 300</td>
                                                            <td>731.10</td>
                                                        </tr>
                                                        <tr>
                                                            <th>AAPL <span className="co-name">Apple Inc.</span></th>
                                                            <td>378.94</td>
                                                            <td>12:22PM</td>
                                                            <td>5.74 (1.54%)</td>
                                                            <td>373.20</td>
                                                            <td>381.02</td>
                                                            <td>378.92 x 300</td>
                                                            <td>378.99 x 100</td>
                                                            <td>505.94</td>
                                                        </tr>
                                                        <tr>
                                                            <th>AMZN <span className="co-name">Amazon.com Inc.</span></th>
                                                            <td>191.55</td>
                                                            <td>12:23PM</td>
                                                            <td>3.16 (1.68%)</td>
                                                            <td>188.39</td>
                                                            <td>194.99</td>
                                                            <td>191.52 x 300</td>
                                                            <td>191.58 x 100</td>
                                                            <td>240.32</td>
                                                        </tr>
                                                        <tr>
                                                            <th>ORCL <span className="co-name">Oracle Corporation</span></th>
                                                            <td>31.15</td>
                                                            <td>12:44PM</td>
                                                            <td>1.41 (4.72%)</td>
                                                            <td>29.74</td>
                                                            <td>30.67</td>
                                                            <td>31.14 x 6500</td>
                                                            <td>31.15 x 3200</td>
                                                            <td>36.11</td>
                                                        </tr>
                                                        <tr>
                                                            <th>MSFT <span className="co-name">Microsoft Corporation</span></th>
                                                            <td>25.50</td>
                                                            <td>12:27PM</td>
                                                            <td>0.66 (2.67%)</td>
                                                            <td>24.84</td>
                                                            <td>25.37</td>
                                                            <td>25.50 x 71100</td>
                                                            <td>25.51 x 17800</td>
                                                            <td>31.50</td>
                                                        </tr>
                                                        <tr>
                                                            <th>CSCO <span className="co-name">Cisco Systems, Inc.</span></th>
                                                            <td>18.65</td>
                                                            <td>12:45PM</td>
                                                            <td>0.97 (5.49%)</td>
                                                            <td>17.68</td>
                                                            <td>18.23</td>
                                                            <td>18.65 x 10300</td>
                                                            <td>18.66 x 24000</td>
                                                            <td>21.12</td>
                                                        </tr>
                                                        <tr>
                                                            <th>YHOO <span className="co-name">Yahoo! Inc.</span></th>
                                                            <td>15.81</td>
                                                            <td>12:25PM</td>
                                                            <td>0.11 (0.67%)</td>
                                                            <td>15.70</td>
                                                            <td>15.94</td>
                                                            <td>15.79 x 6100</td>
                                                            <td>15.80 x 17000</td>
                                                            <td>18.16</td>
                                                        </tr>
                                                    </tbody>
                                                </Table>
                                            </div>
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

export default ResponsiveTables;
