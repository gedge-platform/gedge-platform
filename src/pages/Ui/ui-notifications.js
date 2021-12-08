import React, { Component } from "react";
import { Row, Col, Card, CardBody, FormGroup, Button, Label, Container, Input } from "reactstrap";
import toastr from 'toastr'
import 'toastr/build/toastr.min.css'

//Import Breadcrumb
import Breadcrumbs from '../../components/Common/Breadcrumb';
import { Link } from "react-router-dom";

class UiNotifications extends Component {
    constructor(props) {
        super(props);
        this.state = {
            breadcrumbItems: [
                { title: "UI Elements", link: "#" },
                { title: "Notifications", link: "#" },
            ],
            showEasing: "swing",
            hideEasing: "linear",
            showMethod: "fadeIn",
            hideMethod: "fadeOut",

            showDuration: 300,
            hideDuration: 1000,
            timeOut: 5000,
            extendedTimeOut: 1000
        };
        this.showToast.bind(this);
        this.clearToast.bind(this);
        this.clearLastToast.bind(this);
    }

    showToast() {
        var ele = document.getElementsByName('toastType');
        var position = document.getElementsByName("positions");
        var toastType;
        var title = document.getElementById("title").value;
        var message = "Have fun storming the castle!";

        if (document.getElementById("message").value !== "")
            message = document.getElementById("message").value;

        //Close Button
        var closeButton = document.getElementById("closeButton").checked;

        //Debug
        var debug = document.getElementById("debugInfo").checked;

        //Progressbar
        var progressBar = document.getElementById("progressBar").checked;

        //Duplicates
        var preventDuplicates = document.getElementById("preventDuplicates").checked;

        //Newest on Top
        var newestOnTop = document.getElementById("newestOnTop").checked;

        //position class
        var positionClass = "toast-top-right";

        //Fetch position
        for (var p = 0; p < position.length; p++) {
            if (position[p].checked)
                positionClass = position[p].value
        }

        //Show Easing
        var showEasing = document.getElementById("showEasing").value;

        //Hide Easing
        var hideEasing = document.getElementById("hideEasing").value;

        //show method
        var showMethod = document.getElementById("showMethod").value;

        //Hide method
        var hideMethod = document.getElementById("hideMethod").value;


        //show duration
        var showDuration = document.getElementById("showDuration").value;

        //Hide duration
        var hideDuration = document.getElementById("hideDuration").value;

        //timeout
        var timeOut = document.getElementById("timeOut").value;

        //extended timeout
        var extendedTimeOut = document.getElementById("extendedTimeOut").value;

        //Fetch checked Type
        for (var i = 0; i < ele.length; i++) {
            if (ele[i].checked)
                toastType = ele[i].value
        }

        toastr.options = {
            positionClass: positionClass,
            timeOut: timeOut,
            extendedTimeOut: extendedTimeOut,
            closeButton: closeButton,
            debug: debug,
            progressBar: progressBar,
            preventDuplicates: preventDuplicates,
            newestOnTop: newestOnTop,
            showEasing: showEasing,
            hideEasing: hideEasing,
            showMethod: showMethod,
            hideMethod: hideMethod,
            showDuration: showDuration,
            hideDuration: hideDuration
        }

        // setTimeout(() => toastr.success(`Settings updated `), 300)
        //Toaster Types
        if (toastType === "info")
            toastr.info(message, title)
        else if (toastType === "warning")
            toastr.warning(message, title)
        else if (toastType === "error")
            toastr.error(message, title)
        else
            toastr.success(message, title)
    }

    clearToast() {
        toastr.clear()
    }

    clearLastToast() {
        var ele = document.getElementsByName('toastType');
        var toastType;
        var title = document.getElementById("title").value;
        var msg = document.getElementById("message").value;
        //Fetch checked Type
        for (var i = 0; i < ele.length; i++) {
            if (ele[i].checked)
                toastType = ele[i].value
        }
        var tmpToast = toastr[toastType](msg, title);
        var toastlast = tmpToast;
        toastr.clear(toastlast);
    }

    render() {
        return (
            <React.Fragment>
                <div className="page-content">
                    <Container fluid={true}>

                        <Breadcrumbs title="Notifications" breadcrumbItems={this.state.breadcrumbItems} />

                        <Row>
                            <Col lg="12">
                                <Card>
                                    <CardBody>
                                        <Row>
                                            <Col xl="4">
                                                <div className="control-group">
                                                    <div className="controls">
                                                        <FormGroup>
                                                            <Label className="control-label h6">Title</Label>
                                                            <Input id="title" type="text" className="input-large form-control" placeholder="Enter a title ..." />
                                                        </FormGroup>
                                                        <FormGroup>
                                                            <Label className="control-label h6">Message</Label>
                                                            <textarea className="input-large form-control" id="message" rows="3" placeholder="Enter a message ..."></textarea>
                                                        </FormGroup>
                                                    </div>
                                                </div>
                                                <div className="control-group my-4">

                                                    <div className="custom-control custom-checkbox mb-2">
                                                        <Input type="checkbox" className="custom-control-input input-mini" id="closeButton" value="checked" />
                                                        <Label className="custom-control-label" for="closeButton">Close Button</Label>
                                                    </div>

                                                    <div className="custom-control custom-checkbox mb-2">
                                                        <Input type="checkbox" className="custom-control-input input-mini" id="debugInfo" value="checked" />
                                                        <Label className="custom-control-label" for="debugInfo">Debug</Label>
                                                    </div>

                                                    <div className="custom-control custom-checkbox mb-2">
                                                        <Input type="checkbox" className="custom-control-input input-mini" id="progressBar" value="checked" />
                                                        <Label className="custom-control-label" for="progressBar">Progress Bar</Label>
                                                    </div>

                                                    <div className="custom-control custom-checkbox mb-2">
                                                        <Input type="checkbox" className="custom-control-input input-mini" id="preventDuplicates" value="checked" />
                                                        <Label className="custom-control-label" for="preventDuplicates">Prevent Duplicates</Label>
                                                    </div>

                                                    <div className="custom-control custom-checkbox mb-2">
                                                        <Input type="checkbox" className="custom-control-input input-mini" id="addClear" value="checked" />
                                                        <Label className="custom-control-label" for="addClear">Add button to force clearing a toast, ignoring focus</Label>
                                                    </div>

                                                    <div className="custom-control custom-checkbox mb-2">
                                                        <Input type="checkbox" className="custom-control-input input-mini" id="newestOnTop" value="checked" />
                                                        <Label className="custom-control-label" for="newestOnTop">Newest on top</Label>
                                                    </div>

                                                </div>
                                            </Col>

                                            <Col xl="2">
                                                <div className="control-group" id="toastTypeGroup">
                                                    <div className="controls mb-4">
                                                        <Label className="h6">Toast Type</Label>

                                                        <div className="custom-control custom-radio mb-2">
                                                            <Input type="radio" id="radio1" name="toastType" className="custom-control-input" value="success" defaultChecked />
                                                            <Label className="custom-control-label" for="radio1">Success</Label>
                                                        </div>

                                                        <div className="custom-control custom-radio mb-2">
                                                            <Input type="radio" id="radio2" name="toastType" className="custom-control-input" value="info" />
                                                            <Label className="custom-control-label" for="radio2">Info</Label>
                                                        </div>

                                                        <div className="custom-control custom-radio mb-2">
                                                            <Input type="radio" id="radio3" name="toastType" className="custom-control-input" value="warning" />
                                                            <Label className="custom-control-label" for="radio3">Warning</Label>
                                                        </div>

                                                        <div className="custom-control custom-radio mb-2">
                                                            <Input type="radio" id="radio4" name="toastType" className="custom-control-input" value="error" />
                                                            <Label className="custom-control-label" for="radio4">Error</Label>
                                                        </div>

                                                    </div>
                                                </div>
                                                <div className="control-group" id="positionGroup">
                                                    <div className="controls mb-4">
                                                        <Label className="h6">Position</Label>

                                                        <div className="custom-control custom-radio mb-2">
                                                            <Input type="radio" id="radio5" name="positions" className="custom-control-input" value="toast-top-right" />
                                                            <Label className="custom-control-label" for="radio5">Top Right</Label>
                                                        </div>

                                                        <div className="custom-control custom-radio mb-2">
                                                            <Input type="radio" id="radio6" name="positions" className="custom-control-input" value="toast-bottom-right" />
                                                            <Label className="custom-control-label" for="radio6">Bottom Right</Label>
                                                        </div>

                                                        <div className="custom-control custom-radio mb-2">
                                                            <Input type="radio" id="radio7" name="positions" className="custom-control-input" value="toast-bottom-left" />
                                                            <Label className="custom-control-label" for="radio7">Bottom Left</Label>
                                                        </div>

                                                        <div className="custom-control custom-radio mb-2">
                                                            <Input type="radio" id="radio8" name="positions" className="custom-control-input" value="toast-top-left" />
                                                            <Label className="custom-control-label" for="radio8">Top Left</Label>
                                                        </div>

                                                        <div className="custom-control custom-radio mb-2">
                                                            <Input type="radio" id="radio9" name="positions" className="custom-control-input" value="toast-top-full-width" />
                                                            <Label className="custom-control-label" for="radio9">Top Full Width</Label>
                                                        </div>

                                                        <div className="custom-control custom-radio mb-2">
                                                            <Input type="radio" id="radio10" name="positions" className="custom-control-input" value="toast-bottom-full-width" />
                                                            <Label className="custom-control-label" for="radio10">Bottom Full Width</Label>
                                                        </div>

                                                        <div className="custom-control custom-radio mb-2">
                                                            <Input type="radio" id="radio11" name="positions" className="custom-control-input" value="toast-top-center" />
                                                            <Label className="custom-control-label" for="radio11">Top Center</Label>
                                                        </div>

                                                        <div className="custom-control custom-radio mb-2">
                                                            <Input type="radio" id="radio12" name="positions" className="custom-control-input" value="toast-bottom-center" />
                                                            <Label className="custom-control-label" for="radio12">Bottom Center</Label>
                                                        </div>

                                                    </div>
                                                </div>
                                            </Col>

                                            <Col xl="3">
                                                <div className="control-group">
                                                    <div className="controls">
                                                        <FormGroup>
                                                            <Label for="showEasing">Show Easing</Label>
                                                            <Input id="showEasing" type="text" placeholder="swing, linear" className="input-mini form-control" value={this.state.showEasing} onChange={(e) => { this.setState({ showEasing: e.target.value }) }} />
                                                        </FormGroup>
                                                        <FormGroup>
                                                            <Label for="hideEasing">Hide Easing</Label>
                                                            <Input id="hideEasing" type="text" placeholder="swing, linear" className="input-mini form-control" value={this.state.hideEasing} onChange={(e) => { this.setState({ hideEasing: e.target.value }) }} />
                                                        </FormGroup>
                                                        <FormGroup>
                                                            <Label for="showMethod">Show Method</Label>
                                                            <Input id="showMethod" type="text" placeholder="show, fadeIn, slideDown" className="input-mini form-control" value={this.state.showMethod} onChange={(e) => { this.setState({ showMethod: e.target.value }) }} />
                                                        </FormGroup>
                                                        <FormGroup>
                                                            <Label for="hideMethod">Hide Method</Label>
                                                            <Input id="hideMethod" type="text" placeholder="hide, fadeOut, slideUp" className="input-mini form-control" value={this.state.hideMethod} onChange={(e) => { this.setState({ hideMethod: e.target.value }) }} />
                                                        </FormGroup>
                                                    </div>
                                                </div>
                                            </Col>

                                            <Col xl="3">
                                                <div className="control-group">
                                                    <div className="controls">
                                                        <FormGroup>
                                                            <Label for="showDuration">Show Duration</Label>
                                                            <Input id="showDuration" type="text" placeholder="ms" className="input-mini form-control" value={this.state.showDuration} onChange={(e) => { this.setState({ showDuration: e.target.value }) }} />
                                                        </FormGroup>
                                                        <FormGroup>
                                                            <Label for="hideDuration">Hide Duration</Label>
                                                            <Input id="hideDuration" type="text" placeholder="ms" className="input-mini form-control" value={this.state.hideDuration} onChange={(e) => { this.setState({ hideDuration: e.target.value }) }} />
                                                        </FormGroup>
                                                        <FormGroup>
                                                            <Label for="timeOut">Time out</Label>
                                                            <Input id="timeOut" type="text" placeholder="ms" className="input-mini form-control" value={this.state.timeOut} onChange={(e) => { this.setState({ timeOut: e.target.value }) }} />
                                                        </FormGroup>
                                                        <FormGroup>
                                                            <Label for="extendedTimeOut">Extended time out</Label>
                                                            <Input id="extendedTimeOut" type="text" placeholder="ms" className="input-mini form-control" value={this.state.extendedTimeOut} onChange={(e) => { this.setState({ extendedTimeOut: e.target.value }) }} />
                                                        </FormGroup>
                                                    </div>
                                                </div>
                                            </Col>
                                        </Row>

                                        <Row className="mt-4">
                                            <Col md="12">
                                                <div className="button-items">
                                                    <Button
                                                        type="button"
                                                        color="primary"
                                                        id="showtoast"
                                                        onClick={this.showToast}
                                                    >
                                                        Show Toast
                                                    </Button>
                                                    <Link to="/workspace" className="btn btn-success" onClick={this.showToast}>
                                                        Show Toast
                                                    </Link>
                                                    <Button
                                                        type="button"
                                                        color="danger"
                                                        id="cleartoasts"
                                                        onClick={this.clearToast}
                                                    >
                                                        Clear Toasts
                                                    </Button>
                                                    <Button onClick={this.clearLastToast} type="button" color="danger" id="clearlasttoast">Clear Last Toast</Button>
                                                </div>
                                            </Col>
                                        </Row>

                                        <div className="mt-3">
                                            <Col md="12">

                                            </Col>
                                        </div>
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

export default UiNotifications;
