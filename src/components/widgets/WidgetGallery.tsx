/**
 * Widget Gallery
 *
 * Modal for selecting a widget type to add.
 */

import { useStore } from '~/lib/store'
import { getAllWidgetDefinitions, getWidgetDefinition } from '~/lib/widgets/registry'
import { addWidget } from '~/lib/widgets/storage'
import type { Widget, WidgetType } from '~/lib/widgets/types'
import './WidgetGallery.css'

interface Props {
  onClose: () => void
}

export function WidgetGallery({ onClose }: Props) {
  const widgets = useStore((state) => state.widgets)
  const storeAddWidget = useStore((state) => state.addWidget)
  const definitions = getAllWidgetDefinitions()

  const handleAddWidget = async (type: WidgetType) => {
    const definition = getWidgetDefinition(type)

    const newWidget: Widget = {
      id: `widget-${Date.now()}`,
      type,
      name: definition.name,
      position: { x: 0, y: widgets.length },
      size: definition.defaultSize,
      enabled: true,
      collapsed: false,
      createdAt: new Date().toISOString(),
      settings: definition.defaultSettings,
    } as Widget

    await addWidget(newWidget)
    storeAddWidget(newWidget)
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal widget-gallery-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add Widget</h2>
          <button className="btn btn-icon btn-ghost" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="widget-gallery-grid">
          {definitions.map((definition) => (
            <button
              key={definition.type}
              className="widget-gallery-item"
              onClick={() => handleAddWidget(definition.type)}
            >
              <span className="widget-gallery-icon">{definition.icon}</span>
              <span className="widget-gallery-name">{definition.name}</span>
              <span className="widget-gallery-desc">{definition.description}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
