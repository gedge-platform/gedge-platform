import React, { Component } from 'react';
import { Progress, Card, CardBody, UncontrolledTooltip } from "reactstrap";
import { Link } from "react-router-dom";

class CardBox extends Component {
    render() {
        return (
            <React.Fragment>
                <Card className="task-box">
                                                <Progress className="progress-sm animated-progess" value={this.props.data['progressValue']} style={{height: "3px"}}></Progress>
                                                <CardBody className="borad-width">
    
                                                    <div className="float-right ml-2">
                                                        <div>
                                                        {this.props.data['date']}
                                                        </div>
                                                    </div>
                                                    <div className="mb-3">
                                                        <Link to="#" className="">{this.props.data['id']}</Link>
                                                    </div>
                                                    <div>
                                                        <h5 className="font-size-16"><Link to="#" className="text-dark">{this.props.data['title']}</Link></h5>
                                                        <p className="mb-4">{this.props.data['subtitle']}</p>
                                                    </div>
        
                                                    <div className="d-inline-flex team mb-0">
                                                        <div className="mr-3 align-self-center">
                                                            Team :
                                                        </div>
                                                        {
                                                            this.props.data['team'].map((member, key) =>
                                                                <div className="team-member" key={key}>
                                                                    <Link to="# " className="team-member d-inline-block" id={"memberTooltip"+member.id} >
                                                                        {
                                                                            member.img === "Null" ?
                                                                                <div className="avatar-xs">
                                                                                    <span className="avatar-title bg-soft-primary text-primary rounded-circle">
                                                                                        {member.name.charAt(0)}
                                                                                    </span>
                                                                                </div>
                                                                            :   <img src={member.img} className="rounded-circle avatar-xs" alt="Nazox"/>
                                                                        }
                                                                    </Link>
                                                                    <UncontrolledTooltip target={"memberTooltip"+member.id} placement="top">
                                                                    {member.name}
                                                                    </UncontrolledTooltip>
                                                                </div>
                                                            )
                                                        }
                                                        
                                                    </div>
    
                                                </CardBody>
                                            </Card>
            </React.Fragment>
        );
    }
}

export default CardBox;