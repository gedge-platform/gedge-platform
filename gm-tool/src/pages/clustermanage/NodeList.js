import React, { Component } from "react";

import { Row, Col, Card, CardBody, CardText, Container, Table } from "reactstrap";
//Import Breadcrumb
import Breadcrumbs from '../../components/Common/Breadcrumb';
import { getAPI } from '../../components/Common/api';


class NodeList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            apilistinfo: []

        };
    }

    loadApilist() {
        // console.log(this.props.username)
        let test = getAPI('cluster', 'GET')
        // console.log(api.getAPI('pods', 'GET'))
        // console.log("+++++" + api.getAPI('pods', 'GET'));
        console.log(test);
        return test;
    }
    componentDidMount() {
        this.loadApilist().then(res => {
            // console.log(res);
            this.setState({
                apilistinfo: res
            })
        })
    }


    render() {
        const apilistinfo = this.state.apilistinfo;
        // let port = [];
        // let port_multi = [];
        // let port_bin = ""
        // apilistinfo.map(list => {
        //     let portslist = list.metadata;
        //     if (portslist.images.length > 1) {
        //         portslist.images.forEach(images => {
        //             port_multi.push(images.names + ":" + images.sizeBytes);
        //         });
        //         port_bin = port_multi.toString();
        //         // port_bin = port_bin.replaceAll(",", "\n");
        //         console.log(port_bin)
        //         port.push(port_bin);
        //     } else {
        //         portslist.ports.forEach(ports => {
        //             port.push(portslist.clusterIP + ":" + ports.port + " / " + ports.protocol + " > " + ports.targetPort);
        //         });
        //     }
        //     console.log(port)
        //     console.log(port)
        // })
        // const rows = apilistinfo.map((test, index) => ({
        return (
            <React.Fragment>
                {/* <div className="page-content"> */}
                {/* <Container fluid> */}

                {/* <Breadcrumbs title="Responsive Table" breadcrumbItems={this.state.breadcrumbItems} /> */}

                <Row>
                    <Col xs={12}>
                        <Card>
                            <CardBody>
                                {/* <h4 className="card-title">노드</h4> */}
                                {/* <p className="card-title-desc">This is an experimental awesome solution for responsive tables with complex data.</p> */}
                                <CardText>
                                    <div className="table-responsive">
                                        {/* <Table className=" table-centered mb-0 table-nowrap"> */}
                                        <Table hover className=" mb-0 table-centered table-nowrap">
                                            <thead>
                                                <tr>
                                                    <th className="border-top-0" style={{ width: "110px" }} scope="col">라벨</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <tr>
                                                        <td style={{ width: "60px" }}>
                                                            <div className="avatar-xs">
                                                                <div className="avatar-title rounded-circle bg-light">
                                                                    <img alt="" height="20" />
                                                                </div>
                                                            </div>
                                                        </td>

                                                        <td>
                                                            <h5 className="font-size-14 mb-0">Source 1</h5>
                                                        </td>
                                                        <td><div id="spak-chart1"></div></td>
                                                        <td>
                                                            {/* <div className="avatar-title rounded-circle bg-light">
                                                                {apilistinfo.map((test, index) => (
                                                                    <tr key={test.metadata.name}>
                                                                        <td>containerRuntimeVersion</td>
                                                                        <td> key={index} {port[index]}</td>
                                                                    </tr>

                                                                ))}
                                                            </div> */}
                                                        </td>
                                                    </tr>
                                                </tr>
                                            </tbody>
                                        </Table>
                                        <Table hover className=" mb-0 table-centered table-nowrap">
                                            <thead>
                                                <tr>
                                                    <th className="border-top-0" style={{ width: "110px" }} scope="col">어노테이션</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <tr>
                                                        <td style={{ width: "60px" }}>
                                                            <div className="avatar-xs">
                                                                <div className="avatar-title rounded-circle bg-light">
                                                                    <img alt="" height="20" />
                                                                </div>
                                                            </div>
                                                        </td>

                                                        <td>
                                                            <h5 className="font-size-14 mb-0">Source 1</h5>
                                                        </td>
                                                        <td><div id="spak-chart1">  {apilistinfo.map((test) => (
                                                            <tr key={test.metadata.name}>
                                                                <td>containerRuntimeVersion</td>
                                                                <td>{test.metadata.name}</td>
                                                            </tr>

                                                        ))}</div></td>
                                                    </tr>
                                                </tr>
                                            </tbody>
                                        </Table>
                                    </div>
                                </CardText>
                                <div className="table-rep-plugin">
                                    <div className="table-responsive mb-0" data-pattern="priority-columns">
                                        <Table >
                                            <thead>
                                                <tr>
                                                    <th className="border-top-0" style={{ width: "110px" }} scope="col">서비스</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <div class="div-content-detail">
                                                        <div class="div-content-detail-0">
                                                            <div className="avatar-xs">
                                                                <div className="avatar-title rounded-circle bg-light">
                                                                    {apilistinfo.map((test) => (
                                                                        <tr key={test.metadata.name}>
                                                                            <td>containerRuntimeVersion</td>
                                                                            <td>{test.metadata.name}</td>
                                                                        </tr>

                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div class="div-content-detail-1">
                                                            <div>
                                                                <div class="div-content-text-1"><a>redis-7qgzmk-headless</a></div>
                                                                <div class="div-contetn-text-2"><a>{apilistinfo.map((test) => (
                                                                    <tr key={test.metadata.name}>
                                                                        <td>containerRuntimeVersion</td>
                                                                        <td>{test.metadata.name}</td>
                                                                    </tr>

                                                                ))}</a></div>
                                                            </div>
                                                        </div>
                                                        <div class="div-content-detail-2">
                                                            <div>
                                                                <div class="div-content-text-1">Off</div>
                                                                <div class="div-content-text-2">Application Governance</div>
                                                            </div>
                                                        </div>
                                                        <div class="div-content-detail-2">
                                                            <div>
                                                                <div class="div-content-text-1">None</div>
                                                                <div class="div-content-text-2">ClusterIP</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </tr>
                                            </tbody>
                                        </Table>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
                {/* </Container> */}
                {/* </div> */}
            </React.Fragment>
        );
    }
}

export default NodeList;
