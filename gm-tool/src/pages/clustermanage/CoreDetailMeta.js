import React, { Component, useEffect } from "react";
import { observer } from "mobx-react";
import store from "../../store/Monitor/store/Store"
import img1 from "../../assets/images/companies/img-1.png";
import { Row, Col, Card, CardBody, CardText, Container, Table } from "reactstrap";

const CoreDetailMeta = observer((props) => {
    const { labels, annotations } = props
    const { clusterStore } = store;

    console.log(labels, annotations)

    // labels.map((item, key) => {
    //     console.log(item)
    // })

    let labelTable = [];
    if (labels !== undefined) {
        Object.entries(labels).forEach(([keys, values]) => {
            labelTable.push(
                <h5 className="font-size-14 mb-0" style={{ whiteSpace: 'pre-line' }}>{keys}:{values}</h5>

            )
        });
    }
    // console.log(labelTable)

    let annotationsTable = [];
    if (annotations !== undefined) {
        Object.entries(annotations).forEach(([keys, values]) => {
            annotationsTable.push(

                <h5 className="font-size-14 mb-0" style={{ whiteSpace: 'pre-line' }}>{keys}:{values}</h5>

            )
        });
    }
    useEffect(() => {
        return () => {
        };
    }, []);

    return (
        <React.Fragment>
            <hr />
            <h4 className="card-title">Labels</h4>
            <hr />
            {labelTable}
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
            <h4 className="card-title">Annotations</h4>
            <hr />
            {annotationsTable}
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

export default CoreDetailMeta;