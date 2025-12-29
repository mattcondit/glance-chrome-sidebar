/**
 * Glance Sidepanel
 *
 * Main entry point for the Chrome side panel.
 */

import { useEffect } from 'react'
import { Header } from '~/components/Header'
import { WidgetGrid } from '~/components/widgets/WidgetGrid'
import { Settings } from '~/components/settings/Settings'
import { useStore } from '~/lib/store'
import { getWidgets } from '~/lib/widgets/storage'
import { getIntegrations } from '~/lib/integrations/storage'

import './styles/global.css'

export default function Sidepanel() {
  const setWidgets = useStore((state) => state.setWidgets)
  const setIntegrations = useStore((state) => state.setIntegrations)
  const settingsOpen = useStore((state) => state.settingsOpen)

  // Load widgets and integrations on mount
  useEffect(() => {
    async function loadData() {
      const [widgets, integrations] = await Promise.all([
        getWidgets(),
        getIntegrations(),
      ])
      setWidgets(widgets)
      setIntegrations(integrations)
    }
    loadData()
  }, [setWidgets, setIntegrations])

  return (
    <div className="app-container">
      <Header />
      <main className="main-content">
        <WidgetGrid />
      </main>
      {settingsOpen && <Settings />}
    </div>
  )
}
