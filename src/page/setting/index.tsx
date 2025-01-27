import React from "react";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import { HexColorPicker } from "react-colorful";

import { defaultBgColor } from "../../consts";

const Setting = () => {
  const [bgColorValue, setBgColorValue] = React.useState(defaultBgColor);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

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

  React.useEffect(() => {
    chrome.storage.local.get(["bgColor"], (data) => {
      if (data.bgColor) {
        setBgColorValue(data.bgColor);
      }
    });
  }, []);

  React.useEffect(() => {
    chrome.storage.local.set({ bgColor: bgColorValue });
  }, [bgColorValue]);

  const handleOpenDialog = React.useCallback(() => {
    setIsDialogOpen(true);
  }, []);

  const handleCloseDialog = React.useCallback(() => {
    setIsDialogOpen(false);
  }, []);

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
            backgroundColor: bgColorValue,
            color: calculateTextColor(bgColorValue),
          }}>
          {chrome.i18n.getMessage("labelSet")}
        </Button>
        <Dialog
          fullWidth
          maxWidth="xl"
          open={isDialogOpen}
          onClose={handleCloseDialog}>
          <DialogTitle>
            {chrome.i18n.getMessage("labelBgColorPicker")}
          </DialogTitle>
          <DialogContent>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                m: "auto",
                width: "fit-content",
              }}>
              <HexColorPicker color={bgColorValue} onChange={setBgColorValue} />
            </Box>
          </DialogContent>
        </Dialog>
      </ListItem>
    </List>
  );
};

export default Setting;
