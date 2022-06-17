// -----------------------------------------------------------------------------
// Import
// -----------------------------------------------------------------------------
import React        from 'react';
import ReactDOM     from 'react-dom/client';

// Proprietary Component
import RouteFactory from 'main/route_factory';

// -----------------------------------------------------------------------------
// Main
// -----------------------------------------------------------------------------
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    {/* No Script... */}
    <noscript>You need to enable JavaScript to run this app.</noscript>
    {/* Main Component */}
    <RouteFactory />
  </React.StrictMode>
);
