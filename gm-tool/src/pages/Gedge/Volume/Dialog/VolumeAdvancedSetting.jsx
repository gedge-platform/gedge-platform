import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { CTextField } from "@/components/textfields";
import { observer } from "mobx-react";
import { claimStore } from "@/store";
import { makeAutoObservable, runInAction, toJS } from "mobx";

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
  height: 28px;
  width: 30px;
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
    labels,
    setLabels,
    inputLabelKey,
    setInputLabelKey,
    inputLabelValue,
    setInputLabelValue,
    inputAnnotationsKey,
    setInputAnnotationsKey,
    inputAnnotationsValue,
    setInputAnnotationsValue,
    annotations,
    setAnnotations,
  } = claimStore;

  const [labelsNextId, setLabelsNextId] = useState(1);
  const [annotationsNextId, setAnnotationsNextId] = useState(1);

  const handleChange = (e) => {
    const { value, name } = e.target;
    if (name === "LabelsKey") {
      setInputLabelKey(value);
      return;
    } else if (name === "LabelsValue") {
      setInputLabelValue(value);
      return;
    } else if (name === "AnnotationsKey") {
      setInputAnnotationsKey(value);
      return;
    } else if (name === "AnnotationsValue") {
      setInputAnnotationsValue(value);
      return;
    }
  };

  const addLabels = () => {
    const newLabelsList = labels.concat({
      id: labelsNextId,
      key: inputLabelKey,
      value: inputLabelValue,
    });
    setLabelsNextId(labelsNextId + 1);
    setLabels([...labels, newLabelsList]);
    setInputLabelKey(inputLabelKey);
    setInputLabelValue(inputLabelValue);
  };

  const deleteLabels = (id) => {
    if (labels.length == 1) return;
    const deletedNewList = labels.filter((labels) => labels.id !== id);
    setLabels(deletedNewList);
  };

  const addAnnotations = () => {
    const newAnnotationsList = annotations.concat({
      id: annotationsNextId,
      key: inputAnnotationsKey,
      value: inputAnnotationsValue,
    });
    setAnnotationsNextId(annotationsNextId + 1);
    setAnnotations(newAnnotationsList);
    setInputAnnotationsKey("");
    setInputAnnotationsValue("");
    return;
  };

  const deleteAnnotations = (id) => {
    if (annotations.length == 1) return;
    const deletedNewList = annotations.filter((labels) => labels.id !== id);
    setAnnotations(deletedNewList);
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
          {labels.map((item, i) => (
            <tr>
              <th>Labels</th>
              <td>
                <CTextField
                  type="text"
                  placeholder="Key"
                  className="form_fullWidth"
                  name="LabelsKey"
                  onChange={handleChange}
                  value={item.key || ""}
                />
              </td>
              <td>
                <CTextField
                  type="text"
                  placeholder="Value"
                  className="form_fullWidth"
                  name="LabelsValue"
                  onChange={handleChange}
                  value={item.value}
                />
              </td>
              <td>
                <Button onClick={addLabels}>+</Button>
                &nbsp;&nbsp;
                <Button onClick={() => deleteLabels(item.id)}>-</Button>
              </td>
            </tr>
          ))}
          {annotations.map((item, i) => (
            <tr>
              <th>Annotations</th>
              <td>
                <CTextField
                  type="text"
                  placeholder="Key"
                  className="form_fullWidth"
                  name="AnnotationsKey"
                  onChange={handleChange}
                  value={inputAnnotationsKey}
                />
              </td>
              <td>
                <CTextField
                  type="text"
                  placeholder="Value"
                  className="form_fullWidth"
                  name="AnnotationsValue"
                  onChange={handleChange}
                  value={inputAnnotationsValue}
                />
              </td>
              <td colSpan={2}>
                <Button onClick={addAnnotations}>+</Button>
                &nbsp;&nbsp;
                <Button onClick={() => deleteAnnotations(item.id)}>-</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
});

export default VolumeAdvancedSetting;
