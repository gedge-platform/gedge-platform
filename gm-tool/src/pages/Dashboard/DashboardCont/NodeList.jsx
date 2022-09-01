import { observer } from "mobx-react";
import React, { useEffect } from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import clusterStore from "../../../store/Cluster";
import dashboardStore from "../../../store/Dashboard";
import { agDateColumnFilter, dateFormatter } from "@/utils/common-utils";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#2f3855",
    color: theme.palette.common.white,
    borderColor: "#171e33",
  },
  [`&.${tableCellClasses.body}`]: {
    borderColor: "#171e33",
    fontSize: 14,
    // "&:nth-of-type(odd)": {
    //   backgroundColor:"#222c45",
    // },
    backgroundColor: "#25304b",
    color: "#bcbebd",
    fontWeight: "bold",
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  backgroundColor: "#25304b",
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const NodeList = observer(() => {
  const {
    // clusterDetail: { nodes },
  } = clusterStore;

  const { nodeInfo } = dashboardStore;

  return (
    <TableContainer component={Paper} style={{ overflow: "unset" }}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Name</StyledTableCell>
            <StyledTableCell>Type</StyledTableCell>
            <StyledTableCell>IP</StyledTableCell>
            <StyledTableCell>Kube-Version</StyledTableCell>
            <StyledTableCell>OS</StyledTableCell>
            <StyledTableCell>Created</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {nodeInfo.map((node) => (
            <StyledTableRow key={node.name}>
              <StyledTableCell>{node.name}</StyledTableCell>
              <StyledTableCell>{node.type}</StyledTableCell>
              <StyledTableCell>{node.nodeIP}</StyledTableCell>
              <StyledTableCell>{node.kubeVersion}</StyledTableCell>
              <StyledTableCell>{node.os}</StyledTableCell>
              <StyledTableCell>
                {dateFormatter(node.created_at)}
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
});

export default NodeList;
