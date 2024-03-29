// -----------------------------------------------------------------------------
// Import
// -----------------------------------------------------------------------------
import  React     from 'react';
import { styled } from '@mui/material/styles';
import MuiAppBar  from '@mui/material/AppBar';
import MuiDrawer  from '@mui/material/Drawer';
import {
  Typography,
  Toolbar,
  IconButton,
  Divider,
  List,
  Badge,
  Menu,
  MenuItem,
} from '@mui/material';

import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import MenuIcon        from '@mui/icons-material/Menu';
import AccountCircle   from '@mui/icons-material/AccountCircle';

// Context
import { useContext }  from 'react';
import { CTX_USER }    from 'main/route_factory';

// Navigation
import { useNavigate } from "react-router-dom"



// Proprietary
import { mainListItems, secondaryListItems } from 'component/DisplayFrame/GeneralMenu/listItems';

// -----------------------------------------------------------------------------
// Function & Static Variable
// -----------------------------------------------------------------------------

const _drawerWidth = 240;

const AppBar = styled(MuiAppBar, {shouldForwardProp: (prop) => prop !== 'open',})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: _drawerWidth,
    width: `calc(100% - ${_drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    '& .MuiDrawer-paper': {
      position  : 'relative',
      whiteSpace: 'nowrap',
      width     : _drawerWidth,
      transition: theme.transitions.create('width', {
        easing  : theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      boxSizing: 'border-box',
      ...(!open && {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
          easing  : theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: { width: theme.spacing(9), },
      }),
    },
  }),
);

// -----------------------------------------------------------------------------
// Main
// -----------------------------------------------------------------------------
const GeneralMenu = (props) => {

  const [open, setOpen] = React.useState(false);
  const toggleDrawer = () => { setOpen(!open); };

  const {title} = props;

  const {commonFunc} = useContext(CTX_USER);
  const navigate     = useNavigate();

  // Account Menu Open or Close
  const [anchorEl, setAnchorEl] = React.useState(null);
  const acmenu_open = Boolean(anchorEl);
  const handleClick = (event) => { setAnchorEl(event.currentTarget); };
  const handleClose = ()      => { setAnchorEl(null); };


  return (
    <>
      {/* Head Up Menu */}
      <AppBar position="absolute" open={open}>
        <Toolbar sx={{ pr: '24px', /* keep right padding when drawer closed */ }} >
          <IconButton edge="start" color="inherit" aria-label="open drawer" onClick={toggleDrawer} sx={{ marginRight: '36px', ...(open && { display: 'none' }), }} >
            <MenuIcon />
          </IconButton>

          <Typography component="h1" variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }} >
            {title}
          </Typography>

          {/* Notice */}
          <IconButton
            color="inherit"
            aria-controls={acmenu_open ? 'account-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={acmenu_open ? 'true' : undefined}
            onClick={handleClick}
          >
            <Badge badgeContent={0} color="secondary">
              <AccountCircle />
            </Badge>
          </IconButton>
           <Menu
              id="account-menu"
              aria-labelledby="demo-positioned-button"
              anchorEl={anchorEl}
              open={acmenu_open}
              onClose={handleClose}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right', }}
              transformOrigin={{ vertical: 'top', horizontal: 'right', }}
            >
              <MenuItem onClick={()=>{handleClose();navigate('/account')}}>アカウント設定</MenuItem>
              <MenuItem onClick={()=>{handleClose();commonFunc.f_logout(false)}}>ログアウト</MenuItem>
            </Menu>

        </Toolbar>
      </AppBar>

      {/* Side Menu */}
      <Drawer variant="permanent" open={open}>
        {/* 上部 */}
        <Toolbar sx={{ display       : 'flex', alignItems    : 'center', justifyContent: 'flex-end', px            : [1], }} >
          <IconButton onClick={toggleDrawer}><ChevronLeftIcon/></IconButton>
        </Toolbar>

        <Divider />

        {/* Bussiness Menu */}
        <List component="nav">
          {mainListItems}
          <Divider sx={{ my: 1 }} />
          {secondaryListItems}
        </List>
      </Drawer>
    </>
  );
}

export default GeneralMenu;
