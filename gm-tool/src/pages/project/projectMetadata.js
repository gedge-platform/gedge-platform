import React, { Component, useEffect } from "react";
import { observer } from "mobx-react";
import store from "../../store/Monitor/store/Store"
import img1 from "../../assets/images/companies/img-1.png";
import { Row, Col, Card, CardBody, CardText, Container, Table } from "reactstrap";

const ProjectMetadata = observer((props) => {
    const { projectData } = props
    // const [isOpen, setOpen] = React.useState(false);
    let labelTable = [];
    let AnnotationTable = [];
    let labelTable2 = [];
    let AnnotationTable2 = [];
    let labelList = []
    let annotationList = []
    let labels = { "None": "None" }
    let annotations = { "None": "None" }
    useEffect(() => {
        return () => {
        };
    }, []);
    if (projectData.length > 1) {

        projectData.map((data) => {
            labelList = []
            labelTable = []
            AnnotationTable = []
            annotationList = []
            if (data.labels != '') {
                labels = data.labels
            }
            if (data.annotations != '') {
                annotations = data.annotations
            }
            labelTable.push(
                <thead>
                    <tr><h5>{data.clusterName}</h5></tr>
                    <tr>
                        <th data-priority="1">Key</th>
                        <th data-priority="3">Value</th>
                    </tr>
                </thead>
            )
            Object.entries(labels).forEach(([keys, values]) => {
                labelList.push(
                    <tr>
                        <th>{keys} </th>
                        <td>{values}</td>
                    </tr>
                )
            });
            labelTable.push(<tbody>
                {labelList}
            </tbody>)
            labelTable2.push(<Table id="tech-companies-1" striped bordered responsive>{labelTable}</Table>)
            AnnotationTable.push(
                <thead>
                    <tr><h5>{data.clusterName}</h5></tr>
                    <tr>
                        <th data-priority="1">Key</th>
                        <th data-priority="3">Value</th>
                    </tr>
                </thead>
            )
            Object.entries(annotations).forEach(([keys, values]) => {
                annotationList.push(
                    <tr>
                        <th>{keys} </th>
                        <td>{values}</td>
                    </tr>
                )
            });
            AnnotationTable.push(<tbody>
                {annotationList}
            </tbody>)
            AnnotationTable2.push(<Table id="tech-companies-1" striped bordered responsive>{AnnotationTable}</Table>)
        })
        return (
            <React.Fragment>
                <hr />
                <h4 className="card-title">라벨</h4>
                <hr />
                <div className="table-responsive mb-0" data-pattern="priority-columns">
                    {/* <Table id="tech-companies-1" striped bordered responsive> */}
                    {/* <thead>
                        <tr>
                            <th data-priority="1">Key</th>
                            <th data-priority="3">Value</th>
                        </tr>
                    </thead>
                    <tbody>
                        {labelTable}
                    </tbody> */}
                    {labelTable2}

                    {/* </Table> */}
                </div>
                <hr />
                <h4 className="card-title">어노테이션</h4>
                <hr />
                <div className="table-responsive mb-0" data-pattern="priority-columns">
                    {/* <Table id="tech-companies-1" striped bordered responsive> */}
                    {/* <thead>
                        <tr>
                            <th data-priority="1">Key</th>
                            <th data-priority="3">Value</th>
                        </tr>
                    </thead>
                    <tbody> */}
                    {AnnotationTable2}
                    {/* </tbody> */}
                    {/* </Table> */}
                </div>




            </React.Fragment >
        )

    } else {
        if (projectData.labels != '') {
            labels = projectData.labels
        }
        if (projectData.annotations != '') {
            annotations = projectData.annotations
        }
        Object.entries(labels).forEach(([keys, values]) => {
            labelTable.push(
                // <h5 className="font-size-14 mb-0" style={{ whiteSpace: 'pre-line' }}>{keys}:{values}</h5>
                <tr>
                    <th>{keys} </th>
                    <td>{values}</td>
                </tr>
            )
        });
        Object.entries(annotations).forEach(([keys, values]) => {
            AnnotationTable.push(
                // <h5 className="font-size-14 mb-0" style={{ whiteSpace: 'pre-line' }}>{keys}:{values}</h5>
                <tr>
                    <th>{keys} </th>
                    <td>{values}</td>
                </tr>
            )
        });
        return (
            <React.Fragment>
                <hr />
                <h4 className="card-title">라벨</h4>
                <hr />
                <div className="table-responsive mb-0" data-pattern="priority-columns">
                    <Table id="tech-companies-1" striped bordered responsive>
                        <thead>
                            <tr>
                                <th data-priority="1">Key</th>
                                <th data-priority="3">Value</th>
                            </tr>
                        </thead>
                        <tbody>
                            {labelTable}
                        </tbody>
                    </Table>
                </div>
                <hr />
                <h4 className="card-title">어노테이션</h4>
                <hr />
                <div className="table-responsive mb-0" data-pattern="priority-columns">
                    <Table id="tech-companies-1" striped bordered responsive>
                        <thead>
                            <tr>
                                <th data-priority="1">Key</th>
                                <th data-priority="3">Value</th>
                            </tr>
                        </thead>
                        <tbody>
                            {AnnotationTable}
                        </tbody>
                    </Table>
                </div>



            </React.Fragment >
        )
    }


    // console.log(labelTable)


    // Object.entries(annotations).forEach(([keys, values]) => {
    //     annotationsTable.push(

    //         <h5 className="font-size-14 mb-0" style={{ whiteSpace: 'pre-line' }}>{keys}:{values}</h5>

    //     )
    // });





})

export default ProjectMetadata;