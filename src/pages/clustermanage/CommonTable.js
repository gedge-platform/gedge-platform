import React, { Component, useState, useEffect } from 'react';
import { Container, Card, CardBody, Row, Col, Nav, NavItem, NavLink, UncontrolledTooltip, Input, Label, Button } from "reactstrap";
import { Link } from "react-router-dom";
import classnames from 'classnames';
import { MDBDataTable, MDBNavLink } from "mdbreact";
// import "./datatables.scss";
import axios from 'axios';

// import Breadcrumbs from '../../components/Common/Breadcrumb';
import Search from '../Tables/Search';


function name(params) {

}
class CommonTable extends Component {
    constructor(props) {
        super(props);


    }

    render() {
        console.log(this.props);
        // const { users } = this.props;
        const rows = {
            // = users.map(test => ({
            checkbox:
                <div className="custom-control custom-checkbox">
                    <Input type="checkbox" className="custom-control-input" id="ordercheck1" />
                    <Label className="custom-control-label" htmlFor="ordercheck1">&nbsp;</Label>
                </div>,
            id: <Link to="/cluster/core-detail" className="text-dark font-weight-bold">{this.props.id}</Link>,
            name: <Link to="maps-google" className="text-dark font-weight-bold" searchvalue={this.props.name}>{this.props.name}</Link>,
            userId: <Link to="/cluster/edge-detail" className="text-dark font-weight-bold" searchvalue={this.props.username}>{this.props.username}</Link>,
            email: <div className="badge badge-soft-success font-size-12">{this.props.email}</div>,
            // status: <div className="badge badge-soft-success font-size-12"></div>,
            action: <><Link to="#" className="mr-3 text-primary" id="edit1"><i className="mdi mdi-pencil font-size-18"></i></Link>
                <UncontrolledTooltip placement="top" target="edit1">
                    Edit
                </UncontrolledTooltip >
                <Link to="#" className="text-danger" id="delete1"><i className="mdi mdi-trash-can font-size-18"></i></Link>
                <UncontrolledTooltip placement="top" target="delete1">
                    Delete
                </UncontrolledTooltip >
            </>
            // }))
        }
        const data = {
            columns: [
                {
                    label: <div className="custom-control custom-checkbox"> <Input type="checkbox" className="custom-control-input" id="ordercheck" /><Label className="custom-control-label" htmlFor="ordercheck">&nbsp;</Label></div>,
                    field: "checkbox",
                    sort: "asc",
                    width: 28
                },
                {
                    label: '이름',
                    field: 'name',
                    sort: 'asc',
                    width: 150
                },
                {
                    label: '타입',
                    field: 'username',
                    sort: 'asc',
                    width: 270
                },
                {
                    label: '상태',
                    field: 'email',
                    sort: 'asc',
                    width: 200
                },
                {
                    label: '노드 개수',
                    field: 'phone',
                    sort: 'asc',
                    width: 100
                },
                {
                    label: '버전',
                    field: 'city',
                    sort: 'asc',
                    width: 150
                },
                {
                    label: "",
                    field: "action",
                    sort: "asc",
                    width: 120
                },
            ],
            rows
        };
        console.log(rows);

        return (

            <MDBDataTable
                searching={true}
                entries={50}
                entriesOptions={[20, 30, 50, 100]}

                responsive data={data} className="mt-4" />

        )

    }
}

export default CommonTable;