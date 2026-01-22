import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function Login({ onLogin }) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [error, setError] = useState('')
  const navigate = useNavigate()

  // ✅ Ensure admin exists ONCE when page loads
  useEffect(() => {
    const users = JSON.parse(localStorage.getItem('users') || '[]')

    const adminEmail = 'admin@irctc.com'
    const adminPassword = 'admin123'

    const adminIndex = users.findIndex(
      u => (u.email || '').toLowerCase() === adminEmail.toLowerCase()
    )

    if (adminIndex === -1) {
      users.push({
        id: 'admin-001',
        name: 'Admin',
        email: adminEmail,
        password: adminPassword,
        role: 'admin',
        createdAt: new Date().toISOString()
      })
    } else {
      // Upsert admin: ensure role + credentials are correct even if an old record exists
      users[adminIndex] = {
        ...users[adminIndex],
        id: users[adminIndex].id || 'admin-001',
        name: users[adminIndex].name || 'Admin',
        email: adminEmail,
        password: adminPassword,
        role: 'admin',
        createdAt: users[adminIndex].createdAt || new Date().toISOString()
      }
    }

    localStorage.setItem('users', JSON.stringify(users))
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    // 🔁 Always read fresh users
    const users = JSON.parse(localStorage.getItem('users') || '[]')

    const email = formData.email.trim().toLowerCase()
    const password = formData.password

    const user = users.find(
      u =>
        (u.email || '').trim().toLowerCase() === email &&
        u.password === password
    )

    if (!user) {
      setError('Invalid email or password')
      return
    }

    localStorage.setItem('currentUser', JSON.stringify(user))
    onLogin(user)

    if (user.role === 'admin') {
      navigate('/admin')
    } else {
      navigate('/')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-center text-3xl font-bold mb-6">
          Sign in
        </h2>

        {error && (
          <div className="bg-red-100 text-red-700 p-2 mb-4 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            required
            value={formData.email}
            onChange={e => setFormData({ ...formData, email: e.target.value })}
            className="w-full border p-2 rounded"
          />

          <input
            type="password"
            placeholder="Password"
            required
            value={formData.password}
            onChange={e => setFormData({ ...formData, password: e.target.value })}
            className="w-full border p-2 rounded"
          />

          <button className="w-full bg-blue-600 text-white p-2 rounded">
            Login
          </button>
        </form>

        <p className="text-center mt-4 text-sm">
          Don’t have an account?{' '}
          <Link to="/signup" className="text-blue-600 font-semibold">
            Sign up
          </Link>
        </p>

        <div className="mt-4 bg-gray-100 p-3 text-xs rounded">
          <p className="font-semibold">Admin Login</p>
          <p>Email: admin@irctc.com</p>
          <p>Password: admin123</p>
        </div>
      </div>
    </div>
  )
}
