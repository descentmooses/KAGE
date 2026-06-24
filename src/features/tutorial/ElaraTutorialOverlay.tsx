import { useTheme } from '../../theme/useTheme'
import type { TutorialStep } from './tutorialSteps'

interface ElaraTutorialOverlayProps {
  step: TutorialStep
  stepIndex: number
  totalSteps: number
  onNext: () => void
  onSkip: () => void
}

export function ElaraTutorialOverlay({
  step,
  stepIndex,
  totalSteps,
  onNext,
  onSkip,
}: ElaraTutorialOverlayProps) {
  const { tokens } = useTheme()
  const isLast = stepIndex >= totalSteps - 1

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Elara tutorial"
      className="animate-fade-in"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 180,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        padding: '0 0 max(12px, env(safe-area-inset-bottom))',
        pointerEvents: 'none',
      }}
    >
      <div
        className="animate-modal-in animate-whisper-glow"
        style={{
          pointerEvents: 'auto',
          width: 'min(420px, calc(100% - 24px))',
          borderRadius: '20px 20px 16px 16px',
          border: `1px solid ${tokens.borderAccent}`,
          background: `linear-gradient(165deg, ${tokens.modalBg} 0%, rgba(10,5,8,0.98) 100%)`,
          boxShadow: `0 -8px 48px rgba(0,0,0,0.55), 0 0 32px ${tokens.accentGlow}`,
          padding: '22px 20px 18px',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 10,
            gap: 8,
          }}
        >
          <p
            style={{
              margin: 0,
              fontFamily: '"Share Tech Mono", monospace',
              fontSize: 9,
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              color: tokens.crimson,
            }}
          >
            Elara · demo tutorial
          </p>
          <span style={{ fontSize: 10, color: tokens.textMuted }}>
            {stepIndex + 1}/{totalSteps}
          </span>
        </div>

        <p
          style={{
            margin: '0 0 6px',
            fontFamily: '"Orbitron", sans-serif',
            fontSize: 11,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: tokens.text,
          }}
        >
          {step.title}
        </p>

        <p
          style={{
            margin: '0 0 18px',
            fontSize: 15,
            lineHeight: 1.65,
            color: tokens.text,
            fontStyle: 'italic',
          }}
        >
          {step.elara}
        </p>

        <div style={{ display: 'flex', gap: 8 }}>
          <button
            type="button"
            onClick={onSkip}
            className="kage-touch-target"
            style={{
              flex: 1,
              minHeight: 48,
              borderRadius: 10,
              border: `1px solid ${tokens.border}`,
              background: 'transparent',
              color: tokens.textMuted,
              fontSize: 11,
              cursor: 'pointer',
            }}
          >
            Skip tour
          </button>
          <button
            type="button"
            onClick={onNext}
            className="kage-touch-target"
            style={{
              flex: 2,
              minHeight: 48,
              borderRadius: 10,
              border: 'none',
              background: tokens.btnGradient,
              color: tokens.btnText,
              fontFamily: '"Orbitron", sans-serif',
              fontSize: 10,
              letterSpacing: '0.2em',
              cursor: 'pointer',
              boxShadow: tokens.btnShadow,
            }}
          >
            {isLast ? 'BEGIN YOUR ARCHIVE' : 'CONTINUE'}
          </button>
        </div>
      </div>
    </div>
  )
}
