import { Skeleton } from "@/components/ui/skeleton"

export function HomeBannerSkeleton() {
  return (
    <div className="relative w-full">
      <Skeleton className="w-full h-[500px] rounded-none" />
      <div className="absolute inset-0 flex flex-col items-center justify-center px-4 space-y-6">
        <Skeleton className="h-12 w-3/4 max-w-[600px]" />
        <Skeleton className="h-6 w-2/3 max-w-[500px]" />
        <div className="flex space-x-4 mt-4">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>
    </div>
  )
}
