import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export function TransactionSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-[180px] mb-1" />
        <Skeleton className="h-4 w-[250px]" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-10 w-[180px]" />
          </div>

          <div className="rounded-md border">
            <div className="p-4">
              <div className="grid grid-cols-4 gap-4 py-3">
                <Skeleton className="h-4" />
                <Skeleton className="h-4" />
                <Skeleton className="h-4" />
                <Skeleton className="h-4" />
              </div>

              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="grid grid-cols-4 gap-4 py-4 border-t">
                  <Skeleton className="h-4" />
                  <Skeleton className="h-4" />
                  <Skeleton className="h-4" />
                  <Skeleton className="h-4" />
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-[180px]" />
            <div className="flex items-center space-x-2">
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-4 w-[80px]" />
              <Skeleton className="h-8 w-8" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
