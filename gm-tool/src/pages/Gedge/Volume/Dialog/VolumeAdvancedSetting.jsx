import React, { useState } from "react";
import styled from "styled-components";
import { CTextField } from "@/components/textfields";
import { observer } from "mobx-react";
import { deploymentStore } from "@/store";

const HeaderContainer = styled.div`
  width: 320px;
  padding: 8px;
  border-radius: 4px;
  background-color: #eff4f9;
  text-align: center;
  margin-bottom: 20px;
`;
const ButtonBox = styled.div`
  margin-top: 15px;
  display: flex;
  width: 100%;
  justify-content: space-around;
`;
const Button = styled.button`
  border: none;
  height: 32px;
  font-size: 20px;
  font-weight: 600;
  line-height: 1;
  letter-spacing: normal;
  color: #36435c;
  background-color: #eff4f9;
`;
const Span = styled.span`
  width: 200px;
  height: 32px;
  padding: 6px 12px;
  border-radius: 4px;
  border: 1px solid #abb4be;
  background-color: #fff;
`;

const VolumeAdvancedSetting = observer(() => {
  const {
    podReplicas,
    containerName,
    containerPort,
    containerPortName,
    containerImage,
    setPodReplicas,
    setContainerName,
    setContainerPort,
    setContainerPortName,
    setContainerImage,
  } = deploymentStore;

  const onChange = (e, type) => {
    const { value, name } = e.target;
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
            <span>고급 설정</span>
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
            <th>Labels</th>

            <td>
              <CTextField
                type="text"
                placeholder="Key"
                className="form_fullWidth"
                name="LabelsKey"
                onChange={onChange}
                // value={volumeName}
              />
            </td>
            <td>
              <CTextField
                type="text"
                placeholder="Value"
                className="form_fullWidth"
                name="LabelsValue"
                onChange={onChange}
                // value={volumeName}
              />
            </td>
            <th></th>
          </tr>
          <tr>
            <th>Annotations</th>

            <td>
              <CTextField
                type="text"
                placeholder="Key"
                className="form_fullWidth"
                name="AnnotationsKey"
                onChange={onChange}
                // value={volumeName}
              />
            </td>
            <td>
              <CTextField
                type="text"
                placeholder="Value"
                className="form_fullWidth"
                name="AnnotationsValue"
                onChange={onChange}
                // value={volumeName}
              />
            </td>
            <th></th>
          </tr>
        </tbody>
      </table>
    </>
  );
});

export default VolumeAdvancedSetting;
