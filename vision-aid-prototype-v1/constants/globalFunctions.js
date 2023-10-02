import React from 'react';
import { Checkbox, ListItemText, MenuItem, ListSubheader, Typography } from "@mui/material";

export const createMenu = (values, fieldName, checkbox, devices = []) => {
    if (checkbox) {
      return values.map((value) => (
        <MenuItem key={value} value={value} style={{whiteSpace: 'normal'}}>
          <Checkbox checked={devices[fieldName].indexOf(value) > -1} />
          <ListItemText primary={
            <Typography align="left">
              {value}
            </Typography>
          }/>
        </MenuItem>
      ));
    } else {
      return values.map((value) => (
        <MenuItem key={value} value={value}>
          <Typography align="left">
              {value}
          </Typography>
        </MenuItem>
      ));
    }
  };

export const createOptionMenu = (
    values,
    subheadings,
    indices,
    fieldName,
    checkbox,
    devices = []
  ) => {
    const fullMenu = createMenu(values, fieldName, checkbox, devices);
    const optionGroups = [];
    for (var i = 0; i < subheadings.length; i++) {
      optionGroups.push(
        <ListSubheader key={subheadings[i]}>{subheadings[i]}</ListSubheader>
      );
      optionGroups.push(fullMenu.slice(indices[i], indices[i + 1]));
    }
    return optionGroups;
  };