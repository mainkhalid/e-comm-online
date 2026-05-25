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
  initialState: { items: [], total: 0, itemCount: 0, loading: false, error: null },
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchCart.pending,     (s) => { s.loading = true; s.error = null })
     .addCase(fetchCart.fulfilled,   set)
     .addCase(fetchCart.rejected,    reject)
     .addCase(addItem.fulfilled,     set)
     .addCase(addItem.rejected,      reject)
     .addCase(removeItem.fulfilled,  set)
     .addCase(removeItem.rejected,   reject)
     .addCase(updateItem.fulfilled,  set)
     .addCase(updateItem.rejected,   reject)
  },
})

export default cartSlice.reducer