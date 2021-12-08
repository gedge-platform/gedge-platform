import React, { Component } from 'react';
import { Row, Card, CardBody, Col, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Form, Input, Button } from "reactstrap";

//Import images
import avatar2 from "../../assets/images/users/avatar-2.jpg";

//Simple bar
import SimpleBar from "simplebar-react";

class ChatBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isSearch : false,
            isSetting : false,
            isMore : false
        }
    }
    
    render() {
        return (
            <React.Fragment>
                            <Col lg={4}>
                                <Card>
                                    <CardBody className="border-bottom">

                                        <div className="user-chat-border">
                                            <Row>
                                                <Col md={5} xs={9}>
                                                    <h5 className="font-size-15 mb-1">Frank Vickery</h5>
                                                    <p className="text-muted mb-0"><i className="mdi mdi-circle text-success align-middle mr-1"></i> Active now</p>
                                                </Col>
                                                <Col md={7} xs={3}>
                                                    <ul className="list-inline user-chat-nav text-right mb-0">
                                                        <li className="list-inline-item">
                                                            <Dropdown isOpen={this.state.isSearch} toggle={() => this.setState({isSearch : !this.state.isSearch})} >
                                                                <DropdownToggle tag="i" className="btn nav-btn" type="button">
                                                                    <i className="mdi mdi-magnify"></i>
                                                                </DropdownToggle>
                                                                <DropdownMenu right className=" dropdown-menu-md p-0">
                                                                    <Form className="p-2">
                                                                        <div className="search-box">
                                                                            <div className="position-relative">
                                                                                <Input type="text" className="form-control rounded bg-light border-0" placeholder="Search..."/>
                                                                                <i className="mdi mdi-magnify search-icon"></i>
                                                                            </div>
                                                                        </div>
                                                                    </Form>
                                                                </DropdownMenu>
                                                            </Dropdown>
                                                        </li>
                                                        <li className="list-inline-item d-none d-sm-inline-block">
                                                            <Dropdown isOpen={this.state.isSetting} toggle={() => this.setState({isSetting : !this.state.isSetting})}>
                                                                <DropdownToggle tag="button" className="btn nav-btn" type="button" >
                                                                    <i className="mdi mdi-cog"></i>
                                                                </DropdownToggle>
                                                                <DropdownMenu right>
                                                                    <DropdownItem href="#">View Profile</DropdownItem>
                                                                    <DropdownItem href="#">Clear chat</DropdownItem>
                                                                    <DropdownItem href="#">Muted</DropdownItem>
                                                                    <DropdownItem href="#">Delete</DropdownItem>
                                                                </DropdownMenu>
                                                            </Dropdown>
                                                        </li>
        
                                                        <li className="list-inline-item">
                                                            <Dropdown isOpen={this.state.isMore} toggle={() => this.setState({isMore : !this.state.isMore})}>
                                                                <DropdownToggle tag="button" className="btn nav-btn" type="button" >
                                                                    <i className="mdi mdi-dots-horizontal"></i>
                                                                </DropdownToggle>
                                                                <DropdownMenu right>
                                                                    <DropdownItem href="#">Action</DropdownItem>
                                                                    <DropdownItem href="#">Another action</DropdownItem>
                                                                    <DropdownItem href="#">Something else</DropdownItem>
                                                                </DropdownMenu>
                                                            </Dropdown>
                                                        </li>
                                                        
                                                    </ul>
                                                </Col>
                                            </Row>
                                        </div>
                                    </CardBody>
                                    <CardBody>
                                        <div className="chat-widget">
                                            <div className="chat-conversation" >
                                                <SimpleBar  style={{maxHeight: "237px"}}>
                                                <ul className="list-unstyled mb-0 pr-3">
                                                    <li>
                                                        <div className="conversation-list">
                                                            <div className="chat-avatar">
                                                                <img src={avatar2} alt=""/>
                                                            </div>
                                                            <div className="ctext-wrap">
                                                                <div className="conversation-name">Frank Vickery</div>
                                                                <div className="ctext-wrap-content">
                                                                    <p className="mb-0">
                                                                        Hey! I am available
                                                                    </p>
                                                                </div>
                                                                <p className="chat-time mb-0"><i className="mdi mdi-clock-outline align-middle mr-1"></i> 12:09</p>
                                                            </div>
                                                            
                                                        </div>
                                                    </li>

                                                    <li className="right">
                                                        <div className="conversation-list">
                                                            <div className="ctext-wrap">
                                                                <div className="conversation-name">Ricky Clark</div>
                                                                <div className="ctext-wrap-content">
                                                                    <p className="mb-0">
                                                                        Hi, How are you? What about our next meeting?
                                                                    </p>
                                                                </div>
        
                                                                <p className="chat-time mb-0"><i className="bx bx-time-five align-middle mr-1"></i> 10:02</p>
                                                            </div>
                                                        </div>
                                                    </li>

                                                    <li> 
                                                        <div className="chat-day-title">
                                                            <span className="title">Today</span>
                                                        </div>
                                                    </li>
                                                    <li>
                                                        <div className="conversation-list">
                                                            <div className="chat-avatar">
                                                                <img src={avatar2} alt=""/>
                                                            </div>
                                                            <div className="ctext-wrap">
                                                                <div className="conversation-name">Frank Vickery</div>
                                                                <div className="ctext-wrap-content">
                                                                    <p className="mb-0">
                                                                        Hello!
                                                                    </p>
                                                                </div>
                                                                <p className="chat-time mb-0"><i className="mdi mdi-clock-outline align-middle mr-1"></i> 10:00</p>
                                                            </div>
                                                            
                                                        </div>
                                                    </li>
        
                                                    <li className="right">
                                                        <div className="conversation-list">
                                                            <div className="ctext-wrap">
                                                                <div className="conversation-name">Ricky Clark</div>
                                                                <div className="ctext-wrap-content">
                                                                    <p className="mb-0">
                                                                        Hi, How are you? What about our next meeting?
                                                                    </p>
                                                                </div>
        
                                                                <p className="chat-time mb-0"><i className="bx bx-time-five align-middle mr-1"></i> 10:02</p>
                                                            </div>
                                                        </div>
                                                    </li>
        
                                                    <li>
                                                        <div className="conversation-list">
                                                            <div className="chat-avatar">
                                                                <img src={avatar2} alt=""/>
                                                            </div>
                                                            <div className="ctext-wrap">
                                                                <div className="conversation-name">Frank Vickery</div>
                                                                <div className="ctext-wrap-content">
                                                                    <p className="mb-0">
                                                                        Yeah everything is fine
                                                                    </p>
                                                                </div>
                                                                
                                                                <p className="chat-time mb-0"><i className="bx bx-time-five align-middle mr-1"></i> 10:06</p>
                                                            </div>
                                                            
                                                        </div>
                                                    </li>
        
                                                    <li >
                                                        <div className="conversation-list">
                                                            <div className="chat-avatar">
                                                                <img src={avatar2} alt=""/>
                                                            </div>
                                                            <div className="ctext-wrap">
                                                                <div className="conversation-name">Frank Vickery</div>
                                                                <div className="ctext-wrap-content">
                                                                    <p className="mb-0">& Next meeting tomorrow 10.00AM</p>
                                                                </div>
                                                                <p className="chat-time mb-0"><i className="bx bx-time-five align-middle mr-1"></i> 10:06</p>
                                                            </div>
                                                            
                                                        </div>
                                                    </li>
        
                                                    <li className="right">
                                                        <div className="conversation-list">
                                                            <div className="ctext-wrap">
                                                                <div className="conversation-name">Ricky Clark</div>
                                                                <div className="ctext-wrap-content">
                                                                    <p className="mb-0">
                                                                        Wow that's great
                                                                    </p>
                                                                </div>
        
                                                                <p className="chat-time mb-0"><i className="bx bx-time-five align-middle mr-1"></i> 10:07</p>
                                                            </div>
                                                        </div>
                                                    </li>
                                                    
                                                    
                                                </ul>
                                                </SimpleBar>
                                            </div>
                                        </div>
                                    </CardBody>
                                    <div className="p-3 chat-input-section border-top">
                                        <Row>
                                            <Col>
                                                <div>
                                                    <Input type="text" className="form-control rounded chat-input pl-3" placeholder="Enter Message..."/>
                                                </div>
                                            </Col>
                                            <Col xs={{size:'auto'}}>
                                                <Button color="primary" type="submit" className="chat-send w-md waves-effect waves-light"><span className="d-none d-sm-inline-block mr-2">Send</span> <i className="mdi mdi-send"></i></Button>
                                            </Col>
                                        </Row>
                                    </div>
                                </Card>
                            </Col>
            </React.Fragment>
        );
    }
}

export default ChatBox;