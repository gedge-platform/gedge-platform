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

const CoreDetailEvent = observer((props) => {
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
                        <Accordion>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                            >
                                {item.type === "Normal" ? <div className={classes.alert}><Alert severity="success">Message: {item.message}</Alert></div> :
                                    item.type === "Waring" ? <div className={classes.alert}><Alert severity="warning">Message: {item.message}</Alert></div> :
                                        <div className={classes.alert}><Alert severity="error">Message: {item.message}</Alert></div>
                                }
                                {/* <div className={classes.alert}><Alert severity="success">This is an error alert — check it out!</Alert></div> */}
                            </AccordionSummary>
                            <AccordionDetails>
                                <div style={{ flexGrow: 1 }}>
                                    <Grid container spacing={1}>

                                        <Grid item xs={12} sm={6}>
                                            <h5>Kind: {item.kind}</h5>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <h5>name: {item.name}</h5>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <h5>namespace: {item.namespace}</h5>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <h5>reason: {item.reason}</h5>
                                        </Grid>
                                        <Grid item xs={12} sm={12}>
                                            <h5>Time: {item.eventTime}</h5>
                                        </Grid>
                                    </Grid>
                                </div>
                            </AccordionDetails >
                        </Accordion >
                    )
        })
    }
    else {
        eventData = [{}]
        eventList = eventData.map((item, idx) => {
            return (
                < Accordion >
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                    >
                        <div className={classes.alert}><Alert severity="info">No Have Events List</Alert></div>
                    </AccordionSummary>
                    <AccordionDetails>
                        <div style={{ flexGrow: 1 }}>
                            <Grid container spacing={1}>
                                <Grid item xs={12} >
                                    <h5>No Event</h5>
                                </Grid>
                            </Grid>
                        </div>
                    </AccordionDetails>
                </Accordion >
            )
        })
    }

    return (
        <React.Fragment>
            <hr />
            <div className={classes.alert}><Alert severity="info">이벤트</Alert></div>
            <hr />
            {eventList}
            {/* <div className="table-responsive">
                <Table responsive >
                    <thead>
                        <tr>
                            <th style={{ width: "100%" }} ><div className={classes.alert}><Alert severity="info">이벤트</Alert></div></th>
                        </tr>
                    </thead>
                    <tbody>
                        <div className={classes.root}>
                            {eventList}
                        </div>
                    </tbody>
                </Table>
            </div> */}
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "10px" }}>
                <Pagination size='' totalPages={total_page} activePage={activePage} onPageChange={handlePaginationChange} />
            </div>
        </React.Fragment >
    )

})

export default CoreDetailEvent;