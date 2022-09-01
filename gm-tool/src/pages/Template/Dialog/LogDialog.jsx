import React from 'react';
import { CDialog } from "@/components/dialogs";
import styled from 'styled-components';

const CodeWrap = styled.div`
  width: 100%;
  height: 380px;
  background: #272822;
  color: #f8f8f2;
  padding: 20px;
  font-family: Consolas,"courier new",serif;
  font-size: 105%;
`;

const LogDialog = (props) => {
    const {open} = props;
    const handleClose = () => {
        props.onClose && props.onClose();
    };

    return (
        <CDialog
            id="myDialog"
            open={open}
            maxWidth="sm"
            title={`로그 상세보기`}
            onClose={handleClose}
            modules={['confirm']}
        >
            <CodeWrap>
                root pts/1:0.0 Sun Feb root pts/1:0.0 Sun Feb root pts/1:0.0 Sun Feb
            </CodeWrap>
        </CDialog>
    );
}
export default LogDialog;
