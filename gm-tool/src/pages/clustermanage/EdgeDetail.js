import React, { Component, useEffect } from "react";

import { TabContent, TabPane, NavLink, NavItem, Collapse, CardText, Nav, Card, Row, Col, CardBody, Container, Table, CardHeader, Dropdown, DropdownMenu, DropdownItem, DropdownToggle, Modal, ModalHeader, ModalBody, Form, Input, Label, FormGroup, Button } from "reactstrap";
import { MDBDataTable } from "mdbreact";
import { observer } from "mobx-react";
import { Link } from "react-router-dom";
import FormXeditable from "../Forms/FormXeditable";
//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";

import classnames from "classnames";

// import EarningReports from "../Dashboard/EarningReports"
import store from "../../store/Monitor/store/Store"
import EdgeDetailMeta from "./EdgeDetailMeta"
import EdgeDetailNode from "./EdgeDetailNode"
import EdgeDetailEvent from "./EdgeDetailEvent";
import EdgeDetailResource from "./EdgeDetailResource";
import EdgeDetailInfo from "./EdgeDetailInfo";
import DetailMeta from "../../components/Common/DetailMeta";
import { makeStyles } from '@material-ui/core/styles';

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

const EdgeDetail = observer((props) => {

  const classes = useStyles();
  const { match } = props
  // console.log(match)
  const { callApiStore } = store;
  const [breadcrumbItems, setBreadcrumbItems] = React.useState([
    { title: "클러스터 관리", link: "#" },
    { title: "클라우드 엣지", link: "#" },
    { title: "상세 보기", link: "#" },
  ]);

  const [activeTabTop, setActiveTabTop] = React.useState("1")
  const [activeTabCont, setActiveTabCont] = React.useState("1")
  // const [activeTab2, setActiveTab2] = React.useState("9")
  // const [activeTab3, setActiveTab3] = React.useState("13")
  // const [customActiveTab, setCustomActiveTab] = React.useState("1")
  // const [activeTabJustify, setActiveTabJustify] = React.useState("5")
  const [col1, setCol1] = React.useState(false)
  // const [col2, setCol2] = React.useState(false)
  // const [col3, setCol3] = React.useState(false)
  // const [col5, setCol5] = React.useState(true)
  // const [projectType, setProjectType] = React.useState()


  useEffect(() => {

    callApiStore.getClusterDetail("clusters", match.params.name);
    return () => {
    }
  }, [])

  const toggleTop = (tab) => {
    if (activeTabTop !== tab) {
      setActiveTabTop(tab)
    }
  }

  const toggleCont = (tab) => {
    if (activeTabCont !== tab) {
      setActiveTabCont(tab)
    }
  }

  const t_col1 = () => {
    setCol1(!col1)
  }
  let clusterMasterData = []
  if (callApiStore.clusterDetailMaster == undefined || clusterMasterData.length < 0) {
    clusterMasterData = []
  } else {
    clusterMasterData = callApiStore.clusterDetailMaster
  }
  // const clusterMasterData = callApiStore.clusterDetailMaster
  const clusterWorkerData = callApiStore.clusterDetailWorker

  let events = []
  let labels = [];
  let annotations = [];
  let resource = {};

  if (clusterMasterData.length != 0) {
    events = clusterMasterData[0].events
    labels = clusterMasterData[0].lables
    annotations = clusterMasterData[0].annotations
    resource = clusterMasterData[0].resource
  }

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="클라우드 엣지 관리" breadcrumbItems={breadcrumbItems} />

          <Row>
            <Col lg={4}>
              <Card className="checkout-order-summary">
                <CardBody>
                  {/* <div className="p-3 bg-light mb-4"> */}
                  <h5 className="text-dark font-weight-bold">{match.params.name}</h5>
                  <Row>
                    <Col sm={6}>

                    </Col>
                  </Row>

                  <div className="table-responsive">
                    <EdgeDetailInfo clusterMasterData={clusterMasterData} />
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col lg={8}>
              <Card>
                <CardBody>
                  <Nav pills className="navtab-bg nav-justified">
                    <NavItem>
                      <NavLink
                        style={{ cursor: "pointer" }}
                        className={classnames({
                          active: activeTabTop === "1"
                        })}
                        onClick={() => {
                          toggleTop("1");
                        }}
                      >
                        리소스 상태
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        style={{ cursor: "pointer" }}
                        className={classnames({
                          active: activeTabTop === "2"
                        })}
                        onClick={() => {
                          toggleTop("2");
                        }}
                      >
                        노드 정보
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        style={{ cursor: "pointer" }}
                        className={classnames({
                          active: activeTabTop === "3"
                        })}
                        onClick={() => {
                          toggleTop("3");
                        }}
                      >
                        메타데이터
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        style={{ cursor: "pointer" }}
                        className={classnames({
                          active: activeTabTop === "4"
                        })}
                        onClick={() => {
                          toggleTop("4");
                        }}
                      >
                        이벤트
                      </NavLink>
                    </NavItem>
                  </Nav>
                  {/* 리소스 상태 탭 내용 */}
                  <TabContent activeTab={activeTabTop}>
                    <TabPane tabId="1" className="p-3">
                      <EdgeDetailResource resource={resource} />
                    </TabPane>
                  </TabContent>

                  <TabContent activeTab={activeTabTop}>
                    <TabPane tabId="2" className="p-3">
                      <EdgeDetailNode clusterWorkerData={clusterWorkerData} />
                    </TabPane>
                  </TabContent>

                  <TabContent activeTab={activeTabTop}>
                    <TabPane tabId="3" className="p-3">

                      {Object.keys(clusterMasterData).length !== 0 ? <DetailMeta data={clusterMasterData[0]} /> : <></>}
                      {/* <EdgeDetailMeta labels={labels} annotations={annotations} /> */}
                    </TabPane>
                  </TabContent>
                  <TabContent activeTab={activeTabTop}>
                    <TabPane tabId="4" className="p-3">
                      <EdgeDetailEvent events={events} />

                    </TabPane>
                  </TabContent>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  )
})

export default EdgeDetail;

// class EdgeDetail extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       breadcrumbItems: [
//         // { title: "UI Elements", link: "#" },
//         // { title: "Tabs & Accordions", link: "#" },
//       ],
//       apilistinfo: [],
//       metainfo: [],
//       testinfo: [],
//       activeTab: "1",
//       activeTab1: "5",
//       activeTab2: "9",
//       activeTab3: "13",
//       customActiveTab: "1",
//       activeTabJustify: "5",
//       col1: true,
//       col2: false,
//       col3: false,
//       col5: true,
//     };
//     this.toggle = this.toggle.bind(this);
//     this.toggle1 = this.toggle1.bind(this);

//     this.t_col1 = this.t_col1.bind(this);
//     this.t_col2 = this.t_col2.bind(this);
//     this.t_col3 = this.t_col3.bind(this);
//     this.t_col5 = this.t_col5.bind(this);

//     this.toggle2 = this.toggle2.bind(this);
//     this.toggle3 = this.toggle3.bind(this);

//     this.toggleCustomJustified = this.toggleCustomJustified.bind(this);
//     this.toggleCustom = this.toggleCustom.bind(this);
//     this.loadApilist = this.loadApilist.bind(this);
//   }

//   t_col1() {
//     this.setState({ col1: !this.state.col1, col2: false, col3: false });
//   }
//   t_col2() {
//     this.setState({ col2: !this.state.col2, col1: false, col3: false });
//   }
//   t_col3() {
//     this.setState({ col3: !this.state.col3, col1: false, col2: false });
//   }
//   t_col5() {
//     this.setState({ col5: !this.state.col5 });
//   }

//   toggle(tab) {
//     if (this.state.activeTab !== tab) {
//       this.setState({
//         activeTab: tab,
//       });
//     }
//   }
//   toggle1(tab) {
//     if (this.state.activeTab1 !== tab) {
//       this.setState({
//         activeTab1: tab,
//       });
//     }
//   }
//   toggle2(tab) {
//     if (this.state.activeTab2 !== tab) {
//       this.setState({
//         activeTab2: tab,
//       });
//     }
//   }
//   toggle3(tab) {
//     if (this.state.activeTab3 !== tab) {
//       this.setState({
//         activeTab3: tab,
//       });
//     }
//   }

//   toggleCustomJustified(tab) {
//     if (this.state.activeTabJustify !== tab) {
//       this.setState({
//         activeTabJustify: tab,
//       });
//     }
//   }

//   toggleCustom(tab) {
//     if (this.state.customActiveTab !== tab) {
//       this.setState({
//         customActiveTab: tab,
//       });
//     }
//   }

//   loadApilist() {
//     const { params } = this.props.match;
//     // console.log(this.props.username)
//     let link = "/cluster/" + params.name;
//     console.log(link, "link");
//     let test = getDetailAPI(link, "GET");
//     console.log(test);
//     return test;
//   }
//   // componentDidMount() {
//   //     const test = this.loadApilist()
//   //     console.log(test, "test");
//   //     this.setState({
//   //         apilistinfo: test
//   //     })

//   // }
//   componentDidMount() {
//     let data = [];
//     this.loadApilist().then((res) => {
//       console.log(res, "res");
//       // data = JSON.stringify(res)
//       // data = JSON.parse(data);
//       data.push(res);
//       console.log(data, "data");
//       this.setState({
//         apilistinfo: data,
//       });
//     });
//   }

//   render() {
//     const apilistinfo = this.state.apilistinfo;
//     const { params } = this.props.match;
//     let apitoData = [];
//     console.log(this.state.apilistinfo, "serviceDetail");
//     let dataFromApi = apilistinfo.map((list) => {
//       console.log(list, "list");
//       console.log(list.metadata, "metadata");
//       console.log(list.status.capacity.cpu, "component");
//       return {
//         name: list.metadata.name,
//         osImage: list.status.nodeInfo.osImage,
//         kernelVersion: list.status.nodeInfo.kernelVersion,
//         kubeProxyVersion: list.status.nodeInfo.kubeProxyVersion,
//         operatingSystem: list.status.nodeInfo.operatingSystem,
//         architecture: list.status.nodeInfo.architecture,
//         creationTimestamp: list.metadata.creationTimestamp
//       };
//     });
//     apitoData = dataFromApi;
//     console.log(apitoData, "apitoData");

//     return (
//       <React.Fragment>
//         <div className="page-content">
//           <Container fluid>
//             <Breadcrumbs
//               title="클러스터 상세정보"
//               breadcrumbItems={this.state.breadcrumbItems}
//             />

//             <Row>
//               <Col lg={4}>
//                 <Card className="checkout-order-summary">
//                   <CardBody>
//                     <h5 className="text-dark font-weight-bold">
//                       {params.name}
//                     </h5>
//                     <Card></Card>
//                     <Row>
//                       <div>
//                         <Link
//                           onClick={() =>
//                             this.setState({ isModal: !this.state.modal })
//                           }
//                           to="#"
//                           className="popup-form btn btn-primary"
//                         >
//                           정보수정
//                         </Link>
//                       </div>

//                       <Modal
//                         size="xl"
//                         isOpen={this.state.isModal}
//                         centered={true}
//                         toggle={() =>
//                           this.setState({ isModal: !this.state.isModal })
//                         }
//                       >
//                         <ModalHeader
//                           toggle={() =>
//                             this.setState({ isModal: !this.state.isModal })
//                           }
//                         >
//                           {params.name}
//                         </ModalHeader>
//                         <ModalBody>
//                           <Form>
//                             <Row>
//                               <Col lg={4}>
//                                 <FormGroup>
//                                   <Label htmlFor="name">{params.name}</Label>
//                                   <Input
//                                     type="text"
//                                     className="form-control"
//                                     id="name"
//                                     placeholder="Enter Name"
//                                     required
//                                   />
//                                 </FormGroup>
//                               </Col>
//                               <Col lg={4}>
//                                 <FormGroup>
//                                   <Label htmlFor="email">Email</Label>
//                                   <Input
//                                     type="email"
//                                     className="form-control"
//                                     id="email"
//                                     placeholder="Enter Email"
//                                     required
//                                   />
//                                 </FormGroup>
//                               </Col>
//                               <Col lg={4}>
//                                 <FormGroup>
//                                   <Label htmlFor="password">Password</Label>
//                                   <Input
//                                     type="text"
//                                     className="form-control"
//                                     id="password"
//                                     placeholder="Enter Password"
//                                     required
//                                   />
//                                 </FormGroup>
//                               </Col>
//                             </Row>
//                             <Row>
//                               <Col lg={12}>
//                                 <FormGroup>
//                                   <Label htmlFor="subject">Subject</Label>
//                                   <textarea
//                                     className="form-control"
//                                     id="subject"
//                                     rows="3"
//                                   ></textarea>
//                                 </FormGroup>
//                               </Col>
//                             </Row>
//                             <Row>
//                               <Col lg={12}>
//                                 <div className="text-right">
//                                   <Button type="submit" color="primary">
//                                     Submit
//                                   </Button>
//                                 </div>
//                               </Col>
//                             </Row>
//                           </Form>
//                         </ModalBody>
//                       </Modal>
//                       <Col sm={3}>
//                         {/* 정보 수정 */}
//                         {/* 더보기 */}

//                         <Dropdown
//                           isOpen={this.state.singlebtn}
//                           toggle={() =>
//                             this.setState({ singlebtn: !this.state.singlebtn })
//                           }
//                         >
//                           <DropdownToggle color="primary" caret>
//                             더보기 <i className="mdi mdi-chevron-down"></i>
//                           </DropdownToggle>
//                           <DropdownMenu>
//                             <DropdownItem>수정(YAML)</DropdownItem>
//                             <DropdownItem>삭제</DropdownItem>
//                           </DropdownMenu>
//                         </Dropdown>
//                       </Col>
//                     </Row>
//                     {/* </div> */}
//                     <div className="table-responsive">
//                       <Table responsive className="mb-0">
//                         <thead>
//                           <tr>
//                             <th style={{ width: "100%" }}>상세정보</th>
//                             {/* <th>Examples</th> */}
//                           </tr>
//                         </thead>
//                         <tbody>
//                           {/* {apitoData.map((test) => (
//                             <tr key={test.name}>
//                               <td>kubeProxyVersion</td>
//                               <td>{test.kubeProxyVersion}</td>
//                             </tr>
//                           ))}
//                           {apitoData.map(({ machineID, kernelVersion, osImage }) => (
//                             <tr >
//                               <td>상태</td>
//                               <td>{osImage}</td>
//                             </tr>


//                           ))} */}


//                           <tr>
//                             <td>Status</td>
//                             <td>{apitoData.name}</td>
//                           </tr>
//                           <tr>
//                             <td>IP</td>
//                             <td>프로젝트1</td>
//                           </tr>
//                           <tr>
//                             <td>Role</td>
//                             <td>Custom Creation (Virtual IP)</td>
//                           </tr>

//                           <tr>
//                             <td>OsImage</td>
//                             <td>bookinfo</td>
//                           </tr>

//                           <tr>
//                             <td>OperatingSystem</td>
//                             <td>10.43.99.54</td>
//                           </tr>
//                           <tr>
//                             <td>KernelVersion</td>
//                             <td>-</td>
//                           </tr>
//                           <tr>
//                             <td>Kubelet Version</td>
//                             <td>None</td>
//                           </tr>
//                           <tr>
//                             <td>Kube-Proxy Version</td>
//                             <td>

//                             </td>
//                           </tr>
//                           <tr>
//                             <td>Architecture</td>
//                             <td></td>
//                           </tr>
//                           <tr>
//                             <td>Created</td>
//                             <td>10.42.0.221:9080</td>
//                           </tr>

//                         </tbody>

//                       </Table>
//                     </div>
//                   </CardBody>
//                 </Card>
//               </Col>
//               <Col lg={8}>
//                 <Card>
//                   <CardBody>
//                     <Nav pills className="navtab-bg nav-justified">
//                       <NavItem>
//                         <NavLink
//                           style={{ cursor: "pointer" }}
//                           className={classnames({
//                             active: this.state.activeTab1 === "5",
//                           })}
//                           onClick={() => {
//                             this.toggle1("5");
//                           }}
//                         >
//                           Overwiew
//                         </NavLink>
//                       </NavItem>
//                       <NavItem>
//                         <NavLink
//                           style={{ cursor: "pointer" }}
//                           className={classnames({
//                             active: this.state.activeTab1 === "6",
//                           })}
//                           onClick={() => {
//                             this.toggle1("6");
//                           }}
//                         >
//                           노드 정보
//                         </NavLink>
//                       </NavItem>
//                       <NavItem>
//                         <NavLink
//                           style={{ cursor: "pointer" }}
//                           className={classnames({
//                             active: this.state.activeTab1 === "7",
//                           })}
//                           onClick={() => {
//                             this.toggle1("7");
//                           }}
//                         >
//                           클러스터 대시보드
//                         </NavLink>
//                       </NavItem>
//                     </Nav>
//                     <TabContent activeTab={this.state.activeTab1}>
//                       <TabPane tabId="5" className="p-3">
//                         <Row>
//                           <Col sm="12">
//                             <CardText>
//                               <Overview />
//                             </CardText>
//                           </Col>
//                         </Row>
//                       </TabPane>
//                       <TabPane tabId="6" className="p-3">
//                         <Row>
//                           <Col sm="12">
//                             <CardText>
//                               <NodeList />
//                             </CardText>
//                           </Col>
//                         </Row>
//                       </TabPane>
//                       <TabPane tabId="7" className="p-3">
//                         <Row>
//                           <Col sm="12">
//                             <CardText>
//                               <RevenueAnalytics />
//                             </CardText>
//                           </Col>
//                         </Row>
//                       </TabPane>

//                       <TabPane tabId="8" className="p-3">
//                         <Row>
//                           <Col sm="12">
//                             <CardText>
//                               <Row>
//                                 <Col lg="4">
//                                   <Detail />
//                                 </Col>
//                                 <Col lg="8">
//                                   {/* <EarningReports /> */}
//                                   <Resource />
//                                 </Col>
//                               </Row>
//                               {/* <FormXeditable /> */}
//                             </CardText>
//                           </Col>
//                         </Row>
//                       </TabPane>
//                     </TabContent>
//                   </CardBody>
//                 </Card>
//               </Col>
//             </Row>
//           </Container>
//         </div>
//       </React.Fragment>
//     );
//   }
// }

