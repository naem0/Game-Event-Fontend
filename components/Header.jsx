import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { Button } from "@/components/ui/button"
import { getServerSession } from "next-auth"
// import { ModeToggle } from "@/components/mode-toggle" // optional dark mode toggle
import Link from "next/link"
import { UserNav } from "./user-nav"

export async function Header() {
  const session = await getServerSession(authOptions)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-black/25 backdrop-blur ">
      <div className="container mx-auto flex h-16 items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/" className="flex items-center space-x-2">
            <span className="inline-block font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
              ArenaX
            </span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6 text-sm">
            <Link href="#events" className="transition-colors hover:text-pink-500">
              Events
            </Link>
            <Link href="#tournaments" className="transition-colors hover:text-pink-500">
              Tournaments
            </Link>
            <Link href="#achievements" className="transition-colors hover:text-pink-500">
              Achievements
            </Link>
            <Link href="#about" className="transition-colors hover:text-pink-500">
              About
            </Link>
          </nav>
        </div>
        {
          session ? (
            <div className="flex items-center space-x-4">
              <UserNav user={session.user} />
              {/* <ModeToggle /> Optional - remove if not using */}
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login">Sign In</Link>
              </Button>
              <Button size="sm" className="bg-pink-600 hover:bg-pink-700">
                <Link href="/register">Register</Link>
              </Button>
              {/* <ModeToggle /> Optional - remove if not using */}
            </div>
          )
        }

      </div>
    </header>
  )
}