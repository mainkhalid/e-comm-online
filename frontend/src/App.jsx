import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Provider, useSelector } from 'react-redux'
import { HelmetProvider } from 'react-helmet-async'
import { Toaster } from 'react-hot-toast'
import { store } from './store'

import TopBar from './components/layout/TopBar'
import MainNavbar from './components/layout/MainNavbar'
import Footer from './components/layout/Footer'
import AdminLayout from './components/admin/AdminLayout2'

import Home              from './pages/Home2'
import Products          from './pages/Products'
import ProductDetail     from './pages/ProductDetail'
import Login             from './pages/Login'
import Register          from './pages/Register'
import Cart              from './pages/Cart'
import Checkout          from './pages/Checkout'
import OrderConfirmation from './pages/OrderConfirmation'

import AccountProfile from './pages/account/Profile'
import AccountOrders  from './pages/account/Orders'

import AdminDashboard2  from './pages/admin/Dashboard2'
import AdminProducts2   from './pages/admin/Products2'
import AdminOrders     from './pages/admin/Orders'
import AdminCategories from './pages/admin/Categories'
import AdminCustomers  from './pages/admin/Customers'
import AdminAnalytics  from './pages/admin/Analytics'

function StoreLayout() {
  return (
    <>
      <TopBar />
      <MainNavbar />
      <main className="min-h-screen">
        <Routes>
          <Route path="/"                              element={<Home />} />
          <Route path="/products"                      element={<Products />} />
          <Route path="/products/:slug"                element={<ProductDetail />} />
          <Route path="/login"                         element={<Login />} />
          <Route path="/register"                      element={<Register />} />
          <Route path="/cart"                           element={<Cart />} />
          <Route path="/checkout"                      element={<Checkout />} />
          <Route path="/order-confirmation/:orderNumber" element={<OrderConfirmation />} />
          <Route path="/account/profile"               element={<AccountProfile />} />
          <Route path="/account/orders"                element={<AccountOrders />} />
          {/* Redirect old paths */}
          <Route path="/orders"                        element={<Navigate to="/account/orders" replace />} />
          <Route path="/profile"                       element={<Navigate to="/account/profile" replace />} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}

export default function App() {
  return (
    <Provider store={store}>
      <HelmetProvider>
        <BrowserRouter>
          <Routes>
            {/* Admin routes — no Navbar/Footer */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index           element={<AdminDashboard2 />} />
              <Route path="products"   element={<AdminProducts2 />} />
              <Route path="orders"     element={<AdminOrders />} />
              <Route path="categories" element={<AdminCategories />} />
              <Route path="customers"  element={<AdminCustomers />} />
              <Route path="analytics"  element={<AdminAnalytics />} />
            </Route>

            {/* Store routes */}
            <Route path="/*" element={<StoreLayout />} />
          </Routes>

          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: '#fff',
                color: '#1a1a1a',
                border: '1px solid #e5e7eb',
                fontSize: '14px',
                fontFamily: 'system-ui, sans-serif',
                borderRadius: '12px',
                boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
              },
              success: { iconTheme: { primary: '#2563eb', secondary: '#fff' } },
              error:   { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
            }}
          />
        </BrowserRouter>
      </HelmetProvider>
    </Provider>
  )
}
