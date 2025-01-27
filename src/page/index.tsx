import React from "react";
import { Routes, Route, useNavigate } from "react-router";
import {
  AppBar,
  BottomNavigation,
  BottomNavigationAction,
  Box,
  createTheme,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  ThemeProvider,
  Toolbar,
  Typography,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import SettingIcon from "@mui/icons-material/Settings";

import Home from "./home";
import Setting from "./setting";
import {
  AppContext,
  AppContextProp,
  defaultBgColor,
  DialogContentsProp,
} from "../consts";

const App = () => {
  const [path, setPath] = React.useState("/");
  const [name, setName] = React.useState(chrome.i18n.getMessage("_"));
  const [bgColor, setBgColor] = React.useState(defaultBgColor);
  const [dialogState, setDialogState] = React.useState(false);
  const [dialogContents, setDialogContents] =
    React.useState<DialogContentsProp>({
      dialogTitle: "",
      dialogContent: undefined,
      dialogAction: undefined,
    });
  const navigate = useNavigate();
  const context: AppContextProp = {
    bgColor: bgColor,
    setBgColor: setBgColor,
    dialogState: dialogState,
    setDialogState: setDialogState,
    dialogContents: dialogContents,
    setDialogContents: setDialogContents,
  };

  const handleNavigationChange = React.useCallback(
    (_event: React.SyntheticEvent, newPath: string) => {
      setName(chrome.i18n.getMessage(newPath.replace("/", "_")));
      setPath(newPath);
      navigate(newPath);
    },
    [navigate]
  );

  React.useEffect(() => {
    chrome.storage.local.get(["bgColor"], (data) => {
      if (data.bgColor) setBgColor(data.bgColor);
    });
  }, []);

  const theme = createTheme({ colorSchemes: { dark: true } });

  return (
    <AppContext.Provider value={context}>
      <ThemeProvider theme={theme} defaultMode="system">
        <Box
          sx={{
            bgcolor: "background.default",
            color: "text.primary",
            minWidth: "320px",
          }}>
          <AppBar position="static">
            <Toolbar>
              <Typography>{name}</Typography>
            </Toolbar>
          </AppBar>
          <Box sx={{ height: "350px", overflowX: "hidden", overflowY: "auto" }}>
            <Routes>
              <Route index path="/" element={<Home />} />
              <Route path="/setting" element={<Setting />} />
            </Routes>
            <Dialog
              fullWidth
              maxWidth="xl"
              open={dialogState}
              onClose={() => {
                setDialogState(false);
              }}>
              <DialogTitle>{dialogContents.dialogTitle}</DialogTitle>
              <DialogContent>
                {dialogContents.dialogContent
                  ? dialogContents.dialogContent
                  : null}
              </DialogContent>
              {dialogContents.dialogAction ? (
                <DialogActions>dialogContents.dialogAction</DialogActions>
              ) : null}
            </Dialog>
          </Box>
          <BottomNavigation
            showLabels
            value={path}
            onChange={handleNavigationChange}>
            <BottomNavigationAction
              label={chrome.i18n.getMessage("_")}
              icon={<HomeIcon />}
              value={"/"}
            />
            <BottomNavigationAction
              label={chrome.i18n.getMessage("_setting")}
              icon={<SettingIcon />}
              value={"/setting"}
            />
          </BottomNavigation>
        </Box>
      </ThemeProvider>
    </AppContext.Provider>
  );
};

export default App;
