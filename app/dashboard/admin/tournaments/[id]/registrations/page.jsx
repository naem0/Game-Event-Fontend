import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { AdminTournamentRegistrations } from "@/components/admin-tournament-registrations"

export default async function TournamentRegistrationsPage({ params }) {
  const session = await getServerSession(authOptions)

  if (session?.user.role !== "admin") {
    redirect("/dashboard")
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Tournament Registrations</h1>
      <AdminTournamentRegistrations tournamentId={params.id} />
    </div>
  )
}
