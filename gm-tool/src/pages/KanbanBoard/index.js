import React, { Component } from 'react';
import { Container, Row, Col, Media, UncontrolledTooltip } from "reactstrap";
import { Link } from "react-router-dom";

//Import Breadcrumb
import Breadcrumbs from '../../components/Common/Breadcrumb';
import KanbanBoard from "./KanbanBoard";

//Import Logo
import logosmlight from "../../assets/images/logo-sm-light.png";
import avatar2 from "../../assets/images/users/avatar-2.jpg";
import avatar1 from "../../assets/images/users/avatar-1.jpg";
import avatar4 from "../../assets/images/users/avatar-4.jpg";
import avatar5 from "../../assets/images/users/avatar-5.jpg";
import avatar6 from "../../assets/images/users/avatar-6.jpg";
import avatar7 from "../../assets/images/users/avatar-7.jpg";
import avatar8 from "../../assets/images/users/avatar-8.jpg";

//Import scss
import "./kanban-style.scss";


class IndexKanban extends Component {
    constructor(props) {
        super(props);
        this.state={
            columns: [
				{
					id: 1,
                    title: 'Todo',
                    columnsubtitle : "2 Tasks",
					cards: [
						{
							id: 11,
							content: {
                                id : "#NZ1220", title: "Admin layout design", subtitle : "Sed ut perspiciatis unde", date: "14 Oct, 2019", progressValue: 75,
                                team : [                                    
                                    { id : 1, name : "joseph", img : avatar2 },
                                    { id : 2, name : "joseph", img : avatar4 },
                                ]
							}
						},
						{
							id: 12,
							content: {
                                id : "#NZ1219", title: "Dashboard UI", subtitle : "Neque porro quisquam est", date: " 15 Apr, 2020", progressValue: 50,
                                team : [
                                    { id : 3, name : "Misty", img : "Null" },
                                ]
							}
						},
						{
							id: 13,
							content: {
                                id : "#NZ1218", title: "Admin layout design", subtitle : "Itaque earum rerum hic", date: "12 Apr, 2020", progressValue: 65,
                                team : [
                                    { id : 4, name : "joseph", img : avatar5 },
                                    { id : 5, name : "Jenice Bliss", img : "Null" },
                                    { id : 6, name : "John", img : avatar6 },
                                ]
							}
						},
					]
				},
				{
					id: 2,
                    title: 'In Progress',
                    columnsubtitle : "3 Tasks",
					cards: [
						{
							id: 21,
							content: {
                                id : "#NZ1217", title: "Dashboard UI", subtitle : "In enim justo, rhoncus ut", date: "05 Apr, 2020", progressValue: 45,
                                team : [
                                    { id : 7, name : "joseph", img : avatar7 },
                                    { id : 8, name : "Edward", img : "Null" },
                                    { id : 9, name : "John", img : avatar8 },
                                ]
							}
						},
						{
							id: 22,
							content: {
                                id : "#NZ1216", title: "Authentication pages", subtitle : "Imperdiet Etiam ultricies", date: "02 Apr, 2020", progressValue: 80,
                                team : [
                                    { id : 10, name : "joseph", img : avatar7 },
                                    { id : 11, name : "John", img : avatar2 },
                                ]
							}
						},
						{
							id: 23,
							content: {
                                id : "#NZ1215", title: "UI Element Pages", subtitle : "Itaque earum rerum hic", date: "28 Mar, 2020", progressValue: 85,
                                team : [
                                    { id : 12, name : "Amver", img : avatar4 },
                                ]
							}
						},

					]
				},
				{
					id: 3,
                    title: 'Completed',
                    columnsubtitle : "4 Tasks",
					cards: [
						{
							id: 31,
							content: {
                                id : "#NZ1214", title: "Brand logo design", subtitle : "Aenean leo ligula, porttitor eu", date: "24 Mar, 2020", progressValue: 80,
                                team : [
                                    { id : 13, name : "Karen", img : "Null" },
                                ]
							}
						},
						{
							id: 32,
							content: {
                                id : "#NZ1218", title: "Email pages", subtitle : "It will be as simple as Occidental", date: "20 Mar, 2020", progressValue: 77,
                                team : [
                                    { id : 15, name : "Ricky", img : "Null" },
                                    { id : 16, name : "John", img : avatar5 },
                                ]
							}
						},
						{
							id: 33,
							content: {
                                id : "#NZ1212", title: "Forms pages", subtitle : "Donec quam felis, ultricies nec", date: "14 Mar, 2020", progressValue: 40,
                                team : [
                                    { id : 17, name : "joseph", img : avatar2 },
                                    { id : 18, name : "John", img : avatar1 },
                                ]
							}
						},

					]
				}
			]
        }
    }
    render() {
        const breadcrumbItems = [
            { title : "Tables", link : "#" },
            { title : "Kanban Board", link : "#" },
        ];
        return (
            <React.Fragment>
                <div className="page-content">
                    <Container fluid>

                    <Breadcrumbs title="Kanban Board" breadcrumbItems={breadcrumbItems} />
                        
                        <Row className="mb-2">
                            <Col lg={6}>
                                <Media>
                                    <div className="mr-3">
                                        <img src={logosmlight} alt="" className="avatar-xs"/>
                                    </div>
                                    <Media body>
                                        <h5>Nazox admin Dashboard</h5>
                                        <span className="badge badge-soft-success">Open</span>
                                    </Media>
                                </Media>
                            </Col>
                            <Col lg={6}>
                                <div className="text-lg-right">
                                    <ul className="list-inline mb-0">
                                        <li className="list-inline-item">
                                            <Link to="#" className="d-inline-block" id="member1">
                                                <img src={avatar2} className="rounded-circle avatar-xs" alt="Nazox"/>
                                            </Link>
                                            <UncontrolledTooltip target="member1" placement="top">
                                                Aaron Williams
                                            </UncontrolledTooltip>
                                        </li>
                                        <li className="list-inline-item">
                                            <Link to="#" className="d-inline-block" id="member2">
                                                <div className="avatar-xs">
                                                    <span className="avatar-title rounded-circle bg-soft-primary text-primary">
                                                        J
                                                    </span>
                                                </div>
                                            </Link>
                                            <UncontrolledTooltip target="member2" placement="top">
                                            Jonathan McKinney
                                            </UncontrolledTooltip>
                                        </li>
                                        <li className="list-inline-item">
                                            <Link to="#" className="d-inline-block" id="member3">
                                                <img src={avatar4} className="rounded-circle avatar-xs" alt="Nazox"/>
                                            </Link>
                                            <UncontrolledTooltip target="member3" placement="top">
                                            Carole Connolly
                                            </UncontrolledTooltip>
                                        </li>
                                        
                                        <li className="list-inline-item">
                                            <Link to="#" className="py-1">
                                                <i className="mdi mdi-plus mr-1"></i> New member
                                            </Link>
                                        </li>

                                    </ul>
                                </div>
                            </Col>
                        </Row>
                        

                        <Row>
                        <KanbanBoard board={this.state} content={this.state.columns}/>
                        </Row>
                        

                    </Container>
                </div>
            </React.Fragment>
        );
    }
}

export default IndexKanban;