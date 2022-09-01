import React, { useState } from 'react';
import Layout from "@/layout";
import { Title } from '@/pages';
import { PanelBox } from "@/components/styles/PanelBox";
import { AgGrid } from "@/components/datagrids";
import styled from 'styled-components';
import FormControl from "@material-ui/core/FormControl";
import { CButton } from "@/components/buttons";

const DashboardWrap = styled.div`
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  margin-bottom: 12px;
  .panel_graph, .panel_list {
    flex-grow: 1;
  }
  .panel_dashboard {
    width: 360px;
    margin: 12px 12px 0 0;
    &:first-child {
      margin-top:0;
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
      content: '';
      position: absolute;
      top: 50%;
      left: -4px;
      width: 29px;
      border-top: 1px solid #b7b7b7;
      transform: rotate(-70deg);
    }
  }
  .vm_01 {
    color: #1d90ff
  }
  .vm_02 {
    color: #00b91a
  }
  .vm_03 {
    color: #ff5a00
  }
`;

const DashboardCont = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const DashboardCircle = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 180px;
  height: 180px;
  color: #fff;
  &:first-child {
    border-right: 1px dotted #e0e2e5;
  }
`;

const DashboardList = styled.ul`
  flex-grow: 1;
  li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    min-height: 45px;
    padding: 33px 20px;
    &:first-child ~ li {
      border-top: 1px dotted #c5cad0
    }
    .label {
      position: relative;
      padding-left: 18px;
      color: #071e3f;
      &::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 0;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: #fff;
        transform: translateY(-50%);
      }
      &.blue {
        &::before {
            background: #389bff;
        }
      }
      &.red {
        &::before {
            background: #ee5a4c;
        }
      }
      &.green {
        &::before {
            background: #14bd19;
        }
      }
    }
    .value {
      font-size: 22px;
      font-weight: bold;
      &.red {
        color: #ee5a4c;
      }
      &.green {
        color: #14bd19;
      }
    }
    .count {
      margin-left: 5px;
      font-size: 13px;
      font-weight: normal;
      color: #071e3f;
      display: inline-block;
    }
  }
`;

const DashboardSummary = styled.ul`
  width: 100%;
  display: flex;
  li {
    position: relative;
    flex-grow: 1;
    justify-content: space-between;
    align-items: center;
    text-align: center;
    &:first-child {
        border-right: 1px solid #e0e2e5;
      }
    .label {
      padding: 11px 0;
      font-size: 13px;
      color: #071e3f;
      display: block;
      border-bottom: 1px solid #c5cad0;
    }
    .value {
      margin-top: 1px;
      padding: 49px 0 50px;
      font-size: 36px;
      font-weight: bold;
      display: block;
      border-top: 1px solid #eceeef;
    }
  }
`;

const Dashboard = () => {
    const currentPage = Title.Dashboard;
    const [rowData] = useState([
        {
            no: "1",
            apiname: "User01",
            type: "JSON",
            charge: "홍길동",
            auth: "auth key",
            register: "2021. 02. 01",
        },
        {
            no: "2",
            apiname: "User01",
            type: "JSON",
            charge: "홍길동",
            auth: "auth key",
            register: "2021. 02. 01",
        },
        {
            no: "3",
            apiname: "User01",
            type: "JSON",
            charge: "홍길동",
            auth: "auth key",
            register: "2021. 02. 01",
        },
        {
            no: "4",
            apiname: "User01",
            type: "JSON",
            charge: "홍길동",
            auth: "auth key",
            register: "2021. 02. 01",
        },
        {
            no: "5",
            apiname: "User01",
            type: "JSON",
            charge: "홍길동",
            auth: "auth key",
            register: "2021. 02. 01",
        },
        {
            no: "6",
            apiname: "User01",
            type: "JSON",
            charge: "홍길동",
            auth: "auth key",
            register: "2021. 02. 01",
        },
        {
            no: "7",
            apiname: "User01",
            type: "JSON",
            charge: "홍길동",
            auth: "auth key",
            register: "2021. 02. 01",
        },
        {
            no: "8",
            apiname: "User01",
            type: "JSON",
            charge: "홍길동",
            auth: "auth key",
            register: "2021. 02. 01",
        },
        {
            no: "9",
            apiname: "User01",
            type: "JSON",
            charge: "홍길동",
            auth: "auth key",
            register: "2021. 02. 01",
        },
        {
            no: "10",
            apiname: "User01",
            type: "JSON",
            charge: "홍길동",
            auth: "auth key",
            register: "2021. 02. 01",
        },
    ]);
    const [columnDefs] = useState([
        {
            headerName: 'NO',
            field: 'no',
            filter: false,
            sortable: false,
            minWidth: 80,
            maxWidth: 80,
        },
        {
            headerName: 'API 이름',
            field: 'apiname',
            filter: false,
            sortable: false,
        },
        {
            headerName: '형식',
            field: 'type',
            filter: false,
            sortable: false,
        },
        {
            headerName: '담당자',
            field: 'charge',
            filter: false,
            sortable: false,
        },
        {
            headerName: '인증유형',
            field: 'auth',
            filter: false,
            sortable: false,
        },
        {
            headerName: '등록일',
            field: 'register',
            filter: false,
            sortable: false,
        },
    ]);

    return (
        <Layout currentPage={currentPage}>
            <DashboardWrap>
                <div className="panel_column">
                    <PanelBox className="panel_dashboard">
                        <div className="panelTitBar panelTitBar_clear">
                            <div className="tit">누적 API 호출 건수</div>
                        </div>
                        <div className="panelCont">
                            <DashboardCont>
                                <DashboardList>
                                    <li className="vm_01">
                                        <span className="label blue">데이터 호출 완료</span>
                                        <span className="value">165,503<span className="count">건</span></span>
                                    </li>
                                    <li className="vm_02">
                                        <span className="label red">데이터 호출 실패</span>
                                        <span className="value red">1<span className="count">건</span></span>
                                    </li>
                                </DashboardList>
                            </DashboardCont>

                        </div>
                    </PanelBox>
                    <PanelBox className="panel_dashboard">
                        <div className="panelTitBar panelTitBar_clear">
                            <div className="tit">금일 API 호출 건수</div>
                        </div>
                        <div className="panelCont">
                            <DashboardCont>
                                <DashboardList>
                                    <li className="vm_01">
                                        <span className="label green">데이터 호출 완료</span>
                                        <span className="value green">2,213<span className="count">건</span></span>
                                    </li>
                                    <li className="vm_02">
                                        <span className="label red">데이터 호출 실패</span>
                                        <span className="value red">1<span className="count">건</span></span>
                                    </li>
                                </DashboardList>
                            </DashboardCont>
                        </div>
                    </PanelBox>
                </div>

                <PanelBox className="panel_graph">
                    <div className="panelTitBar panelTitBar_clear">
                        <div className="tit">API 호출 현황</div>
                        <div className="date">2021.05.02 13:00</div>
                    </div>
                    <div className="panelCont">
                    </div>
                </PanelBox>
            </DashboardWrap>

            <DashboardWrap>
                <div className="panel_column">
                    <PanelBox className="panel_dashboard">
                        <div className="panelTitBar panelTitBar_clear">
                            <div className="tit">등록된 API 건수</div>
                        </div>
                        <div className="panelCont">
                            <DashboardCont>
                                <DashboardSummary>
                                    <li className="vm_01">
                                        <span className="label">전체 API</span>
                                        <span className="value">5678</span>
                                    </li>
                                    <li className="vm_02">
                                        <span className="label">신규 API</span>
                                        <span className="value green">1234</span>
                                    </li>
                                </DashboardSummary>
                            </DashboardCont>
                        </div>
                    </PanelBox>
                    <PanelBox className="panel_dashboard">
                        <div className="panelTitBar panelTitBar_clear">
                            <div className="tit">API 평균 응답률</div>
                        </div>
                        <div className="panelCont">
                            <DashboardCont>
                                <DashboardCircle>
                                    {/*CIRCLE들어갈자리 #1*/}
                                </DashboardCircle>
                                <DashboardCircle>
                                    {/*CIRCLE들어갈자리 #2*/}
                                </DashboardCircle>
                            </DashboardCont>
                        </div>
                    </PanelBox>
                </div>

                <PanelBox className="panel_list">
                    <div className="panelTitBar panelTitBar_clear">
                        <div className="tit">API 목록</div>
                        <div className="date">
                            <CButton type="btn2">더보기</CButton>
                        </div>
                    </div>
                    <div className="grid-height_10">
                        <AgGrid
                            rowData={rowData}
                            columnDefs={columnDefs}
                        />
                    </div>
                </PanelBox>
            </DashboardWrap>
        </Layout>
    );
}
export default Dashboard;
