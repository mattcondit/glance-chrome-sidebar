/**
 * Settings Modal
 *
 * Main settings modal with tabs for different setting categories.
 */

import { useStore } from '~/lib/store'
import { GeneralTab } from './GeneralTab'
import { IntegrationsTab } from './IntegrationsTab'
import './Settings.css'

export function Settings() {
  const setSettingsOpen = useStore((state) => state.setSettingsOpen)
  const settingsTab = useStore((state) => state.settingsTab)
  const setSettingsTab = useStore((state) => state.setSettingsTab)

  const handleClose = () => {
    setSettingsOpen(false)
  }

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal settings-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Settings</h2>
          <button className="btn btn-icon btn-ghost" onClick={handleClose}>
            ✕
          </button>
        </div>

        <div className="settings-tabs">
          <button
            className={`settings-tab ${settingsTab === 'general' ? 'active' : ''}`}
            onClick={() => setSettingsTab('general')}
          >
            General
          </button>
          <button
            className={`settings-tab ${settingsTab === 'integrations' ? 'active' : ''}`}
            onClick={() => setSettingsTab('integrations')}
          >
            Integrations
          </button>
        </div>

        <div className="settings-content">
          {settingsTab === 'general' && <GeneralTab />}
          {settingsTab === 'integrations' && <IntegrationsTab />}
        </div>
      </div>
    </div>
  )
}
