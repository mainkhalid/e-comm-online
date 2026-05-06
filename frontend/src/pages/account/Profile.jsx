import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { User, MapPin, Plus, Edit2, Trash2, Save, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { getProfile, updateProfile, getAddresses, createAddress, updateAddress, deleteAddress } from '../../api/services'
import { fetchProfile } from '../../store/slices/authSlice'

export default function Profile() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { isAuthenticated, user } = useSelector(s => s.auth)

  const [profile, setProfile] = useState({ first_name: '', last_name: '', phone: '' })
  const [addresses, setAddresses] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [editAddr, setEditAddr] = useState(null)
  const [addrForm, setAddrForm] = useState({
    address_type: 'shipping', full_name: '', phone: '', street: '', city: '', county: '', is_default: false
  })

  useEffect(() => {
    if (!isAuthenticated) { navigate('/login'); return }
    Promise.all([
      getProfile().then(({ data }) => setProfile({ first_name: data.first_name, last_name: data.last_name, phone: data.phone || '' })),
      getAddresses().then(({ data }) => setAddresses(data.results || data)),
    ]).catch(() => {}).finally(() => setLoading(false))
  }, [isAuthenticated])

  const handleSaveProfile = async (e) => {
    e.preventDefault(); setSaving(true)
    try {
      await updateProfile(profile)
      dispatch(fetchProfile())
      toast.success('Profile updated!')
    } catch { toast.error('Failed to update profile') }
    finally { setSaving(false) }
  }

  const loadAddresses = () => {
    getAddresses().then(({ data }) => setAddresses(data.results || data)).catch(() => {})
  }

  const openAddAddress = () => {
    setEditAddr(null)
    setAddrForm({ address_type: 'shipping', full_name: '', phone: '', street: '', city: '', county: '', is_default: false })
    setShowAddressForm(true)
  }

  const openEditAddress = (addr) => {
    setEditAddr(addr)
    setAddrForm({
      address_type: addr.address_type, full_name: addr.full_name, phone: addr.phone,
      street: addr.street, city: addr.city, county: addr.county, is_default: addr.is_default
    })
    setShowAddressForm(true)
  }

  const handleSaveAddress = async (e) => {
    e.preventDefault()
    try {
      if (editAddr) { await updateAddress(editAddr.id, addrForm) }
      else { await createAddress(addrForm) }
      toast.success(editAddr ? 'Address updated' : 'Address added')
      setShowAddressForm(false)
      loadAddresses()
    } catch { toast.error('Failed to save address') }
  }

  const handleDeleteAddress = async (id) => {
    if (!confirm('Delete this address?')) return
    try { await deleteAddress(id); toast.success('Address deleted'); loadAddresses() }
    catch { toast.error('Failed to delete') }
  }

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full"></div>
    </div>
  )

  return (
    <>
      <Helmet><title>My Profile — TechZone</title></Helmet>
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">My Profile</h1>

          {/* Profile form */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg">
                {(user?.first_name || 'U')[0].toUpperCase()}
              </div>
              <div>
                <p className="font-bold text-gray-900">{user?.full_name || user?.email}</p>
                <p className="text-sm text-gray-500">{user?.email}</p>
              </div>
            </div>
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">First Name</label>
                  <input value={profile.first_name} onChange={e => setProfile({ ...profile, first_name: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Last Name</label>
                  <input value={profile.last_name} onChange={e => setProfile({ ...profile, last_name: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Phone</label>
                <input value={profile.phone} onChange={e => setProfile({ ...profile, phone: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="+254 7XX XXX XXX" />
              </div>
              <button type="submit" disabled={saving}
                className="flex items-center gap-2 bg-blue-600 text-white font-semibold px-6 py-2.5 rounded-lg hover:bg-blue-700 transition disabled:opacity-50">
                <Save size={16} /> {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>

          {/* Addresses */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2"><MapPin size={20} /> Addresses</h2>
              <button onClick={openAddAddress}
                className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 transition">
                <Plus size={16} /> Add Address
              </button>
            </div>

            {addresses.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No addresses saved yet.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {addresses.map(addr => (
                  <div key={addr.id} className="border border-gray-200 rounded-xl p-4 relative">
                    {addr.is_default && (
                      <span className="absolute top-3 right-3 text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">Default</span>
                    )}
                    <p className="font-semibold text-gray-900">{addr.full_name}</p>
                    <p className="text-sm text-gray-600 mt-1">{addr.street}</p>
                    <p className="text-sm text-gray-600">{addr.city}, {addr.county}</p>
                    <p className="text-sm text-gray-500 mt-1">{addr.phone}</p>
                    <div className="flex gap-2 mt-3">
                      <button onClick={() => openEditAddress(addr)} className="text-xs font-semibold text-gray-600 hover:text-blue-600 flex items-center gap-1">
                        <Edit2 size={12} /> Edit
                      </button>
                      <button onClick={() => handleDeleteAddress(addr.id)} className="text-xs font-semibold text-gray-600 hover:text-red-600 flex items-center gap-1">
                        <Trash2 size={12} /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Address form modal */}
            {showAddressForm && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-black/50" onClick={() => setShowAddressForm(false)} />
                <div className="relative bg-white rounded-2xl p-6 w-full max-w-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900">{editAddr ? 'Edit Address' : 'New Address'}</h3>
                    <button onClick={() => setShowAddressForm(false)}><X size={20} className="text-gray-400" /></button>
                  </div>
                  <form onSubmit={handleSaveAddress} className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name *</label>
                      <input required value={addrForm.full_name} onChange={e => setAddrForm({ ...addrForm, full_name: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Phone *</label>
                      <input required value={addrForm.phone} onChange={e => setAddrForm({ ...addrForm, phone: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Street Address *</label>
                      <input required value={addrForm.street} onChange={e => setAddrForm({ ...addrForm, street: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">City *</label>
                        <input required value={addrForm.city} onChange={e => setAddrForm({ ...addrForm, city: e.target.value })}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">County *</label>
                        <input required value={addrForm.county} onChange={e => setAddrForm({ ...addrForm, county: e.target.value })}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      </div>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={addrForm.is_default} onChange={e => setAddrForm({ ...addrForm, is_default: e.target.checked })}
                        className="w-4 h-4 accent-blue-600 rounded" />
                      <span className="text-sm text-gray-700">Set as default address</span>
                    </label>
                    <div className="flex gap-3">
                      <button type="submit" className="flex-1 bg-blue-600 text-white font-semibold py-2.5 rounded-lg hover:bg-blue-700 transition">
                        {editAddr ? 'Update' : 'Save'}
                      </button>
                      <button type="button" onClick={() => setShowAddressForm(false)} className="flex-1 border border-gray-300 text-gray-700 font-semibold py-2.5 rounded-lg hover:bg-gray-50 transition">
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
