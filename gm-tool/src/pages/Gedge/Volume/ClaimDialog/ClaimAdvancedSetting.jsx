import React, { useEffect } from "react";
import styled from "styled-components";
import { CTextField } from "@/components/textfields";
import { observer } from "mobx-react";
import { claimStore } from "@/store";
import CreateClaim from "./CreateClaim";
import { swalError } from "../../../../utils/swal-utils";

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

const ClaimAdvancedSetting = observer(() => {
  const {
    setInputLabelKey,
    setInputLabelValue,
    setInputAnnotationKey,
    setInputAnnotationValue,
    labelKey,
    labelValue,
    labelInput,
    labelInputKey,
    labelInputValue,
    annotationKey,
    annotationValue,
    setAnnotationInput,
    setLabelInput,
    labels,
    annotations,
    setLabels,
    setAnnotations,
  } = claimStore;

  const newLabelList = [{ [labelInputKey]: labelInputValue }];

  const handleChange = (e) => {
    const { value, name } = e.target;
    switch (name) {
      case "labelKey":
        setInputLabelKey(value);
        break;
      case "labelValue":
        setInputLabelValue(value);
        break;
      case "annotationKey":
        setInputAnnotationKey(value);
        break;
      case "annotationValue":
        setInputAnnotationValue(value);
        break;
    }
  };

  useEffect(() => {
    setLabelInput({
      [labelKey]: labelValue,
    });
    setAnnotationInput({
      [annotationKey]: annotationValue,
    });
  }, [labelKey, labelValue, annotationKey, annotationValue]);

  const addRow = () => {
    if (labelKey == "") {
      swalError("LabelKey 값을 입력해주세요");
      return;
    }

    const LabelKeyArr = [];
    labels.map((data) => LabelKeyArr.push(data.labelKey));

    if (LabelKeyArr.indexOf(labelKey) >= 0) {
      swalError("LabelKey 값이 중복입니다.");
      return;
    }

    const newLabelsList = [
      {
        labelKey,
        labelValue,
      },
    ];

    setLabels(labels.concat(newLabelsList));
    setLabelInput({
      labelKey: "",
      labelValue: "",
    });

    setInputLabelKey("");
    setInputLabelValue("");
  };

  const deleteLabels = (labelKey) => {
    setLabels(labels.filter((item) => item.labelKey !== labelKey));
  };

  const deleteAnnotations = (annotationKey) => {
    setAnnotations(
      annotations.filter((item) => item.annotationKey !== annotationKey)
    );
  };

  const addAnnotations = () => {
    if (annotationKey == "") {
      swalError("AnnotationKey 값을 입력해주세요");
      return;
    }

    const AnnotationKeyArr = [];
    annotations.map((data) => AnnotationKeyArr.push(data.annotationKey));

    if (AnnotationKeyArr.indexOf(annotationKey) >= 0) {
      swalError("AnnotationKey 값이 중복입니다.");
      return;
    }

    const newAnnotationsList = [
      {
        annotationKey,
        annotationValue,
      },
    ];

    setAnnotations(annotations.concat(newAnnotationsList));
    setAnnotationInput({
      annotationKey: "",
      annotationValue: "",
    });

    setInputAnnotationKey("");
    setInputAnnotationValue("");
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
      <table id="labelTable" className="tb_data_new tb_write">
        <tbody>
          <tr>
            <th>Labels</th>
            <td>
              <CTextField
                type="text"
                placeholder="Key"
                className="form_fullWidth"
                name="labelKey"
                onChange={handleChange}
                value={labelKey}
              />
            </td>
            <td>
              <CTextField
                type="text"
                placeholder="Value"
                className="form_fullWidth"
                name="labelValue"
                onChange={handleChange}
                value={labelValue}
              />
            </td>
            <td>
              <Button onClick={addRow}>+</Button>
            </td>
          </tr>
          {labels
            ? labels.map((item) => (
                <tr>
                  <th>Labels</th>
                  <td style={{ width: "300px", padding: "8px" }}>
                    {item.labelKey}
                  </td>
                  <td style={{ width: "300px", padding: "8px" }}>
                    {item.labelValue}
                  </td>
                  <td>
                    <Button onClick={() => deleteLabels(item.labelKey)}>
                      -
                    </Button>
                  </td>
                </tr>
              ))
            : null}

          <tr>
            <th>Annotations</th>
            <td>
              <CTextField
                type="text"
                placeholder="Key"
                className="form_fullWidth"
                name="annotationKey"
                onChange={handleChange}
                value={annotationKey}
              />
            </td>
            <td>
              <CTextField
                type="text"
                placeholder="Value"
                className="form_fullWidth"
                name="annotationValue"
                onChange={handleChange}
                value={annotationValue}
              />
            </td>
            <td colSpan={2}>
              <Button onClick={addAnnotations}>+</Button>
            </td>
          </tr>
          {annotations.map((item) => (
            <tr>
              <th>Annotations</th>
              <td style={{ width: "300px", padding: "8px" }}>
                {item.annotationKey}
              </td>
              <td style={{ width: "300px", padding: "8px" }}>
                {item.annotationValue}
              </td>
              <td>
                <Button onClick={() => deleteAnnotations(item.annotationKey)}>
                  -
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <CreateClaim labelsList={labelInput} />
    </>
  );
});

export default ClaimAdvancedSetting;
