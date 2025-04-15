"use client"

import { useState, useRef } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Upload } from "lucide-react"
import { format } from "date-fns"

export function AdminTournamentForm({ tournament, onSuccess }) {
  const [title, setTitle] = useState(tournament?.title || "")
  const [device, setDevice] = useState(tournament?.device || "")
  const [mood, setMood] = useState(tournament?.mood || "")
  const [tournamentCode, setTournamentCode] = useState(tournament?.tournamentCode || "")
  const [game, setGame] = useState(tournament?.game || "")
  const [description, setDescription] = useState(tournament?.description || "")
  const [type, setType] = useState(tournament?.type || "")
  const [version, setVersion] = useState(tournament?.version || "")
  const [map, setMap] = useState(tournament?.map || "")
  const [matchType, setMatchType] = useState(tournament?.matchType || "")
  const [entryFee, setEntryFee] = useState(tournament?.entryFee || "")
  const [matchSchedule, setMatchSchedule] = useState(
    tournament?.matchSchedule ? format(new Date(tournament.matchSchedule), "yyyy-MM-dd'T'HH:mm") : "",
  )
  const [winningPrize, setWinningPrize] = useState(tournament?.winningPrize || "")
  const [perKillPrize, setPerKillPrize] = useState(tournament?.perKillPrize || "")
  const [rules, setRules] = useState(tournament?.rules || "")
  const [maxPlayers, setMaxPlayers] = useState(tournament?.maxPlayers || "")
  const [isActive, setIsActive] = useState(tournament?.isActive !== undefined ? tournament.isActive : true)
  const [isCompleted, setIsCompleted] = useState(tournament?.isCompleted || false)

  const [logo, setLogo] = useState(null)
  const [logoPreview, setLogoPreview] = useState(tournament?.logo || "")
  const [coverImage, setCoverImage] = useState(null)
  const [coverImagePreview, setCoverImagePreview] = useState(tournament?.coverImage || "")

  const [isLoading, setIsLoading] = useState(false)
  const { data: session } = useSession()
  const { toast } = useToast()

  const logoInputRef = useRef(null)
  const coverInputRef = useRef(null)

  const handleLogoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setLogo(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setLogoPreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCoverChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setCoverImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setCoverImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (
      !title ||
      !device ||
      !mood ||
      !game ||
      !description ||
      !type ||
      !version ||
      !map ||
      !matchType ||
      !entryFee ||
      !matchSchedule ||
      !winningPrize ||
      !perKillPrize ||
      !rules ||
      !maxPlayers
    ) {
      toast({
        title: "Error",
        description: "Please fill all required fields",
        variant: "destructive",
      })
      return
    }

    if (!tournament && (!logo || !coverImage)) {
      toast({
        title: "Error",
        description: "Please upload both logo and cover image",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const formData = new FormData()
      formData.append("title", title)
      formData.append("device", device)
      formData.append("mood", mood)
      if (tournamentCode) formData.append("tournamentCode", tournamentCode)
      formData.append("game", game)
      formData.append("description", description)
      formData.append("type", type)
      formData.append("version", version)
      formData.append("map", map)
      formData.append("matchType", matchType)
      formData.append("entryFee", entryFee)
      formData.append("matchSchedule", matchSchedule)
      formData.append("winningPrize", winningPrize)
      formData.append("perKillPrize", perKillPrize)
      formData.append("rules", rules)
      formData.append("maxPlayers", maxPlayers)
      formData.append("isActive", isActive)
      formData.append("isCompleted", isCompleted)

      if (logo) formData.append("logo", logo)
      if (coverImage) formData.append("coverImage", coverImage)

      const url = tournament
        ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tournaments/${tournament._id}`
        : `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tournaments`

      const method = tournament ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${session?.user.apiToken}`,
        },
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Failed to save tournament")
      }

      const data = await response.json()

      toast({
        title: "Success",
        description: tournament ? "Tournament updated successfully" : "Tournament created successfully",
      })

      if (onSuccess) {
        onSuccess(data.tournament)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to save tournament",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{tournament ? "Edit Tournament" : "Create Tournament"}</CardTitle>
        <CardDescription>
          {tournament ? "Update tournament details" : "Add a new tournament to the system"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title">Tournament Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Solo Time"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="device">Device</Label>
              <Select value={device} onValueChange={setDevice} required>
                <SelectTrigger id="device">
                  <SelectValue placeholder="Select device" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Mobile">Mobile</SelectItem>
                  <SelectItem value="PC">PC</SelectItem>
                  <SelectItem value="Console">Console</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="mood">Mood</Label>
              <Select value={mood} onValueChange={setMood} required>
                <SelectTrigger id="mood">
                  <SelectValue placeholder="Select mood" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Classic">Classic</SelectItem>
                  <SelectItem value="Arcade">Arcade</SelectItem>
                  <SelectItem value="Ranked">Ranked</SelectItem>
                  <SelectItem value="Casual">Casual</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tournamentCode">Tournament Code (Optional)</Label>
              <Input
                id="tournamentCode"
                value={tournamentCode}
                onChange={(e) => setTournamentCode(e.target.value)}
                placeholder="e.g., 37538"
              />
              <p className="text-xs text-muted-foreground">Leave blank to auto-generate</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="game">Game</Label>
              <Input
                id="game"
                value={game}
                onChange={(e) => setGame(e.target.value)}
                placeholder="e.g., Free Fire"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Tournament Type</Label>
              <Select value={type} onValueChange={setType} required>
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Solo">Solo</SelectItem>
                  <SelectItem value="Duo">Duo</SelectItem>
                  <SelectItem value="Squad">Squad</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="version">Version</Label>
              <Select value={version} onValueChange={setVersion} required>
                <SelectTrigger id="version">
                  <SelectValue placeholder="Select version" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TPP">TPP</SelectItem>
                  <SelectItem value="FPP">FPP</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="map">Map</Label>
              <Input
                id="map"
                value={map}
                onChange={(e) => setMap(e.target.value)}
                placeholder="e.g., Bermuda"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="matchType">Match Type</Label>
              <Select value={matchType} onValueChange={setMatchType} required>
                <SelectTrigger id="matchType">
                  <SelectValue placeholder="Select match type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Free">Free</SelectItem>
                  <SelectItem value="Paid">Paid</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="entryFee">Entry Fee (Taka)</Label>
              <Input
                id="entryFee"
                type="number"
                min="0"
                value={entryFee}
                onChange={(e) => setEntryFee(e.target.value)}
                placeholder="e.g., 20"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="matchSchedule">Match Schedule</Label>
              <Input
                id="matchSchedule"
                type="datetime-local"
                value={matchSchedule}
                onChange={(e) => setMatchSchedule(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="winningPrize">Winning Prize (Taka)</Label>
              <Input
                id="winningPrize"
                type="number"
                min="0"
                value={winningPrize}
                onChange={(e) => setWinningPrize(e.target.value)}
                placeholder="e.g., 800"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="perKillPrize">Per Kill Prize (Taka)</Label>
              <Input
                id="perKillPrize"
                type="number"
                min="0"
                value={perKillPrize}
                onChange={(e) => setPerKillPrize(e.target.value)}
                placeholder="e.g., 10"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxPlayers">Max Players</Label>
              <Input
                id="maxPlayers"
                type="number"
                min="1"
                value={maxPlayers}
                onChange={(e) => setMaxPlayers(e.target.value)}
                placeholder="e.g., 100"
                required
              />
            </div>

            {tournament && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="isActive">Status</Label>
                  <Select value={isActive.toString()} onValueChange={(value) => setIsActive(value === "true")}>
                    <SelectTrigger id="isActive">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Active</SelectItem>
                      <SelectItem value="false">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="isCompleted">Completion Status</Label>
                  <Select value={isCompleted.toString()} onValueChange={(value) => setIsCompleted(value === "true")}>
                    <SelectTrigger id="isCompleted">
                      <SelectValue placeholder="Select completion status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Completed</SelectItem>
                      <SelectItem value="false">Not Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter tournament description"
              rows={3}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="rules">Rules</Label>
            <Textarea
              id="rules"
              value={rules}
              onChange={(e) => setRules(e.target.value)}
              placeholder="Enter tournament rules and instructions"
              rows={5}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Tournament Logo</Label>
              <div
                className="border-2 border-dashed rounded-md p-4 text-center cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => logoInputRef.current.click()}
              >
                {logoPreview ? (
                  <div className="space-y-2">
                    <img
                      src={
                        logoPreview.startsWith("data:")
                          ? logoPreview
                          : `${process.env.NEXT_PUBLIC_BACKEND_URL}${logoPreview}`
                      }
                      alt="Tournament logo preview"
                      className="h-32 mx-auto object-contain"
                    />
                    <p className="text-sm text-muted-foreground">Click to change logo</p>
                  </div>
                ) : (
                  <div className="py-4 flex flex-col items-center space-y-2">
                    <Upload className="h-8 w-8 text-muted-foreground" />
                    <p className="text-sm font-medium">Click to upload logo</p>
                    <p className="text-xs text-muted-foreground">JPG, PNG up to 5MB</p>
                  </div>
                )}
                <input
                  ref={logoInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleLogoChange}
                  required={!tournament}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Cover Image</Label>
              <div
                className="border-2 border-dashed rounded-md p-4 text-center cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => coverInputRef.current.click()}
              >
                {coverImagePreview ? (
                  <div className="space-y-2">
                    <img
                      src={
                        coverImagePreview.startsWith("data:")
                          ? coverImagePreview
                          : `${process.env.NEXT_PUBLIC_BACKEND_URL}${coverImagePreview}`
                      }
                      alt="Tournament cover preview"
                      className="h-32 mx-auto object-contain"
                    />
                    <p className="text-sm text-muted-foreground">Click to change cover image</p>
                  </div>
                ) : (
                  <div className="py-4 flex flex-col items-center space-y-2">
                    <Upload className="h-8 w-8 text-muted-foreground" />
                    <p className="text-sm font-medium">Click to upload cover image</p>
                    <p className="text-xs text-muted-foreground">JPG, PNG up to 5MB</p>
                  </div>
                )}
                <input
                  ref={coverInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleCoverChange}
                  required={!tournament}
                />
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Saving..." : tournament ? "Update Tournament" : "Create Tournament"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
