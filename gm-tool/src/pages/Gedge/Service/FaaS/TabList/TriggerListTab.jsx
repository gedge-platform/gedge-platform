import { useEffect, useState } from "react";
import { observer } from "mobx-react";
import { PanelBox } from "@/components/styles/PanelBox";
import CommActionBar from "@/components/common/CommActionBar";
import { AgGrid } from "@/components/datagrids";
import { CReflexBox } from "@/layout/Common/CReflexBox";
import { CCreateButton, CDeleteButton } from "@/components/buttons";
import CreateTrigger from "../Dialog/CreateTrigger";
import FaasStore from "../../../../../store/Faas";
import { agDateColumnFilter, dateFormatter } from "@/utils/common-utils";
import { swalError, swalUpdate } from "../../../../../utils/swal-utils";
import { AgGrid2 } from "../../../../../components/datagrids/AgGrid2";

const TriggerListTab = observer(() => {
  const [reRun, setReRun] = useState(false);
  const [open, setOpen] = useState(false);
  const [trigName, setTrigName] = useState("");

  const {
    loadTriggerListAPI,
    triggerList,
    totalElements,
    totalPages,
    currentPage,
    goNextPage,
    goPrevPage,
    deleteTriggerAPI,
  } = FaasStore;

  useEffect(() => {
    loadTriggerListAPI();
  }, [reRun]);

  const [columDefs] = useState([
    {
      headerName: "이름",
      field: "fission_meta.name",
      filter: true,
    },
    {
      headerName: "네임스페이스",
      field: "fission_meta.namespace",
      filter: true,
    },
    {
      headerName: "Function",
      field: "function",
      filter: true,
    },
    {
      headerName: "Method",
      field: "method",
      filter: true,
      cellRenderer: function (data) {
        return `<span>${data.value ? data.value : "-"}</span`;
      },
    },
    {
      headerName: "RelativeUrl",
      field: "url",
      filter: true,
      cellRenderer: function (data) {
        return `<span>${data.value ? data.value : "-"}</span`;
      },
    },
    {
      headerName: "생성일",
      field: "fission_meta.creationTimestamp",
      filter: "agDateColumnFilter",
      filterParams: agDateColumnFilter(),
      minWidth: 150,
      maxWidth: 200,
      cellRenderer: function (data) {
        return `<span>${dateFormatter(data.value)}</span>`;
      },
    },
  ]);

  const handleOpen = () => {
    setOpen(true);
  };

  const cellClicked = (e) => {
    setTrigName(e.value);
  };

  const handleDelete = () => {
    if (trigName === "") {
      swalError("Trigger를 선택해주세요!");
    } else {
      swalUpdate(trigName + "를 삭제하시겠습니까?", () =>
        deleteTriggerAPI(trigName, reloadData())
      );
    }
    setTrigName("");
  };

  const handleClose = () => {
    setOpen(false);
  };

  const reloadData = () => {
    setReRun(true);
  };

  return (
    <CReflexBox>
      <PanelBox>
        <CommActionBar reloadFunc={loadTriggerListAPI}>
          <CCreateButton onClick={handleOpen}>생성</CCreateButton>
          &nbsp;&nbsp;
          <CDeleteButton onClick={handleDelete}>삭제</CDeleteButton>
        </CommActionBar>
        <div className="tabPanelContainer">
          <div className="grid-height2">
            <AgGrid
              onCellClicked={cellClicked}
              rowData={triggerList}
              columnDefs={columDefs}
              totalElements={totalElements}
              isBottom={false}
              totalPages={totalPages}
              currentPage={currentPage}
              goNextPage={goNextPage}
              goPrevPage={goPrevPage}
            />
          </div>
        </div>
        <CreateTrigger
          open={open}
          onClose={handleClose}
          reloadFunc={loadTriggerListAPI}
        />
      </PanelBox>
    </CReflexBox>
  );
});
export default TriggerListTab;
