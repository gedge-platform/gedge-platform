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
import Detail from "../PlatformDetail";
import platformProjectStore from "../../../../store/PlatformProject";
import { drawStatus } from "../../../../components/datagrids/AggridFormatter";
import CreateProject from "../../../ServiceAdmin/Project/Dialog/CreateProject";

const PlatfromServiceListTab = observer(() => {
  const [open, setOpen] = useState(false);
  const [tabvalue, setTabvalue] = useState(0);
  const handleTabChange = (event, newValue) => {
    setTabvalue(newValue);
  };

  const {
    platformProjectList,
    totalElements,
    loadPlatformProjectList,
    platformDetil,
    loadPlatformDetail,
    loadCluster,
    currentPage,
    totalPages,
    viewList,
    goPrevPage,
    goNextPage,
  } = platformProjectStore;

  const [columDefs] = useState([
    {
      headerName: "이름",
      field: "projectName",
      filter: true,
    },
    {
      headerName: "클러스터",
      field: "clusterName",
      filter: true,
    },
    {
      headerName: "상태",
      field: "status",
      filter: true,
      cellRenderer: ({ value }) => {
        return drawStatus(value);
      },
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

  const handleClick = (e) => {
    const fieldName = e.colDef.field;
    // console.log(e.data.projectName);
    // loadPlatformProjectList()
    loadCluster(e.data.projectName, e.data.clusterName);
    // loadPlatformDetail(e.data.projectName);
  };

  const history = useHistory();
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useLayoutEffect(() => {
    loadPlatformProjectList("system");
  }, []);

  return (
    <>
      <CReflexBox>
        <PanelBox>
          <CommActionBar
          // reloadFunc={loadPlatformProjectList}
          // isSearch={true}
          // isSelect={true}
          // keywordList={["이름"]}
          >
            <CCreateButton onClick={handleOpen}>생성</CCreateButton>
          </CommActionBar>

          <div className="tabPanelContainer">
            <CTabPanel value={tabvalue} index={0}>
              <div className="grid-height2">
                <AgGrid
                  onCellClicked={handleClick}
                  rowData={viewList}
                  columnDefs={columDefs}
                  isBottom={false}
                  totalElements={totalElements}
                  totalPages={totalPages}
                  currentPage={currentPage}
                  goNextPage={goNextPage}
                  goPrevPage={goPrevPage}
                />
              </div>
            </CTabPanel>
          </div>
          <CreateProject
            reloadFunc={loadPlatformProjectList}
            type={"admin"}
            open={open}
            onClose={handleClose}
          />
        </PanelBox>
        <Detail platformDetil={platformDetil} />
      </CReflexBox>
    </>
  );
});
export default PlatfromServiceListTab;
