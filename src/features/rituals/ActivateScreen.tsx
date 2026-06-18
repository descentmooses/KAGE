import { useState } from 'react'
import { TabScreen, ConfirmBanner } from '../../components/TabScreen'
import { SegmentedControl } from '../../components/ui/SegmentedControl'
import { NeonInput } from '../../components/ui/NeonInput'
import { NeonButton } from '../../components/ui/NeonButton'
import { useTracker } from '../../context/trackerContext'
import { useTheme } from '../../theme/useTheme'
import { useConfirmMessage } from '../../hooks/useMorningLog'
import type { MorningLogEntry } from '../../types'

const RITUAL_STEPS = [
  { n: '01', label: 'Breathe', hint: 'One slow exhale before the wheel turns.' },
  { n: '02', label: 'Energy', hint: 'Honest score — no performance.' },
  { n: '03', label: 'Intention', hint: 'One move toward freedom today.' },
  { n: '04', label: 'Discipline', hint: 'One small act you will not negotiate.' },
]

function ActivateForm({ initial }: { initial: MorningLogEntry | null }) {
  const { tokens } = useTheme()
  const { saveMorning } = useTracker()
  const { message, show } = useConfirmMessage()
  const [step, setStep] = useState(0)
  const [energy, setEnergy] = useState(initial?.energy ?? 7)
  const [intention, setIntention] = useState(initial?.intention ?? '')
  const [discipline, setDiscipline] = useState(initial?.discipline ?? '')

  const handleLog = () => {
    if (!intention.trim() || !discipline.trim()) {
      show('Enter your intention and discipline to seal the ritual.')
      return
    }
    void saveMorning(energy, intention, discipline)
    show('Dawn protocol sealed — the shadow remembers. +40 XP')
  }

  return (
    <>
      {message && <ConfirmBanner message={message} />}

      <div
        className="animate-fade-in"
        style={{
          padding: '16px 18px',
          borderRadius: 12,
          border: `1px solid ${tokens.borderAccent}`,
          background: tokens.bannerBg,
          marginBottom: 24,
        }}
      >
        <p
          style={{
            margin: '0 0 12px',
            fontFamily: '"Orbitron", sans-serif',
            fontSize: 9,
            letterSpacing: '0.35em',
            textTransform: 'uppercase',
            color: tokens.crimson,
            textAlign: 'center',
          }}
        >
          Dawn ritual
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 14 }}>
          {RITUAL_STEPS.map((s, i) => (
            <button
              key={s.n}
              type="button"
              onClick={() => setStep(i)}
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                border: `1px solid ${step === i ? tokens.crimson : tokens.border}`,
                background: step === i ? tokens.bannerBg : 'transparent',
                color: step === i ? tokens.crimson : tokens.textSubtle,
                fontSize: 10,
                cursor: 'pointer',
              }}
              aria-label={s.label}
            >
              {s.n}
            </button>
          ))}
        </div>
        <p style={{ margin: 0, fontSize: 13, lineHeight: 1.6, color: tokens.text, textAlign: 'center' }}>
          <strong style={{ color: tokens.crimson }}>{RITUAL_STEPS[step].label}.</strong>{' '}
          {RITUAL_STEPS[step].hint}
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {step >= 1 && (
          <SegmentedControl label="Current Energy (1–10)" value={energy} onChange={setEnergy} />
        )}

        {step >= 2 && (
          <NeonInput
            label="One Intention for Today"
            value={intention}
            onChange={setIntention}
            placeholder="Wealth move, patent step, recovery block…"
          />
        )}

        {step >= 3 && (
          <NeonInput
            label="One Small Discipline"
            value={discipline}
            onChange={setDiscipline}
            placeholder="Gym, macros log, family call…"
          />
        )}

        {step < 3 ? (
          <NeonButton onClick={() => setStep((s) => Math.min(3, s + 1))}>CONTINUE RITUAL</NeonButton>
        ) : (
          <NeonButton onClick={handleLog}>SEAL DAWN PROTOCOL</NeonButton>
        )}
      </div>
    </>
  )
}

export function ActivateScreen() {
  const { morningToday } = useTracker()

  return (
    <TabScreen
      kanji="活"
      title="Morning Activation"
      subtitle="覚醒 — a quiet ceremony before the first mile"
    >
      <ActivateForm key={morningToday?.id ?? 'new'} initial={morningToday} />
    </TabScreen>
  )
}
