/**
 * GitHub PRs Widget
 *
 * Displays pull requests from connected GitHub accounts.
 */

import { useStore } from '~/lib/store'
import type { GitHubPRWidget } from '~/lib/widgets/types'
import './SharedWidgetStyles.css'

interface Props {
  widget: GitHubPRWidget
}

export function GitHubPRsWidget({ widget }: Props) {
  const integrations = useStore((state) => state.integrations)
  const widgetData = useStore((state) => state.widgetData[widget.id])

  const githubAccounts = integrations.filter((i) => i.type === 'github')
  const hasAccounts = githubAccounts.length > 0
  const hasConfiguredAccounts = widget.settings.accountIds.length > 0

  if (!hasAccounts) {
    return (
      <div className="widget-empty-state">
        <p>No GitHub accounts connected</p>
        <p className="text-muted">Add a GitHub account in Settings</p>
      </div>
    )
  }

  if (!hasConfiguredAccounts) {
    return (
      <div className="widget-empty-state">
        <p>No accounts selected</p>
        <p className="text-muted">Configure this widget to select accounts</p>
      </div>
    )
  }

  if (widgetData?.loading) {
    return (
      <div className="widget-loading">
        <span className="loading-spinner" />
        <span>Loading PRs...</span>
      </div>
    )
  }

  if (widgetData?.error) {
    return (
      <div className="widget-error">
        <p>Error: {widgetData.error}</p>
      </div>
    )
  }

  const items = widgetData?.items ?? []

  if (items.length === 0) {
    return (
      <div className="widget-empty-state">
        <p>No PRs found</p>
      </div>
    )
  }

  return (
    <div className="widget-list">
      {items.map((item) => (
        <a
          key={item.id}
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="widget-list-item"
        >
          <div className="widget-list-item-content">
            <span className="widget-list-item-title">{item.title}</span>
            {item.subtitle && (
              <span className="widget-list-item-subtitle">{item.subtitle}</span>
            )}
          </div>
          {item.status && (
            <span
              className="widget-list-item-status"
              style={{ color: item.statusColor }}
            >
              {item.status}
            </span>
          )}
        </a>
      ))}
    </div>
  )
}
