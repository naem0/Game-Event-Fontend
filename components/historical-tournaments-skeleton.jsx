import { Skeleton } from "@/components/ui/skeleton"

export function HistoricalTournamentsSkeleton() {
  return (
    <div className="py-16 px-4 bg-gray-50">
      <div className="text-center mb-12">
        <Skeleton className="h-8 w-64 mx-auto mb-4" />
        <Skeleton className="h-4 w-full max-w-[700px] mx-auto" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex gap-4 p-4 bg-white rounded-lg shadow">
            <Skeleton className="h-24 w-24 rounded-md flex-shrink-0" />
            <div className="flex-grow">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
