// -----------------------------------------------------------------------------
// Import
// -----------------------------------------------------------------------------
// Routing
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom"

// Business Components
import SignIn    from 'main/signin/SignIn';
import DashBoard from 'main/dashboard/Dashboard';

// -----------------------------------------------------------------------------
// Main
// -----------------------------------------------------------------------------

// TODO
const isAuthOK = true;

const RouteFactory = (props) => {

  const withAuth = (component) => (isAuthOK && component) || <SignIn/>;

  return (
      <BrowserRouter>
      {/* Main Drawer */}
        <Routes>
          <Route index       element={<SignIn/>             } />
          <Route path="main" element={withAuth(<DashBoard/>)} />
          <Route path="*"    element={<Navigate to="/"/>    } />
        </Routes>
      </BrowserRouter>
  );
}

export default RouteFactory;
