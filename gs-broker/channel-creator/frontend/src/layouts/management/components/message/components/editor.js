import { useState, useEffect } from "react";

// editor
import "ace-builds/src-noconflict/ace";
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/mode-yaml";
import "ace-builds/src-noconflict/theme-tomorrow";
import "ace-builds/src-noconflict/ext-language_tools";
import AceEditor from "react-ace";

import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

function CustromEditor({ editor, onChangeJson, errorMessage }) {
  const editorCard = {
    width: "100%",
    height: "50vh",
  };
  return (
    <Box pt={6} pb={0}>
      <Card style={editorCard}>
        <Box
          mx={2}
          mt={-3}
          py={2}
          px={2}
          variant="gradient"
          sx={{
            bgcolor: "info.main",
            borderRadius: "10px",
          }}
          borderRadius="lg"
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h6" color="#ffffff">
            EDITOR
          </Typography>
        </Box>
        <AceEditor
          mode="json"
          theme="tomorrow"
          style={{ width: "100%", height: "100%", borderRadius: "10px" }}
          name="ace-editor"
          fontSize={14}
          showPrintMargin
          showGutter
          highlightActiveLine
          defaultValue={JSON.stringify(editor.msg, null, 2)}
          value={JSON.stringify(editor.msg, null, 2)}
          onChange={onChangeJson}
          editorProps={{ $blockScrolling: true }}
          setOptions={{
            useWorker: false,
            enableBasicAutocompletion: false,
            enableLiveAutocompletion: true,
            enableSnippets: false,
            showLineNumbers: true,
            tabSize: 2,
          }}
        />
        {errorMessage && <div style={{ color: "red" }}>{errorMessage}</div>}
      </Card>
    </Box>
  );
}

export default CustromEditor;
