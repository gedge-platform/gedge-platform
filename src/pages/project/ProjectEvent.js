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

import { Pagination } from 'semantic-ui-react'
const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        flexBasis: '33.33%',
        flexShrink: 0,
    },
    secondaryHeading: {
        fontSize: theme.typography.pxToRem(15),
        color: theme.palette.text.secondary,
    },
    alert: {
        width: '100%',
        '& > * + *': {
            marginTop: theme.spacing(2),
        },
    },
}));

const ProjectEvent = observer((props) => {
    const classes = useStyles();
    const { events } = props
    const { clusterStore } = store;

    const [activePage, setActivePage] = React.useState(1);
    const [expanded, setExpanded] = React.useState(false);
    useEffect(() => {
        return () => {
        };
    }, []);

    const handlePaginationChange = (event, activePage) => {
        // console.log(activePage.activePage)
        setActivePage(activePage.activePage)
    }

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    let eventData = events

    if (eventData === null) {
        eventData = []
    }
    let total_page
    if (eventData.length > 0) {
        total_page = Math.ceil(eventData.length / 5)
    }
    else {
        total_page = 1
    }

    let eventList = []

    if (eventData.length > 0) {
        eventList = eventData.map((item, idx) => {
            if ((activePage - 1) * 5 <= idx)
                if (idx <= activePage * 5)
                    return (
                        <tr>
                            <th>
                                {item.type === "Normal" ? <Alert severity="success">Message: {item.message}</Alert> :
                                    item.type === "Waring" ? <Alert severity="warning">Message: {item.message}</Alert> :
                                        <Alert severity="error">Message: {item.message}</Alert>
                                }
                            </th>
                        </tr>
                    )
        })
    }
    else {
        eventData = [{}]
        eventList = eventData.map((item, idx) => {
            return (
                <tr>
                    <th>
                        <Alert severity="info">No Have Events List</Alert>
                    </th>
                </tr>
            )
        })
    }

    return (
        <React.Fragment>
            <hr />
            <Alert severity="info">이벤트</Alert>
            <hr />
            <Table id="tech-companies-1" hover bordered responsive>
                <thead>
                    {/* <tr>
                        <th data-priority="1"><Alert severity="info">이벤트</Alert></th>
                    </tr> */}
                </thead>
                <tbody>
                    {eventList}
                </tbody>
            </Table>

            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "10px" }}>
                <Pagination size='mini' totalPages={total_page} activePage={activePage} onPageChange={handlePaginationChange} />
            </div>
        </React.Fragment >
    )

})

export default ProjectEvent;