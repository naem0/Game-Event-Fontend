import { Skeleton } from "@/components/ui/skeleton"

export function TournamentMoodSkeleton() {
  return (
    <div className="py-12 px-4">
      <div className="text-center mb-10">
        <Skeleton className="h-8 w-64 mx-auto mb-4" />
        <Skeleton className="h-4 w-full max-w-[700px] mx-auto" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex flex-col items-center">
            <Skeleton className="h-16 w-16 rounded-full mb-4" />
            <Skeleton className="h-6 w-40 mb-2" />
            <Skeleton className="h-4 w-56" />
          </div>
        ))}
      </div>
    </div>
  )
}
