/**
 * Header Component
 *
 * Top bar with app title, edit mode toggle, and settings button.
 */

import { useStore } from '~/lib/store'
import './Header.css'

export function Header() {
  const editMode = useStore((state) => state.editMode)
  const setEditMode = useStore((state) => state.setEditMode)
  const setSettingsOpen = useStore((state) => state.setSettingsOpen)

  return (
    <header className="header">
      <h1 className="header-title">Glance</h1>
      <div className="header-actions">
        <button
          className={`btn btn-icon ${editMode ? 'btn-primary' : 'btn-ghost'}`}
          onClick={() => setEditMode(!editMode)}
          title={editMode ? 'Done editing' : 'Edit layout'}
        >
          {editMode ? '✓' : '✏️'}
        </button>
        <button
          className="btn btn-icon btn-ghost"
          onClick={() => setSettingsOpen(true)}
          title="Settings"
        >
          ⚙️
        </button>
      </div>
    </header>
  )
}
