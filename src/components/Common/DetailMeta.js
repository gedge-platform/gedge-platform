import React, { useEffect } from 'react';
import { Table } from "reactstrap";
import { observer } from "mobx-react";
//Import Charts
// import "../Dashboard/dashboard.scss";
// import "./detail.scss";

const DetailMeta = observer((props) => {
    const { data } = props
    let labelTable = [];
    let AnnotationTable = [];
    let labels = data.labels
    let annotations = data.annotations

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
});

export default DetailMeta