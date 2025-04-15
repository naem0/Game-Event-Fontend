import { TournamentDetails } from "@/components/tournament-details"

async function getTournament(id) {
  const response = await fetch(`${process.env.BACKEND_URL}/api/tournaments/${id}`, {
    cache: "no-store",
  })

  if (!response.ok) {
    throw new Error("Failed to fetch tournament")
  }

  return response.json()
}

export default async function TournamentDetailsPage({ params }) {
  const tournament = await getTournament(params.id)

  return <TournamentDetails tournament={tournament} />
}
