/**
 * Widget Grid
 *
 * Main container for widgets with CSS Grid layout.
 * Handles drag-and-drop reordering when in edit mode.
 */

import { useStore } from '~/lib/store'
import { WidgetContainer } from './WidgetContainer'
import { AddWidgetCard } from './AddWidgetCard'
import './WidgetGrid.css'

export function WidgetGrid() {
  const widgets = useStore((state) => state.widgets)
  const editMode = useStore((state) => state.editMode)

  const enabledWidgets = widgets.filter((w) => w.enabled)

  return (
    <div className="widget-grid">
      {enabledWidgets.length === 0 && !editMode ? (
        <div className="widget-grid-empty">
          <p>No widgets yet</p>
          <p className="text-muted">Click the edit button to add widgets</p>
        </div>
      ) : (
        <>
          {enabledWidgets.map((widget) => (
            <WidgetContainer key={widget.id} widget={widget} />
          ))}
          {editMode && <AddWidgetCard />}
        </>
      )}
    </div>
  )
}
