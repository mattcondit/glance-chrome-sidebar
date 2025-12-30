# Glance

> ⚠️ **Disclaimer**: This project is a work in progress, recreated from a highly personalized working version. Some features may be incomplete or missing.

A customizable Chrome extension sidebar dashboard for GitHub PRs, tabs, and more.

## Features

- **Widget-based UI**: Add and configure different widgets to your sidebar
- **GitHub Integration**: Track PRs, review requests, and drafts across multiple accounts
- **Tab Management**: View tabs grouped by domain
- **Bookmarks**: Quick-access link tiles

## Development

```bash
# Install dependencies
npm install

# Build for production
npm run build

# Development with hot reload
npm run dev
```

After building, load `build/chrome-mv3-prod` as an unpacked extension in Chrome.

## Architecture

See [CLAUDE.md](./CLAUDE.md) for detailed architecture documentation.

## Status

🚧 **Work in Progress** - Core widget system is functional, GitHub data fetching and drag-and-drop not yet implemented.
