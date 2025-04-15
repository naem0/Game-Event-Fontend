import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { TopUpForm } from "@/components/top-up-form"
import { TopUpHistory } from "@/components/top-up-history"

export default async function TopUpPage() {
  const session = await getServerSession(authOptions)

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Balance Top-up</h1>
      <div className="grid gap-6 md:grid-cols-2">
        <TopUpForm />
        <TopUpHistory />
      </div>
    </div>
  )
}
