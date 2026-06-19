import { describe, expect, it, vi } from 'vitest'
import { getCapturedInstallPrompt, subscribeInstallPrompt } from './installPromptCapture'
import type { BeforeInstallPromptEvent } from './installUtils'

describe('installPromptCapture', () => {
  it('stores and replays a captured beforeinstallprompt event', () => {
    const prompt = {
      preventDefault: vi.fn(),
      prompt: vi.fn(),
      userChoice: Promise.resolve({ outcome: 'accepted' as const }),
    } as unknown as BeforeInstallPromptEvent

    window.dispatchEvent(
      Object.assign(new Event('beforeinstallprompt'), prompt) as BeforeInstallPromptEvent,
    )

    expect(getCapturedInstallPrompt()).toBeTruthy()

    const listener = vi.fn()
    const unsubscribe = subscribeInstallPrompt(listener)
    expect(listener).toHaveBeenCalledOnce()
    unsubscribe()
  })
})
