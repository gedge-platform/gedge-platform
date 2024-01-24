import { observer } from "mobx-react";
import React, { useEffect } from "react";
import { deploymentStore } from "@/store";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/theme-monokai";
import templateStore from "../../../../../../store/Template";
import { stringify } from "json-to-pretty-yaml2";

const CreateTamplateStepFour = observer(() => {
  const { appInfo, deployment } = deploymentStore;

  const {
    deploymentYamlTemplate,
    serviceYamlTemplate,
    setDeploymentYamlTemplateFromAppInfo,
  } = templateStore;

  useEffect(() => {
    setDeploymentYamlTemplateFromAppInfo(appInfo);
  }, []);

  return (
    <>
      <div className="step-container">
        <div className="signup-step">
          <div className="step">
            <span>기본 정보</span>
          </div>
          <div className="arr"></div>
          <div className="step">
            <span>스케줄러</span>
          </div>
          <div className="arr"></div>
          <div className="step current">
            <span>설정 검토</span>
          </div>
        </div>
      </div>
      <AceEditor
        placeholder="Placeholder Text"
        mode="javascript"
        theme="monokai"
        name="editor"
        width="90%"
        fontSize={14}
        showPrintMargin={true}
        showGutter={true}
        highlightActiveLine={true}
        value={
          stringify(deploymentYamlTemplate) +
          "---\n" +
          stringify(serviceYamlTemplate)
        }
        setOptions={{
          enableBasicAutocompletion: false,
          enableLiveAutocompletion: false,
          enableSnippets: false,
          showLineNumbers: true,
          tabSize: 4,
        }}
        readOnly={true}
      />
    </>
  );
});

export default CreateTamplateStepFour;
