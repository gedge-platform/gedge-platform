import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import Button from "@mui/material/Button";

import TableContainer from "@mui/material/TableContainer";
import TableCell from "@mui/material/TableCell";
import Table from "@mui/material/Table";
import TableRow from "@mui/material/TableRow";
import TableBody from "@mui/material/TableBody";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

// Material Dashboard 2 React example components
import DashboardLayout from "components/LayoutContainers/DashboardLayout";
import SingleClusterModal from "layouts/mq/components/singleClusterModal";
import axiosInstance from "axiosInstance";

function MQ() {
  const navigate = useNavigate();
  const [single, setSingle] = useState(false);
  const [rows, setRows] = useState([]);

  const handleOpenSingle = () => setSingle(true);
  const handleCloseSingle = () => setSingle(false);
  const handleClick = (id) => {
    navigate("./management", { state: { id: id } });
  };
  const handleEdit = (id) => {};
  const handleDelete = (id) => {
    axiosInstance
      .delete(`/single/${id}`, null, {
        withCredentials: true,
      })
      .then((response) => {
        axiosInstance.get("/single").then((response) => {
          const body = response.data;
          const newRows = transformData(body, handleEdit, handleDelete);
          setRows([...newRows]);
        });
      });
  };
  const transformData = (data, handleEdit, handleDelete) => {
    if (data === null) {
      return [];
    }
    return data.map((cluster) => {
      return {
        id: cluster.id,
        name: (
          <Typography component="a" variant="caption" color="text" fontWeight="medium">
            {cluster.name}
          </Typography>
        ),
        local: (
          <Typography component="a" variant="caption" color="text" fontWeight="medium">
            {cluster.local ? "local" : "remote"}
          </Typography>
        ),
        ip: (
          <Typography component="a" variant="caption" color="text" fontWeight="medium">
            {cluster.ip}
          </Typography>
        ),
        dashboardPort: (
          <Typography component="a" variant="caption" color="text" fontWeight="medium">
            {cluster.dashboardPort}
          </Typography>
        ),
        apiPort: (
          <Typography component="a" variant="caption" color="text" fontWeight="medium">
            {cluster.apiPort}
          </Typography>
        ),
        rpcPort: (
          <Typography component="a" variant="caption" color="text" fontWeight="medium">
            {cluster.rpcPort}
          </Typography>
        ),
        date: (
          <Typography component="a" variant="caption" color="text" fontWeight="medium">
            {cluster.date}
          </Typography>
        ),
        state: (
          <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
            <Box
              component="div"
              bgcolor={cluster.state ? "#98FD98" : "#FFB6C1"}
              color="white"
              borderRadius={16}
              px={1}
              py={0.5}
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <Typography component="span" variant="caption" fontWeight="medium">
                {cluster.state ? "Active" : "Inactive"}
              </Typography>
            </Box>
          </div>
        ),
        edit: (
          <Box>
            {cluster.id !== 1 && (
              <>
                <Button
                  variant="outline"
                  color="dark"
                  size="large"
                  onClick={() => {
                    handleDelete(cluster.id);
                  }}
                >
                  <DeleteForeverIcon />
                </Button>
              </>
            )}
          </Box>
        ),
      };
    });
  };

  useEffect(() => {
    axiosInstance
      .get("/single", {
        withCredentials: true,
      })
      .then((response) => {
        const body = response.data;
        const newRows = transformData(body, handleEdit, handleDelete);
        setRows([...newRows]);
      });
  }, []);

  return (
    <DashboardLayout>
      <Box pt={3} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <Box
                mx={2}
                mt={-3}
                py={2}
                px={2}
                variant="gradient"
                sx={{
                  bgcolor: "info.main",
                  borderRadius: "10px",
                }}
                borderRadius="lg"
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography variant="h6" style={{ color: "white" }}>
                  MQ LIST
                </Typography>
                <Button variant="outline" size="large" onClick={handleOpenSingle}>
                  <Icon sx={{ fontWeight: "bold" }}>add</Icon>
                  &nbsp;Add MQ
                </Button>
                <SingleClusterModal
                  single={single}
                  handleCloseSingle={handleCloseSingle}
                  transformData={transformData}
                  setRows={setRows}
                  handleDelete={handleDelete}
                />
              </Box>
              <Box>
                <TableContainer sx={{ boxShadow: "none" }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" p={3}>
                    <Table stickyHeader>
                      <Box component="thead">
                        <TableRow>
                          <Box component="th" align="center" py={1.5} px={3} width="20%">
                            <Typography variant="h6" fontWeight="medium">
                              NAME
                            </Typography>
                          </Box>
                          <Box component="th" py={1.5} px={3} width="10%">
                            <Typography variant="h6" fontWeight="medium">
                              NETWORK
                            </Typography>
                          </Box>
                          <Box component="th" py={1.5} px={3} width="10%">
                            <Typography variant="h6" fontWeight="medium">
                              IP
                            </Typography>
                          </Box>
                          <Box component="th" py={1.5} px={3} width="10%">
                            <Typography variant="h6" fontWeight="medium">
                              DASHBOARD PORT
                            </Typography>
                          </Box>
                          <Box component="th" py={1.5} px={3} width="10%">
                            <Typography variant="h6" fontWeight="medium">
                              API PORT
                            </Typography>
                          </Box>
                          <Box component="th" py={1.5} px={3} width="10%">
                            <Typography variant="h6" fontWeight="medium">
                              RPC PORT
                            </Typography>
                          </Box>
                          <Box component="th" py={1.5} px={3} width="20%">
                            <Typography variant="h6" fontWeight="medium">
                              LAST UPDATED
                            </Typography>
                          </Box>
                          <Box component="th" py={1.5} px={3} width="10%">
                            <Typography variant="h6" fontWeight="medium">
                              STATE
                            </Typography>
                          </Box>
                          <Box component="th" py={1.5} px={3} width="20%"></Box>
                        </TableRow>
                      </Box>
                      <TableBody>
                        {rows.map((row, index) => (
                          <TableRow key={index}>
                            <TableCell align="center" onClick={() => handleClick(row.id)}>
                              {row.name}
                            </TableCell>
                            <TableCell align="center" onClick={() => handleClick(row.id)}>
                              {row.local}
                            </TableCell>
                            <TableCell align="center" onClick={() => handleClick(row.id)}>
                              {row.ip}
                            </TableCell>
                            <TableCell align="center" onClick={() => handleClick(row.id)}>
                              {row.dashboardPort}
                            </TableCell>
                            <TableCell align="center" onClick={() => handleClick(row.id)}>
                              {row.apiPort}
                            </TableCell>
                            <TableCell align="center" onClick={() => handleClick(row.id)}>
                              {row.rpcPort}
                            </TableCell>
                            <TableCell align="center" onClick={() => handleClick(row.id)}>
                              {row.date}
                            </TableCell>
                            <TableCell align="center" onClick={() => handleClick(row.id)}>
                              {row.state}
                            </TableCell>
                            <TableCell align="center">{row.edit}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Box>
                </TableContainer>
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </DashboardLayout>
  );
}

export default MQ;