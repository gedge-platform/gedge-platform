import React, { useState, useEffect } from "react";
import { PanelBox } from "@/components/styles/PanelBox";
import CommActionBar from "@/components/common/CommActionBar";
import { AgGrid } from "@/components/datagrids";
import { CReflexBox } from "@/layout/Common/CReflexBox";
import { CCreateButton, CDeleteButton } from "@/components/buttons";
import { CTabs, CTab, CTabPanel } from "@/components/tabs";
import { observer } from "mobx-react";
import CreateHPA from "../Dialog/CreateHPA";
import hpaStore from "../../../../store/HPA";

const HPAListTab = observer(() => {
  const {
    viewList,
    totalElements,
    currentPage,
    totalPages,
    goPrevPage,
    goNextPage,
    hpaList,
    loadHpaListAPI,
  } = hpaStore;

  const [open, setOpen] = useState(false);
  const [tabvalue, setTabvalue] = useState(0);

  const [columDefs] = useState([
    {
      headerName: "HPA 이름",
      field: "name",
      filter: true,
    },
    {
      headerName: "워크스페이스",
      field: "workspace",
      filter: true,
    },
    {
      headerName: "프로젝트",
      field: "project",
      filter: true,
    },
    {
      headerName: "클러스터",
      field: "cluster",
      filter: true,
    },
    {
      headerName: "상태",
      field: "completions",
      filter: true,
      // cellRenderer: ({ value }) => {
      //   if (value === 1) {
      //     return drawStatus("True");
      //   } else {
      //     return drawStatus("False");
      //   }
      // },
    },
    {
      headerName: "지속시간(초)",
      field: "duration",
      filter: true,
    },
  ]);

  const handleClick = () => {};

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = () => {
    // HPA 삭제
  };

  const reloadData = () => {};

  useEffect(() => {
    loadHpaListAPI();
  }, []);

  return (
    <div style={{ height: 900 }}>
      <CReflexBox>
        <PanelBox>
          <CommActionBar reloadFunc={reloadData}>
            <CCreateButton onClick={handleOpen}>생성</CCreateButton>
            &nbsp;&nbsp;
            <CDeleteButton onClick={handleDelete}>삭제</CDeleteButton>
          </CommActionBar>

          <div className="tabPanelContainer">
            <CTabPanel value={tabvalue} index={0}>
              <div className="grid-height2">
                <AgGrid
                  onCellClicked={handleClick}
                  rowData={hpaList}
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
          <CreateHPA
            open={open}
            onClose={handleClose}
            reloadFunc={reloadData}
          />
        </PanelBox>
        {/* <Detail pod={podDetail} /> */}
      </CReflexBox>
    </div>
  );
});

export default HPAListTab;
