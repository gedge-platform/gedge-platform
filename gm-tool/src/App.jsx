import React from "react";
import { Route, Switch, useHistory } from "react-router-dom";
import {
  TotalDashboard,
  Cluster,
  Project,
  Login,
  NotFound,
  WorkSpace,
  Workload,
  User,
  Monitoring,
  ComponentManage,
  ServiceProject,
  ServiceWorkload,
  ServiceWorkSpace,
  Volume,
  Configuration,
  Certification,
  PlatformUser,
  Storage,
  CreateUser,
  StorageDashboard,
  PlatformProject,
  CloudZone,
  FaaS,
  GsLink,
} from "@/pages";

import PlatformDashboard from "./pages/Gedge/Platform/PlatformDashboard";
import EdgeClusterListTab from "./pages/Gedge/Cluster/TabList/EdgeClusterListTab";
import AuthRoute from "./routes/AuthRoute";
import DeploymentPopup from "./pages/ServiceAdmin/Workload/Dialog/DeploymentPopup";
import { getItem } from "./utils/sessionStorageFn";
import axios from "axios";
import ServiceAdminDashboard from "./pages/Gedge/ServiceAdminDashboard/ServiceAdminDashboard";
import ServiceAdminMapDashboard from "./pages/Gedge/ServiceAdminDashboard/ServiceAdminMapDashboard";
import { Redirect } from "react-router-dom";
import ServiceAdminChart from "./pages/Gedge/ServiceAdminDashboard/ServiceAdminChart";
import { AdminZoneDashboard } from "./pages";
import AdminZoneListTab from "./pages/Gedge/Platform/AdminZone/AdminZoneDashboard";
import ClusterOverviewAdminTab from "./pages/Gedge/Platform/AdminZone/AdminMonitoring/ClusterOverviewAdminTab";
import AdminMonitoring from "./pages/Gedge/Platform/AdminZone/AdminMonitoring/MonitoringAdmin";
import TotalClusterResources from "./pages/Dashboard/DashboardCont/TotalClusterResources";

export const App = () => {
  const navigate = useHistory();

  // 새로고침하면 api header 설정이 날아가니까 안 날아가게 설정
  const token = getItem("token");
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  const userRole = getItem("userRole");

  // useEffect(() => {
  //   if (JSON.parse(localStorage.getItem("token")) == null) {
  //     console.log("로그인 정보가 없어, signin 페이지로 이동합니다.");
  //     navigate("/login");
  //   }
  // }, []);

  if (userRole === "PA") {
    return (
      <>
        <AuthRoute path="/total" component={TotalDashboard} exact />
        <AuthRoute path="/" component={TotalDashboard} exact />
        <Switch>
          <AuthRoute path="/cluster" component={Cluster} />
          <AuthRoute path="/project" component={Project} />
          <AuthRoute path="/userProject" component={CreateUser} />
          <AuthRoute path="/platformProject" component={PlatformProject} />

          <AuthRoute path="/component" component={ComponentManage} />
          <AuthRoute path="/monitoring" component={Monitoring} />
          <AuthRoute path="/workSpace" component={WorkSpace} />
          <AuthRoute path="/user" component={User} />
          <AuthRoute path="/volumes" component={Volume} />
          <AuthRoute path="/configuration" component={Configuration} />
          <AuthRoute path="/certification" component={Certification} />
          <AuthRoute path="/platformUser" component={PlatformUser} />
          <AuthRoute path="/edgeZone" component={EdgeClusterListTab} />
          <AuthRoute path="/adminZone" component={AdminZoneDashboard} />
          <AuthRoute path="/cloudZone" component={CloudZone} />
          <AuthRoute path="/platformDashboard" component={PlatformDashboard} />
          <AuthRoute path="/topology" component={NotFound} />
          <AuthRoute path="/loadbalancer" component={NotFound} />
          <AuthRoute path="/storage" component={Storage} />
          <AuthRoute path="/workload" component={Workload} />
          <AuthRoute path="/faas" component={FaaS} />
          <AuthRoute path="/glink" component={GsLink} />
          <AuthRoute path="/adminMonitoring" component={AdminMonitoring} />

          <AuthRoute path="/platformControl" component={NotFound} />
          <AuthRoute path="/StorageDashboard" component={StorageDashboard} />

          <Route path="/login" component={Login} />
          <Route path="/callback" component={DeploymentPopup} />

          <Route component={NotFound} />
        </Switch>
      </>
    );
  } else if (userRole === "SA") {
    return (
      <>
        <AuthRoute path="/service" component={ServiceAdminDashboard} exact />
        <AuthRoute path="/" component={ServiceAdminDashboard} exact />
        <Switch>
          <AuthRoute path="/service/map" component={ServiceAdminMapDashboard} />
          <AuthRoute path="/service/project" component={ServiceProject} />
          <AuthRoute path="/service/workload" component={ServiceWorkload} />
          <AuthRoute path="/service/Workspace" component={ServiceWorkSpace} />
          <AuthRoute path="/service/faas" component={FaaS} />
          <AuthRoute path="/service/volumes" component={Volume} />

          <Route path="/login" component={Login} />
          <Route path="/callback" component={DeploymentPopup} />

          <Route component={NotFound} />
        </Switch>
      </>
    );
  } else {
    return (
      <>
        <AuthRoute path="/total" component={TotalDashboard} exact />
        <AuthRoute path="/" component={TotalDashboard} exact />
        <Switch>
          <Route path="/login" component={Login} />
          <Route component={NotFound} />
        </Switch>
      </>
    );
  }
};

export default App;
