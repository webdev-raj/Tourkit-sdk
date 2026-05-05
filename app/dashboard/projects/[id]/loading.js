import { TourEditorSkeleton } from '@/components/dashboard/tour-editor-skeleton'

export default function ProjectTourLoading() {
  return (
    <div className="animate-pulse">
      <TourEditorSkeleton />
    </div>
  )
}
