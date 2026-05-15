import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Provider, useSelector } from 'react-redux'
import { HelmetProvider } from 'react-helmet-async'
import { Toaster } from 'react-hot-toast'
import { store } from './store'

import TopBar    from './components/layout/TopBar'
import MainNavbar from './components/layout/MainNavbar'
import Footer    from './components/layout/Footer'
import AdminLayout from './components/admin/AdminLayout'

import Home              from './pages/Home2'
import Products          from './pages/Products'
import ProductDetail     from './pages/ProductDetail'
import Login             from './pages/Login'
import Register          from './pages/Register'
import Cart              from './pages/Cart'
import Checkout          from './pages/Checkout'
import OrderConfirmation from './pages/OrderConfirmation'

// Account — nested under AccountLayout sidebar
import AccountLayout  from './pages/account/AccountLayout'
import AccountProfile from './pages/account/Profile'
import AccountOrders  from './pages/account/Orders'

// Admin pages
import AdminDashboard  from './pages/admin/Dashboard'
import AdminProducts   from './pages/admin/Products'
import AdminOrders     from './pages/admin/Orders'
import AdminCategories from './pages/admin/Categories'
import AdminCustomers  from './pages/admin/Customers'
import AdminAnalytics  from './pages/admin/Analytics'
import AdminBrands     from './pages/admin/Brands'
import AdminSettings   from './pages/admin/Settings'

function StoreLayout() {
  return (
    <>
      <TopBar />
      <MainNavbar />
      <main className="min-h-screen" style={{ background: 'var(--bg)' }}>
        <Routes>
          <Route path="/"                                element={<Home />} />
          <Route path="/products"                        element={<Products />} />
          <Route path="/products/:slug"                  element={<ProductDetail />} />
          <Route path="/login"                           element={<Login />} />
          <Route path="/register"                        element={<Register />} />
          <Route path="/cart"                            element={<Cart />} />
          <Route path="/checkout"                        element={<Checkout />} />
          <Route path="/order-confirmation/:orderNumber" element={<OrderConfirmation />} />

          {/* Account — shared sidebar layout */}
          <Route path="/account" element={<AccountLayout />}>
            <Route index           element={<Navigate to="/account/profile" replace />} />
            <Route path="profile"  element={<AccountProfile />} />
            <Route path="orders"   element={<AccountOrders />} />
          </Route>

          {/* Legacy redirects */}
          <Route path="/orders"  element={<Navigate to="/account/orders"  replace />} />
          <Route path="/profile" element={<Navigate to="/account/profile" replace />} />
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
            {/* Admin — no Navbar/Footer */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index             element={<AdminDashboard />} />
              <Route path="products"   element={<AdminProducts />} />
              <Route path="orders"     element={<AdminOrders />} />
              <Route path="categories" element={<AdminCategories />} />
              <Route path="customers"  element={<AdminCustomers />} />
              <Route path="brands"     element={<AdminBrands />} />
              <Route path="settings"   element={<AdminSettings />} />
              <Route path="analytics"  element={<AdminAnalytics />} />
            </Route>

            {/* Store */}
            <Route path="/*" element={<StoreLayout />} />
          </Routes>

          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: '#fff',
                color: '#0F172A',
                border: '1px solid #E2E8F0',
                fontSize: '13px',
                fontFamily: 'DM Sans, sans-serif',
                borderRadius: '12px',
                boxShadow: '0 10px 40px rgba(15,23,42,0.12)',
              },
              success: { iconTheme: { primary: '#FF6B2B', secondary: '#fff' } },
              error:   { iconTheme: { primary: '#DC2626', secondary: '#fff' } },
            }}
          />
        </BrowserRouter>
      </HelmetProvider>
    </Provider>
  )
}