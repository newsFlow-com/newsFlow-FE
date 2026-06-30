import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080'

export const apiClient = axios.create({ baseURL: API_URL })
export const aiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_AI_URL ?? 'http://localhost:8000',
})

const AUTH_STORE_KEY = 'newsflow-auth'

function getStoredToken(field: 'accessToken' | 'refreshToken'): string | null {
  if (typeof window === 'undefined') return null
  try {
    return JSON.parse(localStorage.getItem(AUTH_STORE_KEY) ?? '{}')?.state?.[field] ?? null
  } catch {
    return null
  }
}

function updateStoredAccessToken(token: string) {
  try {
    const raw = JSON.parse(localStorage.getItem(AUTH_STORE_KEY) ?? '{"state":{}}')
    raw.state.accessToken = token
    localStorage.setItem(AUTH_STORE_KEY, JSON.stringify(raw))
  } catch {}
}

if (typeof window !== 'undefined') {
  apiClient.interceptors.request.use((config) => {
    const token = getStoredToken('accessToken')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  })

  apiClient.interceptors.response.use(
    (res) => res,
    async (error) => {
      const original = error.config
      if (error.response?.status === 401 && !original._retry) {
        original._retry = true
        const refreshToken = getStoredToken('refreshToken')
        if (!refreshToken) {
          window.location.href = '/login'
          return Promise.reject(error)
        }
        try {
          const { data } = await axios.post(`${API_URL}/api/v1/auth/refresh`, { refreshToken })
          updateStoredAccessToken(data.accessToken)
          original.headers.Authorization = `Bearer ${data.accessToken}`
          return apiClient(original)
        } catch {
          localStorage.removeItem(AUTH_STORE_KEY)
          window.location.href = '/login'
          return Promise.reject(error)
        }
      }
      return Promise.reject(error)
    }
  )
}
