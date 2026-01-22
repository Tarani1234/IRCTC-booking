import { useState, useEffect } from 'react'

export default function PaymentMethods({ user }) {
  const [paymentMethods, setPaymentMethods] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    type: 'debit',
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    upiId: ''
  })

  useEffect(() => {
    loadPaymentMethods()
  }, [user])

  const loadPaymentMethods = () => {
    const methods = JSON.parse(localStorage.getItem(`paymentMethods_${user.id}`) || '[]')
    setPaymentMethods(methods)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const newMethod = {
      id: Date.now().toString(),
      type: formData.type,
      ...(formData.type === 'upi'
        ? { upiId: formData.upiId }
        : {
            cardNumber: formData.cardNumber.replace(/\s/g, '').slice(-4).padStart(16, '*'),
            cardName: formData.cardName,
            expiryDate: formData.expiryDate
          }
      ),
      createdAt: new Date().toISOString()
    }

    const updated = [...paymentMethods, newMethod]
    localStorage.setItem(`paymentMethods_${user.id}`, JSON.stringify(updated))
    setPaymentMethods(updated)
    setShowForm(false)
    setFormData({
      type: 'debit',
      cardNumber: '',
      cardName: '',
      expiryDate: '',
      cvv: '',
      upiId: ''
    })
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this payment method?')) {
      const updated = paymentMethods.filter(m => m.id !== id)
      localStorage.setItem(`paymentMethods_${user.id}`, JSON.stringify(updated))
      setPaymentMethods(updated)
    }
  }

  // Dummy payment function (Razorpay)
  const handleDummyPayment = (method) => {
    const options = {
      key: "rzp_test_S6qEOBr6hck9V5", 
      amount: 50000, 
      currency: "INR",
      name: "Dummy Store",
      description: "Dummy Payment",
      order_id: "order_dummy_123", 
      handler: (response) => {
        alert("Payment Successful (Dummy)")
        console.log("Payment Response:", response)
      },
      prefill: {
        name: method.cardName || "Test User",
        email: "test@example.com",
        contact: "9999999999",
      },
      theme: {
        color: "#3399cc",
      },
    }

    const rzp = new window.Razorpay(options)
    rzp.open()
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Payment Methods</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
          >
            {showForm ? 'Cancel' : '+ Add Payment Method'}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="mb-8 p-6 bg-gray-50 rounded-lg space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Type
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="debit">Debit Card</option>
                <option value="credit">Credit Card</option>
                <option value="upi">UPI</option>
              </select>
            </div>

            {formData.type === 'upi' ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  UPI ID
                </label>
                <input
                  type="text"
                  required
                  placeholder="example@paytm"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.upiId}
                  onChange={(e) => setFormData({ ...formData, upiId: e.target.value })}
                />
              </div>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Card Number
                  </label>
                  <input
                    type="text"
                    required
                    maxLength="19"
                    placeholder="1234 5678 9012 3456"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.cardNumber}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\s/g, '').replace(/\D/g, '')
                      const formatted = value.match(/.{1,4}/g)?.join(' ') || value
                      setFormData({ ...formData, cardNumber: formatted })
                    }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.cardName}
                    onChange={(e) => setFormData({ ...formData, cardName: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Expiry Date (MM/YY)
                    </label>
                    <input
                      type="text"
                      required
                      maxLength="5"
                      placeholder="12/25"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={formData.expiryDate}
                      onChange={(e) => {
                        let value = e.target.value.replace(/\D/g, '')
                        if (value.length >= 2) {
                          value = value.slice(0, 2) + '/' + value.slice(2, 4)
                        }
                        setFormData({ ...formData, expiryDate: value })
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CVV
                    </label>
                    <input
                      type="text"
                      required
                      maxLength="3"
                      placeholder="123"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={formData.cvv}
                      onChange={(e) => setFormData({ ...formData, cvv: e.target.value.replace(/\D/g, '') })}
                    />
                  </div>
                </div>
              </>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition font-semibold"
            >
              Add Payment Method
            </button>
          </form>
        )}

        <div className="space-y-4">
          {paymentMethods.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No payment methods added yet</p>
          ) : (
            paymentMethods.map((method) => (
              <div key={method.id} className="border border-gray-300 rounded-lg p-4 flex justify-between items-center">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">
                      {method.type === 'upi' ? '📱' : method.type === 'credit' ? '' : '💳'}
                    </span>
                    <div>
                      <p className="font-semibold capitalize">{method.type} Card</p>
                      {method.type === 'upi' ? (
                        <p className="text-gray-600">{method.upiId}</p>
                      ) : (
                        <>
                          <p className="text-gray-600">{method.cardNumber}</p>
                          <p className="text-sm text-gray-500">{method.cardName} • Exp: {method.expiryDate}</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Dummy Pay Button */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleDummyPayment(method)}
                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition font-semibold"
                  >
                    Pay
                  </button>

                  <button
                    onClick={() => handleDelete(method.id)}
                    className="text-red-600 hover:text-red-800 font-semibold"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
