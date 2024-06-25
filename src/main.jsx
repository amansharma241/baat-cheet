import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from './Contexts/AuthContext';
import ChatProvider from './Contexts/ChatContext.jsx';
import { FirebaseProvider } from './Contexts/FirebaseContext.jsx';


ReactDOM.createRoot(document.getElementById('root')).render(

    <AuthProvider>
      <FirebaseProvider>
      <ChatProvider>
      <App />
      </ChatProvider>
      </FirebaseProvider>
    </AuthProvider>
,
)
