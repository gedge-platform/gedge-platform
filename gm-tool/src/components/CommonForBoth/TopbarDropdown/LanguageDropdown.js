import React, { Component } from "react";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from "reactstrap";

//i18n
import i18n from '../../../i18n';
import { withNamespaces } from 'react-i18next';

// falgs
import usFlag from "../../../assets/images/flags/us.jpg";
import spain from "../../../assets/images/flags/spain.jpg";
import germany from "../../../assets/images/flags/germany.jpg";
import italy from "../../../assets/images/flags/italy.jpg";
import russia from "../../../assets/images/flags/russia.jpg";

class LanguageDropdown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      menu: false,
      lng: "English",
      flag: usFlag
    };
    this.toggle = this.toggle.bind(this);
    this.changeLanguageAction.bind(this);
  }

  toggle() {
    this.setState(prevState => ({
      menu: !prevState.menu
    }));
  }

  changeLanguageAction = (lng) => {

    //set the selected language to i18n
    i18n.changeLanguage(lng);

    if (lng === "sp")
      this.setState({ lng: "Spanish", flag: spain });
    else if (lng === "gr")
      this.setState({ lng: "German", flag: germany });
    else if (lng === "rs")
      this.setState({ lng: "Russian", flag: russia });
    else if (lng === "it")
      this.setState({ lng: "Italian", flag: italy });
    else if (lng === "eng")
      this.setState({ lng: "English", flag: usFlag });
  }

  render() {

    return (
      <React.Fragment>
        {/* <Dropdown isOpen={this.state.menu} toggle={this.toggle} className="d-none d-sm-inline-block">
                            <DropdownToggle tag="button" className="btn header-item waves-effect">
                                <img className="" src={this.state.flag} alt="Header Language" height="16"/>{'  '}
                                <span className="align-middle">{this.state.lng}</span>
                            </DropdownToggle>

                            <DropdownMenu right>

                                <DropdownItem active={this.state.lng === "English" ? true : false } href="" onClick={() => this.changeLanguageAction('eng')} className="notify-item">
                                    <img src={usFlag} alt="user" className="mr-1" height="12"/> <span className="align-middle">English</span>
                                </DropdownItem>

                                <DropdownItem href="" active={this.state.lng === "Spanish" ? true : false } onClick={() => this.changeLanguageAction('sp')} className="notify-item">
                                    <img src={spain} alt="user" className="mr-1" height="12"/> <span className="align-middle">Spanish</span>
                                </DropdownItem>

                                <DropdownItem href="" active={this.state.lng === "German" ? true : false } onClick={() => this.changeLanguageAction('gr')} className=" notify-item">
                                    <img src={germany} alt="user" className="mr-1" height="12"/> <span className="align-middle">German</span>
                                </DropdownItem>
                                
                                <DropdownItem href="" active={this.state.lng === "Italian" ? true : false } onClick={() => this.changeLanguageAction('it')} className=" notify-item">
                                    <img src={italy} alt="user" className="mr-1" height="12"/> <span className="align-middle">Italian</span>
                                </DropdownItem>
                                
                                <DropdownItem href="" active={this.state.lng === "Russian" ? true : false } onClick={() => this.changeLanguageAction('rs')} className=" notify-item">
                                    <img src={russia} alt="user" className="mr-1" height="12"/> <span className="align-middle">Russian</span>
                                </DropdownItem>
                            </DropdownMenu>
                        </Dropdown> */}
      </React.Fragment>
    );
  }
}

export default withNamespaces()(LanguageDropdown);
