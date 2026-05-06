import api from './axios'

// ── Products ─────────────────────────────────────────────
export const getProducts         = (params) => api.get('/products/', { params })
export const getProduct          = (slug)   => api.get(`/products/${slug}/`)
export const getFeaturedProducts = () => api.get('/products/featured/').then(res => res.data)
export const getCategories       = ()       => api.get('/products/categories/')
export const getBrands           = ()       => api.get('/products/brands/')

// ── Auth ─────────────────────────────────────────────────
export const register            = (data)   => api.post('/auth/register/', data)
export const login               = (data)   => api.post('/auth/login/', data)
export const getProfile          = ()       => api.get('/auth/profile/')
export const updateProfile       = (data)   => api.patch('/auth/profile/', data)

// ── Addresses ────────────────────────────────────────────
export const getAddresses        = ()       => api.get('/auth/addresses/')
export const createAddress       = (data)   => api.post('/auth/addresses/', data)
export const updateAddress       = (id, d)  => api.patch(`/auth/addresses/${id}/`, d)
export const deleteAddress       = (id)     => api.delete(`/auth/addresses/${id}/`)

// ── Cart ─────────────────────────────────────────────────
export const getCart             = ()           => api.get('/orders/cart/')
export const addToCart           = (id, qty=1)  => api.post('/orders/cart/', { product_id: id, quantity: qty })
export const updateCartItem      = (itemId, qty) => api.patch('/orders/cart/', { item_id: itemId, quantity: qty })
export const removeFromCart      = (itemId)     => api.delete('/orders/cart/', { data: { item_id: itemId } })

// ── Orders ───────────────────────────────────────────────
export const getOrders           = ()       => api.get('/orders/')
export const createOrder         = (data)   => api.post('/orders/', data)
export const getOrder            = (num)    => api.get(`/orders/${num}/`)

// ── Payments ─────────────────────────────────────────────
export const initiatePayment     = (data)   => api.post('/payments/mpesa/initiate/', data)
export const checkPaymentStatus  = (num)    => api.get(`/payments/status/${num}/`)

// ── Reviews ──────────────────────────────────────────────
export const getReviews          = (slug)        => api.get(`/reviews/${slug}/`)
export const createReview        = (slug, data)  => api.post(`/reviews/${slug}/`, data)

// ── Admin API ────────────────────────────────────────────
export const adminGetStats       = ()       => api.get('/admin/stats/')
export const adminGetProducts    = (params) => api.get('/admin/products/', { params })
export const adminCreateProduct  = (data)   => api.post('/admin/products/', data)
export const adminUpdateProduct  = (slug, d) => api.patch(`/admin/products/${slug}/`, d)
export const adminDeleteProduct  = (slug)   => api.delete(`/admin/products/${slug}/`)
export const adminGetOrders      = (params) => api.get('/admin/orders/', { params })
export const adminUpdateOrder    = (num, d) => api.patch(`/admin/orders/${num}/`, d)
export const adminGetCustomers   = (params) => api.get('/admin/customers/', { params })
export const adminGetCategories  = ()       => api.get('/admin/categories/')
export const adminCreateCategory = (data)   => api.post('/admin/categories/', data)
export const adminUpdateCategory = (slug, d) => api.patch(`/admin/categories/${slug}/`, d)
export const adminDeleteCategory = (slug)   => api.delete(`/admin/categories/${slug}/`)
export const adminGetReviews     = ()       => api.get('/admin/reviews/')
export const adminApproveReview  = (id, d)  => api.patch(`/admin/reviews/${id}/approve/`, d)
export const adminDeleteReview   = (id)     => api.delete(`/admin/reviews/${id}/`)