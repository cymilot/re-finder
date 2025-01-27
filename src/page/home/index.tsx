import React from "react";
import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  IconButton,
  List,
  ListItem,
  ListItemText,
  TextField,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const Home = () => {
  const [input, setInput] = React.useState("");
  const [result, setResult] = React.useState("");
  const [flagStates, setFlagStates] = React.useState({
    flagG: true,
    flagM: false,
    flagI: true,
  });

const handleSearch = React.useCallback(async () => {
  const flags: string[] = [];
  if (flagStates.flagG) flags.push("g");
  if (flagStates.flagM) flags.push("m");
  if (flagStates.flagI) flags.push("i");

  const cleanedInputValue = input.trim();
  if (cleanedInputValue === "") {
    setResult(chrome.i18n.getMessage("errEmptyInput"));
    return;
  }

  try {
    const tabs = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });
    if (tabs.length > 0 && tabs[0].id !== undefined) {
      chrome.tabs.sendMessage(
        tabs[0].id,
        {
          action: "search",
          searchInput: cleanedInputValue,
          flags: flags,
        },
        (res) => {
          if (chrome.runtime.lastError) {
            const errorMessage = `${chrome.i18n.getMessage(
              "errSearchFailed"
            )}: ${chrome.runtime.lastError.message}`;
            setResult(errorMessage);
            chrome.storage.local.set({
              lastRegExp: input,
              lastResult: errorMessage,
            });
          } else {
            const resultMessage = res?.result || "";
            setResult(resultMessage);
            chrome.storage.local.set({
              lastRegExp: input,
              lastResult: resultMessage,
            });
          }
        }
      );
    } else {
      const errorMessage = chrome.i18n.getMessage("errEmptyTabs");
      setResult(errorMessage);
      chrome.storage.local.set({
        lastRegExp: input,
        lastResult: errorMessage,
      });
    }
  } catch (error: any) {
    const errorMessage = `${chrome.i18n.getMessage("errSearchFailed")}: ${
      error.message
    }`;
    setResult(errorMessage);
    chrome.storage.local.set({
      lastRegExp: input,
      lastResult: errorMessage,
    });
  }
}, [input, flagStates]);

  const handleClear = React.useCallback(async () => {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tabs.length > 0 && tabs[0].id !== undefined) {
      chrome.tabs.sendMessage(tabs[0].id, { action: "clear" });
    }
    chrome.storage.local.remove(["lastRegExp", "lastResult"]).then(() => {
      setInput("");
      setResult("");
    });
  }, []);

  const handleChecked = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
      setFlagStates((prev) => ({
        ...prev,
        [event.target.name]: checked,
      }));
    },
    []
  );

  React.useEffect(() => {
    chrome.storage.local.get(["lastRegExp", "lastResult"], (data) => {
      if (input.length === 0 && data.lastRegExp) setInput(data.lastRegExp);
      if (result.length === 0 && data.lastResult) setResult(data.lastResult);
    });
  });

  return (
    <List>
      <ListItem>
        <ListItemText>
          <TextField
            autoFocus
            fullWidth
            label={chrome.i18n.getMessage("labelRegExp")}
            variant="standard"
            value={input}
            onChange={(event) => setInput(event.target.value)}
          />
        </ListItemText>
      </ListItem>
      <ListItem>
        <FormControl>
          <FormControlLabel
            control={
              <Checkbox
                checked={flagStates.flagG}
                onChange={handleChecked}
                name="flagG"
              />
            }
            label={chrome.i18n.getMessage("labelFlagG")}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={flagStates.flagM}
                onChange={handleChecked}
                name="flagM"
              />
            }
            label={chrome.i18n.getMessage("labelFlagM")}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={flagStates.flagI}
                onChange={handleChecked}
                name="flagI"
              />
            }
            label={chrome.i18n.getMessage("labelFlagI")}
          />
        </FormControl>
      </ListItem>
      <ListItem>
        <ListItemText>
          <Typography>{result}</Typography>
        </ListItemText>
      </ListItem>
      <ListItem>
        <ListItemText>
          <Button variant="contained" onClick={handleSearch}>
            {chrome.i18n.getMessage("labelSearch")}
          </Button>
        </ListItemText>
        <IconButton aria-label="clear" onClick={handleClear}>
          <DeleteIcon />
        </IconButton>
      </ListItem>
    </List>
  );
};

export default Home;
