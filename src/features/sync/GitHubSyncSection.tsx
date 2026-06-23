import { useTheme } from '../../theme/useTheme'
import { useGitHubSync } from '../../context/githubSyncContext'
import { formatLastSynced } from '../../lib/github/syncService'

export function GitHubSyncSection() {
  const { tokens } = useTheme()
  const {
    connected,
    username,
    repoName,
    lastSyncedAt,
    status,
    statusMessage,
    openConnect,
    disconnect,
    syncNow,
    pullNow,
  } = useGitHubSync()

  const dotColor =
    status === 'syncing'
      ? tokens.gold
      : status === 'error'
        ? tokens.crimson
        : connected
          ? '#3d9970'
          : tokens.textMuted

  return (
    <section style={{ marginBottom: 16 }}>
      <p
        style={{
          margin: '0 0 10px',
          fontFamily: '"Share Tech Mono", monospace',
          fontSize: 8,
          letterSpacing: '0.35em',
          textTransform: 'uppercase',
          color: tokens.textMuted,
        }}
      >
        GitHub Sync
      </p>

      <div
        style={{
          padding: '12px 14px',
          borderRadius: 10,
          border: `1px solid ${connected ? tokens.borderAccent : tokens.border}`,
          background: connected ? tokens.bannerBg : tokens.surfaceElevated,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <span
            aria-hidden
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: dotColor,
              boxShadow: connected ? `0 0 8px ${dotColor}88` : 'none',
            }}
          />
          <span style={{ fontSize: 12, color: tokens.text, fontWeight: 500 }}>
            {connected ? `Connected • @${username}` : 'Not connected'}
          </span>
        </div>

        {connected ? (
          <>
            <p style={{ margin: '0 0 10px', fontSize: 11, color: tokens.textMuted, lineHeight: 1.5 }}>
              Vault: <strong style={{ color: tokens.text }}>{repoName}</strong>
              <br />
              Last synced: {formatLastSynced(lastSyncedAt ?? undefined)}
              {status === 'syncing' && ' • Syncing…'}
            </p>
            {statusMessage && (
              <p style={{ margin: '0 0 10px', fontSize: 11, color: tokens.crimson }}>{statusMessage}</p>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <button
                type="button"
                onClick={() => void syncNow()}
                disabled={status === 'syncing'}
                className="kage-touch-target"
                style={{
                  minHeight: 40,
                  borderRadius: 8,
                  border: `1px solid ${tokens.crimson}`,
                  background: tokens.bannerBg,
                  color: tokens.crimson,
                  fontSize: 11,
                  cursor: 'pointer',
                }}
              >
                Sync now
              </button>
              <button
                type="button"
                onClick={() => void pullNow()}
                disabled={status === 'syncing'}
                className="kage-touch-target"
                style={{
                  minHeight: 40,
                  borderRadius: 8,
                  border: `1px solid ${tokens.border}`,
                  background: 'transparent',
                  color: tokens.text,
                  fontSize: 11,
                  cursor: 'pointer',
                }}
              >
                Pull from GitHub
              </button>
              <button
                type="button"
                onClick={() => void disconnect()}
                className="kage-touch-target"
                style={{
                  minHeight: 40,
                  borderRadius: 8,
                  border: `1px solid ${tokens.border}`,
                  background: 'transparent',
                  color: tokens.textMuted,
                  fontSize: 11,
                  cursor: 'pointer',
                }}
              >
                Disconnect (keep local data)
              </button>
            </div>
          </>
        ) : (
          <>
            <p style={{ margin: '0 0 10px', fontSize: 11, color: tokens.textMuted, lineHeight: 1.55 }}>
              Sync logs, goals, and XP to your own private GitHub repo — free, encrypted in transit,
              zero third-party database.
            </p>
            <button
              type="button"
              onClick={openConnect}
              className="kage-touch-target"
              style={{
                width: '100%',
                minHeight: 44,
                borderRadius: 8,
                border: `1px solid ${tokens.crimson}`,
                background: tokens.btnGradient,
                color: tokens.btnText,
                fontFamily: '"Orbitron", sans-serif',
                fontSize: 9,
                letterSpacing: '0.2em',
                cursor: 'pointer',
              }}
            >
              Connect GitHub
            </button>
          </>
        )}
      </div>
    </section>
  )
}
