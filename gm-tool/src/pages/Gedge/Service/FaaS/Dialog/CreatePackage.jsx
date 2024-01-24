import { observer } from "mobx-react";
import FormControl from "@material-ui/core/FormControl";
import { CTextField } from "@/components/textfields";
import { CDialogNew } from "@/components/dialogs";
import styled from "styled-components";
import { useState } from "react";
import FaasStore from "../../../../../store/Faas";
import { useEffect } from "react";
import FormData from "form-data";

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

const CreatePackage = observer((props) => {
  const { open, reloadFunc, onClose } = props;
  const Type = ["source", "deploy", "code"];
  const [postType, setPostType] = useState("");
  const [selectFile, setSelectFile] = useState("");
  const [callback, setCallback] = useState("");
  const {
    loadEnvListAPI,
    envList,
    createPackage,
    packageCode,
    setPackageCode,
    packageSource,
    setPackageSource,
    packageDeploy,
    setPackageDeploy,
    postPackageFileApi,
    resetPackageSource,
    resetPackageDeploy,
    resetPackageCode,
  } = FaasStore;

  useEffect(() => {
    loadEnvListAPI();
  }, []);

  const handleClose = () => {
    props.onClose && props.onClose();
    resetPackageSource();
    resetPackageDeploy();
    resetPackageCode();
  };

  const postPackage = async () => {
    if (postType === "code") {
      await createPackage(packageCode);
    }
    if (postType === "source") {
      await createPackage(packageSource);
    }
    if (postType === "deploy") {
      await createPackage(packageDeploy);
    }
    props.reloadFunc && props.reloadFunc();
    props.onClose && props.onClose();
    resetPackageSource();
    resetPackageDeploy();
    resetPackageCode();
  };

  const onSelectFile = async (e) => {
    e.preventDefault();
    e.persist();
    const selectedFile = e.target.files;
    const file = selectedFile[0];

    setSelectFile(selectedFile[0].name);

    if (file) {
      const formData = new FormData();
      formData.append("test1", file);
      await postPackageFileApi(formData, callback);
    }
  };

  const onChangePackage = (event) => {
    setPostType(event.target.value);
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    if (postType === "code") {
      setPackageCode({
        ...packageCode,
        [name]: value,
      });
    }
    if (postType === "source") {
      setPackageSource({
        ...packageSource,
        [name]: value,
        ["sourcearchive"]: selectFile,
      });
    }
    if (postType === "deploy") {
      setPackageDeploy({
        ...packageDeploy,
        [name]: value,
        ["deployarchive"]: selectFile,
      });
    }
  };

  return (
    <CDialogNew
      id="myDialog"
      open={open}
      maxWidth="md"
      title={`Create Package`}
      onClose={handleClose}
      bottomArea={false}
      modules={["custom"]}
    >
      <table className="tb_data_new tb_write">
        <tbody>
          <tr>
            <th>
              Post type <span className="requried">*</span>
            </th>
            <td colSpan={3}>
              <FormControl className="form_fullWidth">
                <select name="Posttype" onChange={onChangePackage}>
                  <option value={""}>Select Post type</option>
                  {Type.map((item) => (
                    <option value={item}>{item}</option>
                  ))}
                </select>
              </FormControl>
            </td>
          </tr>
          {postType === "source" ? (
            <>
              <tr>
                <th>
                  File List <span className="requried">*</span>
                </th>
                <td>
                  <CTextField
                    type="text"
                    className="form-fullWidth"
                    name="selectFile"
                    value={selectFile}
                    readOnly
                    style={{ width: "100%" }}
                  />
                </td>
                <th>
                  File Upload <span className="requried">*</span>
                </th>
                <td>
                  <input type="file" onChange={onSelectFile} />
                </td>
              </tr>
              <tr>
                <th>
                  Package Name <span className="requried">*</span>
                </th>
                <td colSpan={3}>
                  <div style={{ display: "flex" }}>
                    <CTextField
                      type="text"
                      placeholder="Package Name"
                      className="form-fullWidth"
                      name="pack_name"
                      onChange={onChange}
                      style={{ width: "100%", marginRight: "10px" }}
                    />
                    {/* <button style={{ width: "200px" }}>Unique Check</button> */}
                  </div>
                </td>
              </tr>
              <tr>
                <th>
                  Environment <span className="requried">*</span>
                </th>
                <td colSpan={3}>
                  <FormControl className="form_fullWidth">
                    <select name="env_name" onChange={onChange}>
                      <option value={""}>Select Environment</option>
                      {envList.map((item) => (
                        <option value={item.env_name}>{item.env_name}</option>
                      ))}
                    </select>
                  </FormControl>
                </td>
              </tr>
              <tr>
                <th>
                  Build <span className="requried">*</span>
                </th>
                <td colSpan={3}>
                  <CTextField
                    type="text"
                    placeholder="Build"
                    className="form-fullWidth"
                    name="build"
                    onChange={onChange}
                    style={{ width: "100%", marginRight: "10px" }}
                  />
                </td>
              </tr>
            </>
          ) : null}
          {postType === "deploy" ? (
            <>
              <tr>
                <th>
                  File List <span className="requried">*</span>
                </th>
                <td>
                  <CTextField
                    type="text"
                    className="form-fullWidth"
                    name="selectFile"
                    value={selectFile}
                    readOnly
                    style={{ width: "100%" }}
                  />
                </td>
                <th>
                  File Upload <span className="requried">*</span>
                </th>
                <td>
                  <input type="file" onChange={onSelectFile} />
                </td>
              </tr>
              <tr>
                <th>
                  Package Name <span className="requried">*</span>
                </th>
                <td colSpan={3}>
                  <div style={{ display: "flex" }}>
                    <CTextField
                      type="text"
                      placeholder="Package Name"
                      className="form-fullWidth"
                      name="pack_name"
                      onChange={onChange}
                      style={{ width: "100%", marginRight: "10px" }}
                    />
                    {/* <button style={{ width: "200px" }}>Unique Check</button> */}
                  </div>
                </td>
              </tr>
              <tr>
                <th>
                  Environment <span className="requried">*</span>
                </th>
                <td colSpan={3}>
                  <FormControl className="form_fullWidth">
                    <select name="env_name" onChange={onChange}>
                      <option value={""}>Select Environment</option>
                      {envList.map((item) => (
                        <option value={item.env_name}>{item.env_name}</option>
                      ))}
                    </select>
                  </FormControl>
                </td>
              </tr>
            </>
          ) : null}
          {postType === "code" ? (
            <>
              <tr>
                <th>
                  Package Name <span className="requried">*</span>
                </th>
                <td colSpan={3}>
                  <div style={{ display: "flex" }}>
                    <CTextField
                      type="text"
                      placeholder="Package Name"
                      className="form-fullWidth"
                      name="pack_name"
                      onChange={onChange}
                      style={{ width: "100%", marginRight: "10px" }}
                    />
                    {/* <button style={{ width: "200px" }}>Unique Check</button> */}
                  </div>
                </td>
              </tr>
              <tr>
                <th>
                  Environment <span className="requried">*</span>
                </th>
                <td colSpan={3}>
                  <FormControl className="form_fullWidth">
                    <select name="env_name" onChange={onChange}>
                      <option value={""}>Select Environment</option>
                      {envList.map((item) => (
                        <option value={item.env_name}>{item.env_name}</option>
                      ))}
                    </select>
                  </FormControl>
                </td>
              </tr>
              <tr>
                <th>
                  Code <span className="requried">*</span>
                </th>
                <td colSpan={3}>
                  <CTextField
                    type="text"
                    placeholder="Code"
                    className="form-fullWidth"
                    name="code"
                    onChange={onChange}
                    style={{ width: "100%" }}
                  />
                </td>
              </tr>
            </>
          ) : null}
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
          <ButtonNext onClick={postPackage}>생성</ButtonNext>
        </div>
      </div>
    </CDialogNew>
  );
});

export default CreatePackage;
