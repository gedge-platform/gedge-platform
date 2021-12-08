import React, { Component } from "react";
import { Row, Col, Card, CardBody, Progress, Container } from "reactstrap";

//Import Breadcrumb
import Breadcrumbs from '../../components/Common/Breadcrumb';

class UiProgressbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      breadcrumbItems : [
        { title : "UI Elements", link : "#" },
        { title : "Progress Bars", link : "#" },
    ],
    };
  }

  render() {
    return (
      <React.Fragment>
        <div className="page-content">
          <Container fluid>

          <Breadcrumbs title="Progress Bars" breadcrumbItems={this.state.breadcrumbItems} />


            <Row>
              <Col xl={6}>
                <Card>
                  <CardBody>
                    <h4 className="card-title">Default Examples</h4>
                    <p className="card-title-desc">
                      Progress components are built with two HTML elements, some CSS to set the width, and a few attributes.
                    </p>

                    <div>
                      
                        <Progress className="mb-4" color="primary" value={25}></Progress>
                        <Progress className="mb-4" color="primary" value={50}></Progress>
                        <Progress className="mb-4" color="primary" value={75}></Progress>
                        <Progress color="primary" value={100}></Progress>
                    </div>
                  </CardBody>
                </Card>
              </Col>

              <Col xl={6}>
                <Card>
                  <CardBody>
                    <h4 className="card-title">Backgrounds</h4>
                    <p className="card-title-desc">
                      Use background utility classes to change the
                      appearance of individual progress bars.
                    </p>

                    <div>
                        <Progress className="mb-4" color="success" value={25}></Progress>
                        <Progress className="mb-4" color="info" value={50}></Progress>
                        <Progress className="mb-4" color="warning" value={75}></Progress>
                        <Progress color="danger" value={100}></Progress>
                    </div>
                  </CardBody>
                </Card>
              </Col>
            </Row>

            <Row>
              <Col xl={6}>
                <Card>
                  <CardBody>
                    <h4 className="card-title">Labels Example</h4>
                    <p className="card-title-desc">
                      Add labels to your progress bars by placing text within the{" "}
                      <code className="highlighter-rouge">.progress-bar</code>.
                    </p>

                    <div className="">
                      <Progress color="primary" value={25} >
                        25%
                        </Progress>
                    </div>
                  </CardBody>
                </Card>
              </Col>

              <Col xl={6}>
                <Card>
                  <CardBody>
                    <h4 className="card-title">Multiple bars</h4>
                    <p className="card-title-desc">
                      Include multiple progress bars in a progress component if you need.
                    </p>

                    <div className="">
                      <Progress multi>
                        <Progress bar color="primary" value={15}></Progress>
                        <Progress bar color="success" value={30}></Progress>
                        <Progress bar color="info" value={20}></Progress>
                      </Progress>
                    </div>
                  </CardBody>
                </Card>
              </Col>
            </Row>

            <Row>
              <Col xl={6}>
                <Card>
                  <CardBody>
                    <h4 className="card-title">Height</h4>
                    <p className="card-title-desc">
                      We only set a{" "} <code className="highlighter-rouge">height</code> value on the{" "}
                      <code className="highlighter-rouge">.progress-bar</code>, so if you change that value the outer{" "}
                      <code className="highlighter-rouge">.progress</code> will automatically resize accordingly.
                    </p>

                    <div className="">
                      <Progress
                        className="mb-3"
                        value={25}
                        color="primary"
                        style={{ height: "3px" }}
                      ></Progress>
                      <Progress
                        value={25}
                        color="primary"
                        style={{ height: "24px" }}
                      ></Progress>

                    </div>
                  </CardBody>
                </Card>
              </Col>

              <Col xl={6}>
                <Card>
                  <CardBody>
                    <h4 className="card-title">Animated stripes</h4>
                    <p className="card-title-desc">
                      The striped gradient can also be animated. Add{" "} <code className="highlighter-rouge"> striped{" "} animated </code>{" "} to{" "} to animate the stripes right to left via CSS3 animations.
                    </p>

                    <div className="">
                      <Progress striped animated color="primary" value="80" />
                    </div>
                  </CardBody>
                </Card>
              </Col>
            </Row>

            <Row>
              <Col xl={6}>
                <Card>
                  <CardBody>
                    <h4 className="card-title">Striped</h4>
                    <p className="card-title-desc">
                      Add{" "} <code className="highlighter-rouge"> striped{" "} </code> to any{" "} to apply a stripe via CSS gradient over the progress bar’s background color.
                    </p>

                    <div className="">
                        <Progress className="mb-4" striped color="primary" value={10}></Progress>
                        <Progress className="mb-4" striped color="success" value={25}></Progress>
                        <Progress className="mb-4" striped color="info" value={50}></Progress>
                        <Progress className="mb-4" striped color="warning" value={75}></Progress>
                        <Progress striped color="danger" value={100}></Progress>
                    </div>
                  </CardBody>
                </Card>
              </Col>

              <Col xl={6}>
                <Card>
                  <CardBody>
                    <h4 className="card-title">Animated progress</h4>
                    <p className="card-title-desc mb-5">Add <code className="highlighter-rounge">.animated-progess</code> class with <code className="highlighter-rounge">.progress-bar</code> for animated progressbar.</p>

                    <div className="">
                      <Progress color="success" className="animated-progess mb-4" value={25}></Progress>
                      <Progress color="info" className="animated-progess mb-4" value={50}></Progress>
                      <Progress color="warning" className="animated-progess mb-4" value={75}></Progress>
                      <Progress color="danger" className="animated-progess" value={100}></Progress>
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

export default UiProgressbar;
