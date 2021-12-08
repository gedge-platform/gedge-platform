import React, { Component } from "react";
import {
  Col, Row, Card, CardBody, Button, Dropdown, DropdownMenu, DropdownItem, DropdownToggle, ButtonDropdown ,Container, ButtonGroup
} from "reactstrap";

//Import Breadcrumb
import Breadcrumbs from '../../components/Common/Breadcrumb';

class UiDropdown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      breadcrumbItems : [
        { title : "UI Elements", link : "#" },
        { title : "Dropdowns", link : "#" },
      ],
    };
  }

  render() {
    return (
      <React.Fragment>
        <div className="page-content">
          <Container fluid={true}>

          <Breadcrumbs title="Dropdowns" breadcrumbItems={this.state.breadcrumbItems} />

            <Row>
              <Col xl={6}>
                <Card>
                  <CardBody>

                    <h4 className="card-title">Single button dropdowns</h4>
                   <p className="card-title-desc">Any single <code
                      className="highlighter-rouge">.btn</code> can be turned into a dropdown toggle with some markup changes. Here’s how you can put them to work with either <code className="highlighter-rouge">&lt;button&gt;</code> elements:</p>
                    <Row>
                      <Col sm={6}>
                        <Dropdown
                          isOpen={this.state.singlebtn}
                          toggle={() =>
                            this.setState({ singlebtn: !this.state.singlebtn })
                          }
                        >
                          <DropdownToggle color="primary" caret>
                            Dropdown button{" "}
                            <i className="mdi mdi-chevron-down"></i>
                          </DropdownToggle>
                          <DropdownMenu>
                            <DropdownItem>Action</DropdownItem>
                            <DropdownItem>Another action</DropdownItem>
                            <DropdownItem>Something else here</DropdownItem>
                          </DropdownMenu>
                        </Dropdown>
                        <Dropdown
                          isOpen={this.state.singlebtn}
                          toggle={() =>
                            this.setState({ singlebtn: !this.state.singlebtn })
                          }
                        >
                          <DropdownToggle color="primary" caret>
                            Dropdown button{" "}
                            <i className="mdi mdi-chevron-down"></i>
                          </DropdownToggle>
                          <DropdownMenu>
                            <DropdownItem>Action</DropdownItem>
                            <DropdownItem>Another action</DropdownItem>
                            <DropdownItem>Something else here</DropdownItem>
                          </DropdownMenu>
                        </Dropdown>
                      </Col>
                      <Col sm={6}>
                        <Dropdown
                          isOpen={this.state.singlebtn1}
                          toggle={() =>
                            this.setState({ singlebtn1: !this.state.singlebtn1 })
                          }
                        >
                          <DropdownToggle color="light" caret>
                            Dropdown Link <i className="mdi mdi-chevron-down"></i>
                          </DropdownToggle>
                          <DropdownMenu>
                            <DropdownItem>Action</DropdownItem>
                            <DropdownItem>Another action</DropdownItem>
                            <DropdownItem>Something else here</DropdownItem>
                          </DropdownMenu>
                        </Dropdown>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>

              <Col xl={6}>
                <Card>
                  <CardBody>
                    <h4 className="card-title">Variant</h4>
                   <p className="card-title-desc">The best part is you can do this with any button variant, too:</p>

                    <div className="">
                    <ButtonGroup className="mr-1 mt-2">
                      <Dropdown
                        isOpen={this.state.btnprimary1}
                        toggle={() =>
                          this.setState({ btnprimary1: !this.state.btnprimary1 })
                        }
                      >
                        <DropdownToggle tag="button" className="btn btn-primary">
                          Primary <i className="mdi mdi-chevron-down"></i>
                      </DropdownToggle>
                        <DropdownMenu>
                          <DropdownItem>Action</DropdownItem>
                          <DropdownItem>Another action</DropdownItem>
                          <DropdownItem>Something else here</DropdownItem>
                        </DropdownMenu>
                      </Dropdown>{" "}
                      </ButtonGroup>
                    &nbsp;
                    <ButtonGroup className="mr-1 mt-2">
                    <Dropdown
                        isOpen={this.state.btnlight1}
                        toggle={() =>
                          this.setState({ btnlight1: !this.state.btnlight1 })
                        }
                      >
                        <DropdownToggle tag="button" className="btn btn-light">
                          Light <i className="mdi mdi-chevron-down"></i>
                      </DropdownToggle>
                        <DropdownMenu>
                          <DropdownItem>Action</DropdownItem>
                          <DropdownItem>Another action</DropdownItem>
                          <DropdownItem>Something else here</DropdownItem>
                        </DropdownMenu>
                      </Dropdown>{" "}
                      </ButtonGroup>
                    &nbsp;
                    <ButtonGroup className="mr-1 mt-2">
                    <Dropdown
                        isOpen={this.state.btnsuccess1}
                        toggle={() =>
                          this.setState({ btnsuccess1: !this.state.btnsuccess1 })
                        }
                      >
                        <DropdownToggle tag="button" className="btn btn-success">
                          Success <i className="mdi mdi-chevron-down"></i>
                      </DropdownToggle>
                        <DropdownMenu>
                          <DropdownItem>Action</DropdownItem>
                          <DropdownItem>Another action</DropdownItem>
                          <DropdownItem>Something else here</DropdownItem>
                        </DropdownMenu>
                      </Dropdown>
                    &nbsp;</ButtonGroup>
                    <ButtonGroup className="mr-1 mt-2">
                    <Dropdown
                        isOpen={this.state.btnInfo1}
                        toggle={() =>
                          this.setState({ btnInfo1: !this.state.btnInfo1 })
                        }
                      >
                        <DropdownToggle tag="button" className="btn btn-info">
                          Info <i className="mdi mdi-chevron-down"></i>
                      </DropdownToggle>
                        <DropdownMenu>
                          <DropdownItem>Action</DropdownItem>
                          <DropdownItem>Another action</DropdownItem>
                          <DropdownItem>Something else here</DropdownItem>
                        </DropdownMenu>
                      </Dropdown>
                    &nbsp;
                    </ButtonGroup>
                    <ButtonGroup className="mr-1 mt-2">
                    <Dropdown
                        isOpen={this.state.btnWarning1}
                        toggle={() =>
                          this.setState({ btnWarning1: !this.state.btnWarning1 })
                        }
                      >
                        <DropdownToggle tag="button" className="btn btn-warning">
                          Warning <i className="mdi mdi-chevron-down"></i>
                      </DropdownToggle>
                        <DropdownMenu>
                          <DropdownItem>Action</DropdownItem>
                          <DropdownItem>Another action</DropdownItem>
                          <DropdownItem>Something else here</DropdownItem>
                        </DropdownMenu>
                      </Dropdown>
                      </ButtonGroup>
                    &nbsp;
                    <ButtonGroup className="mr-1 mt-2">
                    <Dropdown
                        isOpen={this.state.btnDanger1}
                        toggle={() =>
                          this.setState({ btnDanger1: !this.state.btnDanger1 })
                        }
                      >
                        <DropdownToggle tag="button" className="btn btn-danger">
                          Danger <i className="mdi mdi-chevron-down"></i>
                      </DropdownToggle>
                        <DropdownMenu>
                          <DropdownItem>Action</DropdownItem>
                          <DropdownItem>Another action</DropdownItem>
                          <DropdownItem>Something else here</DropdownItem>
                        </DropdownMenu>
                      </Dropdown>
                      </ButtonGroup>
                    </div>
                  </CardBody>
                </Card>
              </Col>
            </Row>


            <Row>
              <Col xl={6}>
                <Card>
                  <CardBody>
                    <h4 className="card-title">Split button dropdowns</h4>
                   <p className="card-title-desc">The best part is you can do this with any button variant, too:</p>

                    <div className="d-flex">
                      <ButtonGroup className="mb-2">
                        <ButtonDropdown
                          isOpen={this.state.drp_primary1}
                          toggle={() =>
                            this.setState({
                              drp_primary1: !this.state.drp_primary1
                            })
                          }
                        >
                          <Button id="caret" color="primary">
                            Primary
                        </Button>
                          <DropdownToggle caret color="primary">
                            <i className="mdi mdi-chevron-down"></i>
                          </DropdownToggle>
                          <DropdownMenu>
                            <DropdownItem header>Header</DropdownItem>
                            <DropdownItem disabled>Action</DropdownItem>
                            <DropdownItem>Another Action</DropdownItem>
                            <DropdownItem divider />
                            <DropdownItem>Another Action</DropdownItem>
                          </DropdownMenu>
                        </ButtonDropdown>
                      </ButtonGroup>
                    &nbsp;
                    <ButtonGroup className="mb-2">
                        <ButtonDropdown
                          isOpen={this.state.drp_secondary1}
                          toggle={() =>
                            this.setState({
                              drp_secondary1: !this.state.drp_secondary1
                            })
                          }
                        >
                          <Button id="caret" color="light">
                            Light
                        </Button>
                          <DropdownToggle caret color="light">
                            <i className="mdi mdi-chevron-down"></i>
                          </DropdownToggle>
                          <DropdownMenu>
                            <DropdownItem header>Header</DropdownItem>
                            <DropdownItem disabled>Action</DropdownItem>
                            <DropdownItem>Another Action</DropdownItem>
                            <DropdownItem divider />
                            <DropdownItem>Another Action</DropdownItem>
                          </DropdownMenu>
                        </ButtonDropdown>
                      </ButtonGroup>
                    &nbsp;
                    <ButtonGroup className="mb-2">
                        <ButtonDropdown
                          isOpen={this.state.drp_success1}
                          toggle={() =>
                            this.setState({
                              drp_success1: !this.state.drp_success1
                            })
                          }
                        >
                          <Button id="caret" color="success">
                            Success
                        </Button>
                          <DropdownToggle caret color="success">
                            <i className="mdi mdi-chevron-down"></i>
                          </DropdownToggle>
                          <DropdownMenu>
                            <DropdownItem header>Header</DropdownItem>
                            <DropdownItem disabled>Action</DropdownItem>
                            <DropdownItem>Another Action</DropdownItem>
                            <DropdownItem divider />
                            <DropdownItem>Another Action</DropdownItem>
                          </DropdownMenu>
                        </ButtonDropdown>
                      </ButtonGroup>
                    &nbsp;
                    <ButtonGroup className="mb-2">
                        <ButtonDropdown
                          isOpen={this.state.drp_info1}
                          toggle={() =>
                            this.setState({ drp_info1: !this.state.drp_info1 })
                          }
                        >
                          <Button id="caret" color="info">
                            Info
                        </Button>
                          <DropdownToggle caret color="info">
                            <i className="mdi mdi-chevron-down"></i>
                          </DropdownToggle>
                          <DropdownMenu>
                            <DropdownItem header>Header</DropdownItem>
                            <DropdownItem disabled>Action</DropdownItem>
                            <DropdownItem>Another Action</DropdownItem>
                            <DropdownItem divider />
                            <DropdownItem>Another Action</DropdownItem>
                          </DropdownMenu>
                        </ButtonDropdown>
                      </ButtonGroup>
                    &nbsp;

                  </div>

                    <ButtonGroup className="mb-2">
                      <ButtonDropdown
                        isOpen={this.state.drp_warning1}
                        toggle={() =>
                          this.setState({
                            drp_warning1: !this.state.drp_warning1
                          })
                        }
                      >
                        <Button id="caret" color="warning">
                          Warning
                        </Button>
                        <DropdownToggle caret color="warning">
                          <i className="mdi mdi-chevron-down"></i>
                        </DropdownToggle>
                        <DropdownMenu>
                          <DropdownItem header>Header</DropdownItem>
                          <DropdownItem disabled>Action</DropdownItem>
                          <DropdownItem>Another Action</DropdownItem>
                          <DropdownItem divider />
                          <DropdownItem>Another Action</DropdownItem>
                        </DropdownMenu>
                      </ButtonDropdown>
                    </ButtonGroup>
                    &nbsp;
                    <ButtonGroup className="mb-2">
                      <ButtonDropdown
                        isOpen={this.state.drp_danger1}
                        toggle={() =>
                          this.setState({
                            drp_danger1: !this.state.drp_danger1
                          })
                        }
                      >
                        <Button id="caret" color="danger">
                          Danger
                        </Button>
                        <DropdownToggle caret color="danger">
                          <i className="mdi mdi-chevron-down"></i>
                        </DropdownToggle>
                        <DropdownMenu>
                          <DropdownItem header>Header</DropdownItem>
                          <DropdownItem disabled>Action</DropdownItem>
                          <DropdownItem>Another Action</DropdownItem>
                          <DropdownItem divider />
                          <DropdownItem>Another Action</DropdownItem>
                        </DropdownMenu>
                      </ButtonDropdown>
                    </ButtonGroup>

                  </CardBody>
                </Card>
              </Col>

              <Col xl={6}>
                <Card>
                  <CardBody>
                    <h4 className="card-title">Sizing</h4>
                   <p className="card-title-desc"> Button dropdowns work with buttons of all sizes, including default and split dropdown buttons.</p>
                    <ButtonGroup className="mb-2">
                      <ButtonDropdown
                        isOpen={this.state.drp_secondary}
                        toggle={() =>
                          this.setState({
                            drp_secondary: !this.state.drp_secondary
                          })
                        }
                      >
                        <DropdownToggle
                          caret
                          color="primary"
                          size="lg"
                        >
                          Large button &nbsp;{" "}
                          <i className="mdi mdi-chevron-down"></i>
                        </DropdownToggle>
                        <DropdownMenu>
                          <DropdownItem disabled>Action</DropdownItem>
                          <DropdownItem>Another Action</DropdownItem>
                          <DropdownItem divider />
                          <DropdownItem>Another Action</DropdownItem>
                        </DropdownMenu>
                      </ButtonDropdown>
                    </ButtonGroup>{" "}
                  &nbsp;
                  <ButtonGroup className="mb-2">
                        <ButtonDropdown
                          isOpen={this.state.drp_light_large}
                          toggle={() =>
                            this.setState({
                              drp_light_large: !this.state.drp_light_large
                            })
                          }
                        >
                          <Button id="caret" color="light" size="lg">
                             Large Button
                        </Button>
                          <DropdownToggle caret color="light" size="lg">
                            <i className="mdi mdi-chevron-down"></i>
                          </DropdownToggle>
                          <DropdownMenu>
                            <DropdownItem header>Header</DropdownItem>
                            <DropdownItem disabled>Action</DropdownItem>
                            <DropdownItem>Another Action</DropdownItem>
                            <DropdownItem divider />
                            <DropdownItem>Another Action</DropdownItem>
                          </DropdownMenu>
                        </ButtonDropdown>
                      </ButtonGroup>
                  &nbsp;
                  <ButtonGroup className="mb-2">
                      <ButtonDropdown
                        isOpen={this.state.drp_secondary_sm}
                        toggle={() =>
                          this.setState({
                            drp_secondary_sm: !this.state.drp_secondary_sm
                          })
                        }
                      >
                        <DropdownToggle
                          caret
                          color="primary"
                          size="sm"
                        >
                          Small button &nbsp;{" "}
                          <i className="mdi mdi-chevron-down"></i>
                        </DropdownToggle>
                        <DropdownMenu>
                          <DropdownItem disabled>Action</DropdownItem>
                          <DropdownItem>Another Action</DropdownItem>
                          <DropdownItem divider />
                          <DropdownItem>Another Action</DropdownItem>
                        </DropdownMenu>
                      </ButtonDropdown>
                    </ButtonGroup>{" "}
                  &nbsp;
                  <ButtonGroup className="mb-2">
                        <ButtonDropdown
                          isOpen={this.state.drp_light_sm}
                          toggle={() =>
                            this.setState({
                              drp_light_sm: !this.state.drp_light_sm
                            })
                          }
                        >
                          <Button id="caret" color="light" size="sm">
                             Small Button
                        </Button>
                          <DropdownToggle caret color="light" size="sm">
                            <i className="mdi mdi-chevron-down"></i>
                          </DropdownToggle>
                          <DropdownMenu>
                            <DropdownItem header>Header</DropdownItem>
                            <DropdownItem disabled>Action</DropdownItem>
                            <DropdownItem>Another Action</DropdownItem>
                            <DropdownItem divider />
                            <DropdownItem>Another Action</DropdownItem>
                          </DropdownMenu>
                        </ButtonDropdown>
                      </ButtonGroup>{" "}
                  </CardBody>
                </Card>
              </Col>
            </Row>



            <Row>
              <Col xl={6}>
                <Card>
                  <CardBody>
                    <h4 className="card-title">Dropup variation</h4>
                   <p className="card-title-desc">Trigger dropdown menus above elements by adding <code className="highlighter-rouge">.dropup</code> to the parent element.</p>
                    <div className="d-flex">
                      <Dropdown
                        isOpen={this.state.dropup1}
                        direction="up"
                        toggle={() =>
                          this.setState({ dropup1: !this.state.dropup1 })
                        }
                      >
                        <DropdownToggle color="light">
                          Dropup <i className="mdi mdi-chevron-up"></i>
                        </DropdownToggle>
                        <DropdownMenu>
                          <DropdownItem>Action</DropdownItem>
                          <DropdownItem>Another action</DropdownItem>
                          <DropdownItem>Something else here</DropdownItem>
                        </DropdownMenu>
                      </Dropdown>
                    &nbsp;
                    <ButtonDropdown
                        direction="up"
                        isOpen={this.state.drp_up11}
                        toggle={() =>
                          this.setState({
                            drp_up11: !this.state.drp_up11
                          })
                        }
                      >
                        <Button id="caret" color="light">
                          Split dropup 
                      </Button>
                        <DropdownToggle caret color="light">
                        <i className="mdi mdi-chevron-up"></i>
                        </DropdownToggle>
                        <DropdownMenu>
                          <DropdownItem header>Header</DropdownItem>
                          <DropdownItem disabled>Action</DropdownItem>
                          <DropdownItem>Another Action</DropdownItem>
                          <DropdownItem divider />
                          <DropdownItem>Another Action</DropdownItem>
                        </DropdownMenu>
                      </ButtonDropdown>
                    </div>
                  </CardBody>
                </Card>
              </Col>

              <Col xl={6}>
                <Card>
                  <CardBody>
                    <h4 className="card-title">Menu alignment</h4>
                   <p className="card-title-desc">Add <code className="highlighter-rouge">.dropdown-menu-right</code> to a <code className="highlighter-rouge">.dropdown-menu</code> to right align the dropdown menu.</p>
                    <ButtonDropdown
                      isOpen={this.state.drop_align}
                      direction="right"
                      toggle={() =>
                        this.setState({ drop_align: !this.state.drop_align })
                      }
                    >
                      <DropdownToggle
                        caret
                        color="secondary"
                        className="btn btn-secondary"
                      >
                        Menu is right-aligned{" "}
                        <i className="mdi mdi-chevron-down"></i>
                      </DropdownToggle>
                      <DropdownMenu className="dropdown-menu-right-custom">
                        <DropdownItem disabled>Action</DropdownItem>
                        <DropdownItem>Another Action</DropdownItem>
                        <DropdownItem divider />
                        <DropdownItem>Another Action</DropdownItem>
                      </DropdownMenu>
                    </ButtonDropdown>
                  </CardBody>
                </Card>
              </Col>
            </Row>


            <Row>
              <Col xl={6}>
                <Card>
                  <CardBody>
                    <h4 className="card-title">Dropright variation</h4>
                   <p className="card-title-desc">Trigger dropdown menus at the right of the elements by adding <code>.dropright</code> to the parent element.</p>

                    <div className="d-flex">
                      <Dropdown
                        isOpen={this.state.info_dropup1}
                        direction="right"
                        toggle={() =>
                          this.setState({
                            info_dropup1: !this.state.info_dropup1
                          })
                        }
                      >
                        <DropdownToggle color="light" caret>
                          Dropright <i className="mdi mdi-chevron-right"></i>
                        </DropdownToggle>
                        <DropdownMenu>
                          <DropdownItem>Action</DropdownItem>
                          <DropdownItem>Another action</DropdownItem>
                          <DropdownItem>Something else here</DropdownItem>
                        </DropdownMenu>
                      </Dropdown>
                    &nbsp;
                    <ButtonDropdown
                        direction="right"
                        isOpen={this.state.infodrp_up11}
                        toggle={() =>
                          this.setState({
                            infodrp_up11: !this.state.infodrp_up11
                          })
                        }
                      >
                        <Button id="caret" color="light">
                          Split dropright
                      </Button>
                        <DropdownToggle caret color="light">
                          <i className="mdi mdi-chevron-right"></i>
                        </DropdownToggle>
                        <DropdownMenu>
                          <DropdownItem header>Header</DropdownItem>
                          <DropdownItem disabled>Action</DropdownItem>
                          <DropdownItem>Another Action</DropdownItem>
                          <DropdownItem divider />
                          <DropdownItem>Another Action</DropdownItem>
                        </DropdownMenu>
                      </ButtonDropdown>
                    </div>
                  </CardBody>
                </Card>
              </Col>

              <Col xl={6}>
                <Card>
                  <CardBody>
                    <h4 className="card-title">Dropleft variation</h4>
                   <p className="card-title-desc">Trigger dropdown menus at the right of the elements by adding <code>.dropleft</code> to the parent element.</p>

                    <div className="d-flex">
                      <Dropdown
                        isOpen={this.state.info_dropup111}
                        direction="left"
                        toggle={() =>
                          this.setState({
                            info_dropup111: !this.state.info_dropup111
                          })
                        }
                      >
                        <DropdownToggle color="light">
                          <i className="mdi mdi-chevron-left"></i> Dropleft 
                        </DropdownToggle>
                        <DropdownMenu>
                          <DropdownItem>Action</DropdownItem>
                          <DropdownItem>Another action</DropdownItem>
                          <DropdownItem>Something else here</DropdownItem>
                        </DropdownMenu>
                      </Dropdown>
                    &nbsp;
                    <ButtonDropdown
                        direction="left"
                        isOpen={this.state.infodrp_up1111}
                        toggle={() =>
                          this.setState({
                            infodrp_up1111: !this.state.infodrp_up1111
                          })
                        }
                      >
                        
                        <DropdownToggle caret color="light">
                          <i className="mdi mdi-chevron-left"></i>
                        </DropdownToggle>
                        <Button id="caret" color="light">
                          Split dropleft
                        </Button>
                        <DropdownMenu>
                          <DropdownItem header>Header</DropdownItem>
                          <DropdownItem disabled>Action</DropdownItem>
                          <DropdownItem>Another Action</DropdownItem>
                          <DropdownItem divider />
                          <DropdownItem>Another Action</DropdownItem>
                        </DropdownMenu>
                      </ButtonDropdown>
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

export default UiDropdown;
