import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import TopNav from './components/TopNav'
import ProtectedRoute from './components/ProtectedRoute'

// components
import Home from './booking/Home'
import Login from './auth/Login'
import Register from './auth/Register'
import Dashboard from './user/Dashboard'
import DashboardSeller from './user/DashboardSeller'
import NewHotel from './hotels/NewHotel'
import StripeCallback from './stripe/StripeCallback'
import EditHotel from './hotels/EditHotel'
import ViewHotel from './hotels/ViewHotel'
import StripeSuccess from './stripe/StripeSuccess'
import StripeCancel from './stripe/StripeCancel'

function App() {
  return (
    <BrowserRouter>
      <TopNav />
      <ToastContainer />
      <Routes>

        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/hotel/:hotelId" element={<ViewHotel />} />

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard/seller" element={<DashboardSeller />} />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route path="/hotels/new" element={<NewHotel />} />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route path="/stripe/callback" element={<StripeCallback />} />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route path="/hotel/edit/:hotelId" element={<EditHotel />} />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route path="/stripe/success/:hotelId" element={<StripeSuccess />} />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route path="/stripe/cancel" element={<StripeCancel />} />
        </Route>
      </Routes>      
    </BrowserRouter>
  )
}

export default App