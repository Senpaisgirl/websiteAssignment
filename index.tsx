import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './src/App';

/**
 * Entry point: Renders App with StrictMode for double-rendering warnings.
 */
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
