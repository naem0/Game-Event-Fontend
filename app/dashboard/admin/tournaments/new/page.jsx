import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { AdminTournamentForm } from "@/components/admin-tournament-form"

export default async function NewTournamentPage() {
  const session = await getServerSession(authOptions)

  if (session?.user.role !== "admin") {
    redirect("/dashboard")
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Create Tournament</h1>
      <AdminTournamentForm />
    </div>
  )
}
