import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { ReferralSystem } from "@/components/referral-system"

export default async function ReferralsPage() {
  const session = await getServerSession(authOptions)

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Referrals</h1>
      <ReferralSystem />
    </div>
  )
}
