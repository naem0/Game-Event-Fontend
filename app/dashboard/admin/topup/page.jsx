import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { AdminTopUpManagement } from "@/components/admin-top-up-management"

export default async function AdminTopUpPage() {
  const session = await getServerSession(authOptions)

  if (session?.user.role !== "admin") {
    redirect("/dashboard")
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Top-up Management</h1>
      <AdminTopUpManagement />
    </div>
  )
}
