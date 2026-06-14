import { useState, useEffect } from 'react'
import {
  Settings as SettingsIcon, Store, CreditCard, Truck,
  Save, Check, Globe, Phone, Mail, MapPin,
  Facebook, Twitter, Instagram, AlertTriangle, Shield,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { adminGetSettings, adminUpdateSettings } from '../../api/services'

const TABS = [
  { key: 'general',  label: 'General',          icon: Store },
  { key: 'payments', label: 'Payments',         icon: CreditCard },
  { key: 'shipping', label: 'Shipping & Tax',   icon: Truck },
]

/* ── Reusable field components ─────────────────────────────── */
function Field({ label, hint, children }) {
  return (
    <div>
      <label className="block text-xs font-bold uppercase tracking-wider mb-1.5"
        style={{ color: 'var(--text-muted)' }}>
        {label}
      </label>
      {children}
      {hint && <p className="text-[10px] mt-1" style={{ color: 'var(--text-light)' }}>{hint}</p>}
    </div>
  )
}

function Toggle({ checked, onChange, label, description }) {
  return (
    <div className="flex items-start gap-3 cursor-pointer" onClick={() => onChange(!checked)}>
      <div className="w-9 h-5 rounded-full relative transition-colors flex-shrink-0 mt-0.5"
        style={{ background: checked ? 'var(--orange)' : 'var(--border)' }}>
        <div className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all"
          style={{ left: checked ? '18px' : '2px' }} />
      </div>
      <div>
        <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{label}</p>
        {description && <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{description}</p>}
      </div>
    </div>
  )
}

function SectionCard({ title, icon: Icon, children }) {
  return (
    <div className="rounded-xl p-5 space-y-4"
      style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
      <div className="flex items-center gap-2 mb-1">
        {Icon && <Icon size={15} style={{ color: 'var(--orange)' }} />}
        <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text)' }}>{title}</h3>
      </div>
      {children}
    </div>
  )
}


export default function AdminSettings() {
  const [tab, setTab] = useState('general')
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const set = (k, v) => setData(d => ({ ...d, [k]: v }))

  useEffect(() => {
    adminGetSettings()
      .then(({ data: d }) => setData(d))
      .catch(() => toast.error('Failed to load settings'))
      .finally(() => setLoading(false))
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      const { data: updated } = await adminUpdateSettings(data)
      setData(updated)
      toast.success('Settings saved!')
    } catch (err) {
      const detail = err.response?.data
      toast.error(typeof detail === 'string' ? detail : 'Failed to save settings')
    } finally { setSaving(false) }
  }

  if (loading || !data) {
    return (
      <div className="space-y-5 fade-up">
        <div className="skeleton h-8 w-40 rounded-lg" />
        <div className="skeleton h-4 w-60 rounded" />
        <div className="grid grid-cols-3 gap-3 mt-4">
          {[...Array(3)].map((_, i) => <div key={i} className="skeleton h-10 rounded-lg" />)}
        </div>
        <div className="skeleton h-80 rounded-xl mt-4" />
      </div>
    )
  }

  return (
    <div className="space-y-5 fade-up">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>Settings</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>
            Manage your store configuration
          </p>
        </div>
        <button onClick={handleSave} disabled={saving}
          className="btn-primary text-sm min-w-[130px] justify-center disabled:opacity-60">
          {saving ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="60 20" />
              </svg>
              Saving…
            </span>
          ) : (
            <span className="flex items-center gap-2"><Save size={15} /> Save Changes</span>
          )}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button key={key} onClick={() => setTab(key)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all"
            style={{
              background: tab === key ? 'var(--navy)' : 'var(--card)',
              color: tab === key ? 'white' : 'var(--text-muted)',
              border: `1px solid ${tab === key ? 'var(--navy)' : 'var(--border)'}`,
            }}>
            <Icon size={14} /> {label}
          </button>
        ))}
      </div>

      {/* ── TAB: General ── */}
      {tab === 'general' && (
        <div className="space-y-5">

          <SectionCard title="Store Identity" icon={Store}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Store Name">
                <input value={data.store_name || ''} onChange={e => set('store_name', e.target.value)}
                  placeholder="Nixxon Technologies" className="input w-full text-sm" />
              </Field>
              <Field label="Tagline">
                <input value={data.store_tagline || ''} onChange={e => set('store_tagline', e.target.value)}
                  placeholder="Computers, Laptops & Accessories" className="input w-full text-sm" />
              </Field>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Currency Code" hint="ISO code, e.g. KES, USD, EUR">
                <input value={data.currency_code || ''} onChange={e => set('currency_code', e.target.value)}
                  placeholder="KES" className="input w-full text-sm" maxLength={5} />
              </Field>
              <Field label="Currency Symbol">
                <input value={data.currency_symbol || ''} onChange={e => set('currency_symbol', e.target.value)}
                  placeholder="KSh" className="input w-full text-sm" maxLength={5} />
              </Field>
            </div>
          </SectionCard>

          <SectionCard title="Contact Information" icon={Phone}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Email">
                <div className="relative">
                  <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                  <input value={data.store_email || ''} onChange={e => set('store_email', e.target.value)}
                    placeholder="info@nixxon technologies.co.ke" className="input w-full text-sm pl-9" />
                </div>
              </Field>
              <Field label="Phone">
                <div className="relative">
                  <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                  <input value={data.store_phone || ''} onChange={e => set('store_phone', e.target.value)}
                    placeholder="+254 700 000 000" className="input w-full text-sm pl-9" />
                </div>
              </Field>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Field label="Address">
                <input value={data.address_line || ''} onChange={e => set('address_line', e.target.value)}
                  placeholder="Street address" className="input w-full text-sm" />
              </Field>
              <Field label="City">
                <input value={data.city || ''} onChange={e => set('city', e.target.value)}
                  placeholder="Nairobi" className="input w-full text-sm" />
              </Field>
              <Field label="Country">
                <input value={data.country || ''} onChange={e => set('country', e.target.value)}
                  placeholder="Kenya" className="input w-full text-sm" />
              </Field>
            </div>
          </SectionCard>

          <SectionCard title="Social Media" icon={Globe}>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Field label="Facebook">
                <div className="relative">
                  <Facebook size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                  <input value={data.facebook_url || ''} onChange={e => set('facebook_url', e.target.value)}
                    placeholder="https://facebook.com/..." className="input w-full text-sm pl-9" />
                </div>
              </Field>
              <Field label="Twitter / X">
                <div className="relative">
                  <Twitter size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                  <input value={data.twitter_url || ''} onChange={e => set('twitter_url', e.target.value)}
                    placeholder="https://x.com/..." className="input w-full text-sm pl-9" />
                </div>
              </Field>
              <Field label="Instagram">
                <div className="relative">
                  <Instagram size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                  <input value={data.instagram_url || ''} onChange={e => set('instagram_url', e.target.value)}
                    placeholder="https://instagram.com/..." className="input w-full text-sm pl-9" />
                </div>
              </Field>
            </div>
          </SectionCard>

          <SectionCard title="Maintenance" icon={AlertTriangle}>
            <Toggle
              checked={data.maintenance_mode || false}
              onChange={v => set('maintenance_mode', v)}
              label="Maintenance Mode"
              description="When enabled, the storefront shows a 'coming soon' page to visitors. Admins can still access the dashboard."
            />
          </SectionCard>
        </div>
      )}

      {/* ── TAB: Payments ── */}
      {tab === 'payments' && (
        <div className="space-y-5">

          {/* M-Pesa */}
          <SectionCard title="M-Pesa (Daraja API)" icon={CreditCard}>
            <Toggle
              checked={data.mpesa_enabled !== false}
              onChange={v => set('mpesa_enabled', v)}
              label="Enable M-Pesa Payments"
              description="Allow customers to pay via M-Pesa STK Push at checkout"
            />

            {data.mpesa_enabled !== false && (
              <div className="space-y-4 pt-2">
                {/* Environment */}
                <Field label="Environment">
                  <div className="flex gap-2">
                    {[
                      { v: 'sandbox', label: '🧪 Sandbox (Testing)', desc: 'Use test credentials' },
                      { v: 'production', label: '🔒 Production (Live)', desc: 'Real M-Pesa transactions' },
                    ].map(({ v, label, desc }) => (
                      <button key={v} type="button" onClick={() => set('mpesa_environment', v)}
                        className="flex-1 p-3 rounded-xl text-left transition-all"
                        style={{
                          border: `2px solid ${data.mpesa_environment === v ? 'var(--orange)' : 'var(--border)'}`,
                          background: data.mpesa_environment === v ? 'rgba(255,107,43,0.04)' : 'var(--card)',
                        }}>
                        <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{label}</p>
                        <p className="text-[10px] mt-0.5" style={{ color: 'var(--text-muted)' }}>{desc}</p>
                        {data.mpesa_environment === v && (
                          <Check size={14} className="mt-1" style={{ color: 'var(--orange)' }} />
                        )}
                      </button>
                    ))}
                  </div>
                </Field>

                {data.mpesa_environment === 'production' && (
                  <div className="flex items-start gap-2 px-3.5 py-2.5 rounded-xl text-xs"
                    style={{ background: 'rgba(220,38,38,0.06)', border: '1px solid rgba(220,38,38,0.15)', color: 'var(--danger)' }}>
                    <AlertTriangle size={14} className="flex-shrink-0 mt-0.5" />
                    <span>You are in <strong>production mode</strong>. Real money will be charged. Ensure your credentials are correct.</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Consumer Key" hint="From Daraja Developer Portal">
                    <input value={data.mpesa_consumer_key || ''} onChange={e => set('mpesa_consumer_key', e.target.value)}
                      placeholder="Consumer key..." className="input w-full text-sm font-mono" />
                  </Field>
                  <Field label="Consumer Secret">
                    <input type="password" value={data.mpesa_consumer_secret || ''} onChange={e => set('mpesa_consumer_secret', e.target.value)}
                      placeholder="Consumer secret..." className="input w-full text-sm font-mono" />
                  </Field>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Shortcode (Paybill/Till)" hint="Your M-Pesa business number">
                    <input value={data.mpesa_shortcode || ''} onChange={e => set('mpesa_shortcode', e.target.value)}
                      placeholder="174379" className="input w-full text-sm font-mono" />
                  </Field>
                  <Field label="Passkey">
                    <input type="password" value={data.mpesa_passkey || ''} onChange={e => set('mpesa_passkey', e.target.value)}
                      placeholder="Lipa Na M-Pesa passkey..." className="input w-full text-sm font-mono" />
                  </Field>
                </div>
                <Field label="Callback URL" hint="Safaricom will send payment confirmations to this URL. Must be publicly accessible (HTTPS).">
                  <input value={data.mpesa_callback_url || ''} onChange={e => set('mpesa_callback_url', e.target.value)}
                    placeholder="https://yourdomain.com/api/v1/payments/mpesa/callback/" className="input w-full text-sm font-mono" />
                </Field>
              </div>
            )}
          </SectionCard>

          {/* Status summary */}
          <div className="rounded-xl p-4 flex items-center gap-3"
            style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
            <Shield size={18} style={{ color: data.mpesa_enabled ? 'var(--success)' : 'var(--text-muted)' }} />
            <div>
              <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>Payment Status</p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                M-Pesa: {data.mpesa_enabled !== false ? (
                  <span style={{ color: 'var(--success)' }}>Enabled ({data.mpesa_environment || 'sandbox'})</span>
                ) : (
                  <span style={{ color: 'var(--danger)' }}>Disabled</span>
                )}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB: Shipping & Tax ── */}
      {tab === 'shipping' && (
        <div className="space-y-5">

          <SectionCard title="Shipping Rates" icon={Truck}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Default Shipping Cost (KSh)" hint="Flat rate for standard shipping">
                <input type="number" min="0" step="1" value={data.default_shipping_cost || ''}
                  onChange={e => set('default_shipping_cost', e.target.value)}
                  placeholder="300" className="input w-full text-sm" />
              </Field>
              <Field label="Free Shipping Threshold (KSh)" hint="Orders above this amount get free delivery. Set 0 to disable.">
                <input type="number" min="0" step="1" value={data.free_shipping_threshold || ''}
                  onChange={e => set('free_shipping_threshold', e.target.value)}
                  placeholder="10000" className="input w-full text-sm" />
              </Field>
            </div>

            {/* Preview */}
            {data.default_shipping_cost && (
              <div className="rounded-lg px-3.5 py-2.5 text-xs space-y-1"
                style={{ background: 'rgba(255,107,43,0.05)', border: '1px solid rgba(255,107,43,0.12)' }}>
                <p style={{ color: 'var(--text-muted)' }}>
                  <strong>Preview:</strong> Orders pay{' '}
                  <strong style={{ color: 'var(--text)' }}>KSh {Number(data.default_shipping_cost).toLocaleString()}</strong>{' '}
                  for shipping.
                  {Number(data.free_shipping_threshold) > 0 && (<>
                    {' '}Orders over{' '}
                    <strong style={{ color: 'var(--success)' }}>KSh {Number(data.free_shipping_threshold).toLocaleString()}</strong>{' '}
                    get <strong style={{ color: 'var(--success)' }}>free delivery</strong>.
                  </>)}
                </p>
              </div>
            )}
          </SectionCard>

          <SectionCard title="Tax Configuration" icon={CreditCard}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="VAT / Tax Rate (%)" hint="Standard VAT in Kenya is 16%">
                <div className="relative">
                  <input type="number" min="0" max="100" step="0.01" value={data.tax_rate || ''}
                    onChange={e => set('tax_rate', e.target.value)}
                    placeholder="16.00" className="input w-full text-sm pr-8" />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold"
                    style={{ color: 'var(--text-muted)' }}>%</span>
                </div>
              </Field>
              <div className="flex items-end pb-2">
                <Toggle
                  checked={data.tax_inclusive !== false}
                  onChange={v => set('tax_inclusive', v)}
                  label="Prices Include Tax"
                  description="If enabled, displayed prices already include VAT"
                />
              </div>
            </div>

            {/* Tax info */}
            <div className="rounded-lg px-3.5 py-2.5 text-xs"
              style={{ background: 'rgba(37,99,235,0.05)', border: '1px solid rgba(37,99,235,0.12)' }}>
              <p style={{ color: 'var(--text-muted)' }}>
                {data.tax_inclusive !== false ? (
                  <>All product prices <strong style={{ color: 'var(--text)' }}>already include</strong> {data.tax_rate || 16}% VAT. No extra tax is added at checkout.</>
                ) : (
                  <>{data.tax_rate || 16}% VAT will be <strong style={{ color: 'var(--text)' }}>added on top</strong> of product prices at checkout.</>
                )}
              </p>
            </div>
          </SectionCard>
        </div>
      )}

      {/* Bottom save bar (mobile-friendly) */}
      <div className="sm:hidden sticky bottom-4 z-10">
        <button onClick={handleSave} disabled={saving}
          className="btn-primary w-full py-3 justify-center text-sm disabled:opacity-60">
          {saving ? 'Saving…' : '💾 Save Changes'}
        </button>
      </div>
    </div>
  )
}
