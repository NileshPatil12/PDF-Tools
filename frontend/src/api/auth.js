import api from './axios'
import { setAuthSession, clearAuthSession } from '../utils/authStorage'

export function getAuthErrorMessage(error, fallback = 'Something went wrong. Please try again.') {
  if (error.response?.data?.message) {
    return error.response.data.message
  }

  if (error.response?.status === 401) {
    return 'Invalid email or password'
  }

  if (error.code === 'ERR_NETWORK' || !error.response) {
    return 'Unable to reach server. Please check your connection and try again.'
  }

  return fallback
}

export async function loginUser(email, password) {
  const { data } = await api.post('/api/auth/login', { email, password })

  if (data?.data?.token) {
    setAuthSession(data.data.token, data.data.user)
  }

  return data
}

export async function registerUser(name, email, password) {
  const { data } = await api.post('/api/auth/register', { name, email, password })

  if (data?.data?.token) {
    setAuthSession(data.data.token, data.data.user)
  }

  return data
}

export function logoutUser() {
  clearAuthSession()
}
