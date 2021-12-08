import React, { Component } from "react";

// MetisMenu
import MetisMenu from "metismenujs";
import { withRouter } from "react-router-dom";
import { Link } from "react-router-dom";

//i18n
import { withNamespaces } from "react-i18next";

import { connect } from "react-redux";
import {
  changeLayout,
  changeLayoutWidth,
  changeSidebarTheme,
  changeSidebarType,
  changePreloader,
} from "../../store/actions";

class SidebarContent extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.initMenu();
  }

  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {
      if (this.props.type !== prevProps.type) {
        this.initMenu();
      }
    }
  }

  initMenu() {
    new MetisMenu("#side-menu");

    var matchingMenuItem = null;
    var ul = document.getElementById("side-menu");
    var items = ul.getElementsByTagName("a");
    for (var i = 0; i < items.length; ++i) {
      if (this.props.location.pathname === items[i].pathname) {
        matchingMenuItem = items[i];
        break;
      }
    }
    if (matchingMenuItem) {
      this.activateParentDropdown(matchingMenuItem);
    }
  }

  activateParentDropdown = (item) => {
    item.classList.add("active");
    const parent = item.parentElement;

    if (parent) {
      parent.classList.add("mm-active");
      const parent2 = parent.parentElement;

      if (parent2) {
        parent2.classList.add("mm-show");

        const parent3 = parent2.parentElement;

        if (parent3) {
          parent3.classList.add("mm-active"); // li
          parent3.childNodes[0].classList.add("mm-active"); //a
          const parent4 = parent3.parentElement;
          if (parent4) {
            parent4.classList.add("mm-active");
          }
        }
      }
      return false;
    }
    return false;
  };

  render() {
    return (
      <React.Fragment>
        <div id="sidebar-menu">
          <ul className="metismenu list-unstyled" id="side-menu">
            {/* <li className="menu-title">{this.props.t("Menu")}</li> */}

            <li>
              <Link to="/dashboard" className="waves-effect">
                <i className=" ri-terminal-window-line"></i>
                <span className="badge badge-pill badge-success float-right"></span>
                <span className="ml-1">{this.props.t("통합대시보드")}</span>
              </Link>
            </li>

            <li>
              <Link to="/#" className="has-arrow waves-effect">
                <i className="ri-share-line"></i>
                <span className="ml-1">{this.props.t("클러스터 관리")}</span>
              </Link>
              <ul className="sub-menu" aria-expanded="false">
                <li>
                  <Link to="/cluster/core">
                    {this.props.t("코어 클라우드 관리")}
                  </Link>
                </li>
                <li>
                  <Link to="/cluster/edge">
                    {this.props.t("클라우드 엣지 관리")}
                  </Link>
                </li>
              </ul>
            </li>

            <li>
              <Link to="/workspace" className="waves-effect">
                <i className=" ri-community-fill"></i>
                <span className="ml-1">{this.props.t("워크스페이스")}</span>
              </Link>
            </li>

            <li>
              <Link to="/#" className="has-arrow waves-effect">
                <i className="ri-window-2-line"></i>
                <span className="ml-1">{this.props.t("프로젝트")}</span>
              </Link>
              <ul className="sub-menu" aria-expanded="false">
                <li>
                  <Link to="/project/user">
                    {this.props.t("사용자 프로젝트")}
                  </Link>
                </li>
                <li>
                  <Link to="/project/system">
                    {this.props.t("시스템 프로젝트")}
                  </Link>
                </li>
              </ul>
            </li>

            <li>
              <Link to="/#" className="has-arrow waves-effect">
                <i className=" ri-folders-line"></i>
                <span className="ml-1">{this.props.t("워크로드")}</span>
              </Link>
              <ul className="sub-menu" aria-expanded="false">
                {/* <li>
                  <Link to="/workload/app">{this.props.t("앱")}</Link>
                </li> */}

                <li>
                  <Link to="/workload/deployment">{this.props.t("디플로이먼트")}</Link>
                </li>
                <li>
                  <Link to="/workload/service">{this.props.t("서비스")}</Link>
                </li>
                <li>
                  <Link to="/workload/pod">{this.props.t("파드")}</Link>
                </li>
                <li>
                  <Link to="/workload/job">{this.props.t("잡")}</Link>
                </li>

                {/* <li>
                  <Link to="/workload/route">{this.props.t("라우트")}</Link>
                </li> */}

                {/* <li><Link to="ecommerce-shops">{this.props.t('Shops')}</Link></li> */}
              </ul>
            </li>

            <li>
              <Link to="/#" className="has-arrow waves-effect">
                <i className="ri-bar-chart-line"></i>
                <span className="ml-1">{this.props.t("모니터링")}</span>
              </Link>
              <ul className="sub-menu" aria-expanded="false">
                <li>
                  <Link to="/monitoring/cluster" className=" waves-effect">
                    <span className="ml-1">
                      {this.props.t("클러스터 모니터링")}
                    </span>
                  </Link>
                </li>
                <li>
                  <Link to="/monitoring/app" className=" waves-effect">
                    <span className="ml-1">
                      {this.props.t("어플리케이션 모니터링")}
                    </span>
                  </Link>
                </li>
              </ul>
            </li>

            {/* <li>
              <Link to="charts-chartjs" className=" waves-effect">
                <i className="ri-terminal-window-line"></i>
                <span className="ml-1">
                  {this.props.t("클러스터 모니터링")}
                </span>
              </Link>
            </li> */}

            {/* <li>
              <Link to="charts-apex" className=" waves-effect">
                <i className="ri-bar-chart-line"></i>
                <span className="ml-1">
                  {this.props.t("어플리케이션 모니터링")}
                </span>
              </Link>
            </li> */}

            {/* <li>
                            <Link to="apps-kanban-board" className=" waves-effect">
                                <i className="ri-artboard-2-line"></i>
                                <span className="ml-1">{this.props.t('Kanban Board')}</span>
                            </Link>
                        </li> */}
            <li>
              <Link to="/#" className="has-arrow waves-effect">
                <i className="ri-account-circle-line"></i>
                <span className="ml-1">{this.props.t("인증")}</span>
              </Link>
              <ul className="sub-menu" aria-expanded="false">
                <li>
                  <Link to="/auth/user">{this.props.t("계정")}</Link>
                </li>
                <li>
                  <Link to="tables-responsive">{this.props.t("역할")}</Link>
                </li>
              </ul>
            </li>

            <li className="menu-title">{this.props.t("Pages")}</li>

            <li>
              <Link to="/#" className="has-arrow waves-effect">
                <i className="ri-account-circle-line"></i>
                <span className="ml-1">{this.props.t("Authentication")}</span>
              </Link>
              <ul className="sub-menu" aria-expanded="false">
                <li>
                  <Link to="auth-login">{this.props.t("Login")}</Link>
                </li>
                <li>
                  <Link to="auth-register">{this.props.t("Register")}</Link>
                </li>
                <li>
                  <Link to="auth-recoverpw">
                    {this.props.t("Recover Password")}
                  </Link>
                </li>
                <li>
                  <Link to="auth-lock-screen">
                    {this.props.t("Lock Screen")}
                  </Link>
                </li>
              </ul>
            </li>

            <li>
              <Link to="/#" className="has-arrow waves-effect">
                <i className="ri-profile-line"></i>
                <span className="ml-1">{this.props.t("Utility")}</span>
              </Link>
              <ul className="sub-menu" aria-expanded="false">
                <li>
                  <Link to="pages-starter">{this.props.t("Starter Page")}</Link>
                </li>
                <li>
                  <Link to="pages-maintenance">
                    {this.props.t("Maintenance")}
                  </Link>
                </li>
                <li>
                  <Link to="pages-comingsoon">
                    {this.props.t("Coming Soon")}
                  </Link>
                </li>
                <li>
                  <Link to="pages-timeline">{this.props.t("Timeline")}</Link>
                </li>
                <li>
                  <Link to="pages-faqs">{this.props.t("FAQs")}</Link>
                </li>
                <li>
                  <Link to="pages-pricing">{this.props.t("Pricing")}</Link>
                </li>
                <li>
                  <Link to="pages-404">{this.props.t("Error 404")}</Link>
                </li>
                <li>
                  <Link to="pages-500">{this.props.t("Error 500")}</Link>
                </li>
              </ul>
            </li>

            ///
            <li className="menu-title">{this.props.t("Components")}</li>

            <li>
              <Link to="/#" className="has-arrow waves-effect">
                <i className="ri-pencil-ruler-2-line"></i>
                <span className="ml-1">{this.props.t("UI Elements")}</span>
              </Link>
              <ul className="sub-menu" aria-expanded="false">
                <li>
                  <Link to="ui-alerts">{this.props.t("Alerts")}</Link>
                </li>
                <li>
                  <Link to="ui-buttons">{this.props.t("Buttons")}</Link>
                </li>
                <li>
                  <Link to="ui-cards">{this.props.t("Cards")}</Link>
                </li>
                <li>
                  <Link to="ui-carousel">{this.props.t("Carousel")}</Link>
                </li>
                <li>
                  <Link to="ui-dropdowns">{this.props.t("Dropdowns")}</Link>
                </li>
                <li>
                  <Link to="ui-grid">{this.props.t("Grid")}</Link>
                </li>
                <li>
                  <Link to="ui-images">{this.props.t("Images")}</Link>
                </li>
                <li>
                  <Link to="ui-lightbox">{this.props.t("Lightbox")}</Link>
                </li>
                <li>
                  <Link to="ui-modals">{this.props.t("Modals")}</Link>
                </li>
                <li>
                  <Link to="ui-rangeslider">
                    {this.props.t("Range Slider")}
                  </Link>
                </li>
                <li>
                  <Link to="ui-roundslider">
                    {this.props.t("Round Slider")}
                  </Link>
                </li>
                <li>
                  <Link to="ui-session-timeout">
                    {this.props.t("Session Timeout")}
                  </Link>
                </li>
                <li>
                  <Link to="ui-progressbars">
                    {this.props.t("Progress Bars")}
                  </Link>
                </li>
                <li>
                  <Link to="ui-sweet-alert">
                    {this.props.t("Sweet Alerts")}
                  </Link>
                </li>
                <li>
                  <Link to="ui-tabs-accordions">
                    {this.props.t("Tabs & Accordions")}
                  </Link>
                </li>
                <li>
                  <Link to="ui-typography">{this.props.t("Typography")}</Link>
                </li>
                <li>
                  <Link to="ui-video">{this.props.t("Video")}</Link>
                </li>
                <li>
                  <Link to="ui-general">{this.props.t("General")}</Link>
                </li>
                <li>
                  <Link to="ui-rating">{this.props.t("Rating")}</Link>
                </li>
                <li>
                  <Link to="ui-notifications">
                    {this.props.t("Notifications")}
                  </Link>
                </li>
              </ul>
            </li>

            <li>
              <Link to="/#" className="waves-effect">
                <i className="ri-eraser-fill"></i>
                <span className="badge badge-pill badge-danger float-right">
                  6
                </span>
                <span className="ml-1">{this.props.t("Forms")}</span>
              </Link>
              <ul className="sub-menu" aria-expanded="false">
                <li>
                  <Link to="form-elements">{this.props.t("Elements")}</Link>
                </li>
                <li>
                  <Link to="form-validation">{this.props.t("Validation")}</Link>
                </li>
                <li>
                  <Link to="form-advanced">
                    {this.props.t("Advanced Plugins")}
                  </Link>
                </li>
                <li>
                  <Link to="form-editors">{this.props.t("Editors")}</Link>
                </li>
                <li>
                  <Link to="form-uploads">{this.props.t("File Upload")}</Link>
                </li>
                <li>
                  <Link to="form-xeditable">{this.props.t("X-editable")}</Link>
                </li>
                <li>
                  <Link to="form-wizard">{this.props.t("Wizard")}</Link>
                </li>
                <li>
                  <Link to="form-mask">{this.props.t("Mask")}</Link>
                </li>
              </ul>
            </li>

            <li>
              <Link to="/#" className="has-arrow waves-effect">
                <i className="ri-table-2"></i>
                <span className="ml-1">{this.props.t("Tables")}</span>
              </Link>
              <ul className="sub-menu" aria-expanded="false">
                <li>
                  <Link to="tables-basic">{this.props.t("Basic Tables")}</Link>
                </li>
                <li>
                  <Link to="tables-datatable">
                    {this.props.t("Data Tables")}
                  </Link>
                </li>
                <li>
                  <Link to="tables-responsive">
                    {this.props.t("Responsive Table")}
                  </Link>
                </li>
                <li>
                  <Link to="tables-editable">
                    {this.props.t("Editable Table")}
                  </Link>
                </li>
              </ul>
            </li>

            <li>
              <Link to="/#" className="has-arrow waves-effect">
                <i className="ri-bar-chart-line"></i>
                <span className="ml-1">{this.props.t("Charts")}</span>
              </Link>
              <ul className="sub-menu" aria-expanded="false">
                <li>
                  <Link to="charts-apex">{this.props.t("Apexcharts")}</Link>
                </li>
                <li>
                  <Link to="charts-chartjs">{this.props.t("Chartjs")}</Link>
                </li>
                <li>
                  <Link to="charts-knob">{this.props.t("Jquery Knob")}</Link>
                </li>
                <li>
                  <Link to="charts-sparkline">{this.props.t("Sparkline")}</Link>
                </li>
              </ul>
            </li>

            <li>
              <Link to="/#" className="has-arrow waves-effect">
                <i className="ri-brush-line"></i>
                <span className="ml-1">{this.props.t("Icons")}</span>
              </Link>
              <ul className="sub-menu" aria-expanded="false">
                <li>
                  <Link to="icons-remix">{this.props.t("Remix Icons")}</Link>
                </li>
                <li>
                  <Link to="icons-materialdesign">
                    {this.props.t("Material Design")}
                  </Link>
                </li>
                <li>
                  <Link to="icons-dripicons">{this.props.t("Dripicons")}</Link>
                </li>
                <li>
                  <Link to="icons-fontawesome">
                    {this.props.t("Font awesome 5")}
                  </Link>
                </li>
              </ul>
            </li>

            <li>
              <Link to="/#" className="has-arrow waves-effect">
                <i className="ri-map-pin-line"></i>
                <span className="ml-1">{this.props.t("Maps")}</span>
              </Link>
              <ul className="sub-menu" aria-expanded="false">
                <li>
                  <Link to="maps-google">{this.props.t("Google Maps")}</Link>
                </li>
                <li>
                  <Link to="maps-vector">{this.props.t("Vector Maps")}</Link>
                </li>
              </ul>
            </li>

            <li>
              <Link to="/#" className="has-arrow waves-effect">
                <i className="ri-share-line"></i>
                <span className="ml-1">{this.props.t("Multi Level")}</span>
              </Link>
              <ul className="sub-menu" aria-expanded="true">
                <li>
                  <Link to="/#">{this.props.t("Level 1.1")}</Link>
                </li>
                <li>
                  <Link to="/#" className="has-arrow">
                    {this.props.t("Level 1.2")}
                  </Link>
                  <ul className="sub-menu" aria-expanded="true">
                    <li>
                      <Link to="/clustermanage-corecloud">
                        {this.props.t("Level 2.1")}
                      </Link>
                    </li>
                    <li>
                      <Link to="/#">{this.props.t("Level 2.2")}</Link>
                    </li>
                  </ul>
                </li>
              </ul>
            </li>
          </ul >
        </div >
      </React.Fragment >
    );
  }
}

const mapStatetoProps = (state) => {
  return { ...state.Layout };
};

export default withRouter(
  connect(mapStatetoProps, {
    changeLayout,
    changeSidebarTheme,
    changeSidebarType,
    changeLayoutWidth,
    changePreloader,
  })(withNamespaces()(SidebarContent))
);
