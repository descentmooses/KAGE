import type { ReactNode } from 'react'
import { useTheme } from '../../theme/useTheme'
import { useInstallPromptContext } from '../../context/installPromptContext'
import { useToast } from '../../hooks/useToast'

function ShareIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 3v10M8 7l4-4 4 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect x="4" y="11" width="16" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}

function MenuIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="6" r="1.5" fill="currentColor" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
      <circle cx="12" cy="18" r="1.5" fill="currentColor" />
    </svg>
  )
}

function StepRow({
  n,
  title,
  children,
}: {
  n: string
  title: string
  children: ReactNode
}) {
  const { tokens } = useTheme()
  return (
    <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', marginBottom: 18 }}>
      <span
        style={{
          width: 32,
          height: 32,
          borderRadius: '50%',
          border: `1px solid ${tokens.crimson}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: '"Share Tech Mono", monospace',
          fontSize: 11,
          color: tokens.crimson,
          flexShrink: 0,
        }}
      >
        {n}
      </span>
      <div>
        <p style={{ margin: '0 0 6px', fontSize: 14, color: tokens.text, fontWeight: 500 }}>
          {title}
        </p>
        {children}
      </div>
    </div>
  )
}

export function InstallInviteSheet() {
  const { tokens } = useTheme()
  const {
    open,
    isIOS,
    isAndroid,
    deferredPrompt,
    hasNativePrompt,
    dismissForSession,
    promptInstall,
  } = useInstallPromptContext()
  const { showToast } = useToast()

  if (!open) return null

  const handleInstall = async () => {
    if (deferredPrompt) {
      const outcome = await promptInstall()
      if (outcome === 'accepted') {
        showToast('KAGE is now on your home screen. The path continues with you.', 'success')
      } else if (outcome === 'dismissed') {
        dismissForSession()
      }
      return
    }
    dismissForSession()
  }

  const handleLater = () => {
    dismissForSession()
  }

  const showIOSSteps = isIOS && !hasNativePrompt
  const showAndroidSteps = isAndroid && !hasNativePrompt
  const showDesktopSteps = !isIOS && !isAndroid && !hasNativePrompt

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Install KAGE"
      className="animate-fade-in"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 130,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
      }}
    >
      <button
        type="button"
        aria-label="Close install invitation"
        onClick={handleLater}
        style={{
          position: 'absolute',
          inset: 0,
          border: 'none',
          background: tokens.modalBackdrop,
          cursor: 'pointer',
        }}
      />

      <div
        className="animate-modal-in animate-whisper-glow"
        style={{
          position: 'relative',
          width: 'min(420px, 100%)',
          maxHeight: 'min(88dvh, 640px)',
          overflowY: 'auto',
          borderRadius: '22px 22px 0 0',
          border: `1px solid ${tokens.borderAccent}`,
          borderBottom: 'none',
          background: `linear-gradient(165deg, rgba(12,6,8,0.98) 0%, ${tokens.modalBg} 55%)`,
          boxShadow: `0 -12px 56px rgba(0,0,0,0.55), 0 0 40px ${tokens.accentGlow}`,
          padding: '20px 22px max(24px, env(safe-area-inset-bottom))',
        }}
      >
        <div
          style={{
            width: 40,
            height: 4,
            borderRadius: 2,
            background: tokens.border,
            margin: '0 auto 20px',
            opacity: 0.5,
          }}
        />

        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <span
            style={{
              fontSize: 36,
              fontFamily: '"Noto Sans JP", sans-serif',
              color: tokens.crimson,
              display: 'block',
              lineHeight: 1,
            }}
            aria-hidden
          >
            影
          </span>
          <p
            style={{
              margin: '10px 0 4px',
              fontFamily: '"Orbitron", sans-serif',
              fontSize: 10,
              letterSpacing: '0.45em',
              textTransform: 'uppercase',
              color: tokens.crimson,
            }}
          >
            Carry the shadow
          </p>
          <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: tokens.textMuted }}>
            Install KAGE on your home screen — one tap back to Mind, Body, and Spirit.
          </p>
        </div>

        {showIOSSteps && (
          <div style={{ marginBottom: 20 }}>
            <StepRow n="1" title="Tap Share">
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '8px 12px',
                  borderRadius: 10,
                  border: `1px solid ${tokens.border}`,
                  color: tokens.crimson,
                  background: tokens.surfaceElevated,
                }}
              >
                <ShareIcon />
                <span style={{ fontSize: 12, color: tokens.textMuted }}>Browser share menu</span>
              </div>
            </StepRow>
            <StepRow n="2" title='Scroll — tap “Add to Home Screen”'>
              <p style={{ margin: 0, fontSize: 13, color: tokens.textMuted, lineHeight: 1.5 }}>
                In Chrome: Share → “Add to Home Screen”. In Safari: Share → “Add to Home Screen”.
              </p>
            </StepRow>
            <StepRow n="3" title='Tap “Add”'>
              <p style={{ margin: 0, fontSize: 13, color: tokens.textMuted, lineHeight: 1.5 }}>
                KAGE opens full-screen — no browser chrome, only the path.
              </p>
            </StepRow>
          </div>
        )}

        {showAndroidSteps && (
          <div style={{ marginBottom: 20 }}>
            <StepRow n="1" title="Open the browser menu">
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '8px 12px',
                  borderRadius: 10,
                  border: `1px solid ${tokens.border}`,
                  color: tokens.crimson,
                  background: tokens.surfaceElevated,
                }}
              >
                <MenuIcon />
                <span style={{ fontSize: 12, color: tokens.textMuted }}>⋮ top-right in Chrome</span>
              </div>
            </StepRow>
            <StepRow n="2" title='Tap “Install app” or “Add to Home screen”'>
              <p style={{ margin: 0, fontSize: 13, color: tokens.textMuted, lineHeight: 1.5 }}>
                Wording varies by Chrome version — both install KAGE to your home screen.
              </p>
            </StepRow>
            <StepRow n="3" title="Confirm">
              <p style={{ margin: 0, fontSize: 13, color: tokens.textMuted, lineHeight: 1.5 }}>
                Launch from your home screen like any app — fully offline.
              </p>
            </StepRow>
          </div>
        )}

        {showDesktopSteps && (
          <div style={{ marginBottom: 20 }}>
            <StepRow n="1" title="Look for the install icon">
              <p style={{ margin: 0, fontSize: 13, color: tokens.textMuted, lineHeight: 1.5 }}>
                In Chrome/Edge, an install icon may appear in the address bar (⊕ or monitor).
              </p>
            </StepRow>
            <StepRow n="2" title="Or use the browser menu">
              <p style={{ margin: 0, fontSize: 13, color: tokens.textMuted, lineHeight: 1.5 }}>
                ⋮ Menu → “Install KAGE…” or “Apps” → “Install this site as an app”.
              </p>
            </StepRow>
          </div>
        )}

        {hasNativePrompt && (
          <p
            style={{
              margin: '0 0 16px',
              fontSize: 14,
              lineHeight: 1.65,
              color: tokens.text,
              textAlign: 'center',
              fontStyle: 'italic',
            }}
          >
            Offline discipline. Crimson clarity. Your archive travels with you.
          </p>
        )}

        {hasNativePrompt ? (
          <button
            type="button"
            onClick={() => void handleInstall()}
            className="kage-touch-target"
            style={{
              width: '100%',
              minHeight: 56,
              marginBottom: 10,
              borderRadius: 12,
              border: 'none',
              background: tokens.btnGradient,
              color: tokens.btnText,
              fontFamily: '"Orbitron", sans-serif',
              fontSize: 11,
              letterSpacing: '0.35em',
              cursor: 'pointer',
              boxShadow: tokens.btnShadow,
            }}
          >
            INSTALL KAGE
          </button>
        ) : (
          <button
            type="button"
            onClick={handleLater}
            className="kage-touch-target"
            style={{
              width: '100%',
              minHeight: 56,
              marginBottom: 10,
              borderRadius: 12,
              border: `1px solid ${tokens.crimson}`,
              background: tokens.bannerBg,
              color: tokens.crimson,
              fontFamily: '"Orbitron", sans-serif',
              fontSize: 11,
              letterSpacing: '0.3em',
              cursor: 'pointer',
            }}
          >
            GOT IT
          </button>
        )}

        <button
          type="button"
          onClick={handleLater}
          className="kage-touch-target"
          style={{
            width: '100%',
            minHeight: 52,
            borderRadius: 12,
            border: `1px solid ${tokens.border}`,
            background: 'transparent',
            color: tokens.textMuted,
            fontSize: 13,
            cursor: 'pointer',
          }}
        >
          Maybe later
        </button>

        <p
          style={{
            margin: '14px 0 0',
            fontSize: 10,
            color: tokens.textSubtle,
            textAlign: 'center',
            letterSpacing: '0.08em',
          }}
        >
          Won&apos;t auto-prompt again this session · tap header Install anytime
        </p>
      </div>
    </div>
  )
}
