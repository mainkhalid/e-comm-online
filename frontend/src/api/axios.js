import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || '/api/v1'

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

// ── Attach token ─────────────────────────────────────────────
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers = config.headers || {}
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// ── Refresh queue ────────────────────────────────────────────
let isRefreshing = false
let failedQueue = []

function processQueue(error, token = null) {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error)
    else resolve(token)
  })
  failedQueue = []
}

// ── Response interceptor ─────────────────────────────────────
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config
    const url = original?.url || ''

    // Ignore non-401 errors + already retried requests
    if (
      error.response?.status !== 401 ||
      original._retry ||
      url.includes('/auth/token/refresh/') ||
      url.includes('/auth/logout/')
    ) {
      return Promise.reject(error)
    }

    // Queue requests while refreshing
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject })
      })
        .then((token) => {
          original.headers = original.headers || {}
          original.headers.Authorization = `Bearer ${token}`
          return api(original)
        })
        .catch((err) => Promise.reject(err))
    }

    original._retry = true
    isRefreshing = true

    try {
      const refresh = localStorage.getItem('refresh_token')
      if (!refresh) throw new Error('No refresh token')

      // ✅ use SAME api instance (important fix)
      const { data } = await api.post('/auth/token/refresh/', { refresh })

      const newToken = data.access

      localStorage.setItem('access_token', newToken)

      api.defaults.headers.common.Authorization = `Bearer ${newToken}`
      original.headers = original.headers || {}
      original.headers.Authorization = `Bearer ${newToken}`

      processQueue(null, newToken)
      return api(original)
    } catch (err) {
      processQueue(err, null)

      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')

      window.location.href = '/login'

      return Promise.reject(err)
    } finally {
      isRefreshing = false
    }
  }
)

export default api