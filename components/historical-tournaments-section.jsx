"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { format } from "date-fns"
import { HistoricalTournamentsSkeleton } from "./historical-tournaments-skeleton"

export function HistoricalTournamentsSection() {
  const [tournaments, setTournaments] = useState([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchHistoricalTournaments()
  }, [])

  const fetchHistoricalTournaments = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tournaments/historical`)

      if (!response.ok) {
        throw new Error("Failed to fetch historical tournaments")
      }

      const data = await response.json()
      setTournaments(data)
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to load historical tournaments",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <HistoricalTournamentsSkeleton />
  }

  return (
    <section className="py-12 bg-background dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold">Historical Tournaments Ever</h2>
          <p className="text-muted-foreground mt-2">Our past tournaments and achievements</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tournaments.map((tournament) => (
            <Card key={tournament._id} className="overflow-hidden hover:shadow-md transition-shadow">
              <div className="h-40 bg-muted">
                <img
                  src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${tournament.coverImage}`}
                  alt={tournament.title}
                  className="h-full w-full object-cover"
                />
              </div>
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-bold">{tournament.title}</h3>
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(tournament.matchSchedule), "MMM d, yyyy")}
                  </span>
                </div>
                <div className="flex items-center space-x-2 mb-2">
                  <img
                    src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${tournament.logo}`}
                    alt={`${tournament.game} logo`}
                    className="h-6 w-6 object-contain"
                  />
                  <span className="text-sm font-medium">{tournament.game}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>
                    Prize Pool: <span className="font-medium">{tournament.winningPrize} Taka</span>
                  </span>
                  <span>
                    Players: <span className="font-medium">{tournament.playersRegistered}</span>
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
