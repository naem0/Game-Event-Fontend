import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { AdminTournamentForm } from "@/components/admin-tournament-form"

async function getTournament(id, token) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tournaments/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  })

  return response.json()
}

export default async function EditTournamentPage({ params }) {
  const session = await getServerSession(authOptions)

  if (session?.user.role !== "admin") {
    redirect("/dashboard")
  }

  const tournament = await getTournament(params?.id, session.user.apiToken)

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Edit Tournament</h1>
      <AdminTournamentForm tournament={tournament} />
    </div>
  )
}
