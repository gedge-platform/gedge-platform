import React, { Component } from 'react';
import { Collapse, Card, CardBody, CardHeader } from "reactstrap";
import { Link } from "react-router-dom";

class Accordian extends Component {
    constructor(props) {
        super(props);
        this.state = {
            col1: true,
			col2: false,
			col3: false,
            col4: false,
            col5:false,
        }
        this.t_col1 = this.t_col1.bind(this);
		this.t_col2 = this.t_col2.bind(this);
		this.t_col3 = this.t_col3.bind(this);
        this.t_col4 = this.t_col4.bind(this);
        this.t_col5 = this.t_col5.bind(this);
    }

    t_col1() {
		this.setState({ col1: !this.state.col1, col2 : false, col3 : false, col4 : false, col5 : false });
	}
	t_col2() {
		this.setState({ col2: !this.state.col2, col1 : false, col3 : false, col4 : false, col5 : false });
	}
	t_col3() {
		this.setState({ col3: !this.state.col3, col2 : false, col1 : false, col4 : false, col5 : false });
	}
	t_col4() {
		this.setState({ col4: !this.state.col4, col2 : false, col3 : false, col1 : false, col5 : false });
    }
    t_col5() {
		this.setState({ col5: !this.state.col5, col2 : false, col3 : false, col1 : false, col4 : false });
    }
    
    
    render() {
        return (
            <React.Fragment>
                                                                    <Card>
                                                                        <Link to="#" className="text-dark" onClick={this.t_col1} style={{ cursor: "pointer" }}>
                                                                            <CardHeader id="gen-question-headingOne">
                                                                                <h5 className="font-size-14 m-0">
                                                                                    <i className={this.state.col1 ? "mdi mdi-chevron-up accor-arrow-icon" : "mdi mdi-chevron-right accor-arrow-icon"}></i> {this.props.question1}
                                                                                    
                                                                                </h5>
                                                                            </CardHeader>
                                                                        </Link>
                                
                                                                        <Collapse isOpen={this.state.col1}>
                                                                            <CardBody>
                                                                            {this.props.answer1}
                                                                            </CardBody>
                                                                        </Collapse>
                                                                    </Card>
                                                                    <Card>
                                                                        <Link to="#" onClick={this.t_col2} style={{ cursor: "pointer" }}>
                                                                            <CardHeader id="gen-question-headingTwo">
                                                                                <h5 className="font-size-14 m-0">
                                                                                    <i className={this.state.col2 ? "mdi mdi-chevron-up accor-arrow-icon" : "mdi mdi-chevron-right accor-arrow-icon"}></i> {this.props.question2}
                                                                                </h5>
                                                                            </CardHeader>
                                                                        </Link>
                                                                        <Collapse isOpen={this.state.col2} >
                                                                            <CardBody>
                                                                            {this.props.answer2}
                                                                            </CardBody>
                                                                        </Collapse>
                                                                    </Card>
                                                                    <Card>
                                                                        <Link to="#" onClick={this.t_col3} style={{ cursor: "pointer" }}>
                                                                            <CardHeader id="gen-question-headingThree">
                                                                                <h5 className="font-size-14 m-0">
                                                                                    <i className={this.state.col3 ? "mdi mdi-chevron-up accor-arrow-icon" : "mdi mdi-chevron-right accor-arrow-icon"}></i> {this.props.question3}
                                                                                </h5>
                                                                            </CardHeader>
                                                                        </Link>
                                                                        <Collapse isOpen={this.state.col3}>
                                                                            <CardBody>
                                                                            {this.props.answer3}
                                                                            </CardBody>
                                                                        </Collapse>
                                                                    </Card>
                                                                    <Card>
                                                                        <Link to="#" onClick={this.t_col4} style={{ cursor: "pointer" }}>
                                                                            <CardHeader id="gen-question-headingFour">
                                                                                <h5 className="font-size-14 m-0">
                                                                                    <i className={this.state.col4 ? "mdi mdi-chevron-up accor-arrow-icon" : "mdi mdi-chevron-right accor-arrow-icon"}></i>{this.props.question4}
                                                                                </h5>
                                                                            </CardHeader>
                                                                        </Link>
                                                                        <Collapse isOpen={this.state.col4}>
                                                                            <CardBody>
                                                                            {this.props.answer4}
                                                                            </CardBody>
                                                                        </Collapse>
                                                                    </Card>
                                                                    <Card>
                                                                        <Link to="#" onClick={this.t_col5} style={{ cursor: "pointer" }}>
                                                                            <CardHeader id="gen-question-headingFive">
                                                                                <h5 className="font-size-14 m-0">
                                                                                    <i className={this.state.col5 ? "mdi mdi-chevron-up accor-arrow-icon" : "mdi mdi-chevron-right accor-arrow-icon"}></i> {this.props.question5}
                                                                                </h5>
                                                                            </CardHeader>
                                                                        </Link>
                                                                        <Collapse isOpen={this.state.col5}>
                                                                            <CardBody>
                                                                            {this.props.answer5}
                                                                            </CardBody>
                                                                        </Collapse>
                                                                    </Card>
            </React.Fragment>
        );
    }
}

export default Accordian;