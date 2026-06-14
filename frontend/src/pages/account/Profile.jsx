import { useState, useEffect, useRef } from 'react'
import { Helmet } from 'react-helmet-async'
import { useSelector, useDispatch } from 'react-redux'
import {
  User, MapPin, Plus, Edit2, Trash2, Save,
  X, Camera, Check, Lock, Eye, EyeOff,
} from 'lucide-react'
import toast from 'react-hot-toast'
import {
  getProfile, updateProfile, getAddresses,
  createAddress, updateAddress, deleteAddress, changePassword,
} from '../../api/services'
import { fetchProfile } from '../../store/slices/authSlice'

const COUNTIES = [
  'Nairobi','Mombasa','Kisumu','Nakuru','Eldoret','Thika','Malindi',
  'Kakamega','Meru','Nyeri','Machakos','Kilifi','Kisii','Uasin Gishu',
  'Kiambu','Kajiado','Makueni','Bungoma','Busia','Siaya','Homa Bay',
  'Migori','Bomet','Kericho','Nandi','Murang\'a','Kirinyaga','Nyandarua',
  'Laikipia','Nakuru','Trans Nzoia','West Pokot','Turkana','Marsabit',
  'Isiolo','Mandera','Wajir','Garissa','Tana River','Lamu','Taita Taveta',
  'Kwale','Kilifi','Baringo','Elgeyo-Marakwet','Samburu','Vihiga',
].sort()

function SectionCard({ title, icon: Icon, children, action }) {
  return (
    <div
      className="rounded-2xl overflow-hidden mb-5"
      style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
    >
      <div
        className="flex items-center justify-between px-5 py-4 border-b"
        style={{ borderColor: 'var(--border)', background: 'var(--bg)' }}
      >
        <div className="flex items-center gap-2">
          <Icon size={15} style={{ color: 'var(--orange)' }} />
          <h2 className="text-sm font-bold" style={{ color: 'var(--text)' }}>{title}</h2>
        </div>
        {action}
      </div>
      <div className="p-5">{children}</div>
    </div>
  )
}

function InputField({ label, required, ...props }) {
  return (
    <div>
      <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>
        {label}{required && <span style={{ color: 'var(--danger)' }}> *</span>}
      </label>
      <input required={required} className="input w-full text-sm" {...props} />
    </div>
  )
}

export default function Profile() {
  const dispatch = useDispatch()
  const { user } = useSelector(s => s.auth)
  const fileRef  = useRef()

  const [profile, setProfile]   = useState({ first_name: '', last_name: '', phone: '', email: '' })
  const [addresses, setAddresses] = useState([])
  const [loading, setLoading]   = useState(true)
  const [saving, setSaving]     = useState(false)
  const [saved, setSaved]       = useState(false)

  const [showAddrModal, setShowAddrModal] = useState(false)
  const [editAddr, setEditAddr]   = useState(null)
  const [addrForm, setAddrForm]   = useState({
    address_type: 'shipping', full_name: '', phone: '',
    street: '', city: '', county: '', is_default: false,
  })
  const [addrSaving, setAddrSaving] = useState(false)

  const [pwForm, setPwForm]   = useState({ current_password: '', new_password: '', confirm: '' })
  const [pwSaving, setPwSaving] = useState(false)
  const [showPw, setShowPw]   = useState({ current: false, new: false, confirm: false })

  useEffect(() => {
    Promise.all([
      getProfile().then(({ data }) => setProfile({
        first_name: data.first_name || '',
        last_name:  data.last_name  || '',
        phone:      data.phone      || '',
        email:      data.email      || '',
      })),
      getAddresses().then(({ data }) => setAddresses(data.results || data)),
    ]).catch(() => {}).finally(() => setLoading(false))
  }, [])

  /* ── Profile save ── */
  const handleSaveProfile = async (e) => {
    e.preventDefault(); setSaving(true)
    try {
      await updateProfile({ first_name: profile.first_name, last_name: profile.last_name, phone: profile.phone })
      dispatch(fetchProfile())
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
      toast.success('Profile updated!')
    } catch { toast.error('Failed to update profile') }
    finally { setSaving(false) }
  }

  /* ── Address CRUD ── */
  const openAddAddr = () => {
    setEditAddr(null)
    setAddrForm({ address_type: 'shipping', full_name: '', phone: '', street: '', city: '', county: '', is_default: false })
    setShowAddrModal(true)
  }

  const openEditAddr = (addr) => {
    setEditAddr(addr)
    setAddrForm({ address_type: addr.address_type, full_name: addr.full_name, phone: addr.phone, street: addr.street, city: addr.city, county: addr.county, is_default: addr.is_default })
    setShowAddrModal(true)
  }

  const handleSaveAddr = async (e) => {
    e.preventDefault(); setAddrSaving(true)
    try {
      const { data } = editAddr
        ? await updateAddress(editAddr.id, addrForm)
        : await createAddress(addrForm)
      setAddresses(prev => editAddr ? prev.map(a => a.id === data.id ? data : a) : [...prev, data])
      toast.success(editAddr ? 'Address updated!' : 'Address added!')
      setShowAddrModal(false)
    } catch { toast.error('Failed to save address') }
    finally { setAddrSaving(false) }
  }

  const handleDeleteAddr = async (id) => {
    if (!confirm('Delete this address?')) return
    try {
      await deleteAddress(id)
      setAddresses(prev => prev.filter(a => a.id !== id))
      toast.success('Address removed')
    } catch { toast.error('Failed to delete') }
  }

  /* ── Password change ── */
  const handleChangePassword = async (e) => {
    e.preventDefault()
    if (pwForm.new_password !== pwForm.confirm) { toast.error('Passwords do not match'); return }
    if (pwForm.new_password.length < 8) { toast.error('Password must be at least 8 characters'); return }
    setPwSaving(true)
    try {
      await changePassword({ current_password: pwForm.current_password, new_password: pwForm.new_password })
      toast.success('Password changed successfully!')
      setPwForm({ current_password: '', new_password: '', confirm: '' })
    } catch (err) {
      toast.error(err.response?.data?.current_password?.[0] || 'Incorrect current password')
    } finally { setPwSaving(false) }
  }

  const initials = [profile.first_name?.[0], profile.last_name?.[0]].filter(Boolean).join('').toUpperCase() || 'U'

  if (loading) {
    return (
      <div className="space-y-4">
        {[120, 280, 200].map(h => (
          <div key={h} className="skeleton rounded-2xl" style={{ height: `${h}px` }} />
        ))}
      </div>
    )
  }

  return (
    <>
      <Helmet><title>My Profile — Nixxon Technologies</title></Helmet>

      {/* ── Profile info ── */}
      <SectionCard title="Personal Information" icon={User}>
        <form onSubmit={handleSaveProfile}>
          <div className="flex items-center gap-4 mb-6">
            {/* Avatar */}
            <div className="relative">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold"
                style={{ background: 'var(--navy)' }}
              >
                {initials}
              </div>
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center"
                style={{ background: 'var(--orange)' }}
              >
                <Camera size={11} color="white" />
              </button>
              <input ref={fileRef} type="file" accept="image/*" className="hidden"
                onChange={() => toast('Avatar upload coming soon!')} />
            </div>
            <div>
              <p className="font-bold text-sm" style={{ color: 'var(--text)' }}>
                {profile.first_name} {profile.last_name}
              </p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{profile.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <InputField label="First Name" required value={profile.first_name}
              onChange={e => setProfile({ ...profile, first_name: e.target.value })}
              placeholder="First name" />
            <InputField label="Last Name" value={profile.last_name}
              onChange={e => setProfile({ ...profile, last_name: e.target.value })}
              placeholder="Last name" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>
                Email
              </label>
              <input
                value={profile.email}
                disabled
                className="input w-full text-sm opacity-60 cursor-not-allowed"
              />
            </div>
            <InputField label="Phone" value={profile.phone}
              onChange={e => setProfile({ ...profile, phone: e.target.value })}
              placeholder="+254 7XX XXX XXX" />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="btn-primary disabled:opacity-60"
          >
            {saving ? (
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="60 20" />
              </svg>
            ) : saved ? <Check size={15} /> : <Save size={15} />}
            {saving ? 'Saving…' : saved ? 'Saved!' : 'Save Changes'}
          </button>
        </form>
      </SectionCard>

      {/* ── Addresses ── */}
      <SectionCard
        title="Saved Addresses"
        icon={MapPin}
        action={
          <button onClick={openAddAddr} className="btn-ghost text-xs gap-1 py-1.5">
            <Plus size={13} /> Add Address
          </button>
        }
      >
        {addresses.length === 0 ? (
          <div className="text-center py-8">
            <MapPin size={32} style={{ color: 'var(--border)', margin: '0 auto 10px' }} />
            <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>No saved addresses</p>
            <button onClick={openAddAddr} className="btn-primary text-sm">Add Your First Address</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {addresses.map(addr => (
              <div
                key={addr.id}
                className="relative p-4 rounded-xl"
                style={{ background: 'var(--bg)', border: `1.5px solid ${addr.is_default ? 'var(--orange)' : 'var(--border)'}` }}
              >
                {addr.is_default && (
                  <span
                    className="absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full"
                    style={{ background: 'rgba(255,107,43,0.12)', color: 'var(--orange)' }}
                  >
                    Default
                  </span>
                )}
                <p className="text-sm font-bold mb-0.5 pr-14" style={{ color: 'var(--text)' }}>{addr.full_name}</p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{addr.street}</p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{addr.city}, {addr.county}</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{addr.phone}</p>
                <div className="flex items-center gap-3 mt-3">
                  <button onClick={() => openEditAddr(addr)}
                    className="flex items-center gap-1 text-xs font-semibold transition-colors"
                    style={{ color: 'var(--text-muted)' }}>
                    <Edit2 size={11} /> Edit
                  </button>
                  <button onClick={() => handleDeleteAddr(addr.id)}
                    className="flex items-center gap-1 text-xs font-semibold transition-colors"
                    style={{ color: 'var(--danger)' }}>
                    <Trash2 size={11} /> Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </SectionCard>

      {/* ── Password change ── */}
      <SectionCard title="Password & Security" icon={Lock}>
        <form onSubmit={handleChangePassword} className="max-w-md space-y-4">
          {[
            { key: 'current_password', label: 'Current Password' },
            { key: 'new_password',     label: 'New Password' },
            { key: 'confirm',          label: 'Confirm New Password' },
          ].map(({ key, label }) => (
            <div key={key}>
              <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>
                {label}
              </label>
              <div className="relative">
                <input
                  required
                  type={showPw[key] ? 'text' : 'password'}
                  value={pwForm[key]}
                  onChange={e => setPwForm({ ...pwForm, [key]: e.target.value })}
                  className="input w-full text-sm pr-10"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  onClick={() => setShowPw(p => ({ ...p, [key]: !p[key] }))}
                >
                  {showPw[key]
                    ? <EyeOff size={15} style={{ color: 'var(--text-muted)' }} />
                    : <Eye size={15} style={{ color: 'var(--text-muted)' }} />}
                </button>
              </div>
            </div>
          ))}
          <button type="submit" disabled={pwSaving} className="btn-navy disabled:opacity-60">
            {pwSaving ? 'Updating…' : 'Update Password'}
          </button>
        </form>
      </SectionCard>

      {/* ── Address modal ── */}
      {showAddrModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(15,23,42,0.60)', backdropFilter: 'blur(4px)' }}
          onClick={() => setShowAddrModal(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl overflow-hidden shadow-2xl animate-slide-down"
            style={{ background: 'var(--card)' }}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: 'var(--border)', background: 'var(--bg)' }}>
              <h3 className="text-sm font-bold" style={{ color: 'var(--text)' }}>
                {editAddr ? 'Edit Address' : 'New Address'}
              </h3>
              <button onClick={() => setShowAddrModal(false)}>
                <X size={17} style={{ color: 'var(--text-muted)' }} />
              </button>
            </div>
            <form onSubmit={handleSaveAddr} className="p-5 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <InputField label="Full Name" required value={addrForm.full_name}
                  onChange={e => setAddrForm({ ...addrForm, full_name: e.target.value })}
                  placeholder="Full name" />
                <InputField label="Phone" required value={addrForm.phone}
                  onChange={e => setAddrForm({ ...addrForm, phone: e.target.value })}
                  placeholder="07XX XXX XXX" />
              </div>
              <InputField label="Street Address" required value={addrForm.street}
                onChange={e => setAddrForm({ ...addrForm, street: e.target.value })}
                placeholder="House/Building, Street" />
              <div className="grid grid-cols-2 gap-3">
                <InputField label="City / Town" required value={addrForm.city}
                  onChange={e => setAddrForm({ ...addrForm, city: e.target.value })}
                  placeholder="City or Town" />
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>
                    County <span style={{ color: 'var(--danger)' }}>*</span>
                  </label>
                  <select required value={addrForm.county}
                    onChange={e => setAddrForm({ ...addrForm, county: e.target.value })}
                    className="input w-full text-sm">
                    <option value="">Select county</option>
                    {COUNTIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={addrForm.is_default}
                  onChange={e => setAddrForm({ ...addrForm, is_default: e.target.checked })}
                  className="rounded" />
                <span className="text-sm" style={{ color: 'var(--text-muted)' }}>Set as default address</span>
              </label>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={addrSaving} className="btn-primary flex-1 justify-center disabled:opacity-60">
                  {addrSaving ? 'Saving…' : editAddr ? 'Update' : 'Save Address'}
                </button>
                <button type="button" onClick={() => setShowAddrModal(false)} className="btn-outline flex-1 justify-center">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}