import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { applyTheme, resolveTheme, watchSystemTheme } from './theme'

type Listener = (e: { matches: boolean }) => void

function stubMatchMedia(prefersDark: boolean) {
  const listeners: Listener[] = []
  const mql = {
    matches: prefersDark,
    addEventListener: vi.fn((_: string, l: Listener) => listeners.push(l)),
    removeEventListener: vi.fn((_: string, l: Listener) => {
      const i = listeners.indexOf(l)
      if (i >= 0) listeners.splice(i, 1)
    }),
    // For tests: fire change events manually.
    _fire: (matches: boolean) => listeners.forEach((l) => l({ matches })),
  }
  vi.stubGlobal(
    'matchMedia',
    vi.fn(() => mql),
  )
  // jsdom puts matchMedia on window — stub there too.
  Object.defineProperty(window, 'matchMedia', { configurable: true, writable: true, value: () => mql })
  return mql
}

afterEach(() => {
  vi.restoreAllMocks()
  document.documentElement.classList.remove('dark')
  document.documentElement.style.colorScheme = ''
})

describe('resolveTheme', () => {
  it('returns the explicit preference when not system', () => {
    stubMatchMedia(true)
    expect(resolveTheme('light')).toBe('light')
    expect(resolveTheme('dark')).toBe('dark')
  })

  it('returns dark when system prefers dark', () => {
    stubMatchMedia(true)
    expect(resolveTheme('system')).toBe('dark')
  })

  it('returns light when system prefers light', () => {
    stubMatchMedia(false)
    expect(resolveTheme('system')).toBe('light')
  })
})

describe('applyTheme', () => {
  it('adds .dark class and sets colorScheme for dark', () => {
    stubMatchMedia(false)
    applyTheme('dark')
    expect(document.documentElement.classList.contains('dark')).toBe(true)
    expect(document.documentElement.style.colorScheme).toBe('dark')
  })

  it('removes .dark class for light', () => {
    stubMatchMedia(false)
    document.documentElement.classList.add('dark')
    applyTheme('light')
    expect(document.documentElement.classList.contains('dark')).toBe(false)
    expect(document.documentElement.style.colorScheme).toBe('light')
  })

  it('resolves system preference', () => {
    stubMatchMedia(true)
    applyTheme('system')
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })
})

describe('watchSystemTheme', () => {
  beforeEach(() => {
    stubMatchMedia(false)
  })

  it('invokes onChange when system theme changes and preference is system', () => {
    const onChange = vi.fn()
    const mql = stubMatchMedia(false)
    const unsubscribe = watchSystemTheme(() => 'system', onChange)

    mql._fire(true)
    expect(onChange).toHaveBeenCalledTimes(1)

    unsubscribe()
    expect(mql.removeEventListener).toHaveBeenCalledTimes(1)
  })

  it('does NOT invoke onChange when preference is explicit light/dark', () => {
    const onChange = vi.fn()
    const mql = stubMatchMedia(false)
    watchSystemTheme(() => 'dark', onChange)
    mql._fire(true)
    expect(onChange).not.toHaveBeenCalled()
  })
})
