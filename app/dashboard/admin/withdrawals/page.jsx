import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { AdminWithdrawalManagement } from "@/components/admin-withdrawal-management"

export default async function AdminWithdrawalsPage() {
  const session = await getServerSession(authOptions)

  if (session?.user.role !== "admin") {
    redirect("/dashboard")
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Withdrawal Management</h1>
      <AdminWithdrawalManagement />
    </div>
  )
}
