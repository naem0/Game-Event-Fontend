import { Button } from "@/components/ui/button"
// import { ModeToggle } from "@/components/mode-toggle" // optional dark mode toggle
import Link from "next/link"

export function Header() {
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

        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/login">Login</Link>
          </Button>
          <Button size="sm" variant="outline" asChild>
            <Link href="/register">Register</Link>
          </Button>
          {/* <ModeToggle /> Optional - remove if not using */}
        </div>
      </div>
    </header>
  )
}