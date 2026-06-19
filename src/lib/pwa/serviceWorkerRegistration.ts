const GH_PAGES_ORIGIN = 'https://descentmooses.github.io'

/** Register the service worker as early as possible — required for Chrome installability. */
export function registerServiceWorkerEarly(): void {
  if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) return

  const base = import.meta.env.BASE_URL.endsWith('/')
    ? import.meta.env.BASE_URL
    : `${import.meta.env.BASE_URL}/`

  void navigator.serviceWorker.register(`${base}sw.js`, { scope: base }).catch(() => {
    /* offline or unsupported */
  })
}

export function absoluteManifestUrl(): string | null {
  if (!import.meta.env.PROD) return null
  if (import.meta.env.BASE_URL === '/KAGE/') {
    return `${GH_PAGES_ORIGIN}/KAGE/manifest.json`
  }
  return null
}

/** Inject absolute manifest link on GitHub Pages (Android WebAPK requirement). */
export function ensureManifestLink(): void {
  const href = absoluteManifestUrl()
  if (!href) return

  let link = document.querySelector<HTMLLinkElement>('link[rel="manifest"]')
  if (!link) {
    link = document.createElement('link')
    link.rel = 'manifest'
    document.head.appendChild(link)
  }
  if (link.getAttribute('href') !== href) {
    link.setAttribute('href', href)
  }
}
