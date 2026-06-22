import type { exportAllData } from '../db'

export const DEFAULT_REPO_NAME = 'kage-shadow-vault'
export const STATE_FILE_PATH = 'data/state.json'

export type KageSyncPayload = Awaited<ReturnType<typeof exportAllData>>

export interface GitHubSyncConfig {
  token: string
  username: string
  repoName: string
  /** SHA from GitHub Contents API — required for updates. */
  fileSha?: string
  lastSyncedAt?: string
  lastRemoteAt?: string
}

export type SyncStatus = 'disconnected' | 'idle' | 'syncing' | 'error'

export interface SyncResult {
  ok: boolean
  message: string
  syncedAt?: string
}

export class GitHubSyncError extends Error {
  code: 'auth' | 'rate_limit' | 'offline' | 'repo' | 'network' | 'unknown'

  constructor(
    message: string,
    code: 'auth' | 'rate_limit' | 'offline' | 'repo' | 'network' | 'unknown',
  ) {
    super(message)
    this.name = 'GitHubSyncError'
    this.code = code
  }
}
