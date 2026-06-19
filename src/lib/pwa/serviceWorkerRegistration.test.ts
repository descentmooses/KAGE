import { describe, expect, it } from 'vitest'
import { absoluteManifestUrl } from './serviceWorkerRegistration'

describe('serviceWorkerRegistration', () => {
  it('resolves absolute manifest URL for GitHub Pages production base', () => {
    expect(absoluteManifestUrl()).toBeNull()
  })
})
