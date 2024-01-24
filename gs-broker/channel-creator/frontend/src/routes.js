import MQ from "layouts/mq";
import Icon from "@mui/material/Icon";
import Dashboard from "layouts/dashboard";

const routes = [
  {
    type: "collapse",
    name: "MQ",
    key: "mq",
    icon: <Icon fontSize="small">message</Icon>,
    route: "/mq/*",
    component: MQ,
  },
  {
    type: "collapse",
    name: "DASHBOARD",
    key: "dashboard",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/dashboard/*",
    component: Dashboard,
  },
];

export default routes;
