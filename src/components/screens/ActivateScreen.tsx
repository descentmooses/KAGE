import { useState } from 'react'
import { TabScreen, ConfirmBanner } from '../TabScreen'
import { SegmentedControl } from '../ui/SegmentedControl'
import { NeonInput } from '../ui/NeonInput'
import { NeonButton } from '../ui/NeonButton'
import { useMorningLog, useConfirmMessage } from '../../hooks/useMorningLog'

export function ActivateScreen() {
  const { lastLog, saveMorning } = useMorningLog()
  const { message, show } = useConfirmMessage()
  const [energy, setEnergy] = useState(lastLog?.energy ?? 7)
  const [intention, setIntention] = useState(lastLog?.intention ?? '')
  const [discipline, setDiscipline] = useState(lastLog?.discipline ?? '')

  const handleLog = () => {
    if (!intention.trim() || !discipline.trim()) {
      show('Fill in intention and discipline to log.')
      return
    }
    saveMorning(energy, intention, discipline)
    show('Morning activation logged. Protocol engaged.')
  }

  return (
    <TabScreen
      kanji="活"
      title="Morning Activation"
      subtitle="覚醒 — set your signal for the day"
    >
      {message && <ConfirmBanner message={message} />}

      <div className="space-y-7">
        <SegmentedControl
          label="Current Energy"
          value={energy}
          onChange={setEnergy}
        />

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
