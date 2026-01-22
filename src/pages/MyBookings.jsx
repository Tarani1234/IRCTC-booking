import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function MyBookings({ user }) {
  const [bookings, setBookings] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }

    loadBookings()
  }, [user, navigate])

  const loadBookings = () => {
    const saved = JSON.parse(localStorage.getItem(`bookings_${user.id}`) || '[]')
    // Sort by booking date (newest first)
    saved.sort((a, b) => new Date(b.bookingDate) - new Date(a.bookingDate))
    setBookings(saved)
  }

  const handleCancel = (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking? This action cannot be undone.')) {
      const updated = bookings.map(b => 
        b.id === bookingId ? { ...b, status: 'cancelled' } : b
      )
      localStorage.setItem(`bookings_${user.id}`, JSON.stringify(updated))
      setBookings(updated)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">My Bookings</h1>

        {bookings.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-xl mb-4">No bookings found</p>
            <button
              onClick={() => navigate('/search-trains')}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
            >
              Book a Ticket
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className={`border-2 rounded-lg p-6 ${
                  booking.status === 'cancelled' ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center space-x-4 mb-2">
                      <h2 className="text-xl font-semibold">{booking.trainName}</h2>
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(booking.status)}`}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">PNR: <span className="font-semibold">{booking.pnr}</span></p>
                    <p className="text-sm text-gray-600">Train No: {booking.trainId}</p>
                  </div>
                  {booking.status === 'confirmed' && (
                    <button
                      onClick={() => handleCancel(booking.id)}
                      className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition text-sm"
                    >
                      Cancel Booking
                    </button>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Route</p>
                    <p className="font-semibold">{booking.source} → {booking.destination}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Date of Journey</p>
                    <p className="font-semibold">{new Date(booking.date).toLocaleDateString('en-IN', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Class & Quota</p>
                    <p className="font-semibold">{booking.class} | {booking.quota}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Fare</p>
                    <p className="font-semibold text-lg">₹{booking.fare}</p>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <p className="text-sm font-semibold mb-2">Passengers ({booking.passengers.length}):</p>
                  <div className="space-y-1">
                    {booking.passengers.map((passenger, index) => (
                      <p key={index} className="text-sm text-gray-600">
                        {index + 1}. {passenger.name} (Age: {passenger.age}, {passenger.gender.charAt(0).toUpperCase() + passenger.gender.slice(1)})
                        {passenger.berthPreference !== 'no-preference' && (
                          <span className="text-gray-500"> - Berth: {passenger.berthPreference.replace('-', ' ')}</span>
                        )}
                      </p>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t text-xs text-gray-500">
                  <p>Booked on: {new Date(booking.bookingDate).toLocaleString('en-IN')}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

