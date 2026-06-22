import { createContext, useContext } from 'react'
import type { SyncStatus } from '../lib/github/types'

export interface GitHubSyncContextValue {
  connected: boolean
  username: string | null
  repoName: string | null
  lastSyncedAt: string | null
  status: SyncStatus
  statusMessage: string | null
  connectOpen: boolean
  openConnect: () => void
  closeConnect: () => void
  connect: (token: string) => Promise<void>
  disconnect: () => Promise<void>
  syncNow: () => Promise<void>
  pullNow: () => Promise<void>
}

export const GitHubSyncContext = createContext<GitHubSyncContextValue | null>(null)

export function useGitHubSync() {
  const ctx = useContext(GitHubSyncContext)
  if (!ctx) throw new Error('useGitHubSync must be used within GitHubSyncProvider')
  return ctx
}

/** Safe hook for optional sync UI outside the provider tree edge cases. */
export function useGitHubSyncOptional() {
  return useContext(GitHubSyncContext)
}
