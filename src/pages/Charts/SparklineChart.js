import React, { Component } from "react";
import { Row, Col, Card, CardBody, CardTitle, Container } from "reactstrap";

//Import Breadcrumb
import Breadcrumbs from '../../components/Common/Breadcrumb';

import {
  Sparklines,
  SparklinesLine,
  SparklinesBars,
  SparklinesSpots,
  SparklinesReferenceLine,
  SparklinesCurve
} from "react-sparklines";

class SparklineChart extends Component {
  constructor(props) {
    super(props);
    this.state={
        breadcrumbItems : [
            { title : "Charts", link : "#" },
            { title : "Sparkline Chart", link : "#" },
        ],
    }
}

  render() {
    return (
      <React.Fragment>
        <div className="page-content">
          <Container fluid>

            {/* Render Breadcrumb */}
            <Breadcrumbs title="Sparkline Chart" breadcrumbItems={this.state.breadcrumbItems} />

            <Row>
              <Col sm={4}>
                <Card>
                  <CardBody>
                    <CardTitle className="mb-4">Spots Chart</CardTitle>
                    <Sparklines
                      height={100}
                      data={[5, 10, 5, 20, 18, 17, 29, 10, 18]}
                      margin={6}
                    >
                      <SparklinesLine
                        style={{
                          strokeWidth: 1,
                          stroke: "#336aff",
                          fill: "none"
                        }}
                      />
                      <SparklinesSpots
                        size={4}
                        style={{
                          stroke: "#336aff",
                          strokeWidth: 1,
                          fill: "white"
                        }}
                      />
                    </Sparklines>
                  </CardBody>
                </Card>
              </Col>
              <Col sm={4}>
                <Card>
                  <CardBody>
                    <CardTitle className="mb-4">Bar Chart</CardTitle>
                    <div className="text-center">
                      <Sparklines
                        height={100}
                        data={[5, 6, 2, 8, 9, 4, 7, 10, 11, 12, 10, 4, 7, 10]}
                      >
                        <SparklinesBars
                          style={{ fill: "#02a499" }}
                          barWidth={5}
                        />
                      </Sparklines>
                    </div>
                  </CardBody>
                </Card>
              </Col>
              <Col sm={4}>
                <Card>
                  <CardBody className="analytics-info">
                    <CardTitle className="mb-4">Line Chart</CardTitle>
                    <Sparklines
                      height={100}
                      data={[0, 23, 43, 35, 44, 45, 56, 37, 40, 45, 56, 7, 10]}
                    >
                      <SparklinesLine
                        color="#3c4ccf"
                        lineWidth={1}
                        style={{ fill: "transparent" }}
                      />
                    </Sparklines>
                  </CardBody>
                </Card>
              </Col>
            </Row>
            <Row>
              <Col sm={4}>
                <Card>
                  <CardBody>
                    <CardTitle className="mb-4">Composite Bar Chart</CardTitle>
                    <Sparklines
                      height={100}
                      data={[5, 6, 2, 9, 4, 7, 10, 12, 4, 7, 10]}
                    >
                      <SparklinesCurve
                        style={{
                          strokeWidth: 0.8,
                          stroke: "#02a499",
                          fill: "transparent"
                        }}
                      />
                      <SparklinesBars style={{ fill: "#3c4ccf" }} barWidth={8} />
                    </Sparklines>
                  </CardBody>
                </Card>
              </Col>
              <Col sm={4}>
                <Card>
                  <CardBody>
                    <CardTitle className="mb-4">Reference Line Charts</CardTitle>
                    <Sparklines
                      height={100}
                      data={[5, 10, 5, 20, 18, 17, 29, 10, 18, 15, 20, 18, 17, 29, 10, 18]}
                    >
                      <SparklinesBars
                        style={{ fill: "#02a499", fillOpacity: ".5" }}
                      />
                      <SparklinesReferenceLine />
                    </Sparklines>
                  </CardBody>
                </Card>
              </Col>
              <Col sm={4}>
                <Card className="bg-success mb-4">
                  <CardBody>
                    <CardTitle className="mb-4">Real World Chart</CardTitle>
                    <Sparklines
                      height={80}
                      data={[4, 6, 7, 7, 4, 3, 2, 1, 4, 4, 5, 6, 3, 4, 5, 8, 7, 6, 9, 3, 2, 4, 1, 5, 6, 4, 3, 7]}
                      width={200}
                    >
                      <SparklinesLine
                        style={{ stroke: "#fff", fill: "transparent" }}
                      />
                      <SparklinesSpots />
                    </Sparklines>
                  </CardBody>
                </Card>
              </Col>
            </Row>

            <Row>
              <Col sm={4}>
                <Card>
                  <CardBody>
                    <CardTitle className="mb-4">Normal Band</CardTitle>
                    <Sparklines
                      height={100}
                      data={[5, 10, 5, 20, 18, 17, 29, 10, 18]}
                    >
                      <SparklinesLine
                        style={{
                          strokeWidth: 0.8,
                          stroke: "#6d60b0",
                          fill: "transparent"
                        }}
                      />
                      <SparklinesReferenceLine type="mean" />
                    </Sparklines>
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

export default SparklineChart;
