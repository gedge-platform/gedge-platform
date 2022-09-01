import { observer } from "mobx-react";
import React from "react";
import deploymentStore from "../../../../store/Deployment";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/theme-monokai";

const DeploymentVolumeYaml = observer(() => {
  const { contentVolume } = deploymentStore;

  return (
    <>
      <div className="step-container">
        <div className="signup-step">
          <div className="step">
            <span>기본 정보</span>
          </div>
          <div className="arr"></div>
          <div className="step">
            <span>Pod 설정</span>
          </div>
          <div className="arr"></div>
          <div className="step current">
            <span>Volume 설정</span>
          </div>
          <div className="arr"></div>
          <div className="step">
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
        onChange={(value) => {
          // setContent(value);
        }}
        fontSize={14}
        showPrintMargin={true}
        showGutter={true}
        highlightActiveLine={true}
        value={contentVolume}
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

export default DeploymentVolumeYaml;
