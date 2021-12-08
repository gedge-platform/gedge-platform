import React, { Component } from "react";
import { Row, Col, Card, CardBody, Container } from "reactstrap";
//Import Breadcrumb
import Breadcrumbs from '../../components/Common/Breadcrumb';

// import chartJs
import LineChart from "../AllCharts/chartjs/linechart";
import DountChart from "../AllCharts/chartjs/dountchart";
import PieChart from "../AllCharts/chartjs/piechart";
import BarChart from "../AllCharts/chartjs/barchart";
import RadarChart from "../AllCharts/chartjs/radarchart";
import PolarChart from "../AllCharts/chartjs/polarchart";

class ChartjsChart extends Component {
  constructor(props) {
    super(props);
    this.state={
        breadcrumbItems : [
            { title : "Charts", link : "#" },
            { title : "Chartjs", link : "#" },
        ],
    }
}

  render() {
    return (
      <React.Fragment>
        <div className="page-content">
          <Container fluid>

            <Breadcrumbs title="Chartjs" breadcrumbItems={this.state.breadcrumbItems} />
            <Row>
                            <Col lg={6}>
                                <Card>
                                    <CardBody>
        
                                        <h4 className="card-title mb-4">Line Chart</h4>
        
                                        <Row className="text-center">
                                            <Col xs={4}>
                                                <h5 className="mb-0">86541</h5>
                                                <p className="text-muted text-truncate">Activated</p>
                                            </Col>
                                            <Col xs={4}>
                                                <h5 className="mb-0">2541</h5>
                                                <p className="text-muted text-truncate">Pending</p>
                                            </Col>
                                            <Col xs={4}>
                                                <h5 className="mb-0">102030</h5>
                                                <p className="text-muted text-truncate">Deactivated</p>
                                            </Col>
                                        </Row>
        
                                        <LineChart/>
        
                                    </CardBody>
                                </Card>
                            </Col> 
        
                            <Col lg={6}>
                                <Card>
                                    <CardBody>
        
                                        <h4 className="card-title mb-4">Bar Chart</h4>

                                        <Row className="text-center">
                                            <Col xs={4}>
                                                <h5 className="mb-0">2541</h5>
                                                <p className="text-muted text-truncate">Activated</p>
                                            </Col>
                                            <Col xs={4}>
                                                <h5 className="mb-0">84845</h5>
                                                <p className="text-muted text-truncate">Pending</p>
                                            </Col>
                                            <Col xs={4}>
                                                <h5 className="mb-0">12001</h5>
                                                <p className="text-muted text-truncate">Deactivated</p>
                                            </Col>
                                        </Row>
        
                                        <BarChart/>
        
                                    </CardBody>
                                </Card>
                            </Col> 
                        </Row> 
        
        
                        <Row>
                            <Col lg={6}>
                                <Card>
                                    <CardBody>
        
                                        <h4 className="card-title mb-4">Pie Chart</h4>
        
                                        <Row className="text-center">
                                            <Col xs={4}>
                                                <h5 className="mb-0">2536</h5>
                                                <p className="text-muted text-truncate">Activated</p>
                                            </Col>
                                            <Col xs={4}>
                                                <h5 className="mb-0">69421</h5>
                                                <p className="text-muted text-truncate">Pending</p>
                                            </Col>
                                            <Col xs={4}>
                                                <h5 className="mb-0">89854</h5>
                                                <p className="text-muted text-truncate">Deactivated</p>
                                            </Col>
                                        </Row>
        
                                        <PieChart/>
        
                                    </CardBody>
                                </Card>
                            </Col> 
        
                            <Col lg={6}>
                                <Card>
                                    <CardBody>
        
                                        <h4 className="card-title mb-4">Donut Chart</h4>
        
                                        <Row className="text-center">
                                            <Col xs={4}>
                                                <h5 className="mb-0">9595</h5>
                                                <p className="text-muted text-truncate">Activated</p>
                                            </Col>
                                            <Col xs={4}>
                                                <h5 className="mb-0">36524</h5>
                                                <p className="text-muted text-truncate">Pending</p>
                                            </Col>
                                            <Col xs={4}>
                                                <h5 className="mb-0">62541</h5>
                                                <p className="text-muted text-truncate">Deactivated</p>
                                            </Col>
                                        </Row>
        
                                        <DountChart/>
        
                                    </CardBody>
                                </Card>
                            </Col> 
                        </Row> 
        
                        <Row>
                            <Col lg={6}>
                                <Card>
                                    <CardBody>
        
                                        <h4 className="card-title mb-4">Polar Chart</h4>

                                        <Row className="text-center">
                                            <Col xs={4}>
                                                <h5 className="mb-0">4852</h5>
                                                <p className="text-muted text-truncate">Activated</p>
                                            </Col>
                                            <Col xs={4}>
                                                <h5 className="mb-0">3652</h5>
                                                <p className="text-muted text-truncate">Pending</p>
                                            </Col>
                                            <Col xs={4}>
                                                <h5 className="mb-0">85412</h5>
                                                <p className="text-muted text-truncate">Deactivated</p>
                                            </Col>
                                        </Row>
        
                                        <PolarChart/>
        
                                    </CardBody>
                                </Card>
                            </Col> 
        
                            <Col lg={6}>
                                <Card>
                                    <CardBody>
                                        <h4 className="card-title mb-4">Radar Chart</h4>

                                        <Row className="text-center">
                                            <Col xs={4}>
                                                <h5 className="mb-0">694</h5>
                                                <p className="text-muted text-truncate">Activated</p>
                                            </Col>
                                            <Col xs={4}>
                                                <h5 className="mb-0">55210</h5>
                                                <p className="text-muted text-truncate">Pending</p>
                                            </Col>
                                            <Col xs={4}>
                                                <h5 className="mb-0">489498</h5>
                                                <p className="text-muted text-truncate">Deactivated</p>
                                            </Col>
                                        </Row>
        
                                        <RadarChart/>
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

export default ChartjsChart;
