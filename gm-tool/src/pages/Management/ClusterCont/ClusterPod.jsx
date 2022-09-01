import React, { useState } from 'react';
// import APIAppTab from './APIAppTab'
import { AgGrid } from '@/components/datagrids'
import { agDateColumnFilter } from "@/utils/common-utils";

const ClusterPod = (props) => {
    const [rowData] = useState([
        {
            no: "1",
            name: "홍길동",
            userrole: "사용자",
            loginTimeAt: "2021-06-29T11:25:00Z",
            register:  "2021. 02. 01",
            state:"Active"
        },
        {
            no: "2",
            name: "홍길동",
            userrole: "관리자",
            loginTimeAt: "2021-06-29T11:25:00Z",
            register:  "2021. 02. 01",
            state:"Non-Active"
        },
        {
            no: "3",
            name: "홍길동",
            userrole: "관리자",
            loginTimeAt: "2021-06-29T11:25:00Z",
            register:  "2021. 02. 01",
            state:"Active"
        },
        {
            no: "4",
            name: "홍길동",
            userrole: "사용자",
            loginTimeAt: "2021-06-29T11:25:00Z",
            register:  "2021. 02. 01",
            state:"Pending"
        },
        {
            no: "5",
            name: "홍길동",
            userrole: "사용자",
            loginTimeAt: "2021-06-29T11:25:00Z",
            register:  "2021. 02. 01",
            state:"Non-Active"
        },
        {
            no: "6",
            name: "홍길동",
            userrole: "사용자",
            loginTimeAt: "2021-06-29T11:25:00Z",
            register:  "2021. 02. 01",
            state:"Pending"
        }
        
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
            minWidth: 80,
            maxWidth: 80,
        },
        {
            headerName: '사용자 이름',
            field: 'name',
            filter: true,
        },
        {
            headerName: '사용자 역할',
            field: 'userrole',
            filter: true,
        },
        {
            headerName: 'Last Login',
            field: 'loginTimeAt',
            filter: true,
        },
        {
            headerName: '등록일',
            field: 'register',
            filter: 'agDateColumnFilter',
            filterParams: agDateColumnFilter(),
            minWidth: 150,
            maxWidth: 200,
        },
        {
            headerName: '상태',
            field: 'state',
            filter: true,
            cellRenderer: function (state) {
                if (state.data.state =="Active"){
                    return `<span class="state_ico state_02">Active</span>`;
                }else if(state.data.state =="Non-Active"){
                    return `<span class="state_ico state_04">error</span>`;
                }else if (state.data.state =="Pending"){
                    return `<span class="state_ico state_05">Pending</span>`;
                }
                return `<span class="state_ico state_02">승인 대기</span>`;
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
    return (
        <>
         <div className="grid-height_10">
                        <AgGrid
                            rowData={rowData}
                            columnDefs={columnDefs}
                        />
                    </div>
        </>
    );
}

export default ClusterPod;