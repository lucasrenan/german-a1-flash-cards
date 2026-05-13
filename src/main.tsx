import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { loadSettings } from './lib/storage'
import { applyTheme } from './lib/theme'

// Apply theme before first paint to avoid a flash of the wrong color scheme.
applyTheme(loadSettings().theme)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
