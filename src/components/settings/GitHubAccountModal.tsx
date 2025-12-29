/**
 * GitHub Account Modal
 *
 * Add or edit a GitHub account connection.
 */

import { useState } from 'react'
import { useStore } from '~/lib/store'
import {
  addIntegration,
  updateIntegration,
  deleteIntegration,
} from '~/lib/integrations/storage'
import type { GitHubAccount, ValidationResult } from '~/lib/integrations/types'
import './GitHubAccountModal.css'

interface Props {
  account: GitHubAccount | null
  onClose: () => void
}

const API_PRESETS = [
  { label: 'GitHub.com', value: 'https://api.github.com' },
  { label: 'GitHub Enterprise', value: 'custom' },
]

export function GitHubAccountModal({ account, onClose }: Props) {
  const addIntegrationToStore = useStore((state) => state.addIntegration)
  const updateIntegrationInStore = useStore((state) => state.updateIntegration)
  const removeIntegrationFromStore = useStore((state) => state.removeIntegration)

  const [name, setName] = useState(account?.name ?? '')
  const [apiPreset, setApiPreset] = useState(
    account?.apiBaseUrl === 'https://api.github.com' ? 'https://api.github.com' : 'custom'
  )
  const [customApiUrl, setCustomApiUrl] = useState(
    account?.apiBaseUrl !== 'https://api.github.com' ? account?.apiBaseUrl ?? '' : ''
  )
  const [token, setToken] = useState(account?.token ?? '')
  const [validating, setValidating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isEditing = account !== null
  const apiBaseUrl = apiPreset === 'custom' ? customApiUrl : apiPreset

  const validateToken = async (): Promise<ValidationResult> => {
    try {
      const response = await fetch(`${apiBaseUrl}/user`, {
        headers: {
          Authorization: `token ${token}`,
          Accept: 'application/vnd.github.v3+json',
        },
      })

      if (!response.ok) {
        if (response.status === 401) {
          return { success: false, error: 'Invalid token' }
        }
        return { success: false, error: `API error: ${response.status}` }
      }

      const user = await response.json()
      return {
        success: true,
        username: user.login,
        avatarUrl: user.avatar_url,
      }
    } catch (err) {
      return { success: false, error: 'Failed to connect to GitHub' }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!name.trim()) {
      setError('Name is required')
      return
    }

    if (!token.trim()) {
      setError('Token is required')
      return
    }

    if (apiPreset === 'custom' && !customApiUrl.trim()) {
      setError('API URL is required for GitHub Enterprise')
      return
    }

    setValidating(true)
    const result = await validateToken()
    setValidating(false)

    if (!result.success) {
      setError(result.error ?? 'Validation failed')
      return
    }

    const accountData: GitHubAccount = {
      id: account?.id ?? `github-${Date.now()}`,
      type: 'github',
      name: name.trim(),
      apiBaseUrl,
      token: token.trim(),
      username: result.username,
      avatarUrl: result.avatarUrl,
      enabled: true,
      createdAt: account?.createdAt ?? new Date().toISOString(),
      lastValidated: new Date().toISOString(),
    }

    if (isEditing) {
      await updateIntegration(accountData.id, accountData)
      updateIntegrationInStore(accountData.id, accountData)
    } else {
      await addIntegration(accountData)
      addIntegrationToStore(accountData)
    }

    onClose()
  }

  const handleDelete = async () => {
    if (!account) return

    if (confirm('Are you sure you want to delete this account?')) {
      await deleteIntegration(account.id)
      removeIntegrationFromStore(account.id)
      onClose()
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal account-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{isEditing ? 'Edit GitHub Account' : 'Add GitHub Account'}</h2>
          <button className="btn btn-icon btn-ghost" onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="account-form">
          <div className="form-field">
            <label className="form-label">Account Name</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g., Personal, Work"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="form-field">
            <label className="form-label">GitHub Instance</label>
            <select
              className="form-input"
              value={apiPreset}
              onChange={(e) => setApiPreset(e.target.value)}
            >
              {API_PRESETS.map((preset) => (
                <option key={preset.value} value={preset.value}>
                  {preset.label}
                </option>
              ))}
            </select>
          </div>

          {apiPreset === 'custom' && (
            <div className="form-field">
              <label className="form-label">API Base URL</label>
              <input
                type="url"
                className="form-input"
                placeholder="https://github.yourcompany.com/api/v3"
                value={customApiUrl}
                onChange={(e) => setCustomApiUrl(e.target.value)}
              />
              <p className="form-hint">
                For GitHub Enterprise, use: https://[hostname]/api/v3
              </p>
            </div>
          )}

          <div className="form-field">
            <label className="form-label">Personal Access Token</label>
            <input
              type="password"
              className="form-input"
              placeholder="ghp_..."
              value={token}
              onChange={(e) => setToken(e.target.value)}
            />
            <p className="form-hint">
              Create a token with <code>repo</code> scope at GitHub → Settings → Developer settings
            </p>
          </div>

          {error && <div className="form-error">{error}</div>}

          <div className="form-actions">
            {isEditing && (
              <button
                type="button"
                className="btn btn-ghost"
                style={{ color: 'var(--color-error)' }}
                onClick={handleDelete}
              >
                Delete
              </button>
            )}
            <div style={{ flex: 1 }} />
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={validating}>
              {validating ? 'Validating...' : isEditing ? 'Save' : 'Add Account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
