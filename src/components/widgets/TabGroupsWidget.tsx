/**
 * Tab Groups Widget
 *
 * Displays open tabs grouped by domain.
 */

import { useEffect, useState } from 'react'
import type { TabGroupsWidget as TabGroupsWidgetType } from '~/lib/widgets/types'
import './SharedWidgetStyles.css'

interface TabInfo {
  id: number
  title: string
  url: string
  favIconUrl?: string
}

interface TabGroup {
  domain: string
  tabs: TabInfo[]
}

interface Props {
  widget: TabGroupsWidgetType
}

export function TabGroupsWidget({ widget }: Props) {
  const [tabGroups, setTabGroups] = useState<TabGroup[]>([])
  const [loading, setLoading] = useState(true)
  const [collapsedDomains, setCollapsedDomains] = useState<Set<string>>(new Set())

  useEffect(() => {
    async function loadTabs() {
      try {
        const tabs = await chrome.tabs.query({ currentWindow: true })
        const groups = groupTabsByDomain(tabs)
        setTabGroups(groups)
      } catch (error) {
        console.error('Error loading tabs:', error)
      } finally {
        setLoading(false)
      }
    }

    loadTabs()

    // Listen for tab changes
    const handleTabUpdate = () => loadTabs()
    chrome.tabs.onCreated.addListener(handleTabUpdate)
    chrome.tabs.onRemoved.addListener(handleTabUpdate)
    chrome.tabs.onUpdated.addListener(handleTabUpdate)

    return () => {
      chrome.tabs.onCreated.removeListener(handleTabUpdate)
      chrome.tabs.onRemoved.removeListener(handleTabUpdate)
      chrome.tabs.onUpdated.removeListener(handleTabUpdate)
    }
  }, [])

  const groupTabsByDomain = (tabs: chrome.tabs.Tab[]): TabGroup[] => {
    const groupMap = new Map<string, TabInfo[]>()

    for (const tab of tabs) {
      if (!tab.url || !tab.id) continue

      let domain = 'other'
      try {
        domain = new URL(tab.url).hostname
      } catch {
        // Skip invalid URLs
        continue
      }

      const tabInfo: TabInfo = {
        id: tab.id,
        title: tab.title || 'Untitled',
        url: tab.url,
        favIconUrl: tab.favIconUrl,
      }

      const existing = groupMap.get(domain) || []
      existing.push(tabInfo)
      groupMap.set(domain, existing)
    }

    return Array.from(groupMap.entries())
      .map(([domain, tabs]) => ({ domain, tabs }))
      .sort((a, b) => a.domain.localeCompare(b.domain))
  }

  const handleTabClick = async (tabId: number) => {
    await chrome.tabs.update(tabId, { active: true })
  }

  const handleCloseTab = async (tabId: number, e: React.MouseEvent) => {
    e.stopPropagation()
    await chrome.tabs.remove(tabId)
  }

  const toggleDomain = (domain: string) => {
    setCollapsedDomains((prev) => {
      const next = new Set(prev)
      if (next.has(domain)) {
        next.delete(domain)
      } else {
        next.add(domain)
      }
      return next
    })
  }

  if (loading) {
    return (
      <div className="widget-loading">
        <span className="loading-spinner" />
        <span>Loading tabs...</span>
      </div>
    )
  }

  if (tabGroups.length === 0) {
    return (
      <div className="widget-empty-state">
        <p>No tabs open</p>
      </div>
    )
  }

  return (
    <div className="tab-groups">
      {tabGroups.map((group) => (
        <div key={group.domain} className="tab-group">
          <button
            className="tab-group-header"
            onClick={() => toggleDomain(group.domain)}
          >
            <span className="tab-group-collapse">
              {collapsedDomains.has(group.domain) ? '▶' : '▼'}
            </span>
            <span className="tab-group-domain">{group.domain}</span>
            <span className="tab-group-count">{group.tabs.length}</span>
          </button>

          {!collapsedDomains.has(group.domain) && (
            <div className="tab-group-tabs">
              {group.tabs.map((tab) => (
                <div
                  key={tab.id}
                  className="tab-item"
                  onClick={() => handleTabClick(tab.id)}
                >
                  {tab.favIconUrl && (
                    <img
                      src={tab.favIconUrl}
                      alt=""
                      className="tab-favicon"
                    />
                  )}
                  <span className="tab-title">{tab.title}</span>
                  <button
                    className="tab-close"
                    onClick={(e) => handleCloseTab(tab.id, e)}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
