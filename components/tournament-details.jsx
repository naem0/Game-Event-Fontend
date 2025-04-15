"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useSession } from "next-auth/react"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { CalendarDays, MapPin, Trophy, Swords, Users, Clock, DollarSign, Gamepad2 } from "lucide-react"

export function TournamentDetails({ tournament }) {
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
      router.push(`/login?redirect=/tournaments/${tournament._id}`)
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
      <div className="container mx-auto px-4 py-8">
        <div className="relative h-64 md:h-96 rounded-xl overflow-hidden mb-8">
          <img
            src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${tournament.coverImage}`}
            alt={tournament.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
          <div className="absolute bottom-0 left-0 p-6 flex items-end">
            <div className="mr-4 h-20 w-20 bg-white rounded-lg p-2">
              <img
                src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${tournament.logo}`}
                alt={`${tournament.game} logo`}
                className="h-full w-full object-contain"
              />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">{tournament.title}</h1>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">{tournament.game}</Badge>
                <Badge variant="secondary">{tournament.type}</Badge>
                <Badge variant="secondary">{tournament.device}</Badge>
                <Badge variant="secondary">{tournament.mood}</Badge>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4">Tournament Details</h2>
                <p className="mb-6">{tournament.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center">
                    <CalendarDays className="h-5 w-5 mr-3 text-blue-600" />
                    <div>
                      <p className="text-sm text-muted-foreground">Date & Time</p>
                      <p className="font-medium">
                        {format(new Date(tournament.matchSchedule), "MMMM d, yyyy 'at' h:mm a")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 mr-3 text-blue-600" />
                    <div>
                      <p className="text-sm text-muted-foreground">Map</p>
                      <p className="font-medium">{tournament.map}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <Trophy className="h-5 w-5 mr-3 text-blue-600" />
                    <div>
                      <p className="text-sm text-muted-foreground">Winning Prize</p>
                      <p className="font-medium">{tournament.winningPrize} Taka</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <Swords className="h-5 w-5 mr-3 text-blue-600" />
                    <div>
                      <p className="text-sm text-muted-foreground">Per Kill Prize</p>
                      <p className="font-medium">{tournament.perKillPrize} Taka</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <Users className="h-5 w-5 mr-3 text-blue-600" />
                    <div>
                      <p className="text-sm text-muted-foreground">Players</p>
                      <p className="font-medium">
                        {tournament.playersRegistered} / {tournament.maxPlayers}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <Clock className="h-5 w-5 mr-3 text-blue-600" />
                    <div>
                      <p className="text-sm text-muted-foreground">Version</p>
                      <p className="font-medium">{tournament.version}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <DollarSign className="h-5 w-5 mr-3 text-blue-600" />
                    <div>
                      <p className="text-sm text-muted-foreground">Entry Fee</p>
                      <p className="font-medium">{tournament.entryFee} Taka</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <Gamepad2 className="h-5 w-5 mr-3 text-blue-600" />
                    <div>
                      <p className="text-sm text-muted-foreground">Match Type</p>
                      <p className="font-medium">{tournament.matchType}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4">Rules & Instructions</h2>
                <div className="prose max-w-none">
                  <p className="whitespace-pre-line">{tournament.rules}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4">Registration Status</h3>

                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span>{tournament.playersRegistered} Players Registered</span>
                    <span>{registrationPercentage}% Full</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                    <div
                      className="h-full rounded-full bg-blue-600"
                      style={{ width: `${registrationPercentage}%` }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tournament Code:</span>
                    <span className="font-mono font-medium">{tournament.tournamentCode}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Entry Fee:</span>
                    <span className="font-medium">{tournament.entryFee} Taka</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <span className={`font-medium ${tournament.isActive ? "text-green-600" : "text-red-600"}`}>
                      {tournament.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>

                <Button
                  className="w-full mt-6"
                  onClick={handleJoinNow}
                  disabled={
                    !tournament.isActive ||
                    tournament.isCompleted ||
                    tournament.playersRegistered >= tournament.maxPlayers
                  }
                >
                  {tournament.isCompleted
                    ? "Tournament Completed"
                    : !tournament.isActive
                      ? "Tournament Inactive"
                      : tournament.playersRegistered >= tournament.maxPlayers
                        ? "Tournament Full"
                        : "Join Tournament"}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4">Need Help?</h3>
                <p className="text-muted-foreground mb-4">
                  If you have any questions about this tournament, please contact our support team.
                </p>
                <Button variant="outline" className="w-full">
                  Contact Support
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

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
