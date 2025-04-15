"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import { format } from "date-fns"

export function AdminTournamentRegistrations({ tournamentId }) {
  const [registrations, setRegistrations] = useState([])
  const [tournament, setTournament] = useState(null)
  const [loading, setLoading] = useState(true)
  const { data: session } = useSession()
  const { toast } = useToast()

  useEffect(() => {
    if (session?.user?.apiToken && tournamentId) {
      fetchTournamentDetails()
      fetchRegistrations()
    }
  }, [session, tournamentId])

  const fetchTournamentDetails = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tournaments/${tournamentId}`, {
        headers: {
          Authorization: `Bearer ${session.user.apiToken}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch tournament details")
      }

      const data = await response.json()
      setTournament(data)
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to load tournament details",
        variant: "destructive",
      })
    }
  }

  const fetchRegistrations = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tournaments/${tournamentId}/registrations`,
        {
          headers: {
            Authorization: `Bearer ${session.user.apiToken}`,
          },
        },
      )

      if (!response.ok) {
        throw new Error("Failed to fetch registrations")
      }

      const data = await response.json()
      setRegistrations(data)
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to load registrations",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div>Loading registrations...</div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tournament Registrations</CardTitle>
        <CardDescription>
          {tournament ? (
            <>
              Registered players for <span className="font-medium">{tournament.title}</span> ({registrations.length} /{" "}
              {tournament.maxPlayers})
            </>
          ) : (
            "View all registered players for this tournament"
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {registrations.length > 0 ? (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Player Name</TableHead>
                  <TableHead>Player ID</TableHead>
                  <TableHead>Registration Date</TableHead>
                  <TableHead>Payment Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {registrations.map((registration) => (
                  <TableRow key={registration._id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{registration.user.name}</p>
                        <p className="text-xs text-muted-foreground">{registration.user.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>{registration.playerName}</TableCell>
                    <TableCell className="font-mono">{registration.playerID}</TableCell>
                    <TableCell>{format(new Date(registration.registrationDate), "MMM d, yyyy h:mm a")}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          registration.paymentStatus === "completed"
                            ? "bg-green-100 text-green-800"
                            : registration.paymentStatus === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                        }`}
                      >
                        {registration.paymentStatus.charAt(0).toUpperCase() + registration.paymentStatus.slice(1)}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-muted-foreground">No registrations found for this tournament</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
