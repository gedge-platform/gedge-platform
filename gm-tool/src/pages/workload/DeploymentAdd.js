import React, { Component, useEffect, useState } from "react";
import { Container, Card, CardBody, Row, NavItem, NavLink, TabPane, TabContent, Col, Form, FormGroup, Progress, Label, Input, InputGroup, Button, InputGroupAddon, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { Dropdown, Selection } from 'react-dropdown-now';
import { Link } from "react-router-dom";
import classnames from 'classnames';
import store from "../../store/Monitor/store/Store"
import { observer } from "mobx-react";

//Dropzone

//select

//
import "./detail.css";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/theme-monokai";

//Import Breadcrumb
import Breadcrumbs from '../../components/Common/Breadcrumb';
import { Description } from "@material-ui/icons";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

const DeploymentAdd2 = observer((props) => {
    const { callApiStore } = store;

    const [breadcrumbItems, setBreadcrumbItems] = React.useState([
        { title: "디플로이먼트", link: "#" },
        { title: "디플로이먼트 추가", link: "#" },
    ]);
    const [name, setName] = React.useState("")
    const [description, setDescription] = React.useState("")
    const [workspace, setWorkspace] = React.useState("")
    const [project, setProject] = React.useState("")
    const [cluster, setCluster] = React.useState("")

    const [containerImage, setContainerImage] = React.useState("")
    const [containerName, setContainerName] = React.useState("")
    const [containerType, setContainerType] = React.useState("")
    const [cpuReserv, setCpuReservation] = React.useState("0m")
    const [cpuLimit, setCpuLimit] = React.useState("0m")
    const [memoryReserv, setMemoryReservation] = React.useState("0Mi")
    const [memoryLimit, setMemoryLimit] = React.useState("0Mi")

    const [activeTabProgress, setActiveTabProgress] = React.useState(1)
    const [progressValue, setProgressValue] = React.useState(33)


    //replicas 쪽 변수
    const [empty_val, setEmpty_val] = React.useState(0)

    const [toggleSwitch, setToggleSwitch] = React.useState(true)

    const [content, setContent] = React.useState("")

    const [loading, setLoading] = React.useState(false)
    const template = {
        "apiVersion": "apps/v1",
        "kind": "Deployment",
        "metadata": {
            "labels": {
                "app": name
            },
            "name": name,
            "namespace:": project
        },
        "spec": {
            "replicas": empty_val,
            "selector": {
                "matchLabels": {
                    "app": name
                }
            },
            "template": {
                "metadata": {
                    "labels": {
                        "app": name
                    }
                },
                "spec": {
                    "containers": [
                        {
                            "image": containerImage,
                            "name": containerName
                        }
                    ],
                    "resources":
                    {
                        "limits": {
                            "memory": memoryLimit,
                            "cpu": cpuLimit
                        },
                        "requests": {
                            "memory": memoryReserv,
                            "cpu": cpuReserv
                        }
                    }
                }
            }
        }
    }


    const toggleTabProgress = (tab) => {
        if (activeTabProgress !== tab) {
            if (tab >= 1 && tab <= 3) {
                setActiveTabProgress(tab)
                if (tab === 1) { setProgressValue(30) }
                if (tab === 2) { setProgressValue(60) }
                if (tab === 3) { setProgressValue(100) }
            }
        }
    }

    const buttonClick = () => {
        // console.log(`workspace name : ${workspace}\nAlias : ${alias} \ntest: ${description}  \ntest: ${empty_val} \ntest: ${toggleSwitch}`);

        // const YAML = require('yamljs');
        // const nativeObject = YAML.parse(content);
        // console.log(nativeObject.apiVersion)

        const body =
        {
            workspaceName: workspace,
            workspaceDescription: description,
            selectCluster: cluster,
            cluster: "cluster1",
            clusterName: "cluster1",
            // workspaceOwner: "innogrid",
            // workspaceCreator: "innogrid"
        }
        callApiStore.postDeployment("deployments", body)
        setLoading(true)
        setTimeout(function () {
            setLoading(false)
            props.history.push("/workload/deployment")
        }, 500);
    }

    const formChange = (value, kind) => {
        if (kind === "workspace") {
            setWorkspace(value)
            setProject("")
            setCluster("")
        }
        if (kind === "project") {
            setProject(value)
            setCluster("")
        }
        if (kind === "cluster") {
            setCluster(value)
        }
    }

    useEffect(() => {
        // console.log(template)
        if (activeTabProgress === 3) {
            const YAML = require('json-to-pretty-yaml');
            setContent(YAML.stringify(template))
        }
    }, [activeTabProgress]);

    useEffect(() => {
        if (content !== "") {
            if (activeTabProgress !== 3) {
                const YAML = require('yamljs');
                const nativeObject = YAML.parse(content);
                if (nativeObject?.metadata.name !== null) {
                    setName(nativeObject?.metadata.name)
                }
                else {
                    setName("")
                }

                if (nativeObject?.spec.replicas !== null) {
                    setEmpty_val(nativeObject?.spec.replicas)
                }
                else {
                    setEmpty_val(0)
                }

                if (nativeObject?.spec.template.spec.containers[0].image !== null) {
                    setContainerImage(nativeObject?.spec.template.spec.containers[0].image)
                }
                else {
                    setContainerImage("")
                }

                if (nativeObject?.spec.template.spec.containers[0].name !== null) {
                    setContainerName(nativeObject?.spec.template.spec.containers[0].name)
                }
                else {
                    setContainerName("")
                }

                if (nativeObject?.spec.template.spec.resources.limits.cpu !== null) {
                    setCpuLimit(nativeObject?.spec.template.spec.resources.limits.cpu)
                }
                else {
                    setCpuLimit("")
                }

                if (nativeObject?.spec.template.spec.resources.requests.cpu !== null) {
                    setCpuReservation(nativeObject?.spec.template.spec.resources.requests.cpu)
                }
                else {
                    setCpuReservation("")
                }

                if (nativeObject?.spec.template.spec.resources.limits.memory !== null) {
                    setMemoryLimit(nativeObject?.spec.template.spec.resources.limits.memory)
                }
                else {
                    setMemoryLimit("")
                }

                if (nativeObject?.spec.template.spec.resources.requests.memory !== null) {
                    setMemoryReservation(nativeObject?.spec.template.spec.resources.requests.memory)
                }
                else {
                    setMemoryReservation("")
                }

            }
        }
    }, [content, activeTabProgress]);

    useEffect(() => {
        callApiStore.getDBProejct("userprojects")
    }, []);

    const data = callApiStore.userprojects

    let workspaceList = data.map((item) => {
        return (
            item.workspaceName
        )
    })
    workspaceList = Array.from(new Set(workspaceList));

    const projectList = data.map((item) => {
        if (item.workspaceName == workspace) {
            return (
                item.projectName
            )
        }
    })

    let clusterList = []
    data.map((item) => {
        if (item.projectName == project) {
            const arr = item.selectCluster.split(",")
            clusterList = arr
        }
    })

    // console.log(name, description, workspace, project, cluster, empty_val, containerImage, containerName, containerType)
    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <Breadcrumbs title="디플로이먼트" breadcrumbItems={breadcrumbItems} />
                    <Row>
                        <Col lg="12">
                            <Card>
                                <CardBody>
                                    <div id="progrss-wizard" className="twitter-bs-wizard">
                                        <ul className="twitter-bs-wizard-nav nav-justified nav nav-pills">
                                            <NavItem>
                                                <NavLink className={classnames({ active: activeTabProgress === 1 })} onClick={() => { toggleTabProgress(1); }} >
                                                    <span className="step-number">01</span>
                                                    <span className="step-title">기본 정보</span>
                                                </NavLink>
                                            </NavItem>
                                            <NavItem>
                                                <NavLink className={classnames({ active: activeTabProgress === 2 })} onClick={() => { toggleTabProgress(2); }} >
                                                    <span className="step-number">02</span>
                                                    <span className="step-title">컨테이너 이미지</span>
                                                </NavLink>
                                            </NavItem>
                                            <NavItem>
                                                <NavLink className={classnames({ active: activeTabProgress === 3 })} onClick={() => { toggleTabProgress(3); }} >
                                                    <span className="step-number">03</span>
                                                    <span className="step-title">Cluster 생성</span>
                                                </NavLink>
                                            </NavItem>

                                        </ul>

                                        <div id="bar" className="mt-4">
                                            <Progress color="success" striped animated value={progressValue} />
                                        </div>
                                        <TabContent activeTab={activeTabProgress} className="twitter-bs-wizard-tab-content">
                                            <TabPane tabId={1}>
                                                <div>
                                                    <Form>
                                                        <Row>
                                                            <Col lg="6">
                                                                <FormGroup>
                                                                    <Label for="basicpill-namecard-input24"> Name</Label>
                                                                    <Input type="text" className="form-control" id="basicpill-namecard-input24" name="Name" value={name} required onChange={(e) => setName(e.target.value)} />
                                                                </FormGroup>
                                                                <FormGroup>
                                                                    <Label> Description</Label>
                                                                    <Input
                                                                        type="textarea"
                                                                        id="textarea"
                                                                        name="description"
                                                                        value={description}
                                                                        onChange={(e) => setDescription(e.target.value)}
                                                                        maxLength="225"
                                                                        rows="3"
                                                                        placeholder="This description has a limit of 225 chars."
                                                                    />
                                                                </FormGroup>
                                                                <FormGroup>
                                                                    <Label> Istio</Label>
                                                                    <div className="custom-control custom-switch mb-2" dir="ltr">
                                                                        <Input type="checkbox" className="custom-control-input" id="customSwitch1" defaultChecked />
                                                                        <Label className="custom-control-label" htmlFor="customSwitch1" name="toggleSwitch" onClick={(e) => { setToggleSwitch(!toggleSwitch) }}>Use istio</Label>
                                                                    </div>
                                                                </FormGroup>
                                                            </Col>

                                                            <Col lg="6">
                                                                <FormGroup>
                                                                    <Label for="basicpill-namecard-input24">Workspaces</Label>
                                                                    <Dropdown
                                                                        placeholder="Select an Workspace"
                                                                        className="selectWorkspace"
                                                                        options={workspaceList}
                                                                        value={workspace}
                                                                        onChange={(value) => { formChange(value.value, "workspace") }
                                                                        }
                                                                    />
                                                                </FormGroup>

                                                                <FormGroup>
                                                                    <Label for="basicpill-namecard-input24">Project</Label>
                                                                    {workspace !== "" ?
                                                                        <Dropdown
                                                                            placeholder="Select an Project"
                                                                            className="selectProject"
                                                                            options={projectList}
                                                                            value={project}
                                                                            onChange={(value) =>
                                                                                formChange(value.value, "project")
                                                                            }
                                                                        />
                                                                        :
                                                                        <Dropdown
                                                                            placeholder="Select an Project"
                                                                            className="selectProject my-disabled"
                                                                            value=""
                                                                            disabled />}
                                                                </FormGroup>

                                                                <FormGroup>
                                                                    <Label for="basicpill-namecard-input24">Cluster</Label>
                                                                    {project !== "" ?
                                                                        <Dropdown
                                                                            placeholder="Select an Cluster"
                                                                            className="selectCluster "
                                                                            options={clusterList}
                                                                            value={cluster}
                                                                            onChange={(value) =>
                                                                                formChange(value.value, "cluster")
                                                                            }
                                                                        />
                                                                        :
                                                                        <Dropdown
                                                                            placeholder="Select an Cluster"
                                                                            className="selectCluster my-disabled"
                                                                            value=""
                                                                            disabled />}
                                                                </FormGroup>
                                                            </Col>

                                                        </Row>
                                                    </Form>
                                                </div>
                                            </TabPane>

                                            <TabPane tabId={2}>
                                                <div>
                                                    <Form>
                                                        <Row>
                                                            <Col lg="2">
                                                                <FormGroup>
                                                                    <Label>Pod Replicas</Label>
                                                                    <InputGroup>
                                                                        <InputGroupAddon addonType="prepend"
                                                                            onClick={() =>
                                                                                setEmpty_val(empty_val - 1)
                                                                            }
                                                                        >
                                                                            <Button type="button" color="primary">
                                                                                <i className="mdi mdi-minus"></i>
                                                                            </Button>
                                                                        </InputGroupAddon>
                                                                        <Input
                                                                            type="number"
                                                                            className="form-control"
                                                                            value={empty_val}
                                                                            placeholder="number"
                                                                            readOnly
                                                                        />
                                                                        <InputGroupAddon addonType="prepend" name="empty_val"
                                                                            onClick={() =>
                                                                                setEmpty_val(empty_val + 1)
                                                                            }
                                                                        >
                                                                            <Button type="button" color="primary">
                                                                                <i className="mdi mdi-plus"></i>
                                                                            </Button>
                                                                        </InputGroupAddon>
                                                                    </InputGroup>
                                                                </FormGroup>
                                                            </Col>

                                                        </Row>

                                                        <Row>
                                                            <Col lg="3">
                                                                <Label> Container </Label>
                                                            </Col>
                                                        </Row>

                                                        <Row>
                                                            <Col lg="4">
                                                                <FormGroup>
                                                                    <Label for="basicpill-namecard-input24">Container Image</Label>
                                                                    <Input type="text" className="form-control" id="basicpill-namecard-input24"
                                                                        placeholder="e.g. nginx:lastest" name="containerImage" value={containerImage} onChange={(e) => setContainerImage(e.target.value)} />
                                                                </FormGroup>
                                                            </Col>
                                                            <Col lg="4">
                                                                <FormGroup>
                                                                    <Label for="basicpill-namecard-input24">Container Name</Label>
                                                                    <Input type="text" className="form-control" id="basicpill-namecard-input24"
                                                                        placeholder="e.g. container-1" name="containerName" value={containerName} onChange={(e) => setContainerName(e.target.value)} />
                                                                </FormGroup>
                                                            </Col>
                                                            <Col lg="4">
                                                                <FormGroup>
                                                                    <Label for="basicpill-namecard-input24">Container Type</Label>
                                                                    <select className="custom-select" name="containerType" value={containerType} onChange={(e) => setContainerType(e.target.value)}>
                                                                        <option defaultValue>Select Container Type</option>
                                                                        <option value="worker">Worker Container</option>
                                                                        <option value="init">Init Container</option>
                                                                    </select>
                                                                </FormGroup>
                                                            </Col>

                                                        </Row>

                                                        <Row>
                                                            <Col lg="3">
                                                                <Label> Resources </Label>
                                                            </Col>
                                                        </Row>
                                                        <Row>
                                                            <Col lg="3">
                                                                <FormGroup>
                                                                    <Label for="basicpill-namecard-input24">CPU Reservation</Label>
                                                                    <Input type="text" className="form-control" id="basicpill-namecard-input24" placeholder="e.g. 1000" name="cpuReservation" value={cpuReserv} onChange={(e) => setCpuReservation(e.target.value)} />

                                                                </FormGroup>
                                                            </Col>
                                                            <Col lg="3">
                                                                <FormGroup>
                                                                    <Label for="basicpill-namecard-input24">CPU Limit</Label>
                                                                    <Input type="text" className="form-control" id="basicpill-namecard-input24" placeholder="e.g. 1000" name="cpuLimit" value={cpuLimit} onChange={(e) => setCpuLimit(e.target.value)} />

                                                                </FormGroup>
                                                            </Col>
                                                            <Col lg="3">
                                                                <FormGroup>
                                                                    <Label for="basicpill-namecard-input24">Memory Reservation</Label>
                                                                    <Input type="text" className="form-control" id="basicpill-namecard-input24" placeholder="e.g. 128" name="memoryReservation" value={memoryReserv} onChange={(e) => setMemoryReservation(e.target.value)} />

                                                                </FormGroup>
                                                            </Col>
                                                            <Col lg="3">
                                                                <FormGroup>
                                                                    <Label for="basicpill-namecard-input24">Memory Limit</Label>
                                                                    <Input type="text" className="form-control" id="basicpill-namecard-input24" placeholder="e.g. 128" name="memoryLimit" value={memoryLimit} onChange={(e) => setMemoryLimit(e.target.value)} />

                                                                </FormGroup>
                                                            </Col>
                                                        </Row>

                                                    </Form>
                                                </div>
                                            </TabPane>

                                            <TabPane tabId={3}>
                                                <div className="row justify-content-center">
                                                    <Col lg="6">
                                                        <div className="text-center">
                                                            <div className="mb-4">
                                                                <i className="mdi mdi-check-circle-outline text-success display-4"></i>
                                                            </div>
                                                            <div>
                                                                <h5>Confirm Detail</h5>
                                                                <p className="text-muted">Shows the set yaml file.</p>
                                                            </div>
                                                        </div>

                                                        <Col sm="12">
                                                            <div className="table-responsive">
                                                                <AceEditor
                                                                    placeholder="Placeholder Text"
                                                                    mode="javascript"
                                                                    theme="monokai"
                                                                    name="editor"
                                                                    width="100%"
                                                                    // onLoad={this.onLoad}
                                                                    // onChange={this.onChange}
                                                                    onChange={value => {
                                                                        setContent(value);
                                                                    }}
                                                                    fontSize={14}
                                                                    showPrintMargin={true}
                                                                    showGutter={true}
                                                                    highlightActiveLine={true}
                                                                    // value={`function onLoad(editor) {
                                                                    // console.log("hello world");
                                                                    //  }`}
                                                                    value={content}
                                                                    setOptions={{
                                                                        enableBasicAutocompletion: false,
                                                                        enableLiveAutocompletion: false,
                                                                        enableSnippets: false,
                                                                        showLineNumbers: true,
                                                                        tabSize: 4,
                                                                    }}
                                                                />
                                                            </div>
                                                        </Col>
                                                        <br />
                                                        <div className="row justify-content-center" onClick={() => buttonClick()}>
                                                            생성 요청
                                                            <Backdrop
                                                                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                                                                open={loading}
                                                            >
                                                                <CircularProgress color="inherit" />
                                                            </Backdrop>

                                                            {/* <FormGroup> */}
                                                            {/* <Link to="/workload/deployment" className="btn btn-success" onClick={(e) => appChange()}> */}
                                                            {/* <Button className="btn btn-success" onClick={() => buttonClick()}>
                                                                    생성 요청
                                                                </Button>
                                                                <Backdrop
                                                                    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                                                                    open={loading}
                                                                >
                                                                    <CircularProgress color="inherit" />
                                                                </Backdrop>
                                                            </FormGroup> */}
                                                        </div>
                                                    </Col>
                                                </div>
                                            </TabPane>
                                        </TabContent>
                                        <ul className="pager wizard twitter-bs-wizard-pager-link">
                                            <li className={activeTabProgress === 1 ? "previous disabled" : "previous"}><Link to="#" onClick={() => { toggleTabProgress(activeTabProgress - 1); }}>이전</Link></li>
                                            <li className={activeTabProgress === 3 ? "next disabled" : "next"}><Link to="#" onClick={() => { toggleTabProgress(activeTabProgress + 1); }}>다음</Link></li>
                                        </ul>
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>

                </Container>
            </div>

        </React.Fragment >
    )

})

export default DeploymentAdd2;
