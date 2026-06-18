/** Primary tab routes in the bottom navigation shell. */
export type TabId = 'home' | 'activate' | 'reflect' | 'codex'

export interface TabConfig {
  id: TabId
  label: string
  kanji: string
}
