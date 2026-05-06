import { useState, useEffect } from 'react'
import { Users, Search, ShoppingBag, Mail, Phone } from 'lucide-react'
import { adminGetCustomers } from '../../api/services'

const fmt = p => new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', minimumFractionDigits: 0 }).format(p)

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)

  const load = () => {
    setLoading(true)
    adminGetCustomers({ search })
      .then(({ data }) => setCustomers(data.results || data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [search])

  return (
    <div className="space-y-5 fade-up">
      <div>
        <h2 className="font-serif text-2xl text-white mb-0.5">Customers</h2>
        <p className="text-[13px] text-[#6a6a7e]">{customers.length} registered customers</p>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 surface px-4 py-2.5 max-w-sm">
        <Search size={15} className="text-[#5a5a6e] shrink-0" />
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search customers…"
          className="bg-transparent outline-none text-[14px] text-white placeholder-[#5a5a6e] w-full" />
      </div>

      {/* Table */}
      <div className="surface overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.06]">
                {['Customer', 'Email', 'Phone', 'Orders', 'Total Spent', 'Joined', 'Status'].map(h => (
                  <th key={h} className="text-left px-4 py-3.5 text-[11px] font-bold uppercase tracking-widest text-[#5a5a6e]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(6)].map((_, i) => (
                  <tr key={i} className="border-b border-white/[0.04]">
                    {[...Array(7)].map((_, j) => <td key={j} className="px-4 py-3"><div className="skeleton h-4 rounded" /></td>)}
                  </tr>
                ))
              ) : customers.length === 0 ? (
                <tr><td colSpan={7} className="px-4 py-16 text-center text-[#5a5a6e] text-[14px]">
                  <Users size={32} className="mx-auto mb-3 text-[#2a2a30]" />
                  No customers found
                </td></tr>
              ) : customers.map(c => (
                <tr key={c.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors cursor-pointer"
                  onClick={() => setSelected(selected?.id === c.id ? null : c)}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-[12px]"
                        style={{ background: '#e8192c' }}>
                        {(c.first_name || 'U')[0].toUpperCase()}
                      </div>
                      <span className="text-[13px] font-medium text-white">{c.full_name || '—'}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[12px] text-[#9898a6]">{c.email}</td>
                  <td className="px-4 py-3 text-[12px] text-[#6a6a7e]">{c.phone || '—'}</td>
                  <td className="px-4 py-3">
                    <span className="text-[12px] font-semibold text-white">{c.order_count || 0}</span>
                  </td>
                  <td className="px-4 py-3 text-[13px] font-semibold text-white">{fmt(c.total_spent || 0)}</td>
                  <td className="px-4 py-3 text-[12px] text-[#6a6a7e]">{new Date(c.date_joined).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ${c.is_active ? 'text-green-400 bg-green-400/10' : 'text-red-400 bg-red-400/10'}`}>
                      {c.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer detail modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-5">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setSelected(null)} />
          <div className="relative surface p-6 w-full max-w-md">
            <div className="text-center mb-5">
              <div className="w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center text-white font-bold text-2xl"
                style={{ background: '#e8192c' }}>
                {(selected.first_name || 'U')[0].toUpperCase()}
              </div>
              <h3 className="font-serif text-xl text-white">{selected.full_name || 'Unnamed'}</h3>
              <p className="text-[13px] text-[#6a6a7e]">Customer since {new Date(selected.date_joined).toLocaleDateString()}</p>
            </div>
            <div className="space-y-3 text-[13px]">
              <div className="flex items-center gap-3 py-2 border-b border-white/[0.06]">
                <Mail size={14} className="text-[#5a5a6e]" />
                <span className="text-[#9898a6]">{selected.email}</span>
              </div>
              <div className="flex items-center gap-3 py-2 border-b border-white/[0.06]">
                <Phone size={14} className="text-[#5a5a6e]" />
                <span className="text-[#9898a6]">{selected.phone || 'Not provided'}</span>
              </div>
              <div className="flex items-center gap-3 py-2 border-b border-white/[0.06]">
                <ShoppingBag size={14} className="text-[#5a5a6e]" />
                <span className="text-[#9898a6]">{selected.order_count || 0} orders — {fmt(selected.total_spent || 0)} spent</span>
              </div>
            </div>
            <button onClick={() => setSelected(null)} className="btn-ghost w-full mt-5">Close</button>
          </div>
        </div>
      )}
    </div>
  )
}
