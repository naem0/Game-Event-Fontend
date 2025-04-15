"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { format } from "date-fns"
import Link from "next/link"
import { Eye } from "lucide-react"

export function UserTournaments() {
  const [registrations, setRegistrations] = useState([])
  const [loading, setLoading] = useState(true)
  const { data: session } = useSession()
  const { toast } = useToast()

  useEffect(() => {
    if (session?.user?.apiToken) {
      fetchUserRegistrations()
    }
  }, [session])

  const fetchUserRegistrations = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tournaments/user/registrations`, {
        headers: {
          Authorization: `Bearer ${session.user.apiToken}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch your tournament registrations")
      }

      const data = await response.json()
      setRegistrations(data)
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to load your tournament registrations",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div>Loading your tournaments...</div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Tournaments</CardTitle>
        <CardDescription>Tournaments you have registered for</CardDescription>
      </CardHeader>
      <CardContent>
        {registrations.length > 0 ? (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tournament</TableHead>
                  <TableHead>Player Details</TableHead>
                  <TableHead>Schedule</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {registrations.map((registration) => (
                  <TableRow key={registration._id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <img
                          src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${registration.tournament.logo}`}
                          alt={registration.tournament.title}
                          className="h-8 w-8 rounded-md object-contain"
                        />
                        <div>
                          <p className="font-medium">{registration.tournament.title}</p>
                          <p className="text-xs text-muted-foreground">{registration.tournament.game}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="font-medium">{registration.playerName}</p>
                      <p className="text-xs font-mono">{registration.playerID}</p>
                    </TableCell>
                    <TableCell>
                      {format(new Date(registration.tournament.matchSchedule), "MMM d, yyyy h:mm a")}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          registration.tournament.isCompleted
                            ? "bg-blue-100 text-blue-800"
                            : registration.tournament.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                        }`}
                      >
                        {registration.tournament.isCompleted
                          ? "Completed"
                          : registration.tournament.isActive
                            ? "Active"
                            : "Inactive"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/tournaments/${registration.tournament._id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-muted-foreground">You haven't joined any tournaments yet</p>
            <Button asChild className="mt-4">
              <Link href="/tournaments">Browse Tournaments</Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
