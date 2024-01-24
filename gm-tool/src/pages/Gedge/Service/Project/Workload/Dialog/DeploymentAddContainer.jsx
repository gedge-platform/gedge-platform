import { observer } from "mobx-react";
import { CDialogNew } from "@/components/dialogs";
import { CTextField } from "@/components/textfields";
import { CSubTab, CTab } from "@/components/tabs";
import FormControl from "@material-ui/core/FormControl";
import styled from "styled-components";
import { useEffect, useState } from "react";
import { CSubTabs } from "../../../../../../components/tabs/CSubTabs";
import deploymentStore from "../../../../../../store/Deployment";
import { cloneDeep } from "lodash-es";
import claimStore from "../../../../../../store/Claim";
import { swalError } from "../../../../../../utils/swal-utils";

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

const ButtonAddHost = styled.button`
  background-color: #fff;
  border: 1px solid black;
  height: 30px;
  color: black;
  border-radius: 4px;
`;

const DeploymentAddContainer = observer((props) => {
  const {
    addContainer,
    command,
    setCommand,
    editContainer,
    deployment,
    loadVolumeList,
    keyValuePair,
    secretConfigmap,
  } = deploymentStore;
  const { volumeName } = claimStore;

  const { open, containerIndex } = props;
  const [tabvalue, setTabvalue] = useState(0);
  const [containerInfo, setContainerInfo] = useState();

  const handleTabChange = (_, value) => {
    setTabvalue(value);
  };

  const handleClose = () => {
    props.onClose && props.onClose();
  };

  const isContainerValid = () => {
    let validFlag = true;
    containerInfo.volumes.map((volume) => {
      if (volume.name === "" || volume.mountPoint === "") {
        validFlag = false;
      }
    });
    return validFlag;
  };

  const onChange = (e) => {
    setContainerInfo({
      ...containerInfo,
      [e.target.name]: e.target.value,
    });
  };

  const onChangePort = (e, index) => {
    const temp = {
      ...containerInfo.ports[index],
      [e.target.name]: e.target.value,
    };
    containerInfo.ports[index] = temp;
    setContainerInfo({
      ...containerInfo,
      ports: [...containerInfo.ports],
    });
  };

  const addPort = () => {
    setContainerInfo({
      ...containerInfo,
      ports: [
        ...containerInfo.ports,
        {
          name: "",
          privateContainerPort: "",
          protocol: "TCP",
        },
      ],
    });
  };

  const removePort = (removeIndex) => {
    containerInfo.ports = containerInfo.ports.filter(
      (_, index) => removeIndex !== index
    );
    setContainerInfo({
      ...containerInfo,
    });
  };

  const onChangeVariable = (e, index) => {
    containerInfo.variables[index] = {
      ...containerInfo.variables[index],
      [e.target.name]: e.target.value,
    };
    setContainerInfo({
      ...containerInfo,
    });
  };

  const addVariable = () => {
    setContainerInfo({
      ...containerInfo,
      variables: [
        ...containerInfo.variables,
        { type: "KeyValuePair", variableName: "", value: "" },
      ],
    });
  };

  const removeVariable = (removeIndex) => {
    containerInfo.variables = containerInfo.variables.filter(
      (_, index) => removeIndex !== index
    );
    setContainerInfo({
      ...containerInfo,
    });
  };

  const addContainers = () => {
    if (containerInfo.containerName === "") {
      swalError("Container 이름을 입력해주세요");
      return;
    }
    if (containerInfo.containerImage === "") {
      swalError("Container 이미지를 입력해주세요");
      return;
    }
    if (containerInfo.ports.length === 0) {
      swalError("Port를 입력해주세요");
      return;
    }

    setCommand(command);
    containerInfo.variables.map((e) => {
      if (e.type === "KeyValuePair") {
        keyValuePair.push([e.variableName, e.value]);
      } else {
        secretConfigmap.push(e);
      }
    });
    const temp = { ...containerInfo };
    addContainer(temp);
    props.onClose && props.onClose();
  };

  const editContainers = () => {
    const temp = { ...containerInfo };
    editContainer(containerIndex, temp);
    props.onClose && props.onClose();
  };

  useEffect(() => {
    loadVolumeList();
    if (containerIndex === -1) {
      setContainerInfo({
        containerName: "",
        containerImage: "",
        pullPolicy: "",
        ports: [],
        command: [],
        arguments: [],
        workingDir: "",
        variables: [],
        cpuReservation: "",
        memoryReservation: "",
        cpuLimit: "",
        memoryLimit: "",
        NVIDIAGPU: "",
        // volumes: [{ name: "", mountPoint: "", subPathInVolume: "" }],
      });
    } else {
      const clonedData = cloneDeep(deployment.containers[containerIndex]);
      setContainerInfo(clonedData);
    }
  }, [open]);

  const ValueComponent = (index) => {
    switch (containerInfo.variables[index].type) {
      case "KeyValuePair":
        return (
          <td>
            <CTextField
              type="text"
              placeholder="Value"
              className="form_fullWidth"
              name="value"
              onChange={() => onChangeVariable(event, index)}
              value={containerInfo.variables[index].value}
            />
          </td>
        );
      case "Resource":
        return (
          <td style={{ display: "flex", padding: "1px" }}>
            <CTextField
              type="text"
              placeholder="Container Name"
              className="form_fullWidth"
              name="value"
              onChange={() => onChangeVariable(event, index)}
              value={containerInfo.variables[index].value}
            />
            <FormControl
              className="form_fullWidth"
              style={{ height: "inherit", padding: "0px 0px 0px 2px" }}
            >
              <select
                name="type"
                value={containerInfo.variables[index].type}
                onChange={() => onChangeVariable(event, index)}
              >
                <option value={""}>Key 선택</option>
              </select>
            </FormControl>
          </td>
        );
      case "ConfigMapKey":
        return (
          <td style={{ display: "flex", padding: "1px" }}>
            <FormControl
              className="form_fullWidth"
              style={{ height: "inherit", padding: "0px 0px 0px 0px" }}
            >
              <select
                name="type"
                value={containerInfo.variables[index].type}
                onChange={() => onChangeVariable(event, index)}
              >
                <option value={""}>ConfigMap 선택</option>
              </select>
            </FormControl>
            <FormControl
              className="form_fullWidth"
              style={{ height: "inherit", padding: "0px 0px 0px 2px" }}
            >
              <select
                name="type"
                value={containerInfo.variables[index].type}
                onChange={() => onChangeVariable(event, index)}
              >
                <option value={""}>Key 선택</option>
              </select>
            </FormControl>
          </td>
        );
      case "SecretKey":
        return (
          <td style={{ display: "flex", padding: "1px" }}>
            <FormControl
              className="form_fullWidth"
              style={{ height: "inherit", padding: "0px 0px 0px 2px" }}
            >
              <select
                name="type"
                value={containerInfo.variables[index].type}
                onChange={() => onChangeVariable(event, index)}
              >
                <option value={""}>Secret 선택</option>
              </select>
            </FormControl>
            <FormControl
              className="form_fullWidth"
              style={{ height: "inherit", padding: "0px 0px 0px 2px" }}
            >
              <select
                name="type"
                value={containerInfo.variables[index].type}
                onChange={() => onChangeVariable(event, index)}
              >
                <option value={""}>Key 선택</option>
              </select>
            </FormControl>
          </td>
        );
      case "PodField":
        return (
          <td>
            <CTextField
              tpe="text"
              placeholder="Key (e.g. metadata.labels['<KEY>'])"
              className="form_fullWidth"
              name="value"
              onChange={() => onChangeVariable(event, index)}
              value={containerInfo.variables[index].value}
            />
          </td>
        );
      case "secret":
        return (
          <td>
            <FormControl
              className="form_fullWidth"
              style={{ height: "inherit", padding: "0px 0px 0px 2px" }}
            >
              <select
                name="type"
                value={containerInfo.variables[index].type}
                onChange={() => onChangeVariable(event, index)}
              >
                <option value={""}>Secret 선택</option>
              </select>
            </FormControl>
          </td>
        );
      case "configMap":
        return (
          <td>
            <FormControl
              className="form_fullWidth"
              style={{ height: "inherit", padding: "0px 0px 0px 2px" }}
            >
              <select
                name="type"
                value={containerInfo.variables[index].type}
                onChange={() => onChangeVariable(event, index)}
              >
                <option value={""}>Key 선택</option>
              </select>
            </FormControl>
          </td>
        );
      default:
        return <td></td>;
    }
  };

  const AddContainerComponent = () => {
    if (tabvalue === 0) {
      return (
        <>
          <table className="tb_data_new tb_write">
            <tbody>
              <tr>
                <th>
                  Container Name <span className="requried">*</span>
                </th>
                <td colSpan="3">
                  <CTextField
                    type="text"
                    placeholder="Container Name"
                    className="form_fullWidth"
                    name="containerName"
                    onChange={onChange}
                    value={containerInfo?.containerName}
                  />
                </td>
              </tr>
              <tr>
                <th>
                  Container Image <span className="requried">*</span>
                </th>
                <td colSpan="3">
                  <CTextField
                    type="text"
                    placeholder="Container Image"
                    className="form_fullWidth"
                    name="containerImage"
                    onChange={onChange}
                    value={containerInfo?.containerImage}
                  />
                </td>
              </tr>
              <tr>
                <th>Pull Secret</th>
                <td colSpan="3">
                  <CTextField
                    type="text"
                    placeholder="Pull Secrets"
                    className="form_fullWidth"
                    name="pullSecret"
                    onChange={onChange}
                    value={containerInfo?.pullSecret}
                  />
                </td>
              </tr>
              <tr>
                <th>Pull Policy</th>
                <td colSpan="3">
                  <FormControl className="form_fullWidth">
                    <select
                      name="pullPolicy"
                      onChange={onChange}
                      value={containerInfo?.pullPolicy}
                    >
                      <option value={""} selected hidden disabled>
                        Select Pull Policy
                      </option>
                      <option value={"IfNotPresent"}>IfNotPresent</option>
                      <option value={"Always"}>Always</option>
                      <option value={"Never"}>Never</option>
                    </select>
                  </FormControl>
                </td>
              </tr>
              <tr>
                <th rowSpan={"2"}>
                  Ports <span className="requried">*</span>
                </th>
                <td>
                  <table className="tb_data_new">
                    <tbody className="tb_data_nodeInfo">
                      <tr>
                        <th>Name</th>
                        <th>Private Container Port</th>
                        <th>Protocol</th>
                        <th></th>
                      </tr>
                      {containerInfo?.ports?.map((port, index) => (
                        <tr style={{ lineHeight: "35px" }}>
                          <td>
                            <CTextField
                              type="text"
                              placeholder="Name"
                              className="form_fullWidth"
                              name="name"
                              onChange={() => onChangePort(event, index)}
                              value={port.name}
                            />
                          </td>
                          <td>
                            <CTextField
                              type="text"
                              placeholder="Private Container Port"
                              className="form_fullWidth"
                              name="privateContainerPort"
                              onChange={() => onChangePort(event, index)}
                              value={port.privateContainerPort}
                            />
                          </td>
                          <td>
                            <FormControl
                              className="form_fullWidth"
                              style={{ padding: "1px" }}
                            >
                              <select
                                name="protocol"
                                value={port.protocol}
                                onChange={() => onChangePort(event, index)}
                              >
                                <option value={"TCP"}>TCP</option>
                                <option value={"UDP"}>UDP</option>
                              </select>
                            </FormControl>
                          </td>
                          <td>
                            <Button
                              style={{
                                border: "none",
                                height: "28px",
                                width: "30px",
                                fontSize: "20px",
                                fontWeight: 600,
                                letterSpacing: "normal",
                                color: "#36435c",
                                backgroundColor: "#eff4f9",
                                padding: "0 0",
                                margin: "2px",
                                borderRadius: "0",
                              }}
                              onClick={() => removePort(index)}
                            >
                              -
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </td>
              </tr>
              <tr>
                <td>
                  <Button onClick={addPort}>Add Port</Button>
                </td>
              </tr>
              <tr>
                <th>Command</th>
                <td colSpan="3">
                  <CTextField
                    type="text"
                    placeholder="e.g. /bin/sh"
                    className="form_fullWidth"
                    name="command"
                    onChange={onChange}
                    value={
                      containerInfo?.command ? containerInfo?.command : null
                    }
                  />
                </td>
              </tr>
              <tr>
                <th>Arguments</th>
                <td colSpan="3">
                  <CTextField
                    type="text"
                    placeholder="e.g. /usr/sbin/httpd -f httpd.conf"
                    className="form_fullWidth"
                    name="arguments"
                    onChange={onChange}
                    value={containerInfo?.arguments}
                  />
                </td>
              </tr>
              <tr>
                <th>WorkingDir</th>
                <td colSpan="3">
                  <CTextField
                    type="text"
                    placeholder="e.g. /myapp"
                    className="form_fullWidth"
                    name="workingDir"
                    onChange={onChange}
                    value={containerInfo?.workingDir}
                  />
                </td>
              </tr>
              <tr>
                <th rowSpan={2}>Variables</th>
                <td>
                  <table className="tb_data_new">
                    <tbody className="tb_data_nodeInfo">
                      <tr>
                        <th>Type</th>
                        <th>Variable Name</th>
                        <th>Value</th>
                      </tr>
                      {containerInfo?.variables?.map((variable, index) => (
                        <tr style={{ lineHeight: "35px" }}>
                          <td>
                            <FormControl className="form_fullWidth">
                              <select
                                name="type"
                                value={variable.type}
                                onChange={() => onChangeVariable(event, index)}
                              >
                                <option value={"KeyValuePair"}>
                                  Key/Value Pair
                                </option>
                                <option value={"secret"}>Secret</option>
                                <option value={"configMap"}>ConfigMap</option>
                              </select>
                            </FormControl>
                          </td>
                          <td>
                            <CTextField
                              type="text"
                              placeholder="Variable Name"
                              className="form_fullWidth"
                              name="variableName"
                              onChange={() => onChangeVariable(event, index)}
                              value={variable.variableName}
                            />
                          </td>
                          {ValueComponent(index)}
                          <td>
                            <Button
                              style={{
                                border: "none",
                                height: "28px",
                                width: "30px",
                                fontSize: "20px",
                                fontWeight: 600,
                                letterSpacing: "normal",
                                color: "#36435c",
                                backgroundColor: "#eff4f9",
                                padding: "0 0",
                                margin: "2px",
                                borderRadius: "0",
                              }}
                              onClick={() => removeVariable(index)}
                            >
                              -
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </td>
              </tr>
              <tr>
                <td colSpan="3">
                  <Button onClick={addVariable}>Add Variables</Button>
                </td>
              </tr>
            </tbody>
          </table>
          <div
            style={{
              display: "flex",
              width: "300px",
              justifyContent: "center",
              marginTop: "30px",
            }}
          >
            <Button onClick={handleClose}>취소</Button>
            {containerIndex === -1 ? (
              <ButtonNext onClick={addContainers}>추가</ButtonNext>
            ) : (
              <ButtonNext onClick={editContainers}>변경</ButtonNext>
            )}
          </div>
        </>
      );
    } else if (tabvalue === 1) {
      return (
        <>
          <table className="tb_data_new tb_write">
            <tbody>
              <tr>
                <th>CPU Request</th>
                <td>
                  <CTextField
                    type="number"
                    placeholder="CPU Reservation"
                    className="form_fullWidth"
                    name="cpuReservation"
                    onChange={onChange}
                    value={containerInfo?.cpuReservation}
                  />
                </td>
              </tr>
              <tr>
                <th>Memory Request</th>
                <td>
                  <CTextField
                    type="number"
                    placeholder="Memory Reservation"
                    className="form_fullWidth"
                    name="memoryReservation"
                    onChange={onChange}
                    value={containerInfo?.memoryReservation}
                  />
                </td>
              </tr>
              <tr>
                <th>CPU Limit</th>
                <td>
                  <CTextField
                    type="number"
                    placeholder="CPU Limit"
                    className="form_fullWidth"
                    name="cpuLimit"
                    onChange={onChange}
                    value={containerInfo?.cpuLimit}
                  />
                </td>
              </tr>
              <tr>
                <th>Memory Limit</th>
                <td>
                  <CTextField
                    type="number"
                    placeholder="Memory Limit"
                    className="form_fullWidth"
                    name="memoryLimit"
                    onChange={onChange}
                    value={containerInfo?.memoryLimit}
                  />
                </td>
              </tr>
              <tr>
                <th>NVIDIA GPU Limit/Request</th>
                <td>
                  <CTextField
                    type="number"
                    placeholder="NVIDIA GPU Limit/Reservation"
                    className="form_fullWidth"
                    name="NVIDIAGPU"
                    onChange={onChange}
                    value={containerInfo?.NVIDIAGPU}
                  />
                </td>
              </tr>
            </tbody>
          </table>
          <div
            style={{
              display: "flex",
              width: "300px",
              justifyContent: "center",
              marginTop: "229px",
            }}
          >
            <Button onClick={handleClose}>취소</Button>
            {containerIndex === -1 ? (
              <ButtonNext onClick={addContainers}>추가</ButtonNext>
            ) : (
              <ButtonNext onClick={editContainers}>변경</ButtonNext>
            )}
          </div>
        </>
      );
    }
    // else {
    //   return (
    //     <>
    //       <table className="tb_data_new tb_write">
    //         <tbody>
    //           <tr>
    //             <th rowSpan={2} style={{ width: "15%" }}>
    //               Volume <span className="requried">*</span>
    //             </th>
    //             <td>
    //               {containerInfo.volumes.map((volume, index) => (
    //                 <>
    //                   <FormControl>
    //                     <select
    //                       name="name"
    //                       onChange={(e) => onChangeVolume(e, index)}
    //                       value={volume.name}
    //                       style={{ width: "200px", padding: "0px 2px 2px 2px" }}
    //                     >
    //                       <option value={""} selected disabled hidden>
    //                         Select Volume
    //                       </option>
    //                       {<option value={volumeName}>{volumeName}</option>}
    //                     </select>
    //                   </FormControl>
    //                   <CTextField
    //                     style={{ width: "35%", padding: "0px 2px 2px 2px" }}
    //                     type="text"
    //                     placeholder="Mount Point"
    //                     className="form_fullWidth"
    //                     name="mountPoint"
    //                     onChange={() => onChangeVolume(event, index)}
    //                     value={volume.mountPoint}
    //                   />
    //                   <CTextField
    //                     style={{ width: "35%", padding: "0px 2px 2px 0px" }}
    //                     type="text"
    //                     placeholder="Sub Path in Volume"
    //                     className="form_fullWidth"
    //                     name="subPathInVolume"
    //                     onChange={() => onChangeVolume(event, index)}
    //                     value={volume.subPathInVolume}
    //                   />
    //                   <Button
    //                     style={{
    //                       border: "none",
    //                       height: "28px",
    //                       width: "30px",
    //                       fontSize: "20px",
    //                       fontWeight: 600,
    //                       lineHeight: 1,
    //                       letterSpacing: "normal",
    //                       color: "#36435c",
    //                       backgroundColor: "#eff4f9",
    //                       padding: "0 0 0 0",
    //                       margin: "2px",
    //                       borderRadius: "0",
    //                     }}
    //                     onClick={() => removeVolume(index)}
    //                   >
    //                     -
    //                   </Button>
    //                 </>
    //               ))}
    //               <Button onClick={addVolume}>Add Volume</Button>
    //             </td>
    //           </tr>
    //         </tbody>
    //       </table>
    //       <div
    //         style={{
    //           display: "flex",
    //           width: "300px",
    //           justifyContent: "center",
    //           marginTop: "377px",
    //         }}
    //       >
    //         <Button onClick={handleClose}>취소</Button>
    //         {containerIndex === -1 ? (
    //           <ButtonNext onClick={addContainers}>추가</ButtonNext>
    //         ) : (
    //           <ButtonNext onClick={editContainers}>변경</ButtonNext>
    //         )}
    //       </div>
    //     </>
    //   );
    // }
  };

  return (
    <CDialogNew
      id="myDialog"
      open={open}
      maxWidth="md"
      title={"Add Container"}
      onClose={handleClose}
      bottomArea={false}
      modules={["custom"]}
    >
      <CSubTabs value={tabvalue} onChange={handleTabChange}>
        <CSubTab label="General"></CSubTab>
        <CSubTab label="Resource"></CSubTab>
        {/* <CSubTab label="Storage"></CSubTab> */}
      </CSubTabs>
      {AddContainerComponent()}
    </CDialogNew>
  );
});

export default DeploymentAddContainer;
