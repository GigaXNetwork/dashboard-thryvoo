import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { UserProvider } from './Context/ContextApt';
import './index.css'
import App from './App.jsx'
import './App.css'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserProvider>
      <App />
    </UserProvider>
  </StrictMode>,
)
