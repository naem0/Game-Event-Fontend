import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { ProfileForm } from "@/components/profile-form"

export default async function ProfilePage() {
  const session = await getServerSession(authOptions)

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Profile</h1>
      <ProfileForm />
    </div>
  )
}
