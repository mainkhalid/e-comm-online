import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Helmet } from 'react-helmet-async'
import { User, Mail, Phone, Lock, ArrowRight } from 'lucide-react'
import { register } from '../api/services'
import toast from 'react-hot-toast'

export default function Register() {
  const [form, setForm] = useState({
    first_name: '', last_name: '', email: '',
    phone: '', password: '', password2: '',
  })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { isAuthenticated } = useSelector(s => s.auth)
  const set = k => e => setForm({ ...form, [k]: e.target.value })

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) navigate('/', { replace: true })
  }, [isAuthenticated, navigate])

  const submit = async e => {
    e.preventDefault()
    if (form.password !== form.password2) {
      toast.error('Passwords do not match')
      return
    }
    setLoading(true)
    try {
      await register(form)
      toast.success('Account created! Please sign in.')
      navigate('/login')
    } catch (err) {
      const errs = err.response?.data
      if (errs) Object.values(errs).flat().forEach(m => toast.error(String(m)))
      else toast.error('Registration failed')
    } finally {
      setLoading(false)
    }
  }

  const inputClass = "w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white"

  return (
    <>
      <Helmet><title>Create account — TechZone</title></Helmet>
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4 py-16 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-xl">T</span>
              </div>
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create account</h1>
            <p className="text-gray-500">Join thousands of TechZone customers</p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
            <form onSubmit={submit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">First name</label>
                  <input type="text" required placeholder="John" className={inputClass}
                    value={form.first_name} onChange={set('first_name')} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Last name</label>
                  <input type="text" required placeholder="Doe" className={inputClass}
                    value={form.last_name} onChange={set('last_name')} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
                <input type="email" required placeholder="you@example.com" className={inputClass}
                  value={form.email} onChange={set('email')} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Phone <span className="text-gray-400 text-xs">(optional)</span>
                </label>
                <input type="tel" placeholder="+254 7XX XXX XXX" className={inputClass}
                  value={form.phone} onChange={set('phone')} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
                <input type="password" required placeholder="Min. 8 characters" className={inputClass}
                  value={form.password} onChange={set('password')} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Confirm password</label>
                <input type="password" required placeholder="••••••••" className={inputClass}
                  value={form.password2} onChange={set('password2')} />
              </div>
              <button type="submit" disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white font-bold py-3.5 rounded-xl hover:bg-blue-700 transition-all disabled:opacity-50 active:scale-[0.98] shadow-md shadow-blue-600/20 mt-2">
                {loading ? 'Creating…' : 'Create Account'}
                {!loading && <ArrowRight size={18} />}
              </button>
            </form>
          </div>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-700 transition">Sign in</Link>
          </p>
        </div>
      </div>
    </>
  )
}