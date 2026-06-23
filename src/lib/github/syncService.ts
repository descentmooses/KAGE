import { exportAllData, importAllData } from '../db'
import {
  ensurePrivateRepo,
  fetchRemoteState,
  pushRemoteState,
  validateToken,
} from './githubApi'
import {
  clearGitHubSyncConfig,
  getGitHubSyncConfig,
  putGitHubSyncConfig,
} from './githubSyncStorage'
import { mergeSyncPayloads } from './mergeState'
import { DEFAULT_REPO_NAME, GitHubSyncError, type KageSyncPayload, type SyncResult } from './types'

function assertOnline(): void {
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    throw new GitHubSyncError('You are offline. Changes stay safe on this device.', 'offline')
  }
}

export async function connectGitHub(token: string, repoName = DEFAULT_REPO_NAME): Promise<string> {
  assertOnline()
  const trimmed = token.trim()
  if (!trimmed) throw new GitHubSyncError('Paste your GitHub token to connect.', 'auth')

  const user = await validateToken(trimmed)
  await ensurePrivateRepo(trimmed, user.login, repoName)

  const local = await exportAllData()
  const json = JSON.stringify(local, null, 2)

  let fileSha: string | undefined
  const remote = await fetchRemoteState(trimmed, user.login, repoName)
  if (remote) {
    const remotePayload = JSON.parse(remote.content) as KageSyncPayload
    const merged = mergeSyncPayloads(local, remotePayload)
    const mergedJson = JSON.stringify(merged, null, 2)
    const pushed = await pushRemoteState(trimmed, user.login, repoName, mergedJson, remote.sha)
    fileSha = pushed.sha
    await importAllData(merged)
  } else {
    const pushed = await pushRemoteState(trimmed, user.login, repoName, json)
    fileSha = pushed.sha
  }

  const syncedAt = new Date().toISOString()
  await putGitHubSyncConfig({
    token: trimmed,
    username: user.login,
    repoName,
    fileSha,
    lastSyncedAt: syncedAt,
    lastRemoteAt: syncedAt,
  })

  return user.login
}

export async function disconnectGitHub(): Promise<void> {
  await clearGitHubSyncConfig()
}

export async function syncToGitHub(): Promise<SyncResult> {
  assertOnline()
  const config = await getGitHubSyncConfig()
  if (!config) {
    return { ok: false, message: 'GitHub is not connected.' }
  }

  try {
    const local = await exportAllData()
    const remote = await fetchRemoteState(config.token, config.username, config.repoName)

    let payload = local
    let sha = config.fileSha

    if (remote) {
      const remotePayload = JSON.parse(remote.content) as KageSyncPayload
      payload = mergeSyncPayloads(local, remotePayload)
      sha = remote.sha
      await importAllData(payload)
    }

    const json = JSON.stringify(payload, null, 2)
    const pushed = await pushRemoteState(
      config.token,
      config.username,
      config.repoName,
      json,
      sha,
    )

    const syncedAt = pushed.syncedAt
    await putGitHubSyncConfig({
      ...config,
      fileSha: pushed.sha,
      lastSyncedAt: syncedAt,
      lastRemoteAt: payload.exportedAt,
    })

    return { ok: true, message: 'Shadow vault synced to GitHub.', syncedAt }
  } catch (err) {
    if (err instanceof GitHubSyncError) {
      return { ok: false, message: err.message }
    }
    return { ok: false, message: 'Sync failed unexpectedly. Your local data is safe.' }
  }
}

export async function pullFromGitHub(): Promise<SyncResult & { merged?: boolean }> {
  assertOnline()
  const config = await getGitHubSyncConfig()
  if (!config) {
    return { ok: false, message: 'GitHub is not connected.' }
  }

  try {
    const remote = await fetchRemoteState(config.token, config.username, config.repoName)
    if (!remote) {
      return { ok: true, message: 'No remote vault yet — local data is current.', syncedAt: config.lastSyncedAt }
    }

    const remotePayload = JSON.parse(remote.content) as KageSyncPayload
    const local = await exportAllData()
    const merged = mergeSyncPayloads(local, remotePayload)
    await importAllData(merged)

    const syncedAt = new Date().toISOString()
    await putGitHubSyncConfig({
      ...config,
      fileSha: remote.sha,
      lastSyncedAt: syncedAt,
      lastRemoteAt: remote.updatedAt,
    })

    return {
      ok: true,
      message: 'Pulled latest shadow vault from GitHub.',
      syncedAt,
      merged: true,
    }
  } catch (err) {
    if (err instanceof GitHubSyncError) {
      return { ok: false, message: err.message }
    }
    return { ok: false, message: 'Pull failed unexpectedly. Local data unchanged.' }
  }
}

export function formatLastSynced(iso?: string): string {
  if (!iso) return 'Never'
  const diff = Date.now() - Date.parse(iso)
  if (diff < 60_000) return 'Just now'
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)} min ago`
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)} hr ago`
  return new Date(iso).toLocaleDateString()
}
