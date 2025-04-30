"use client"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { signOut, useSession } from "next-auth/react"
import { Skeleton } from "@/components/ui/skeleton"

export function UserNav() {
  const { data: session } = useSession()
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (session?.user?.apiToken) {
      fetchUserData()
    } else {
      setLoading(false)
    }
  }, [session])

  const fetchUserData = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/profile`, {
        headers: {
          Authorization: `Bearer ${session.user.apiToken}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch user data")
      }

      const data = await response.json()
      setUserData(data)
    } catch (error) {
      console.error("Error fetching user data:", error)
    } finally {
      setLoading(false)
    }
  }

  const getInitials = (name) => {
    if (!name) return "U"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  if (loading) {
    return (
      <div className="flex items-center gap-4">
        <Skeleton className="h-8 w-[100px]" />
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            {userData?.profileImage && (
              <AvatarImage src={userData.profileImage || "/placeholder.svg"} alt={userData?.name || "User"} />
            )}
            <AvatarFallback>{getInitials(userData?.name || session?.user?.name)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{userData?.name || session?.user?.name}</p>
            <p className="text-xs leading-none text-muted-foreground">{userData?.email || session?.user?.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <a href="/dashboard">Dashboard</a>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <a href="/dashboard/profile">Profile</a>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <a href="/dashboard/balance">Balance: {userData?.balance || 0} Taka</a>
          </DropdownMenuItem>
          {(userData?.role === "admin" || session?.user?.role === "admin") && (
            <DropdownMenuItem asChild>
              <a href="/dashboard/admin/users">Admin Panel</a>
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer" onClick={() => signOut({ callbackUrl: "/" })}>
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
