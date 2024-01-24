import { observer } from "mobx-react";
import { CDialogNew } from "@/components/dialogs";
import styled from "styled-components";

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

const CreatePoolSize = observer((props) => {
  const { open } = props;

  const handleClose = () => {
    props.onClose && props.onClose();
  };

  const createPoolSize = () => {
    console.log("createPoolSize");
  };

  return (
    <CDialogNew
      id="myDialog"
      open={open}
      maxWidth="md"
      title={`Create Pool Size`}
      onClose={handleClose}
      bottomArea={false}
      modules={["custom"]}
    >
      <table className="tb_data_new tb_write">
        <tbody></tbody>
      </table>
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
          <ButtonNext onClick={createPoolSize}>생성</ButtonNext>
        </div>
      </div>
    </CDialogNew>
  );
});

export default CreatePoolSize;
