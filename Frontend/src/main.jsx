import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './app/App.jsx'
import './styles/globals.css' // We will create this folder and file soon

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
