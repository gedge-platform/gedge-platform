import React, { Component, useEffect } from "react";
import { observer } from "mobx-react";
import store from "../../store/Monitor/store/Store"
import img1 from "../../assets/images/companies/img-1.png";
import { Row, Col, Card, CardBody, CardText, Container, Table } from "reactstrap";

const CoreDetailNode = observer((props) => {
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
                    <td>{item.clusterEndpoint}</td>
                    <td>{item.clusterCreator}</td>
                    <td>{item.ipAddr}</td>
                    <td>{item.gpu}</td>
                    <td>{item.kubeVersion}</td>
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
                        <p>{item.clusterType}</p>
                        <hr />
                        <p>{item.clusterEndpoint}</p>
                        <hr />
                        <p>{item.clusterCreator}</p>
                        <hr />
                        <p>{item.gpu}</p>
                        <hr />
                        <p>{item.kubeVersion}</p>
                        <hr />
                        <p>{item.status}</p>
                        <hr />
                        <p>{item.network}</p>
                        <hr />
                        <p>{item.os}</p>
                        <hr />
                        <p>{item.kernel}</p>
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
                                <th data-priority="1">EndPoint</th>
                                <th data-priority="3">Creator</th>
                                <th data-priority="1">ipAddr</th>
                                <th data-priority="3">gpu</th>
                                <th data-priority="3">kubeVersion</th>
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

export default CoreDetailNode;