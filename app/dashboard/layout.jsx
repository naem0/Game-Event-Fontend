import { redirect } from "next/navigation"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { DashboardNav } from "@/components/dashboard-nav"
import { UserNav } from "@/components/user-nav"

export default async function DashboardLayout({ children }) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b bg-background">
        <div className="flex h-16 items-center justify-between px-4">
          <h1 className="text-xl font-bold">Admin User System</h1>
          <UserNav user={session.user} />
        </div>
      </header>
      <div className="flex flex-1">
        <DashboardNav role={session.user.role} />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}

