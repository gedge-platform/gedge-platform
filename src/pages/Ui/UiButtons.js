import React, { Component } from "react";
import { Link } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Button,
  ButtonToggle,
  ButtonGroup,
  ButtonToolbar,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  ButtonDropdown,
  Label,
  Input
} from "reactstrap";

//Import Breadcrumb
import Breadcrumbs from '../../components/Common/Breadcrumb';

class UiButtons extends Component {
  constructor(props) {
    super(props);
    this.state = {
      breadcrumbItems : [
        { title : "UI Elements", link : "#" },
        { title : "Buttons", link : "#" },
      ],
      check1 : true,
      check2 : false,
      check3 : false,
      radio1: true,
      radio2: false,
      radio3: false,
    };
  }

  render() {
    return (
      <React.Fragment>
        <div className="page-content">
          <Container fluid>

          <Breadcrumbs title="Buttons" breadcrumbItems={this.state.breadcrumbItems} />


            <Row>
              <Col xl={6}>
                <Card>
                  <CardBody>
                    <h4 className="card-title">Default buttons</h4>
                    <p className="card-title-desc">Bootstrap includes six predefined button styles, each serving its own semantic purpose.</p>
                    <div className="button-items">
                      <Button
                        color="primary"
                        className=" waves-effect waves-light mr-1"
                      >
                        Primary
                    </Button>
                      <Button
                        color="light"
                        className="waves-effect mr-1"
                      >
                        Light
                    </Button>
                      <Button
                        color="success"
                        className="waves-effect waves-light mr-1"
                      >
                        Success
                    </Button>
                      <Button
                        color="info"
                        className="waves-effect waves-light mr-1"
                      >
                        Info
                    </Button>
                      <Button
                        color="warning"
                        className=" waves-effect waves-light mr-1"
                      >
                        Warning
                    </Button>
                      <Button
                        color="danger"
                        className="waves-effect waves-light mr-1"
                      >
                        Danger
                    </Button>
                      <Button
                        color="dark"
                        className="waves-effect waves-light mr-1"
                      >
                        Dark
                    </Button>
                      <Button color="link" className="waves-effect mr-1">
                        Link
                    </Button>
                      <Button
                        color="secondary"
                        className="waves-effect"
                      >
                        Secondary
                    </Button>
                    </div>
                  </CardBody>
                </Card>
              </Col>
              <Col xl={6}>
                <Card>
                  <CardBody>
                    <h4 className="card-title">Outline buttons</h4>
                    <p className="card-title-desc">Add one another property like <code className="highlighter-rouge">outline</code> ones to remove all background images and colors on any button.</p>
                    <div className="button-items">
                      <Button
                        color="primary"
                        outline
                        className="waves-effect waves-light mr-1"
                      >
                        Primary
                    </Button>
                      <Button color="light" outline className="waves-effect mr-1">
                        Light
                    </Button>
                      <Button
                        color="success"
                        outline
                        className="waves-effect waves-light mr-1"
                      >
                        Success
                    </Button>
                      <Button
                        color="info"
                        outline
                        className="waves-effect waves-light mr-1"
                      >
                        Info
                    </Button>
                      <Button
                        color="warning"
                        outline
                        className="waves-effect waves-light mr-1"
                      >
                        Warning
                    </Button>
                      <Button
                        color="danger"
                        outline
                        className="waves-effect waves-light mr-1"
                      >
                        Danger
                    </Button>
                      <Button
                        color="dark"
                        outline
                        className="waves-effect waves-light mr-1"
                      >
                        Dark
                    </Button>
                      <Button color="secondary" outline className="waves-effect">
                        Secondary
                    </Button>
                    </div>
                  </CardBody>
                </Card>
              </Col>
            </Row>

            <Row>
              <Col xl={6}>
                <Card>
                  <CardBody>
                    <h4 className="card-title">Rounded buttons</h4>
                    <p className="card-title-desc">Use class <code>.btn-rounded</code> for button round border.</p>
                    <div className="button-items">
                    <Button
                        color="primary"
                        className="btn-rounded waves-effect waves-light mr-1"
                      >
                        Primary
                    </Button>
                      <Button
                        color="light"
                        className="btn-rounded waves-effect mr-1"
                      >
                        Light
                    </Button>
                      <Button
                        color="success"
                        className="btn-rounded waves-effect waves-light mr-1"
                      >
                        Success
                    </Button>
                      <Button
                        color="info"
                        className="btn-rounded waves-effect waves-light mr-1"
                      >
                        Info
                    </Button>
                      <Button
                        color="warning"
                        className="btn-rounded waves-effect waves-light mr-1"
                      >
                        Warning
                    </Button>
                      <Button
                        color="danger"
                        className="btn-rounded waves-effect waves-light mr-1"
                      >
                        Danger
                    </Button>
                      <Button
                        color="dark"
                        className="btn-rounded waves-effect waves-light mr-1"
                      >
                        Dark
                    </Button>
                      <Button color="link" className="waves-effect mr-1">
                        Link
                    </Button>
                      <Button
                        color="secondary"
                        className="btn-rounded waves-effect"
                      >
                        Secondary
                    </Button>
                    </div>
                    </CardBody>
                </Card>
              </Col>
              <Col xl={6}>
                <Card>
                  <CardBody>
                    <h4 className="card-title">Buttons with icon</h4>
                    <p className="card-title-desc">Add icon in button.</p>

                    <div className="button-items">
                      <Button color="primary" type="button" className="waves-effect waves-light mr-1">
                        Primary <i className="ri-arrow-right-line align-middle ml-2"></i> 
                                            </Button>
                      <Button color="success" type="button" className="waves-effect waves-light mr-1">
                      <i className="ri-check-line align-middle mr-2"></i> Success
                                            </Button>
                      <Button color="warning" type="button" className="waves-effect waves-light mr-1">
                        <i className="ri-error-warning-line align-middle mr-2"></i> Warning
                                            </Button>
                      <Button color="danger" type="button" className="waves-effect waves-light mr-1">
                      <i className="ri-close-line align-middle mr-2"></i> Danger
                                            </Button>
                    </div>
                  </CardBody>
                </Card>
              </Col>
            </Row>

            <Row>
              <Col xl={6}>
                <Card>
                  <CardBody>
                    <h4 className="card-title">Buttons Sizes</h4>
                    <p className="card-title-desc">Add Property size=""<code>lg</code> or <code>sm</code> for additional sizes.</p>

                    <div className="button-items">
                      <Button
                        color="primary"
                        size="lg"
                        className="waves-effect waves-light mr-1"
                      >
                        Large button
                    </Button>
                      <Button
                        color="light"
                        size="lg"
                        className="waves-effect mr-1"
                      >
                        Large button
                    </Button>
                      <Button
                        color="primary"
                        size="sm"
                        className="waves-effect waves-light mr-1"
                      >
                        Small button
                    </Button>
                      <Button
                        color="light"
                        size="sm"
                        className="waves-effect"
                      >
                        Small button
                    </Button>
                    </div>
                  </CardBody>
                </Card>
              </Col>

              <Col xl={6}>
                <Card>
                  <CardBody>
                    <h4 className="card-title">Buttons width</h4>
                    <p className="card-title-desc">Add <code>.w-xs</code>, <code>.w-sm</code>, <code>.w-md</code> and <code> .w-lg</code> className for additional buttons width.</p>

                    <div className="button-items">
                      <Button type="button" color="primary" className="w-xs waves-effect waves-light mr-1">Xs</Button>
                      <Button type="button" color="danger" className="w-sm waves-effect waves-light mr-1">Small</Button>
                      <Button type="button" color="warning" className="w-md waves-effect waves-light mr-1">Medium</Button>
                      <Button type="button" color="success" className="w-lg waves-effect waves-light">Large</Button>
                    </div>
                  </CardBody>
                </Card>
              </Col>
            </Row>

            <Row>
              <Col xl={6}>
                <Card>
                  <CardBody>

                    <h4 className="card-title">Button tags</h4>
                    <p className="card-title-desc">The <code className="highlighter-rouge">.btn</code>
                                            classes are designed to be used with the <code
                        className="highlighter-rouge">&lt;button&gt;</code> element.
                                            However, you can also use these classes on <code
                        className="highlighter-rouge">&lt;Link&gt;</code> or <code
                          className="highlighter-rouge">&lt;input&gt;</code> elements (though
                                            some browsers may apply a slightly different rendering).</p>

                    <div className="button-items">
                      <Link
                        className="btn btn-primary waves-effect waves-light"
                        to="#"
                        role="button"
                      >
                        Link
                    </Link>
                      <Button
                        color="success"
                        className="waves-effect waves-light mr-1"
                        type="submit"
                      >
                        Button
                    </Button>
                      <input
                        className="btn btn-info mr-1"
                        type="button"
                        value="Input"
                      />
                      <input
                        className="btn btn-danger mr-1"
                        type="submit"
                        value="Submit"
                      />
                      <input
                        className="btn btn-warning mr-1"
                        type="reset"
                        value="Reset"
                      />
                    </div>
                  </CardBody>
                </Card>
              </Col>
              <Col xl={6}>
                <Card>
                  <CardBody>

                    <h4 className="card-title">Toggle states</h4>
                    <p className="card-title-desc">Add <code className="highlighter-rouge">data-toggle="button"</code>
                                            to toggle a button’s <code className="highlighter-rouge">active</code>
                                            state. If you’re pre-toggling a button, you must manually add the <code
                        className="highlighter-rouge">.active</code> class
                                            <strong>and</strong> <code
                        className="highlighter-rouge">aria-pressed="true"</code> to the
                                            <code className="highlighter-rouge">&lt;button&gt;</code>.
                                        </p>

                    <div className="button-items">
                      <ButtonToggle
                        color="primary"
                        className="btn btn-primary waves-effect waves-light"
                      >
                        Single toggle
                    </ButtonToggle>
                    </div>
                  </CardBody>
                </Card>
              </Col>
            </Row>

            <Row>
              <Col xl={6}>
                <Card>
                  <CardBody>

                    <h4 className="card-title">Block Buttons</h4>
                    <p className="card-title-desc">Create block level buttons—those that span the full width of a parent—by adding property <code
                      className="highlighter-rouge">block</code>.</p>

                    <div className="button-items">
                      <Button
                        color="primary"
                        size="lg"
                        block
                        className="waves-effect waves-light"
                      >
                        Block level button
                    </Button>
                      <Button
                        color="light"
                        size="sm"
                        block
                        className="waves-effect"
                      >
                        Block level button
                    </Button>
                    </div>
                  </CardBody>
                </Card>

              </Col>

              <Col xl={6}>
                <Card>
                  <CardBody>

                    <h4 className="card-title">Checkbox & Radio Buttons</h4>
                    <p className="card-title-desc">Bootstrap’s <code
                      className="highlighter-rouge">.button</code> styles can be applied to
                                            other elements, such as <code className="highlighter-rouge">
                        &lt;label&gt;</code>s, to provide checkbox or radio style button
                                            toggling. Add <code
                        className="highlighter-rouge">data-toggle="buttons"</code> to a
                                            <code className="highlighter-rouge">.btn-group</code> containing those
                                            modified buttons to enable toggling in their respective styles.</p>

                    <Row>
                      <Col xl={6}>
                        <div
                          className="btn-group btn-group-toggle"
                          data-toggle="buttons"
                        >
                                        <Label
                                            className=
                                                {
                                                    this.state.check1
                                                    ? "btn btn-primary active"
                                                    : "btn btn-primary"
                                                }
                                        >
                                            <Input type="checkbox" defaultChecked
                                            onClick={() =>
                                                this.setState({
                                                    check1: !this.state.check1,
                                                })
                                            }  
                                                /> Checked-1
                                        </Label>

                                        <Label
                                            className=
                                                {
                                                    this.state.check2
                                                    ? "btn btn-primary active"
                                                    : "btn btn-primary"
                                                }
                                        >
                                            <Input type="checkbox"
                                            onClick={() =>
                                                this.setState({
                                                    check2: !this.state.check2,
                                                })
                                            }  
                                                /> Checked-2
                                        </Label>

                                        <Label
                                            className=
                                                {
                                                    this.state.check3
                                                    ? "btn btn-primary active"
                                                    : "btn btn-primary"
                                                }
                                        >
                                            <Input type="checkbox"
                                            onClick={() =>
                                                this.setState({
                                                    check3: !this.state.check3
                                                })
                                            }  
                                                /> Checked-3
                                        </Label>
                        </div>
                      </Col>
                      <Col xl={6}>
                        <div
                          className="btn-group btn-group-toggle"
                          data-toggle="buttons"
                        >
                          <Label
                                            className=
                                                {
                                                    this.state.radio1
                                                    ? "btn btn-light active"
                                                    : "btn btn-light"
                                                }
                                        >
                                            <Input type="radio" name="options" id="option1" defaultChecked
                                            onClick={() =>
                                                this.setState({
                                                    radio1: true,
                                                    radio2: false,
                                                    radio3: false
                                                })
                                            }  
                                                /> Active
                                        </Label>

                                        <Label
                                            className=
                                                {
                                                    this.state.radio2
                                                    ? "btn btn-light active"
                                                    : "btn btn-light"
                                                }
                                        >
                                            <Input type="radio" name="options" id="option1"
                                            onClick={() =>
                                                this.setState({
                                                    radio1: false,
                                                    radio2: true,
                                                    radio3: false
                                                })
                                            }  
                                                /> Radio
                                        </Label>

                                        <Label
                                            className=
                                                {
                                                    this.state.radio3
                                                    ? "btn btn-light active"
                                                    : "btn btn-light"
                                                }
                                        >
                                            <Input type="radio" name="options" id="option1"
                                            onClick={() =>
                                                this.setState({
                                                    radio1: false,
                                                    radio2: false,
                                                    radio3: true
                                                })
                                            }  
                                                /> Radio
                                        </Label>
                        </div>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
            </Row>

            <Row>
              <Col xl={6}>
                <Card>
                  <CardBody>

                    <h4 className="card-title">Button group</h4>
                    <p className="card-title-desc">Wrap a series of buttons with <code
                      className="highlighter-rouge">.btn</code> in <code
                        className="highlighter-rouge">.btn-group</code>.</p>

                    <Row>
                      <Col md={6}>
                        <ButtonGroup>
                          <Button color="primary" >
                            Left
                    </Button>
                          <Button color="primary" >
                            Middle
                    </Button>
                          <Button color="primary">
                            Right
                    </Button>
                        </ButtonGroup>
                      </Col>

                      <Col md={6}>
                        <div className="btn-group mt-4 mt-md-0" role="group" aria-label="Basic example">
                          <Button type="button" color="light"><i className="ri-menu-2-line"></i></Button>
                          <Button type="button" color="light"><i className="ri-menu-5-line"></i></Button>
                          <Button type="button" color="light"><i className="ri-menu-3-line"></i></Button>
                        </div>
                      </Col>
                    </Row>

                  </CardBody>
                </Card>
              </Col>
              <Col xl={6}>
                <Card>
                  <CardBody>

                    <h4 className="card-title">Button toolbar</h4>
                    <p className="card-title-desc">Combine sets of button groups into
                    button toolbars for more complex components. Use utility classNamees as
                                            needed to space out groups, buttons, and more.</p>

                    <ButtonToolbar >
                      <ButtonGroup>
                        <Button color="light">
                          1
                      </Button>
                        <Button color="light">
                          2
                      </Button>
                        <Button color="light">
                          3
                      </Button>
                        <Button color="light">
                          4
                      </Button>
                      </ButtonGroup>
                      <ButtonGroup className="ml-2">
                        <Button color="light">
                          5
                      </Button>
                        <Button color="light">
                          6
                      </Button>
                        <Button color="light" >
                          7
                      </Button>
                      </ButtonGroup>
                      <ButtonGroup className="ml-2">
                        <Button color="light" >
                          8
                      </Button>
                      </ButtonGroup>
                    </ButtonToolbar >
                  </CardBody>
                </Card>
              </Col>
            </Row>

            <Row>
              <Col xl={6}>
                <Card>
                  <CardBody>

                    <h4 className="card-title">Sizing</h4>
                    <p className="card-title-desc">Instead of applying button sizing
                                            classes to every button in a group, just add property size=""<code
                        className="highlighter-rouge">.btn-group-*</code> to each <code
                          className="highlighter-rouge">.btn-group</code>, including each one
                                            when nesting multiple groups.</p>

                    <ButtonGroup size="lg">
                      <Button color="primary">
                        Left
                    </Button>
                      <Button color="primary">
                        Middle
                    </Button>
                      <Button color="primary" >
                        Right
                    </Button>
                    </ButtonGroup>

                    <br />

                    <ButtonGroup className="mt-2">
                      <Button color="light" >
                        Left
                    </Button>
                      <Button color="light" >
                        Middle
                    </Button>
                      <Button color="light">
                        Right
                    </Button>
                    </ButtonGroup>

                    <br />

                    <ButtonGroup size="sm" className="mt-2">
                      <Button color="danger">
                        Left
                    </Button>
                      <Button color="danger">
                        Middle
                    </Button>
                      <Button color="danger" >
                        Right
                    </Button>
                    </ButtonGroup>

                  </CardBody>
                </Card>
              </Col>

              <Col xl={6}>
                <Card>
                  <CardBody>

                    <h4 className="card-title">Vertical variation</h4>
                    <p className="card-title-desc">Make a set of buttons appear vertically stacked rather than horizontally. Split button dropdowns are not supported here.</p>

                    <ButtonGroup vertical>
                      <Button
                        type="button"
                        color="light"
                      >
                        Button
                    </Button>

                      <ButtonDropdown
                        isOpen={this.state.drp_link}
                        toggle={() =>
                          this.setState({ drp_link: !this.state.drp_link })
                        }
                      >
                        <DropdownToggle caret color="light">
                          Dropdown <i className="mdi mdi-chevron-down"></i>
                        </DropdownToggle>
                        <DropdownMenu>
                          <DropdownItem>Dropdown link</DropdownItem>
                          <DropdownItem>Dropdown link</DropdownItem>
                        </DropdownMenu>
                      </ButtonDropdown>

                      <Button
                        color="light"
                        type="button"
                      >
                        Button
                    </Button>
                      <Button
                        color="light"
                        type="button"
                      >
                        Button
                    </Button>
                    </ButtonGroup>

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

export default UiButtons;
