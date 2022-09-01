import React from 'react';
import { CDialog } from "@/components/dialogs";
import { swalConfirm } from "@/utils/swal-utils";

const NoticeDialog = (props) => {
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
            topBtn={true}
            topModules={['update','delete']}
        >
            <table className="tb_data tb_write">
                <tbody>
                <tr>
                    <th>제목</th>
                    <td colSpan={3}>
                        <span className="td-txt">제목</span>
                    </td>
                </tr>
                <tr>
                    <th>내용</th>
                    <td colSpan={3}>
                        <div className="td-board">
                            공지 내용<br/>
                            공지 내용<br/>
                            공지 내용<br/>
                            공지 내용<br/>
                        </div>
                    </td>
                </tr>
                <tr>
                    <th>첨부파일</th>
                    <td colSpan={3}>
                        <span className="td-txt"><button type="button" className="link_file">첨부파일.pdf</button></span>
                    </td>
                </tr>
                </tbody>
            </table>
        </CDialog>
    );
}
export default NoticeDialog;
