import React, { Component } from "react";
import { Card, Row, Col, CardBody, Container } from "reactstrap";

//Import Breadcrumb
import Breadcrumbs from '../../components/Common/Breadcrumb';


class UiVideo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            breadcrumbItems : [
                { title : "UI Elements", link : "#" },
                { title : "Video", link : "#" },
            ],
        };
    }


    render() {
        return (
            <React.Fragment>
                <div className="page-content">
                    <Container fluid>

                    <Breadcrumbs title="Video" breadcrumbItems={this.state.breadcrumbItems} />

                    <Row>
                            <Col xl={6}>
                                <Card>
                                    <CardBody>
        
                                        <h4 className="card-title">Responsive embed video 16:9</h4>
                                        <p className="card-title-desc">Aspect ratios can be customized with modifier classes.</p>
        
                                    
                                        <div className="embed-responsive embed-responsive-16by9">
                                            <iframe title="video4" className="embed-responsive-item" src="https://www.youtube.com/embed/1y_kfWUCFDQ"></iframe>
                                        </div>
                                    </CardBody>
                                </Card>
                            </Col> 
        
                            <Col xl={6}>
                                <Card>
                                    <CardBody>
                                        <h4 className="card-title">Responsive embed video 21:9</h4>
                                        <p className="card-title-desc">Aspect ratios can be customized with modifier classes.</p>
        
                                        
                                        <div className="embed-responsive embed-responsive-21by9">
                                            <iframe title="video1" className="embed-responsive-item" src="https://www.youtube.com/embed/1y_kfWUCFDQ"></iframe>
                                        </div>
        
                                    </CardBody>
                                </Card>
                            </Col> 
        
                        </Row> 
        
                        <Row>
        
                            <Col xl={6}>
                                <Card>
                                    <CardBody>
        
                                        <h4 className="card-title">Responsive embed video 4:3</h4>
                                        <p className="card-title-desc">Aspect ratios can be customized with modifier classes.</p>
        
                                       
                                        <div className="embed-responsive embed-responsive-4by3">
                                            <iframe title="video2" className="embed-responsive-item" src="https://www.youtube.com/embed/1y_kfWUCFDQ"></iframe>
                                        </div>
                                    </CardBody>
                                </Card>
                            </Col> 
        
                            <Col xl={6}>
                                <Card>
                                    <CardBody>
        
                                        <h4 className="card-title">Responsive embed video 1:1</h4>
                                        <p className="card-title-desc">Aspect ratios can be customized with modifier classes.</p>
        
                                       
                                        <div className="embed-responsive embed-responsive-1by1">
                                            <iframe title="video3" className="embed-responsive-item" src="https://www.youtube.com/embed/1y_kfWUCFDQ"></iframe>
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

export default UiVideo;
