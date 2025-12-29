/**
 * General Settings Tab
 */

export function GeneralTab() {
  return (
    <div className="general-settings">
      <div className="settings-section">
        <h3 className="settings-section-title">Appearance</h3>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '13px' }}>
          Theme settings coming soon
        </p>
      </div>

      <div className="settings-section">
        <h3 className="settings-section-title">About</h3>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '13px' }}>
          <strong>Glance</strong> v0.1.0
          <br />
          <span style={{ color: 'var(--color-text-muted)' }}>
            A customizable sidebar dashboard
          </span>
        </p>
      </div>
    </div>
  )
}
