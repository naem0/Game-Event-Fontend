"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { DashboardSkeleton } from "@/components/dashboard-skeleton"

export default function DashboardPage() {
  const { data: session } = useSession()
  const [loading, setLoading] = useState(true)
  const [userData, setUserData] = useState(null)

  useEffect(() => {
    if (session?.user?.apiToken) {
      fetchUserData()
    }
  }, [session])

  const fetchUserData = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/profile`, {
        headers: {
          Authorization: `Bearer ${session.user.apiToken}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch user data")
      }

      const data = await response.json()
      setUserData(data)
    } catch (error) {
      console.error("Error fetching user data:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <DashboardSkeleton />
  }

  // Rest of your dashboard component
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      {/* Display user data */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-sm font-medium text-gray-500">Current Balance</h2>
          <p className="text-3xl font-bold">{userData?.balance || 0} Taka</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-sm font-medium text-gray-500">Referral Code</h2>
          <p className="text-xl font-semibold">{userData?.referralCode || "N/A"}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-sm font-medium text-gray-500">Referrals</h2>
          <p className="text-3xl font-bold">{userData?.referralCount || 0}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-sm font-medium text-gray-500">Account Type</h2>
          <p className="text-xl font-semibold capitalize">{userData?.role || "User"}</p>
        </div>
      </div>

      {/* Rest of your dashboard content */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="col-span-2 bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
          <p className="text-gray-500">Your recent activity will appear here</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
          <div className="space-y-4">
            <a href="/dashboard/balance" className="block p-3 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100">
              Add Balance
            </a>
            <a
              href="/dashboard/tournaments"
              className="block p-3 bg-green-50 text-green-700 rounded-md hover:bg-green-100"
            >
              Join Tournament
            </a>
            <a
              href="/dashboard/referrals"
              className="block p-3 bg-purple-50 text-purple-700 rounded-md hover:bg-purple-100"
            >
              Invite Friends
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
