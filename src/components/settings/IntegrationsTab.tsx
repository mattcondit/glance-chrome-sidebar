/**
 * Integrations Settings Tab
 *
 * Manage connected accounts (GitHub, etc.)
 */

import { useState } from 'react'
import { useStore } from '~/lib/store'
import { GitHubAccountModal } from './GitHubAccountModal'
import type { GitHubAccount } from '~/lib/integrations/types'
import './IntegrationsTab.css'

export function IntegrationsTab() {
  const integrations = useStore((state) => state.integrations)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingAccount, setEditingAccount] = useState<GitHubAccount | null>(null)

  const githubAccounts = integrations.filter(
    (i): i is GitHubAccount => i.type === 'github'
  )

  return (
    <div className="integrations-tab">
      <div className="settings-section">
        <div className="integration-header">
          <h3 className="settings-section-title">GitHub Accounts</h3>
          <button
            className="btn btn-secondary"
            onClick={() => setShowAddModal(true)}
          >
            + Add Account
          </button>
        </div>

        {githubAccounts.length === 0 ? (
          <div className="integration-empty">
            <p>No GitHub accounts connected</p>
            <p className="text-muted">
              Add a GitHub account to track PRs and reviews
            </p>
          </div>
        ) : (
          <div className="integration-list">
            {githubAccounts.map((account) => (
              <div key={account.id} className="integration-item">
                <div className="integration-item-info">
                  <div className="integration-item-header">
                    <span className="integration-item-name">{account.name}</span>
                    {account.username && (
                      <span className="integration-item-username">
                        @{account.username}
                      </span>
                    )}
                  </div>
                  <span className="integration-item-url">
                    {account.apiBaseUrl.replace('https://', '').replace('/api/v3', '')}
                  </span>
                  {account.validationError && (
                    <span className="integration-item-error">
                      {account.validationError}
                    </span>
                  )}
                </div>
                <div className="integration-item-actions">
                  <button
                    className="btn btn-ghost btn-icon"
                    onClick={() => setEditingAccount(account)}
                    title="Edit"
                  >
                    ✏️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {(showAddModal || editingAccount) && (
        <GitHubAccountModal
          account={editingAccount}
          onClose={() => {
            setShowAddModal(false)
            setEditingAccount(null)
          }}
        />
      )}
    </div>
  )
}
