/**
 * Widget Registry
 *
 * Defines available widget types and their metadata for the widget gallery.
 */

import type { WidgetDefinition, WidgetType, GitHubPRWidgetSettings, BookmarkWidgetSettings, TabGroupsWidgetSettings } from './types'

export const WIDGET_REGISTRY: Record<WidgetType, WidgetDefinition> = {
  'github-prs': {
    type: 'github-prs',
    name: 'GitHub PRs',
    description: 'Track pull requests, review requests, and drafts',
    icon: '🔔',
    defaultSize: { width: 2, height: 2 },
    defaultSettings: {
      accountIds: [],
      filterMode: 'form',
      formFilters: {
        prTypes: ['review-requested'],
        states: ['open'],
        teams: [],
        repos: [],
        labels: [],
      },
      rawQuery: 'type:pr state:open review-requested:@me',
      showBuildStatus: true,
      sortBy: 'updated',
    } satisfies GitHubPRWidgetSettings,
  },
  'bookmark': {
    type: 'bookmark',
    name: 'Bookmark',
    description: 'Quick link to any URL',
    icon: '🔗',
    defaultSize: { width: 1, height: 1 },
    defaultSettings: {
      url: '',
      iconUrl: undefined,
    } satisfies BookmarkWidgetSettings,
  },
  'tab-groups': {
    type: 'tab-groups',
    name: 'Tab Groups',
    description: 'View and manage tabs grouped by domain',
    icon: '📑',
    defaultSize: { width: 2, height: 2 },
    defaultSettings: {
      showBookmarks: true,
      groupByDomain: true,
    } satisfies TabGroupsWidgetSettings,
  },
}

export function getWidgetDefinition(type: WidgetType): WidgetDefinition {
  return WIDGET_REGISTRY[type]
}

export function getAllWidgetDefinitions(): WidgetDefinition[] {
  return Object.values(WIDGET_REGISTRY)
}
