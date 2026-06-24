const TOKEN_KEY = 'token'
const USER_KEY = 'user'

export function setAuthSession(token, user) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token)
  }
  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user))
  }
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function getUser() {
  const stored = localStorage.getItem(USER_KEY)
  if (!stored) return null
  try {
    return JSON.parse(stored)
  } catch {
    return null
  }
}

export function clearAuthSession() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

function isTokenExpired(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      return true
    }
    return false
  } catch {
    return true
  }
}

export function isAuthenticated() {
  const token = getToken()
  if (!token) return false

  if (isTokenExpired(token)) {
    clearAuthSession()
    return false
  }

  return true
}
