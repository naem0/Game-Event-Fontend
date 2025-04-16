"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

export function AdminPrizeDistribution({ onSuccess }) {
  const [tournaments, setTournaments] = useState([])
  const [users, setUsers] = useState([])
  const [selectedTournament, setSelectedTournament] = useState("")
  const [selectedUser, setSelectedUser] = useState("")
  const [prizeType, setPrizeType] = useState("")
  const [amount, setAmount] = useState("")
  const [kills, setKills] = useState("")
  const [position, setPosition] = useState("")
  const [playerName, setPlayerName] = useState("")
  const [playerID, setPlayerID] = useState("")
  const [notes, setNotes] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [loadingTournaments, setLoadingTournaments] = useState(true)
  const [loadingUsers, setLoadingUsers] = useState(true)

  const { data: session } = useSession()
  const { toast } = useToast()

  useEffect(() => {
    if (session?.user?.apiToken) {
      fetchTournaments()
      fetchUsers()
    }
  }, [session])

  const fetchTournaments = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tournaments?isCompleted=true`, {
        headers: {
          Authorization: `Bearer ${session.user.apiToken}`,
        },
      })

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
      setLoadingTournaments(false)
    }
  }

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users`, {
        headers: {
          Authorization: `Bearer ${session.user.apiToken}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch users")
      }

      const data = await response.json()
      setUsers(data)
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to load users",
        variant: "destructive",
      })
    } finally {
      setLoadingUsers(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!selectedTournament || !selectedUser || !prizeType || !amount) {
      toast({
        title: "Error",
        description: "Please fill all required fields",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/prizes/distribute`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.user.apiToken}`,
        },
        body: JSON.stringify({
          tournamentId: selectedTournament,
          userId: selectedUser,
          prizeType,
          amount: Number(amount),
          kills: kills ? Number(kills) : 0,
          position: position ? Number(position) : 0,
          playerName: playerName || "N/A",
          playerID: playerID || "N/A",
          accountNumber: "N/A",
          paymentMethod: "N/A",
          notes,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Failed to distribute prize money")
      }

      const data = await response.json()

      toast({
        title: "Success",
        description: "Prize money distributed successfully",
      })

      // Reset form
      setSelectedTournament("")
      setSelectedUser("")
      setPrizeType("")
      setAmount("")
      setKills("")
      setPosition("")
      setPlayerName("")
      setPlayerID("")
      setNotes("")

      // Call success callback if provided
      if (onSuccess) {
        onSuccess()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to distribute prize money",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Distribute Prize Money</CardTitle>
        <CardDescription>Directly distribute prize money to users</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tournament">Tournament</Label>
              <Select value={selectedTournament} onValueChange={setSelectedTournament} required>
                <SelectTrigger id="tournament">
                  <SelectValue placeholder="Select tournament" />
                </SelectTrigger>
                <SelectContent>
                  {loadingTournaments ? (
                    <SelectItem value="loading" disabled>
                      Loading tournaments...
                    </SelectItem>
                  ) : tournaments.length > 0 ? (
                    tournaments.map((tournament) => (
                      <SelectItem key={tournament._id} value={tournament._id}>
                        {tournament.title} ({tournament.game})
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="none" disabled>
                      No tournaments found
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="user">User</Label>
              <Select value={selectedUser} onValueChange={setSelectedUser} required>
                <SelectTrigger id="user">
                  <SelectValue placeholder="Select user" />
                </SelectTrigger>
                <SelectContent>
                  {loadingUsers ? (
                    <SelectItem value="loading" disabled>
                      Loading users...
                    </SelectItem>
                  ) : users.length > 0 ? (
                    users.map((user) => (
                      <SelectItem key={user._id} value={user._id}>
                        {user.name} ({user.email})
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="none" disabled>
                      No users found
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Prize Type</Label>
            <RadioGroup value={prizeType} onValueChange={setPrizeType} className="grid grid-cols-2 gap-4">
              <Label
                htmlFor="kill_prize_dist"
                className={`flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer ${
                  prizeType === "kill_prize" ? "border-primary" : ""
                }`}
              >
                <RadioGroupItem value="kill_prize" id="kill_prize_dist" className="sr-only" />
                <span className="mt-2 text-sm font-medium">Kill Prize</span>
              </Label>
              <Label
                htmlFor="winner_prize_dist"
                className={`flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer ${
                  prizeType === "winner_prize" ? "border-primary" : ""
                }`}
              >
                <RadioGroupItem value="winner_prize" id="winner_prize_dist" className="sr-only" />
                <span className="mt-2 text-sm font-medium">Winner Prize</span>
              </Label>
              <Label
                htmlFor="both_dist"
                className={`flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer ${
                  prizeType === "both" ? "border-primary" : ""
                }`}
              >
                <RadioGroupItem value="both" id="both_dist" className="sr-only" />
                <span className="mt-2 text-sm font-medium">Both Kill & Winner Prize</span>
              </Label>
              <Label
                htmlFor="other_dist"
                className={`flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer ${
                  prizeType === "other" ? "border-primary" : ""
                }`}
              >
                <RadioGroupItem value="other" id="other_dist" className="sr-only" />
                <span className="mt-2 text-sm font-medium">Other Prize</span>
              </Label>
            </RadioGroup>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (Taka) *</Label>
              <Input
                id="amount"
                type="number"
                min="1"
                step="1"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="kills">Number of Kills</Label>
              <Input
                id="kills"
                type="number"
                min="0"
                step="1"
                value={kills}
                onChange={(e) => setKills(e.target.value)}
                placeholder="Enter number of kills"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="position">Position</Label>
              <Input
                id="position"
                type="number"
                min="1"
                step="1"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                placeholder="Enter position"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="playerName">In-Game Player Name (Optional)</Label>
              <Input
                id="playerName"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Enter in-game name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="playerID">In-Game Player ID (Optional)</Label>
              <Input
                id="playerID"
                value={playerID}
                onChange={(e) => setPlayerID(e.target.value)}
                placeholder="Enter in-game ID"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any notes about this prize distribution"
              rows={3}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Processing..." : "Distribute Prize Money"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
