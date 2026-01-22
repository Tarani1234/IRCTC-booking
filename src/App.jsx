// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
// import { useState, useEffect } from 'react'
// import Navbar from './components/Navbar'
// import Home from './pages/Home'
// import Login from './pages/Login'
// import Signup from './pages/Signup'
// import Profile from './pages/Profile'
// import PaymentMethods from './pages/PaymentMethods'
// import PassengerMaster from './pages/PassengerMaster'
// import TrainSearch from './pages/TrainSearch'
// import TrainAvailability from './pages/TrainAvailability'
// import Booking from './pages/Booking'
// import MyBookings from './pages/MyBookings'

// function App() {
//   const [user, setUser] = useState(null)

//   useEffect(() => {
//     // Check if user is logged in
//     const loggedInUser = localStorage.getItem('currentUser')
//     if (loggedInUser) {
//       setUser(JSON.parse(loggedInUser))
//     }
//   }, [])

//   const handleLogin = (userData) => {
//     setUser(userData)
//     localStorage.setItem('currentUser', JSON.stringify(userData))
//   }

//   const handleLogout = () => {
//     setUser(null)
//     localStorage.removeItem('currentUser')
//   }

//   return (
//     <Router>
//       <div className="min-h-screen bg-gray-50">
//         <Navbar user={user} onLogout={handleLogout} />
//         <Routes>
//           <Route path="/" element={<Home user={user} />} />
//           <Route path="/login" element={user ? <Navigate to="/" /> : <Login onLogin={handleLogin} />} />
//           <Route path="/signup" element={user ? <Navigate to="/" /> : <Signup onLogin={handleLogin} />} />
//           <Route path="/profile" element={user ? <Profile user={user} setUser={setUser} /> : <Navigate to="/login" />} />
//           <Route path="/payment-methods" element={user ? <PaymentMethods user={user} /> : <Navigate to="/login" />} />
//           <Route path="/passenger-master" element={user ? <PassengerMaster user={user} /> : <Navigate to="/login" />} />
//           <Route path="/search-trains" element={<TrainSearch />} />
//           <Route path="/train-availability" element={<TrainAvailability user={user} />} />
//           <Route path="/booking" element={user ? <Booking user={user} /> : <Navigate to="/login" />} />
//           <Route path="/my-bookings" element={user ? <MyBookings user={user} /> : <Navigate to="/login" />} />
//         </Routes>
//       </div>
//     </Router>
//   )
// }

// export default App

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Profile from './pages/Profile'
import PaymentMethods from './pages/PaymentMethods'
import PassengerMaster from './pages/PassengerMaster'
import TrainSearch from './pages/TrainSearch'
import TrainAvailability from './pages/TrainAvailability'
import Booking from './pages/Booking'
import MyBookings from './pages/MyBookings'

// NEW
import AdminDashboard from './pages/AdminDashboard'
import ProtectedRoute from './pages/ProtectedRoute'

function App() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const loggedInUser = localStorage.getItem('currentUser')
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser))
    }
  }, [])

  const handleLogin = (userData) => {
    setUser(userData)
    localStorage.setItem('currentUser', JSON.stringify(userData))
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem('currentUser')
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar user={user} onLogout={handleLogout} />

        <Routes>
          <Route path="/" element={<Home user={user} />} />

          <Route path="/login" element={user ? <Navigate to="/" /> : <Login onLogin={handleLogin} />} />
          <Route path="/signup" element={user ? <Navigate to="/" /> : <Signup onLogin={handleLogin} />} />

          {/* Protected Routes for User */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute user={user}>
                <Profile user={user} setUser={setUser} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/payment-methods"
            element={
              <ProtectedRoute user={user}>
                <PaymentMethods user={user} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/passenger-master"
            element={
              <ProtectedRoute user={user}>
                <PassengerMaster user={user} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/booking"
            element={
              <ProtectedRoute user={user}>
                <Booking user={user} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/my-bookings"
            element={
              <ProtectedRoute user={user}>
                <MyBookings user={user} />
              </ProtectedRoute>
            }
          />

          {/* Public Routes */}
          <Route path="/search-trains" element={<TrainSearch />} />
          <Route path="/train-availability" element={<TrainAvailability user={user} />} />

          {/* Admin Route */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute user={user} role="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  )
}

export default App
