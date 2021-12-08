import React, { Component } from "react";
import { TabPane, NavLink, NavItem, CardText, Nav, Card, Row, Col, CardBody, Container, Table, Dropdown, DropdownMenu, DropdownItem, DropdownToggle, Modal, ModalHeader, ModalBody, } from "reactstrap";

import AceEditor from "react-ace";
class ViewYaml extends Component {
    render() {

        return (
            <React.Fragment>
                <div className="page-content">

                    <TabPane tabId="8" className="p-3">
                        <Row>
                            <Col sm="12">
                                <CardText>
                                    <AceEditor
                                        placeholder="Placeholder Text"
                                        mode="javascript"
                                        theme="xcode"
                                        name="blah2"
                                        onLoad={this.onLoad}
                                        onChange={this.onChange}
                                        fontSize={14}
                                        showPrintMargin={true}
                                        showGutter={true}
                                        highlightActiveLine={true}
                                        value={`function onLoad(editor) {
console.log("seohwa yeonguwonnim babo melong~~~~~~~");
 }`}
                                        setOptions={{
                                            enableBasicAutocompletion: false,
                                            enableLiveAutocompletion: false,
                                            enableSnippets: false,
                                            showLineNumbers: true,
                                            tabSize: 2,
                                        }} />
                                </CardText>
                            </Col>
                        </Row>
                    </TabPane>

                </div>
            </React.Fragment>
        );
    }
}

export default ViewYaml;
