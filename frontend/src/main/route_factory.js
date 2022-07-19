// -----------------------------------------------------------------------------
// Import
// -----------------------------------------------------------------------------
import React from 'react';

// Routing
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"

// Cookie Management
import { CookiesProvider, useCookies  } from "react-cookie";

// Business Components
import SignIn       from 'main/C_SignIn';
import DashBoard    from 'main/C_Dashboard';
import BarcodePrint from 'main/F_BarcodePrint';

import Goods        from 'main/CM_Goods';

// -----------------------------------------------------------------------------
// Context Data
// -----------------------------------------------------------------------------
const _ctx_userdata = {
  userInfo   : {userid: null},
  setUserInfo: () => {}
}

export const CTX_USER = React.createContext(_ctx_userdata);

export const USE_CONTEXT = () => {
  const [userInfo, setUserInfo] = React.useState({userid: null});
  return {userInfo, setUserInfo};
}

// -----------------------------------------------------------------------------
// Main
// -----------------------------------------------------------------------------

const RouteFactory = (props) => {

  // Context
  const ctx_user = USE_CONTEXT();
  // Cookie
  const [cookie] = useCookies();

  // Check Login Info
  // Not Set UserInfo in  Context Val, F5 or URL Direct Access
  if(ctx_user && ctx_user.userInfo && ! ctx_user.userInfo.userid){
    // Set Cookie UserInfo
    if(cookie && cookie._sakuya && cookie._sakuya.userInfo){
       ctx_user.setUserInfo({userid: cookie._sakuya.userInfo.userid});
    }
  }

  // Functions
  const isAuthOK = !!ctx_user.userInfo.userid;
  const withAuth = (component) => (isAuthOK && component) || <SignIn/>;

  return (
    <CookiesProvider>
      <CTX_USER.Provider value={ctx_user}>
        <BrowserRouter>
        {/* Main Drawer */}
          <Routes>
            {/* Main */}
            <Route index          element={<SignIn/>                 } />
            <Route path="main"    element={withAuth(<DashBoard/>)    } />
            <Route path="barcode" element={withAuth(<BarcodePrint/>) } />
            {/* Master */}
            <Route path="goods"   element={withAuth(<Goods/>) } />
            <Route path="*"       element={<Navigate to="/"/>        } />
          </Routes>
        </BrowserRouter>
      </CTX_USER.Provider>
    </CookiesProvider>
  );
}

export default RouteFactory;
