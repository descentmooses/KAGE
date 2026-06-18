import { NeonBar } from '../../components/NeonBar'
import { CollapsibleSection } from '../../components/ui/CollapsibleSection'
import { useTheme } from '../../theme/useTheme'
import { useMBSBalance } from '../../hooks/useMBSBalance'
import { InsightCards, QuestList } from '../insights/InsightCards'
import { ShadowLogForm } from '../logging/ShadowLogForm'
import { AREA_CONFIGS, type AreaConfig } from '../../types'

interface DeepShadowSectionProps {
  onAdjust: (area: AreaConfig) => void
}

export function DeepShadowSection({ onAdjust }: DeepShadowSectionProps) {
  const { tokens } = useTheme()
  const { ratings } = useMBSBalance()

  return (
    <>
      <CollapsibleSection
        title="Parked shadow log"
        subtitle="Sliders + save today's entry"
        defaultOpen={false}
      >
        <ShadowLogForm />
      </CollapsibleSection>

      <CollapsibleSection
        title="Deeper shadow"
        subtitle="Insights, quests, pillar detail"
        defaultOpen={false}
      >
        <InsightCards />
        <QuestList />

        <p
          style={{
            fontFamily: '"Share Tech Mono", monospace',
            fontSize: 9,
            letterSpacing: '0.35em',
            textTransform: 'uppercase',
            color: tokens.textMuted,
            margin: '0 0 12px',
          }}
        >
          Pillar detail
        </p>
        <div style={{ marginBottom: 24 }}>
          {AREA_CONFIGS.map((area) => (
            <NeonBar
              key={area.id}
              area={area}
              value={ratings[area.id]}
              onTap={() => onAdjust(area)}
            />
          ))}
        </div>
      </CollapsibleSection>
    </>
  )
}
