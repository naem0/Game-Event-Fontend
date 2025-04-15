import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { UserTournaments } from "@/components/user-tournaments"

export default async function UserTournamentsPage() {
  const session = await getServerSession(authOptions)

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">My Tournaments</h1>
      <UserTournaments />
    </div>
  )
}
