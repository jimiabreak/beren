export interface ConsentPreferences {
  analytics: boolean
  marketing: boolean
}

const COOKIE_NAME = 'cookie-consent'

export function getConsent(): ConsentPreferences | null {
  if (typeof document === 'undefined') return null
  const cookie = document.cookie
    .split('; ')
    .find((c) => c.startsWith(`${COOKIE_NAME}=`))
  if (!cookie) return null
  try {
    return JSON.parse(decodeURIComponent(cookie.split('=')[1]))
  } catch {
    return null
  }
}

export function setConsent(prefs: ConsentPreferences) {
  const value = encodeURIComponent(JSON.stringify(prefs))
  document.cookie = `${COOKIE_NAME}=${value}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`
}

export function hasConsented(): boolean {
  return getConsent() !== null
}
