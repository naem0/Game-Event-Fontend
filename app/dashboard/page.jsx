import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Welcome</CardTitle>
            <CardDescription>You are logged in as {session?.user.name}</CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              Role: <span className="font-semibold capitalize">{session?.user.role}</span>
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Account Balance</CardTitle>
            <CardDescription>Your current balance</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{session?.user.balance || 0} Taka</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
