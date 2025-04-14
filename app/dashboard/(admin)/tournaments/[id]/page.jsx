import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Edit } from "lucide-react"
import { getTournamentById } from "@/lib/actions"
import { formatDate } from "@/lib/utils"

export default async function TournamentDetails({ params }) {
  const tournament = await getTournamentById(params.id)

  if (!tournament) {
    return (
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-8">Tournament not found</h1>
        <Link href="/">
          <Button>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Tournament Details</h1>
        <div className="flex gap-4">
          <Link href="/">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </Link>
          <Link href={`/tournaments/edit/${tournament._id}`}>
            <Button>
              <Edit className="mr-2 h-4 w-4" />
              Edit Tournament
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Tournament Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative w-full h-48 mb-6 rounded-lg overflow-hidden">
              <Image
                src={tournament.coverImage || "/placeholder.svg"}
                alt={tournament.title}
                fill
                className="object-cover"
              />
              <div className="absolute bottom-4 left-4 bg-black/70 p-2 rounded-lg">
                <Image
                  src={tournament.logo || "/placeholder.svg"}
                  alt={tournament.game}
                  width={40}
                  height={40}
                  className="rounded"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-lg mb-4">Basic Details</h3>
                <dl className="space-y-2">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Title:</dt>
                    <dd>{tournament.title}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Game:</dt>
                    <dd>{tournament.game}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Tournament Code:</dt>
                    <dd>{tournament.tournamentCode}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Device:</dt>
                    <dd>{tournament.device}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Type:</dt>
                    <dd>{tournament.type}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Version:</dt>
                    <dd>{tournament.version}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Map:</dt>
                    <dd>{tournament.map}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Match Type:</dt>
                    <dd>{tournament.matchType}</dd>
                  </div>
                </dl>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-4">Tournament Details</h3>
                <dl className="space-y-2">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Entry Fee:</dt>
                    <dd>₹{tournament.entryFee}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Winning Prize:</dt>
                    <dd>₹{tournament.winningPrize}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Per Kill Prize:</dt>
                    <dd>₹{tournament.perKillPrize}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Max Players:</dt>
                    <dd>{tournament.maxPlayers}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Players Registered:</dt>
                    <dd>{tournament.playersRegistered}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Match Schedule:</dt>
                    <dd>{formatDate(tournament.matchSchedule)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Created At:</dt>
                    <dd>{formatDate(tournament.createdAt)}</dd>
                  </div>
                </dl>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="font-semibold text-lg mb-2">Description</h3>
              <p className="text-muted-foreground">{tournament.description}</p>
            </div>

            <div className="mt-6">
              <h3 className="font-semibold text-lg mb-2">Rules</h3>
              <p className="text-muted-foreground whitespace-pre-line">{tournament.rules}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-1">Tournament Status</p>
                <Badge variant={tournament.isActive ? "default" : "outline"} className="w-full justify-center py-1">
                  {tournament.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>

              <div>
                <p className="text-sm font-medium mb-1">Completion Status</p>
                <Badge
                  variant={tournament.isCompleted ? "destructive" : "outline"}
                  className="w-full justify-center py-1"
                >
                  {tournament.isCompleted ? "Completed" : "Pending"}
                </Badge>
              </div>

              <div className="pt-4 border-t">
                <p className="text-sm font-medium mb-2">Registration Progress</p>
                <div className="w-full bg-muted rounded-full h-2.5">
                  <div
                    className="bg-primary h-2.5 rounded-full"
                    style={{ width: `${(tournament.playersRegistered / tournament.maxPlayers) * 100}%` }}
                  ></div>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  {tournament.playersRegistered} of {tournament.maxPlayers} players registered (
                  {Math.round((tournament.playersRegistered / tournament.maxPlayers) * 100)}%)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
