import React from 'react'
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './app/modules/auth';
import { Provider } from 'react-redux';
import { store } from './store';
import App from './app/App';
import './main.css'


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      {/* <AuthProvider> */}
      <BrowserRouter>
        <App />
      </BrowserRouter>
      {/* </AuthProvider> */}
    </Provider>
  </React.StrictMode>
)
