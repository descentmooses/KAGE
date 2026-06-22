import { useEffect, useState } from 'react'
import { useTheme } from '../theme/useTheme'
import { useGitHubSyncOptional } from '../context/githubSyncContext'
import { formatLastSynced } from '../lib/github/syncService'

/** Online + GitHub sync status dot in header. */
export function ConnectionDot() {
  const { tokens } = useTheme()
  const sync = useGitHubSyncOptional()
  const [online, setOnline] = useState(
    () => typeof navigator !== 'undefined' && navigator.onLine,
  )

  useEffect(() => {
    const onSync = () => setOnline(navigator.onLine)
    window.addEventListener('online', onSync)
    window.addEventListener('offline', onSync)
    return () => {
      window.removeEventListener('online', onSync)
      window.removeEventListener('offline', onSync)
    }
  }, [])

  const syncing = sync?.status === 'syncing'
  const syncError = sync?.status === 'error'
  const ghConnected = sync?.connected

  let color = online ? '#3d9970' : '#c9a227'
  let title = online ? 'Online' : 'Offline — data saved locally'

  if (ghConnected) {
    if (syncing) {
      color = tokens.gold
      title = 'Syncing to GitHub…'
    } else if (syncError) {
      color = tokens.crimson
      title = sync?.statusMessage ?? 'Sync error'
    } else {
      color = '#3d9970'
      title = `GitHub synced • ${formatLastSynced(sync.lastSyncedAt ?? undefined)}`
    }
  }

  return (
    <span
      title={title}
      aria-label={title}
      className={syncing ? 'animate-pulse-glow' : undefined}
      style={{
        width: 8,
        height: 8,
        borderRadius: '50%',
        background: color,
        boxShadow: `0 0 6px ${color}88`,
        flexShrink: 0,
        border: `1px solid ${tokens.border}`,
        transition: 'background 0.3s ease, box-shadow 0.3s ease',
      }}
    />
  )
}
