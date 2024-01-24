import React, { useState, useLayoutEffect } from "react";
import { PanelBox } from "@/components/styles/PanelBox";
import CommActionBar from "@/components/common/CommActionBar";
import { AgGrid } from "@/components/datagrids";
import { CReflexBox } from "@/layout/Common/CReflexBox";
import { CCreateButton, CDeleteButton } from "@/components/buttons";
import { observer } from "mobx-react";
import { clusterStore } from "@/store";
import CreateVM from "../Dialog/CreateVM";
import { drawStatus } from "@/components/datagrids/AggridFormatter";
import { swalError, swalUpdate, swalLoading } from "@/utils/swal-utils";

const CloudVMListTab = observer(() => {
  const [open, setOpen] = useState(false);
  const [reRun, setReRun] = useState(false);
  const [vmName, setVMName] = useState("");
  const [config, setConfig] = useState("");

  const {
    clusterList,
    deleteVM,
    loadVMList,
    currentPage,
    totalPages,
    viewList,
    initViewList,
    initClusterList,
    goPrevPage,
    goNextPage,
    totalElements,
  } = clusterStore;

  const [columDefs] = useState([
    {
      headerName: "제공자",
      field: "ProviderName",
      filter: true,
    },
    {
      headerName: "이름",
      field: "IId.NameId",
      filter: true,
    },
    {
      headerName: "상태",
      field: "VmStatus",
      filter: true,
      cellRenderer: ({ value }) => {
        return drawStatus(value);
      },
    },
    {
      headerName: "스펙",
      field: "VMSpecName",
      filter: true,
    },
    {
      headerName: "디스크",
      field: "RootDiskSize",
      filter: true,
    },
    {
      headerName: "이미지",
      field: "ImageIId.NameId",
      filter: true,
    },
    {
      headerName: "VPC",
      field: "VpcIID.NameId",
      filter: true,
    },
    {
      headerName: "키페어",
      field: "KeyPairIId.NameId",
      filter: true,
    },
    {
      headerName: "리전",
      field: "Region.Region",
      filter: true,
    },
    {
      headerName: "Private",
      field: "PrivateIP",
      filter: true,
    },
    {
      headerName: "Public",
      field: "PublicIP",
      filter: true,
    },
    {
      headerName: "SSH",
      field: "SSHAccessPoint",
      filter: true,
    },
  ]);

  const handleClick = (e) => {
    setVMName(e.data.IId.NameId);

    var configStr = e.data.KeyPairIId.NameId;
    configStr = configStr.replace("-key", "");
    setConfig(configStr);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = () => {
    if (vmName === "") {
      swalError("VM을 선택해주세요!");
    } else {
      swalUpdate(vmName + "를 삭제하시겠습니까?", () => {
        swalLoading(
          "VM 삭제중..",
          3000000,
          "이 창은 VM 삭제가 완료되면 사라집니다."
        );
        deleteVM(vmName, config, reloadData);
      });
    }
    setVMName("");
  };

  const reloadData = () => {
    setReRun(true);
  };

  useLayoutEffect(() => {
    initViewList();
    initClusterList();
    loadVMList();
    return () => {
      setReRun(false);
    };
  }, [reRun]);

  return (
    <>
      <CReflexBox>
        <PanelBox>
          <CommActionBar reloadFunc={reloadData}>
            <CCreateButton onClick={handleOpen}>생성</CCreateButton>
            &nbsp;&nbsp;
            <CDeleteButton onClick={handleDelete}>삭제</CDeleteButton>
          </CommActionBar>

          <div className="tabPanelContainer">
            {/* <CTabPanel value={tabvalue} index={0}> */}
            <div className="grid-height2">
              <AgGrid
                rowData={clusterList}
                columnDefs={columDefs}
                isBottom={false}
                onCellClicked={handleClick}
                totalElements={totalElements}
                totalPages={totalPages}
                currentPage={currentPage}
                goNextPage={goNextPage}
                goPrevPage={goPrevPage}
              />
            </div>
            {/* </CTabPanel> */}
          </div>
          <CreateVM open={open} onClose={handleClose} reloadFunc={reloadData} />
        </PanelBox>
        {/* <Detail cluster={clusterDetail} /> */}
      </CReflexBox>
    </>
  );
});
export default CloudVMListTab;
