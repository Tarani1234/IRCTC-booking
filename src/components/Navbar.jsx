import { Link } from 'react-router-dom'

export default function Navbar({ user, onLogout }) {
  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-2xl font-bold">
            IRCTC Booking
          </Link>
          <div className="flex items-center space-x-4">
            <Link to="/search-trains" className="hover:text-blue-200 transition">
              Search Trains
            </Link>
            {user ? (
              <>
                {user.role === 'admin' ? (
                  <Link to="/admin" className="hover:text-blue-200 transition font-semibold">
                    Admin Dashboard
                  </Link>
                ) : (
                  <>
                    <Link to="/my-bookings" className="hover:text-blue-200 transition">
                      My Bookings
                    </Link>
                    <Link to="/passenger-master" className="hover:text-blue-200 transition">
                      Passengers
                    </Link>
                    <Link to="/payment-methods" className="hover:text-blue-200 transition">
                      Payment Methods
                    </Link>
                    <Link to="/profile" className="hover:text-blue-200 transition">
                      Profile
                    </Link>
                  </>
                )}
                <button
                  onClick={onLogout}
                  className="bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-blue-200 transition">
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded transition"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

