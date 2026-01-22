import { useState, useEffect } from 'react'

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBookings: 0,
    confirmedBookings: 0,
    cancelledBookings: 0,
    totalRevenue: 0
  })
  const [users, setUsers] = useState([])
  const [allBookings, setAllBookings] = useState([])
  const [trains, setTrains] = useState([])
  const [trainForm, setTrainForm] = useState({
    trainNo: '',
    name: '',
    source: '',
    destination: '',
    departureTime: '',
    arrivalTime: '',
    duration: '',
    classes: ''
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    // Load users
    const allUsers = JSON.parse(localStorage.getItem('users') || '[]')
    setUsers(allUsers.filter(u => u.role !== 'admin'))

    // Load all bookings from all users
    const allBookingsList = []
    allUsers.forEach(user => {
      const userBookings = JSON.parse(localStorage.getItem(`bookings_${user.id}`) || '[]')
      userBookings.forEach(booking => {
        allBookingsList.push({ ...booking, userId: user.id, userEmail: user.email, userName: user.name })
      })
    })
    setAllBookings(allBookingsList)

    // Load trains
    const storedTrains = JSON.parse(localStorage.getItem('trains') || '[]')
    setTrains(storedTrains)

    // Calculate statistics
    const confirmed = allBookingsList.filter(b => b.status === 'confirmed')
    const cancelled = allBookingsList.filter(b => b.status === 'cancelled')
    const revenue = confirmed.reduce((sum, b) => sum + (b.fare || 0), 0)

    setStats({
      totalUsers: allUsers.filter(u => u.role !== 'admin').length,
      totalBookings: allBookingsList.length,
      confirmedBookings: confirmed.length,
      cancelledBookings: cancelled.length,
      totalRevenue: revenue
    })
  }

  const handleDeleteUser = (userId) => {
    if (window.confirm('Are you sure you want to delete this user? This will also delete all their bookings.')) {
      const updatedUsers = users.filter(u => u.id !== userId)
      localStorage.setItem('users', JSON.stringify([
        ...updatedUsers,
        ...JSON.parse(localStorage.getItem('users') || '[]').filter(u => u.role === 'admin')
      ]))
      // Delete user's bookings
      localStorage.removeItem(`bookings_${userId}`)
      localStorage.removeItem(`paymentMethods_${userId}`)
      localStorage.removeItem(`passengers_${userId}`)
      loadData()
    }
  }

  const handleCancelBooking = (bookingId, userId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      const userBookings = JSON.parse(localStorage.getItem(`bookings_${userId}`) || '[]')
      const updated = userBookings.map(b => 
        b.id === bookingId ? { ...b, status: 'cancelled' } : b
      )
      localStorage.setItem(`bookings_${userId}`, JSON.stringify(updated))
      loadData()
    }
  }

  const handleTrainSubmit = (e) => {
    e.preventDefault()
    const newTrain = {
      id: Date.now().toString(),
      ...trainForm,
      classes: trainForm.classes.split(',').map(c => c.trim()).filter(c => c)
    }
    const updated = [...trains, newTrain]
    localStorage.setItem('trains', JSON.stringify(updated))
    setTrains(updated)
    setTrainForm({
      trainNo: '',
      name: '',
      source: '',
      destination: '',
      departureTime: '',
      arrivalTime: '',
      duration: '',
      classes: ''
    })
  }

  const handleDeleteTrain = (id) => {
    if (window.confirm('Are you sure you want to delete this train?')) {
      const updated = trains.filter(t => t.id !== id)
      localStorage.setItem('trains', JSON.stringify(updated))
      setTrains(updated)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="bg-white rounded-lg shadow-md">
        <div className="border-b border-gray-200">
          <div className="flex">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-6 py-4 font-semibold transition ${
                activeTab === 'dashboard'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`px-6 py-4 font-semibold transition ${
                activeTab === 'users'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Users ({users.length})
            </button>
            <button
              onClick={() => setActiveTab('bookings')}
              className={`px-6 py-4 font-semibold transition ${
                activeTab === 'bookings'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Bookings ({allBookings.length})
            </button>
            <button
              onClick={() => setActiveTab('trains')}
              className={`px-6 py-4 font-semibold transition ${
                activeTab === 'trains'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Trains ({trains.length})
            </button>
          </div>
        </div>

        <div className="p-8">
          {activeTab === 'dashboard' && (
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <div className="text-3xl font-bold text-blue-600">{stats.totalUsers}</div>
                  <div className="text-gray-600 mt-2">Total Users</div>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <div className="text-3xl font-bold text-green-600">{stats.totalBookings}</div>
                  <div className="text-gray-600 mt-2">Total Bookings</div>
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                  <div className="text-3xl font-bold text-purple-600">{stats.confirmedBookings}</div>
                  <div className="text-gray-600 mt-2">Confirmed</div>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                  <div className="text-3xl font-bold text-yellow-600">₹{stats.totalRevenue.toLocaleString()}</div>
                  <div className="text-gray-600 mt-2">Total Revenue</div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-xl font-semibold mb-4">Recent Bookings</h3>
                  <div className="space-y-3">
                    {allBookings.slice(0, 5).map((booking) => (
                      <div key={booking.id} className="bg-white p-3 rounded border">
                        <p className="font-semibold">{booking.trainName}</p>
                        <p className="text-sm text-gray-600">
                          {booking.source} → {booking.destination} | {booking.userName}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(booking.bookingDate).toLocaleString('en-IN')}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-xl font-semibold mb-4">System Status</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Active Users:</span>
                      <span className="font-semibold">{stats.totalUsers}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Confirmed Bookings:</span>
                      <span className="font-semibold text-green-600">{stats.confirmedBookings}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Cancelled Bookings:</span>
                      <span className="font-semibold text-red-600">{stats.cancelledBookings}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Trains:</span>
                      <span className="font-semibold">{trains.length}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-6">User Management</h1>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{user.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.phone}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(user.createdAt).toLocaleDateString('en-IN')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="text-red-600 hover:text-red-800 font-semibold"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {users.length === 0 && (
                  <p className="text-center text-gray-500 py-8">No users found</p>
                )}
              </div>
            </div>
          )}

          {activeTab === 'bookings' && (
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-6">Booking Management</h1>
              <div className="space-y-4">
                {allBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className={`border-2 rounded-lg p-4 ${
                      booking.status === 'cancelled' ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold">{booking.trainName}</h3>
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${
                            booking.status === 'confirmed'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {booking.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">PNR: {booking.pnr}</p>
                        <p className="text-sm text-gray-600">
                          {booking.source} → {booking.destination} | {new Date(booking.date).toLocaleDateString('en-IN')}
                        </p>
                        <p className="text-sm text-gray-600">
                          User: {booking.userName} ({booking.userEmail})
                        </p>
                        <p className="text-sm text-gray-600">
                          Passengers: {booking.passengers?.length || 0} | Fare: ₹{booking.fare}
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                          Booked on: {new Date(booking.bookingDate).toLocaleString('en-IN')}
                        </p>
                      </div>
                      {booking.status === 'confirmed' && (
                        <button
                          onClick={() => handleCancelBooking(booking.id, booking.userId)}
                          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition text-sm"
                        >
                          Cancel Booking
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                {allBookings.length === 0 && (
                  <p className="text-center text-gray-500 py-8">No bookings found</p>
                )}
              </div>
            </div>
          )}

          {activeTab === 'trains' && (
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-6">Train Management</h1>
              
              <form onSubmit={handleTrainSubmit} className="bg-gray-50 p-6 rounded-lg mb-6">
                <h3 className="text-xl font-semibold mb-4">Add New Train</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Train Number"
                    required
                    className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={trainForm.trainNo}
                    onChange={(e) => setTrainForm({ ...trainForm, trainNo: e.target.value })}
                  />
                  <input
                    type="text"
                    placeholder="Train Name"
                    required
                    className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={trainForm.name}
                    onChange={(e) => setTrainForm({ ...trainForm, name: e.target.value })}
                  />
                  <input
                    type="text"
                    placeholder="Source Station"
                    required
                    className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={trainForm.source}
                    onChange={(e) => setTrainForm({ ...trainForm, source: e.target.value })}
                  />
                  <input
                    type="text"
                    placeholder="Destination Station"
                    required
                    className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={trainForm.destination}
                    onChange={(e) => setTrainForm({ ...trainForm, destination: e.target.value })}
                  />
                  <input
                    type="text"
                    placeholder="Departure Time (HH:MM)"
                    className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={trainForm.departureTime}
                    onChange={(e) => setTrainForm({ ...trainForm, departureTime: e.target.value })}
                  />
                  <input
                    type="text"
                    placeholder="Arrival Time (HH:MM)"
                    className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={trainForm.arrivalTime}
                    onChange={(e) => setTrainForm({ ...trainForm, arrivalTime: e.target.value })}
                  />
                  <input
                    type="text"
                    placeholder="Duration (e.g., 16h 30m)"
                    className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={trainForm.duration}
                    onChange={(e) => setTrainForm({ ...trainForm, duration: e.target.value })}
                  />
                  <input
                    type="text"
                    placeholder="Classes (comma separated, e.g., 1A,2A,3A,SL)"
                    className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={trainForm.classes}
                    onChange={(e) => setTrainForm({ ...trainForm, classes: e.target.value })}
                  />
                </div>
                <button
                  type="submit"
                  className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
                >
                  Add Train
                </button>
              </form>

              <div className="space-y-4">
                {trains.map((train) => (
                  <div key={train.id} className="border border-gray-300 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold">{train.name}</h3>
                        <p className="text-sm text-gray-600">Train No: {train.trainNo}</p>
                        <p className="text-sm text-gray-600">
                          {train.source} → {train.destination}
                        </p>
                        {train.departureTime && (
                          <p className="text-sm text-gray-600">
                            {train.departureTime} - {train.arrivalTime} ({train.duration})
                          </p>
                        )}
                        {train.classes && train.classes.length > 0 && (
                          <div className="flex space-x-2 mt-2">
                            {train.classes.map((cls, idx) => (
                              <span key={idx} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                                {cls}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => handleDeleteTrain(train.id)}
                        className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
                {trains.length === 0 && (
                  <p className="text-center text-gray-500 py-8">No trains added yet</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
