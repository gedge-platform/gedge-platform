import React, { Component } from "react";
import {
  Container,
  Card,
  CardBody,
  Row,
  Col,
  Nav,
  NavItem,
  NavLink,
  UncontrolledTooltip,
  Input,
  Label,
  Button,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  ButtonDropdown,
  ButtonGroup,
} from "reactstrap";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch,
  useRouteMatch,
} from "react-router-dom";
import classnames from "classnames";
import "../workload/detail.css";
import { MDBDataTable } from "mdbreact";
// import "./datatables.scss";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";

class Applist extends Component {
  constructor(props) {
    super(props);
    this.state = {
      breadcrumbItems: [
        { title: "워크로드", link: "#" },
        { title: "앱", link: "#" },
      ],
      activeTab: "1",
    };
    this.toggleTab = this.toggleTab.bind(this);
  }

  toggleTab(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab,
      });
    }
  }

  componentDidMount() {
    document
      .getElementsByClassName("pagination")[0]
      .classList.add("pagination-rounded");
  }

  render() {
    const data = {
      columns: [
        {
          label: (
            <div className="custom-control custom-checkbox">
              {" "}
              <Input
                type="checkbox"
                className="custom-control-input"
                id="ordercheck"
              />
              <Label className="custom-control-label" htmlFor="ordercheck">
                &nbsp;
              </Label>
            </div>
          ),
          field: "checkbox",
          sort: "asc",
          width: 28,
        },
        {
          label: "이름",
          field: "id",
          sort: "asc",
          width: 78,
        },
        {
          label: "상태",
          field: "status",
          sort: "asc",
          width: 135,
        },
        {
          label: "앱",
          field: "appName",
          sort: "asc",
          width: 93,
        },
        {
          label: "버전",
          field: "appVersion",
          sort: "asc",
          width: 109,
        },
        {
          label: "마지막 업데이트",
          field: "updateTime",
          sort: "asc",
          width: 48,
        },

        // {
        //     label: "//invoice",
        //     field: "//invoice",
        //     sort: "asc",
        //     width: 110
        // },
        {
          label: "Action",
          field: "action",
          sort: "asc",
          width: 120,
        },
      ],
      rows: [
        {
          checkbox: (
            <div className="custom-control custom-checkbox">
              <Input
                type="checkbox"
                className="custom-control-input"
                id="ordercheck1"
              />
              <Label className="custom-control-label" htmlFor="ordercheck1">
                &nbsp;
              </Label>
            </div>
          ),
          id: (
            <Link to="/workload/app/default/1234" className="text-dark font-weight-bold">
              1234
            </Link>
          ),
          date: "04 Apr, 2020",
          billingName: "Walter Brown",
          total: "$172",
          status: (
            <div className="badge badge-soft-success font-size-12">running</div>
          ),
          //invoice: <Button className="btn-rounded" color="light">//invoice <i className="mdi mdi-download ml-2"></i></Button>,
          action: (
            <>
              <Link to="#" className="mr-3 text-primary" id="edit1">
                <i className="mdi mdi-pencil font-size-18"></i>
              </Link>
              <UncontrolledTooltip placement="top" target="edit1">
                Edit
              </UncontrolledTooltip>
              <Link to="#" className="text-danger" id="delete1">
                <i className="mdi mdi-trash-can font-size-18"></i>
              </Link>
              <UncontrolledTooltip placement="top" target="delete1">
                Delete
              </UncontrolledTooltip>
            </>
          ),
        },
      ],
    };
    return (
      <React.Fragment>
        <div className="page-content">
          <Container fluid>
            <Breadcrumbs
              title="앱"
              breadcrumbItems={this.state.breadcrumbItems}
            />

            <Row>
              <Col lg={12}>
                <Card>
                  <CardBody className="pt-0">
                    <Nav tabs className="nav-tabs-custom mb-4">
                      <NavItem>
                        <NavLink
                          onClick={() => {
                            this.toggleTab("1");
                          }}
                          className={classnames(
                            { active: this.state.activeTab === "1" },
                            "font-weight-bold p-3"
                          )}
                        >
                          All Project
                        </NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink
                          onClick={() => {
                            this.toggleTab("2");
                          }}
                          className={classnames(
                            { active: this.state.activeTab === "2" },
                            "p-3 font-weight-bold"
                          )}
                        >
                          Active
                        </NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink
                          onClick={() => {
                            this.toggleTab("3");
                          }}
                          className={classnames(
                            { active: this.state.activeTab === "3" },
                            " p-3 font-weight-bold"
                          )}
                        >
                          Unpaid
                        </NavLink>
                      </NavItem>
                    </Nav>
                    <Col sm={6}>
                      <div>

                        <Link
                          to="/workload/app/add"
                          onClick={() =>
                            this.setState({
                              modal_static: true,
                              isAlertOpen: false,
                            })
                          }
                          className="btn btn-success mb-2"
                        >
                          <i className="mdi mdi-plus mr-2"></i> 추가
                        </Link>
                      </div>

                      <Dropdown
                        isOpen={this.state.singlebtn}
                        toggle={() =>
                          this.setState({ singlebtn: !this.state.singlebtn })
                        }
                      >
                        <DropdownToggle color="primary" caret>
                          프로젝트 <i className="mdi mdi-chevron-down"></i>
                        </DropdownToggle>
                        <DropdownMenu>
                          <DropdownItem>프로젝트1</DropdownItem>
                        </DropdownMenu>
                      </Dropdown>
                    </Col>
                    <MDBDataTable responsive data={data} className="mt-4" />
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

export default Applist;
