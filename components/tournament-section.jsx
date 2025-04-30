"use client"

import { useState, useEffect } from "react"
import { TournamentCard } from "@/components/tournament-card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { TournamentSectionSkeleton } from "./tournament-section-skeleton"

export function TournamentSection() {
  const [tournaments, setTournaments] = useState([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchTournaments()
  }, [])

  const fetchTournaments = async () => {
    try {
      // Changed to fetch all active tournaments instead of just featured ones
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tournaments?isActive=true&limit=6`)

      if (!response.ok) {
        throw new Error("Failed to fetch tournaments")
      }

      const data = await response.json()
      setTournaments(data.tournaments)
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to load tournaments",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <TournamentSectionSkeleton />
  }

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl font-bold">Upcoming Tournaments</h2>
            <p className="text-muted-foreground mt-2">Join our exciting gaming tournaments</p>
          </div>
          <Button asChild variant="outline">
            <Link href="/tournaments">View All</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tournaments.map((tournament) => (
            <TournamentCard key={tournament._id} tournament={tournament} />
          ))}
        </div>
      </div>
    </section>
  )
}
