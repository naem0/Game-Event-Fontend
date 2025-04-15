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
          <div className="flex items-center">
            <h1 className="text-xl font-bold mr-4">Admin User System</h1>
            <div className="md:hidden">
              <DashboardNav role={session.user.role} />
            </div>
          </div>
          <UserNav user={session.user} />
        </div>
      </header>
      <div className="flex flex-1">
        <div className="hidden md:block">
          <DashboardNav role={session.user.role} />
        </div>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}
