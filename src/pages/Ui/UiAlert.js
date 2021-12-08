import React, { Component } from "react";

import { Alert, Col, Row, Card, CardBody, UncontrolledAlert, Container } from "reactstrap";
import { Link } from "react-router-dom";


//Import Breadcrumb
import Breadcrumbs from '../../components/Common/Breadcrumb';

class UiAlert extends Component {
  constructor(props) {
    super(props);
    this.state = {
      breadcrumbItems : [
        { title : "UI Elements", link : "#" },
        { title : "Alerts", link : "#" },
      ],
    };
  }

  render() {
    return (
      <React.Fragment>
        <div className="page-content">
          <Container fluid>

          <Breadcrumbs title="Alerts" breadcrumbItems={this.state.breadcrumbItems} />

            <Row>
              <Col xl={6}>
                <Card>
                  <CardBody>
                    <h4 className="card-title">Default Alerts </h4>
                    <p className="card-title-desc">
                      Alerts are available for any length of text, as well as an
                      optional dismiss button. For proper styling, for Example,{" "}
                      <strong>color = </strong>{" "}
                      <code className="highlighter-rouge">"success"</code>
                    </p>

                    <div className="">
                                            <Alert color="primary" >
                                                A simple primary alert—check it out!
                                            </Alert>
                                            <Alert color="secondary" role="alert">
                                                A simple secondary alert—check it out!
                                            </Alert>
                                            <Alert color="success" role="alert">
                                                A simple success alert—check it out!
                                            </Alert>
                                            <Alert ccolor="danger" role="alert">
                                                A simple danger alert—check it out!
                                            </Alert>
                                            <Alert color="warning" role="alert">
                                                A simple warning alert—check it out!
                                            </Alert>
                                            <Alert color="info" className="mb-0" role="alert">
                                                A simple info alert—check it out!
                                            </Alert>
                    </div>
                  </CardBody>
                </Card>
              </Col>

              <Col xl={6}>
                <Card>
                  <CardBody>
                    <h4 className="card-title">Link color </h4>
                    <p className="card-title-desc">
                      Use the{" "}
                      <code className="highlighter-rouge">.alert-link</code>{" "}
                      utility className to quickly provide matching colored
                      links within any alert.
                    </p>

                    <div className="">
                                                <Alert color="primary">
                                                  A simple primary alert with <Link to="#" className="alert-link">an example link</Link>. Give it a click if you like.
                                                </Alert>
                                                <Alert color="secondary">
                                                  A simple secondary alert with <Link to="#" className="alert-link">an example link</Link>. Give it a click if you like.
                                                </Alert>
                                                <Alert colr="success">
                                                  A simple success alert with <Link to="#" className="alert-link">an example link</Link>. Give it a click if you like.
                                                </Alert>
                                                <Alert color="danger">
                                                  A simple danger alert with <Link to="#" className="alert-link">an example link</Link>. Give it a click if you like.
                                                </Alert>
                                                <Alert color="warning">
                                                  A simple warning alert with <Link to="#" className="alert-link">an example link</Link>. Give it a click if you like.
                                                </Alert>
                                                <Alert color="info" className="mb-0">
                                                  A simple info alert with <Link to="#" className="alert-link">an example link</Link>. Give it a click if you like.
                                                </Alert>
                    </div>
                  </CardBody>
                </Card>
              </Col>
            </Row>

            <Row>
              <Col xl={6}>
                <Card>
                  <CardBody>
                    <h4 className="card-title">Dismissing </h4>
                    <p className="card-title-desc">
                      You can see this in action with a live demo:
                    </p>

                    <div className="">
                                            <UncontrolledAlert color="primary" >
                                                A simple primary alert—check it out!
                                            </UncontrolledAlert>
                                            <UncontrolledAlert color="secondary" role="alert">
                                                A simple secondary alert—check it out!
                                            </UncontrolledAlert>
                                            <UncontrolledAlert color="success" role="alert">
                                                A simple success alert—check it out!
                                            </UncontrolledAlert>
                                            <UncontrolledAlert color="danger" role="alert">
                                                A simple danger alert—check it out!
                                            </UncontrolledAlert>
                                            <UncontrolledAlert color="warning" role="alert">
                                                A simple warning alert—check it out!
                                            </UncontrolledAlert>
                                            <UncontrolledAlert color="info" className="mb-0" role="alert">
                                                A simple info alert—check it out!
                                            </UncontrolledAlert>
                    </div>
                  </CardBody>
                </Card>
              </Col>

              <Col xl={6}>
                <Card>
                  <CardBody>
                    <h4 className="card-title">With Icon </h4>
                    <div className="">
                                            <UncontrolledAlert color="primary" className="alert-dismissible fade show" role="alert">
                                                <i className="mdi mdi-bullseye-arrow mr-2"></i>
                                                A simple primary alert—check it out!
                                            </UncontrolledAlert>
                                            <UncontrolledAlert color="secondary" className="alert-dismissible fade show" role="alert">
                                                <i className="mdi mdi-grease-pencil mr-2"></i>
                                                A simple secondary alert—check it out!
                                            </UncontrolledAlert>
                                            <UncontrolledAlert color="success" className="alert-dismissible fade show" role="alert">
                                                <i className="mdi mdi-check-all mr-2"></i>
                                                A simple success alert—check it out!
                                            </UncontrolledAlert>
                                            <UncontrolledAlert color="danger" className="alert-dismissible fade show" role="alert">
                                                <i className="mdi mdi-block-helper mr-2"></i>
                                                A simple danger alert—check it out!
                                            </UncontrolledAlert>
                                            <UncontrolledAlert color="warning" className="alert-dismissible fade show" role="alert">
                                                <i className="mdi mdi-alert-outline mr-2"></i>
                                                A simple warning alert—check it out!
                                            </UncontrolledAlert>
                                            <UncontrolledAlert color="info" className="alert-dismissible fade show mb-0" role="alert">
                                                <i className="mdi mdi-alert-circle-outline mr-2"></i>
                                                A simple info alert—check it out!
                                            </UncontrolledAlert>
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

export default UiAlert;
