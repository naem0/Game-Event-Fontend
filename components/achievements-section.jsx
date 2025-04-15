"use client"

import { Trophy, Users, Award, Calendar } from "lucide-react"

export function AchievementsSection() {
  const achievements = [
    {
      icon: <Trophy className="h-10 w-10 text-yellow-500" />,
      count: "250+",
      label: "Tournaments Hosted",
    },
    {
      icon: <Users className="h-10 w-10 text-blue-500" />,
      count: "10,000+",
      label: "Active Players",
    },
    {
      icon: <Award className="h-10 w-10 text-green-500" />,
      count: "₹5,00,000+",
      label: "Prize Money Awarded",
    },
    {
      icon: <Calendar className="h-10 w-10 text-purple-500" />,
      count: "5+",
      label: "Years of Experience",
    },
  ]

  return (
    <section className="py-16 bg-gradient-to-r from-blue-900 to-purple-900 text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">Our History & Achievements</h2>
          <p className="mt-2 text-blue-100">Milestones we've reached together with our community</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {achievements.map((item, index) => (
            <div key={index} className="text-center">
              <div className="flex justify-center mb-4">{item.icon}</div>
              <div className="text-4xl font-bold mb-2">{item.count}</div>
              <div className="text-blue-100">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
