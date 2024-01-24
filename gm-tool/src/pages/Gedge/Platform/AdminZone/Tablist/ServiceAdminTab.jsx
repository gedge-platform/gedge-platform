import React, { useState, useEffect } from "react";
import { PanelBox } from "@/components/styles/PanelBox";
import CommActionBar from "@/components/common/CommActionBar";
import { AgGrid } from "@/components/datagrids";
import { agDateColumnFilter, dateFormatter } from "@/utils/common-utils";
import { CReflexBox } from "@/layout/Common/CReflexBox";
import { CCreateButton, CSelectButton } from "@/components/buttons";
import { CTabs, CTab, CTabPanel } from "@/components/tabs";
import { useHistory } from "react-router";
import { observer } from "mobx-react";
// import Detail from "../ServiceDetail";
import { serviceStore } from "@/store";
import ServiceAdminDetail from "../Detail/ServiceAdminDetail";
// import CreateService from "../Dialog/CreateService";

const ServiceAdminTab = observer(() => {
  const [open, setOpen] = useState(false);
  const [tabvalue, setTabvalue] = useState(0);
  const handleTabChange = (event, newValue) => {
    setTabvalue(newValue);
  };

  const {
    loadAdminServiceList,
    pServiceList,
    viewList,
    initViewList,
    serviceList,
    serviceDetail,
    totalElements,
    loadServiceDetail,
    currentPage,
    totalPages,
    goPrevPage,
    goNextPage,
  } = serviceStore;

  const [columDefs] = useState([
    {
      headerName: "서비스 이름",
      field: "name",
      filter: true,
    },
    {
      headerName: "클러스터",
      field: "cluster",
      filter: true,
    },
    {
      headerName: "프로젝트",
      field: "project",
      filter: true,
    },
    {
      headerName: "워크스페이스",
      field: "workspace",
      filter: true,
      cellRenderer: function ({ data: { workspace } }) {
        return `<span>${workspace ? workspace : "-"}</span>`;
      },
    },
    {
      headerName: "액세스 타입",
      field: "type",
      filter: true,
    },
    {
      headerName: "생성날짜",
      field: "createAt",
      filter: "agDateColumnFilter",
      filterParams: agDateColumnFilter(),
      minWidth: 150,
      maxWidth: 200,
      cellRenderer: function (data) {
        return `<span>${dateFormatter(data.value)}</span>`;
      },
    },
  ]);

  const handleCreateOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleClick = (e) => {
    const fieldName = e.colDef.field;
    loadServiceDetail(e.data.name, e.data.cluster, e.data.project);
  };

  const history = useHistory();

  useEffect(() => {
    loadAdminServiceList();
    return () => {
      initViewList();
    };
  }, []);

  return (
    <div style={{ height: 900 }}>
      <CReflexBox>
        <PanelBox>
          <CommActionBar reloadFunc={loadAdminServiceList}>
            {/* <CCreateButton onClick={handleCreateOpen}>생성</CCreateButton> */}
          </CommActionBar>
          <div className="tabPanelContainer">
            <CTabPanel value={tabvalue} index={0}>
              <div className="grid-height2">
                <AgGrid
                  onCellClicked={handleClick}
                  rowData={serviceList}
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
          {/* <CreateService
            open={open}
            onClose={handleClose}
            reloadFunc={loadServiceList}
          /> */}
        </PanelBox>
        <ServiceAdminDetail service={serviceDetail} />
      </CReflexBox>
    </div>
  );
});
export default ServiceAdminTab;
