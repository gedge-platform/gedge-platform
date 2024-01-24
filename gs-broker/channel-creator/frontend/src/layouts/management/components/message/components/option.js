import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import { Radio, RadioGroup, FormControlLabel, FormLabel } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import SendIcon from "@mui/icons-material/Send";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { blue, grey } from "@mui/material/colors";

const { palette } = createTheme();
const theme = createTheme({
  palette: {
    primary: {
      main: blue[400],
      contrastText: grey[50],
    },
  },
});

function Option({
  protocol,
  channel,
  clientId,
  metadata,
  onChangeProtocol,
  onChangeChannel,
  onChangeClientId,
  onChangeMetadata,
  handleSendButton,
}) {
  const optionCard = {
    width: "100%",
    height: "50vh",
  };

  return (
    <Box pt={6} pb={0} display="flex" flexDirection="column" height="100%">
      <Card style={optionCard}>
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
            OPTION
          </Typography>
        </Box>
        <Box mx={3} py={2} px={2}>
          <Typography variant="h6">PROTOCOL</Typography>
          <FormControl fullWidth>
            <RadioGroup
              row
              aria-label="options"
              value={protocol}
              name="radio-buttons-group"
              onChange={onChangeProtocol}
            >
              <FormControlLabel
                value="pub/sub"
                control={<Radio />}
                label="Pub/Sub"
              />
              <FormControlLabel
                value="queue"
                control={<Radio />}
                label="Queue"
              />
              <FormControlLabel
                value="query"
                control={<Radio />}
                label="Query"
              />
              <FormControlLabel
                value="command"
                control={<Radio />}
                label="Command"
              />
            </RadioGroup>
          </FormControl>
        </Box>
        <Box mx={3} py={2} px={2}>
          <Typography variant="h6">CHANNEL</Typography>
          <TextField
            fullWidth
            label="Channel Name"
            variant="outlined"
            value={channel}
            onChange={onChangeChannel}
            size="large"
          />
        </Box>
        <Box mx={3} py={2} px={2}>
          <Typography variant="h6">CLIENT ID</Typography>
          <TextField
            fullWidth
            label="Client ID"
            variant="outlined"
            value={clientId}
            onChange={onChangeClientId}
            size="large"
          />
        </Box>
        <Box mx={3} py={2} px={2}>
          <Typography variant="h6">METADATA</Typography>
          <TextField
            fullWidth
            label="Metadata"
            variant="outlined"
            value={metadata}
            onChange={onChangeMetadata}
            size="large"
          />
        </Box>
        <Box mx={3} py={2} px={2} pb={3} mt="auto">
          <ThemeProvider theme={theme}>
            <Button
              fullWidth
              variant="contained"
              endIcon={<SendIcon />}
              onClick={handleSendButton}
            >
              SEND
            </Button>
          </ThemeProvider>
        </Box>
      </Card>
    </Box>
  );
}

export default Option;
