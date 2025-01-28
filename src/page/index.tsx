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
  defaultPageHeight,
  defaultPageWidth,
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

  const context: AppContextProp = {
    bgColor: bgColor,
    setBgColor: setBgColor,
    dialogState: dialogState,
    setDialogState: setDialogState,
    dialogContents: dialogContents,
    setDialogContents: setDialogContents,
  };
  const navigate = useNavigate();
  const theme = createTheme({ colorSchemes: { dark: true } });

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
      if (data.bgColor && !(data.bgColor === bgColor)) {
        setBgColor(data.bgColor);
      }
    });
  });
  return (
    <AppContext.Provider value={context}>
      <ThemeProvider theme={theme} defaultMode="system">
        <Box
          sx={{
            bgcolor: "background.default",
            color: "text.primary",
            minWidth: defaultPageWidth,
            minHeight: defaultPageHeight,
            height: window.innerHeight,
          }}>
          <AppBar position="static" sx={{ height: 56 }}>
            <Toolbar>
              <Typography>{name}</Typography>
            </Toolbar>
          </AppBar>
          <Box
            sx={{
              minHeight: defaultPageHeight - 112,
              height: window.innerHeight - 112,
              overflowX: "hidden",
              overflowY: "auto",
              scrollbarWidth: "thin",
              "&::-webkit-scrollbar": {
                width: "0.4em",
              },
              "&::-webkit-scrollbar-track": {
                background: "#f1f1f1",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "#888",
              },
              "&::-webkit-scrollbar-thumb:hover": {
                background: "#555",
              },
            }}>
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
            onChange={handleNavigationChange}
            sx={{ height: 56 }}>
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
