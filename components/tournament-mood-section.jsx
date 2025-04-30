"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { TournamentMoodSkeleton } from "./tournament-mood-skeleton"

export function TournamentMoodSection() {
  const [moods, setMoods] = useState([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchMoods()
  }, [])

  const fetchMoods = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tournaments/moods`)

      if (!response.ok) {
        throw new Error("Failed to fetch tournament moods")
      }

      const data = await response.json()
      setMoods(data)
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to load tournament moods",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Images for each mood type
  const getMoodImage = (mood) => {
    const moodImages = {
      Classic: "/placeholder.svg?height=200&width=300&text=Classic",
      Arcade: "/placeholder.svg?height=200&width=300&text=Arcade",
      Ranked: "/placeholder.svg?height=200&width=300&text=Ranked",
      Casual: "/placeholder.svg?height=200&width=300&text=Casual",
    }

    return moodImages[mood] || "/placeholder.svg?height=200&width=300&text=Gaming"
  }

  if (loading) {
    return <TournamentMoodSkeleton />
  }

  return (
    <section className="py-12 bg-background dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold">Tournament Events</h2>
          <p className="text-muted-foreground mt-2">Choose your preferred tournament mood</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {moods.map((mood) => (
            <Card key={mood} className="text-center hover:shadow-md transition-shadow">
              <div className="h-40 overflow-hidden">
                <img
                  src={getMoodImage(mood) || "/placeholder.svg"}
                  alt={`${mood} tournaments`}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardHeader>
                <CardTitle>{mood}</CardTitle>
                <CardDescription>Tournament Mode</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline">
                  <Link href={`/tournaments?mood=${mood}`}>View Tournaments</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
