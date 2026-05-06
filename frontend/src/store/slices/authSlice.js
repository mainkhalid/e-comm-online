import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { login as loginApi, getProfile } from '../../api/services'

export const loginUser = createAsyncThunk('auth/login', async (creds, { rejectWithValue }) => {
  try {
    const { data } = await loginApi(creds)
    localStorage.setItem('access_token', data.access)
    localStorage.setItem('refresh_token', data.refresh)
    return data.user
  } catch (err) { return rejectWithValue(err.response?.data || 'Login failed') }
})

export const fetchProfile = createAsyncThunk('auth/fetchProfile', async (_, { rejectWithValue }) => {
  try { const { data } = await getProfile(); return data }
  catch (err) { return rejectWithValue(err.response?.data) }
})

const authSlice = createSlice({
  name: 'auth',
  initialState: { user: null, isAuthenticated: !!localStorage.getItem('access_token'), loading: false, error: null },
  reducers: {
    logout(state) {
      state.user = null; state.isAuthenticated = false
      localStorage.removeItem('access_token'); localStorage.removeItem('refresh_token')
    },
  },
  extraReducers: (b) => {
    b.addCase(loginUser.pending,   (s)    => { s.loading = true; s.error = null })
     .addCase(loginUser.fulfilled, (s, a) => { s.loading = false; s.user = a.payload; s.isAuthenticated = true })
     .addCase(loginUser.rejected,  (s, a) => { s.loading = false; s.error = a.payload })
     .addCase(fetchProfile.fulfilled, (s, a) => { s.user = a.payload })
  },
})
export const { logout } = authSlice.actions
export default authSlice.reducer
