import { Link } from 'react-router-dom'

export default function Home({ user }) {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-gray-800 mb-4">
          Welcome to IRCTC Booking
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Book your train tickets with ease
        </p>
        {!user && (
          <div className="space-x-4">
            <Link
              to="/signup"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition inline-block"
            >
              Get Started
            </Link>
            <Link
              to="/login"
              className="bg-gray-200 text-gray-800 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-300 transition inline-block"
            >
              Login
            </Link>
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-8 mt-16">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="text-4xl mb-4"></div>
          <h3 className="text-xl font-semibold mb-2">Search Trains</h3>
          <p className="text-gray-600 mb-4">
            Find trains between your source and destination
          </p>
          <Link
            to="/search-trains"
            className="text-blue-600 hover:text-blue-800 font-semibold"
          >
            Search Now →
          </Link>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="text-4xl mb-4"></div>
          <h3 className="text-xl font-semibold mb-2">Manage Passengers</h3>
          <p className="text-gray-600 mb-4">
            Save your frequent passengers for quick booking
          </p>
          {user ? (
            <Link
              to="/passenger-master"
              className="text-blue-600 hover:text-blue-800 font-semibold"
            >
              Manage →
            </Link>
          ) : (
            <Link
              to="/login"
              className="text-blue-600 hover:text-blue-800 font-semibold"
            >
              Login to Manage →
            </Link>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="text-4xl mb-4"></div>
          <h3 className="text-xl font-semibold mb-2">Payment Methods</h3>
          <p className="text-gray-600 mb-4">
            Add and manage your payment methods
          </p>
          {user ? (
            <Link
              to="/payment-methods"
              className="text-blue-600 hover:text-blue-800 font-semibold"
            >
              Manage →
            </Link>
          ) : (
            <Link
              to="/login"
              className="text-blue-600 hover:text-blue-800 font-semibold"
            >
              Login to Manage →
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

