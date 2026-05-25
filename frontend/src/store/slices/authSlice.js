import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { login as loginApi, getProfile } from '../../api/services'
import api from '../../api/axios'

// ── Thunks ───────────────────────────────────────────────────

export const loginUser = createAsyncThunk('auth/login', async (creds, { rejectWithValue }) => {
  try {
    const { data } = await loginApi(creds)
    localStorage.setItem('access_token', data.access)
    localStorage.setItem('refresh_token', data.refresh)
    return data.user
  } catch (err) {
    return rejectWithValue(err.response?.data || { detail: 'Login failed' })
  }
})

export const logoutUser = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
  try {
    const refresh = localStorage.getItem('refresh_token')
    if (refresh) {
      // Blacklist the refresh token on the backend
      await api.post('/auth/logout/', { refresh })
    }
  } catch {
    // Even if backend call fails, clear local state
  } finally {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
  }
})

export const fetchProfile = createAsyncThunk('auth/fetchProfile', async (_, { rejectWithValue }) => {
  try {
    const { data } = await getProfile()
    return data
  } catch (err) {
    return rejectWithValue(err.response?.data)
  }
})

// ── Called on app init to verify token is still valid ────────
export const initAuth = createAsyncThunk('auth/init', async (_, { dispatch }) => {
  const token = localStorage.getItem('access_token')
  if (!token) return null
  try {
    const { data } = await getProfile()
    return data
  } catch {
    // Token expired or invalid — clear storage
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    return null
  }
})

// ── Slice ─────────────────────────────────────────────────────

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    isAuthenticated: false, // always false on init — verified by initAuth
    loading: false,
    initializing: true,     // true until initAuth completes
    error: null,
  },
  reducers: {
    // Sync logout (fallback if thunk fails)
    logout(state) {
      state.user = null
      state.isAuthenticated = false
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
    },
  },
  extraReducers: (b) => {
    // ── initAuth ──
    b.addCase(initAuth.pending,   (s)    => { s.initializing = true })
     .addCase(initAuth.fulfilled, (s, a) => {
       s.initializing = false
       s.user = a.payload
       s.isAuthenticated = !!a.payload
     })
     .addCase(initAuth.rejected,  (s)    => {
       s.initializing = false
       s.isAuthenticated = false
       s.user = null
     })

    // ── loginUser ──
     .addCase(loginUser.pending,   (s)    => { s.loading = true; s.error = null })
     .addCase(loginUser.fulfilled, (s, a) => {
       s.loading = false
       s.user = a.payload
       s.isAuthenticated = true
     })
     .addCase(loginUser.rejected,  (s, a) => {
       s.loading = false
       s.error = a.payload
     })

    // ── logoutUser ──
     .addCase(logoutUser.fulfilled, (s) => {
       s.user = null
       s.isAuthenticated = false
     })

    // ── fetchProfile ──
     .addCase(fetchProfile.fulfilled, (s, a) => {
       s.user = a.payload
       s.isAuthenticated = true
     })
  },
})

export const { logout } = authSlice.actions
export default authSlice.reducer