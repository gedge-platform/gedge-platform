import React, { Component } from "react";
import { Table, Row, Col, Card, CardBody, CardTitle, CardSubtitle, Container } from "reactstrap";

import Editable from "react-bootstrap-editable";

//Import Breadcrumb
import Breadcrumbs from '../../components/Common/Breadcrumb';

class PodInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // breadcrumbItems: [
            //   { title: "Forms", link: "#" },
            //   { title: "Form Xeditable", link: "#" },
            // ],
        };
    }

    render() {
        return (
            <React.Fragment>
                <div className="page-content">
                    <Container fluid={true}>

                        {/* <Breadcrumbs title="Form Xeditable" breadcrumbItems={this.state.breadcrumbItems} /> */}

                        <Row>
                            <Col>
                                <Card>
                                    <CardBody>
                                        <CardTitle>POD INFO</CardTitle>



                                        <Table responsive className="mb-0">
                                            <thead>
                                                <tr>
                                                    <th style={{ width: "20%" }}>이름</th>
                                                    <th style={{ width: "20%" }}>노드</th>
                                                    <th style={{ width: "20%" }}>파드 IP</th>
                                                    <th style={{ width: "20%" }}>CPU</th>
                                                    <th style={{ width: "20%" }}>MEMORY</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                </tr>
                                                <tr>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                </tr>
                                                <tr>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                </tr>

                                                <tr>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                </tr>
                                                <tr>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                </tr>
                                            </tbody>
                                        </Table>
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

export default PodInfo;
