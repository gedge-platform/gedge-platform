import React, { Component, useEffect } from "react";
import { observer } from "mobx-react";
import store from "../../store/Monitor/store/Store"
import img1 from "../../assets/images/companies/img-1.png";
import { Row, Col, Card, CardBody, CardText, Container, Table } from "reactstrap";

const ServiceDetailMeta = observer((props) => {
    const { selector } = props
    const { clusterStore } = store;

    console.log(selector)
    let labelTable = [];
    Object.entries(selector).forEach(([keys, values]) => {
        labelTable.push(
            // <h5 className="font-size-14 mb-0" style={{ whiteSpace: 'pre-line' }}>{keys}:{values}</h5>
            <tr>
                <th>{keys} </th>
                <td>{values}</td>
            </tr>
        )
    });

    // let annotationsTable = [];
    // Object.entries(annotations).forEach(([keys, values]) => {
    //     annotationsTable.push(

    //         <h5 className="font-size-14 mb-0" style={{ whiteSpace: 'pre-line' }}>{keys}:{values}</h5>

    //     )
    // });

    useEffect(() => {
        return () => {
        };
    }, []);

    return (
        <React.Fragment>
            <hr />
            <h4 className="card-title">Selector</h4>
            <hr />
            <div className="table-responsive mb-0" data-pattern="priority-columns">
                <Table hover id="tech-companies-1" bordered responsive>
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
            {/* {labelTable.length > 0 ? labelTable : "Empty"} */}
            {/* <div className="table-responsive">
                <Table responsive >
                    <thead>
                        <tr>
                            <th style={{ width: "100%" }} >라벨</th>
                        </tr>
                    </thead>
                    <tbody>
                        {labelTable}
                    </tbody>
                </Table>
            </div> */}
            <hr />
            {/* <h4 className="card-title">Annotations</h4> */}
            {/* <hr /> */}
            {/* {annotationsTable} */}
            {/* <div className="table-responsive">
                <Table responsive >
                    <thead>
                        <tr>
                            <th style={{ width: "100%" }} >어노테이션</th>
                        </tr>
                    </thead>
                    <tbody>
                        {annotationsTable}
                    </tbody>
                </Table>
            </div> */}


        </React.Fragment >
    )

})

export default ServiceDetailMeta;