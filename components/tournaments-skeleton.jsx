import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardFooter } from "@/components/ui/card"

export function TournamentsSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-10 w-[200px]" />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="overflow-hidden">
            <Skeleton className="h-48 w-full" />
            <CardContent className="p-4">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-full mb-1" />
              <Skeleton className="h-4 w-2/3" />
            </CardContent>
            <CardFooter className="flex justify-between p-4 pt-0">
              <Skeleton className="h-4 w-[80px]" />
              <Skeleton className="h-9 w-[100px]" />
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="flex justify-center">
        <Skeleton className="h-10 w-[200px]" />
      </div>
    </div>
  )
}
