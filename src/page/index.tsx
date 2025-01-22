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
  const [pagePath, setPagePath] = React.useState("/");

  const navigate = useNavigate();
  const theme = createTheme({
    colorSchemes: {
      dark: true,
    },
  });

  React.useEffect(() => {
    navigate(pagePath);
  }, [pagePath]);

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          bgcolor: "background.default",
          color: "text.primary",
          width: "300px",
        }}>
        <AppBar position="static">
          <Toolbar children={<Typography children="test" />} />
        </AppBar>
        <Routes>
          <Route index path="/" element={<Home />} />
          <Route path="/setting" element={<Setting />} />
        </Routes>
        <BottomNavigation
          showLabels
          value={pagePath}
          onChange={(_event, newIndex) => {
            setPagePath(newIndex);
          }}>
          <BottomNavigationAction
            label={chrome.i18n.getMessage("homeName")}
            icon={<HomeIcon />}
            value="/"
          />
          <BottomNavigationAction
            label={chrome.i18n.getMessage("settingName")}
            icon={<SettingIcon />}
            value="/setting"
          />
        </BottomNavigation>
      </Box>
    </ThemeProvider>
  );
};

export default App;
