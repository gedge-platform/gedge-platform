import React, { Component } from 'react';
import { Col, Dropdown, DropdownMenu, DropdownToggle, DropdownItem, Card, CardBody } from "reactstrap";
import { Link } from "react-router-dom";

import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';

const expandRow = {
  renderer: row => (
    <>
      Action :
      <Link to="#" className="mr-3 text-primary"><i className="mdi mdi-pencil font-size-18"></i></Link>
      <Link to="#" className="text-danger" ><i className="mdi mdi-trash-can font-size-18"></i></Link>
    </>
  ),
  showExpandColumn: false,
  expandByColumnOnly: true
};

class LatestTransactions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      menu: false,
    }
  }

  render() {
    const data = {
      columns: [
        {
          dataField: 'id',
          text: 'No.'
        },
        {
          dataField: "orderId",
          text: "Order ID"
        },
        {
          dataField: "date",
          text: "Date"
        },
        {
          dataField: "billingName",
          text: "Billing Name"
        },
        {
          dataField: "total",
          text: "Total"
        },
        {
          dataField: "status",
          text: "Payment Status"
        },
      ],
      rows: [
        {
          id: 1,
          orderId: <Link to="#" className="text-dark font-weight-bold">#NZ1572</Link>,
          date: "04 Apr, 2020",
          billingName: "Walter Brown",
          total: "$172",
          status: <div className="badge badge-soft-success font-size-12">Paid</div>,
        },
        {
          id: 2,
          orderId: <Link to="#" className="text-dark font-weight-bold">#NZ1571</Link>,
          date: "03 Apr, 2020",
          billingName: "Jimmy Barker",
          total: "$165",
          status: <div className="badge badge-soft-warning font-size-12">unpaid</div>,
        },
        {
          id: 3,
          orderId: <Link to="#" className="text-dark font-weight-bold">#NZ1570</Link>,
          date: "03 Apr, 2020",
          billingName: "Donald Bailey",
          total: "$146",
          status: <div className="badge badge-soft-success font-size-12">Paid</div>,
        },
        {
          id: 4,
          orderId: <Link to="#" className="text-dark font-weight-bold">#NZ1569</Link>,
          date: "02 Apr, 2020",
          billingName: "Paul Jones",
          total: "$183",
          status: <div className="badge badge-soft-success font-size-12">Paid</div>,
        },
        {
          id: 5,
          orderId: <Link to="#" className="text-dark font-weight-bold">#NZ1568</Link>,
          date: "04 Apr, 2020",
          billingName: "Walter Brown",
          total: "$172",
          status: <div className="badge badge-soft-danger font-size-12">Chargeback</div>,
        },
        {
          id: 6,
          orderId: <Link to="#" className="text-dark font-weight-bold">#NZ1567</Link>,
          date: "04 Apr, 2020",
          billingName: "Walter Brown",
          total: "$172",
          status: <div className="badge badge-soft-warning font-size-12">unpaid</div>,
        },
        {
          id: 7,
          orderId: <Link to="#" className="text-dark font-weight-bold">#NZ1566</Link>,
          date: "04 Apr, 2020",
          billingName: "Walter Brown",
          total: "$172",
          status: <div className="badge badge-soft-success font-size-12">Paid</div>,
        },
        {
          id: 8,
          orderId: <Link to="#" className="text-dark font-weight-bold">#NZ1565</Link>,
          date: "04 Apr, 2020",
          billingName: "Walter Brown",
          total: "$172",
          status: <div className="badge badge-soft-success font-size-12">Paid</div>,
        },
        {
          id: 9,
          orderId: <Link to="#" className="text-dark font-weight-bold">#NZ1564</Link>,
          date: "04 Apr, 2020",
          billingName: "Walter Brown",
          total: "$172",
          status: <div className="badge badge-soft-success font-size-12">Paid</div>,
        },
        {
          id: 10,
          orderId: <Link to="#" className="text-dark font-weight-bold">#NZ1563</Link>,
          date: "04 Apr, 2020",
          billingName: "Walter Brown",
          total: "$172",
          status: <div className="badge badge-soft-warning font-size-12">unpaid</div>,
        },
        {
          id: 11,
          orderId: <Link to="#" className="text-dark font-weight-bold">#NZ1562</Link>,
          date: "04 Apr, 2020",
          billingName: "Walter Brown",
          total: "$172",
          status: <div className="badge badge-soft-success font-size-12">Paid</div>,
        },
      ]
    };

    const options = {
      // pageStartIndex: 0,
      hideSizePerPage: false,
      hidePageListOnlyOnePage: false,
      sizePerPageList:
        [{
          text: '5개', value: 5
        }, {
          text: '10개', value: 10
        }, {
          text: '전체', value: data.rows.length
        }]

    };

    const selectRow = {
      mode: 'checkbox',
      clickToSelect: true
    };

    return (
      <React.Fragment>
        <Col lg={12}>
        
              <Dropdown isOpen={this.state.menu} toggle={() => this.setState({ menu: !this.state.menu })} className="float-right">
                <DropdownToggle tag="i" className="arrow-none card-drop">
                  <i className="mdi mdi-dots-vertical"></i>
                </DropdownToggle>
                <DropdownMenu right>

                  <DropdownItem>Sales Report</DropdownItem>

                  <DropdownItem>Export Report</DropdownItem>

                  <DropdownItem>Profit</DropdownItem>

                  <DropdownItem>Action</DropdownItem>
                </DropdownMenu>
              </Dropdown>

              <h4 className="card-title mb-4">Latest Transactions</h4>

              <BootstrapTable
                keyField='id'
                data={data.rows}
                columns={data.columns}
                expandRow={expandRow}
                pagination={paginationFactory(options)}
                selectRow={selectRow}
              />
        </Col>
      </React.Fragment>
    );
  }
}

export default LatestTransactions;