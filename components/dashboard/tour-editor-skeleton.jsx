import { Skeleton } from '@/components/ui/skeleton'

export function TourEditorSkeleton() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
      <div className="flex flex-col gap-4 rounded-lg border border-border/60 bg-card/40 p-4 sm:p-5">
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-4 max-w-md" />
        <Skeleton className="h-10 w-full max-w-xl" />
      </div>
      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-[38%_62%]">
        <div className="min-h-[400px] h-[500px] rounded-xl border border-white/[0.08] bg-[#0d0d0d] p-5">
          <Skeleton className="mb-4 h-5 w-28" />
          <div className="flex flex-col gap-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-24 w-full rounded-lg" />
            ))}
          </div>
        </div>
        <div className="min-h-[500px] overflow-hidden rounded-xl border border-white/[0.08] bg-[#0d0d0d]">
          <Skeleton className="h-12 w-full rounded-none" />
          <div className="flex flex-col gap-4 p-5">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
    </div>
  )
}
