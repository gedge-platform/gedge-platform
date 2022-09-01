import { observer } from "mobx-react";
import React from "react";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/theme-monokai";

const StorageClassYaml = observer((props) => {
  const { content } = props;

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
});

export default StorageClassYaml;
