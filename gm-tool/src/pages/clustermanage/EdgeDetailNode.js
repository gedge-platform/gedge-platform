import React, { Component, useEffect } from "react";
import { observer } from "mobx-react";
import store from "../../store/Monitor/store/Store"
import img1 from "../../assets/images/companies/img-1.png";
import { Row, Col, Card, CardBody, CardText, Container, Table } from "reactstrap";

const EdgeDetailNode = observer((props) => {
    const { clusterWorkerData = [] } = props
    const { clusterStore } = store;

    const [activeCont, setActiveCont] = React.useState(0)
    // console.log(clusterWorkerData)

    useEffect(() => {
        return () => {
        };
    }, []);

    let workerData = clusterWorkerData
    const selectRow = (value) => {
        if (activeCont !== value) {
            setActiveCont(value)
        }
    }
    if (workerData == null) {
        workerData = []
    }
    let nodeList = [];
    if (workerData.length > 0) {
        nodeList = workerData.map((item, key) => {
            return (
                <tr onClick={() => selectRow(key)}>
                    <th>{item.clusterName} </th>
                    <td>{item.addresses[0].address}</td>
                    <td>{item.kubeVersion}</td>
                    <td>{item.status}</td>
                    <td>{item.network}</td>
                    <td>{item.kernel}</td>
                    <td>{item.os}</td>
                </tr>
            )
        })
    }
    else {
        workerData = [{}];
        nodeList = workerData.map((item, key) => {
            return (
                <tr onClick={() => selectRow(key)}>
                    <th>empty </th>
                    <td>empty</td>
                    <td>empty</td>
                    <td>empty</td>
                    <td>empty</td>
                    <td>empty</td>
                    <td>empty</td>
                </tr>
            )
        })
        workerData = []
    }
    //worker의 clusterName은 master로 붙어 나옴.
    //worker의 name은 label에서 추출해야할지도 모름.

    let nowContentData = workerData.filter((item, key) => key == activeCont)

    let nowContents = []
    if (workerData.length > 0) {
        nowContents = nowContentData.map((item, key) => {
            console.log(item)
            return (
                <div style={{ display: "flex", justifyContent: "space-around" }}>
                    <h4 className="card-title">Node Info</h4>
                    <div>
                        <p>{item.clusterName}</p>
                        <hr />
                        <p>{item.kubeVersion}</p>
                        <hr />
                        <p>{item.status === "" ? "null" : item.status}</p>
                        <hr />
                        <p>{item.network === "" ? "null" : item.network}</p>
                        <hr />
                        <p>{item.os}</p>
                        <hr />
                        <p>{item.created_at}</p>
                        <hr />
                        <p>{item.containerRuntimeVersion}</p>
                        <hr />
                        <p>{item.addresses[0].address}</p>
                        <hr />
                        <p>{item.addresses[1].address}</p>
                        <hr />

                    </div>
                    <h4 className="card-title">Node Spec</h4>
                    <div>
                        <p>{item.capacity.cpu}</p>
                        <hr />
                        {/* {item.capacity.ephemeral - storage} */}
                        <p>{item.capacity.memory}</p>
                        <hr />
                        <p>{item.capacity.pods}</p>
                        <hr />
                    </div>
                </div>
            )
        })
    }
    else {
        nowContentData = [{}]
        nowContents = nowContentData.map((item, key) => {
            console.log(item)
            return (
                <div style={{ display: "flex", justifyContent: "space-around" }}>
                    <h4 className="card-title">Node Info</h4>
                    <div>
                        empty
                    </div>
                    <h4 className="card-title">Node Spec</h4>
                    <div>
                        empty
                    </div>
                </div>
            )
        })
    }

    return (
        <React.Fragment>
            <hr />
            <h4 className="card-title">Node List</h4>
            <hr></hr>
            <div className="table-rep-plugin">
                <div className="table-responsive mb-0" data-pattern="priority-columns">
                    <Table id="tech-companies-1" striped bordered responsive>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th data-priority="1">IpAddr</th>
                                <th data-priority="3">KubeVersion</th>
                                <th data-priority="1">Status</th>
                                <th data-priority="3">Network</th>
                                <th data-priority="3">Kernel</th>
                                <th data-priority="6">os</th>
                            </tr>
                        </thead>
                        <tbody>
                            {nodeList}
                        </tbody>
                    </Table>
                </div>
            </div>
            <hr></hr>

            <h4 className="card-title">Node Contents</h4>
            <hr></hr>
            {nowContents}
            <hr></hr>
        </React.Fragment >
    )

})

export default EdgeDetailNode;