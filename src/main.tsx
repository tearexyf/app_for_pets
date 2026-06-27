import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "./index.css"
import App from './App.tsx'
import { getSettings } from './services/storage'
import { applySettingsEffects } from './utils/settingsEffects'
import { useSettingsStore } from './store/settingsStore'
import { scheduleTaskNotificationsSync } from './services/notifications'

applySettingsEffects(getSettings())
useSettingsStore.setState({ settings: getSettings() })
scheduleTaskNotificationsSync()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
