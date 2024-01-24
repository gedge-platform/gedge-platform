import { useState, useEffect, useRef } from "react";
import Box from "@mui/material/Box";
import { styled } from "@mui/system";
import DashboardLayout from "components/LayoutContainers/DashboardLayout";
import axiosInstance from "axiosInstance";

function Dashboard() {
  const [cluster, setCluster] = useState({});
  const [url, setURL] = useState("http://" + process.env.REACT_APP_HOST_IP + ":8080");

  const iframeRef = useRef(null);

  useEffect(() => {
    if (iframeRef.current) {
      iframeRef.current.contentWindow.location.replace(url);
    }
  }, [url]);

  return (
    <DashboardLayout>
      <Box pt={2} sx={{ width: "100%" }}>
        <div className="video-responsive" style={{ block: "none", height: "90vh", width: "100%" }}>
          <iframe
            key={"dashboard-iframe"}
            ref={iframeRef}
            src={url}
            style={{ width: "100%", height: "100%" }}
          ></iframe>
        </div>
      </Box>
    </DashboardLayout>
  );
}

export default Dashboard;