import React, { Component } from "react";

import { Row, Col, Card, CardBody, CardText, Container, Table, ts } from "reactstrap";
//Import Breadcrumb
import Breadcrumbs from '../../components/Common/Breadcrumb';
import { getAPI } from '../../components/Common/api';
import { render } from "@testing-library/react";
import { TabContent, TabPane, NavLink, NavItem, Collapse, Nav, CardHeader, Dropdown, DropdownMenu, DropdownItem, DropdownToggle, Modal, ModalHeader, ModalBody, Form, Input, Label, FormGroup, Button } from "reactstrap";
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
export default function Event(props) {
    const classes = useStyles();
    const { apilistinfo } = props
    console.log(apilistinfo, "test");
    console.log(apilistinfo.events, "event info");
    let events = apilistinfo.events

    const [activePage, setActivePage] = React.useState(1);
    const [expanded, setExpanded] = React.useState(false);

    let eventList = []
    const handlePaginationChange = (event, activePage) => {
        // console.log(activePage.activePage)
        setActivePage(activePage.activePage)
    }

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };
    let eventData = events
    let total_page


    console.log(eventData)
    if (eventData == undefined) {
        eventData = []
    }
    if (eventData.length > 0) {
        total_page = Math.ceil(eventData.length / 5)
    }
    else {
        total_page = 1
    }
    if (eventData.length > 0) {
        eventList = eventData.map((item, idx) => {
            if ((activePage - 1) * 5 <= idx)
                if (idx <= activePage * 5)
                    return (
                        <div key={idx}>
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
                                    <div style={{ flexGrow: 1, padding: "10px 10px 10px" }}>
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
                        </div>
                    )
        })
    }
    else {
        eventData = [{}]
        eventList = eventData.map((item, idx) => {
            return (
                <div key={idx}>
                    < Accordion >
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                        >
                            <div className={classes.alert}><Alert severity="info">No Have Events List</Alert></div>
                        </AccordionSummary>
                        <AccordionDetails>
                            <div style={{ flexGrow: 1, padding: "10px 10px 10px" }}>
                                <Grid container spacing={1}>
                                    <Grid item xs={12} >
                                        <h5>No Event</h5>
                                    </Grid>
                                </Grid>
                            </div>
                        </AccordionDetails>
                    </Accordion >
                </div>
            )
        })
    }

    return (
        <React.Fragment>
            <div className="table-responsive"> <div>
                <div className={classes.alert}><Alert severity="info">이벤트</Alert></div>
            </div>
                <div>
                    <div className={classes.root}>
                        {eventList}
                    </div>
                </div>

            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "10px" }}>
                <Pagination size='' totalPages={total_page} activePage={activePage} onPageChange={handlePaginationChange} />
            </div>
        </React.Fragment >
    )


}
