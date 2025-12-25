import { Skeleton } from '@metanoia/ui'

export default function Loading() {
  return (
    <div className="container py-8">
      {/* Hero skeleton */}
      <div className="mb-12 text-center">
        <Skeleton className="mx-auto mb-4 h-12 w-3/4 max-w-2xl" />
        <Skeleton className="mx-auto mb-6 h-6 w-1/2 max-w-xl" />
        <div className="flex justify-center gap-4">
          <Skeleton className="h-12 w-32 rounded-full" />
          <Skeleton className="h-12 w-32 rounded-full" />
        </div>
      </div>

      {/* Content grid skeleton */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="overflow-hidden rounded-xl bg-white shadow-sm">
            <Skeleton className="aspect-video w-full" />
            <div className="p-4">
              <Skeleton className="mb-2 h-5 w-3/4" />
              <Skeleton className="mb-3 h-4 w-full" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-6 w-6 rounded-full" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
