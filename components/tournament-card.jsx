"use client"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { format } from "date-fns"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useSession } from "next-auth/react"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

export function TournamentCard({ tournament }) {
  const [joinDialogOpen, setJoinDialogOpen] = useState(false)
  const [playerName, setPlayerName] = useState("")
  const [playerID, setPlayerID] = useState("")
  const [isJoining, setIsJoining] = useState(false)
  const { data: session } = useSession()
  const { toast } = useToast()
  const router = useRouter()

  const registrationPercentage = Math.min(Math.round((tournament.playersRegistered / tournament.maxPlayers) * 100), 100)

  const handleJoinNow = () => {
    if (!session) {
      router.push("/login?redirect=/tournaments")
      return
    }

    setJoinDialogOpen(true)
  }

  const handleSubmitRegistration = async (e) => {
    e.preventDefault()

    if (!playerName || !playerID) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      return
    }

    setIsJoining(true)

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tournaments/${tournament._id}/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.user.apiToken}`,
          },
          body: JSON.stringify({
            playerName,
            playerID,
          }),
        },
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to join tournament")
      }

      toast({
        title: "Success",
        description: "You have successfully joined the tournament",
      })

      setJoinDialogOpen(false)
      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to join tournament",
        variant: "destructive",
      })
    } finally {
      setIsJoining(false)
    }
  }

  return (
    <>
      <Card className="overflow-hidden transition-all hover:shadow-md">
        <div className="relative h-40 bg-muted">
          <img
            src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${tournament.coverImage}`}
            alt={tournament.title}
            className="h-full w-full object-cover"
          />
          <div className="absolute top-2 left-2 h-12 w-12 rounded-md bg-white p-1">
            <img
              src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${tournament.logo}`}
              alt={`${tournament.game} logo`}
              className="h-full w-full object-contain"
            />
          </div>
        </div>
        <CardContent className="p-4">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="font-bold">{tournament.title}</h3>
            <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
              {tournament.type}
            </span>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Schedule:</span>
              <span className="font-medium">{format(new Date(tournament.matchSchedule), "MMM d, h:mm a")}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Per Kill:</span>
              <span className="font-medium">{tournament.perKillPrize} Taka</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Winning Prize:</span>
              <span className="font-medium">{tournament.winningPrize} Taka</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Entry Fee:</span>
              <span className="font-medium">{tournament.entryFee} Taka</span>
            </div>
          </div>

          <div className="mt-4">
            <div className="mb-1 flex justify-between text-xs">
              <span>{tournament.playersRegistered} Players</span>
              <span>{registrationPercentage}% Full</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
              <div className="h-full rounded-full bg-blue-600" style={{ width: `${registrationPercentage}%` }}></div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex gap-2 p-4 pt-0">
          <Button variant="outline" asChild className="flex-1">
            <Link href={`/tournaments/${tournament._id}`}>View Details</Link>
          </Button>
          <Button
            className="flex-1"
            onClick={handleJoinNow}
            disabled={tournament.playersRegistered >= tournament.maxPlayers}
          >
            Join Now
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={joinDialogOpen} onOpenChange={setJoinDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Join Tournament: {tournament.title}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmitRegistration} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="playerName">In-Game Player Name</Label>
              <Input
                id="playerName"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Enter your in-game name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="playerID">In-Game Player ID</Label>
              <Input
                id="playerID"
                value={playerID}
                onChange={(e) => setPlayerID(e.target.value)}
                placeholder="Enter your in-game ID"
                required
              />
            </div>
            <div className="rounded-md bg-amber-50 p-3 text-sm text-amber-800">
              <p>
                Entry fee of <strong>{tournament.entryFee} Taka</strong> will be deducted from your balance.
              </p>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setJoinDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isJoining}>
                {isJoining ? "Joining..." : "Confirm & Join"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
