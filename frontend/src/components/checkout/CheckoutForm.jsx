import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

export default function CheckoutForm({ onSubmit, loading, addresses = [] }) {
  const [selectedAddressId, setSelectedAddressId] = useState(null)
  const [showNewAddress, setShowNewAddress] = useState(addresses.length === 0)
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    street: '',
    city: '',
    county: '',
    zipCode: '',
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({
      addressId: !showNewAddress ? selectedAddressId : null,
      address: showNewAddress ? formData : null,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-6">Shipping Address</h3>

      {/* Existing addresses */}
      {addresses.length > 0 && !showNewAddress && (
        <div className="space-y-4 mb-6">
          {addresses.map((addr) => (
            <label
              key={addr.id}
              className="flex items-start gap-4 p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition"
            >
              <input
                type="radio"
                name="address"
                value={addr.id}
                checked={selectedAddressId === addr.id}
                onChange={() => setSelectedAddressId(addr.id)}
                className="mt-1"
              />
              <div className="flex-1">
                <p className="font-semibold text-gray-900">{addr.full_name}</p>
                <p className="text-sm text-gray-600">{addr.street}</p>
                <p className="text-sm text-gray-600">
                  {addr.city}, {addr.county}
                </p>
                <p className="text-sm text-gray-600">{addr.phone}</p>
              </div>
            </label>
          ))}

          <button
            type="button"
            onClick={() => setShowNewAddress(true)}
            className="w-full py-2 border border-blue-300 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition"
          >
            Use Different Address
          </button>
        </div>
      )}

      {/* New address form */}
      {showNewAddress && (
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              placeholder="John Doe"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="+254 700 000 000"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Street Address
            </label>
            <input
              type="text"
              name="street"
              value={formData.street}
              onChange={handleInputChange}
              placeholder="123 Main Street"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                City
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                placeholder="Nairobi"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                County
              </label>
              <input
                type="text"
                name="county"
                value={formData.county}
                onChange={handleInputChange}
                placeholder="Nairobi County"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {addresses.length > 0 && (
            <button
              type="button"
              onClick={() => setShowNewAddress(false)}
              className="w-full py-2 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition"
            >
              Use Saved Address
            </button>
          )}
        </div>
      )}

      {/* Submit button */}
      <button
        type="submit"
        disabled={loading || (showNewAddress && !formData.fullName) || (!showNewAddress && !selectedAddressId)}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-bold py-3 px-4 rounded-lg transition disabled:cursor-not-allowed"
      >
        {loading ? 'Processing...' : 'Continue to Payment'}
      </button>
    </form>
  )
}
