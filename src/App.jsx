import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import Play from './Play.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <Play />
  </StrictMode>
);
