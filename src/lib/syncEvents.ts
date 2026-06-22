/** Fired after meaningful local data changes — GitHub sync listens and debounces. */
export const DATA_CHANGED_EVENT = 'kage:data-changed'

export function emitDataChanged(): void {
  window.dispatchEvent(new CustomEvent(DATA_CHANGED_EVENT))
}

/** Fired after the user's first-ever shadow log — show GitHub connect invite. */
export const FIRST_LOG_GITHUB_EVENT = 'kage:first-log-github'

export function emitFirstLogGitHubInvite(): void {
  window.dispatchEvent(new CustomEvent(FIRST_LOG_GITHUB_EVENT))
}
