import React from 'react'
import ReactDOM from 'react-dom/client'
import FocusApp from './FocusApp.jsx'
import './index.css'
import { registerServiceWorker } from './services/notifications'

// Register the SW silently — needed so scheduled notifications survive across
// reloads. Permission is asked later via the in-app toggle, not at boot.
if (typeof window !== "undefined") {
  registerServiceWorker().catch(() => {});
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <FocusApp />
  </React.StrictMode>,
)
