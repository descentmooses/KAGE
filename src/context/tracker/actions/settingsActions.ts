import type { AppSettings } from '../../../types'
import { getSettings, putSettings } from '../../../lib/db'
import { emitDataChanged } from '../../../lib/syncEvents'
import type { RefreshHandler } from './types'

export interface SettingsActionDeps {
  settings: AppSettings | null
  refresh: RefreshHandler
}

export function createSettingsActions(deps: SettingsActionDeps) {
  const updateSettings = async (patch: Partial<AppSettings>) => {
    const current = (await getSettings()) ?? deps.settings!
    const next = { ...current, ...patch }
    await putSettings(next)
    await deps.refresh()
    emitDataChanged()
  }

  const saveWhisper = async (text: string) => {
    const current = (await getSettings()) ?? deps.settings!
    const history = [text, ...(current.whisperHistory ?? [])].slice(0, 12)
    await putSettings({ ...current, whisperHistory: history })
    await deps.refresh()
  }

  const toggleFavoriteWhisper = async (text: string) => {
    const current = (await getSettings()) ?? deps.settings!
    const favorites = current.favoriteWhispers ?? []
    const next = favorites.includes(text)
      ? favorites.filter((w) => w !== text)
      : [text, ...favorites].slice(0, 24)
    await putSettings({ ...current, favoriteWhispers: next })
    await deps.refresh()
  }

  return { updateSettings, saveWhisper, toggleFavoriteWhisper }
}
