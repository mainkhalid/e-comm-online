import api from './axios'

// ── Products ─────────────────────────────────────────────────
export const getProducts = (params) => api.get('/products/', { params })
export const getProduct = (slug) => api.get(`/products/${slug}/`)
export const getFeaturedProducts = () => api.get('/products/featured/')
export const getCategories = () => api.get('/products/categories/')
export const getBrands = () => api.get('/products/brands/')

// ── Product listing helpers (reuse /products/ with different params) ───
export const getNewArrivals = (limit = 12) =>
  api.get('/products/', { params: { ordering: '-created_at', page_size: limit } })
export const getOnSaleProducts = (limit = 12) =>
  api.get('/products/', { params: { on_sale: true, page_size: limit } })
export const getTopRatedProducts = (limit = 12) =>
  api.get('/products/', { params: { ordering: '-average_rating', page_size: limit } })
export const getProductsByCategory = (category, limit = 12) =>
  api.get('/products/', {
    params: {
      category__slug: category,   
      page_size: limit,
    },
  })
// ── Auth ─────────────────────────────────────────────────────
export const register = (data) => api.post('/auth/register/', data)
export const login = (data) => api.post('/auth/login/', data)
export const getProfile = () => api.get('/auth/profile/')
export const updateProfile = (data) => api.patch('/auth/profile/', data)
export const changePassword = (data) => api.post('/auth/change-password/', data)

// ── Addresses ────────────────────────────────────────────────
export const getAddresses = () => api.get('/auth/addresses/')
export const createAddress = (data) => api.post('/auth/addresses/', data)
export const updateAddress = (id, data) => api.patch(`/auth/addresses/${id}/`, data)
export const deleteAddress = (id) => api.delete(`/auth/addresses/${id}/`)

// ── Cart ─────────────────────────────────────────────────────
export const getCart = () => api.get('/orders/cart/')
export const addToCart = (id, qty = 1) => api.post('/orders/cart/', { product_id: id, quantity: qty })
export const updateCartItem = (itemId, qty) => api.patch('/orders/cart/', { item_id: itemId, quantity: qty })
export const removeFromCart = (itemId) => api.delete('/orders/cart/', { data: { item_id: itemId } })

// ── Orders ───────────────────────────────────────────────────
export const getOrders = () => api.get('/orders/')
export const getOrder = (num) => api.get(`/orders/${num}/`)
export const createOrder = (data) => api.post('/orders/', data)

// ── Payments ─────────────────────────────────────────────────
export const initiatePayment = (data) => api.post('/payments/mpesa/initiate/', data)
export const checkPaymentStatus = (num) => api.get(`/payments/status/${num}/`)

// ── Reviews ──────────────────────────────────────────────────
export const getReviews = (slug) => api.get(`/reviews/${slug}/`)
export const createReview = (slug, data) => api.post(`/reviews/${slug}/`, data)

// ── Admin — Dashboard ────────────────────────────────────────
export const adminGetStats = () => api.get('/admin/stats/')
export const adminGetAnalytics = (params) => api.get('/admin/analytics/', { params })

// ── Admin — Products ─────────────────────────────────────────
export const adminGetProducts = (params) => api.get('/admin/products/', { params })
export const adminGetProduct = (slug) => api.get(`/admin/products/${slug}/`)
export const adminCreateProduct = (data) => api.post('/admin/products/', data, {
  headers: { 'Content-Type': 'multipart/form-data' },
})
export const adminUpdateProduct = (slug, data) => api.patch(`/admin/products/${slug}/`, data, {
  headers: { 'Content-Type': 'multipart/form-data' },
})
export const adminDeleteProduct = (slug) => api.delete(`/admin/products/${slug}/`)

// ── Admin — Product Bulk Actions ─────────────────────────────
export const adminBulkAction = (data) => api.post('/admin/products/bulk/', data)

// ── Admin — Product CSV ──────────────────────────────────────
export const adminExportCSV = () => api.get('/admin/products/export/', { responseType: 'blob' })
export const adminImportCSV = (file) => {
  const fd = new FormData()
  fd.append('file', file)
  return api.post('/admin/products/import/', fd, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

// ── Admin — Product Images ───────────────────────────────────
export const adminDeleteImage = (id) => api.delete(`/admin/images/${id}/`)

// ── Admin — Orders ───────────────────────────────────────────
export const adminGetOrders = (params) => api.get('/admin/orders/', { params })
export const adminUpdateOrder = (num, data) => api.patch(`/admin/orders/${num}/`, data)

// ── Admin — Customers ────────────────────────────────────────
export const adminGetCustomers = (params) => api.get('/admin/customers/', { params })

// ── Admin — Categories ───────────────────────────────────────
export const adminGetCategories = () => api.get('/admin/categories/')
export const adminCreateCategory = (data) => api.post('/admin/categories/', data)
export const adminUpdateCategory = (id, data) => api.patch(`/admin/categories/${id}/`, data)
export const adminDeleteCategory = (id) => api.delete(`/admin/categories/${id}/`)

// ── Admin — Brands ───────────────────────────────────────────
export const adminGetBrands = (params) => api.get('/admin/brands/', { params })
export const adminCreateBrand = (data) => api.post('/admin/brands/', data)
export const adminUpdateBrand = (slug, data) => api.patch(`/admin/brands/${slug}/`, data)
export const adminDeleteBrand = (slug) => api.delete(`/admin/brands/${slug}/`)

// ── Admin — Reviews ──────────────────────────────────────────
export const adminGetReviews = () => api.get('/admin/reviews/')
export const adminApproveReview = (id, data) => api.patch(`/admin/reviews/${id}/approve/`, data)
export const adminDeleteReview = (id) => api.delete(`/admin/reviews/${id}/`)

// ── Admin — Settings ─────────────────────────────────────────
export const adminGetSettings = () => api.get('/admin/settings/')
export const adminUpdateSettings = (data) => api.patch('/admin/settings/', data)