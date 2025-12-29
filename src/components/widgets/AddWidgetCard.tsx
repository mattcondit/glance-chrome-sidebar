/**
 * Add Widget Card
 *
 * Shown in edit mode to allow adding new widgets.
 */

import { useState } from 'react'
import { WidgetGallery } from './WidgetGallery'
import './AddWidgetCard.css'

export function AddWidgetCard() {
  const [showGallery, setShowGallery] = useState(false)

  return (
    <>
      <button className="add-widget-card" onClick={() => setShowGallery(true)}>
        <span className="add-widget-icon">+</span>
        <span className="add-widget-text">Add Widget</span>
      </button>

      {showGallery && <WidgetGallery onClose={() => setShowGallery(false)} />}
    </>
  )
}
