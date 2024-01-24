import React, { useState, useEffect } from 'react';
import { CDialog } from "@/components/dialogs";
import { swalConfirm } from "@/utils/swal-utils";
import FormControl from "@material-ui/core/FormControl";
import { CTextField } from "@/components/textfields";
import { CFileField } from "@/components/textfields/CFilefield";

const NoticeCreateDialog = (props) => {
    const {open} = props;
    const handleClose = () => {
        props.onClose && props.onClose();
    };
    const handleCreateAlert = () => {
        swalConfirm("등록하시겠습니까?");
    }

    return (
        <CDialog
            id="myDialog"
            open={open}
            maxWidth="md"
            title={`공지사항 등록하기`}
            onClose={handleClose}
            onCreate={handleCreateAlert}
            modules={['create']}
        >
            <table className="tb_data tb_write">
                <tbody>
                <tr>
                    <th>제목</th>
                    <td colSpan={3}>
                        <CTextField
                            id="dataset-title"
                            type="text"
                            placeholder="제목을 입력하세요."
                            className="form_fullWidth"
                        />
                    </td>
                </tr>
                <tr>
                    <th>상세내용</th>
                    <td colSpan={3}>
                        <textarea
                            placeholder="내용을 입력하세요."
                            minRows="20"
                        />
                    </td>
                </tr>
                <tr>
                    <th>첨부파일</th>
                    <td colSpan={3}>
                        <CFileField
                            id="dataset-title"
                        />
                    </td>
                </tr>
                </tbody>
            </table>
        </CDialog>
    );
}
export default NoticeCreateDialog;
