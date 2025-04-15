import { HomeBanner } from "@/components/home-banner"
import { TournamentMoodSection } from "@/components/tournament-mood-section"
import { TournamentSection } from "@/components/tournament-section"
import { AchievementsSection } from "@/components/achievements-section"
import { HistoricalTournamentsSection } from "@/components/historical-tournaments-section"

export default function HomePage() {
  return (
    <div>
      <HomeBanner />
      <TournamentMoodSection />
      <TournamentSection />
      <AchievementsSection />
      <HistoricalTournamentsSection />
    </div>
  )
}
