import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './output.css'
import App from './App.jsx'
import { AuthProvider } from './AuthContext.jsx'
import { ThemeProvider } from './components/ThemeContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
    <ThemeProvider>
    <App />
    </ThemeProvider>
    </AuthProvider>
    
  </StrictMode>,
)
