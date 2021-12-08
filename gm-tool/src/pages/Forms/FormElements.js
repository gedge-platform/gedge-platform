import React, { Component } from "react";
import { Card, CardBody, Col, Row, Container, FormGroup, Label, Input, CustomInput } from "reactstrap";

//Import Breadcrumb
import Breadcrumbs from '../../components/Common/Breadcrumb';

class FormElements extends Component {
    constructor(props) {
        super(props);
        this.state = {
            breadcrumbItems : [
                { title : "Forms", link : "#" },
                { title : "Forms Elements", link : "#" },
            ],
            customchk: true,
            toggleSwitch: true
        };
    }

    render() {
        return (
            <React.Fragment>
                <div className="page-content">
                    <Container fluid>

                        <Breadcrumbs title="Forms Elements" breadcrumbItems={this.state.breadcrumbItems} />

                        <Row>
                            <Col xs={12}>
                                <Card>
                                    <CardBody>
                                        <h4 className="card-title">Textual inputs</h4>
                                        <p className="card-title-desc">Here are examples of <code>.form-control</code> applied to each
                                            textual HTML5 <code>&lt;input&gt;</code> <code>type</code>.</p>

                                        <FormGroup row>
                                            <Label htmlFor="example-text-input" className="col-md-2 col-form-label">Text</Label>
                                            <Col md={10}>
                                                <Input className="form-control" type="text" defaultValue="Artisanal kale" id="example-text-input" />
                                            </Col>
                                        </FormGroup>
                                        <FormGroup row>
                                            <Label htmlFor="example-search-input" className="col-md-2 col-form-label">Search</Label>
                                            <Col md={10}>
                                                <Input className="form-control" type="search" defaultValue="How do I shoot web" id="example-search-input" />
                                            </Col>
                                        </FormGroup>
                                        <FormGroup row>
                                            <Label htmlFor="example-email-input" className="col-md-2 col-form-label">Email</Label>
                                            <Col md={10}>
                                                <Input className="form-control" type="email" defaultValue="bootstrap@example.com"  id="example-email-input" />
                                            </Col>
                                        </FormGroup>
                                        <FormGroup row>
                                            <Label htmlFor="example-url-input" className="col-md-2 col-form-label">URL</Label>
                                            <Col md={10}>
                                                <Input className="form-control" type="url" defaultValue="https://getbootstrap.com"  id="example-url-input" />
                                            </Col>
                                        </FormGroup>
                                        <FormGroup row>
                                            <Label htmlFor="example-tel-input" className="col-md-2 col-form-label">Telephone</Label>
                                            <Col md={10}>
                                                <Input className="form-control" type="tel" defaultValue="1-(555)-555-5555"  id="example-tel-input" />
                                            </Col>
                                        </FormGroup>
                                        <FormGroup row>
                                            <Label htmlFor="example-password-input" className="col-md-2 col-form-label">Password</Label>
                                            <Col md={10}>
                                                <Input className="form-control" type="password" defaultValue="hunter2"  id="example-password-input"/>
                                            </Col>
                                        </FormGroup>
                                        <FormGroup row>
                                            <Label htmlFor="example-number-input" className="col-md-2 col-form-label">Number</Label>
                                            <Col md={10}>
                                                <Input className="form-control" type="number" defaultValue="42" id="example-number-input" />
                                            </Col>
                                        </FormGroup>
                                        <FormGroup row>
                                            <Label htmlFor="example-datetime-local-input" className="col-md-2 col-form-label">Date and time</Label>
                                            <Col md={10}>
                                                <Input className="form-control" type="datetime-local" defaultValue="2020-03-14T13:45:00" id="example-datetime-local-input" />
                                            </Col>
                                        </FormGroup>
                                        <FormGroup row>
                                            <Label htmlFor="example-date-input" className="col-md-2 col-form-label">Date</Label>
                                            <Col md={10}>
                                                <Input className="form-control" type="date" defaultValue="2020-03-19" id="example-date-input" />
                                            </Col>
                                        </FormGroup>
                                        <FormGroup row>
                                            <Label htmlFor="example-month-input" className="col-md-2 col-form-label">Month</Label>
                                            <Col md={10}>
                                                <Input className="form-control" type="month" defaultValue="2020-03" id="example-month-input" />
                                            </Col>
                                        </FormGroup>
                                        <FormGroup row>
                                            <Label htmlFor="example-week-input" className="col-md-2 col-form-label">Week</Label>
                                            <Col md={10}>
                                                <Input className="form-control" type="week" defaultValue="2020-W14" id="example-week-input" />
                                            </Col>
                                        </FormGroup>
                                        <FormGroup row>
                                            <Label htmlFor="example-time-input" className="col-md-2 col-form-label">Time</Label>
                                            <Col md={10}>
                                                <Input className="form-control" type="time" defaultValue="13:45:00" id="example-time-input" />
                                            </Col>
                                        </FormGroup>
                                        <FormGroup row>
                                            <Label htmlFor="example-color-input" className="col-md-2 col-form-label">Color</Label>
                                            <Col md={10}>
                                                <Input className="form-control" type="color" defaultValue="#5438dc" id="example-color-input" />
                                            </Col>
                                        </FormGroup>
                                        <FormGroup row>
                                            <Label className="col-md-2 col-form-label">Select</Label>
                                            <Col md={10}>
                                                <select className="form-control">
                                                    <option>Select</option>
                                                    <option>Large select</option>
                                                    <option>Small select</option>
                                                </select>
                                            </Col>
                                        </FormGroup>
                                        <FormGroup row className="mb-0">
                                            <Label className="col-md-2 col-form-label">Custom Select</Label>
                                            <Col md={10}>
                                                <select className="custom-select">
                                                    <option defaultValue>Open this select menu</option>
                                                    <option value="1">One</option>
                                                    <option value="2">Two</option>
                                                    <option value="3">Three</option>
                                                </select>
                                            </Col>
                                        </FormGroup>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>

                        <Row>
                            <Col lg={6}>
                                <Card>
                                    <CardBody>
                                        <h4 className="card-title">Sizing</h4>
                                        <p className="card-title-desc">Set heights using classNames like <code>.form-control-lg</code> and <code>.form-control-sm</code>.</p>
                                        <div>
                                            <div className="mb-4">
                                                <Input className="form-control" type="text" placeholder="Default input" />
                                            </div>
                                            <div className="mb-4">
                                                <Input className="form-control" size="sm" type="text" placeholder=".form-control-sm" />
                                            </div>
                                            <div>
                                                <Input className="form-control" size="lg" type="text" placeholder=".form-control-lg" />
                                            </div>
                                        </div>
                                    </CardBody>
                                </Card>
                            </Col>
                            <Col lg={6}>
                                <Card>
                                    <CardBody>
                                        <h4 className="card-title">Range Inputs</h4>
                                        <p className="card-title-desc">Set horizontally scrollable range inputs using <code>.form-control-range</code>.</p>

                                        <div>
                                            <h5 className="font-size-14">Example</h5>
                                            <input type="range" className="form-control-range" id="formControlRange" />
                                        </div>
                                        <div className="mt-4">
                                            <h5 className="font-size-14">Custom Range</h5>
                                            <CustomInput  type="range" id="customRange1" />
                                            <CustomInput  type="range" className="mt-4" min="0" max="5" id="customRange2" />
                                        </div>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>

                        <Row>
                            <Col lg={6}>
                                <Card>
                                    <CardBody>
                                        <h4 className="card-title  mb-4">Checkboxes</h4>

                                        <Row>
                                            <Col md={5}>
                                                <div>
                                                    <h5 className="font-size-14 mb-4">Default Checkboxes</h5>
                                                    <div className="form-check mb-3">
                                                        <Input className="form-check-input" type="checkbox" value="" id="defaultCheck1" />
                                                        <Label className="form-check-label" htmlFor="defaultCheck1">
                                                            Default checkbox
                                                        </Label>
                                                    </div>
                                                    <div className="form-check form-check-right">
                                                        <Input className="form-check-input" type="checkbox" value="" id="defaultCheck2" defaultChecked />
                                                        <Label className="form-check-label" htmlFor="defaultCheck2">
                                                            Default checkbox Right
                                                        </Label>
                                                    </div>
                                                </div>
                                            </Col>
                                            <Col md={6} className="ml-auto">
                                                <div className="mt-4 mt-lg-0">
                                                    <h5 className="font-size-14 mb-4">Custom Checkboxes</h5>
                                                    <div className="custom-control custom-checkbox mb-3">
                                                        <Input type="checkbox" className="custom-control-input" id="CustomCheck1" onChange={() => false} checked={this.state.customchk} />
                                                        <Label className="custom-control-label" onClick={() => { this.setState({ customchk: !this.state.customchk }) }} >Custom checkbox</Label>
                                                    </div>

                                                    <div className="custom-control custom-checkbox custom-control-right">
                                                        <Input type="checkbox" className="custom-control-input" id="customCheck2" />
                                                        <Label className="custom-control-label" htmlFor="customCheck2">Custom checkbox Right</Label>
                                                    </div>
                                                </div>
                                            </Col>
                                        </Row>
                                    </CardBody>
                                </Card>
                            </Col>
                            <Col lg={6}>
                                <Card>
                                    <CardBody>
                                        <h4 className="card-title  mb-4">Radios</h4>

                                        <Row>
                                            <Col md={5}>
                                                <div>
                                                    <h5 className="font-size-14 mb-4">Default Radios</h5>
                                                    <div className="form-check mb-3">
                                                        <Input className="form-check-input" type="radio" name="exampleRadios" id="exampleRadios1" value="option1" defaultChecked />
                                                        <Label className="form-check-label" htmlFor="exampleRadios1">
                                                            Default radio
                                                        </Label>
                                                    </div>
                                                    <div className="form-check form-check-right">
                                                        <Input className="form-check-input" type="radio" name="exampleRadios" id="exampleRadios2" value="option2" />
                                                        <Label className="form-check-label" htmlFor="exampleRadios2">
                                                            Default radio Right
                                                        </Label>
                                                    </div>
                                                </div>
                                            </Col>
                                            <Col md={6} className="ml-auto">
                                                <div className="mt-4 mt-lg-0">
                                                    <h5 className="font-size-14 mb-4">Custom Radios</h5>
                                                    <div className="custom-control custom-radio mb-3">
                                                        <Input type="radio" id="customRadio1" name="customRadio" className="custom-control-input" />
                                                        <Label className="custom-control-label" htmlFor="customRadio1">Toggle this custom radio</Label>
                                                    </div>
                                                    <div className="custom-control custom-radio custom-control-right">
                                                        <Input type="radio" id="customRadio2" name="customRadio" className="custom-control-input" defaultChecked />
                                                        <Label className="custom-control-label" htmlFor="customRadio2">Or toggle this Right custom radio</Label>
                                                    </div>
                                                </div>
                                            </Col>
                                        </Row>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>

                        <Row>
                            <Col lg={6}>
                                <Card>
                                    <CardBody>
                                        <h4 className="card-title">Switches</h4>
                                        <p className="card-title-desc">A switch has the markup of a custom checkbox but uses the <code>.custom-switch</code> className to render a toggle switch. Switches also support the <code>disabled</code> attribute.</p>

                                        <div className="custom-control custom-switch mb-2" dir="ltr">
                                            <Input type="checkbox" className="custom-control-input" id="customSwitch1" defaultChecked />
                                            <Label className="custom-control-label" htmlFor="customSwitch1" onClick={(e) => { this.setState({ toggleSwitch: !this.state.toggleSwitch }) }}>Toggle this switch element</Label>
                                        </div>
                                        <div className="custom-control custom-switch" dir="ltr">
                                            <Input type="checkbox" className="custom-control-input" disabled id="customSwitch2" />
                                            <Label className="custom-control-label" htmlFor="customSwitch2">Disabled switch element</Label>
                                        </div>

                                    </CardBody>
                                </Card>
                            </Col>

                            <Col lg={6}>
                                <Card>
                                    <CardBody>
                                        <h4 className="card-title">File browser</h4>
                                        <p className="card-title-desc">The file input is the most gnarly of the bunch and requires additional JavaScript if you’d like to hook them up with functional <em>Choose file…</em> and selected file name text.</p>
                                        <div className="custom-file">
                                            <CustomInput type="file" className="custom-file-input" id="customFile" />
                                            <Label className="custom-file-label" htmlFor="customFile">Choose file</Label>
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

export default FormElements;
