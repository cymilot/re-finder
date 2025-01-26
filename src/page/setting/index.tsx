import React from "react";
import {
  List,
  ListItem,
  ListItemText,
  TextField,
  Typography,
} from "@mui/material";

const Setting = () => {
  return (
    <List>
      <ListItem
        children={<ListItemText primary={<Typography children="setColor" />} />}
        secondaryAction={
          <TextField variant="standard" sx={{ width: "60px" }} />
        }
      />
      <ListItem
        children={<ListItemText primary={<Typography children="setColor" />} />}
        secondaryAction={
          <TextField variant="standard" sx={{ width: "60px" }} />
        }
      />
      <ListItem
        children={<ListItemText primary={<Typography children="setColor" />} />}
        secondaryAction={
          <TextField variant="standard" sx={{ width: "60px" }} />
        }
      />
      <ListItem
        children={<ListItemText primary={<Typography children="setColor" />} />}
        secondaryAction={
          <TextField variant="standard" sx={{ width: "60px" }} />
        }
      />
      <ListItem
        children={<ListItemText primary={<Typography children="setColor" />} />}
        secondaryAction={
          <TextField variant="standard" sx={{ width: "60px" }} />
        }
      />
    </List>
  );
};

export default Setting;
