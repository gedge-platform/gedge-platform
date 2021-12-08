import React, { Component } from "react";

import { Col, Row, Card, CardBody, Container, Table } from "reactstrap";

//Import Breadcrumb
import Breadcrumbs from '../../components/Common/Breadcrumb';

class UiGrid extends Component {
    constructor(props) {
        super(props);
        this.state = {
            breadcrumbItems : [
                { title : "UI Elements", link : "#" },
                { title : "Grid", link : "#" },
            ],
        };
    }

    render() {
        return (
            <React.Fragment>
                <div className="page-content">
                    <Container fluid>

                    <Breadcrumbs title="Grid" breadcrumbItems={this.state.breadcrumbItems} />

                        <Row>
                            <Col>
                                <Card>
                                    <CardBody>
                                    <h4 className="card-title">Grid options</h4>
                                        <p className="card-title-desc">See how aspects of the Bootstrap grid
                                            system work across multiple devices with a handy table.</p>

                                        <div className="table-responsive">
                                            <Table bordered className="table-nowrap mb-0">
                                                <thead>
                                                    <tr>
                                                        <th></th>
                                                        <th className="text-center">
                                                            Extra small<br />
                                                            <small>&lt;576px</small>
                                                        </th>
                                                        <th className="text-center">
                                                            Small<br />
                                                            <small>≥576px</small>
                                                        </th>
                                                        <th className="text-center">
                                                            Medium<br />
                                                            <small>≥768px</small>
                                                        </th>
                                                        <th className="text-center">
                                                            Large<br />
                                                            <small>≥992px</small>
                                                        </th>
                                                        <th className="text-center">
                                                            Extra large<br />
                                                            <small>≥1200px</small>
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <th className="text-nowrap" scope="row">Grid behavior</th>
                                                        <td>Horizontal at all times</td>
                                                        <td colSpan="4">Collapsed to start, horizontal above breakpoints</td>
                                                    </tr>
                                                    <tr>
                                                        <th className="text-nowrap" scope="row">Max container width</th>
                                                        <td>None (auto)</td>
                                                        <td>540px</td>
                                                        <td>720px</td>
                                                        <td>960px</td>
                                                        <td>1140px</td>
                                                    </tr>
                                                    <tr>
                                                        <th className="text-nowrap" scope="row">Class prefix</th>
                                                        <td><code>.col-</code></td>
                                                        <td><code>.col-sm-</code></td>
                                                        <td><code>.col-md-</code></td>
                                                        <td><code>.col-lg-</code></td>
                                                        <td><code>.col-xl-</code></td>
                                                    </tr>
                                                    <tr>
                                                        <th className="text-nowrap" scope="row"># of columns</th>
                                                        <td colSpan="5">12</td>
                                                    </tr>
                                                    <tr>
                                                        <th className="text-nowrap" scope="row">Gutter width</th>
                                                        <td colSpan="5">24px (12px on each side of a column)</td>
                                                    </tr>
                                                    <tr>
                                                        <th className="text-nowrap" scope="row">Nestable</th>
                                                        <td colSpan="5">Yes</td>
                                                    </tr>
                                                    <tr>
                                                        <th className="text-nowrap" scope="row">Offsets</th>
                                                        <td colSpan="5">Yes</td>
                                                    </tr>
                                                    <tr>
                                                        <th className="text-nowrap" scope="row">Column ordering</th>
                                                        <td colSpan="5">Yes</td>
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

export default UiGrid;
