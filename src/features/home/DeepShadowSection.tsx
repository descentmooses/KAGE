import { CollapsibleSection } from '../../components/ui/CollapsibleSection'
import { InsightCards, QuestList } from '../insights/InsightCards'
import { ShadowLogForm } from '../logging/ShadowLogForm'

export function DeepShadowSection() {
  return (
    <>
      <CollapsibleSection
        title="Parked full log"
        subtitle="Sliders, note, and save — when safely parked"
        defaultOpen={false}
      >
        <ShadowLogForm />
      </CollapsibleSection>

      <CollapsibleSection
        title="Insights & quests"
        subtitle="Patterns and daily challenges"
        defaultOpen={false}
      >
        <InsightCards />
        <QuestList />
      </CollapsibleSection>
    </>
  )
}
