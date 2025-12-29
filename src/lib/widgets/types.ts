/**
 * Widget Types
 *
 * Widgets are configurable tiles that display in the sidebar grid.
 * Each widget has a type, position, size, and type-specific settings.
 */

export type WidgetType = 'github-prs' | 'bookmark' | 'tab-groups'

// Grid position (0-indexed)
export interface WidgetPosition {
  x: number  // Column (0-based, max depends on grid columns)
  y: number  // Row (0-based)
}

// Widget size in grid units
export interface WidgetSize {
  width: number   // 1-4 columns
  height: number  // 1-4 rows
}

// Base widget configuration
export interface BaseWidget {
  id: string
  type: WidgetType
  name: string
  position: WidgetPosition
  size: WidgetSize
  enabled: boolean
  collapsed: boolean
  createdAt: string
}

// GitHub PR widget settings
export interface GitHubPRWidgetSettings {
  accountIds: string[]  // Which GitHub accounts to query
  filterMode: 'form' | 'raw'
  formFilters: GitHubFormFilters
  rawQuery: string
  showBuildStatus: boolean
  sortBy: 'updated' | 'created'
}

export interface GitHubFormFilters {
  prTypes: GitHubPRType[]
  states: ('open' | 'closed')[]
  teams: string[]
  repos: string[]
  labels: string[]
}

export type GitHubPRType =
  | 'review-requested'  // PRs requesting my review
  | 'authored'          // PRs I created
  | 'draft'             // My draft PRs
  | 'team-review'       // PRs requesting team review

export interface GitHubPRWidget extends BaseWidget {
  type: 'github-prs'
  settings: GitHubPRWidgetSettings
}

// Bookmark widget settings
export interface BookmarkWidgetSettings {
  url: string
  iconUrl?: string
}

export interface BookmarkWidget extends BaseWidget {
  type: 'bookmark'
  settings: BookmarkWidgetSettings
}

// Tab groups widget settings
export interface TabGroupsWidgetSettings {
  showBookmarks: boolean
  groupByDomain: boolean
}

export interface TabGroupsWidget extends BaseWidget {
  type: 'tab-groups'
  settings: TabGroupsWidgetSettings
}

// Union of all widget types
export type Widget = GitHubPRWidget | BookmarkWidget | TabGroupsWidget

// Storage shape
export interface WidgetsStorage {
  widgets: Widget[]
}

// Widget registry metadata (for widget gallery)
export interface WidgetDefinition {
  type: WidgetType
  name: string
  description: string
  icon: string
  defaultSize: WidgetSize
  defaultSettings: unknown
}
