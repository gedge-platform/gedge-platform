import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { Row, Col, Breadcrumb, BreadcrumbItem } from "reactstrap";

//i18n
import { withNamespaces } from "react-i18next";

class Breadcrumbs extends Component {
    render() {

        const itemsLength = this.props.breadcrumbItems.length;

        return (
            <React.Fragment>
                        <Row>
                            <Col xs={12}>
                                <div className="page-title-box d-flex align-items-center justify-content-between">
                                    <h4 className="mb-0">{this.props.t(this.props.title)}</h4>

                                    <div className="page-title-right">
                                        <Breadcrumb listClassName="m-0">
                                            {
                                                this.props.breadcrumbItems.map((item, key) =>
                                                    key+1 === itemsLength ?
                                                        <BreadcrumbItem key={key} active>{this.props.t(item.title)}</BreadcrumbItem>
                                                    :   <BreadcrumbItem key={key} ><Link to={item.link}>{this.props.t(item.title)}</Link></BreadcrumbItem>
                                                )
                                            }
                                        </Breadcrumb>
                                    </div>

                                </div>
                            </Col>
                        </Row>
            </React.Fragment>
        );
    }
}

export default withNamespaces()(Breadcrumbs);