import React, { Component } from "react";

import { Row, Col, Card, CardBody, Container } from "reactstrap";
// Editable
import BootstrapTable from "react-bootstrap-table-next";
import cellEditFactory from "react-bootstrap-table2-editor";

//Import Breadcrumb
import Breadcrumbs from '../../components/Common/Breadcrumb';

const products = [
  { id: 1, age: 25, qty: 1500, cost: 1000 },
  { id: 2, age: 34, qty: 1900, cost: 1300 },
  { id: 3, age: 67, qty: 1300, cost: 1300 },
  { id: 4, age: 23, qty: 1100, cost: 6400 },
  { id: 5, age: 78, qty: 1400, cost: 4000 }
];

const columns = [
  {
    dataField: "id",
    text: "ID",
    sort: true
  },
  {
    dataField: "age",
    text: "Age(AutoFill)",
    sort: true
  },
  {
    dataField: "qty",
    text: "Qty(AutoFill and Editable)",
    sort: true
  },
  {
    dataField: "cost",
    text: "Cost(Editable)",
    sort: true
  }
];

class EditableTables extends Component {
  constructor(props) {
    super(props);
    this.state = {
      breadcrumbItems: [
        { title: "Tables", link: "#" },
        { title: "Editable Tables", link: "#" },
      ],
    };
  }

  render() {
    return (
      <React.Fragment>
        <div className="page-content">
          <Container fluid>

            <Breadcrumbs title="Editable Tables" breadcrumbItems={this.state.breadcrumbItems} />

            <Row>
              <Col xs={12}>
                <Card>
                  <CardBody>
                    <h4 className="card-title">Datatable Editable</h4>

                    <div className="table-responsive">
                      <BootstrapTable
                        keyField="id"
                        data={products}
                        columns={columns}
                        cellEdit={cellEditFactory({ mode: "click" })}
                      />
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

export default EditableTables;
