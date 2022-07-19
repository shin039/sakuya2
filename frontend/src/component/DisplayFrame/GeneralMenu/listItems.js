// -----------------------------------------------------------------------------
// Import
// -----------------------------------------------------------------------------
import * as React from 'react';

import ListItemButton   from '@mui/material/ListItemButton';
import ListItemIcon     from '@mui/material/ListItemIcon';
import ListItemText     from '@mui/material/ListItemText';
import ListSubheader    from '@mui/material/ListSubheader';

import {
  MENU_LIST,
  MENU_SECONDARY_LIST
} from 'common/const';

// -----------------------------------------------------------------------------
// Function
// -----------------------------------------------------------------------------
const makeMenuItem = (menu_item) => {
  const {icon, title, path} = menu_item;

  return (
    <ListItemButton key={title} href={path}>
      <ListItemIcon>{icon.type.render()}</ListItemIcon>
      <ListItemText primary={title} />
    </ListItemButton>
  );
}


// -----------------------------------------------------------------------------
// Export Function
// -----------------------------------------------------------------------------
export const mainListItems = (
  <React.Fragment>
    {MENU_LIST.map((menu_item) => makeMenuItem(menu_item))}
  </React.Fragment>
);

export const secondaryListItems = (
  <React.Fragment>
    <ListSubheader component="div" inset> Master mainte </ListSubheader>

    {MENU_SECONDARY_LIST.map((menu_item) => makeMenuItem(menu_item))}
  </React.Fragment>
);
