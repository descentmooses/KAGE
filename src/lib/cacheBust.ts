const BUILD_VERSION =
  document.querySelector('meta[name="build-version"]')?.getAttribute('content') ?? ''

const STORAGE_KEY = 'kage-deploy'

function basePath(): string {
  return import.meta.env.BASE_URL
}

function rootUrl(version: string): string {
  const base = basePath().replace(/\/?$/, '/')
  return `${base}?bust=${version}`
}

/** Secondary check after bootstrap — reload if HTML/JS bundle is stale. */
export async function checkForStaleCache(): Promise<void> {
  try {
    const url = `${basePath()}version.json?_=${Date.now()}`
    const res = await fetch(url, { cache: 'no-store' })
    if (!res.ok) return

    const data = (await res.json()) as { version?: string }
    const remote = data.version
    if (!remote) return

    const stored = localStorage.getItem(STORAGE_KEY)
    const params = new URLSearchParams(window.location.search)
    const bust = params.get('bust')

    if (stored && stored !== remote) {
      localStorage.setItem(STORAGE_KEY, remote)
      window.location.replace(rootUrl(remote))
      return
    }

    if (!stored) localStorage.setItem(STORAGE_KEY, remote)

    if (BUILD_VERSION && BUILD_VERSION !== remote) {
      window.location.replace(rootUrl(remote))
      return
    }

    if (bust && bust !== remote) {
      window.location.replace(rootUrl(remote))
    }
  } catch {
    /* offline or first visit */
  }
}

export function getBuildVersion(): string {
  return BUILD_VERSION
}

/** Hard reload at app root (Home tab). Use after tutorial graduation. */
export function reloadAppHome(): void {
  const base = basePath().replace(/\/?$/, '/')
  const url = `${base}?graduated=${Date.now()}`
  window.location.href = url
  window.setTimeout(() => {
    window.location.reload()
  }, 300)
}
