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

const ServiceDetailPort = observer((props) => {

    const { port } = props
    // console.log(port)
    useEffect(() => {
        return () => {
        };
    }, []);

    let portList = port.map((item, key) => {
        return (
            <tr>
                <th>{item.port} </th>
                <td>{item.protocol}</td>
                <td>{item.targetPort}</td>
            </tr>
        )
    })

    return (
        <React.Fragment>
            <hr />
            <h4 className="card-title">Port Info</h4>
            <hr />
            <div className="table-rep-plugin">
                <div className="table-responsive mb-0" data-pattern="priority-columns">
                    <Table hover id="tech-companies-1" bordered responsive>
                        <thead>
                            <tr>
                                <th data-priority="1">Port</th>
                                <th data-priority="3">Protocol</th>
                                <th data-priority="1">TargetPort</th>

                            </tr>
                        </thead>
                        <tbody>
                            {portList}
                        </tbody>
                    </Table>
                </div>
            </div>
            <hr />
        </React.Fragment >
    )

})

export default ServiceDetailPort;