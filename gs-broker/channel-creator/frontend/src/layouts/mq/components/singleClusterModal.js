import React from "react";
import { useState, useEffect } from "react";

import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CloseIcon from "@mui/icons-material/Close";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import axiosInstance from "axiosInstance";
import Modal from "@mui/material/Modal";

function SingleClusterModal({
  single,
  handleCloseSingle,
  setRows,
  transformData,
  handleEdit,
  handleDelete,
}) {
  const [name, setName] = useState("");
  const [ip, setIp] = useState("");
  const [dashboardPort, setDashboardPort] = useState("8080");
  const [apiPort, setAPIPort] = useState("9090");
  const [rpcPort, setRPCPort] = useState("50000");

  const [nameErr, setNameErr] = useState(false);
  const [ipErr, setIpErr] = useState(false);

  const handleName = (event) => {
    const name = event.target.value;
    setName(name);
    setNameErr(false);
  };

  const handleIp = (event) => {
    const ip = event.target.value;
    setIp(ip);
    setIpErr(false);
  };

  const handleDashboardPort = (event) => {
    const port = event.target.value;
    setDashboardPort(port);
  };

  const handleAPIPort = (event) => {
    const port = event.target.value;
    setAPIPort(port);
  };

  const handleRPCPort = (event) => {
    const port = event.target.value;
    setRPCPort(port);
  };

  const createCluster = () => {
    // Update error state
    setNameErr(name === "");
    setIpErr(ip === "");

    // Only call handleCloseSingle if there are no errors
    if (name !== "" && ip !== "") {
      if (dashboardPort === "") {
        setDashboardPort("8080");
      }
      if (apiPort === "") {
        setAPIPort("9090");
      }
      if (rpcPort === "") {
        setRPCPort("50000");
      }
      const data = {
        name: name,
        ip: ip,
        dashboardPort: dashboardPort,
        apiPort: apiPort,
        rpcPort: rpcPort,
      };
      axiosInstance
        .post("/single", data, {
          withCredentials: true,
        })
        .then((response) => {
          if (response.status === 200) {
            axiosInstance.get("/single").then((response) => {
              const body = response.data;
              const newRows = transformData(body, handleEdit, handleDelete);
              setRows([...newRows]);
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });

      handleCloseSingle();
    }
  };

  return (
    <Modal
      open={single}
      handleCloseSingle={handleCloseSingle}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
    >
      <Box pt={6} pb={3}>
        <Grid container spacing={6} justifyContent="center">
          <Grid item xs={12} lg={3}>
            <Card>
              <Box p={2} display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h5">Add Single Cluster</Typography>
                <Button variant="gradient" onClick={handleCloseSingle}>
                  <CloseIcon />
                </Button>
              </Box>

              <Typography variant="h6" ml={3}>
                Required Fields
              </Typography>
              <Box mx={3} py={2} px={2}>
                <FormControl fullWidth error={nameErr}>
                  <TextField
                    fullWidth
                    label="Single Cluster Name (Alias)"
                    variant="outlined"
                    value={name}
                    onChange={handleName}
                    size="large"
                    error={nameErr}
                  />
                  {nameErr && <FormHelperText>Insert name</FormHelperText>}
                </FormControl>
              </Box>
              <Box mx={3} py={2} px={2}>
                <TextField
                  fullWidth
                  label="MQ IP (Requirement)"
                  variant="outlined"
                  value={ip}
                  onChange={handleIp}
                  size="large"
                  helperText={ipErr && "Field is required"}
                />
              </Box>

              <Typography variant="h6" ml={3}>
                Optional Fields
              </Typography>
              <Box mx={3} py={2} px={2}>
                <TextField
                  fullWidth
                  label="Dashboard Port (Optional)"
                  variant="outlined"
                  value={dashboardPort}
                  onChange={handleDashboardPort}
                  size="large"
                />
              </Box>
              <Box mx={3} py={2} px={2}>
                <TextField
                  fullWidth
                  label="MQ Port (Optional)"
                  variant="outlined"
                  value={apiPort}
                  onChange={handleAPIPort}
                  size="large"
                />
              </Box>
              <Box mx={3} py={2} px={2}>
                <TextField
                  fullWidth
                  label="MQ Port (Optional)"
                  variant="outlined"
                  value={rpcPort}
                  onChange={handleRPCPort}
                  size="large"
                />
              </Box>
              <Box mx={3} py={2} px={2}>
                <Button
                  onClick={createCluster}
                  disabled={nameErr || ipErr}
                  style={{ width: "100%", height: "10%" }}
                >
                  Create
                </Button>
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
}

export default SingleClusterModal;