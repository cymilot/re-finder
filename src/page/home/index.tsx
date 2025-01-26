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
  const [flagValue, setFlagValue] = React.useState({
    flagG: true,
    flagM: false,
    flagI: true,
  });

  const handleSearch = async () => {
    const flag: string[] = [];
    if (flagValue.flagG) flag.push("g");
    if (flagValue.flagM) flag.push("m");
    if (flagValue.flagI) flag.push("i");

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
            flag: flag,
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

    await chrome.storage.local.set({
      lastRegex: cleanedInputValue,
      lastResult: resultValue,
    });
  };

  const handleClear = async () => {
    const tabs = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });
    if (tabs.length > 0 && tabs[0].id !== undefined) {
      chrome.tabs.sendMessage(tabs[0].id, { action: "clear" });
    }

    setInputValue("");
    setResultValue("");

    await chrome.storage.local.remove(["lastRegex", "lastResult"]);
  };

  const handleChecked = (
    event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => {
    setFlagValue({
      ...flagValue,
      [event.target.name]: checked,
    });
  };

  React.useEffect(() => {
    chrome.storage.local.get(["lastRegex", "lastResult"], (data) => {
      setInputValue(data.lastRegex || "");
      setResultValue(data.lastResult || "");
    });
  });

  return (
    <List>
      <ListItem
        children={
          <ListItemText
            primary={
              <TextField
                autoFocus
                fullWidth
                label={chrome.i18n.getMessage("labelRegExp")}
                variant="standard"
                value={inputValue}
                onChange={(event) => {
                  setInputValue(event.target.value);
                }}
              />
            }
          />
        }
      />
      <ListItem
        children={
          <FormControl>
            <FormControlLabel
              control={
                <Checkbox
                  checked={flagValue.flagG}
                  onChange={handleChecked}
                  name="flagG"
                />
              }
              label={chrome.i18n.getMessage("flagG")}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={flagValue.flagM}
                  onChange={handleChecked}
                  name="flagM"
                />
              }
              label={chrome.i18n.getMessage("flagM")}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={flagValue.flagI}
                  onChange={handleChecked}
                  name="flagI"
                />
              }
              label={chrome.i18n.getMessage("flagI")}
            />
          </FormControl>
        }
      />
      <ListItem
        children={
          <ListItemText
            primary={<Typography children={resultValue} />}
          />
        }
      />
      <ListItem
        children={
          <ListItemText
            primary={
              <Button
                variant="contained"
                onClick={handleSearch}
                children={chrome.i18n.getMessage("labelSearch")}
              />
            }
          />
        }
        secondaryAction={
          <IconButton
            aria-label="clear"
            onClick={handleClear}
            children={<DeleteIcon />}
          />
        }
      />
    </List>
  );
};

export default Home;
