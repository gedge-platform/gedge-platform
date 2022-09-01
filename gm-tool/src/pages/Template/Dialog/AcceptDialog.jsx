import React from 'react';
import { CDialog } from "@/components/dialogs";
import { swalConfirm } from "@/utils/swal-utils";

const AcceptDialog = (props) => {
    const {open} = props;
    const handleClose = () => {
        props.onClose && props.onClose();
    };
    const handleDeleteAlert = () => {
        swalConfirm("삭제하시겠습니까?");
    }
    const handleUpdate = () => {

    }

    return (
        <CDialog
            id="myDialog"
            open={open}
            maxWidth="md"
            title={`상세보기`}
            onClose={handleClose}
            modules={['confirm']}
            onDelete={handleDeleteAlert}
            onUpdate={handleUpdate}
        >
            <table className="tb_data tb_write">
                <tbody>
                <tr>
                    <th>이름</th>
                    <td>
                        <span className="td-txt">홍길동</span>
                    </td>
                </tr>
                <tr>
                    <th>성별</th>
                    <td>
                        <span className="td-txt">남자</span>
                    </td>
                </tr>
                <tr>
                    <th>생년월일</th>
                    <td>
                        <span className="td-txt">20000505</span>
                    </td>
                </tr>
                <tr>
                    <th>이메일</th>
                    <td>
                        <span className="td-txt">agaf@gmail.com</span>
                    </td>
                </tr>
                <tr>
                    <th>주소</th>
                    <td>
                        <span className="td-txt">주소</span>
                    </td>
                </tr>
                <tr>
                    <th>연락처</th>
                    <td>
                        <span className="td-txt">010-1234-5678</span>
                    </td>
                </tr>
                <tr>
                    <th>설명</th>
                    <td>
                        <span className="td-txt">
                            공모전 상세 내용<br/>
                            공모전 상세 내용 공모전 상세 내용<br/>
                            공모전 상세 내용<br/>
                            공모전 상세 내용<br/>
                        </span>
                    </td>
                </tr>
                <tr>
                    <th>첨부파일</th>
                    <td>
                        <span className="td-txt"><button type="button" className="link_file">첨부파일.pdf</button></span>
                    </td>
                </tr>
                </tbody>
            </table>
        </CDialog>
    );
}
export default AcceptDialog;
