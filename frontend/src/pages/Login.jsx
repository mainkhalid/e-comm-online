import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Helmet } from 'react-helmet-async'
import { Mail, Lock, ArrowRight } from 'lucide-react'
import { loginUser } from '../store/slices/authSlice'
import toast from 'react-hot-toast'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const { loading, isAuthenticated, user } = useSelector(s => s.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.is_staff) {
        navigate('/admin', { replace: true })
      } else {
        const from = location.state?.from || '/'
        navigate(from, { replace: true })
      }
    }
  }, [isAuthenticated, user, navigate, location])

  const submit = async e => {
    e.preventDefault()
    try {
      const result = await dispatch(loginUser(form)).unwrap()
      toast.success('Welcome back!')
      // Redirect admin to admin dashboard, customers to previous page or home
      if (result?.is_staff) {
        navigate('/admin', { replace: true })
      } else {
        const from = location.state?.from || '/'
        navigate(from, { replace: true })
      }
    } catch (err) {
      const msg =
        err?.detail ||
        err?.non_field_errors?.[0] ||
        err?.message ||
        'Invalid credentials'
      toast.error(msg)
    }
  }

  return (
    <>
      <Helmet><title>Sign in — NixxonTechnologies</title></Helmet>
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4 py-16 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back</h1>
            <p className="text-gray-500">Sign in to Nixxon Technologies</p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
            <form onSubmit={submit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="email" required placeholder="you@example.com"
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="password" required placeholder="••••••••"
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
                </div>
              </div>
              <button type="submit" disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-orange-500 text-white font-bold py-3.5 rounded-xl hover:bg-orange-600 transition-all disabled:opacity-50 active:scale-[0.98] shadow-md shadow-orange-500/20">
                {loading ? 'Signing in…' : 'Sign In'}
                {!loading && <ArrowRight size={18} />}
              </button>
            </form>
          </div>

          <p className="text-center text-sm text-gray-500 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-orange-500 hover:text-orange-600 transition">Create one</Link>
          </p>
        </div>
      </div>
    </>
  )
}