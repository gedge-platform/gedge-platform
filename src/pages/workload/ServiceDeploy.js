import React, { useEffect } from 'react';
import { observer } from "mobx-react";
import { TabContent, TabPane, NavLink, NavItem, CardText, Nav, Card, Row, Col, CardBody, Container, Table, Dropdown, DropdownMenu, DropdownItem, DropdownToggle, Modal, ModalHeader, ModalBody, Form, Input, Label, FormGroup, Button, Alert } from "reactstrap";
import store from "../../store/Monitor/store/Store"
//Import Charts
import "../Dashboard/dashboard.scss";
import "./detail.scss";

const ServiceDeploy = observer((props) => {
    const { workloadDetailStore } = store;
    const { params } = props;
    const { apitoData } = props;

    let temp = [];
    let selectors = [];
    let podReadyList = [];

    if (apitoData.length > 0) {
        apitoData.map((list, key) => {
            console.log(list)
            selectors.push(Object.entries(list.selector))
            console.log(selectors)
        })

    }
    const link = "namespaces/" + params.namespace + "/deployments/ "
    // console.log(link)
    useEffect(() => {
        workloadDetailStore.getDeploymentList(link);
    }, []);
    if (workloadDetailStore.detailDeploymentList !== undefined) {
        temp = workloadDetailStore.detailDeploymentList
    }
    // console.log(temp, "service Temp")
    let temp_list = []
    let temp_list2 = []

    temp.map((list, key) => {
        temp_list = list.spec.template.metadata.labels;
        temp_list2.push(Object.entries(temp_list));
        if (temp_list2 == selectors) {
            console.log("zz")
        }
    })

    console.log(temp_list2, "temp_list2")

    // })


    const podTable = podReadyList.map((list) => {
        // console.log(list)
        // console.log(list.ip)
        return (
            <div className="div-content-detail" >
                <div className="div-content-detail-1" >
                    <div>
                        <div className="div-content-text-1">{list.targetRef.name}</div>
                        <div className="div-content-text-2">Pod Name</div>
                    </div>
                </div>
                <div className="div-content-detail-2">
                    <div>
                        <div className="div-content-text-1">{list.nodeName}</div>
                        <div className="div-content-text-2">Node</div>
                    </div>
                </div>
                <div className="div-content-detail-2">
                    <div>
                        <div className="div-content-text-1">{list.ip}</div>
                        <div className="div-content-text-2">Pod IP</div>
                    </div>
                </div>
            </div >
        )

    })

    return (
        <React.Fragment>
            <div className="table-responsive">
                <Table responsive className="mb-0">
                    <thead>
                        <tr>
                            <th style={{ width: "100%" }} >디플로이먼트</th>
                        </tr>
                    </thead>
                </Table>
            </div>
            <div className="table-responsive">
                <div className="content-detail">
                    추후보완하겠습니다(--)(__)(--)
                </div>
            </div>
        </React.Fragment >

    )
});

export default ServiceDeploy