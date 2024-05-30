import { Auth0Provider } from "@auth0/auth0-react";
import React from 'react'
import ReactDOM from 'react-dom/client'

import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Auth0Provider
        domain="dev-a2dq65chfumi4py8.us.auth0.com"
        clientId="kjnjFYQe8mtLsWdgHgpqXLdXWB6fSXQW"
        authorizationParams={{
            redirect_uri: window.location.origin
        }}
      >
        <App />
      </Auth0Provider>
  </React.StrictMode>,
)
