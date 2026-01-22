import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

// Mock train data
const mockTrains = [
  {
    id: '12301',
    name: 'Rajdhani Express',
    source: 'Delhi',
    destination: 'Mumbai',
    departureTime: '16:00',
    arrivalTime: '08:30',
    duration: '16h 30m',
    classes: ['1A', '2A', '3A', 'SL']
  },
  {
    id: '12951',
    name: 'Mumbai Rajdhani',
    source: 'Delhi',
    destination: 'Mumbai',
    departureTime: '16:25',
    arrivalTime: '08:55',
    duration: '16h 30m',
    classes: ['1A', '2A', '3A']
  },
  {
    id: '12259',
    name: 'Sealdah Duronto',
    source: 'Delhi',
    destination: 'Kolkata',
    departureTime: '22:40',
    arrivalTime: '08:00',
    duration: '9h 20m',
    classes: ['1A', '2A', '3A', 'SL']
  },
  {
    id: '12284',
    name: 'New Delhi - Howrah Duronto',
    source: 'Delhi',
    destination: 'Kolkata',
    departureTime: '22:50',
    arrivalTime: '08:30',
    duration: '9h 40m',
    classes: ['1A', '2A', '3A']
  },
  {
    id: '12627',
    name: 'Tamil Nadu Express',
    source: 'Delhi',
    destination: 'Chennai',
    departureTime: '22:30',
    arrivalTime: '05:00',
    duration: '30h 30m',
    classes: ['1A', '2A', '3A', 'SL']
  },
  {
    id: '12621',
    name: 'Tamil Nadu Express',
    source: 'Chennai',
    destination: 'Delhi',
    departureTime: '22:15',
    arrivalTime: '04:45',
    duration: '30h 30m',
    classes: ['1A', '2A', '3A', 'SL']
  },
  {
    id: '12626',
    name: 'Karnataka Express',
    source: 'Delhi',
    destination: 'Bangalore',
    departureTime: '20:30',
    arrivalTime: '05:00',
    duration: '32h 30m',
    classes: ['1A', '2A', '3A', 'SL']
  },
  {
    id: '12628',
    name: 'Karnataka Express',
    source: 'Bangalore',
    destination: 'Delhi',
    departureTime: '20:00',
    arrivalTime: '04:30',
    duration: '32h 30m',
    classes: ['1A', '2A', '3A', 'SL']
  }
]

export default function TrainSearch() {
  const [formData, setFormData] = useState({
    source: '',
    destination: '',
    date: ''
  })
  const [trains, setTrains] = useState([])
  const [searched, setSearched] = useState(false)
  const navigate = useNavigate()

  const handleSearch = (e) => {
    e.preventDefault()
    
    if (!formData.source || !formData.destination || !formData.date) {
      alert('Please fill all fields')
      return
    }

    // Filter trains based on source and destination
    const filtered = mockTrains.filter(
      train => 
        train.source.toLowerCase() === formData.source.toLowerCase() &&
        train.destination.toLowerCase() === formData.destination.toLowerCase()
    )

    setTrains(filtered)
    setSearched(true)
  }

  const handleCheckAvailability = (train) => {
    const searchParams = new URLSearchParams({
      trainId: train.id,
      trainName: train.name,
      source: formData.source,
      destination: formData.destination,
      date: formData.date
    })
    navigate(`/train-availability?${searchParams.toString()}`)
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Search Trains</h1>
        
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                From (Source)
              </label>
              <input
                type="text"
                required
                list="stations"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter source station"
                value={formData.source}
                onChange={(e) => setFormData({ ...formData, source: e.target.value })}
              />
              <datalist id="stations">
                <option value="Delhi" />
                <option value="Mumbai" />
                <option value="Kolkata" />
                <option value="Chennai" />
                <option value="Bangalore" />
                <option value="Hyderabad" />
                <option value="Pune" />
                <option value="Ahmedabad" />
              </datalist>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                To (Destination)
              </label>
              <input
                type="text"
                required
                list="stations"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter destination station"
                value={formData.destination}
                onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date of Journey
              </label>
              <input
                type="date"
                required
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition font-semibold text-lg"
          >
            Search Trains
          </button>
        </form>
      </div>

      {searched && (
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Available Trains ({trains.length})
          </h2>

          {trains.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No trains found for this route. Please try different stations.
            </p>
          ) : (
            <div className="space-y-4">
              {trains.map((train) => (
                <div key={train.id} className="border border-gray-300 rounded-lg p-6 hover:shadow-lg transition">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-2">
                        <h3 className="text-xl font-semibold">{train.name}</h3>
                        <span className="text-sm text-gray-600">Train No: {train.id}</span>
                      </div>
                      <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600 mb-4">
                        <div>
                          <p className="font-semibold text-gray-800">Departure</p>
                          <p>{train.departureTime}</p>
                          <p className="text-xs">{formData.source}</p>
                        </div>
                        <div className="text-center">
                          <p className="font-semibold text-gray-800">Duration</p>
                          <p>{train.duration}</p>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">Arrival</p>
                          <p>{train.arrivalTime}</p>
                          <p className="text-xs">{formData.destination}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Available Classes:</p>
                        <div className="flex space-x-2">
                          {train.classes.map((cls) => (
                            <span key={cls} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                              {cls}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleCheckAvailability(train)}
                      className="ml-4 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition font-semibold"
                    >
                      Check Availability
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

