import React from 'react'
import ReactDOM from 'react-dom/client';
import { AuthProvider } from './app/modules/access/context/AuthProvider'
import App from './app/App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
)
