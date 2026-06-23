'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      })

      const { user, accessToken, refreshToken } = response.data

      if (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
        setError('Access denied. Admin credentials required.')
        setLoading(false)
        return
      }

      localStorage.setItem('accessToken', accessToken)
      localStorage.setItem('refreshToken', refreshToken)
      localStorage.setItem('user', JSON.stringify(user))

      router.push('/dashboard')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed')
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="rounded-lg bg-white px-8 py-10 shadow-md">
          <h1 className="mb-2 text-center text-3xl font-bold text-gray-900">
            HKU Seat Finder
          </h1>
          <p className="mb-8 text-center text-sm text-gray-600">
            Admin Portal
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-700 focus:outline-none focus:ring-1 focus:ring-primary-700"
                placeholder="admin@hku.hk"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-700 focus:outline-none focus:ring-1 focus:ring-primary-700"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="rounded-md bg-red-50 p-3 text-sm text-red-800">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-primary-700 px-4 py-2 text-white hover:bg-primary-800 focus:outline-none focus:ring-2 focus:ring-primary-700 focus:ring-offset-2 disabled:opacity-50"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="mt-6 rounded-md bg-gray-50 p-4 text-xs text-gray-600">
            <p className="font-semibold">Test Account:</p>
            <p>Email: admin@hku.hk</p>
            <p>Password: admin123</p>
          </div>
        </div>
      </div>
    </div>
  )
}
