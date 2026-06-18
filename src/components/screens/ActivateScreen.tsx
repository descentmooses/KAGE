import { useState } from 'react'
import { TabScreen, ConfirmBanner } from '../TabScreen'
import { SegmentedControl } from '../ui/SegmentedControl'
import { NeonInput } from '../ui/NeonInput'
import { NeonButton } from '../ui/NeonButton'
import { useMorningLog, useConfirmMessage } from '../../hooks/useMorningLog'

export function ActivateScreen() {
  const { saveMorning } = useMorningLog()
  const { message, show } = useConfirmMessage()
  const [energy, setEnergy] = useState(7)
  const [intention, setIntention] = useState('')
  const [discipline, setDiscipline] = useState('')

  const handleLog = () => {
    if (!intention.trim() || !discipline.trim()) {
      show('Enter your intention and discipline to continue.')
      return
    }
    saveMorning(energy, intention, discipline)
    show('Morning logged — protocol engaged.')
  }

  return (
    <TabScreen
      kanji="活"
      title="Morning Activation"
      subtitle="覚醒 — set your signal for the day"
    >
      {message && <ConfirmBanner message={message} />}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <SegmentedControl label="Current Energy (1–10)" value={energy} onChange={setEnergy} />

        <NeonInput
          label="One Intention for Today"
          value={intention}
          onChange={setIntention}
          placeholder="What matters most today?"
        />

        <NeonInput
          label="One Small Discipline"
          value={discipline}
          onChange={setDiscipline}
          placeholder="A tiny action you will not skip"
        />

        <NeonButton onClick={handleLog}>LOG MORNING</NeonButton>
      </div>
    </TabScreen>
  )
}
