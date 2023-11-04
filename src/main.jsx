import React from 'react'
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { AuthProvider } from './app/modules/auth';
import { Provider } from 'react-redux';
import { store } from './store';
import App from './app/App';
import './main.css'

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        {/* <AuthProvider> */}
        <BrowserRouter>
          <App />
        </BrowserRouter>
        {/* </AuthProvider> */}
      </Provider>
    </QueryClientProvider>
  </React.StrictMode>
)
