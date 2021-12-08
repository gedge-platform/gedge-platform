import React, { Component } from 'react';
import { Container, Card, CardBody, Row, Col } from "reactstrap";

//Import Calendar
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import BootstrapTheme from '@fullcalendar/bootstrap';

import "@fullcalendar/core/main.css";
import "@fullcalendar/daygrid/main.css";
import "@fullcalendar/bootstrap/main.css";

//Import Breadcrumb
import Breadcrumbs from '../../components/Common/Breadcrumb';

class Calendar extends Component {
    constructor(props) {
        super(props);
        this.state={
            breadcrumbItems : [
                { title : "Nazox", link : "#" },
                { title : "Calendar", link : "#" },
            ],
            calendarWeekends: true,
            calendarEvents: [
                {
                    title: 'All Day Event',
                    start: new Date().setDate(1),
                },
                {
                    id: 999,
                    title: 'Long Event',
                    start: new Date().setDate(17),
                    end: new Date().setDate(19),
                    allDay: false,
                },
                {
                    id: 999,
                    title: 'Repeating Event',
                    start: new Date().setDate(19),
                    allDay: false,
                },
                {
                    id: 999,
                    title: 'Meeting',
                    start: new Date().setDate(22),
                    allDay: false,
                },
                {
                    id: 999,
                    title: 'Lunch',
                    start: new Date().setDate(22),
                    allDay: false,
                },
                {
                    title: 'Birthday Party',
                    start: new Date().setDate(23),
                    allDay: false,
                },
                {
                    id: 999,
                    title: 'Repeating Event',
                    start: new Date().setDate(26),
                    allDay: false,
                },
                {
                    id: 999,
                    title: 'Click for Google',
                    start: new Date().setDate(28),
                    allDay: false,
                },
            ]
        }
        this.handleDateClick.bind(this);
    }
    
    handleDateClick = (arg) => {
        var title = prompt('Event Title:');
        this.setState({ selectedDay: arg });
        if(title == null) {  }
        else
        {
            var newEvent = {};
            newEvent = {
                id: this.state.calendarEvents.length + 1,
                title: title,
                start: this.state.selectedDay ? this.state.selectedDay.date : new Date(),
                className: 'bg-primary'
            };
            this.setState({
                calendarEvents: this.state.calendarEvents.concat(newEvent),
                selectedDay: null
            });

        }
    }

    render() {
        return (
            <React.Fragment>
                <div className="page-content">
                    <Container fluid>

                    <Breadcrumbs title="Calendar" breadcrumbItems={this.state.breadcrumbItems} />
                        
                        <Row>
                            <Col xs={12}>
                                <Card>
                                    <CardBody>
                                        <FullCalendar
                                            defaultView="dayGridMonth"
                                            plugins={[BootstrapTheme, dayGridPlugin, interactionPlugin ]}
                                            handleWindowResize={true}
                                            themeSystem="bootstrap"
                                            header={{
                                            left: "prev,next today",
                                            center: "title",
                                            right: "dayGridMonth,dayGridWeek,dayGridDay"
                                            }}
                                            dateClick={this.handleDateClick}
                                            editable={true}
                                            droppable={true}
                                            eventLimit={true}
                                            selectable={true}
                                            events={this.state.calendarEvents}
                                        />
    
                                        <div style={{clear : "both"}}></div>
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

export default Calendar;