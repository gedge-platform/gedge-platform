import React, { Component } from 'react';
import { Card, CardBody, Col, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap";

//Simple bar
import SimpleBar from "simplebar-react";

class RecentlyActivity extends Component {
    constructor(props) {
        super(props);
        this.state = {
            menu : false,
        }
    }
    
    render() {
        return (
            <React.Fragment>
                            <Col lg={4}>
                                <Card>
                                    <CardBody>
                                        <Dropdown className="float-right" isOpen={this.state.menu} toggle={() => this.setState({menu : !this.state.menu})}>
                                            <DropdownToggle tag="i" className="darrow-none card-drop" aria-expanded="false">
                                                <i className="mdi mdi-dots-vertical"></i>
                                            </DropdownToggle>
                                            <DropdownMenu right>
                                                
                                                <DropdownItem href="">Sales Report</DropdownItem>
                                                
                                                <DropdownItem href="">Export Report</DropdownItem>
                                                
                                                <DropdownItem href="">Profit</DropdownItem>
                                                
                                                <DropdownItem href="">Action</DropdownItem>
                                            </DropdownMenu>
                                        </Dropdown>

                                        <h4 className="card-title mb-4">Recent Activity Feed</h4>

                                        <SimpleBar style={{ maxHeight: "330px" }}>
                                            <ul className="list-unstyled activity-wid">
                                                <li className="activity-list">
                                                    <div className="activity-icon avatar-xs">
                                                        <span className="avatar-title bg-soft-primary text-primary rounded-circle">
                                                            <i className="ri-edit-2-fill"></i>
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <div>
                                                            <h5 className="font-size-13">28 Apr, 2020 <small className="text-muted">12:07 am</small></h5>
                                                        </div>
                                                        
                                                        <div>
                                                            <p className="text-muted mb-0">Responded to need “Volunteer Activities”</p>
                                                        </div>
                                                    </div>
                                                </li>
                                                <li className="activity-list">
                                                    <div className="activity-icon avatar-xs">
                                                        <span className="avatar-title bg-soft-primary text-primary rounded-circle">
                                                            <i className="ri-user-2-fill"></i>
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <div>
                                                            <h5 className="font-size-13">21 Apr, 2020 <small className="text-muted">08:01 pm</small></h5>
                                                        </div>
                                                        
                                                        <div>
                                                            <p className="text-muted mb-0">Added an interest “Volunteer Activities”</p>
                                                        </div>
                                                    </div>
                                                </li>
                                                <li className="activity-list">
                                                    <div className="activity-icon avatar-xs">
                                                        <span className="avatar-title bg-soft-primary text-primary rounded-circle">
                                                            <i className="ri-bar-chart-fill"></i>
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <div>
                                                            <h5 className="font-size-13">17 Apr, 2020 <small className="text-muted">09:23 am</small></h5>
                                                        </div>
                                                        
                                                        <div>
                                                            <p className="text-muted mb-0">Joined the group “Boardsmanship Forum”</p>
                                                        </div>
                                                    </div>
                                                </li>
                                                <li className="activity-list">
                                                    <div className="activity-icon avatar-xs">
                                                        <span className="avatar-title bg-soft-primary text-primary rounded-circle">
                                                            <i className="ri-mail-fill"></i>
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <div>
                                                            <h5 className="font-size-13">11 Apr, 2020 <small className="text-muted">05:10 pm</small></h5>
                                                        </div>
                                                        
                                                        <div>
                                                            <p className="text-muted mb-0">Responded to need “In-Kind Opportunity”</p>
                                                        </div>
                                                    </div>
                                                </li>
                                                <li className="activity-list">
                                                    <div className="activity-icon avatar-xs">
                                                        <span className="avatar-title bg-soft-primary text-primary rounded-circle">
                                                            <i className="ri-calendar-2-fill"></i>
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <div>
                                                            <h5 className="font-size-13">07 Apr, 2020 <small className="text-muted">12:47 pm</small></h5>
                                                        </div>
                                                        
                                                        <div>
                                                            <p className="text-muted mb-0">Created need “Volunteer Activities”</p>
                                                        </div>
                                                    </div>
                                                </li>
                                                <li className="activity-list">
                                                    <div className="activity-icon avatar-xs">
                                                        <span className="avatar-title bg-soft-primary text-primary rounded-circle">
                                                            <i className="ri-edit-2-fill"></i>
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <div>
                                                            <h5 className="font-size-13">05 Apr, 2020 <small className="text-muted">03:09 pm</small></h5>
                                                        </div>
                                                        
                                                        <div>
                                                            <p className="text-muted mb-0">Attending the event “Some New Event”</p>
                                                        </div>
                                                    </div>
                                                </li>
                                                <li className="activity-list">
                                                    <div className="activity-icon avatar-xs">
                                                        <span className="avatar-title bg-soft-primary text-primary rounded-circle">
                                                            <i className="ri-user-2-fill"></i>
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <div>
                                                            <h5 className="font-size-13">02 Apr, 2020 <small className="text-muted">12:07 am</small></h5>
                                                        </div>
                                                        
                                                        <div>
                                                            <p className="text-muted mb-0">Responded to need “In-Kind Opportunity”</p>
                                                        </div>
                                                    </div>
                                                </li>
                                            </ul>
                                        </SimpleBar>
                                    </CardBody>
                                </Card>
                            </Col>
            </React.Fragment>
        );
    }
}

export default RecentlyActivity;