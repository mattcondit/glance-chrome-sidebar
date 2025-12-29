/**
 * Widget Storage
 *
 * Handles persistence of widget configurations to chrome.storage.local
 */

import type { Widget, WidgetsStorage } from './types'

const STORAGE_KEY = 'glance_widgets'

export async function getWidgets(): Promise<Widget[]> {
  const result = await chrome.storage.local.get(STORAGE_KEY)
  const data = result[STORAGE_KEY] as WidgetsStorage | undefined
  return data?.widgets ?? []
}

export async function saveWidgets(widgets: Widget[]): Promise<void> {
  const data: WidgetsStorage = { widgets }
  await chrome.storage.local.set({ [STORAGE_KEY]: data })
}

export async function addWidget(widget: Widget): Promise<void> {
  const widgets = await getWidgets()
  widgets.push(widget)
  await saveWidgets(widgets)
}

export async function updateWidget(
  id: string,
  updates: Partial<Widget>
): Promise<void> {
  const widgets = await getWidgets()
  const index = widgets.findIndex((w) => w.id === id)
  if (index !== -1) {
    widgets[index] = { ...widgets[index], ...updates } as Widget
    await saveWidgets(widgets)
  }
}

export async function deleteWidget(id: string): Promise<void> {
  const widgets = await getWidgets()
  const filtered = widgets.filter((w) => w.id !== id)
  await saveWidgets(filtered)
}

export async function reorderWidgets(widgetIds: string[]): Promise<void> {
  const widgets = await getWidgets()
  const reordered = widgetIds
    .map((id) => widgets.find((w) => w.id === id))
    .filter((w): w is Widget => w !== undefined)

  // Update positions based on new order
  reordered.forEach((widget, index) => {
    widget.position = { x: 0, y: index }
  })

  await saveWidgets(reordered)
}
