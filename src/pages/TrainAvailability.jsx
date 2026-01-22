import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

const classes = {
  '1A': 'First AC',
  '2A': 'Second AC',
  '3A': 'Third AC',
  'SL': 'Sleeper',
  'CC': 'Chair Car',
  '2S': 'Second Sitting'
}

const quotas = ['General', 'Ladies', 'Senior Citizen', 'Tatkal', 'Premium Tatkal']

export default function TrainAvailability({ user }) {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [selectedClass, setSelectedClass] = useState('')
  const [selectedQuota, setSelectedQuota] = useState('General')
  const [availability, setAvailability] = useState(null)

  const trainId = searchParams.get('trainId')
  const trainName = searchParams.get('trainName')
  const source = searchParams.get('source')
  const destination = searchParams.get('destination')
  const date = searchParams.get('date')

  useEffect(() => {
    if (!trainId || !date) {
      navigate('/search-trains')
    }
  }, [trainId, date, navigate])

  const checkAvailability = () => {
    if (!selectedClass) {
      alert('Please select a class')
      return
    }

    // Mock availability data
    const mockAvailability = {
      available: Math.floor(Math.random() * 20) + 1,
      waiting: Math.floor(Math.random() * 10),
      rac: Math.floor(Math.random() * 5),
      fare: {
        '1A': 3500,
        '2A': 2500,
        '3A': 1500,
        'SL': 800,
        'CC': 1200,
        '2S': 400
      }[selectedClass] || 1000
    }

    setAvailability(mockAvailability)
  }

  const handleBookNow = () => {
    if (!user) {
      alert('Please login to continue booking')
      navigate('/login')
      return
    }

    if (!availability) {
      alert('Please check availability first')
      return
    }

    const bookingData = {
      trainId,
      trainName,
      source,
      destination,
      date,
      class: selectedClass,
      quota: selectedQuota,
      fare: availability.fare,
      available: availability.available
    }

    navigate(`/booking?${new URLSearchParams(bookingData).toString()}`)
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Check Availability</h1>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h2 className="text-xl font-semibold mb-2">{trainName}</h2>
          <p className="text-sm text-gray-600">Train No: {trainId}</p>
          <p className="text-sm text-gray-600">
            {source} → {destination} | {new Date(date).toLocaleDateString('en-IN', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Class
            </label>
            <div className="grid grid-cols-3 gap-3">
              {Object.entries(classes).map(([key, value]) => (
                <button
                  key={key}
                  onClick={() => setSelectedClass(key)}
                  className={`p-4 border-2 rounded-lg transition ${
                    selectedClass === key
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <p className="font-semibold">{key}</p>
                  <p className="text-xs text-gray-600">{value}</p>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Quota
            </label>
            <select
              value={selectedQuota}
              onChange={(e) => setSelectedQuota(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {quotas.map((quota) => (
                <option key={quota} value={quota}>
                  {quota}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={checkAvailability}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition font-semibold"
          >
            Check Availability
          </button>

          {availability && (
            <div className="border border-gray-300 rounded-lg p-6 bg-gray-50">
              <h3 className="text-xl font-semibold mb-4">Availability Status</h3>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600">Available Berths</p>
                  <p className="text-2xl font-bold text-green-600">{availability.available}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Waiting List</p>
                  <p className="text-2xl font-bold text-orange-600">{availability.waiting}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">RAC</p>
                  <p className="text-2xl font-bold text-yellow-600">{availability.rac}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Fare per Ticket</p>
                  <p className="text-2xl font-bold text-blue-600">₹{availability.fare}</p>
                </div>
              </div>
              <button
                onClick={handleBookNow}
                className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 transition font-semibold"
              >
                Book Now
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

