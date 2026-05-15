import { useState, useEffect } from 'react'
import { Search, Users, X, Mail, Phone, MapPin, Package, TrendingUp } from 'lucide-react'
import { adminGetCustomers } from '../../api/services'

const fmt = p => new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', minimumFractionDigits: 0 }).format(p)

function CustomerPanel({ customer, onClose }) {
  return (
    <div className="fixed inset-0 z-40 flex justify-end"
      style={{ background: 'rgba(15,23,42,0.50)', backdropFilter: 'blur(2px)' }}
      onClick={onClose}>
      <div className="w-full max-w-sm h-full overflow-y-auto shadow-2xl"
        style={{ background: 'var(--card)' }}
        onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b sticky top-0"
          style={{ borderColor: 'var(--border)', background: 'var(--card)' }}>
          <h3 className="text-sm font-bold" style={{ color: 'var(--text)' }}>Customer Profile</h3>
          <button onClick={onClose} className="btn-icon"><X size={17} /></button>
        </div>

        <div className="p-5 space-y-5">
          {/* Avatar + name */}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full flex items-center justify-center text-white text-xl font-bold"
              style={{ background: 'var(--navy)' }}>
              {(customer.first_name?.[0] || customer.email?.[0] || 'U').toUpperCase()}
            </div>
            <div>
              <p className="font-bold" style={{ color: 'var(--text)' }}>
                {customer.first_name} {customer.last_name}
              </p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                Member since {new Date(customer.date_joined).toLocaleDateString('en-KE', { month: 'short', year: 'numeric' })}
              </p>
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-2.5">
            {[
              { icon: Mail,  text: customer.email },
              { icon: Phone, text: customer.phone || 'Not provided' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2.5 text-sm" style={{ color: 'var(--text-muted)' }}>
                <Icon size={14} style={{ color: 'var(--orange)', flexShrink: 0 }} />
                {text}
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Total Orders', value: customer.order_count ?? '—', icon: Package, color: '#2563EB', bg: 'rgba(37,99,235,0.08)' },
              { label: 'Total Spent',  value: customer.total_spent ? fmt(customer.total_spent) : '—', icon: TrendingUp, color: '#16A34A', bg: 'rgba(22,163,74,0.08)' },
            ].map(({ label, value, icon: Icon, color, bg }) => (
              <div key={label} className="p-3.5 rounded-xl" style={{ background: bg }}>
                <Icon size={16} style={{ color, marginBottom: 6 }} />
                <p className="text-base font-bold" style={{ color: 'var(--text)' }}>{value}</p>
                <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{label}</p>
              </div>
            ))}
          </div>

          {/* Addresses */}
          {customer.addresses?.length > 0 && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>
                Addresses
              </p>
              {customer.addresses.map((addr, i) => (
                <div key={i} className="p-3 rounded-xl text-xs mb-2" style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                  <p className="font-semibold mb-0.5" style={{ color: 'var(--text)' }}>{addr.full_name}</p>
                  <p>{addr.street}, {addr.city}, {addr.county}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading]   = useState(true)
  const [search, setSearch]     = useState('')
  const [selected, setSelected] = useState(null)
  const [page, setPage]         = useState(1)
  const [count, setCount]       = useState(0)

  const load = () => {
    setLoading(true)
    const params = { page, page_size: 20 }
    if (search) params.search = search
    adminGetCustomers(params)
      .then(({ data }) => { setCustomers(data.results || data); setCount(data.count || 0) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [page])

  const PAGES = Math.ceil(count / 20)

  return (
    <div className="space-y-5 fade-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>Customers</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>{count.toLocaleString()} registered customers</p>
        </div>
      </div>

      {/* Search */}
      <div className="rounded-xl p-4" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
        <form onSubmit={e => { e.preventDefault(); setPage(1); load() }} className="relative max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search name, email, phone…" className="input pl-9 w-full text-sm" />
        </form>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ background: 'var(--bg)', borderBottom: '1px solid var(--border)' }}>
                {['Customer', 'Email', 'Phone', 'Joined', 'Orders', 'Total Spent', ''].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider"
                    style={{ color: 'var(--text-muted)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(8)].map((_, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                    {[...Array(7)].map((_, j) => (
                      <td key={j} className="px-4 py-3.5">
                        <div className="skeleton h-4 rounded" style={{ width: j === 0 ? '120px' : '80px' }} />
                      </td>
                    ))}
                  </tr>
                ))
              ) : customers.length === 0 ? (
                <tr><td colSpan={7} className="px-4 py-14 text-center">
                  <Users size={36} style={{ color: 'var(--border)', margin: '0 auto 12px' }} />
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No customers found</p>
                </td></tr>
              ) : customers.map(c => (
                <tr key={c.id} className="cursor-pointer"
                  style={{ borderBottom: '1px solid var(--border)' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--bg)'}
                  onMouseLeave={e => e.currentTarget.style.background = ''}
                  onClick={() => setSelected(c)}>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                        style={{ background: 'var(--navy)' }}>
                        {(c.first_name?.[0] || c.email?.[0] || 'U').toUpperCase()}
                      </div>
                      <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>
                        {c.first_name} {c.last_name}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-sm" style={{ color: 'var(--text-muted)' }}>{c.email}</td>
                  <td className="px-4 py-3.5 text-sm" style={{ color: 'var(--text-muted)' }}>{c.phone || '—'}</td>
                  <td className="px-4 py-3.5 text-xs" style={{ color: 'var(--text-muted)' }}>
                    {new Date(c.date_joined).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-4 py-3.5 text-sm font-semibold" style={{ color: 'var(--text)' }}>
                    {c.order_count ?? '—'}
                  </td>
                  <td className="px-4 py-3.5 text-sm font-semibold" style={{ color: 'var(--success)' }}>
                    {c.total_spent ? fmt(c.total_spent) : '—'}
                  </td>
                  <td className="px-4 py-3.5">
                    <button
                      onClick={e => { e.stopPropagation(); setSelected(c) }}
                      className="text-xs font-semibold px-2.5 py-1 rounded-lg hover:bg-slate-100 transition-colors"
                      style={{ color: 'var(--text-muted)' }}>
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {PAGES > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t"
            style={{ borderColor: 'var(--border)', background: 'var(--bg)' }}>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Page {page} of {PAGES}</p>
            <div className="flex gap-2">
              <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="btn-outline text-xs py-1.5 px-3 disabled:opacity-40">← Prev</button>
              <button disabled={page === PAGES} onClick={() => setPage(p => p + 1)} className="btn-outline text-xs py-1.5 px-3 disabled:opacity-40">Next →</button>
            </div>
          </div>
        )}
      </div>

      {selected && <CustomerPanel customer={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}