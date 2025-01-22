import Delete from "@mui/icons-material/Delete";
import {
  AppBar,
  Box,
  Button,
  Checkbox,
  createTheme,
  FormControl,
  FormControlLabel,
  IconButton,
  List,
  ListItem,
  ListItemText,
  TextField,
  ThemeProvider,
  Toolbar,
  Typography,
} from "@mui/material";
import React from "react";

const App = () => {
  React.useEffect(() => {
    chrome.storage.local.get(["lastRegex", "lastResult"], (data) => {
      setInputValue(data.lastRegex || "");
      setResultValue(data.lastResult || "");
    });
  }, []);

  const [inputValue, setInputValue] = React.useState("");
  const [resultValue, setResultValue] = React.useState("");
  const [flagValue, setFlagValue] = React.useState({
    flagG: true,
    flagM: false,
    flagI: true,
  });
  const theme = createTheme({
    colorSchemes: {
      dark: true,
    },
  });

  const handleSearch = async () => {
    const flag: string[] = [];
    if (flagValue.flagG) flag.push("g");
    if (flagValue.flagM) flag.push("m");
    if (flagValue.flagI) flag.push("i");

    const cleanedInputValue = inputValue.trim();
    if (cleanedInputValue === "") {
      setResultValue(chrome.i18n.getMessage("mainEmptyError"));
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
                `${chrome.i18n.getMessage("mainSearchError")}: ${
                  chrome.runtime.lastError.message
                }`
              );
            } else {
              setResultValue(res?.result || chrome.i18n.getMessage("mainEmptyResult"));
            }
          }
        );
      } else {
        setResultValue(chrome.i18n.getMessage("mainTabNotFound"));
      }
    } catch (error: any) {
      setResultValue(`${chrome.i18n.getMessage("mainSearchError")}: ${error.message}`);
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

  const handleChecked = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFlagValue({
      ...flagValue,
      [event.target.name]: event.target.checked,
    });
  };

  return (
    <React.StrictMode>
      <ThemeProvider theme={theme}>
        <Box sx={{ bgcolor: "background.default", color: "text.primary" }}>
          <AppBar position="static">
            <Toolbar
              children={
                <Typography children={chrome.i18n.getMessage("mainName")} />
              }
            />
          </AppBar>
          <List>
            <ListItem
              children={
                <ListItemText
                  primary={
                    <TextField
                      autoFocus
                      fullWidth
                      label={chrome.i18n.getMessage("mainLabel")}
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
                    label={chrome.i18n.getMessage("mainFlagG")}
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={flagValue.flagM}
                        onChange={handleChecked}
                        name="flagM"
                      />
                    }
                    label={chrome.i18n.getMessage("mainFlagM")}
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={flagValue.flagI}
                        onChange={handleChecked}
                        name="flagI"
                      />
                    }
                    label={chrome.i18n.getMessage("mainFlagI")}
                  />
                </FormControl>
              }
            />
            <ListItem
              children={
                <ListItemText
                  primary={<Typography component="p" children={resultValue} />}
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
                      children={chrome.i18n.getMessage("mainSearch")}
                    />
                  }
                />
              }
              secondaryAction={
                <IconButton
                  aria-label="clear"
                  onClick={handleClear}
                  children={<Delete />}
                />
              }
            />
          </List>
        </Box>
      </ThemeProvider>
    </React.StrictMode>
  );
};

export default App;
