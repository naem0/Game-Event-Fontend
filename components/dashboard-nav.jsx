"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, Users, Settings, User, Gamepad2, CreditCard, History, DollarSign, Trophy, Wallet } from "lucide-react"

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
    title: "Referrals",
    href: "/dashboard/referrals",
    icon: <Users className="h-5 w-5" />,
    roles: ["admin", "user"],
  },
  {
    title: "Top-up",
    href: "/dashboard/topup",
    icon: <CreditCard className="h-5 w-5" />,
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
    title: "Manage Users",
    href: "/dashboard/admin/users",
    icon: <Users className="h-5 w-5" />,
    roles: ["admin"],
  },
  {
    title: "Tournaments",
    href: "/dashboard/admin/tournaments",
    icon: <Gamepad2 className="h-5 w-5" />,
    roles: ["admin"],
  },
  {
    title: "Add Tournaments",
    href: "/dashboard/admin/tournaments/add",
    icon: <Gamepad2 className="h-5 w-5" />,
    roles: ["admin"],
  },
  {
    title: "Top-up Management",
    href: "/dashboard/admin/topup",
    icon: <DollarSign className="h-5 w-5" />,
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
  const pathname = usePathname()

  return (
    <nav className="w-64 border-r bg-muted/40 p-4">
      <div className="space-y-2">
        {navItems
          .filter((item) => item.roles.includes(role))
          .map((item) => (
            <Button
              key={item.href}
              variant="ghost"
              className={cn("w-full justify-start", pathname === item.href && "bg-muted")}
              asChild
            >
              <Link href={item.href}>
                {item.icon}
                <span className="ml-2">{item.title}</span>
              </Link>
            </Button>
          ))}
      </div>
    </nav>
  )
}
