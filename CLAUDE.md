# CLAUDE.md

This file provides guidance to Claude Code when working with code in this repository.

## Project Overview

**Glance** is a customizable Chrome extension sidebar dashboard built with [Plasmo](https://docs.plasmo.com/), React, TypeScript, and Zustand. It features a widget-based architecture where users can add, configure, and arrange different widgets.

> This project is a work in progress, recreated from the [original prototype](https://github.com/mattcondit/sidebar-manager-chrome) that was built for personal use.

### Key Features (Planned)
- **Widget System**: Modular, configurable tiles (GitHub PRs, bookmarks, tab groups, etc.)
- **Multi-Account GitHub Integration**: Connect multiple GitHub accounts (personal, work, GHE)
- **Tab Management**: Grouped tabs by domain, quick tab switcher
- **Drag-and-Drop Layout**: Reorder widgets with @dnd-kit (not yet implemented)

## Development Commands

```bash
# Install dependencies
npm install

# Production build (load build/chrome-mv3-prod as unpacked extension)
npm run build

# Development with hot reload
npm run dev
```

## Architecture

### Core Concepts

```
INTEGRATIONS (auth + data sources)
├── GitHub Account 1 (personal)
├── GitHub Account 2 (work GHE)
└── Future: Calendar, etc.
        │
        ▼
WIDGETS (configurable tiles using integrations)
├── GitHub PR Widget (uses Account 1 + 2)
├── Bookmark Widget
└── Tab Groups Widget
        │
        ▼
WIDGET GRID (layout container)
└── Renders widgets in order, edit mode for customization
```

### Directory Structure

```
src/
├── background.ts              # Service worker (keyboard shortcuts, sidepanel)
├── sidepanel.tsx              # Main entry point for sidebar UI
│
├── lib/
│   ├── store.ts               # Zustand store (runtime state)
│   ├── integrations/
│   │   ├── types.ts           # Integration interfaces (GitHubAccount, etc.)
│   │   └── storage.ts         # Chrome storage CRUD for integrations
│   ├── settings/
│   │   ├── types.ts           # App settings interfaces (theme, etc.)
│   │   ├── storage.ts         # Chrome storage CRUD for settings
│   │   └── themes.ts          # Theme definitions and CSS variable application
│   └── widgets/
│       ├── types.ts           # Widget interfaces (GitHubPRWidget, etc.)
│       ├── storage.ts         # Chrome storage CRUD for widgets
│       └── registry.ts        # Widget type definitions for gallery
│
├── components/
│   ├── Header.tsx             # App header with edit/settings buttons
│   ├── widgets/
│   │   ├── WidgetGrid.tsx     # Main widget container
│   │   ├── WidgetContainer.tsx # Individual widget wrapper
│   │   ├── WidgetGallery.tsx  # Modal for adding widgets
│   │   ├── AddWidgetCard.tsx  # "Add Widget" button in edit mode
│   │   ├── GitHubPRsWidget.tsx # GitHub PR display (needs data fetching)
│   │   ├── BookmarkWidget.tsx # Simple link tile
│   │   └── TabGroupsWidget.tsx # Tabs grouped by domain
│   └── settings/
│       ├── Settings.tsx       # Settings modal container
│       ├── GeneralTab.tsx     # General settings
│       ├── IntegrationsTab.tsx # List of connected accounts
│       └── GitHubAccountModal.tsx # Add/edit GitHub account
│
└── styles/
    └── global.css             # CSS variables, base styles
```

### State Management

**Zustand Store** (`src/lib/store.ts`):
- `integrations`: Connected accounts (GitHubAccount[])
- `widgets`: Widget configurations (Widget[])
- `widgetData`: Runtime data per widget (items, loading, error)
- `editMode`: Layout editing toggle
- `settingsOpen`, `settingsTab`: Settings modal state
- `settings`: App-wide settings (theme, etc.)

**Chrome Storage** (persisted):
- `glance_integrations`: Integration configs with tokens
- `glance_widgets`: Widget configs with settings
- `glance_settings`: App settings (theme selection)

### Key Interfaces

```typescript
// Integration (e.g., GitHub account)
interface GitHubAccount {
  id: string
  type: 'github'
  name: string              // "Personal", "Work"
  apiBaseUrl: string        // "https://api.github.com"
  token: string
  username?: string         // Fetched on validation
  enabled: boolean
}

// Widget configuration
interface Widget {
  id: string
  type: 'github-prs' | 'bookmark' | 'tab-groups'
  name: string
  position: { x: number, y: number }
  size: { width: number, height: number }
  enabled: boolean
  collapsed: boolean
  settings: WidgetTypeSpecificSettings
}

// GitHub widget settings
interface GitHubPRWidgetSettings {
  accountIds: string[]           // Which accounts to query
  filterMode: 'form' | 'raw'
  formFilters: {
    prTypes: ('review-requested' | 'authored' | 'draft' | 'team-review')[]
    states: ('open' | 'closed')[]
    teams: string[]
    repos: string[]
  }
  rawQuery: string               // For power users
}
```

## Implementation Status

### Completed ✅
- Project setup with Plasmo, React, TypeScript, Zustand
- Core type definitions (integrations, widgets)
- Storage layer (chrome.storage.local helpers)
- Widget registry for extensibility
- Basic UI shell (header, widget grid, settings modal)
- GitHub account management (add/edit/delete with token validation)
- Widget gallery (add new widgets)
- Edit mode (delete widgets, collapse/expand)
- Tab Groups widget (functional - displays tabs by domain)
- Bookmark widget (functional - clickable link tile)
- Background service worker (keyboard shortcuts)
- **Theme system**: 5 color themes (Midnight, Ocean, Forest, Sunset, Monochrome)
- **Settings persistence**: App settings stored in Chrome storage
- **Sidebar position UI**: Link to Chrome settings for left/right positioning

### In Progress 🔄
- None currently

### Not Started ❌
- **GitHub data fetching**: API calls, polling, rate limiting
- **GitHub filter builder**: Form UI for configuring PR filters
- **Drag-and-drop**: @dnd-kit integration for reordering widgets
- **Widget sizing**: Allow different widget sizes in grid
- **Tab switcher popup**: Quick tab switching (Cmd+D)
- **Widget settings modal**: Per-widget configuration UI

## Adding a New Widget Type

1. Add type to `WidgetType` union in `src/lib/widgets/types.ts`
2. Create settings interface (e.g., `MyWidgetSettings`)
3. Create widget interface extending `BaseWidget`
4. Add to `Widget` union type
5. Register in `WIDGET_REGISTRY` in `src/lib/widgets/registry.ts`
6. Create component in `src/components/widgets/`
7. Add case to `renderWidgetContent()` in `WidgetContainer.tsx`

## Adding a New Integration Type

1. Add type to `IntegrationType` in `src/lib/integrations/types.ts`
2. Create integration interface (e.g., `LinearAccount`)
3. Add to `AnyIntegration` union type
4. Create account modal in `src/components/settings/`
5. Add section to `IntegrationsTab.tsx`

## CSS Conventions

- CSS variables defined in `src/styles/global.css`
- Component styles in co-located `.css` files
- BEM-like naming: `.widget-container`, `.widget-header`, etc.
- Color scheme: Configurable via themes (default: Midnight with indigo accent)

## Theme System

Themes are defined in `src/lib/settings/themes.ts`. Each theme provides:
- Background colors (primary, secondary, elevated)
- Text colors (primary, secondary, muted)
- Accent color (primary with hover and muted variants)
- Status colors (success, warning, error)

Available themes:
- **Midnight** (default): Dark blue with indigo accent
- **Ocean**: Slate blue with cyan accent
- **Forest**: Dark green with green accent
- **Sunset**: Dark brown/red with orange accent
- **Monochrome**: Pure grayscale with white accent

To add a new theme:
1. Add theme ID to `ThemeId` type in `src/lib/settings/types.ts`
2. Add theme definition to `THEMES` object in `src/lib/settings/themes.ts`
