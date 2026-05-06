import { useState } from 'react'
import { Edit2, Trash2, Plus, Search, Filter } from 'lucide-react'

export default function AdminProducts2() {
  const [products, setProducts] = useState([
    { id: 1, name: 'MacBook Pro 16"', sku: 'MB16-2024', price: 'KSh 299,999', stock: 15, status: 'Active', category: 'Laptops' },
    { id: 2, name: 'Dell XPS 13', sku: 'DXP-13-2024', price: 'KSh 199,999', stock: 22, status: 'Active', category: 'Laptops' },
    { id: 3, name: 'iPad Air', sku: 'IP-AIR-2024', price: 'KSh 89,999', stock: 0, status: 'Out of Stock', category: 'Tablets' },
  ])

  const [searchQuery, setSearchQuery] = useState('')

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter(p => p.id !== id))
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 ml-0 lg:ml-64 p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600 mt-2">Manage your product inventory</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Plus size={20} />
          Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded border border-gray-300 focus:outline-none focus:border-green-600"
            />
          </div>
          <select className="px-4 py-2 rounded border border-gray-300 focus:outline-none focus:border-green-600">
            <option>All Categories</option>
            <option>Laptops</option>
            <option>Tablets</option>
            <option>Accessories</option>
          </select>
          <select className="px-4 py-2 rounded border border-gray-300 focus:outline-none focus:border-green-600">
            <option>All Status</option>
            <option>Active</option>
            <option>Out of Stock</option>
            <option>Discontinued</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Product Name</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">SKU</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Category</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Price</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Stock</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">{product.name}</div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{product.sku}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{product.category}</td>
                <td className="px-6 py-4 text-sm font-semibold text-gray-900">{product.price}</td>
                <td className="px-6 py-4">
                  <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                    product.stock > 10 ? 'bg-green-100 text-green-700' :
                    product.stock > 0 ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {product.stock} units
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                    product.status === 'Active' ? 'bg-green-100 text-green-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {product.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">
                  <div className="flex items-center gap-3">
                    <button className="text-blue-600 hover:text-blue-700 font-semibold">
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="text-red-600 hover:text-red-700 font-semibold"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-6 flex items-center justify-between">
        <p className="text-sm text-gray-600">Showing 1 to {products.length} of {products.length} products</p>
        <div className="flex gap-2">
          <button className="px-4 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium">
            Previous
          </button>
          <button className="px-4 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium">
            Next
          </button>
        </div>
      </div>
    </div>
  )
}
