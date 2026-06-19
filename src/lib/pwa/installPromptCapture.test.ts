import { describe, expect, it, vi } from 'vitest'
import {
  clearCapturedInstallPrompt,
  getCapturedInstallPrompt,
  runNativeInstallPrompt,
  subscribeInstallPrompt,
} from './installPromptCapture'
import type { BeforeInstallPromptEvent } from './installUtils'

describe('installPromptCapture', () => {
  it('stores and replays a captured beforeinstallprompt event', () => {
    clearCapturedInstallPrompt()
    const prompt = {
      preventDefault: vi.fn(),
      prompt: vi.fn().mockResolvedValue(undefined),
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

  it('runs native install prompt and clears capture', async () => {
    const prompt = {
      prompt: vi.fn().mockResolvedValue(undefined),
      userChoice: Promise.resolve({ outcome: 'accepted' as const }),
    } as unknown as BeforeInstallPromptEvent

    const result = await runNativeInstallPrompt(prompt)
    expect(result.outcome).toBe('accepted')
    expect(prompt.prompt).toHaveBeenCalledOnce()
    expect(getCapturedInstallPrompt()).toBeNull()
  })
})
