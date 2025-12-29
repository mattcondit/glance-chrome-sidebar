/**
 * Bookmark Widget
 *
 * A simple clickable link tile.
 */

import type { BookmarkWidget as BookmarkWidgetType } from '~/lib/widgets/types'
import './BookmarkWidget.css'

interface Props {
  widget: BookmarkWidgetType
}

export function BookmarkWidget({ widget }: Props) {
  const { url, iconUrl } = widget.settings

  if (!url) {
    return (
      <div className="bookmark-empty">
        <p>No URL configured</p>
      </div>
    )
  }

  const handleClick = () => {
    chrome.tabs.create({ url })
  }

  // Extract domain for display
  let displayUrl = url
  try {
    const urlObj = new URL(url)
    displayUrl = urlObj.hostname
  } catch {
    // Use full URL if parsing fails
  }

  return (
    <button className="bookmark-tile" onClick={handleClick}>
      {iconUrl ? (
        <img src={iconUrl} alt="" className="bookmark-icon" />
      ) : (
        <span className="bookmark-icon-placeholder">🔗</span>
      )}
      <span className="bookmark-url">{displayUrl}</span>
    </button>
  )
}
