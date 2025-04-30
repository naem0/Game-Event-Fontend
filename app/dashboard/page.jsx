"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { DashboardSkeleton } from "@/components/dashboard-skeleton"
import { Card } from "@/components/ui/card"

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
        <Card className=" p-6">
          <h2 className="text-sm font-medium text-gray-500">Current Balance</h2>
          <p className="text-3xl font-bold">{userData?.balance || 0} Taka</p>
        </Card>

        <Card className="p-6">
          <h2 className="text-sm font-medium text-gray-500">Referral Code</h2>
          <p className="text-xl font-semibold">{userData?.referralCode || "N/A"}</p>
        </Card>

        <Card className="p-6">
          <h2 className="text-sm font-medium text-gray-500">Referrals</h2>
          <p className="text-3xl font-bold">{userData?.referralCount || 0}</p>
        </Card>

        <Card className="p-6">
          <h2 className="text-sm font-medium text-gray-500">Account Type</h2>
          <p className="text-xl font-semibold capitalize">{userData?.role || "User"}</p>
        </Card>
      </div>

      {/* Rest of your dashboard content */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-2 p-6">
          <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
          <p className="text-gray-500">Your recent activity will appear here</p>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
          <div className="space-y-4">
            <a href="/dashboard/balance" className="block p-3 bg-blue-900/10 text-blue-700 rounded-md hover:bg-blue-900/20">
              Add Balance
            </a>
            <a
              href="/dashboard/tournaments"
              className="block p-3 bg-green-900/10 text-green-700 rounded-md hover:bg-green-900/20"
            >
              Join Tournament
            </a>
            <a
              href="/dashboard/referrals"
              className="block p-3 bg-purple-900/10 text-purple-700 rounded-md hover:bg-purple-900/20"
            >
              Invite Friends
            </a>
          </div>
        </Card>
      </div>
    </div>
  )
}
