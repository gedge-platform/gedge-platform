import React, { useState } from "react";
import { CTextField } from "@/components/textfields";
import { observer } from "mobx-react";
import deploymentStore from "../../../../store/Deployment";
import podStore from "../../../../store/Pod";

const PodSettings = observer(() => {
  const {
    containerName,
    containerPort,
    containerPortName,
    containerImage,
    setContainerName,
    setContainerPort,
    setContainerPortName,
    setContainerImage,
  } = podStore;

  const onChange = (e, type) => {
    const { value, name } = e.target;
    switch (name) {
      case "Container Name":
        setContainerName(value);
        break;
      case "Container Image":
        setContainerImage(value);
        break;
      case "Container Port Name":
        setContainerPortName(value);
        break;
      case "Container Port":
        setContainerPort(value);
        break;
    }
  };

  return (
    <>
      <div className="step-container">
        <div className="signup-step">
          <div className="step">
            <span>기본 정보</span>
          </div>
          <div className="arr"></div>
          <div className="step current">
            <span>Pod 설정</span>
          </div>
          <div className="arr"></div>
          <div className="step">
            <span>설정 검토</span>
          </div>
        </div>
      </div>
      <table className="tb_data_new tb_write">
        <tbody>
          <tr>
            <th>
              Container Name
              <span className="requried">*</span>
            </th>
            <td>
              <CTextField
                type="text"
                placeholder="Container Name"
                className="form_fullWidth"
                name="Container Name"
                onChange={onChange}
                value={containerName}
              />
            </td>
            <th>
              Container Image
              <span className="requried">*</span>
            </th>
            <td>
              <CTextField
                type="text"
                placeholder="Container Image"
                className="form_fullWidth"
                name="Container Image"
                onChange={onChange}
                value={containerImage}
              />
            </td>
          </tr>

          <tr>
            <th>
              Container Port Name
              <span className="requried">*</span>
            </th>
            <td>
              <CTextField
                type="text"
                placeholder="Container Port Name"
                className="form_fullWidth"
                name="Container Port Name"
                onChange={onChange}
                value={containerPortName}
              />
            </td>
            <th>
              Container Port
              <span className="requried">*</span>
            </th>
            <td>
              <CTextField
                type="number"
                placeholder="Container Port"
                className="form_fullWidth"
                name="Container Port"
                onChange={onChange}
                value={containerPort}
              />
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
});

export default PodSettings;
