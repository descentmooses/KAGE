import { getDb } from '../db'
import type { GitHubSyncConfig } from './types'

const META_KEY = 'github-sync'

export async function getGitHubSyncConfig(): Promise<GitHubSyncConfig | null> {
  const db = await getDb()
  return (await db.get('meta', META_KEY)) as GitHubSyncConfig | null
}

export async function putGitHubSyncConfig(config: GitHubSyncConfig): Promise<void> {
  const db = await getDb()
  await db.put('meta', config, META_KEY)
}

export async function clearGitHubSyncConfig(): Promise<void> {
  const db = await getDb()
  await db.delete('meta', META_KEY)
}
