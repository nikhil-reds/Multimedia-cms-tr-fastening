'use client'

import { useEffect, useState } from 'react'
import { Monitor, Plus, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { Skeleton } from '@/components/ui/skeleton'

type Screen = {
  id: string
  name: string
  createdAt: string
}

export default function ScreenPanel() {
  const [screens, setScreens] = useState<Screen[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)

  useEffect(() => {
    fetch('/api/screens')
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => setScreens(Array.isArray(data) ? data : []))
      .catch(() => toast.error('Failed to load screens'))
      .finally(() => setLoading(false))
  }, [])

  async function addScreen() {
    setIsCreating(true)
    try {
      const res = await fetch('/api/screens', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      })

      if (!res.ok) {
        toast.error('Failed to create screen')
        return
      }

      const newScreen = await res.json()
      setScreens((prev) => [...prev, newScreen])
      toast.success(`Screen "${newScreen.name}" created`)
    } catch {
      toast.error('Failed to create screen')
    } finally {
      setIsCreating(false)
    }
  }

  async function removeScreen(id: string) {
    try {
      const res = await fetch(`/api/screens/${id}`, { method: 'DELETE' })
      if (!res.ok) {
        toast.error('Failed to remove screen')
        return
      }

      setScreens((prev) => prev.filter((screen) => screen.id !== id))
      toast.success('Screen removed')
    } catch {
      toast.error('Failed to remove screen')
    }
  }

  return (
    <section className="flex-1 rounded-2xl bg-white border border-gray-200 shadow-sm flex flex-col overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 shrink-0 flex items-center justify-between">
        <h2 className="text-xs font-semibold text-gray-400 tracking-widest uppercase">
          Screens
        </h2>
        <button
          onClick={addScreen}
          disabled={isCreating}
          className="flex items-center gap-1.5 text-xs font-semibold text-white bg-black hover:bg-zinc-800 disabled:opacity-50 px-3 py-1.5 rounded-lg cursor-pointer transition-colors"
        >
          <Plus className="size-3.5" />
          Add Screen
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-5">
        {loading ? (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, idx) => (
              <Skeleton key={idx} className="h-24 rounded-xl" />
            ))}
          </div>
        ) : screens.length === 0 ? (
          <div className="h-full min-h-64 flex flex-col items-center justify-center text-center text-gray-400 gap-3">
            <Monitor className="size-10" />
            <p className="text-sm font-medium">No screens registered.</p>
            <p className="text-xs">Add a screen to track display endpoints.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {screens.map((screen) => (
              <div
                key={screen.id}
                className="rounded-xl border border-gray-200 bg-gray-50/50 p-4 flex items-center justify-between gap-4"
              >
                <div className="min-w-0 flex items-center gap-3">
                  <div className="size-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-500">
                    <Monitor className="size-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{screen.name}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(screen.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => removeScreen(screen.id)}
                  className="size-8 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center transition-colors"
                  aria-label={`Remove ${screen.name}`}
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
