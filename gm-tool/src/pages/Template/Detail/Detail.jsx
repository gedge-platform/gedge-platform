import React, {useState} from 'react';
import CommActionBar from "@/components/common/CommActionBar";
import { CIconButton, CSelectButton } from "@/components/buttons";
import { PanelBox } from "@/components/styles/PanelBox";
import { swalConfirm } from "@/utils/swal-utils";
import {CScrollbar} from "@/components/scrollbars";
import { CTabs, CTab, CTabPanel } from '@/components/tabs';
import { AgGrid } from '@/components/datagrids'
import {agDateColumnFilter} from "@/utils/common-utils";
import LogDialog from "../Dialog/LogDialog";
import { CDatePicker } from "@/components/textfields/CDatePicker";

const Detail = (props) => {
    const [open, setOpen] = useState(false);
    const [tabvalue, setTabvalue] = useState(0);
    // const actionList = [
    //     {
    //         name: '요청',
    //         onClick: () => {
    //             swalConfirm("요청하시겠습니까?")
    //         },
    //     },
    //     {
    //         name: '완료',
    //         onClick: () => {
    //             swalConfirm("완료하시겠습니까?")
    //         },
    //     },
    //     {
    //         name: '반려',
    //         onClick: () => {
    //             swalConfirm("반려하시겠습니까?")
    //         },
    //     },
    // ]

    const handleTabChange = (event, newValue) => {
        setTabvalue(newValue);
    };

    const handleOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    const [rowData] = useState([
        {
            date: "2021. 02. 01",
            time: "12:00:59",
            callAPI: "TEST 조회",
            code: "200",
            level: "Warning",
            hostName: "x.x.x.x",
            message: "Get / 200 4ms",
        },
        {
            date: "2021. 02. 01",
            time: "12:00:59",
            callAPI: "TEST 조회",
            code: "200",
            level: "Error",
            hostName: "x.x.x.x",
            message: "Get / 200 4ms",
        },
        {
            date: "2021. 02. 01",
            time: "12:00:59",
            callAPI: "TEST 조회",
            code: "200",
            level: "Info",
            hostName: "x.x.x.x",
            message: "Get / 200 4ms",
        },
        {
            date: "2021. 02. 01",
            time: "12:00:59",
            callAPI: "TEST 조회",
            code: "200",
            level: "Warning",
            hostName: "x.x.x.x",
            message: "Get / 200 4ms",
        },
        {
            date: "2021. 02. 01",
            time: "12:00:59",
            callAPI: "TEST 조회",
            code: "200",
            level: "Error",
            hostName: "x.x.x.x",
            message: "Get / 200 4ms",
        },
        {
            date: "2021. 02. 01",
            time: "12:00:59",
            callAPI: "TEST 조회",
            code: "200",
            level: "Info",
            hostName: "x.x.x.x",
            message: "Get / 200 4ms",
        },
    ]);
    const [columnDefs] = useState([
        {
            headerName: '날짜',
            field: 'date',
            filter: false,
        },
        {
            headerName: '시간',
            field: 'time',
            filter: false,
        },
        {
            headerName: '호출 API',
            field: 'callAPI',
            filter: false,
        },
        {
            headerName: '상태코드',
            field: 'code',
            filter: false,
        },
        {
            headerName: '레벨',
            field: 'level',
            filter: false,
        },
        {
            headerName: '호스트 이름',
            field: 'hostName',
            filter: false,
        },
        {
            headerName: '메세지',
            field: 'message',
            filter: false,
            minWidth: 200,
            maxWidth: 300,
        },
    ]);

    return (
        <PanelBox>
            <CTabs
                type="tab2"
                value={tabvalue}
                onChange={handleTabChange}
            >
                <CTab label="상세정보" />
                <CTab label="로그" />
            </CTabs>
            <div className="tabPanelContainer">
                <CTabPanel
                    value={tabvalue}
                    index={0}
                >
                    <div className="panelCont">
                        <table className="tb_data">
                            <tbody>
                            <tr>
                                <th>API 이름</th>
                                <td>OOO 조회</td>
                                <th>형식</th>
                                <td>JSON</td>
                            </tr>
                            <tr>
                                <th>담당자</th>
                                <td>홍길동</td>
                                <th>메일 주소</th>
                                <td>email@email.com</td>
                            </tr>
                            <tr>
                                <th>연락처</th>
                                <td>010-1234-5678</td>
                                <th>인증 유형</th>
                                <td>Auth Key</td>
                            </tr>
                            <tr>
                                <th>등록일</th>
                                <td>2021.03.01</td>
                                <th>URL</th>
                                <td>http://sample.co.kr/test</td>
                            </tr>
                            <tr>
                                <th>사용량</th>
                                <td>38</td>
                                <th>승인시간</th>
                                <td>2021. 07. 05</td>
                            </tr>
                            <tr>
                                <th>API 설명</th>
                                <td colSpan={3}>
                                    설명에 대한 내용입니다. 설명에 대한 내용입니다. 설명에 대한 내용입니다.<br/>
                                    설명에 대한 내용입니다. 설명에 대한 내용입니다. 설명에 대한 내용입니다. 설명에 대한 내용입니다.<br/>
                                    설명에 대한 내용입니다. 설명에 대한 내용입니다. 설명에 대한 내용입니다.<br/>
                                    설명에 대한 내용입니다. 설명에 대한 내용입니다. 설명에 대한 내용입니다. 설명에 대한 내용입니다. <br/>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                    
                </CTabPanel>
                <CTabPanel
                    value={tabvalue}
                    index={1}
                >
                    <CommActionBar isDate={true}/>
                    <div className="panelCont">
                        <div className="grid-height">
                            <AgGrid
                                rowData={rowData}
                                columnDefs={columnDefs}
                                onCellClicked={handleOpen}
                            />
                        </div>
                        <LogDialog
                            open={open}
                            onClose={handleClose}
                        />
                    </div>
                </CTabPanel>
            </div>
        </PanelBox>


    );
}
export default Detail;
