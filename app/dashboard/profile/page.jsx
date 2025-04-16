import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ProfileForm } from "@/components/profile-form"

export default async function ProfilePage() {
  const session = await getServerSession(authOptions)

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Profile</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Account Balance</CardTitle>
            <CardDescription>Your current account balance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{session?.user.balance || 0} Taka</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Referral Code</CardTitle>
            <CardDescription>Share this code with friends</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-semibold">{session?.user.referralCode || "N/A"}</div>
            <p className="text-sm text-muted-foreground mt-2">
              You've referred {session?.user.referralCount || 0} users
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Profile</CardTitle>
          <CardDescription>Update your personal information</CardDescription>
        </CardHeader>
        <CardContent>
          <ProfileForm user={session?.user} />
        </CardContent>
      </Card>
    </div>
  )
}
