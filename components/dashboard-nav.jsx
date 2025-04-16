"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { LayoutDashboard, Users, Settings, User, History, DollarSign, Trophy, Wallet, Menu } from 'lucide-react'
import { useSession } from "next-auth/react"

// Update the navItems array to include the prize money pages
const navItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: <LayoutDashboard className="h-5 w-5" />,
    roles: ["admin", "user"],
  },
  {
    title: "Profile",
    href: "/dashboard/profile",
    icon: <User className="h-5 w-5" />,
    roles: ["admin", "user"],
  },
  {
    title: "Balance",
    href: "/dashboard/balance",
    icon: <Wallet className="h-5 w-5" />,
    roles: ["admin", "user"],
  },
  {
    title: "Transactions",
    href: "/dashboard/transactions",
    icon: <History className="h-5 w-5" />,
    roles: ["admin", "user"],
  },
  {
    title: "My Tournaments",
    href: "/dashboard/tournaments",
    icon: <Trophy className="h-5 w-5" />,
    roles: ["admin", "user"],
  },
  {
    title: "Prize Money",
    href: "/dashboard/prizes",
    icon: <DollarSign className="h-5 w-5" />,
    roles: ["admin", "user"],
  },
  {
    title: "Referrals",
    href: "/dashboard/referrals",
    icon: <Users className="h-5 w-5" />,
    roles: ["admin", "user"],
  },
  {
    title: "Manage Users",
    href: "/dashboard/admin/users",
    icon: <Users className="h-5 w-5" />,
    roles: ["admin"],
  },
  {
    title: "Top-up Management",
    href: "/dashboard/admin/topup",
    icon: <DollarSign className="h-5 w-5" />,
    roles: ["admin"],
  },
  {
    title: "Withdrawal Management",
    href: "/dashboard/admin/withdrawals",
    icon: <DollarSign className="h-5 w-5" />,
    roles: ["admin"],
  },
  {
    title: "Prize Management",
    href: "/dashboard/admin/prizes",
    icon: <Trophy className="h-5 w-5" />,
    roles: ["admin"],
  },
  {
    title: "Tournament Management",
    href: "/dashboard/admin/tournaments",
    icon: <Trophy className="h-5 w-5" />,
    roles: ["admin"],
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: <Settings className="h-5 w-5" />,
    roles: ["admin", "user"],
  },
]

export function DashboardNav({ role }) {
  const { data: session } = useSession()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const filteredNavItems = navItems.filter((item) => item.roles.includes(role))

  const NavLinks = () => (
    <div className="space-y-2">
      {filteredNavItems.map((item) => (
        <Button
          key={item.href}
          variant="ghost"
          className={cn("w-full justify-start", pathname === item.href && "bg-muted")}
          asChild
          onClick={() => setOpen(false)}
        >
          <Link href={item.href}>
            {item.icon}
            <span className="ml-2">{item.title}</span>
          </Link>
        </Button>
      ))}
    </div>
  )

  return (
    <>
      {/* Mobile Navigation */}
      <div className="md:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="ml-2">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-4">
            <div className="mb-4 font-bold">Dashboard Menu</div>
            {session?.user && (
              <div className="mb-4 p-3 bg-muted rounded-md">
                <p className="text-sm font-medium">Balance</p>
                <p className="text-xl font-bold">{session.user.balance || 0} Taka</p>
              </div>
            )}
            <NavLinks />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden md:block w-64 border-r bg-muted/40 p-4">
        {session?.user && (
          <div className="mb-4 p-3 bg-muted rounded-md">
            <p className="text-sm font-medium">Balance</p>
            <p className="text-xl font-bold">{session.user.balance || 0} Taka</p>
          </div>
        )}
        <NavLinks />
      </nav>
    </>
  )
}
