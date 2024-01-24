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
import { platformProjectStore } from "@/store";
import { drawStatus } from "@/components/datagrids/AggridFormatter";
// import CreateProject from "@/pages/ServiceAdmin/Project/Dialog/CreateProject";
import PlatformServiceAdminDetail from "../Detail/PlatformServiceAdminDetail";

const PlatfromServiceAdminTab = observer(() => {
  const [open, setOpen] = useState(false);
  const [tabvalue, setTabvalue] = useState(0);
  const handleTabChange = (event, newValue) => {
    setTabvalue(newValue);
  };

  const {
    platformProjectList,
    totalElements,
    loadAdminPlatformProjectList,
    platformDetil,
    currentPage,
    totalPages,
    viewList,
    initViewList,
    goPrevPage,
    goNextPage,
    loadPlatformProjectDetail,
    platformProjectLists,
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
    loadPlatformProjectDetail(e.data.projectName, e.data.clusterName);
  };

  const history = useHistory();
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useLayoutEffect(() => {
    loadAdminPlatformProjectList("system");
    return () => {
      initViewList();
    };
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
            {/* <CCreateButton onClick={handleOpen}>생성</CCreateButton> */}
          </CommActionBar>

          <div className="tabPanelContainer">
            <CTabPanel value={tabvalue} index={0}>
              <div className="grid-height2">
                <AgGrid
                  onCellClicked={handleClick}
                  rowData={platformProjectLists}
                  columnDefs={columDefs}
                  isBottom={false}
                  totalElements={platformProjectLists.length}
                  totalPages={totalPages}
                  currentPage={currentPage}
                  goNextPage={goNextPage}
                  goPrevPage={goPrevPage}
                />
              </div>
            </CTabPanel>
          </div>
          {/* <CreateProject reloadFunc={loadPlatformProjectList} type={"admin"} open={open} onClose={handleClose} /> */}
        </PanelBox>
        <PlatformServiceAdminDetail platformDetil={platformDetil} />
      </CReflexBox>
    </>
  );
});
export default PlatfromServiceAdminTab;
