import React, { Component } from 'react';
import { Container, CardBody, Row, Col, Card } from "reactstrap";
import { Link } from "react-router-dom";

//Import Breadcrumb
import Breadcrumbs from '../../components/Common/Breadcrumb';

//Import Images
import img2 from "../../assets/images/small/img-2.jpg";
import img3 from "../../assets/images/small/img-3.jpg";
import img4 from "../../assets/images/small/img-4.jpg";

class Timeline extends Component {
    constructor(props) {
        super(props);
        this.state={
            breadcrumbItems : [
                { title : "Utility", link : "#" },
                { title : "Timeline", link : "#" },
            ],
        }
    }
    render() {
        return (
            <React.Fragment>
                <div className="page-content">
                    <Container fluid>

                    <Breadcrumbs title="Timeline" breadcrumbItems={this.state.breadcrumbItems} />

                        <Row className="justify-content-center">
                            <Col xl={10}>
                                <div className="timeline" dir="ltr">
                                    <div className="timeline-item timeline-left">
                                        <div className="timeline-block">
                                            <div className="time-show-btn mt-0">
                                                <Link to="#" className="btn btn-danger btn-rounded w-lg">2020</Link>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="timeline-item">
                                        <div className="timeline-block">
                                            <Card className="timeline-box">
                                                <CardBody>
                                                    <span className="timeline-icon"></span>
                                                    <div className="timeline-date">
                                                        <i className="mdi mdi-circle-medium circle-dot"></i> 28 April
                                                    </div>
                                                    <h5 className="mt-3 foont-size-15"> Timeline event One</h5>
                                                    <div className="text-muted">
                                                        <p className="mb-0">It will be as simple as occidental in fact. To an english person, it will seem like simplified English, as a skeptical friend</p>
                                                    </div>
                                                </CardBody>
                                            </Card>
                                        </div>
                                    </div>
                                    <div className="timeline-item timeline-left">
                                        <div className="timeline-block">
                                            <Card className="timeline-box">
                                                <CardBody>
                                                    <span className="timeline-icon"></span>
                                                    <div className="timeline-date">
                                                        <i className="mdi mdi-circle-medium circle-dot"></i> 21 April
                                                    </div>
                                                    <h5 className="mt-3 foont-size-15"> Timeline event Two</h5>
                                                    <div className="text-muted">
                                                        <p className="mb-0">To achieve this, it would be necessary to have more common words.</p>
                                                    </div>
                                                </CardBody>
                                            </Card>
                                        </div>
                                    </div>

                                    <div className="timeline-item">
                                        <div className="timeline-block">
                                            <Card className="timeline-box">
                                                <CardBody>
                                                    <span className="timeline-icon"></span>
                                                    <div className="timeline-date">
                                                        <i className="mdi mdi-circle-medium circle-dot"></i> 15 April
                                                    </div>
                                                    <h5 className="mt-3 foont-size-15"> Timeline event Three</h5>
                                                    <div className="text-muted">
                                                        <p>The new common language will be more simple and regular than the existing European languages be as simple as occidental</p>
                                                        
                                                    </div>
                                                    <div className="timeline-album">
                                                        <Link to="#" className="mr-1">
                                                            <img src={img2} alt=""/>
                                                        </Link>
                                                        <Link to="#" className="mr-1 ml-1">
                                                            <img src={img3} alt=""/>
                                                        </Link>
                                                        <Link to="#" className="mr-1 ml-1">
                                                            <img src={img4} alt=""/>
                                                        </Link>
                                                    </div>
                                                </CardBody>
                                            </Card>
                                        </div>
                                    </div>
                                    <div className="timeline-item timeline-left">
                                        <div className="timeline-block">
                                            <Card className="timeline-box">
                                                <CardBody>
                                                    <span className="timeline-icon"></span>
                                                    <div className="timeline-date">
                                                        <i className="mdi mdi-circle-medium circle-dot"></i> 09 April
                                                    </div>
                                                    <h5 className="mt-3 foont-size-15"> Timeline event Four</h5>
                                                    <div className="text-muted">
                                                        <p className="mb-0">Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, ab illo inventore veritatis et</p>
                                                    </div>
                                                </CardBody>
                                            </Card>
                                        </div>
                                    </div>  

                                    <div className="timeline-item">
                                        <div className="timeline-block">
                                            <Card className="timeline-box">
                                                <CardBody>
                                                    <span className="timeline-icon"></span>
                                                    <div className="timeline-date">
                                                        <i className="mdi mdi-circle-medium circle-dot"></i> 02 April
                                                    </div>
                                                    <h5 className="mt-3 foont-size-15"> Timeline event Five</h5>
                                                    <div className="text-muted">
                                                        <p className="mb-0">Itaque earum rerum hic tenetur a sapiente delectus, ut aut doloribus asperiores.</p>
                                                    </div>
                                                </CardBody>
                                            </Card>
                                        </div>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </Container> 
                </div>
            </React.Fragment>
        );
    }
}

export default Timeline;