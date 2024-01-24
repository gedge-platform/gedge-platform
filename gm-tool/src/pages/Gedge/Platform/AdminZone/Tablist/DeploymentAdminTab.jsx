import React, { useState, useEffect } from "react";
import { PanelBox } from "@/components/styles/PanelBox";
import { agDateColumnFilter, dateFormatter } from "@/utils/common-utils";
import { CReflexBox } from "@/layout/Common/CReflexBox";
import { useHistory } from "react-router";
import { observer } from "mobx-react";
import CommActionBar from "@/components/common/CommActionBar";
import { CCreateButton, CSelectButton } from "@/components/buttons";
import { CTabs, CTab, CTabPanel } from "@/components/tabs";
import { AgGrid } from "@/components/datagrids";

import deploymentStore from "../../../../../store/Deployment";
import DeploymentAdminDetail from "../Detail/DeploymentAdminDetail";

const DeploymentAdminTab = observer(() => {
  const [tabvalue, setTabvalue] = useState(0);
  const handleTabChange = (event, newValue) => {
    setTabvalue(newValue);
  };

  const {
    loadAdminDeploymentList,
    deploymentDetail,
    loadDeploymentDetail,
    currentPage,
    totalPages,
    initViewList,
    goPrevPage,
    goNextPage,
    totalElements,
    deploymentList,
  } = deploymentStore;
  console.log(deploymentDetail);

  const [columDefs] = useState([
    {
      headerName: "디플로이먼트 이름",
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
      cellRenderer: function (data) {
        return `<span>${data.value ? data.value : "-"}</span>`;
      },
    },
    {
      headerName: "상태",
      field: "ready",
      filter: true,
      // cellRenderer: function ({ value }) {
      //   return drawStatus(value.toLowerCase());
      // },
    },
    {
      headerName: "생성일",
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
    loadDeploymentDetail(e.data.name, e.data.cluster, e.data.project);
  };

  const history = useHistory();

  useEffect(() => {
    loadAdminDeploymentList();
    return () => {
      initViewList();
    };
  }, []);

  return (
    <div style={{ height: 900 }}>
      <CReflexBox>
        <PanelBox>
          <CommActionBar reloadFunc={loadAdminDeploymentList}>
            {/* <CCreateButton>생성</CCreateButton> */}
          </CommActionBar>

          <div className="tabPanelContainer">
            <CTabPanel value={tabvalue} index={0}>
              <div className="grid-height2">
                <AgGrid
                  onCellClicked={handleClick}
                  rowData={deploymentList}
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
        <DeploymentAdminDetail deployment={deploymentDetail} />
      </CReflexBox>
    </div>
  );
});
export default DeploymentAdminTab;
