import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Dropdown, DropdownToggle, DropdownMenu, Row, Col, Media } from "reactstrap";
import SimpleBar from "simplebar-react";

//i18b
import { withNamespaces } from "react-i18next";

//Import images
import avatar3 from "../../../assets/images/users/avatar-3.jpg";
import avatar4 from "../../../assets/images/users/avatar-4.jpg";

class NotificationDropdown extends Component {
    constructor(props) {
        super(props);
        this.state = {
            menu: false
        };
        this.toggle = this.toggle.bind(this);
    }

    toggle() {
        this.setState(prevState => ({
            menu: !prevState.menu
        }));
    }
    render() {
        return (
            <React.Fragment>
                {/* <Dropdown isOpen={this.state.menu} toggle={this.toggle} className="d-inline-block">
                            <DropdownToggle tag="button" className="btn header-item noti-icon waves-effect" id="page-header-notifications-dropdown">
                                <i className="ri-notification-3-line"></i>
                                <span className="noti-dot"></span>
                            </DropdownToggle>
                            <DropdownMenu right className="dropdown-menu-lg p-0"
                                aria-labelledby="page-header-notifications-dropdown">
                                <div className="p-3">
                                    <Row className="align-items-center">
                                        <Col>
                                            <h6 className="m-0"> {this.props.t('Notifications')} </h6>
                                        </Col>
                                        <div className="col-auto">
                                            <Link to="#" className="small"> {this.props.t('View All')}</Link>
                                        </div>
                                    </Row>
                                </div>
                                <SimpleBar style={{maxHeight: "230px"}}>
                                    <Link to="#" className="text-reset notification-item">
                                        <Media>
                                            <div className="avatar-xs mr-3">
                                                <span className="avatar-title bg-primary rounded-circle font-size-16">
                                                    <i className="ri-shopping-cart-line"></i>
                                                </span>
                                            </div>
                                            <Media body>
                                                <h6 className="mt-0 mb-1">{this.props.t('Your order is placed')}</h6>
                                                <div className="font-size-12 text-muted">
                                                    <p className="mb-1">{this.props.t('If several languages coalesce the grammar')}</p>
                                                    <p className="mb-0"><i className="mdi mdi-clock-outline"></i> {this.props.t('3 min ago')}</p>
                                                </div>
                                            </Media>
                                        </Media>
                                    </Link>
                                    <Link to="#" className="text-reset notification-item">
                                        <Media>
                                            <img src={avatar3} className="mr-3 rounded-circle avatar-xs" alt="user-pic"/>
                                            <Media body>
                                                <h6 className="mt-0 mb-1">{this.props.t('James Lemire')}</h6>
                                                <div className="font-size-12 text-muted">
                                                    <p className="mb-1">{this.props.t('It will seem like simplified English.')}</p>
                                                    <p className="mb-0"><i className="mdi mdi-clock-outline"></i> {this.props.t('1 hours ago')}</p>
                                                </div>
                                            </Media>
                                        </Media>
                                    </Link>
                                    <Link to="#" className="text-reset notification-item">
                                        <Media>
                                            <div className="avatar-xs mr-3">
                                                <span className="avatar-title bg-success rounded-circle font-size-16">
                                                    <i className="ri-checkbox-circle-line"></i>
                                                </span>
                                            </div>
                                            <Media body>
                                                <h6 className="mt-0 mb-1">{this.props.t('Your item is shipped')}</h6>
                                                <div className="font-size-12 text-muted">
                                                    <p className="mb-1">{this.props.t('If several languages coalesce the grammar')}</p>
                                                    <p className="mb-0"><i className="mdi mdi-clock-outline"></i> {this.props.t('3 min ago')}</p>
                                                </div>
                                            </Media>
                                        </Media>
                                    </Link>

                                    <Link to="#" className="text-reset notification-item">
                                        <Media>
                                            <img src={avatar4} className="mr-3 rounded-circle avatar-xs" alt="user-pic"/>
                                            <Media body>
                                                <h6 className="mt-0 mb-1">{this.props.t('Salena Layfield')}</h6>
                                                <div className="font-size-12 text-muted">
                                                    <p className="mb-1">{this.props.t('As a skeptical Cambridge friend of mine occidental.')}</p>
                                                    <p className="mb-0"><i className="mdi mdi-clock-outline"></i> {this.props.t('1 hours ago')}</p>
                                                </div>
                                            </Media>
                                        </Media>
                                    </Link>
                                </SimpleBar>
                                <div className="p-2 border-top">
                                    <Link to="#" className="btn btn-sm btn-link font-size-14 btn-block text-center">
                                        <i className="mdi mdi-arrow-right-circle mr-1"></i>{this.props.t(' View More')}
                                    </Link>
                                </div>
                            </DropdownMenu>
                        </Dropdown> */}
            </React.Fragment>
        );
    }
}
export default withNamespaces()(NotificationDropdown);
