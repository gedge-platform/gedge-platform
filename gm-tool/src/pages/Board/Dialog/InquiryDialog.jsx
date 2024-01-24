import React from 'react';
import { CDialog } from "@/components/dialogs";
import { swalConfirm } from "@/utils/swal-utils";

const InquiryDialog = (props) => {
    const {open} = props;
    const handleClose = () => {
        props.onClose && props.onClose();
    };
    const handleCreateAlert = () => {
        swalConfirm("등록하시겠습니까?");
    }
    const handleDeleteAlert = () => {
        swalConfirm("삭제하시겠습니까?");
    }

    return (
        <CDialog
            id="myDialog"
            open={open}
            maxWidth="sm"
            title={`상세보기`}
            onClose={handleClose}
            modules={['create']}
            onCreate={handleCreateAlert}
            onDelete={handleDeleteAlert}
            topBtn={true}
            topModules={['delete']}
        >
            <table className="tb_data tb_write">
                <tbody>
                <tr>
                    <th>제목</th>
                    <td>
                        <span className="td-txt">제목</span>
                    </td>
                </tr>
                <tr>
                    <th>문의내용</th>
                    <td>
                        <div className="td-board" style={{minHeight:200}}>
                            문의 내용<br/>
                            문의 내용<br/>
                            문의 내용<br/>
                            문의 내용<br/>
                        </div>
                    </td>
                </tr>
                <tr>
                    <th>답변</th>
                    <td>
                        <textarea
                            placeholder="내용을 입력하세요."
                            minRows="10"
                        />
                    </td>
                </tr>
                </tbody>
            </table>
        </CDialog>
    );
}
export default InquiryDialog;
