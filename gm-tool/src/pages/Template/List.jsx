import React, { useState, useEffect } from 'react';
import Layout from "@/layout";
import { PanelBox } from "@/components/styles/PanelBox";
import CommActionBar from '@/components/common/CommActionBar';
import { Title } from '@/pages';
import { AgGrid } from '@/components/datagrids'
import { agDateColumnFilter } from "@/utils/common-utils";
import { CCreateButton, CIconButton, CSelectButton } from "@/components/buttons";
import CreateDialog from "@/pages/Template/Dialog/CreateDialog";
import { CReflexBox } from "@/layout/Common/CReflexBox";

const List = () => {
    const currentPage = Title.List;
    const [open, setOpen] = useState(false);
    const [rowData] = useState([
        {
            no: "1",
            id: "User01",
            date: "2021.04.01",
            startTime: "2021.04.21  13:00",
            endTime: "2021.04.21  19:00",
            state: "승인대기",
        },
        {
            no: "2",
            id: "User02",
            date: "2021.04.01",
            startTime: "2021.04.21  13:00",
            endTime: "2021.04.21  19:00",
            state: "승인대기",
        },
        {
            no: "3",
            id: "User03",
            date: "2021.04.01",
            startTime: "2021.04.21  13:00",
            endTime: "2021.04.21  19:00",
            state: "승인대기",
        },
        {
            no: "4",
            id: "User04",
            date: "2021.04.01",
            startTime: "2021.04.21  13:00",
            endTime: "2021.04.21  19:00",
            state: "승인대기",
        },
        {
            no: "5",
            id: "User05",
            date: "2021.04.01",
            startTime: "2021.04.21  13:00",
            endTime: "2021.04.21  19:00",
            state: "승인대기",
        },
        {
            no: "6",
            id: "User06",
            date: "2021.04.01",
            startTime: "2021.04.21  13:00",
            endTime: "2021.04.21  19:00",
            state: "승인대기",
        },
        {
            no: "7",
            id: "User07",
            date: "2021.04.01",
            startTime: "2021.04.21  13:00",
            endTime: "2021.04.21  19:00",
            state: "승인대기",
        },
        {
            no: "8",
            id: "User08",
            date: "2021.04.01",
            startTime: "2021.04.21  13:00",
            endTime: "2021.04.21  19:00",
            state: "승인대기",
        },
        {
            no: "9",
            id: "User09",
            date: "2021.04.01",
            startTime: "2021.04.21  13:00",
            endTime: "2021.04.21  19:00",
            state: "승인대기",
        },
        {
            no: "10",
            id: "User10",
            date: "2021.04.01",
            startTime: "2021.04.21  13:00",
            endTime: "2021.04.21  19:00",
            state: "승인대기",
        },
    ]);
    const [columnDefs] = useState([
        {
            headerName: '',
            field: 'check',
            minWidth: 53,
            maxWidth: 53,
            filter: false,
            headerCheckboxSelection: true,
            headerCheckboxSelectionFilteredOnly: true,
            checkboxSelection: true,
        },
        {
            headerName: 'NO',
            field: 'no',
            filter: false,
            sort: 'desc',
            minWidth: 80,
            maxWidth: 80,
        },
        {
            headerName: '아이디',
            field: 'id',
            filter: true,
        },
        {
            headerName: '신청일',
            field: 'date',
            filter: 'agDateColumnFilter',
            filterParams: agDateColumnFilter(),
        },
        {
            headerName: '시작시간',
            field: 'startTime',
            filter: false,
        },
        {
            headerName: '종료시간',
            field: 'endTime',
            filter: false,
        },
        {
            headerName: '상태',
            field: 'state',
            filter: true,
            cellRenderer: function () {
                return `<span class="state_ico state_02">승인대기</span>`;
            }
        },
    ]);

    const actionList = [
        {
            name: '승인',
            onClick: () => {
                alert("승인하시겠습니까?")
            },
        },
        {
            name: '반려',
            onClick: () => {
                alert("반려하시겠습니까?")
            },
        },
        {
            name: '강제중지',
            onClick: () => {
                alert("강제중지 하시겠습니까?")
            },
        },
    ]

    const handleOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Layout currentPage={currentPage} resize={true}>
            <CReflexBox>
                <PanelBox>
                    <CommActionBar isSearch={true}>
                        <CCreateButton onClick={handleOpen}>
                            생성
                        </CCreateButton>
                        <CreateDialog
                            open={open}
                            onClose={handleClose}
                        />

                        <CSelectButton
                            items={actionList}
                        >
                            액션
                        </CSelectButton>

                        <div className="iconBtnGrope">
                            <CIconButton
                                icon="play"
                                tooltip="실행"
                            />
                            <CIconButton
                                icon="stop"
                                tooltip="중지"
                            />
                            <CIconButton
                                icon="pause"
                                tooltip="일시중지"
                            />
                            <CIconButton
                                icon="restart"
                                tooltip="재실행"
                            />
                            <CIconButton
                                icon="edit"
                                tooltip="수정"
                            />
                            <CIconButton
                                icon="del"
                                tooltip="삭제"
                                disabled
                            />
                        </div>
                    </CommActionBar>
                    <div className="panelCont">
                        <div className="grid-height">
                            <AgGrid
                                rowData={rowData}
                                columnDefs={columnDefs}
                            />
                        </div>
                    </div>
                </PanelBox>
            </CReflexBox>
        </Layout>
    );
}
export default List;
