import { useState, useEffect } from "react";
import React from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";

import axiosInstance from "axiosInstance";
import CustromEditor from "layouts/management/components/message/components/editor";
import Option from "layouts/management/components/message/components/option";

const style = {
  width: "100%",
  maxWidth: "100%",
  bgcolor: "background.paper",
};
function Message({ clusterId }) {
  const [protocol, setProtocol] = useState("pub/sub");
  const [channel, setChannel] = useState("");
  const [clientId, setClientId] = useState("");
  const [metadata, setMetadata] = useState("");
  const [toggle, setToggle] = useState(false);
  const [editor, setEditor] = useState({
    msg: { text: "Create Channel" },
  });
  const [errorMessage, setErrorMessage] = useState(null);

  const [messages, setMessages] = useState([]);
  const nodeCard = {
    width: "100%",
    height: "30vh",
  };

  const onChangeProtocol = (event) => {
    setProtocol(event.target.value);
  };
  const onChangeChannel = (event) => {
    setChannel(event.target.value);
  };
  const onChangeClientId = (envet) => {
    setClientId(event.target.value);
  };
  const onChangeMetadata = (envet) => {
    setMetadata(event.target.value);
  };
  const onChangeJson = (value) => {
    let data;
    try {
      data = JSON.parse(value);
      setErrorMessage(null);
    } catch (error) {
      setErrorMessage("Please enter valid JSON.");
    } finally {
      setEditor({ msg: data });
    }
  };

  const handleSendButton = () => {
    const data = {
      clusterId: clusterId,
      protocol: protocol,
      channel: channel,
      clientId: clientId,
      msg: editor,
      metadata: metadata,
    };
    axiosInstance.post("/single/msg", data).then((response) => {
      setToggle(!toggle);
    });
  };

  useEffect(() => {
    axiosInstance.get(`/single/msg/${clusterId}`).then((response) => {
      if (response.data === null) {
        setMessages([]);
      } else {
        setMessages(response.data);
      }
    });
  }, [clusterId, toggle]);

  return (
    <Grid container spacing={6}>
      <Grid item xs={8}>
        <CustromEditor
          editor={editor}
          onChangeJson={onChangeJson}
          errorMessage={errorMessage}
        />
      </Grid>
      <Grid item xs={4}>
        <Option
          protocol={protocol}
          channel={channel}
          clientId={clientId}
          metadata={metadata}
          onChangeProtocol={onChangeProtocol}
          onChangeChannel={onChangeChannel}
          onChangeClientId={onChangeClientId}
          onChangeMetadata={onChangeMetadata}
          handleSendButton={handleSendButton}
        />
      </Grid>
      <Grid item xs={12}>
        <Box pt={3} pb={0}>
          <Card style={nodeCard}>
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
                HISTORY
              </Typography>
            </Box>
            <Box
              pt={3}
              pl={3}
              sx={{
                width: "100%",
                height: 400,
                bgcolor: "background.paper",
                overflow: "auto",
                borderRadius: "10px",
              }}
            >
              <List sx={style} component="nav">
                {messages.map((msg, index) => (
                  <React.Fragment key={index}>
                    <ListItem button>
                      <ListItemText
                        disableTypography
                        primary={
                          <>
                            <Typography
                              component="div"
                              variant="body2"
                              gutterBottom
                            >
                              <strong>Protocol:</strong> {msg.protocol}
                            </Typography>
                            <Typography
                              component="div"
                              variant="body2"
                              gutterBottom
                            >
                              <strong>Channel:</strong> {msg.channel}
                            </Typography>
                            <Typography
                              component="div"
                              variant="body2"
                              gutterBottom
                            >
                              <strong>ClientID:</strong> {msg.clientId}
                            </Typography>
                            <Typography
                              component="div"
                              variant="body2"
                              gutterBottom
                            >
                              <strong>Metadata:</strong> {msg.metadata}
                            </Typography>
                            <Typography
                              component="div"
                              variant="body2"
                              gutterBottom
                            >
                              <strong>Msg:</strong>{" "}
                              {JSON.stringify(msg.msg.msg, null, 2)}
                            </Typography>
                          </>
                        }
                      />
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))}
              </List>
            </Box>
          </Card>
        </Box>
      </Grid>
    </Grid>
  );
}

export default Message;
