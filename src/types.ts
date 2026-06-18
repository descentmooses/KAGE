export type TabId = 'home' | 'activate' | 'reflect' | 'codex'

export type AreaId = 'mind' | 'body' | 'spirit'

export type Ratings = Record<AreaId, number | null>

export interface AreaConfig {
  id: AreaId
  label: string
  kanji: string
  color: 'cyan' | 'magenta'
}

export interface TabConfig {
  id: TabId
  label: string
  kanji: string
}
