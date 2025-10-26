import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  orders: [],
  currentOrder: null,
  loading: false,
  stats: {
    totalOrders: 0,
    totalRevenue: 0,
    activeCustomers: 0,
    pendingDeliveries: 0,
  }
}

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setOrders: (state, action) => {
      state.orders = action.payload
    },
    addOrder: (state, action) => {
      state.orders.unshift(action.payload)
    },
    updateOrder: (state, action) => {
      const index = state.orders.findIndex(order => order.id === action.payload.id)
      if (index !== -1) {
        state.orders[index] = action.payload
      }
    },
    setCurrentOrder: (state, action) => {
      state.currentOrder = action.payload
    },
    setStats: (state, action) => {
      state.stats = action.payload
    },
  },
})

export const { setLoading, setOrders, addOrder, updateOrder, setCurrentOrder, setStats } = orderSlice.actions
export default orderSlice.reducer