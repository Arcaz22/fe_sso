import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { KeycloakProvider } from './context/KeycloakContext.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <KeycloakProvider>
      <App />
    </KeycloakProvider>
  </React.StrictMode>
);
