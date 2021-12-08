import React, { Component } from 'react';
import { Link } from "react-router-dom";

// Reactstrap
import { Dropdown, DropdownToggle, DropdownMenu, Row, Col } from "reactstrap";

//i18n
import { withNamespaces } from "react-i18next";

//Import Images
import megamenuImg from "../../assets/images/megamenu-img.png";

class MegaMenu extends Component {
    state = {
        megaMenu : false
    }
    render() {
        return (
            <React.Fragment>
                        <Dropdown  className="dropdown-mega d-none d-lg-block ml-2" isOpen={this.state.megaMenu} toggle={() => { this.setState({ megaMenu: !this.state.megaMenu }) }}>
                            <DropdownToggle tag="button" type="button" caret className="btn header-item waves-effect">
                                {this.props.t('Mega Menu')}{" "}
                                <i className="mdi mdi-chevron-down"></i> 
                            </DropdownToggle>
                            <DropdownMenu className="dropdown-megamenu">
                                <Row>
                                    <Col sm={8}>
                
                                        <Row>
                                            <Col md={4}>
                                                <h5 className="font-size-14 mt-0">{this.props.t('UI Components')}</h5>
                                                <ul className="list-unstyled megamenu-list">
                                                    <li>
                                                        <Link to="#">{this.props.t('Lightbox')}</Link>
                                                    </li>
                                                    <li>
                                                        <Link to="#">{this.props.t('Range Slider')}</Link>
                                                    </li>
                                                    <li>
                                                        <Link to="#">{this.props.t('Sweet Alert')}</Link>
                                                    </li>
                                                    <li>
                                                        <Link to="#">{this.props.t('Rating')}</Link>
                                                    </li>
                                                    <li>
                                                        <Link to="#">{this.props.t('Forms')}</Link>
                                                    </li>
                                                    <li>
                                                        <Link to="#">{this.props.t('Tables')}</Link>
                                                    </li>
                                                    <li>
                                                        <Link to="#">{this.props.t('Charts')}</Link>
                                                    </li>
                                                </ul>
                                            </Col>

                                            <Col md={4}>
                                                <h5 className="font-size-14 mt-0">{this.props.t('Applications')}</h5>
                                                <ul className="list-unstyled megamenu-list">
                                                    <li>
                                                        <Link to="#">{this.props.t('Ecommerce')}</Link>
                                                    </li>
                                                    <li>
                                                        <Link to="#">{this.props.t('Calendar')}</Link>
                                                    </li>
                                                    <li>
                                                        <Link to="#">{this.props.t('Email')}</Link>
                                                    </li>
                                                    <li>
                                                        <Link to="#">{this.props.t('Projects')}</Link>
                                                    </li>
                                                    <li>
                                                        <Link to="#">{this.props.t('Tasks')}</Link>
                                                    </li>
                                                    <li>
                                                        <Link to="#">{this.props.t('Contacts')}</Link>
                                                    </li>
                                                </ul>
                                            </Col>

                                            <Col md={4}>
                                                <h5 className="font-size-14 mt-0">{this.props.t('Extra Pages')}</h5>
                                                <ul className="list-unstyled megamenu-list">
                                                    <li>
                                                        <Link to="#">{this.props.t('Light Sidebar')}</Link>
                                                    </li>
                                                    <li>
                                                        <Link to="#">{this.props.t('Compact Sidebar')}</Link>
                                                    </li>
                                                    <li>
                                                        <Link to="#">{this.props.t('Horizontal layout')}</Link>
                                                    </li>
                                                    <li>
                                                        <Link to="#">{this.props.t('Maintenance')}</Link>
                                                    </li>
                                                    <li>
                                                        <Link to="#">{this.props.t('Coming Soon')}</Link>
                                                    </li>
                                                    <li>
                                                        <Link to="#">{this.props.t('Timeline')}</Link>
                                                    </li>
                                                    <li>
                                                        <Link to="#">{this.props.t('FAQs')}</Link>
                                                    </li>
                                        
                                                </ul>
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col sm={4}>
                                        <Row>
                                            <Col sm={6}>
                                                <h5 className="font-size-14 mt-0">{this.props.t('UI Components')}</h5>
                                                <ul className="list-unstyled megamenu-list">
                                                    <li>
                                                        <Link to="#">{this.props.t('Lightbox')}</Link>
                                                    </li>
                                                    <li>
                                                        <Link to="#">{this.props.t('Range Slider')}</Link>
                                                    </li>
                                                    <li>
                                                        <Link to="#">{this.props.t('Sweet Alert')}</Link>
                                                    </li>
                                                    <li>
                                                        <Link to="#">{this.props.t('Rating')}</Link>
                                                    </li>
                                                    <li>
                                                        <Link to="#">{this.props.t('Forms')}</Link>
                                                    </li>
                                                    <li>
                                                        <Link to="#">{this.props.t('Tables')}</Link>
                                                    </li>
                                                    <li>
                                                        <Link to="#">{this.props.t('Charts')}</Link>
                                                    </li>
                                                </ul>
                                            </Col>

                                            <Col sm={5}>
                                                <div>
                                                    <img src={megamenuImg} alt="" className="img-fluid mx-auto d-block"/>
                                                </div>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>

                            </DropdownMenu>
                        </Dropdown>
            </React.Fragment>
        );
    }
}

export default withNamespaces()(MegaMenu);