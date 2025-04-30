import { Skeleton } from "@/components/ui/skeleton"

export function AchievementsSectionSkeleton() {
  return (
    <div className="py-16 px-4">
      <div className="text-center mb-12">
        <Skeleton className="h-8 w-64 mx-auto mb-4" />
        <Skeleton className="h-4 w-full max-w-[700px] mx-auto" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="text-center">
            <Skeleton className="h-16 w-16 rounded-full mx-auto mb-4" />
            <Skeleton className="h-8 w-24 mx-auto mb-2" />
            <Skeleton className="h-4 w-40 mx-auto" />
          </div>
        ))}
      </div>
    </div>
  )
}
