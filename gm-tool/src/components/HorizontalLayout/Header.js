import React, { Component } from "react";

import { connect } from "react-redux";

import { Link } from "react-router-dom";

// reactstrap
import { Row, Col, Dropdown, DropdownToggle, DropdownMenu, Form, Input, InputGroup, InputGroupAddon, Button, FormGroup } from "reactstrap";

//i18n
import { withNamespaces } from "react-i18next";

// Import menuDropdown
import LanguageDropdown from "../CommonForBoth/TopbarDropdown/LanguageDropdown";
import NotificationDropdown from "../CommonForBoth/TopbarDropdown/NotificationDropdown";
import ProfileMenu from "../CommonForBoth/TopbarDropdown/ProfileMenu";


//Import Logos 
import logoSmLight from "../../assets/images/logo-sm-light.png";
import logoLight from "../../assets/images/logo-light.png";
import logoDark from "../../assets/images/logo-dark.png";

import logoSmDark from "../../assets/images/logo-sm-dark.png";

// profile images
import github from "../../assets/images/brands/github.png";
import bitbucket from "../../assets/images/brands/bitbucket.png";
import dribbble from "../../assets/images/brands/dribbble.png";
import dropbox from "../../assets/images/brands/dropbox.png";
import mail_chimp from "../../assets/images/brands/mail_chimp.png";
import slack from "../../assets/images/brands/slack.png";

//Import mega menu image
import megamenuImg from "../../assets/images/megamenu-img.png";

// Redux Store
import { toggleRightSidebar } from "../../store/actions";


class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isSearch: false,
            isMegaMenu: false,
            isProfile: false,
        };
        this.toggleMenu = this.toggleMenu.bind(this);
        this.toggleRightbar = this.toggleRightbar.bind(this);
        this.toggleFullscreen = this.toggleFullscreen.bind(this);
        this.toggleSearch = this.toggleSearch.bind(this);
    }

    toggleSearch = () => {
        this.setState({ isSearch: !this.state.isSearch });
    }
    /**
     * Toggle sidebar
     */
    toggleMenu() {
        this.props.openLeftMenuCallBack();
    }

    /**
     * Toggles the sidebar
     */
    toggleRightbar() {
        this.props.toggleRightSidebar();
    }

    // toggleFullscreen() {
    //     if (
    //         !document.fullscreenElement &&
    //   /* alternative standard method */ !document.mozFullScreenElement &&
    //         !document.webkitFullscreenElement
    //     ) {
    //         // current working methods
    //         if (document.documentElement.requestFullscreen) {
    //             document.documentElement.requestFullscreen();
    //         } else if (document.documentElement.mozRequestFullScreen) {
    //             document.documentElement.mozRequestFullScreen();
    //         } else if (document.documentElement.webkitRequestFullscreen) {
    //             document.documentElement.webkitRequestFullscreen(
    //                 Element.ALLOW_KEYBOARD_INPUT
    //             );
    //         }
    //     } else {
    //         if (document.cancelFullScreen) {
    //             document.cancelFullScreen();
    //         } else if (document.mozCancelFullScreen) {
    //             document.mozCancelFullScreen();
    //         } else if (document.webkitCancelFullScreen) {
    //             document.webkitCancelFullScreen();
    //         }
    //     }
    // }

    render() {
        return (
            <React.Fragment>
                <header id="page-topbar">
                    <div className="navbar-header">
                        <div className="d-flex">
                            <div className="navbar-brand-box">
                                <Link to="/" className="logo logo-dark">
                                    <span className="logo-sm">
                                        <img src={logoSmDark} alt="" height="22" />
                                    </span>
                                    <span className="logo-lg">
                                        <img src={logoDark} alt="" height="30" />
                                    </span>
                                </Link>

                                <Link to="/" className="logo logo-light">
                                    <span className="logo-sm">
                                        <img src={logoSmLight} alt="" height="22" />
                                    </span>
                                    <span className="logo-lg">
                                        <img src={logoLight} alt="" height="30" />
                                    </span>
                                </Link>
                            </div>

                            <Button color="none" type="button" size="sm" onClick={this.toggleMenu} className="px-3 font-size-24 d-lg-none header-item" data-toggle="collapse" data-target="#topnav-menu-content">
                                <i className="ri-menu-2-line align-middle"></i>
                            </Button>


                            <Form className="app-search d-none d-lg-block">
                                <div className="position-relative">
                                    <Input type="text" className="form-control" placeholder={this.props.t('Search')} />
                                    <span className="ri-search-line"></span>
                                </div>
                            </Form>

                            <Dropdown isOpen={this.state.isMegaMenu} toggle={() => this.setState({ isMegaMenu: !this.state.isMegaMenu })} className="dropdown-mega d-none d-lg-block ml-2">
                                <DropdownToggle tag="button" type="button" className="btn header-item waves-effect">
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

                                                {/* <Col sm={5}>
                                                    <div>
                                                        <img src={megamenuImg} alt="" className="img-fluid mx-auto d-block" />
                                                    </div>
                                                </Col> */}
                                            </Row>
                                        </Col>
                                    </Row>

                                </DropdownMenu>
                            </Dropdown>
                        </div>

                        {/* <div className="d-flex">

                            <div className="dropdown d-inline-block d-lg-none ml-2">
                                <Button color="none" type="button" onClick={() => { this.setState({ isSearch: !this.state.isSearch }); }} className="header-item noti-icon waves-effect" id="page-header-search-dropdown" >
                                    <i className="ri-search-line"></i>
                                </Button>
                                <div className={this.state.isSearch ? "dropdown-menu dropdown-menu-lg dropdown-menu-right p-0 show" : "dropdown-menu dropdown-menu-lg dropdown-menu-right p-0"}
                                    aria-labelledby="page-header-search-dropdown">

                                    <Form className="p-3">
                                        <FormGroup className="m-0">
                                            <InputGroup>
                                                <Input type="text" className="form-control" placeholder={this.props.t('Search')} />
                                                <InputGroupAddon addonType="append">
                                                    <Button color="primary" type="submit"><i className="ri-search-line"></i></Button>
                                                </InputGroupAddon>
                                            </InputGroup>
                                        </FormGroup>
                                    </Form>
                                </div>
                            </div>

                            <LanguageDropdown />

                            <Dropdown isOpen={this.state.isProfile} toggle={() => this.setState({ isProfile: !this.state.isProfile })} className="d-none d-lg-inline-block ml-1">
                                <DropdownToggle tag="button" type="button" className="btn header-item noti-icon waves-effect">
                                    <i className="ri-apps-2-line"></i>
                                </DropdownToggle>
                                <DropdownMenu right className="dropdown-menu-lg">
                                    <div className="px-lg-2">
                                        <Row className="no-gutters">
                                            <Col>
                                                <Link className="dropdown-icon-item" to="#">
                                                    <img src={github} alt="Github" />
                                                    <span>{this.props.t('GitHub')}</span>
                                                </Link>
                                            </Col>
                                            <Col>
                                                <Link className="dropdown-icon-item" to="#">
                                                    <img src={bitbucket} alt="bitbucket" />
                                                    <span>{this.props.t('Bitbucket')}</span>
                                                </Link>
                                            </Col>
                                            <Col>
                                                <Link className="dropdown-icon-item" to="#">
                                                    <img src={dribbble} alt="dribbble" />
                                                    <span>{this.props.t('Dribbble')}</span>
                                                </Link>
                                            </Col>
                                        </Row>

                                        <Row className="no-gutters">
                                            <Col>
                                                <Link className="dropdown-icon-item" to="#">
                                                    <img src={dropbox} alt="dropbox" />
                                                    <span>{this.props.t('Dropbox')}</span>
                                                </Link>
                                            </Col>
                                            <Col>
                                                <Link className="dropdown-icon-item" to="#">
                                                    <img src={mail_chimp} alt="mail_chimp" />
                                                    <span>{this.props.t('Mail Chimp')}</span>
                                                </Link>
                                            </Col>
                                            <Col>
                                                <Link className="dropdown-icon-item" to="#">
                                                    <img src={slack} alt="slack" />
                                                    <span>{this.props.t('Slack')}</span>
                                                </Link>
                                            </Col>
                                        </Row>
                                    </div>
                                </DropdownMenu>
                            </Dropdown>

                            <div className="dropdown d-none d-lg-inline-block ml-1">
                                <Button type="button" color="none" onClick={this.toggleFullscreen} className="header-item noti-icon waves-effect" data-toggle="fullscreen">
                                    <i className="ri-fullscreen-line"></i>
                                </Button>
                            </div>

                            <NotificationDropdown />

                            <ProfileMenu />

                            <div onClick={this.toggleRightbar} className="dropdown d-inline-block">
                                <Button type="button" color="none" className="header-item noti-icon right-bar-toggle waves-effect">
                                    <i className="ri-settings-2-line"></i>
                                </Button>
                            </div>

                        </div> */}
                    </div>
                </header>
            </React.Fragment>
        );
    }
}

const mapStatetoProps = state => {
    const { layoutType } = state.Layout;
    return { layoutType };
};

export default connect(mapStatetoProps, { toggleRightSidebar })(withNamespaces()(Header));
