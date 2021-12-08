import React, { Component } from "react";

import { Row, Col, Card, CardBody, FormGroup, Button, Label, Input, Container, CustomInput, InputGroup, Form, InputGroupAddon } from "reactstrap";
import { AvForm, AvField, AvInput } from "availity-reactstrap-validation";

//Import Breadcrumb
import Breadcrumbs from '../../components/Common/Breadcrumb';

class FormValidations extends Component {
  constructor(props) {
    super(props);
    this.state = {
      breadcrumbItems: [
        { title: "Forms", link: "#" },
        { title: "Form Validation", link: "#" },
      ],
      fnm: false,
      lnm: false,
      unm: false,
      city: false,
      stateV: false,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.changeHandeler.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    var fnm = document.getElementById("validationTooltip01").value;
    var lnm = document.getElementById("validationTooltip02").value;
    var unm = document.getElementById("validationTooltipUsername").value;
    var city = document.getElementById("validationTooltip03").value;
    var stateV = document.getElementById("validationTooltip04").value;
    document.getElementById("tooltipForm").classList.add("was-validated");

    if (fnm === "") { this.setState({ fnm: false }) }
    else { this.setState({ fnm: true }) }

    if (lnm === "") { this.setState({ lnm: false }) }
    else { this.setState({ lnm: true }) }

    if (unm === "") { this.setState({ unm: false }) }
    else { this.setState({ unm: true }) }

    if (city === "") { this.setState({ city: false }) }
    else { this.setState({ city: true }) }

    if (stateV === "") { this.setState({ stateV: false }) }
    else { this.setState({ stateV: true }) }

    var d1 = document.getElementsByName("validate");



    for (var i = 0; i < d1.length; i++) {
      d1[i].style.display = "block";
    }
    console.log(city)
  }

  //for change tooltip display propery
  changeHandeler(event, eleId) {
    if (event.target.value !== "")
      document.getElementById(eleId).style.display = "none";
    else
      document.getElementById(eleId).style.display = "block";
  }

  render() {
    return (
      <React.Fragment>
        <div className="page-content">
          <Container fluid={true}>



            <Breadcrumbs title="Form Validation" breadcrumbItems={this.state.breadcrumbItems} />
            <Row>
              <Col xl="6">
                <Card>
                  <CardBody>
                    <h4 className="card-title">React Validation - Normal</h4>
                    <p className="card-title-desc">Provide valuable, actionable feedback to your users with HTML5 form validation–available in all our supported browsers.</p>
                    <AvForm className="needs-validation" >
                      <Row>
                        <Col md="6">
                          <FormGroup>
                            <Label htmlFor="validationCustom01">First name</Label>
                            <AvField
                              name="firstname"
                              placeholder="First name"
                              type="text"
                              errorMessage="Enter First Name"
                              className="form-control"
                              validate={{ required: { value: true } }}
                              id="validationCustom01"
                            />
                          </FormGroup>
                        </Col>
                        <Col md="6">
                          <FormGroup>
                            <Label htmlFor="validationCustom02">Last name</Label>
                            <AvField
                              name="lastname"
                              placeholder="Last name"
                              type="text"
                              errorMessage="Enter Last name"
                              className="form-control"
                              validate={{ required: { value: true } }}
                              id="validationCustom02"
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col md="4">
                          <FormGroup>
                            <Label htmlFor="validationCustom03">City</Label>
                            <AvField
                              name="city"
                              placeholder="City"
                              type="text"
                              errorMessage=" Please provide a valid city."
                              className="form-control"
                              validate={{ required: { value: true } }}
                              id="validationCustom03"
                            />
                          </FormGroup>
                        </Col>
                        <Col md="4">
                          <FormGroup>
                            <Label htmlFor="validationCustom04">State</Label>
                            <AvField
                              name="state"
                              placeholder="State"
                              type="text"
                              errorMessage="Please provide a valid state."
                              className="form-control"
                              validate={{ required: { value: true } }}
                              id="validationCustom04"
                            />
                          </FormGroup>
                        </Col>
                        <Col md="4">
                          <FormGroup>
                            <Label htmlFor="validationCustom05">Zip</Label>
                            <AvField
                              name="zip"
                              placeholder="Zip Code"
                              type="text"
                              errorMessage=" Please provide a valid zip."
                              className="form-control"
                              validate={{ required: { value: true } }}
                              id="validationCustom05"
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col lg="12">
                          <FormGroup>
                            <AvInput tag={CustomInput} type="checkbox" label="Agree to terms and conditions" id="invalidCheck" name="condition" errorMessage="You must agree before submitting." validate={{ required: { value: true } }} />
                          </FormGroup>
                        </Col>
                      </Row>
                      <Button color="primary" type="submit">Submit form</Button>
                    </AvForm>
                  </CardBody>
                </Card>
              </Col>

              <Col xl="6">
                <Card>
                  <CardBody>
                    <h4 className="card-title">Bootstrap Validation (Tooltips)</h4>
                    <p className="card-title-desc">If your form layout allows it, you can swap the <code>.-feedback</code> classes for <code>.-tooltip</code> classes to display validation feedback in a styled tooltip.</p>
                    <Form className="needs-validation" method="post" id="tooltipForm" onSubmit={this.handleSubmit}>
                      <Row>
                        <Col md="4">
                          <FormGroup className="position-relative">
                            <Label htmlFor="validationTooltip01">First name</Label>
                            <Input type="text" className="form-control" id="validationTooltip01" placeholder="First name" onChange={(event) => this.changeHandeler(event, "validate1")} />

                            <div className={this.state.fnm === true ? "valid-tooltip" : "invalid-tooltip"} name="validate" id="validate1">
                              {this.state.fnm === true ? "Looks good!" : "Please Enter Valid First Name"}
                            </div>

                          </FormGroup>
                        </Col>
                        <Col md="4">
                          <FormGroup className="position-relative">
                            <Label htmlFor="validationTooltip02">Last name</Label>
                            <Input type="text" className="form-control" id="validationTooltip02" placeholder="Last name" onChange={(event) => this.changeHandeler(event, "validate2")} />
                            <div className={this.state.lnm === true ? "valid-tooltip" : "invalid-tooltip"} name="validate" id="validate2">
                              {this.state.lnm === true ? "Looks good!" : "Please Enter Valid Last Name"}
                            </div>
                          </FormGroup>
                        </Col>
                        <Col md="4">
                          <FormGroup className="position-relative">
                            <Label htmlFor="validationTooltipUsername">Username</Label>
                            <InputGroup>
                              <InputGroupAddon addonType="prepend">
                                <span className="input-group-text" id="validationTooltipUsernamePrepend">@</span>
                              </InputGroupAddon>
                              <Input type="text" className="form-control" id="validationTooltipUsername" placeholder="Username" onChange={(event) => this.changeHandeler(event, "validate3")} />
                              <div className={this.state.unm === true ? "valid-tooltip" : "invalid-tooltip"} name="validate" id="validate3">
                                {this.state.unm === true ? "Looks good!" : "Please choose a unique and valid username."}
                              </div>
                            </InputGroup>
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col md="6">
                          <FormGroup className="position-relative">
                            <Label htmlFor="validationTooltip03">City</Label>
                            <Input type="text" className="form-control" id="validationTooltip03" placeholder="City" onChange={(event) => this.changeHandeler(event, "validate4")} />
                            <div className={this.state.city === true ? "valid-tooltip" : "invalid-tooltip"} name="validate" id="validate4">
                              {this.state.city === true ? "Looks good!" : "Please choose a unique and valid username.Please provide a valid city."}
                            </div>
                          </FormGroup>
                        </Col>
                        <Col md="6">
                          <FormGroup className="position-relative">
                            <Label htmlFor="validationTooltip04">State</Label>
                            <Input type="text" className="form-control" id="validationTooltip04" placeholder="State" onChange={(event) => this.changeHandeler(event, "validate5")} />
                            <div className={this.state.stateV === true ? "valid-tooltip" : "invalid-tooltip"} name="validate" id="validate5">
                              {this.state.stateV === true ? "Looks good!" : "Please provide a valid state."}
                            </div>
                          </FormGroup>
                        </Col>
                      </Row>
                      <Button color="primary" type="submit">Submit form</Button>
                    </Form>
                  </CardBody>
                </Card>
              </Col>
            </Row>
            <Row>
              <Col lg={6}>
                <Card>
                  <CardBody>
                    <h4 className="card-title">Validation type</h4>
                    <p className="card-title-desc">
                      Parsley is a availity reactstrap validation. It helps you
                      provide your users with feedback on their form submission
                      before sending it to your server.
                    </p>

                    <AvForm>
                      <AvField
                        name="username"
                        label="Required  "
                        placeholder="Type Something"
                        type="text"
                        errorMessage="Enter Name"
                        validate={{ required: { value: true } }}
                      />
                      <Label>Equal To</Label>
                      <AvField
                        name="password"
                        type="text"
                        placeholder="Password"
                        errorMessage="Enter password"
                        validate={{ required: { value: true } }}
                      />
                      <AvField
                        name="password1"
                        type="text"
                        placeholder="Re-type Password"
                        errorMessage="Enter Re-password"
                        validate={{
                          required: { value: true },
                          match: { value: "password" }
                        }}
                      />
                      <AvField
                        name="email"
                        label="E-Mail  "
                        placeholder="Enter Valid Email"
                        type="email"
                        errorMessage="Invalid Email"
                        validate={{
                          required: { value: true },
                          email: { value: true }
                        }}
                      />
                      <AvField
                        name="digits"
                        label="Digits  "
                        placeholder="Enter Only Digits"
                        type="number"
                        errorMessage="Enter Only Digits"
                        validate={{
                          required: { value: true },
                          pattern: {
                            value: "^[0-9]+$",
                            errorMessage: "Only Digits"
                          }
                        }}
                      />
                      <AvField
                        name="number"
                        label="Number  "
                        placeholder="Enter Only number"
                        type="number"
                        errorMessage="Enter Only Number"
                        validate={{
                          required: { value: true },
                          pattern: {
                            value: "^[0-9]+$",
                            errorMessage: "Only Numbers"
                          }
                        }}
                      />
                      <AvField
                        name="alphanumeric"
                        label="Alphanumeric  "
                        placeholder="Enter Only alphanumeric value"
                        type="text"
                        errorMessage="Enter Only Alphanumeric"
                        validate={{
                          required: { value: true },
                          pattern: {
                            value: "^[0-9a-zA-Z]+$",
                            errorMessage: "Only Alphanumeric"
                          }
                        }}
                      />
                      <FormGroup className="mb-0">
                        <div>
                          <Button type="submit" color="primary" className="mr-1">
                            Submit
                          </Button>{" "}
                          <Button type="reset" color="secondary">
                            Cancel
                          </Button>
                        </div>
                      </FormGroup>
                    </AvForm>
                  </CardBody>
                </Card>
              </Col>

              <Col lg={6}>
                <Card>
                  <CardBody>
                    <h4 className="card-title">Range validation</h4>
                    <p className="card-title-desc">
                      Parsley is a availity reactstrap validation. It helps you
                      provide your users with feedback on their form submission
                      before sending it to your server.
                    </p>

                    <AvForm>
                      <AvField
                        name="Min_Length"
                        label="Min Length  "
                        placeholder="Min 6 chars"
                        type="number"
                        errorMessage="Min 6 chars."
                        validate={{
                          required: { value: true },
                          minLength: { value: 6, errorMessage: "Min 6 chars." }
                        }}
                      />
                      <AvField
                        name="Max_Length"
                        label="Max Length  "
                        placeholder="Max 6 chars"
                        type="number"
                        errorMessage="Max 6 chars."
                        validate={{
                          required: { value: true },
                          maxLength: { value: 6, errorMessage: "Max 6 chars." }
                        }}
                      />
                      <AvField
                        name="Range_Length"
                        label="Range Length  "
                        placeholder="Text between 5 - 10 chars length"
                        type="text"
                        errorMessage="range between 5 to 10"
                        validate={{
                          required: { value: true },
                          minLength: { value: 5 },
                          maxLength: { value: 10 }
                        }}
                      />
                      <AvField
                        name="Min_Value"
                        label="Min Value  "
                        placeholder="Min 6 Chars"
                        min={6}
                        type="text"
                        errorMessage="Min Value 6"
                        validate={{
                          required: { value: true },
                          min: { value: 6 }
                        }}
                      />
                      <AvField
                        name="Max_Value"
                        label="Max Value  "
                        placeholder="max 5 Chars"
                        max={6}
                        type="number"
                        errorMessage="Max Value 6"
                        validate={{
                          required: { value: true },
                          max: { value: 6 }
                        }}
                      />
                      <AvField
                        name="Range_Value"
                        label="Range Value  "
                        placeholder="This value should be between 6 and 100."
                        type="number"
                        errorMessage="range between 5 to 10"
                        validate={{
                          required: { value: true },
                          min: { value: 6 },
                          max: { value: 100 }
                        }}
                      />
                      <AvField
                        name="Regular_Exp"
                        label="Regular Exp  "
                        placeholder="Hex. Color"
                        type="number"
                        errorMessage="Hex Value"
                        validate={{
                          required: { value: true },
                          pattern: {
                            value: "^[#0-9]+$",
                            errorMessage: "Only Hex Value"
                          }
                        }}
                      />
                      <FormGroup className="mb-0">
                        <div>
                          <Button type="submit" color="primary" className="mr-1">
                            Submit
                          </Button>{" "}
                          <Button type="reset" color="secondary">
                            Cancel
                          </Button>
                        </div>
                      </FormGroup>
                    </AvForm>
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

export default FormValidations;
