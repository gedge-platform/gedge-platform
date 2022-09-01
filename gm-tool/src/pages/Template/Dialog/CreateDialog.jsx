import React, { useState, useEffect } from 'react';
import { CDialog } from "@/components/dialogs";
import styled from 'styled-components';
import { swalConfirm } from "@/utils/swal-utils";
import FormControl from '@material-ui/core/FormControl';
import { CTextField } from "@/components/textfields";
import { CFileField } from "@/components/textfields/CFilefield";
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';

const CreateDialog = (props) => {
    const {open} = props;
    const [value, setValue] = useState('XML');
    const handleClose = () => {
        props.onClose && props.onClose();
    };

    const handleCreateAlert = () => {
        swalConfirm("추가하시겠습니까??");
    }

    const handleChange = (event) => {
        let newlang = event.target.value;
        setValue(newlang);
        // i18n.changeLanguage(newlang);
    };

    return (
        <CDialog
            id="myDialog"
            open={open}
            maxWidth="sm"
            title={`API 추가`}
            onClose={handleClose}
            onCustom={handleCreateAlert}
            modules={['custom', 'close']}
        >
            <table className="tb_data tb_write">
                <tbody>
                <tr>
                    <th>API 이름</th>
                    <td>
                        <CTextField
                            id="template-name"
                            type="text"
                            placeholder="API 이름을 입력하세요."
                            className="form_fullWidth"
                        />
                    </td>
                    <th>담당자</th>
                    <td>
                        <CTextField
                            id="template-charge"
                            type="text"
                            value="홍길동"
                            className="form_fullWidth"
                            disabled="disabled"
                        />
                    </td>
                </tr>
                <tr>
                    <th>형식</th>
                    <td colSpan={3}>
                        <RadioGroup
                            value={value}
                            onChange={handleChange}
                        >
                            <FormControlLabel
                                value="XML"
                                control={<Radio />}
                                label="XML"
                            />
                            <FormControlLabel
                                value="JSON"
                                control={<Radio />}
                                label="JSON"
                            />
                            <FormControlLabel
                                value="FILE"
                                control={<Radio />}
                                label="FILE"
                            />
                            <CFileField
                                id="cfilefield-title"
                            />
                        </RadioGroup>

                    </td>
                </tr>
                <tr>
                    <th>메일주소</th>
                    <td>
                        <CTextField
                            id="template-mail"
                            type="text"
                            placeholder="메일주소를 입력하세요."
                            className="form_fullWidth"
                        />
                    </td>
                    <th>연락처</th>
                    <td>
                        <CTextField
                            id="template-contact"
                            type="text"
                            placeholder="연락처를 입력하세요."
                            className="form_fullWidth"
                        />
                    </td>
                </tr>
                <tr>
                    <th>등록일</th>
                    <td>
                        <CTextField
                            id="template-date"
                            type="text"
                            value="2021. 01. 01"
                            className="form_fullWidth"
                            disabled="disabled"
                        />
                    </td>
                    <th>URL</th>
                    <td>
                        <CTextField
                            id="template-url"
                            type="text"
                            placeholder="http://asdasd.com"
                            className="form_fullWidth"
                        />
                    </td>
                </tr>
                <tr>
                    <th>API 설명</th>
                    <td colSpan="3"><textarea placeholder="내용을 입력하세요." rows="10"></textarea></td>
                </tr>
                </tbody>
            </table>
        </CDialog>
    );
}
export default CreateDialog;
