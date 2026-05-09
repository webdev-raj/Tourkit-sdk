import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export default function AnalyticsLoading() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex flex-col gap-2">
          <Button variant="ghost" className="w-fit px-0 text-muted-foreground hover:text-primary" asChild>
            <Link href="/dashboard">← Back to project</Link>
          </Button>
          <Skeleton className="h-10 w-72" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-8 w-24 rounded-full" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((idx) => (
          <Card key={idx} className="border-white/10 bg-card/40">
            <CardContent className="p-6">
              <Skeleton className="mb-4 size-10 rounded-full" />
              <Skeleton className="h-9 w-20" />
              <Skeleton className="mt-2 h-4 w-24" />
              <Skeleton className="mt-1 h-3 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4">
        <Card className="border-white/10 bg-card/40">
          <CardHeader className="gap-2">
            <Skeleton className="h-6 w-56" />
            <Skeleton className="h-4 w-24" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[280px] w-full rounded-lg" />
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-card/40">
          <CardHeader className="gap-2">
            <Skeleton className="h-6 w-56" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-40 w-full rounded-lg" />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
