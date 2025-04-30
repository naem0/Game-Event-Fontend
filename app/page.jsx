import { Suspense } from "react"
import { HomeBanner } from "@/components/home-banner"
import { TournamentMoodSection } from "@/components/tournament-mood-section"
import { TournamentSection } from "@/components/tournament-section"
import { AchievementsSection } from "@/components/achievements-section"
import { HistoricalTournamentsSection } from "@/components/historical-tournaments-section"
import { HomeBannerSkeleton } from "@/components/home-banner-skeleton"
import { TournamentMoodSkeleton } from "@/components/tournament-mood-skeleton"
import { TournamentSectionSkeleton } from "@/components/tournament-section-skeleton"
import { AchievementsSectionSkeleton } from "@/components/achievements-section-skeleton"
import { HistoricalTournamentsSkeleton } from "@/components/historical-tournaments-skeleton"

export default function HomePage() {
  return (
    <div>
      <Suspense fallback={<HomeBannerSkeleton />}>
        <HomeBanner />
      </Suspense>

      <Suspense fallback={<TournamentMoodSkeleton />}>
        <TournamentMoodSection />
      </Suspense>

      <Suspense fallback={<TournamentSectionSkeleton />}>
        <TournamentSection />
      </Suspense>

      <Suspense fallback={<AchievementsSectionSkeleton />}>
        <AchievementsSection />
      </Suspense>

      <Suspense fallback={<HistoricalTournamentsSkeleton />}>
        <HistoricalTournamentsSection />
      </Suspense>
    </div>
  )
}
