import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { AdminPrizeManagement } from "@/components/admin-prize-management"
import { AdminPrizeDistribution } from "@/components/admin-prize-distribution"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default async function AdminPrizesPage() {
  const session = await getServerSession(authOptions)

  if (session?.user.role !== "admin") {
    redirect("/dashboard")
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Prize Money Management</h1>

      <Tabs defaultValue="requests" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="requests">Prize Requests</TabsTrigger>
          <TabsTrigger value="distribute">Distribute Prize</TabsTrigger>
        </TabsList>
        <TabsContent value="requests">
          <AdminPrizeManagement />
        </TabsContent>
        <TabsContent value="distribute">
          <AdminPrizeDistribution />
        </TabsContent>
      </Tabs>
    </div>
  )
}
