'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { Building, Users, MapPin, Activity } from 'lucide-react'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export default function DashboardPage() {
  const router = useRouter()
  const [zones, setZones] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    const userData = localStorage.getItem('user')

    if (!token) {
      router.push('/login')
      return
    }

    if (userData) {
      setUser(JSON.parse(userData))
    }

    fetchZones()
  }, [router])

  const fetchZones = async () => {
    try {
      const token = localStorage.getItem('accessToken')
      const response = await axios.get(`${API_URL}/zones`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setZones(response.data)
      setLoading(false)
    } catch (error) {
      console.error('Failed to fetch zones:', error)
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.clear()
    router.push('/login')
  }

  const totalCapacity = zones.reduce((sum, zone) => sum + zone.capacity, 0)
  const totalActive = zones.reduce((sum, zone) => sum + zone.activeCheckins, 0)
  const avgOccupancy = zones.length > 0
    ? zones.reduce((sum, zone) => sum + zone.occupancyRate, 0) / zones.length
    : 0

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">HKU Seat Finder Admin</h1>
            <p className="text-sm text-gray-600">Live Occupancy Dashboard</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">{user?.email}</span>
            <button
              onClick={handleLogout}
              className="rounded-md bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8">
        {/* Stats */}
        <div className="mb-8 grid gap-6 md:grid-cols-4">
          <div className="rounded-lg bg-white p-6 shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Zones</p>
                <p className="text-3xl font-bold text-gray-900">{zones.length}</p>
              </div>
              <MapPin className="h-12 w-12 text-primary-700" />
            </div>
          </div>

          <div className="rounded-lg bg-white p-6 shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Capacity</p>
                <p className="text-3xl font-bold text-gray-900">{totalCapacity}</p>
              </div>
              <Building className="h-12 w-12 text-blue-600" />
            </div>
          </div>

          <div className="rounded-lg bg-white p-6 shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Users</p>
                <p className="text-3xl font-bold text-gray-900">{totalActive}</p>
              </div>
              <Users className="h-12 w-12 text-green-600" />
            </div>
          </div>

          <div className="rounded-lg bg-white p-6 shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Occupancy</p>
                <p className="text-3xl font-bold text-gray-900">{avgOccupancy.toFixed(0)}%</p>
              </div>
              <Activity className="h-12 w-12 text-orange-600" />
            </div>
          </div>
        </div>

        {/* Zones Table */}
        <div className="rounded-lg bg-white shadow">
          <div className="border-b px-6 py-4">
            <h2 className="text-lg font-semibold text-gray-900">All Zones</h2>
            <p className="text-sm text-gray-600">Real-time occupancy data</p>
          </div>

          {loading ? (
            <div className="p-8 text-center text-gray-600">Loading...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Zone
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Building
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Floor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Capacity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Active
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Occupancy
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {zones.map((zone) => {
                    const rate = zone.occupancyRate || 0
                    const status = rate < 60 ? 'Available' : rate < 85 ? 'Filling' : 'Full'
                    const statusColor = rate < 60 ? 'text-green-600 bg-green-50' : rate < 85 ? 'text-yellow-600 bg-yellow-50' : 'text-red-600 bg-red-50'

                    return (
                      <tr key={zone.id} className="hover:bg-gray-50">
                        <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                          {zone.name}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                          {zone.building}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                          {zone.floor}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                          {zone.capacity}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-gray-900">
                          {zone.activeCheckins}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-24 overflow-hidden rounded-full bg-gray-200">
                              <div
                                className={`h-full ${rate < 60 ? 'bg-green-500' : rate < 85 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                style={{ width: `${Math.min(rate, 100)}%` }}
                              />
                            </div>
                            <span className="text-sm text-gray-600">{rate.toFixed(0)}%</span>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusColor}`}>
                            {status}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Refresh Note */}
        <div className="mt-6 rounded-lg bg-blue-50 p-4">
          <p className="text-sm text-blue-800">
            💡 <strong>Tip:</strong> This dashboard shows real-time data. Refresh the page to see the latest occupancy updates.
          </p>
        </div>
      </main>
    </div>
  )
}
