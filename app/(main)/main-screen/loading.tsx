import { Skeleton } from '@/components/ui/skeleton'
import { DocumentListSkeleton, ScreenGridSkeleton } from '@/components/main-screen/skeletons'

// Mirrors the layout of page.tsx (FilePanel + ScreenPanel) while the route loads.
export default function MainScreenLoading() {
  return (
    <div
      className="bg-gray-50 flex gap-5 px-6 py-6 overflow-hidden"
      style={{ height: 'calc(100vh - 113px)' }}
    >
      <aside className="w-80 shrink-0 rounded-2xl bg-white border border-gray-200 shadow-sm flex flex-col overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-2">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-4 w-32" />
            </div>
            <Skeleton className="h-6 w-8 rounded-full" />
          </div>
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>
        <div className="flex-1 overflow-hidden p-4">
          <DocumentListSkeleton />
        </div>
      </aside>

      <section className="flex-1 rounded-2xl bg-white border border-gray-200 shadow-sm flex flex-col overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 shrink-0 flex items-center justify-between">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-7 w-28 rounded-lg" />
        </div>
        <div className="flex-1 overflow-hidden p-5">
          <ScreenGridSkeleton />
        </div>
      </section>
    </div>
  )
}
