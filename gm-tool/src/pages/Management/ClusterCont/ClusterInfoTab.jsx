import React, { useState, useEffect } from "react";
import { PanelBox } from "@/components/styles/PanelBox";
import CommActionBar from "@/components/common/CommActionBar";
import styled from "styled-components";
import { agDateColumnFilter } from "@/utils/common-utils";
import { CIconButton } from "@/components/buttons";
import ClusterResource from "./ClusterResource";
import ClusterNode from "./ClusterNode";
import ClusterPod from "./ClusterPod";
import ClusterMonit from "./ClusterMonit";

const ClusterInfoTab = () => {
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [rowData] = useState([
    {
      no: "1",
      name: "홍길동",
      userrole: "사용자",
      loginTimeAt: "2021-06-29T11:25:00Z",
      register: "2021. 02. 01",
      state: "Active",
    },
    {
      no: "2",
      name: "홍길동",
      userrole: "관리자",
      loginTimeAt: "2021-06-29T11:25:00Z",
      register: "2021. 02. 01",
      state: "Non-Active",
    },
    {
      no: "3",
      name: "홍길동",
      userrole: "관리자",
      loginTimeAt: "2021-06-29T11:25:00Z",
      register: "2021. 02. 01",
      state: "Active",
    },
    {
      no: "4",
      name: "홍길동",
      userrole: "사용자",
      loginTimeAt: "2021-06-29T11:25:00Z",
      register: "2021. 02. 01",
      state: "Pending",
    },
    {
      no: "5",
      name: "홍길동",
      userrole: "사용자",
      loginTimeAt: "2021-06-29T11:25:00Z",
      register: "2021. 02. 01",
      state: "Non-Active",
    },
    {
      no: "6",
      name: "홍길동",
      userrole: "사용자",
      loginTimeAt: "2021-06-29T11:25:00Z",
      register: "2021. 02. 01",
      state: "Pending",
    },
  ]);
  const [columnDefs] = useState([
    {
      headerName: "",
      field: "check",
      minWidth: 53,
      maxWidth: 53,
      filter: false,
      headerCheckboxSelection: true,
      headerCheckboxSelectionFilteredOnly: true,
      checkboxSelection: true,
    },
    {
      headerName: "NO",
      field: "no",
      filter: false,
      minWidth: 80,
      maxWidth: 80,
    },
    {
      headerName: "사용자 이름",
      field: "name",
      filter: true,
    },
    {
      headerName: "사용자 역할",
      field: "userrole",
      filter: true,
    },
    {
      headerName: "Last Login",
      field: "loginTimeAt",
      filter: true,
    },
    {
      headerName: "등록일",
      field: "register",
      filter: "agDateColumnFilter",
      filterParams: agDateColumnFilter(),
      minWidth: 150,
      maxWidth: 200,
    },
    {
      headerName: "상태",
      field: "state",
      filter: true,
      cellRenderer: function (state) {
        if (state.data.state == "Active") {
          return `<span class="state_ico state_02">로그인</span>`;
        } else if (state.data.state == "Non-Active") {
          return `<span class="state_ico state_06">로그아웃</span>`;
        } else if (state.data.state == "Pending") {
          return `<span class="state_ico state_04">승인 대기</span>`;
        }
        return `<span class="state_ico state_02">승인 대기</span>`;
      },
    },
  ]);

  const actionList = [
    {
      name: "승인",
      onClick: () => {
        alert("승인하시겠습니까?");
      },
    },
    {
      name: "반려",
      onClick: () => {
        alert("반려하시겠습니까?");
      },
    },
    {
      name: "강제중지",
      onClick: () => {
        alert("강제중지 하시겠습니까?");
      },
    },
  ];

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
    setOpen(false);
  };
  const ClusterWrap = styled.div`
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-between;
    margin-bottom: 12px;
    .panel_graph {
      width: 50%;
    }
    .panel_list {
      flex-grow: 1;
    }
    .panel_dashboard {
      width: 360px;
      margin: 12px 12px 0 0;
      &:first-child {
        margin-top: 0;
      }
      .panelCont {
        display: flex;
        flex-direction: column;
        justify-content: center;
      }
    }
    .slash {
      position: relative;
      display: inline-block;
      width: 20px;
      padding: 0 5px;
      font-weight: 300;
      font-size: 10px;
      color: transparent;
      &::after {
        content: "";
        position: absolute;
        top: 50%;
        left: -4px;
        width: 29px;
        border-top: 1px solid #b7b7b7;
        transform: rotate(-70deg);
      }
    }
    .vm_01 {
      color: #1d90ff;
    }
    .vm_02 {
      color: #00b91a;
    }
    .vm_03 {
      color: #ff5a00;
    }
  `;
  return (
    <>
      {/* <div style={margin-bottom: "12px"}> */}

      {/* <div className="panelTitBar panelTitBar_clear">
                    <div className="tit">클러스터 정보</div>
                </div> */}

      {/* <div className="panelCont">
                        <table className="tb_data">
                            <tbody>
                            <tr>
                                <th>클러스터 이름</th>
                                <td>hyper-leager</td>
                                <th>쿠버네티스 버전</th>
                                <td>1.22.2</td>
                                
                            </tr>
                            <tr>
                                <th>역할</th>
                                <td>Master</td>
                                <th>등록일</th>
                                <td>2021.03.01</td>
                                
                            </tr>
                            </tbody>
                            </table>
                    </div> */}

      {/* </div> */}
      <ClusterWrap>
        <PanelBox className="panel_graph">
          <div className="panelTitBar panelTitBar_clear">
            <div className="tit">클러스터 노드</div>
            <CommActionBar isSearch={false}>
              {/* <CCreateButton onClick={handleOpen}>
                            생성
                        </CCreateButton>
                        <CreateDialog
                            open={open}
                            onClose={handleClose}
                        /> */}
              {/* 
                        <CSelectButton
                            items={actionList}
                        >
                            액션
                        </CSelectButton> */}

              <div className="iconBtnGrope">
                <CIconButton icon="play" tooltip="실행" />
                <CIconButton icon="stop" tooltip="중지" />
                <CIconButton icon="pause" tooltip="일시중지" />
                <CIconButton icon="restart" tooltip="재실행" />
                <CIconButton icon="edit" tooltip="수정" />
                <CIconButton icon="del" tooltip="삭제" disabled />
              </div>
            </CommActionBar>
            {/* <div className="date">{Date()}</div> */}
          </div>
          <div className="panelCont">
            <ClusterNode />
          </div>
        </PanelBox>
        <PanelBox className="panel_graph">
          <div className="panelTitBar panelTitBar_clear">
            <div className="tit">클러스터 모니터링</div>
            <div className="date">{Date()}</div>
          </div>
          <div className="panelCont">
            <ClusterMonit />
            {/* <ServiceInfo /> */}
          </div>
        </PanelBox>
        {/* <UserDetail /> */}
        {/* </CReflexBox> */}
      </ClusterWrap>
      <ClusterWrap>
        <PanelBox className="panel_graph">
          <div className="panelTitBar panelTitBar_clear">
            <div className="tit">리소스 사용량</div>
            <div className="date">{Date()}</div>
          </div>
          <div className="panelCont">
            <ClusterResource />
            {/* <ServiceInfo /> */}
          </div>
        </PanelBox>
        <PanelBox className="panel_graph">
          <div className="panelTitBar panelTitBar_clear">
            <div className="tit">파드 정보</div>
            <div className="date">{Date()}</div>
          </div>
          <div className="panelCont">
            <ClusterPod />
          </div>
        </PanelBox>
        {/* <UserDetail /> */}
        {/* </CReflexBox> */}
      </ClusterWrap>
    </>
  );
};
export default ClusterInfoTab;
