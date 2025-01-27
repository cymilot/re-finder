import React from "react";
import {
  Button,
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  Menu,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
  useColorScheme,
} from "@mui/material";
import { HexColorPicker } from "react-colorful";

import { useAppContext } from "../../consts";

const Setting = () => {
  const context = useAppContext();
  const { mode, setMode } = useColorScheme();

  const calculateTextColor = React.useCallback((hex: string): string => {
    let color = hex;
    if (color.startsWith("#")) {
      color = color.substring(1);
    }

    if (color.length !== 6) {
      return "#FFF";
    }

    const r = parseInt(color.slice(0, 2), 16);
    const g = parseInt(color.slice(2, 4), 16);
    const b = parseInt(color.slice(4, 6), 16);

    if ([r, g, b].some((x) => Number.isNaN(x))) {
      return "#FFF";
    }

    const brightness = r * 0.299 + g * 0.587 + b * 0.114;
    return brightness > 186 ? "#000" : "#FFF";
  }, []);

  const handleOpenDialog = React.useCallback(() => {
    context.setDialogContents({
      dialogTitle: chrome.i18n.getMessage("labelBgColorPicker"),
      dialogContent: (
        <HexColorPicker color={context.bgColor} onChange={context.setBgColor} />
      ),
    });
    context.setDialogState(true);
  }, [context.bgColor]);

  React.useEffect(() => {
    chrome.storage.local.set({ bgColor: context.bgColor });
  }, [context.bgColor]);

  return (
    <List>
      <ListItem>
        <ListItemText>
          <Typography>{chrome.i18n.getMessage("labelBgColor")}</Typography>
        </ListItemText>
        <Button
          variant="contained"
          onClick={handleOpenDialog}
          sx={{
            backgroundColor: context.bgColor,
            color: calculateTextColor(context.bgColor),
          }}>
          {chrome.i18n.getMessage("labelSet")}
        </Button>
      </ListItem>
      <ListItem>
        <ListItemText>
          <Typography>{chrome.i18n.getMessage("labelTheme")}</Typography>
        </ListItemText>
        <FormControl variant="standard">
          <Select
            value={mode}
            onChange={(event: SelectChangeEvent) => {
              setMode(event.target.value as "system" | "light" | "dark");
            }}>
            <MenuItem value="system">
              {chrome.i18n.getMessage("labelSystem")}
            </MenuItem>
            <MenuItem value="light">
              {chrome.i18n.getMessage("labelLight")}
            </MenuItem>
            <MenuItem value="dark">
              {chrome.i18n.getMessage("labelDark")}
            </MenuItem>
          </Select>
        </FormControl>
      </ListItem>
    </List>
  );
};

export default Setting;
