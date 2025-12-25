import { Skeleton, SkeletonTestimonyCard } from '@/components/animations/skeleton'

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
          <SkeletonTestimonyCard key={i} />
        ))}
      </div>
    </div>
  )
}
