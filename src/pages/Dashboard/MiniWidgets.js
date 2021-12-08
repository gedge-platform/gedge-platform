import React, { Component } from 'react';
import { Col, Card, CardBody, Media } from "reactstrap";

class MiniWidgets extends Component {
    render() {
        return (
            <React.Fragment>
                {
                    this.props.reports.map((report, key) =>
                                    <Col key={key} md={4}>
                                        <Card>
                                            <CardBody>
                                                <Media>
                                                    <Media body className="overflow-hidden">
                                                        <p className="text-truncate font-size-14 mb-2">{report.title}</p>
                                                        <h4 className="mb-0">{report.value}</h4>
                                                    </Media>
                                                    <div className="text-primary">
                                                        <i className={report.icon + " font-size-24"}></i>
                                                    </div>
                                                </Media>
                                            </CardBody>

                                            <CardBody className="border-top py-3">
                                                <div className="text-truncate">
                                                    <span className="badge badge-soft-success font-size-11 mr-1"><i className="mdi mdi-menu-up"> </i> {report.rate}</span>
                                                    <span className="text-muted ml-2">{report.desc}</span>
                                                </div>
                                            </CardBody>
                                        </Card>
                                    </Col>
                    )
                }
            </React.Fragment>
        );
    }
}

export default MiniWidgets;