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
  const [inputValue, setInputValue] = React.useState("");
  const [resultValue, setResultValue] = React.useState("");
  const [flagValues, setFlagValues] = React.useState({
    flagG: true,
    flagM: false,
    flagI: true,
  });

  // 处理搜索逻辑
  const handleSearch = React.useCallback(async () => {
    const flags: string[] = [];
    if (flagValues.flagG) flags.push("g");
    if (flagValues.flagM) flags.push("m");
    if (flagValues.flagI) flags.push("i");

    const cleanedInputValue = inputValue.trim();
    if (cleanedInputValue === "") {
      setResultValue(chrome.i18n.getMessage("errEmptyInput"));
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
              setResultValue(
                `${chrome.i18n.getMessage("errSearchFailed")}: ${
                  chrome.runtime.lastError.message
                }`
              );
            } else {
              setResultValue(res?.result || "");
            }
          }
        );
      } else {
        setResultValue(chrome.i18n.getMessage("errEmptyTabs"));
      }
    } catch (error: any) {
      setResultValue(
        `${chrome.i18n.getMessage("errSearchFailed")}: ${error.message}`
      );
    }
  }, [inputValue, flagValues]);

  const handleClear = React.useCallback(async () => {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tabs.length > 0 && tabs[0].id !== undefined) {
      chrome.tabs.sendMessage(tabs[0].id, { action: "clear" });
    }

    setInputValue("");
    setResultValue("");

    await chrome.storage.local.remove(["lastRegex", "lastResult"]);
  }, []);

  const handleChecked = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
      setFlagValues((prev) => ({
        ...prev,
        [event.target.name]: checked,
      }));
    },
    []
  );

  React.useEffect(() => {
    chrome.storage.local.set({
      lastRegex: inputValue,
      lastResult: resultValue,
    });
  }, [inputValue, resultValue]);

  return (
    <List>
      <ListItem>
        <ListItemText>
          <TextField
            autoFocus
            fullWidth
            label={chrome.i18n.getMessage("labelRegExp")}
            variant="standard"
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
          />
        </ListItemText>
      </ListItem>
      <ListItem>
        <FormControl>
          <FormControlLabel
            control={
              <Checkbox
                checked={flagValues.flagG}
                onChange={handleChecked}
                name="flagG"
              />
            }
            label={chrome.i18n.getMessage("labelFlagG")}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={flagValues.flagM}
                onChange={handleChecked}
                name="flagM"
              />
            }
            label={chrome.i18n.getMessage("labelFlagM")}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={flagValues.flagI}
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
          <Typography>{resultValue}</Typography>
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
