"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import banner from "@/public/banner-bg.jpg"
import bgBanner from "@/public/banner.jpg"

export function HomeBanner() {
  return (
    <div className="relative bg-gradient-to-r from-blue-900 to-purple-900 text-white">
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${banner.src})` }}
          // style={{ backgroundImage: "url('/placeholder.svg?height=1080&width=1920')" }}
        ></div>
      </div>
      <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">Join the Big Tournament</h1>
          <p className="mt-6 text-xl">
            Compete with the best players from around the world and win exciting prizes. Show your skills and become a
            champion in our gaming tournaments.
          </p>
          <div className="mt-10">
            <Button asChild size="lg" className="bg-white text-purple-900 hover:bg-gray-100">
              <Link href="/tournaments">Join Now</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
