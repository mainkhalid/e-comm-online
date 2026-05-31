import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
  getFeaturedProducts,
  getProductsByCategory,
  getTopRatedProducts,
  getCategories,
  getBrands,
  getProduct,
} from '../../api/services'

const STALE_MS = 10 * 60 * 1000  // 10 minutes

function isStale(fetchedAt) {
  if (!fetchedAt) return true
  return Date.now() - fetchedAt > STALE_MS
}

// ── Thunks ───────────────────────────────────────────────────

export const fetchFeatured = createAsyncThunk(
  'products/fetchFeatured',
  async (_, { getState }) => {
    const s = getState().products
    if (!isStale(s.fetchedAt.featured) && s.featured.length > 0) return null
    const { data } = await getFeaturedProducts()
    return data.results || data
  }
)

export const fetchByCategory = createAsyncThunk(
  'products/fetchByCategory',
  async (slug, { getState }) => {
    const s = getState().products
    if (!isStale(s.fetchedAt[slug]) && s.byCategory[slug]?.length > 0) return null
    const { data } = await getProductsByCategory(slug, 12)
    return { slug, products: data.results || data }
  }
)

export const fetchTopRated = createAsyncThunk(
  'products/fetchTopRated',
  async (_, { getState }) => {
    const s = getState().products
    if (!isStale(s.fetchedAt.topRated) && s.topRated.length > 0) return null
    const { data } = await getTopRatedProducts(12)
    return data.results || data
  }
)

export const fetchCategories = createAsyncThunk(
  'products/fetchCategories',
  async (_, { getState }) => {
    const s = getState().products
    if (!isStale(s.fetchedAt.categories) && s.categories.length > 0) return null
    const { data } = await getCategories()
    return data.results || data
  }
)

export const fetchBrands = createAsyncThunk(
  'products/fetchBrands',
  async (_, { getState }) => {
    const s = getState().products
    if (!isStale(s.fetchedAt.brands) && s.brands.length > 0) return null
    const { data } = await getBrands()
    return data.results || data
  }
)

export const fetchProductDetail = createAsyncThunk(
  'products/fetchProductDetail',
  async (slug, { getState }) => {
    const s = getState().products
    const cached = s.productDetails[slug]
    const fetchedAt = s.fetchedAt[`detail:${slug}`]
    if (!isStale(fetchedAt) && cached) return null
    const { data } = await getProduct(slug)
    return { slug, product: data }
  }
)

// ── Slice ─────────────────────────────────────────────────────

const productsSlice = createSlice({
  name: 'products',
  initialState: {
    featured:       [],
    topRated:       [],
    byCategory:     {},   // { laptops: [...], desktops: [...] }
    categories:     [],   // for filter sidebar
    brands:         [],   // for filter sidebar
    productDetails: {},   // { [slug]: productObject }
    loading:        false,
    error:          null,
    fetchedAt:      {},   // timestamps per key
  },
  reducers: {
    invalidateProducts(state) {
      state.featured       = []
      state.topRated       = []
      state.byCategory     = {}
      state.productDetails = {}
      state.fetchedAt      = {}
    },
  },
  extraReducers: (b) => {
    const pending   = (s) => { s.loading = true; s.error = null }
    const rejected  = (s, a) => { s.loading = false; s.error = a.error?.message }

    // ── fetchFeatured ──
    b.addCase(fetchFeatured.pending,   pending)
     .addCase(fetchFeatured.fulfilled, (s, a) => {
       s.loading = false
       if (a.payload !== null) {
         s.featured = a.payload
         s.fetchedAt.featured = Date.now()
       }
     })
     .addCase(fetchFeatured.rejected, rejected)

    // ── fetchByCategory ──
     .addCase(fetchByCategory.pending,   pending)
     .addCase(fetchByCategory.fulfilled, (s, a) => {
       s.loading = false
       if (a.payload !== null) {
         const { slug, products } = a.payload
         s.byCategory[slug] = products
         s.fetchedAt[slug] = Date.now()
       }
     })
     .addCase(fetchByCategory.rejected, rejected)

    // ── fetchTopRated ──
     .addCase(fetchTopRated.pending,   pending)
     .addCase(fetchTopRated.fulfilled, (s, a) => {
       s.loading = false
       if (a.payload !== null) {
         s.topRated = a.payload
         s.fetchedAt.topRated = Date.now()
       }
     })
     .addCase(fetchTopRated.rejected, rejected)

    // ── fetchCategories ──
     .addCase(fetchCategories.pending,   pending)
     .addCase(fetchCategories.fulfilled, (s, a) => {
       s.loading = false
       if (a.payload !== null) {
         s.categories = a.payload
         s.fetchedAt.categories = Date.now()
       }
     })
     .addCase(fetchCategories.rejected, rejected)

    // ── fetchBrands ──
     .addCase(fetchBrands.pending,   pending)
     .addCase(fetchBrands.fulfilled, (s, a) => {
       s.loading = false
       if (a.payload !== null) {
         s.brands = a.payload
         s.fetchedAt.brands = Date.now()
       }
     })
     .addCase(fetchBrands.rejected, rejected)

    // ── fetchProductDetail ──
     .addCase(fetchProductDetail.pending,   pending)
     .addCase(fetchProductDetail.fulfilled, (s, a) => {
       s.loading = false
       if (a.payload !== null) {
         const { slug, product } = a.payload
         s.productDetails[slug] = product
         s.fetchedAt[`detail:${slug}`] = Date.now()
       }
     })
     .addCase(fetchProductDetail.rejected, rejected)
  },
})

export const { invalidateProducts } = productsSlice.actions
export default productsSlice.reducer