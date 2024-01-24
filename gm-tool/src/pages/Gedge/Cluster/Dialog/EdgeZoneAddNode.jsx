import React, { useRef, useState } from "react";
import { observer } from "mobx-react";
import { CDialogNew } from "@/components/dialogs";
import styled from "styled-components";
import { CTextField } from "@/components/textfields";
import CopyToClipboard from "react-copy-to-clipboard";
import { swalError } from "@/utils/swal-utils";

const Button = styled.button`
  background-color: #fff;
  border: 1px solid black;
  color: black;
  padding: 10px 35px;
  margin-right: 10px;
  border-radius: 4px;
`;

const ButtonNext = styled.button`
  background-color: #0f5ce9;
  color: white;
  border: none;
  padding: 10px 35px;
  border-radius: 4px;
`;

const EdgeZoneAddNode = observer((props) => {
  const { open } = props;
  const textRef = useRef(null);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    setCopied(true);
    swalError("클립보드에 복사되었습니다");
  };

  const handleClose = () => {
    props.onClose && props.onClose();
  };

  // 클립보드로 수정해야 함
  return (
    <CDialogNew
      id="myDialog"
      open={open}
      maxWidth="md"
      title={`Add Node`}
      onClose={handleClose}
      bottomArea={false}
      modules={["custom"]}
    >
      <table className="tb_data_new tb_write">
        <tbody>
          <tr>
            <th>Master Node</th>
            <td>
              <select className="selectNode" />
            </td>
          </tr>
        </tbody>
      </table>
      <div>
        <CopyToClipboard text="여기에 글 쓰면 복사됨" onCopy={handleCopy}>
          <button>Copy</button>
        </CopyToClipboard>
      </div>
      {/* <table className="tb_data_new tb_write">
        <tbody>
          <tr>
            <th>Node Name</th>
            <td>
              <CTextField
                type="text"
                className="form_fullWidth"
                name="nodeName"
              />
            </td>
          </tr>
          <tr>
            <th>Type</th>
            <td>
              <CTextField
                type="text"
                className="form_fullWidth"
                name="nodeType"
              />
            </td>
          </tr>
          <tr>
            <th>Ip</th>
            <td>
              <CTextField
                type="text"
                className="form_fullWidth"
                name="nodeIp"
              />
            </td>
          </tr>
          <tr>
            <th>Kube-Version</th>
            <td>
              <CTextField
                type="text"
                className="form_fullWidth"
                name="nodeKubeVersion"
              />
            </td>
          </tr>
          <tr>
            <th>OS</th>
            <td>
              <CTextField
                type="text"
                className="form_fullWidth"
                name="nodeOs"
              />
            </td>
          </tr>
          <tr>
            <th>created</th>
            <td>
              <CTextField
                type="text"
                className="form_fullWidth"
                name="nodeCreated"
              />
            </td>
          </tr>
        </tbody>
      </table> */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginTop: "32px",
        }}
      >
        <div
          style={{
            display: "flex",
            width: "240px",
            justifyContent: "center",
          }}
        >
          <Button onClick={handleClose}>취소</Button>
          <ButtonNext>생성</ButtonNext>
          {/* <ButtonNext onClick={onClickCreateCluster}>생성</ButtonNext> */}
        </div>
      </div>
    </CDialogNew>
  );
});

export default EdgeZoneAddNode;
