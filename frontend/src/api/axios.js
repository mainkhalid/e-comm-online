import axios from 'axios'

const api = axios.create({
  baseURL: '/api/v1',
  headers: { 'Content-Type': 'application/json' },
})

// ── Request interceptor — attach access token ─────────────────
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// ── Refresh token queue — prevents race conditions ────────────
// If multiple requests fail with 401 simultaneously, only ONE
// refresh call is made. Others wait for it to complete.
let isRefreshing = false
let failedQueue = []

function processQueue(error, token = null) {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error)
    else resolve(token)
  })
  failedQueue = []
}

// ── Response interceptor — handle 401 with token refresh ──────
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config

    // Only handle 401s that haven't been retried yet
    // Also skip the refresh endpoint itself to avoid infinite loop
    if (
      error.response?.status !== 401 ||
      original._retry ||
      original.url?.includes('/auth/token/refresh/') ||
      original.url?.includes('/auth/logout/')
    ) {
      return Promise.reject(error)
    }

    if (isRefreshing) {
      // Queue this request until refresh completes
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject })
      })
        .then((token) => {
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

      const { data } = await axios.post('/api/v1/auth/token/refresh/', { refresh })
      const newToken = data.access

      localStorage.setItem('access_token', newToken)
      api.defaults.headers.common.Authorization = `Bearer ${newToken}`
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