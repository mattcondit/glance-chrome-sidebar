/**
 * Widget Container
 *
 * Wrapper for individual widgets. Shows edit controls in edit mode.
 */

import { useStore } from '~/lib/store'
import { deleteWidget } from '~/lib/widgets/storage'
import { getWidgetDefinition } from '~/lib/widgets/registry'
import type { Widget } from '~/lib/widgets/types'
import { GitHubPRsWidget } from './GitHubPRsWidget'
import { BookmarkWidget } from './BookmarkWidget'
import { TabGroupsWidget } from './TabGroupsWidget'
import './WidgetContainer.css'

interface Props {
  widget: Widget
}

export function WidgetContainer({ widget }: Props) {
  const editMode = useStore((state) => state.editMode)
  const removeWidget = useStore((state) => state.removeWidget)
  const updateWidget = useStore((state) => state.updateWidget)
  const definition = getWidgetDefinition(widget.type)

  const handleDelete = async () => {
    await deleteWidget(widget.id)
    removeWidget(widget.id)
  }

  const handleToggleCollapse = () => {
    updateWidget(widget.id, { collapsed: !widget.collapsed })
  }

  const renderWidgetContent = () => {
    switch (widget.type) {
      case 'github-prs':
        return <GitHubPRsWidget widget={widget} />
      case 'bookmark':
        return <BookmarkWidget widget={widget} />
      case 'tab-groups':
        return <TabGroupsWidget widget={widget} />
      default:
        return <div>Unknown widget type</div>
    }
  }

  return (
    <div className={`widget-container ${editMode ? 'edit-mode' : ''}`}>
      {editMode && (
        <div className="widget-edit-controls">
          <button className="widget-drag-handle" title="Drag to reorder">
            ☰
          </button>
          <button
            className="widget-delete-btn"
            onClick={handleDelete}
            title="Delete widget"
          >
            ✕
          </button>
        </div>
      )}

      <div className="widget-header" onClick={handleToggleCollapse}>
        <span className="widget-icon">{definition.icon}</span>
        <h3 className="widget-title">{widget.name}</h3>
        <span className="widget-collapse-icon">
          {widget.collapsed ? '▶' : '▼'}
        </span>
      </div>

      {!widget.collapsed && (
        <div className="widget-content">{renderWidgetContent()}</div>
      )}
    </div>
  )
}
