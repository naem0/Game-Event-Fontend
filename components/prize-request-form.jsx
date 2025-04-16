"use client"

import { useState, useEffect, useRef } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Upload } from "lucide-react"

export function PrizeRequestForm({ onSuccess }) {
  const [tournaments, setTournaments] = useState([])
  const [selectedTournament, setSelectedTournament] = useState("")
  const [tournamentCode, setTournamentCode] = useState("")
  const [prizeType, setPrizeType] = useState("")
  const [amount, setAmount] = useState("")
  const [kills, setKills] = useState("")
  const [position, setPosition] = useState("")
  const [playerName, setPlayerName] = useState("")
  const [playerID, setPlayerID] = useState("")
  const [notes, setNotes] = useState("")
  const [proofImage, setProofImage] = useState(null)
  const [imagePreview, setImagePreview] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [loadingTournaments, setLoadingTournaments] = useState(true)

  const { data: session } = useSession()
  const { toast } = useToast()
  const fileInputRef = useRef(null)

  useEffect(() => {
    if (session?.user?.apiToken) {
      fetchRecentTournaments()
    }
  }, [session])

  const fetchRecentTournaments = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/prizes/recent-tournaments`, {
        headers: {
          Authorization: `Bearer ${session.user.apiToken}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch recent tournaments")
      }

      const data = await response.json()
      setTournaments(data)
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to load recent tournaments",
        variant: "destructive",
      })
    } finally {
      setLoadingTournaments(false)
    }
  }

  const handleTournamentChange = (id) => {
    setSelectedTournament(id)
    const tournament = tournaments.find((t) => t._id === id)
    if (tournament) {
      setTournamentCode(tournament.tournamentCode)
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]

    if (file) {
      // Create a preview URL
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)

      setProofImage(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!selectedTournament || !tournamentCode || !prizeType || !amount || !playerName || !playerID || !proofImage) {
      toast({
        title: "Error",
        description: "Please fill all required fields and upload a proof image",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const formData = new FormData()
      formData.append("tournamentId", selectedTournament)
      formData.append("tournamentCode", tournamentCode)
      formData.append("prizeType", prizeType)
      formData.append("amount", amount)
      if (kills) formData.append("kills", kills)
      if (position) formData.append("position", position)
      formData.append("playerName", playerName)
      formData.append("playerID", playerID)
      if (notes) formData.append("notes", notes)
      formData.append("proofImage", proofImage)

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/prizes`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session?.user.apiToken}`,
        },
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Failed to submit prize request")
      }

      const data = await response.json()

      toast({
        title: "Success",
        description: "Prize request submitted successfully",
      })

      // Reset form
      setSelectedTournament("")
      setTournamentCode("")
      setPrizeType("")
      setAmount("")
      setKills("")
      setPosition("")
      setPlayerName("")
      setPlayerID("")
      setNotes("")
      setProofImage(null)
      setImagePreview("")

      // Call success callback if provided
      if (onSuccess) {
        onSuccess()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to submit prize request",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Request Prize Money</CardTitle>
        <CardDescription>Submit a request to claim your tournament prize money</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="tournament">Tournament</Label>
            <Select value={selectedTournament} onValueChange={handleTournamentChange} required>
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
                    No recent tournaments found
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">Only tournaments completed within the last 3 days are shown</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tournamentCode">Tournament Code</Label>
            <Input id="tournamentCode" value={tournamentCode} readOnly className="bg-muted" />
            <p className="text-xs text-muted-foreground">Tournament code is automatically filled</p>
          </div>

          <div className="space-y-2">
            <Label>Prize Type</Label>
            <RadioGroup value={prizeType} onValueChange={setPrizeType} className="grid grid-cols-2 gap-4">
              <Label
                htmlFor="kill_prize"
                className={`flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer ${
                  prizeType === "kill_prize" ? "border-primary" : ""
                }`}
              >
                <RadioGroupItem value="kill_prize" id="kill_prize" className="sr-only" />
                <span className="mt-2 text-sm font-medium">Kill Prize</span>
              </Label>
              <Label
                htmlFor="winner_prize"
                className={`flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer ${
                  prizeType === "winner_prize" ? "border-primary" : ""
                }`}
              >
                <RadioGroupItem value="winner_prize" id="winner_prize" className="sr-only" />
                <span className="mt-2 text-sm font-medium">Winner Prize</span>
              </Label>
              <Label
                htmlFor="both"
                className={`flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer ${
                  prizeType === "both" ? "border-primary" : ""
                }`}
              >
                <RadioGroupItem value="both" id="both" className="sr-only" />
                <span className="mt-2 text-sm font-medium">Both Kill & Winner Prize</span>
              </Label>
              <Label
                htmlFor="other"
                className={`flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer ${
                  prizeType === "other" ? "border-primary" : ""
                }`}
              >
                <RadioGroupItem value="other" id="other" className="sr-only" />
                <span className="mt-2 text-sm font-medium">Other Prize</span>
              </Label>
            </RadioGroup>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (Taka)</Label>
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
                placeholder="Enter your position"
              />
            </div>

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
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any additional information about your prize claim"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Proof Screenshot</Label>
            <div
              className="border-2 border-dashed rounded-md p-4 text-center cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => fileInputRef.current.click()}
            >
              {imagePreview ? (
                <div className="space-y-2">
                  <img
                    src={imagePreview || "/placeholder.svg"}
                    alt="Proof screenshot preview"
                    className="max-h-48 mx-auto object-contain"
                  />
                  <p className="text-sm text-muted-foreground">Click to change image</p>
                </div>
              ) : (
                <div className="py-4 flex flex-col items-center space-y-2">
                  <Upload className="h-8 w-8 text-muted-foreground" />
                  <p className="text-sm font-medium">Click to upload proof screenshot</p>
                  <p className="text-xs text-muted-foreground">JPG, PNG up to 5MB</p>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
                required
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Submitting..." : "Submit Prize Request"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
