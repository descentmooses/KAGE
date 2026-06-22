import { useState } from 'react'
import { useTheme } from '../../theme/useTheme'
import { ModalShell } from '../../components/ui/ModalShell'
import { NeonButton } from '../../components/ui/NeonButton'
import { NeonInput } from '../../components/ui/NeonInput'
import { GitHubSyncError } from '../../lib/github/types'

const TOKEN_URL =
  'https://github.com/settings/tokens/new?scopes=repo&description=KAGE%20Shadow%20Sync'

interface GitHubConnectModalProps {
  open: boolean
  onClose: () => void
  onConnect: (token: string) => Promise<void>
}

export function GitHubConnectModal({ open, onClose, onConnect }: GitHubConnectModalProps) {
  const { tokens } = useTheme()
  const [token, setToken] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showWhy, setShowWhy] = useState(false)

  const handleConnect = async () => {
    setBusy(true)
    setError(null)
    try {
      await onConnect(token)
      setToken('')
    } catch (err) {
      setError(
        err instanceof GitHubSyncError
          ? err.message
          : err instanceof Error
            ? err.message
            : 'Connection failed. Check your token and try again.',
      )
    } finally {
      setBusy(false)
    }
  }

  return (
    <ModalShell open={open} onClose={onClose} maxWidth={400}>
      <div
        style={{
          padding: '24px 20px',
          borderRadius: 12,
          border: `1px solid ${tokens.modalBorder}`,
          background: tokens.modalBg,
          boxShadow: tokens.modalShadow,
        }}
      >
        <p
          style={{
            margin: '0 0 6px',
            fontFamily: '"Orbitron", sans-serif',
            fontSize: 10,
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            color: tokens.crimson,
          }}
        >
          GitHub Shadow Vault
        </p>
        <p style={{ margin: '0 0 16px', fontSize: 13, lineHeight: 1.55, color: tokens.textMuted }}>
          Your data stays in a private repository only you control. The token lives in this browser
          — never on our servers.
        </p>

        <ol
          style={{
            margin: '0 0 16px',
            paddingLeft: 18,
            fontSize: 12,
            lineHeight: 1.65,
            color: tokens.text,
          }}
        >
          <li style={{ marginBottom: 8 }}>
            Open{' '}
            <a
              href={TOKEN_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: tokens.crimson }}
            >
              GitHub → Personal access tokens (classic)
            </a>
          </li>
          <li style={{ marginBottom: 8 }}>Generate a token named &ldquo;KAGE Shadow Sync&rdquo;</li>
          <li style={{ marginBottom: 8 }}>
            Select only the <strong>repo</strong> scope (private repository access)
          </li>
          <li>Copy the token and paste it below</li>
        </ol>

        <NeonInput
          label="Personal access token"
          type="password"
          value={token}
          onChange={setToken}
          placeholder="ghp_…"
          autoComplete="off"
        />

        {error && (
          <p style={{ margin: '12px 0 0', fontSize: 12, color: tokens.crimson, lineHeight: 1.5 }}>
            {error}
          </p>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 18 }}>
          <NeonButton onClick={() => void handleConnect()} disabled={busy || !token.trim()}>
            {busy ? 'Connecting…' : 'Connect GitHub'}
          </NeonButton>
          <button
            type="button"
            onClick={() => setShowWhy((v) => !v)}
            style={{
              background: 'none',
              border: 'none',
              color: tokens.textMuted,
              fontSize: 11,
              cursor: 'pointer',
              textDecoration: 'underline',
              padding: 8,
            }}
          >
            Why GitHub?
          </button>
          {showWhy && (
            <p style={{ margin: 0, fontSize: 11, lineHeight: 1.6, color: tokens.textMuted }}>
              GitHub gives you free private storage with no middleman database. Your shadow logs
              sync to <code style={{ fontSize: 10 }}>kage-shadow-vault</code> — a repo you own, can
              export, or delete anytime. KAGE never sees your token or data.
            </p>
          )}
          <button
            type="button"
            onClick={onClose}
            style={{
              width: '100%',
              padding: '12px 0',
              border: `1px solid ${tokens.border}`,
              borderRadius: 2,
              background: 'transparent',
              color: tokens.textMuted,
              fontFamily: '"Orbitron", sans-serif',
              fontSize: 9,
              letterSpacing: '0.35em',
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </ModalShell>
  )
}
