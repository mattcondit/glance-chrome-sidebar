/**
 * Integration Types
 *
 * Integrations are external services (GitHub, etc.) that can be connected
 * to provide data for widgets. Each integration type can have multiple
 * accounts (e.g., personal GitHub + work GitHub).
 */

export type IntegrationType = 'github'

export interface Integration {
  id: string
  type: IntegrationType
  name: string
  enabled: boolean
  createdAt: string
}

// GitHub-specific integration
export interface GitHubAccount extends Integration {
  type: 'github'
  apiBaseUrl: string  // e.g., "https://api.github.com" or GHE URL
  token: string
  username?: string   // Fetched from /user endpoint after validation
  avatarUrl?: string
  lastValidated?: string
  validationError?: string
}

export type AnyIntegration = GitHubAccount

// Storage shape
export interface IntegrationsStorage {
  integrations: AnyIntegration[]
}

// Validation result
export interface ValidationResult {
  success: boolean
  username?: string
  avatarUrl?: string
  error?: string
}
