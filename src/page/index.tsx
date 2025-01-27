import React from "react";
import { Routes, Route, useNavigate } from "react-router";
import {
  AppBar,
  BottomNavigation,
  BottomNavigationAction,
  Box,
  createTheme,
  ThemeProvider,
  Toolbar,
  Typography,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import SettingIcon from "@mui/icons-material/Settings";

import Home from "./home";
import Setting from "./setting";

const App = () => {
  const [pathValue, setPathValue] = React.useState("/");
  const [nameValue, setNameValue] = React.useState(chrome.i18n.getMessage("_"));

  const navigate = useNavigate();
  const theme = createTheme();

  const handleNavigationChange = React.useCallback(
    (_event: React.SyntheticEvent, newPath: string) => {
      setNameValue(chrome.i18n.getMessage(newPath.replace("/", "_")));
      setPathValue(newPath);
      navigate(newPath);
    },
    [navigate]
  );

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          bgcolor: "background.default",
          color: "text.primary",
          minWidth: "320px",
        }}>
        <AppBar position="static">
          <Toolbar>
            <Typography>{nameValue}</Typography>
          </Toolbar>
        </AppBar>
        <Box sx={{ height: "350px", overflowX: "hidden", overflowY: "auto" }}>
          <Routes>
            <Route index path="/" element={<Home />} />
            <Route path="/setting" element={<Setting />} />
          </Routes>
        </Box>
        <BottomNavigation
          showLabels
          value={pathValue}
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
  );
};

export default App;
