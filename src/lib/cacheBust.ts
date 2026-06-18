const BUILD_VERSION =
  document.querySelector('meta[name="build-version"]')?.getAttribute('content') ?? ''

/** Detect a newer deploy and reload when GitHub Pages serves stale index.html. */
export async function checkForStaleCache(): Promise<void> {
  if (!BUILD_VERSION) return

  try {
    const base = import.meta.env.BASE_URL
    const url = `${base}version.json?t=${Date.now()}`
    const res = await fetch(url, { cache: 'no-store' })
    if (!res.ok) return

    const data = (await res.json()) as { version?: string }
    if (data.version && data.version !== BUILD_VERSION) {
      window.location.reload()
    }
  } catch {
    /* offline or first visit — ignore */
  }
}
