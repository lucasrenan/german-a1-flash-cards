import type { ThemePreference } from '../types'

const DARK_QUERY = '(prefers-color-scheme: dark)'

export function resolveTheme(preference: ThemePreference): 'light' | 'dark' {
  if (preference === 'system') {
    return window.matchMedia(DARK_QUERY).matches ? 'dark' : 'light'
  }
  return preference
}

export function applyTheme(preference: ThemePreference): void {
  const resolved = resolveTheme(preference)
  const root = document.documentElement
  root.classList.toggle('dark', resolved === 'dark')
  root.style.colorScheme = resolved
}

export function watchSystemTheme(
  getPreference: () => ThemePreference,
  onChange: () => void,
): () => void {
  const mql = window.matchMedia(DARK_QUERY)
  const handler = () => {
    if (getPreference() === 'system') onChange()
  }
  mql.addEventListener('change', handler)
  return () => mql.removeEventListener('change', handler)
}
