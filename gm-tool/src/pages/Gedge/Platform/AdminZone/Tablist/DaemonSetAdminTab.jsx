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
import { daemonSetStore } from "@/store";
import DaemonSetAdminDetail from "../Detail/DaemonSetAdminDetail";

const DaemonSetAdminTab = observer(() => {
  const [tabvalue, setTabvalue] = useState(0);
  const handleTabChange = (event, newValue) => {
    setTabvalue(newValue);
  };

  const {
    daemonSetList,
    daemonSetDetail,
    totalElements,
    loadAdminDaemonSetList,
    loadDaemonSetDetail,
    currentPage,
    totalPages,
    viewList,
    initViewList,
    goPrevPage,
    goNextPage,
  } = daemonSetStore;

  const [columDefs] = useState([
    {
      headerName: "데몬셋 이름",
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

  const handleClick = (e) => {
    const fieldName = e.colDef.field;
    loadDaemonSetDetail(e.data.name, e.data.cluster, e.data.project);
  };

  const history = useHistory();

  useEffect(() => {
    loadAdminDaemonSetList();
    return () => {
      initViewList();
    };
  }, []);

  return (
    <div style={{ height: 900 }}>
      <CReflexBox>
        <PanelBox>
          <CommActionBar reloadFunc={loadAdminDaemonSetList}>
            {/* <CCreateButton>생성</CCreateButton> */}
          </CommActionBar>

          <div className="tabPanelContainer">
            <CTabPanel value={tabvalue} index={0}>
              <div className="grid-height2">
                <AgGrid
                  onCellClicked={handleClick}
                  rowData={daemonSetList}
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
        </PanelBox>
        <DaemonSetAdminDetail daemonSet={daemonSetDetail} />
      </CReflexBox>
    </div>
  );
});
export default DaemonSetAdminTab;
