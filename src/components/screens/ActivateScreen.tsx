import { useState } from 'react'
import { TabScreen, ConfirmBanner } from '../TabScreen'
import { SegmentedControl } from '../ui/SegmentedControl'
import { NeonInput } from '../ui/NeonInput'
import { NeonButton } from '../ui/NeonButton'
import { useTracker } from '../../context/trackerContext'
import { useConfirmMessage } from '../../hooks/useMorningLog'
import type { MorningLogEntry } from '../../types'

function ActivateForm({ initial }: { initial: MorningLogEntry | null }) {
  const { saveMorning } = useTracker()
  const { message, show } = useConfirmMessage()
  const [energy, setEnergy] = useState(initial?.energy ?? 7)
  const [intention, setIntention] = useState(initial?.intention ?? '')
  const [discipline, setDiscipline] = useState(initial?.discipline ?? '')

  const handleLog = () => {
    if (!intention.trim() || !discipline.trim()) {
      show('Enter your intention and discipline to continue.')
      return
    }
    void saveMorning(energy, intention, discipline)
    show('Morning logged — protocol engaged. +40 XP')
  }

  return (
    <>
      {message && <ConfirmBanner message={message} />}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <SegmentedControl label="Current Energy (1–10)" value={energy} onChange={setEnergy} />

        <NeonInput
          label="One Intention for Today"
          value={intention}
          onChange={setIntention}
          placeholder="Wealth move, patent step, recovery block…"
        />

        <NeonInput
          label="One Small Discipline"
          value={discipline}
          onChange={setDiscipline}
          placeholder="Gym, macros log, family call…"
        />

        <NeonButton onClick={handleLog}>LOG MORNING</NeonButton>
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
      subtitle="覚醒 — set your signal for the day"
    >
      <ActivateForm key={morningToday?.id ?? 'new'} initial={morningToday} />
    </TabScreen>
  )
}
