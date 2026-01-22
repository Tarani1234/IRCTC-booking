import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

export default function Booking({ user }) {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [passengers, setPassengers] = useState([])
  const [savedPassengers, setSavedPassengers] = useState([])
  const [selectedPassengers, setSelectedPassengers] = useState([])
  const [passengerDetails, setPassengerDetails] = useState([{
    name: '',
    age: '',
    gender: 'male',
    berthPreference: 'no-preference'
  }])
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('')
  const [paymentMethods, setPaymentMethods] = useState([])
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [bookingConfirmed, setBookingConfirmed] = useState(false)
  const [pnr, setPnr] = useState('')

  const trainId = searchParams.get('trainId')
  const trainName = searchParams.get('trainName')
  const source = searchParams.get('source')
  const destination = searchParams.get('destination')
  const date = searchParams.get('date')
  const trainClass = searchParams.get('class')
  const quota = searchParams.get('quota')
  const fare = parseInt(searchParams.get('fare'))
  const available = parseInt(searchParams.get('available'))

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }

    // Load saved passengers
    const saved = JSON.parse(localStorage.getItem(`passengers_${user.id}`) || '[]')
    setSavedPassengers(saved)

    // Load payment methods
    const methods = JSON.parse(localStorage.getItem(`paymentMethods_${user.id}`) || '[]')
    setPaymentMethods(methods)
  }, [user, navigate])

  const addPassenger = () => {
    setPassengerDetails([...passengerDetails, {
      name: '',
      age: '',
      gender: 'male',
      berthPreference: 'no-preference'
    }])
  }

  const removePassenger = (index) => {
    if (passengerDetails.length > 1) {
      setPassengerDetails(passengerDetails.filter((_, i) => i !== index))
    }
  }

  const updatePassenger = (index, field, value) => {
    const updated = [...passengerDetails]
    updated[index][field] = value
    setPassengerDetails(updated)
  }

  const useSavedPassenger = (passenger) => {
    const index = selectedPassengers.length
    setPassengerDetails([...passengerDetails, {
      name: passenger.name,
      age: passenger.age.toString(),
      gender: passenger.gender,
      berthPreference: passenger.berthPreference
    }])
    setSelectedPassengers([...selectedPassengers, passenger.id])
  }

  const handleProceedToPayment = () => {
    // Validate passenger details
    for (let i = 0; i < passengerDetails.length; i++) {
      const p = passengerDetails[i]
      if (!p.name || !p.age || parseInt(p.age) < 1 || parseInt(p.age) > 120) {
        alert(`Please fill valid details for Passenger ${i + 1}`)
        return
      }
    }

    if (passengerDetails.length > available) {
      alert(`Only ${available} seats available. Please reduce number of passengers.`)
      return
    }

    if (paymentMethods.length === 0) {
      alert('Please add a payment method first')
      navigate('/payment-methods')
      return
    }

    setShowPaymentModal(true)
  }

  const handlePayment = () => {
    if (!selectedPaymentMethod) {
      alert('Please select a payment method')
      return
    }

    // Simulate payment processing
    setTimeout(() => {
      // Generate PNR
      const generatedPnr = 'PNR' + Date.now().toString().slice(-10)
      setPnr(generatedPnr)

      // Create booking
      const booking = {
        id: Date.now().toString(),
        pnr: generatedPnr,
        userId: user.id,
        trainId,
        trainName,
        source,
        destination,
        date,
        class: trainClass,
        quota,
        fare: fare * passengerDetails.length,
        passengers: passengerDetails.map(p => ({
          ...p,
          age: parseInt(p.age)
        })),
        paymentMethod: selectedPaymentMethod,
        status: 'confirmed',
        bookingDate: new Date().toISOString()
      }

      // Save booking
      const bookings = JSON.parse(localStorage.getItem(`bookings_${user.id}`) || '[]')
      bookings.push(booking)
      localStorage.setItem(`bookings_${user.id}`, JSON.stringify(bookings))

      setBookingConfirmed(true)
      setShowPaymentModal(false)
    }, 2000)
  }

  const totalFare = fare * passengerDetails.length

  if (bookingConfirmed) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="text-6xl mb-4">✅</div>
          <h1 className="text-3xl font-bold text-green-600 mb-4">Booking Confirmed!</h1>
          <p className="text-xl font-semibold mb-2">PNR Number: <span className="text-blue-600">{pnr}</span></p>
          <p className="text-gray-600 mb-6">Your ticket has been booked successfully</p>
          <div className="space-y-2 mb-6 text-left bg-gray-50 p-4 rounded">
            <p><strong>Train:</strong> {trainName} ({trainId})</p>
            <p><strong>Route:</strong> {source} → {destination}</p>
            <p><strong>Date:</strong> {new Date(date).toLocaleDateString('en-IN')}</p>
            <p><strong>Class:</strong> {trainClass} | <strong>Quota:</strong> {quota}</p>
            <p><strong>Passengers:</strong> {passengerDetails.length}</p>
            <p><strong>Total Fare:</strong> ₹{totalFare}</p>
          </div>
          <div className="space-x-4">
            <button
              onClick={() => navigate('/my-bookings')}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
            >
              View My Bookings
            </button>
            <button
              onClick={() => navigate('/search-trains')}
              className="bg-gray-300 text-gray-800 px-6 py-2 rounded-md hover:bg-gray-400 transition"
            >
              Book Another Ticket
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white rounded-lg shadow-md p-8 mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Complete Booking</h1>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h2 className="text-xl font-semibold mb-2">{trainName}</h2>
          <p className="text-sm text-gray-600">
            {source} → {destination} | {new Date(date).toLocaleDateString('en-IN')} | {trainClass} | {quota}
          </p>
          <p className="text-sm text-gray-600 mt-1">Fare per ticket: ₹{fare}</p>
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Passenger Details</h2>
            <button
              onClick={addPassenger}
              className="text-blue-600 hover:text-blue-800 font-semibold"
            >
              + Add Passenger
            </button>
          </div>

          {savedPassengers.length > 0 && (
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm font-semibold mb-2">Use Saved Passengers:</p>
              <div className="flex flex-wrap gap-2">
                {savedPassengers.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => useSavedPassenger(p)}
                    className="bg-white border border-gray-300 px-3 py-1 rounded text-sm hover:bg-gray-100"
                  >
                    {p.name} ({p.age})
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-4">
            {passengerDetails.map((passenger, index) => (
              <div key={index} className="border border-gray-300 rounded-lg p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold">Passenger {index + 1}</h3>
                  {passengerDetails.length > 1 && (
                    <button
                      onClick={() => removePassenger(index)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={passenger.name}
                      onChange={(e) => updatePassenger(index, 'name', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Age
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      max="120"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={passenger.age}
                      onChange={(e) => updatePassenger(index, 'age', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Gender
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={passenger.gender}
                      onChange={(e) => updatePassenger(index, 'gender', e.target.value)}
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Berth Preference
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={passenger.berthPreference}
                      onChange={(e) => updatePassenger(index, 'berthPreference', e.target.value)}
                    >
                      <option value="no-preference">No Preference</option>
                      <option value="lower">Lower</option>
                      <option value="middle">Middle</option>
                      <option value="upper">Upper</option>
                      <option value="side-lower">Side Lower</option>
                      <option value="side-upper">Side Upper</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t pt-6">
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg font-semibold">Total Fare ({passengerDetails.length} passengers):</span>
            <span className="text-2xl font-bold text-blue-600">₹{totalFare}</span>
          </div>
          <button
            onClick={handleProceedToPayment}
            className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 transition font-semibold"
          >
            Proceed to Payment
          </button>
        </div>
      </div>

      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold mb-4">Select Payment Method</h2>
            <div className="space-y-3 mb-6">
              {paymentMethods.map((method) => (
                <label
                  key={method.id}
                  className={`block border-2 rounded-lg p-4 cursor-pointer ${
                    selectedPaymentMethod === method.id
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method.id}
                    checked={selectedPaymentMethod === method.id}
                    onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                    className="mr-2"
                  />
                  <span className="font-semibold capitalize">{method.type}</span>
                  {method.type === 'upi' ? (
                    <p className="text-sm text-gray-600">{method.upiId}</p>
                  ) : (
                    <p className="text-sm text-gray-600">{method.cardNumber}</p>
                  )}
                </label>
              ))}
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => {
                  setShowPaymentModal(false)
                  navigate('/payment-methods')
                }}
                className="flex-1 bg-gray-300 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-400 transition"
              >
                Add New Method
              </button>
              <button
                onClick={handlePayment}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition font-semibold"
              >
                Pay ₹{totalFare}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

