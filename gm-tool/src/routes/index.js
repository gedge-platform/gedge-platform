import React from "react";
import { Redirect } from "react-router-dom";

// Authentication related pages
import Login from "../pages/Authentication/Login";
import Logout from "../pages/Authentication/Logout";
import Register from "../pages/Authentication/Register";
import ForgetPwd from "../pages/Authentication/ForgetPassword";
import AuthLockScreen from "../pages/Authentication/AuthLockScreen";

// Dashboard
import Dashboard from "../pages/Dashboard/index";

// Pages Calendar

//cluster
//corecloude
import CoreCloud from "../pages/clustermanage/CoreCloud";
import CoreCloudAdd from "../pages/clustermanage/CoreCloudAdd";
import CoreDetail from "../pages/clustermanage/CoreDetail";
import PodInfo from "../pages/clustermanage/PodInfo";
import NodeList from "../pages/clustermanage/NodeList";
import Overview from "../pages/clustermanage/Overview";

import CloudEdge from "../pages/clustermanage/CloudEdge";
import EdgeAdd from "../pages/clustermanage/EdgeAdd";
import EdgeDetail from "../pages/clustermanage/EdgeDetail";

//Project
import ProjectUser from "../pages/project/ProjectUser";
import ProjectUserAdd from "../pages/project/ProjectAdd";
import ProjectDetail from "../pages/project/ProjectDetail";

import ProjectSystem from "../pages/project/ProjectSystem";
import ProjectSystemAdd from "../pages/project/ProjectSystemAdd";
// import ProjectSystemDetail from "../pages/project/ProjectSystemDetail";
//workload
import Applist from "../pages/workload/Applist";
import Appadd from "../pages/workload/Appadd";
import Service from "../pages/workload/Service";
import Deployment from "../pages/workload/Deployment";
import Pod from "../pages/workload/pod";
import Job from "../pages/workload/Job";
import Routes from "../pages/workload/Route";

//monitoring
import ClusterMonitor from "../pages/monitoring/ClusterMonitor";
import AppMonitor from "../pages/monitoring/AppMonitor";

// Pages Component
import Chat from "../pages/Chat/Chat";

//Ecommerce Pages
import Products from "../pages/Ecommerce/Products";
import ProductDetail from "../pages/Ecommerce/ProductDetail";
import Orders from "../pages/Ecommerce/Orders";
import Customers from "../pages/Ecommerce/Customers";
import Cart from "../pages/Ecommerce/Cart";
import CheckOut from "../pages/Ecommerce/CheckOut";
import Shops from "../pages/Ecommerce/Shops";
import AddProduct from "../pages/Ecommerce/AddProduct";

//Email
import EmailInbox from "../pages/Email/email-inbox";
import EmailRead from "../pages/Email/email-read";

// Charts
import ChartApex from "../pages/Charts/Apexcharts";
import ChartjsChart from "../pages/Charts/ChartjsChart";
import SparklineChart from "../pages/Charts/SparklineChart";
import ChartsKnob from "../pages/Charts/charts-knob";

// Maps
import MapsGoogle from "../pages/Maps/MapsGoogle";
import MapsVector from "../pages/Maps/MapsVector";

//Icons
import RemixIcons from "../pages/Icons/RemixIcons";
import MaterialDesign from "../pages/Icons/MaterialDesign";
import DripiIcons from "../pages/Icons/DripiIcons";
import FontAwesome from "../pages/Icons/FontAwesome";

//Utility
import StarterPage from "../pages/Utility/StarterPage";
import Maintenance from "../pages/Utility/Maintenance";
import CommingSoon from "../pages/Utility/CommingSoon";
import Timeline from "../pages/Utility/Timeline";
import FAQs from "../pages/Utility/FAQs";
import Pricing from "../pages/Utility/Pricing";
import Error404 from "../pages/Utility/Error404";
import Error500 from "../pages/Utility/Error500";

// Forms
import FormElements from "../pages/Forms/FormElements";
import FormAdvanced from "../pages/Forms/FormAdvanced";
import FormEditors from "../pages/Forms/FormEditors";
import FormValidations from "../pages/Forms/FormValidations";
import FormMask from "../pages/Forms/FormMask";
import FormUpload from "../pages/Forms/FormUpload";
import FormWizard from "../pages/Forms/FormWizard";
import FormXeditable from "../pages/Forms/FormXeditable";

//Ui
import UiAlert from "../pages/Ui/UiAlert";
import UiButtons from "../pages/Ui/UiButtons";
import UiCards from "../pages/Ui/UiCards";
import UiCarousel from "../pages/Ui/UiCarousel";
import UiDropdown from "../pages/Ui/UiDropdown";
import UiGeneral from "../pages/Ui/UiGeneral";
import UiGrid from "../pages/Ui/UiGrid";
import UiImages from "../pages/Ui/UiImages";
import UiLightbox from "../pages/Ui/UiLightbox";
import UiModal from "../pages/Ui/UiModal";
import UiProgressbar from "../pages/Ui/UiProgressbar";
import UiSweetAlert from "../pages/Ui/UiSweetAlert";
import UiTabsAccordions from "../pages/Ui/UiTabsAccordions";
import UiTypography from "../pages/Ui/UiTypography";
import UiVideo from "../pages/Ui/UiVideo";
import UiSessionTimeout from "../pages/Ui/UiSessionTimeout";
import UiRating from "../pages/Ui/UiRating";
import UiRangeSlider from "../pages/Ui/UiRangeSlider";
import UiNotifications from "../pages/Ui/ui-notifications";
import UIRoundSlider from "../pages/Ui/UIRoundSlider";

//Tables
import BasicTables from "../pages/Tables/BasicTables";
import DatatableTables from "../pages/Tables/DatatableTables";
import ResponsiveTables from "../pages/Tables/ResponsiveTables";
import EditableTables from "../pages/Tables/EditableTables";

// Inner Authentication
import Login1 from "../pages/AuthenticationInner/Login";
import Register1 from "../pages/AuthenticationInner/Register";
import ForgetPwd1 from "../pages/AuthenticationInner/ForgetPassword";

//Kanban Board
import KanbanBoard from "../pages/KanbanBoard/index";
import Appdetail from "../pages/workload/Appdetail";
import Servicedetail from "../pages/workload/Servicedetail";
import Deploymentdetail from "../pages/workload/Deploymentdetail";
import PodDetail from "../pages/workload/PodDetail";
import JobDetail from "../pages/workload/JobDetail";
import CronjobDetail from "../pages/workload/CronjobDetail";
import Workspace from "../pages/auth/Workspace";
import WorkspaceAdd from "../pages/auth/WorkspaceAdd";
import DeploymentAdd from "../pages/workload/DeploymentAdd";
import ServiceAdd from "../pages/workload/ServiceAdd"
import PodAdd from "../pages/workload/PodAdd"
import JobAdd from "../pages/workload/JobAdd"

import User from "../pages/auth/User"

const authProtectedRoutes = [
  //Kanban Board
  { path: "/apps-kanban-board", component: KanbanBoard },

  // Tables
  // 검색기능 table-basic
  { path: "/tables-basic", component: BasicTables },

  { path: "/tables-datatable", component: DatatableTables },
  { path: "/tables-responsive", component: ResponsiveTables },
  { path: "/tables-editable", component: EditableTables },

  // Ui
  { path: "/ui-alerts", component: UiAlert },
  { path: "/ui-buttons", component: UiButtons },
  { path: "/ui-cards", component: UiCards },
  { path: "/ui-carousel", component: UiCarousel },
  { path: "/ui-dropdowns", component: UiDropdown },
  { path: "/ui-general", component: UiGeneral },
  { path: "/ui-grid", component: UiGrid },
  { path: "/ui-images", component: UiImages },
  { path: "/ui-lightbox", component: UiLightbox },
  { path: "/ui-modals", component: UiModal },
  { path: "/ui-progressbars", component: UiProgressbar },
  { path: "/ui-sweet-alert", component: UiSweetAlert },
  { path: "/ui-tabs-accordions", component: UiTabsAccordions },
  { path: "/ui-typography", component: UiTypography },
  { path: "/ui-video", component: UiVideo },
  { path: "/ui-session-timeout", component: UiSessionTimeout },
  { path: "/ui-rating", component: UiRating },
  { path: "/ui-rangeslider", component: UiRangeSlider },
  { path: "/ui-notifications", component: UiNotifications },
  { path: "/ui-roundslider", component: UIRoundSlider },

  // Forms
  { path: "/form-elements", component: FormElements },
  { path: "/form-advanced", component: FormAdvanced },
  { path: "/form-editors", component: FormEditors },
  { path: "/form-mask", component: FormMask },
  { path: "/form-uploads", component: FormUpload },
  { path: "/form-wizard", component: FormWizard },
  { path: "/form-validation", component: FormValidations },
  { path: "/form-xeditable", component: FormXeditable },

  //Utility
  { path: "/pages-starter", component: StarterPage },
  { path: "/pages-timeline", component: Timeline },
  { path: "/pages-faqs", component: FAQs },
  { path: "/pages-pricing", component: Pricing },

  //Icons
  { path: "/icons-remix", component: RemixIcons },
  { path: "/icons-materialdesign", component: MaterialDesign },
  { path: "/icons-dripicons", component: DripiIcons },
  { path: "/icons-fontawesome", component: FontAwesome },

  // Maps
  { path: "/maps-google", component: MapsGoogle },
  { path: "/maps-vector", component: MapsVector },

  //Charts
  { path: "/charts-apex", component: ChartApex },
  { path: "/charts-chartjs", component: ChartjsChart },
  { path: "/charts-sparkline", component: SparklineChart },
  { path: "/charts-knob", component: ChartsKnob },

  //Email
  { path: "/email-inbox", component: EmailInbox },
  { path: "/email-read", component: EmailRead },

  //Ecommerce
  { path: "/ecommerce-products", component: Products },
  { path: "/ecommerce-product-detail", component: ProductDetail },
  { path: "/ecommerce-orders", component: Orders },
  { path: "/ecommerce-customers", component: Customers },
  { path: "/ecommerce-cart", component: Cart },
  { path: "/ecommerce-checkout", component: CheckOut },
  { path: "/ecommerce-shops", component: Shops },
  { path: "/ecommerce-add-product", component: AddProduct },

  //chat
  { path: "/apps-chat", component: Chat },

  //cluster manage
  //corecloud
  { path: "/cluster/core", component: CoreCloud, exact: true },
  { path: "/cluster/core/add", component: CoreCloudAdd, exact: true },
  { path: "/cluster/core/:name", component: CoreDetail },
  { path: "/podinfo", component: PodInfo },
  { path: "cluster/core-nodelist", component: NodeList },
  { path: "cluster/core-overview", component: Overview },

  //cloudEdge
  { path: "/cluster/edge", component: CloudEdge, exact: true },
  { path: "/cluster/edge/:name", component: EdgeDetail },
  { path: "/cluster/edge/add", component: EdgeAdd },

  //project
  { path: "/project/user", component: ProjectUser, exact: true },
  { path: "/project/user/add", component: ProjectUserAdd, exact: true },
  { path: "/project/user/:group/:name", component: ProjectDetail },
  { path: "/project/user-add", component: ProjectUserAdd },
  // { path: "/project/:projectType/:group/:name", component: ProjectUserDetail },
  { path: "/project/system", component: ProjectSystem, exact: true },
  { path: "/project/system-add", component: ProjectSystemAdd },
  { path: "/project/:projectType/:name", component: ProjectDetail },
  // { path: "/useradd", component: UserPro },
  // workload
  { path: "/workload/app", component: Applist, exact: true },
  { path: "/workload/app/add", component: Appadd },
  { path: "/workload/app/:namespace/:name", component: Appdetail },

  { path: "/workload/service", component: Service, exact: true },
  { path: "/workload/service/add", component: ServiceAdd },
  // { path: "/workload/service/:project/:workspace/:name/:cluster", component: Servicedetail },
  { path: "/workload/service/:name", component: Servicedetail },
  { path: "/workload/deployment", component: Deployment, exact: true },
  //잠시 수정 
  { path: "/workload/deployment/add", component: DeploymentAdd, exact: true },
  { path: "/workload/deployment/:name", component: Deploymentdetail },
  { path: "/workload/job", component: Job, exact: true },
  { path: "/workload/job/add", component: JobAdd },
  { path: "/workload/job/:name", component: JobDetail },
  { path: "/workload/cronjob/:namespace/:name", component: CronjobDetail },

  // { path: "/workload/job/:name", component: JobDetail },
  { path: "/workload/route", component: Routes },
  { path: "/workload/pod", component: Pod, exact: true },
  { path: "/workload/pod/add", component: PodAdd },
  { path: "/workload/pod/:name", component: PodDetail },

  { path: "/dashboard", component: Dashboard },
  //monitoring
  { path: "/monitoring/cluster", component: ClusterMonitor, exact: true },
  { path: "/monitoring/app", component: AppMonitor, exact: true },
  //workspace
  { path: "/workspace", component: Workspace, exact: true },
  { path: "/workspace/add", component: WorkspaceAdd, exact: true },
  // this route should be at the end of all other routes

  { path: "/auth/user", component: User, exact: true },
  { path: "/", exact: true, component: () => <Redirect to="/dashboard" /> },
];

const publicRoutes = [
  { path: "/logout", component: Logout },
  { path: "/login", component: Login },
  { path: "/forgot-password", component: ForgetPwd },
  { path: "/register", component: Register },
  { path: "/auth-lock-screen", component: AuthLockScreen },

  // Authentication Inner
  { path: "/auth-login", component: Login1 },
  { path: "/auth-register", component: Register1 },
  { path: "/auth-recoverpw", component: ForgetPwd1 },

  { path: "/pages-maintenance", component: Maintenance },
  { path: "/pages-comingsoon", component: CommingSoon },
  { path: "/pages-404", component: Error404 },
  { path: "/pages-500", component: Error500 },
];

export { authProtectedRoutes, publicRoutes };