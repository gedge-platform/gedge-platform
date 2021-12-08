import React, { Component, useEffect } from "react";
import { observer } from "mobx-react";
import store from "../../store/Monitor/store/Store"
import img1 from "../../assets/images/companies/img-1.png";
import { TabContent, TabPane, NavLink, NavItem, Collapse, CardText, Nav, Card, Row, Col, CardBody, Container, Table, CardHeader, Dropdown, DropdownMenu, DropdownItem, DropdownToggle, Modal, ModalHeader, ModalBody, Form, Input, Label, FormGroup, Button } from "reactstrap";
import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Alert from '@material-ui/lab/Alert';
import Grid from '@material-ui/core/Grid';

const ServiceDetailResource = observer((props) => {

    // console.log(props)
    const { resource = [] } = props

    useEffect(() => {
        return () => {
        };
    }, []);

    // console.log(resource)
    let podsData = resource.pods
    let deploymentsData = resource.deployments

    if (podsData === undefined) {
        podsData = []
    }
    if (deploymentsData === undefined) {
        deploymentsData = []
    }
    // console.log(podsData, "========", deploymentsData)

    let podList = []
    if (podsData !== null) {
        podList = podsData.map((item) => {
            return (
                <tr>
                    <th>{item.ip} </th>
                    <td>{item.nodeName}</td>
                    <td>{item.name}</td>
                </tr>
            )
        })
    } else {
        podList.push(
            <tr>
                <th>None </th>
                <td>None</td>
                <td>None</td>
            </tr>
        )
    }

    let workloadList = []
    if (deploymentsData.name !== "") {
        workloadList.push(
            <tr>
                <th>{deploymentsData.name} </th>
                <td>{deploymentsData.updateAt}</td>
            </tr>
        )
    } else {
        workloadList.push(
            <tr>
                <th>None </th>
                <td>None</td>
            </tr>
        )
    }

    return (
        <React.Fragment>
            <hr />
            <h4 className="card-title">Workloads</h4>
            <hr />
            <div className="table-responsive mb-0" data-pattern="priority-columns">
                <Table hover id="tech-companies-1" bordered responsive>
                    <thead>
                        <tr>
                            <th data-priority="1">Name</th>
                            <th data-priority="3">UpdateAt</th>
                        </tr>
                    </thead>
                    <tbody>
                        {workloadList}
                    </tbody>
                </Table>
            </div>
            <hr />
            <h4 className="card-title">Pods</h4>
            <hr />
            <div className="table-responsive mb-0" data-pattern="priority-columns">
                <Table hover id="tech-companies-1" bordered responsive>
                    <thead>
                        <tr>
                            <th data-priority="3">ip</th>
                            <th data-priority="2">nodeName</th>
                            <th data-priority="1">name</th>
                        </tr>
                    </thead>
                    <tbody>
                        {podList}
                    </tbody>
                </Table>
            </div>
            <hr />

        </React.Fragment >
    )

})

export default ServiceDetailResource;