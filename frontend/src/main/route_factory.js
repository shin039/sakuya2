// -----------------------------------------------------------------------------
// Import
// -----------------------------------------------------------------------------
import React from 'react';
import {
  Snackbar,
  Alert
} from '@mui/material';

// Routing
import { Routes, Route, Navigate, useNavigate } from "react-router-dom"

// Cookie Management
import { CookiesProvider, useCookies  } from "react-cookie";

// Data Picker Common Conpornent
import { AdapterDayjs }         from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import jaLocale                 from 'dayjs/locale/ja';

// Business Components
import SignIn       from 'main/C_SignIn';
import DashBoard    from 'main/C_Dashboard';
import BarcodePrint from 'main/F_BarcodePrint';

import Account      from 'main/CM_Account';
import Goods        from 'main/CM_Goods';

// -----------------------------------------------------------------------------
// Context Data
// -----------------------------------------------------------------------------
const _ctx_userdata = {
  userInfo   : { userid : null },
  setUserInfo: () => {},
  snackbar   : { open: false, message : null , severity: 'info'},
  setSnackbar: () => {},
  f_logout   : () => {},
}

export const CTX_USER = React.createContext(_ctx_userdata);

const USE_CONTEXT = (_logout) => {
  const [userInfo, setUserInfo] = React.useState({userid: null});
  const [snackbar, setSnackbar] = React.useState({ open: false, message : null , severity: 'info'});
  // 子画面でsnackbarを設定したときにuseEffectが走るのを阻止したいときに使う。
  const useEffectStop           = React.useRef(false);
  return {
    userInfo, setUserInfo,
    snackbar, setSnackbar,
    useEffectStop: useEffectStop,
    f_logout: (is_timeout=true) => {
      if(is_timeout)setSnackbar({open:true, message: "タイムアウトしました。ログインしなおしてください。", severity: "error"});
      _logout();
    }
  };
}

// -----------------------------------------------------------------------------
// Main
// -----------------------------------------------------------------------------

const RouteFactory = (props) => {

  // ---------------------------------------------------------------------------
  // Contextに格納する共通メソッドの生成
  // ---------------------------------------------------------------------------
  // Cookie
  const [cookie, , removeCookie] = useCookies();

  const navigate = useNavigate();

  // logout func
  const _logout = () => {
    removeCookie("_sakuya");
    navigate("/");
  }

  // Context
  const ctx_user = USE_CONTEXT(_logout);
  const {snackbar, setSnackbar, useEffectStop} = ctx_user;

  // ---------------------------------------------------------------------------
  // Login Check
  //   ・Contextにユーザ情報があるかどうかチェックする。
  //   ・Contextに無ければCookieをチェックして、値があればContextに再設定する。
  //     -> F5 や URL直接指定の場合に該当する。
  // ---------------------------------------------------------------------------
  // Check Login Info
  // Not Set UserInfo in  Context Val, F5 or URL Direct Access
  if(ctx_user && ctx_user.userInfo && ! ctx_user.userInfo.userid){
    // Set Cookie UserInfo
    if(cookie && cookie._sakuya && cookie._sakuya.userInfo){
       ctx_user.setUserInfo({userid: cookie._sakuya.userInfo.userid});
    }
  }

  // ---------------------------------------------------------------------------
  // Functions
  // ---------------------------------------------------------------------------
  const isAuthOK = !!ctx_user.userInfo.userid;
  const withAuth = (component) => (isAuthOK && component) || <SignIn/>;

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  return (
    <CookiesProvider>
      <CTX_USER.Provider value={ctx_user}>
        {/* For DatePicker */}
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={jaLocale}>

          {/* Main Route */}
          <Routes>
            {/* Main */}
            <Route index          element={<SignIn/>                 } />
            <Route path="main"    element={withAuth(<DashBoard/>)    } />
            <Route path="barcode" element={withAuth(<BarcodePrint/>) } />
            {/* Master */}
            <Route path="account" element={withAuth(<Account/>)      } />
            <Route path="goods"   element={withAuth(<Goods/>)        } />
            {/* Etc */}
            <Route path="*"       element={<Navigate to="/"/>        } />
          </Routes>

          {/* Common Snackbar */}
          <Snackbar
            anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
            open={snackbar.open}
            autoHideDuration={6000}
            onClose={()=>{useEffectStop.current = true; setSnackbar({...snackbar, open: false})}}
          >
            <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
          </Snackbar>

        </LocalizationProvider>
      </CTX_USER.Provider>
    </CookiesProvider>
  );
}

export default RouteFactory;
