/**
 * Glance Store
 *
 * Central state management using Zustand.
 * Stores runtime state for widgets and integrations.
 */

import { create } from 'zustand'
import type { Widget } from './widgets/types'
import type { AnyIntegration } from './integrations/types'

// Widget runtime data (not persisted, fetched from APIs)
export interface WidgetData {
  items: WidgetDataItem[]
  loading: boolean
  lastUpdated?: Date
  error?: string
}

export interface WidgetDataItem {
  id: string
  title: string
  url: string
  subtitle?: string
  status?: string
  statusColor?: string
  updatedAt?: string
}

interface AppState {
  // Integrations
  integrations: AnyIntegration[]
  setIntegrations: (integrations: AnyIntegration[]) => void
  addIntegration: (integration: AnyIntegration) => void
  updateIntegration: (id: string, updates: Partial<AnyIntegration>) => void
  removeIntegration: (id: string) => void

  // Widgets (configuration)
  widgets: Widget[]
  setWidgets: (widgets: Widget[]) => void
  addWidget: (widget: Widget) => void
  updateWidget: (id: string, updates: Partial<Widget>) => void
  removeWidget: (id: string) => void

  // Widget data (runtime state)
  widgetData: Record<string, WidgetData>
  setWidgetData: (widgetId: string, data: Partial<WidgetData>) => void
  setWidgetLoading: (widgetId: string, loading: boolean) => void
  setWidgetError: (widgetId: string, error: string | undefined) => void

  // UI state
  editMode: boolean
  setEditMode: (editMode: boolean) => void
  settingsOpen: boolean
  setSettingsOpen: (open: boolean) => void
  settingsTab: 'general' | 'integrations'
  setSettingsTab: (tab: 'general' | 'integrations') => void
}

export const useStore = create<AppState>((set) => ({
  // Integrations
  integrations: [],
  setIntegrations: (integrations) => set({ integrations }),
  addIntegration: (integration) =>
    set((state) => ({ integrations: [...state.integrations, integration] })),
  updateIntegration: (id, updates) =>
    set((state) => ({
      integrations: state.integrations.map((i) =>
        i.id === id ? { ...i, ...updates } : i
      ) as AnyIntegration[],
    })),
  removeIntegration: (id) =>
    set((state) => ({
      integrations: state.integrations.filter((i) => i.id !== id),
    })),

  // Widgets
  widgets: [],
  setWidgets: (widgets) => set({ widgets }),
  addWidget: (widget) =>
    set((state) => ({ widgets: [...state.widgets, widget] })),
  updateWidget: (id, updates) =>
    set((state) => ({
      widgets: state.widgets.map((w) =>
        w.id === id ? { ...w, ...updates } : w
      ) as Widget[],
    })),
  removeWidget: (id) =>
    set((state) => ({
      widgets: state.widgets.filter((w) => w.id !== id),
    })),

  // Widget data
  widgetData: {},
  setWidgetData: (widgetId, data) =>
    set((state) => ({
      widgetData: {
        ...state.widgetData,
        [widgetId]: { ...state.widgetData[widgetId], ...data },
      },
    })),
  setWidgetLoading: (widgetId, loading) =>
    set((state) => ({
      widgetData: {
        ...state.widgetData,
        [widgetId]: {
          ...state.widgetData[widgetId],
          items: state.widgetData[widgetId]?.items ?? [],
          loading,
        },
      },
    })),
  setWidgetError: (widgetId, error) =>
    set((state) => ({
      widgetData: {
        ...state.widgetData,
        [widgetId]: {
          ...state.widgetData[widgetId],
          items: state.widgetData[widgetId]?.items ?? [],
          loading: false,
          error,
        },
      },
    })),

  // UI state
  editMode: false,
  setEditMode: (editMode) => set({ editMode }),
  settingsOpen: false,
  setSettingsOpen: (settingsOpen) => set({ settingsOpen }),
  settingsTab: 'general',
  setSettingsTab: (settingsTab) => set({ settingsTab }),
}))
