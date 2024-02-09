import React from 'react';
import { Checkbox, ListItemText, MenuItem, ListSubheader, Typography } from "@mui/material";

export const createMenu = (values, checkbox, selected = []) => {
    if (checkbox) {
      return values.map((value) => (
        <MenuItem key={value} value={value} style={{whiteSpace: 'normal'}}>
          <Checkbox checked={selected.indexOf(value) > -1} />
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
    checkbox,
    selected = []
  ) => {
    const fullMenu = createMenu(values, checkbox, selected);
    const optionGroups = [];
    for (var i = 0; i < subheadings.length; i++) {
      optionGroups.push(
        <ListSubheader key={subheadings[i]}>{subheadings[i]}</ListSubheader>
      );
      optionGroups.push(fullMenu.slice(indices[i], indices[i + 1]));
    }
    return optionGroups;
};
  
export const isNotNullEmptyOrUndefined = (variable) =>
  variable !== null && variable !== undefined && variable.length !== 0;

export const parseInputDate = (dateString) => {
  const date = dateString.replaceAll("-", "/");
  return date;
}

export const union = (...sets) => {
  return new Set([].concat(...sets.map(set => [...set])));
}

export const difference = (a, b) => {
  return new Set([...a].filter(i => !b.has(i)));
}

export const intersect = (a, b) => {
  return new Set([...a].filter(i => b.has(i)));
}
