import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './styles/print.css'
import App from './App.tsx'

// La registración del Service Worker ahora la realiza vite-plugin-pwa automáticamente
// mediante injectRegister: 'auto' y registerType: 'autoUpdate'.

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
