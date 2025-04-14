import TournamentForm from "@/components/tournament-form"
import { getTournamentById } from "@/lib/actions"

export default async function EditTournament({ params }) {
  const tournament = await getTournamentById(params.id)

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Edit Tournament</h1>
      <TournamentForm tournament={tournament} />
    </div>
  )
}
