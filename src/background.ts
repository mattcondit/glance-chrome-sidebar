/**
 * Glance Background Script
 *
 * Service worker that handles keyboard shortcuts and sidepanel management.
 */

// Open sidepanel when extension icon is clicked
chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error('Error setting panel behavior:', error))

// Handle keyboard commands
chrome.commands.onCommand.addListener(async (command) => {
  if (command === 'open-sidebar') {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
    if (tab?.windowId) {
      await chrome.sidePanel.open({ windowId: tab.windowId })
    }
  }

  if (command === 'tab-switcher') {
    // TODO: Implement tab switcher popup
    console.log('Tab switcher triggered')
  }
})

console.log('Glance background script loaded')
