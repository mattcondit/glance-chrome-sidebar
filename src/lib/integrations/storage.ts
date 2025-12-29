/**
 * Integration Storage
 *
 * Handles persistence of integration configurations to chrome.storage.local
 */

import type { AnyIntegration, IntegrationsStorage } from './types'

const STORAGE_KEY = 'glance_integrations'

export async function getIntegrations(): Promise<AnyIntegration[]> {
  const result = await chrome.storage.local.get(STORAGE_KEY)
  const data = result[STORAGE_KEY] as IntegrationsStorage | undefined
  return data?.integrations ?? []
}

export async function saveIntegrations(integrations: AnyIntegration[]): Promise<void> {
  const data: IntegrationsStorage = { integrations }
  await chrome.storage.local.set({ [STORAGE_KEY]: data })
}

export async function addIntegration(integration: AnyIntegration): Promise<void> {
  const integrations = await getIntegrations()
  integrations.push(integration)
  await saveIntegrations(integrations)
}

export async function updateIntegration(
  id: string,
  updates: Partial<AnyIntegration>
): Promise<void> {
  const integrations = await getIntegrations()
  const index = integrations.findIndex((i) => i.id === id)
  if (index !== -1) {
    integrations[index] = { ...integrations[index], ...updates } as AnyIntegration
    await saveIntegrations(integrations)
  }
}

export async function deleteIntegration(id: string): Promise<void> {
  const integrations = await getIntegrations()
  const filtered = integrations.filter((i) => i.id !== id)
  await saveIntegrations(filtered)
}

export async function getIntegration(id: string): Promise<AnyIntegration | undefined> {
  const integrations = await getIntegrations()
  return integrations.find((i) => i.id === id)
}
