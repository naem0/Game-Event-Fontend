import { HomeBannerSkeleton } from "@/components/home-banner-skeleton"
import { TournamentMoodSkeleton } from "@/components/tournament-mood-skeleton"
import { TournamentSectionSkeleton } from "@/components/tournament-section-skeleton"
import { AchievementsSectionSkeleton } from "@/components/achievements-section-skeleton"
import { HistoricalTournamentsSkeleton } from "@/components/historical-tournaments-skeleton"

export function HomePageSkeleton() {
  return (
    <div>
      <HomeBannerSkeleton />
      <TournamentMoodSkeleton />
      <TournamentSectionSkeleton />
      <AchievementsSectionSkeleton />
      <HistoricalTournamentsSkeleton />
    </div>
  )
}
