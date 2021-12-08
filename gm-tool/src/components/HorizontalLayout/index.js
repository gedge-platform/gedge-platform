import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import {
  changeLayout,
  changeTopbarTheme,
  toggleRightSidebar,
  changeLayoutWidth,
} from "../../store/actions";

// Other Layout related Component
import Navbar from "./Navbar";
import Header from "./Header";
// import Footer from "./Footer";
import Rightbar from "../CommonForBoth/Rightbar";

class Layout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isMenuOpened: false
    };
    this.toggleRightSidebar = this.toggleRightSidebar.bind(this);
  }

  /**
  * Open/close right sidebar
  */
  toggleRightSidebar() {
    this.props.toggleRightSidebar();
  }

  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {
      if (this.props.isPreloader === true) {
        document.getElementById('preloader').style.display = "block";
        document.getElementById('status').style.display = "block";

        setTimeout(function () {

          document.getElementById('preloader').style.display = "none";
          document.getElementById('status').style.display = "none";

        }, 2500);
      }
      else {
        document.getElementById('preloader').style.display = "none";
        document.getElementById('status').style.display = "none";
      }
    }
  }

  componentDidMount() {

    // Scrollto 0,0
    window.scrollTo(0, 0);

    const title = this.props.location.pathname;
    let currentage = title.charAt(1).toUpperCase() + title.slice(2);

    document.title =
      currentage + " | GEdge Platform";

    this.props.changeLayout('horizontal');
    if (this.props.topbarTheme) {
      this.props.changeTopbarTheme(this.props.topbarTheme);
    }
    if (this.props.layoutWidth) {
      this.props.changeLayoutWidth(this.props.layoutWidth);
    }
    if (this.props.showRightSidebar) {
      this.toggleRightSidebar();
    }
  }

  /**
   * Opens the menu - mobile
   */
  openMenu = e => {
    this.setState({ isMenuOpened: !this.state.isMenuOpened });
  };
  render() {
    return (
      <React.Fragment>

        <div id="preloader">
          <div id="status">
            <div className="spinner">
              <i className="ri-loader-line spin-icon"></i>
            </div>
          </div>
        </div>

        <div id="layout-wrapper">
          {/* <Header theme={this.props.topbarTheme}
            isMenuOpened={this.state.isMenuOpened}
            toggleRightSidebar={this.toggleRightSidebar}
            openLeftMenuCallBack={this.openMenu}
          /> */}
          <Navbar menuOpen={this.state.isMenuOpened} />
          <div className="main-content">
            {this.props.children}
            {/* <Footer /> */}
          </div>
        </div>
        {/* <Rightbar /> */}
      </React.Fragment>
    );
  }
}
const mapStatetoProps = state => {
  return {
    ...state.Layout
  };
};
export default connect(mapStatetoProps, {
  changeTopbarTheme, toggleRightSidebar, changeLayout, changeLayoutWidth
})(withRouter(Layout));
