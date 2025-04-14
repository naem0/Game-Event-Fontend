import TournamentForm from "@/components/tournament-form"

export default function AddTournament() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Add New Tournament</h1>
      <TournamentForm />
    </div>
  )
}
