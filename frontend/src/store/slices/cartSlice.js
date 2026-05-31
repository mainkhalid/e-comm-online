import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getCart, addToCart, removeFromCart, updateCartItem } from '../../api/services'

export const fetchCart  = createAsyncThunk('cart/fetch',  async () => { const { data } = await getCart(); return data })
export const addItem    = createAsyncThunk('cart/add',    async ({ productId, quantity }) => { const { data } = await addToCart(productId, quantity); return data })
export const removeItem = createAsyncThunk('cart/remove', async (itemId) => { const { data } = await removeFromCart(itemId); return data })
export const updateItem = createAsyncThunk('cart/update', async ({ itemId, quantity }) => { const { data } = await updateCartItem(itemId, quantity); return data })

const set = (state, action) => {
  state.items     = action.payload.items      || []
  state.total     = action.payload.total      || 0
  state.itemCount = action.payload.item_count || 0
  state.loading   = false
  state.error     = null
}

const reject = (state, action) => {
  state.loading = false
  state.error   = action.error?.message || 'Something went wrong'
}

const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: [], total: 0, itemCount: 0, loading: false, error: null, _snapshot: null },
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchCart.pending,     (s) => { s.loading = true; s.error = null })
     .addCase(fetchCart.fulfilled,   set)
     .addCase(fetchCart.rejected,    reject)

     // ── Optimistic add: increment count immediately ──
     .addCase(addItem.pending, (s, a) => {
       s._snapshot = { items: [...s.items], total: s.total, itemCount: s.itemCount }
       s.itemCount += a.meta.arg.quantity || 1
       s.loading = false
       s.error = null
     })
     .addCase(addItem.fulfilled, set)
     .addCase(addItem.rejected, (s, a) => {
       // Revert on error
       if (s._snapshot) {
         s.items = s._snapshot.items
         s.total = s._snapshot.total
         s.itemCount = s._snapshot.itemCount
         s._snapshot = null
       }
       reject(s, a)
     })

     // ── Optimistic remove: filter out item immediately ──
     .addCase(removeItem.pending, (s, a) => {
       s._snapshot = { items: [...s.items], total: s.total, itemCount: s.itemCount }
       const itemId = a.meta.arg
       const item = s.items.find(i => i.id === itemId)
       if (item) {
         s.itemCount = Math.max(0, s.itemCount - item.quantity)
         s.items = s.items.filter(i => i.id !== itemId)
       }
       s.loading = false
       s.error = null
     })
     .addCase(removeItem.fulfilled, set)
     .addCase(removeItem.rejected, (s, a) => {
       // Revert on error
       if (s._snapshot) {
         s.items = s._snapshot.items
         s.total = s._snapshot.total
         s.itemCount = s._snapshot.itemCount
         s._snapshot = null
       }
       reject(s, a)
     })

     .addCase(updateItem.fulfilled,  set)
     .addCase(updateItem.rejected,   reject)
  },
})

export default cartSlice.reducer