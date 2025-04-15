import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { AdminTournamentList } from "@/components/admin-tournament-list"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus } from "lucide-react"

export default async function AdminTournamentsPage() {
  const session = await getServerSession(authOptions)

  if (session?.user.role !== "admin") {
    redirect("/dashboard")
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Tournament Management</h1>
        <Button asChild>
          <Link href="/dashboard/admin/tournaments/new">
            <Plus className="mr-2 h-4 w-4" /> Add Tournament
          </Link>
        </Button>
      </div>
      <AdminTournamentList />
    </div>
  )
}
