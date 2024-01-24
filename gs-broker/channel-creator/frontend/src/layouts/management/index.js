import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useLocation } from "react-router-dom";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { styled } from "@mui/system";
// Material Dashboard 2 React example components
import DashboardLayout from "components/LayoutContainers/DashboardLayout";
import Message from "layouts/management/components/message";
import axiosInstance from "axiosInstance";

// function TabPanel(props) {
//   const { children, value, index, ...other } = props;
//   return (
//     <div
//       role="tabpanel"
//       hidden={value !== index}
//       id={`simple-tabpanel-${index}`}
//       aria-labelledby={`simple-tab-${index}`}
//     >
//       {value === index && (
//         <Box sx={{ p: 3 }}>
//           <Typography>{children}</Typography>
//         </Box>
//       )}
//     </div>
//   );
// }

// TabPanel.propTypes = {
//   children: PropTypes.node,
//   index: PropTypes.number.isRequired,
//   value: PropTypes.number.isRequired,
// };

// function a11yProps(index) {
//   return {
//     id: `simple-tab-${index}`,
//     "aria-controls": `simple-tabpanel-${index}`,
//   };
// }
function Management() {
  const [selectedTab, setselectedTab] = useState(0);
  const [cluster, setCluster] = useState({});
  const [url, setURL] = useState("");
  const location = useLocation();

  const onChangeTab = (event, newValue) => {
    setselectedTab(newValue);
  };

  const StyledTabs = styled(Tabs)({
    width: "30%",
    color: "info",
    indicatorColor: "info",
  });

  useEffect(() => {
    const { id } = location.state;
    axiosInstance
      .get(`/single/${id}`, {
        withCredentials: true,
      })
      .then((response) => {
        const body = response.data;
        setCluster(body);
        const newURL = "http://" + body.ip + ":" + body.dashboardPort;
        setURL(newURL);
      });
  }, []);

  return (
    <DashboardLayout>
      <Box pt={2} sx={{ width: "100%" }}>
        <Message clusterId={cluster.id} />
      </Box>
    </DashboardLayout>
    // <DashboardLayout>
    //   <Box pt={2} sx={{ width: "100%" }}>
    //     <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
    //       <StyledTabs
    //         value={selectedTab}
    //         onChange={onChangeTab}
    //         aria-label="secondary tabs example"
    //         textColor="secondary"
    //         indicatorColor="secondary"
    //       >
    //         <Tab label="Message" key={"message"} {...a11yProps(0)} />
    //         <Tab label="State" key={"state"} {...a11yProps(1)} />
    //       </StyledTabs>
    //     </Box>
    //     <div style={{ display: selectedTab === 0 ? "block" : "none" }}>
    //       <Message clusterId={cluster.id} />
    //     </div>
    //     <div
    //       className="video-responsive"
    //       style={{ display: selectedTab === 1 ? "block" : "none", height: "90vh", width: "100%" }}
    //     >
    //       <iframe src={url} style={{ width: "100%", height: "100%" }}></iframe>
    //     </div>
    //   </Box>
    // </DashboardLayout>
  );
}

export default Management;
