import React, { useState, useLayoutEffect } from "react";
import { PanelBox } from "@/components/styles/PanelBox";
import { AgGrid } from "@/components/datagrids";
import { agDateColumnFilter, dateFormatter } from "@/utils/common-utils";
import { CReflexBox } from "@/layout/Common/CReflexBox";
import UserDetail from "../../User/UserDetail";
import { observer } from "mobx-react";
import userStore from "@/store/UserStore";
import CommActionBar from "@/components/common/CommActionBar";
import dayjs from "dayjs";
import { CCreateButton, CDeleteButton } from "@/components/buttons";
import CreateUser from "../Dialog/CreateUser";
import { swalUpdate, swalError } from "@/utils/swal-utils";
import { CEditButton } from "../../../../components/buttons/CEditButton";
import EditUser from "../Dialog/EditUser";

const UserListTab = observer(() => {
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  // const [userName, setUserName] = useState("");

  const {
    deleteUser,
    userDetail,
    loadUserList,
    loadUserDetail,
    totalElements,
    currentPage,
    totalPages,
    viewList,
    userList,
    goPrevPage,
    goNextPage,
    inputs,
    setInputs,
    inputsEdit,
    setInputsEdit,
    userName,
    setUserName,
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
      headerName: "사용자 역할",
      field: "memberRole",
      filter: true,
    },
    {
      headerName: "최근 접속일",
      field: "logined_at",
      filter: true,
      cellRenderer: function (data) {
        if (dayjs(data.value).year() === 1) {
          return `<span>-</span>`;
        }
        return `<span>${dateFormatter(data.value)}</span>`;
      },
    },
    {
      headerName: "등록일",
      field: "created_at",
      filter: "agDateColumnFilter",
      filterParams: agDateColumnFilter(),
      minWidth: 150,
      maxWidth: 200,
      cellRenderer: function (data) {
        return `<span>${dateFormatter(data.value)}</span>`;
      },
    },
    {
      headerName: "상태",
      field: "enabled",
      filter: true,
      cellRenderer: function (state) {
        if (state.value == 0) {
          return `<span class="state_ico state_04">승인 대기</span>`;
        }
        return `<span class="state_ico state_02">승인</span>`;
      },
    },
  ]);

  const handleClick = (e) => {
    loadUserDetail(e.data.memberId);
    setUserName(e.data.memberId);
    setInputsEdit(e.data);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpenEdit = (e) => {
    if (userName === "") {
      swalError("사용자를 선택해주세요!");
      return;
    }
    // checkUser(userName);
    setOpenEdit(true);
  };

  const handleCloseEdit = () => {
    setOpenEdit(false);
  };

  const handleDelete = () => {
    if (userName === "") {
      swalError("사용자를 선택해주세요!");
    } else {
      swalUpdate(userName + "를 삭제하시겠습니까?", () =>
        deleteUser(userName, loadUserList)
      );
    }
    setUserName("");
  };

  useLayoutEffect(() => {
    loadUserList();
  }, []);

  return (
    <>
      <CReflexBox>
        <PanelBox>
          <CommActionBar>
            <CCreateButton onClick={handleOpen}>생성</CCreateButton>
            &nbsp;&nbsp;
            <CEditButton onClick={handleOpenEdit}>수정</CEditButton>
            &nbsp;&nbsp;
            <CDeleteButton onClick={handleDelete}>삭제</CDeleteButton>
          </CommActionBar>
          <div className="grid-height2">
            <AgGrid
              rowData={userList[0]}
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
          <CreateUser
            open={open}
            onClose={handleClose}
            reloadFunc={loadUserList}
          />
          <EditUser
            openEdit={openEdit}
            onClose={handleCloseEdit}
            reloadFunc={loadUserList}
          />
        </PanelBox>
        <UserDetail user={userDetail} />
      </CReflexBox>
    </>
  );
});
export default UserListTab;
