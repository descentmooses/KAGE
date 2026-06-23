import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { GitHubSyncContext } from './githubSyncContext'
import { GitHubConnectModal } from '../features/sync/GitHubConnectModal'
import { GitHubFirstLogSheet } from '../features/sync/GitHubFirstLogSheet'
import { getGitHubSyncConfig } from '../lib/github/githubSyncStorage'
import {
  connectGitHub,
  disconnectGitHub,
  pullFromGitHub,
  syncToGitHub,
} from '../lib/github/syncService'
import { DATA_CHANGED_EVENT, FIRST_LOG_GITHUB_EVENT } from '../lib/syncEvents'
import { useTrackerOptional } from './trackerContext'
import type { SyncStatus } from '../lib/github/types'
import { GitHubSyncError } from '../lib/github/types'

const SYNC_DEBOUNCE_MS = 4_000

export function GitHubSyncProvider({ children }: { children: ReactNode }) {
  const tracker = useTrackerOptional()
  const [connected, setConnected] = useState(false)
  const [username, setUsername] = useState<string | null>(null)
  const [repoName, setRepoName] = useState<string | null>(null)
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null)
  const [status, setStatus] = useState<SyncStatus>('disconnected')
  const [statusMessage, setStatusMessage] = useState<string | null>(null)
  const [connectOpen, setConnectOpen] = useState(false)
  const [firstLogSheetOpen, setFirstLogSheetOpen] = useState(false)
  const syncTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const syncing = useRef(false)
  const pulledOnLoad = useRef(false)

  const loadConfig = useCallback(async () => {
    const config = await getGitHubSyncConfig()
    if (!config) {
      setConnected(false)
      setUsername(null)
      setRepoName(null)
      setLastSyncedAt(null)
      setStatus('disconnected')
      return
    }
    setConnected(true)
    setUsername(config.username)
    setRepoName(config.repoName)
    setLastSyncedAt(config.lastSyncedAt ?? null)
    setStatus('idle')
  }, [])

  useEffect(() => {
    queueMicrotask(() => {
      void loadConfig()
    })
  }, [loadConfig])

  const runSync = useCallback(async () => {
    if (syncing.current || !connected) return
    syncing.current = true
    setStatus('syncing')
    setStatusMessage(null)
    const result = await syncToGitHub()
    syncing.current = false
    if (result.ok) {
      setStatus('idle')
      setLastSyncedAt(result.syncedAt ?? new Date().toISOString())
      if (tracker) await tracker.refresh()
    } else {
      setStatus('error')
      setStatusMessage(result.message)
    }
  }, [connected, tracker])

  const scheduleSync = useCallback(() => {
    if (!connected) return
    if (syncTimer.current) clearTimeout(syncTimer.current)
    syncTimer.current = setTimeout(() => {
      void runSync()
    }, SYNC_DEBOUNCE_MS)
  }, [connected, runSync])

  useEffect(() => {
    const onDataChanged = () => scheduleSync()
    window.addEventListener(DATA_CHANGED_EVENT, onDataChanged)
    return () => {
      window.removeEventListener(DATA_CHANGED_EVENT, onDataChanged)
      if (syncTimer.current) clearTimeout(syncTimer.current)
    }
  }, [scheduleSync])

  useEffect(() => {
    if (!connected || !tracker?.ready || pulledOnLoad.current) return
    pulledOnLoad.current = true
    void (async () => {
      setStatus('syncing')
      const result = await pullFromGitHub()
      if (result.ok) {
        setStatus('idle')
        setLastSyncedAt(result.syncedAt ?? null)
        if (result.merged) await tracker.refresh()
      } else {
        setStatus('error')
        setStatusMessage(result.message)
      }
    })()
  }, [connected, tracker])

  useEffect(() => {
    const onFirstLog = () => {
      if (connected) return
      if (tracker?.settings?.demoMode) return
      if (tracker?.settings?.githubConnectPromptDismissed) return
      setFirstLogSheetOpen(true)
    }
    window.addEventListener(FIRST_LOG_GITHUB_EVENT, onFirstLog)
    return () => window.removeEventListener(FIRST_LOG_GITHUB_EVENT, onFirstLog)
  }, [connected, tracker?.settings?.demoMode, tracker?.settings?.githubConnectPromptDismissed])

  const connect = useCallback(
    async (token: string) => {
      setStatus('syncing')
      try {
        const login = await connectGitHub(token)
        pulledOnLoad.current = true
        await loadConfig()
        setStatus('idle')
        setConnectOpen(false)
        setFirstLogSheetOpen(false)
        if (tracker) {
          await tracker.refresh()
          await tracker.updateSettings({ githubConnectPromptDismissed: true })
        }
        setStatusMessage(`Connected as @${login}`)
      } catch (err) {
        setStatus('error')
        if (err instanceof GitHubSyncError) throw err
        throw new GitHubSyncError('Connection failed.', 'unknown')
      }
    },
    [loadConfig, tracker],
  )

  const disconnect = useCallback(async () => {
    await disconnectGitHub()
    pulledOnLoad.current = false
    await loadConfig()
    setStatusMessage('GitHub disconnected. Local data remains on this device.')
  }, [loadConfig])

  const dismissFirstLogSheet = useCallback(() => {
    setFirstLogSheetOpen(false)
    void tracker?.updateSettings({ githubConnectPromptDismissed: true })
  }, [tracker])

  const value = useMemo(
    () => ({
      connected,
      username,
      repoName,
      lastSyncedAt,
      status,
      statusMessage,
      connectOpen,
      openConnect: () => setConnectOpen(true),
      closeConnect: () => setConnectOpen(false),
      connect,
      disconnect,
      syncNow: runSync,
      pullNow: async () => {
        if (!tracker) return
        setStatus('syncing')
        const result = await pullFromGitHub()
        if (result.ok) {
          setStatus('idle')
          setLastSyncedAt(result.syncedAt ?? null)
          if (result.merged) await tracker.refresh()
        } else {
          setStatus('error')
          setStatusMessage(result.message)
        }
      },
    }),
    [
      connected,
      username,
      repoName,
      lastSyncedAt,
      status,
      statusMessage,
      connectOpen,
      connect,
      disconnect,
      runSync,
      tracker,
    ],
  )

  return (
    <GitHubSyncContext.Provider value={value}>
      {children}
      <GitHubConnectModal
        open={connectOpen}
        onClose={() => setConnectOpen(false)}
        onConnect={connect}
      />
      <GitHubFirstLogSheet
        open={firstLogSheetOpen}
        onMaybeLater={dismissFirstLogSheet}
        onConnectClick={() => setFirstLogSheetOpen(false)}
      />
    </GitHubSyncContext.Provider>
  )
}
