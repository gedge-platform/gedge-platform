import React, { useState, useEffect } from "react";
import { PanelBox } from "@/components/styles/PanelBox";
import CommActionBar from "@/components/common/CommActionBar";
import { AgGrid } from "@/components/datagrids";
import { agDateColumnFilter } from "@/utils/common-utils";
import { CReflexBox } from "@/layout/Common/CReflexBox";
import { CCreateButton, CSelectButton } from "@/components/buttons";
import { CTabs, CTab, CTabPanel } from "@/components/tabs";
import { useHistory } from "react-router";
import { observer } from "mobx-react";
import Detail from "../Detail";
import ComponentStore from "../../../../store/ComponentManage";

const ComponentListTab = observer(() => {
  const [tabvalue, setTabvalue] = useState(0);
  const handleTabChange = (event, newValue) => {
    setTabvalue(newValue);
  };

  const { componentDetail, componentList, totalElements, loadComponentList } =
    ComponentStore;

  const [columDefs] = useState([
    {
      headerName: "이름",
      field: "projectName",
      filter: true,
    },
    {
      headerName: "상태",
      field: "status",
      filter: true,
    },
    {
      headerName: "워크스페이스",
      field: "workspaceName",
      filter: true,
    },
    {
      headerName: "클러스터 명",
      field: "clusterName",
      filter: true,
    },
    {
      headerName: "CPU 사용량(core)",
      field: "cpu",
      filter: true,
      cellRenderer: function ({ data: { resourceUsage } }) {
        return `<span>${resourceUsage.namespace_cpu ?? 0}</span>`;
      },
    },
    {
      headerName: "Memory 사용량(Gi)",
      field: "memory",
      filter: true,
      cellRenderer: function ({ data: { resourceUsage } }) {
        return `<span>${resourceUsage.namespace_memory ?? 0}</span>`;
      },
    },
    {
      headerName: "Pods 수(개)",
      field: "resource",
      filter: true,
      cellRenderer: function ({ data: { resourceUsage } }) {
        return `<span>${resourceUsage.namespace_pod_count ?? 0}</span>`;
      },
    },
  ]);

  const history = useHistory();

  useEffect(() => {
    loadComponentList();
  }, []);

  return (
    <>
      <CReflexBox>
        <PanelBox>
          <CommActionBar isSearch={true} isSelect={true} keywordList={["이름"]}>
            <CCreateButton>생성</CCreateButton>
          </CommActionBar>

          <div className="tabPanelContainer">
            <CTabPanel value={tabvalue} index={0}>
              <div className="grid-height2">
                <AgGrid
                  rowData={componentList}
                  columnDefs={columDefs}
                  isBottom={true}
                  totalElements={totalElements}
                />
              </div>
            </CTabPanel>
          </div>
        </PanelBox>
        <Detail cluster={componentDetail} />
      </CReflexBox>
    </>
  );
});

export default ComponentListTab;
