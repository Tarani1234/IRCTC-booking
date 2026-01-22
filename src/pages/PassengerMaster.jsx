import { useState, useEffect } from 'react'

export default function PassengerMaster({ user }) {
  const [passengers, setPassengers] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'male',
    berthPreference: 'no-preference'
  })

  useEffect(() => {
    loadPassengers()
  }, [user])

  const loadPassengers = () => {
    const saved = JSON.parse(localStorage.getItem(`passengers_${user.id}`) || '[]')
    setPassengers(saved)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (editingId) {
      // Update existing passenger
      const updated = passengers.map(p => 
        p.id === editingId ? { ...p, ...formData, age: parseInt(formData.age) } : p
      )
      localStorage.setItem(`passengers_${user.id}`, JSON.stringify(updated))
      setPassengers(updated)
      setEditingId(null)
    } else {
      // Add new passenger
      const newPassenger = {
        id: Date.now().toString(),
        ...formData,
        age: parseInt(formData.age),
        createdAt: new Date().toISOString()
      }
      const updated = [...passengers, newPassenger]
      localStorage.setItem(`passengers_${user.id}`, JSON.stringify(updated))
      setPassengers(updated)
    }

    setShowForm(false)
    setFormData({
      name: '',
      age: '',
      gender: 'male',
      berthPreference: 'no-preference'
    })
  }

  const handleEdit = (passenger) => {
    setFormData({
      name: passenger.name,
      age: passenger.age.toString(),
      gender: passenger.gender,
      berthPreference: passenger.berthPreference
    })
    setEditingId(passenger.id)
    setShowForm(true)
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this passenger?')) {
      const updated = passengers.filter(p => p.id !== id)
      localStorage.setItem(`passengers_${user.id}`, JSON.stringify(updated))
      setPassengers(updated)
    }
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingId(null)
    setFormData({
      name: '',
      age: '',
      gender: 'male',
      berthPreference: 'no-preference'
    })
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Passenger Master List</h1>
          <button
            onClick={() => {
              setShowForm(true)
              setEditingId(null)
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
          >
            + Add Passenger
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="mb-8 p-6 bg-gray-50 rounded-lg space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Passenger Name
              </label>
              <input
                type="text"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Age
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  max="120"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender
                </label>
                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Berth Preference
              </label>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.berthPreference}
                onChange={(e) => setFormData({ ...formData, berthPreference: e.target.value })}
              >
                <option value="no-preference">No Preference</option>
                <option value="lower">Lower</option>
                <option value="middle">Middle</option>
                <option value="upper">Upper</option>
                <option value="side-lower">Side Lower</option>
                <option value="side-upper">Side Upper</option>
              </select>
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition font-semibold"
              >
                {editingId ? 'Update' : 'Add'} Passenger
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 bg-gray-300 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-400 transition font-semibold"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        <div className="space-y-4">
          {passengers.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No passengers added yet</p>
          ) : (
            passengers.map((passenger) => (
              <div key={passenger.id} className="border border-gray-300 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-lg">{passenger.name}</p>
                    <p className="text-gray-600">Age: {passenger.age} • Gender: {passenger.gender.charAt(0).toUpperCase() + passenger.gender.slice(1)}</p>
                    <p className="text-sm text-gray-500">Berth Preference: {passenger.berthPreference.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(passenger)}
                      className="text-blue-600 hover:text-blue-800 font-semibold"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(passenger.id)}
                      className="text-red-600 hover:text-red-800 font-semibold"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

