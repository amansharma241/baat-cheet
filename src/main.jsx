import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from './Contexts/AuthContext';
import ChatProvider from './Contexts/ChatContext.jsx';


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <ChatProvider>
      <App />
      </ChatProvider>
    </AuthProvider>
  </React.StrictMode>,
)
