import { observer } from "mobx-react";
import FormControl from "@material-ui/core/FormControl";
import { CTextField } from "@/components/textfields";
import styled from "styled-components";
import { CDialogNew } from "@/components/dialogs";
import FaasStore from "../../../../../store/Faas";
import { useState } from "react";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/theme-monokai";

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

const CreateFunction = observer((props) => {
  const { open } = props;
  const {
    envList,
    functionName,
    setFunctionName,
    setEnvNameList,
    functionFileContent,
    setFunctionFileContent,
    PostFuncionsAPI,
  } = FaasStore;
  const [fileViewer, setFileViewer] = useState("");

  const handleClose = () => {
    props.onClose && props.onClose();
    setFunctionName("");
    setEnvNameList("");
    setFileContent("");
  };

  const postFunction = () => {
    PostFuncionsAPI();
    props.reloadFunc && props.reloadFunc();
    props.onClose && props.onClose();
  };

  const onChange = ({ target }) => {
    const { value, name } = target;

    if (name === "functionName") {
      setFunctionName(value);
    }

    if (name === "environment") {
      setEnvNameList(value);
    }
  };

  const onChangeFile = (e) => {
    const selectFile = e.target.files[0];

    if (selectFile) {
      const reader = new FileReader();

      reader.onload = (e) => {
        const content = e.target.result;
        setFunctionFileContent(content);
        setFileViewer(content);
      };

      reader.readAsText(selectFile);
    }
  };

  const ViewOfComponent = (content) => {
    return (
      <AceEditor
        placeholder="Empty"
        mode="javascript"
        theme="monokai"
        name="editor"
        width="100%"
        fontSize={14}
        showPrintMargin={true}
        showGutter={true}
        highlightActiveLine={true}
        value={content}
        setOptions={{
          enableBasicAutocompletion: false,
          enableLiveAutocompletion: false,
          enableSnippets: false,
          showLineNumbers: true,
          tabSize: 4,
        }}
        readOnly={true}
      />
    );
  };

  return (
    <CDialogNew
      id="myDialog"
      open={open}
      maxWidth="md"
      title={`Create Function`}
      onClose={handleClose}
      bottomArea={false}
      modules={["custom"]}
    >
      <table className="tb_data_new tb_write">
        <tbody>
          <tr>
            <th>
              Name <span className="requried">*</span>
            </th>
            <td>
              <CTextField
                type="text"
                placeholder="Function Name"
                className="form-fullWidth"
                name="functionName"
                onChange={onChange}
                value={functionName}
                style={{ width: "100%" }}
              />
            </td>
          </tr>
          <tr>
            <th>
              Environment <span className="requried">*</span>
            </th>
            <td>
              <FormControl className="form_fullWidth">
                <select name="environment" onChange={onChange}>
                  <option value="">Select Environment</option>
                  {envList ? (
                    envList?.map((data) => (
                      <option key={data.env_name} value={data.env_name}>
                        {data.env_name}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>
                      No Data
                    </option>
                  )}
                </select>
              </FormControl>
            </td>
            <td></td>
          </tr>
          <tr>
            <th>
              Content <span className="requried">*</span>
            </th>
            <td>
              <FormControl className="form_fullWidth">
                <input type="file" name="file" onChange={onChangeFile} />
              </FormControl>
            </td>

            <td></td>
          </tr>
          <tr>
            <th></th>
            <td>{ViewOfComponent(fileViewer)}</td>
          </tr>
        </tbody>
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
          <ButtonNext onClick={postFunction}>생성</ButtonNext>
        </div>
      </div>
    </CDialogNew>
  );
});

export default CreateFunction;
