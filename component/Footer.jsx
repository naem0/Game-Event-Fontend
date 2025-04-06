import { Button } from "@/components/ui/button"
import Link from "next/link"
// import { Icons } from "@/components/icons" // optional social icons

export function Footer() {
  return (
    <footer className="border-t bg-gray-900">
      <div className="container mx-auto py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-pink-500">ArenaX</h3>
            <p className="text-sm text-gray-400">
              The premier destination for competitive gaming tournaments and events.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-gray-400 hover:text-pink-500">
                {/* <Icons.twitter className="h-5 w-5" /> */}
              </Link>
              <Link href="#" className="text-gray-400 hover:text-pink-500">
                {/* <Icons.discord className="h-5 w-5" /> */}
              </Link>
              <Link href="#" className="text-gray-400 hover:text-pink-500">
                {/* <Icons.twitch className="h-5 w-5" /> */}
              </Link>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-semibold">Events</h4>
            <nav className="flex flex-col space-y-2">
              <Link href="#" className="text-sm text-gray-400 hover:text-pink-500">
                Upcoming Tournaments
              </Link>
              <Link href="#" className="text-sm text-gray-400 hover:text-pink-500">
                Past Events
              </Link>
              <Link href="#" className="text-sm text-gray-400 hover:text-pink-500">
                Schedule
              </Link>
            </nav>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-semibold">Support</h4>
            <nav className="flex flex-col space-y-2">
              <Link href="#" className="text-sm text-gray-400 hover:text-pink-500">
                FAQ
              </Link>
              <Link href="#" className="text-sm text-gray-400 hover:text-pink-500">
                Contact Us
              </Link>
              <Link href="#" className="text-sm text-gray-400 hover:text-pink-500">
                Rules
              </Link>
            </nav>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Newsletter</h4>
            <p className="text-sm text-gray-400">
              Subscribe to get tournament updates and announcements.
            </p>
            <div className="flex space-x-2">
              <input
                type="email"
                placeholder="Your email"
                className="px-3 py-2 text-sm rounded-md bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
              <Button size="sm" className="bg-pink-600 hover:bg-pink-700">
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} ArenaX Gaming. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}