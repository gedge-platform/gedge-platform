import React, { useState, useEffect, useLayoutEffect } from "react";
import { PanelBox } from "@/components/styles/PanelBox";
import CommActionBar from "@/components/common/CommActionBar";
import { AgGrid } from "@/components/datagrids";
import { agDateColumnFilter, dateFormatter } from "@/utils/common-utils";
import { CReflexBox } from "@/layout/Common/CReflexBox";
import { CCreateButton } from "@/components/buttons";
import { CTabPanel } from "@/components/tabs";
import { useHistory } from "react-router";
import { observer } from "mobx-react";
import { clusterStore } from "@/store";
import CreateCluster from "../Dialog/CreateCluster";
import Layout from "@/layout";
import { Title } from "@/pages";

const EdgeZoneListTab = observer(() => {
  const currentPageTitle = Title.EdgeZone;
  const [open, setOpen] = useState(false);
  const [tabvalue, setTabvalue] = useState(0);
  const handleTabChange = (event, newValue) => {
    setTabvalue(newValue);
  };

  const {
    clusterDetail,
    clusterList,
    totalElements,
    loadClusterList,
    loadCluster,
    currentPage,
    totalPages,
    viewList,
    goPrevPage,
    goNextPage,
  } = clusterStore;

  const [columDefs] = useState([
    {
      headerName: "",
      field: "check",
      minWidth: 53,
      maxWidth: 53,
      filter: false,
      headerCheckboxSelection: true,
      headerCheckboxSelectionFilteredOnly: true,
      checkboxSelection: true,
    },
    {
      headerName: "이름",
      field: "clusterName",
      filter: true,
    },
    {
      headerName: "타입",
      field: "clusterType",
      filter: true,
    },
    {
      headerName: "생성자",
      field: "clusterCreator",
      filter: true,
    },
    {
      headerName: "노드개수",
      field: "nodeCnt",
      filter: true,
    },
    {
      headerName: "IP",
      field: "clusterEndpoint",
      filter: true,
    },
    {
      headerName: "생성날짜",
      field: "created_at",
      filter: "agDateColumnFilter",
      filterParams: agDateColumnFilter(),
      minWidth: 150,
      maxWidth: 200,
      cellRenderer: function (data) {
        return `<span>${dateFormatter(data.value)}</span>`;
      },
    },
  ]);

  const history = useHistory();

  const handleClick = (e) => {
    loadCluster(e.data.clusterName);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useLayoutEffect(() => {
    loadClusterList("edge");
  }, []);

  return (
    <Layout currentPageTitle={currentPageTitle}>
      <CReflexBox>
        <PanelBox>
          <CommActionBar>
            <CCreateButton onClick={handleOpen}>생성</CCreateButton>
          </CommActionBar>

          <div className="tabPanelContainer">
            <CTabPanel value={tabvalue} index={0}>
              <div className="grid-height2">
                <AgGrid
                  rowData={clusterList}
                  columnDefs={columDefs}
                  isBottom={false}
                  totalElements={totalElements}
                  onCellClicked={handleClick}
                  totalPages={totalPages}
                  currentPage={currentPage}
                  goNextPage={goNextPage}
                  goPrevPage={goPrevPage}
                />
              </div>
            </CTabPanel>
          </div>
          <CreateCluster type={"edge"} open={open} onClose={handleClose} />
        </PanelBox>
      </CReflexBox>
    </Layout>
  );
});

export default EdgeZoneListTab;
