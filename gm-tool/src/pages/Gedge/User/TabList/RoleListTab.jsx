import React, { useState, useEffect } from "react";
import { PanelBox } from "@/components/styles/PanelBox";
import { AgGrid } from "@/components/datagrids";
import { agDateColumnFilter, dateFormatter } from "@/utils/common-utils";
import { CReflexBox } from "@/layout/Common/CReflexBox";
import UserDetail from "../../User/UserDetail";
import { observer } from "mobx-react";
import userStore from "@/store/UserStore";
import { swalUpdate } from "@/utils/swal-utils";
import axios from "axios";
import { SERVER_URL } from "@/config.jsx";
import { getItem } from "@/utils/sessionStorageFn";
import { swalError } from "@/utils/swal-utils";
import UserAdd from "@/pages/Management/UserCont/UserAdd";
import CommActionBar from "@/components/common/CommActionBar";

const RoleListTab = observer(() => {
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);

  const {
    userDetail,
    loadUserList,
    loadUserDetail,
    totalElements,
    currentPage,
    totalPages,
    viewList,
    goPrevPage,
    goNextPage,
  } = userStore;

  const [columnDefs] = useState([
    {
      headerName: "아이디",
      field: "memberId",
      filter: true,
    },
    {
      headerName: "닉네임",
      field: "memberName",
      filter: true,
    },
    {
      headerName: "설명",
      field: "description",
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

  const handleCreateOpen = () => {
    setOpen2(true);
  };
  const handleCreateClose = () => {
    setOpen2(false);
  };

  const handleTabChange = (event, newValue) => {
    setTabvalue(newValue);
  };

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen2(false);
  };

  const handleClick = (e) => {
    const fieldName = e.colDef.field;
    loadUserDetail(e.data.memberId);
  };

  const deleteUser = () => {
    swalUpdate("삭제하시겠습니까", deleteAPI);
  };
  const deleteAPI = async () => {
    await axios
      .delete(`${SERVER_URL}/users/${userDetail.memberId}`, {
        auth: getItem("auth"),
      })
      .then(({ status }) => {
        if (status === 200) {
          swalError("User 삭제에 성공하였습니다.");
          loadUserList();
        } else {
          swalError("User 삭제에 실패하였습니다.");
        }
      })
      .catch((e) => console.log(e));
  };

  useEffect(() => {
    loadUserList();
  }, []);

  return (
    <>
      <CReflexBox>
        <PanelBox>
          <CommActionBar>
            {/* <CCreateButton>생성</CCreateButton> */}
          </CommActionBar>
          <div className="grid-height2">
            <AgGrid
              rowData={viewList}
              columnDefs={columnDefs}
              totalElements={totalElements}
              isBottom={false}
              onCellClicked={handleClick}
              totalPages={totalPages}
              currentPage={currentPage}
              goNextPage={goNextPage}
              goPrevPage={goPrevPage}
            />
          </div>
          <UserAdd open={open2} onClose={handleClose} />
        </PanelBox>
        <UserDetail user={userDetail} />
      </CReflexBox>
    </>
  );
});
export default RoleListTab;
