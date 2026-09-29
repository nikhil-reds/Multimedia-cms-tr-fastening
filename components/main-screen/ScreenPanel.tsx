'use client'

import { useEffect, useState } from 'react'
import type { DragEvent } from 'react'
import { ExternalLink, FileText, Globe2, Monitor, Plus, Trash2, X } from 'lucide-react'
import { toast } from 'sonner'
import { Skeleton } from '@/components/ui/skeleton'
import { FileIcon, iconBg } from './shared'

type DocumentAsset = {
  id: string
  name: string
  size: number
  mimeType: string
  s3Url?: string | null
  cloudinaryUrl?: string | null
  websiteUrl?: string | null
  sourceType?: 'FILE' | 'WEBSITE'
  status: string
  createdAt?: string
}

type ScreenAsset = {
  id: string
  screenId: string
  documentId: string
  position: number
  document: DocumentAsset
}

type Screen = {
  id: string
  name: string
  createdAt: string
  assets?: ScreenAsset[]
}

function getAssetUrl(document: DocumentAsset) {
  return document.websiteUrl || document.s3Url || document.cloudinaryUrl || ''
}

function AssetPreview({ document }: { document: DocumentAsset }) {
  const url = getAssetUrl(document)

  if (document.sourceType === 'WEBSITE' || document.websiteUrl) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-zinc-50 p-4 text-center">
        <div className="flex size-12 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-zinc-200">
          <Globe2 className="size-6 text-zinc-700" />
        </div>
        <p className="line-clamp-2 text-xs font-semibold text-zinc-700">{document.name}</p>
      </div>
    )
  }

  if (document.mimeType.startsWith('image/') && url) {
    return <img src={url} alt={document.name} className="h-full w-full object-cover" />
  }

  if (document.mimeType.startsWith('video/') && url) {
    return <video src={url} className="h-full w-full object-cover" preload="metadata" muted />
  }

  if (document.mimeType === 'application/pdf') {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-red-50 p-4 text-center">
        <FileText className="size-10 text-red-500" />
        <p className="line-clamp-2 text-xs font-semibold text-red-700">{document.name}</p>
      </div>
    )
  }

  return (
    <div className={`flex h-full w-full flex-col items-center justify-center gap-2 p-4 text-center ${iconBg(document.mimeType)}`}>
      <FileIcon mimeType={document.mimeType} className="size-10" />
      <p className="line-clamp-2 text-xs font-semibold text-zinc-700">{document.name}</p>
    </div>
  )
}

export default function ScreenPanel() {
  const [screens, setScreens] = useState<Screen[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [dragOverId, setDragOverId] = useState<string | null>(null)
  const [assigningId, setAssigningId] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/screens')
      .then((response) => (response.ok ? response.json() : []))
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
      setScreens((prev) => [...prev, { ...newScreen, assets: [] }])
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

  async function removeAsset(screenId: string, assetId: string) {
    try {
      const res = await fetch(`/api/screens/${screenId}/assets/${assetId}`, { method: 'DELETE' })
      if (!res.ok) {
        toast.error('Failed to remove asset')
        return
      }

      setScreens((prev) => prev.map((screen) => (
        screen.id === screenId
          ? { ...screen, assets: (screen.assets || []).filter((asset) => asset.id !== assetId) }
          : screen
      )))
      toast.success('Asset removed from screen')
    } catch {
      toast.error('Failed to remove asset')
    }
  }

  async function assignAsset(screenId: string, document: DocumentAsset) {
    setAssigningId(screenId)
    try {
      const res = await fetch(`/api/screens/${screenId}/assets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentId: document.id }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => null)
        toast.error(data?.error || 'Failed to assign asset')
        return
      }

      const asset = await res.json()
      setScreens((prev) => prev.map((screen) => {
        if (screen.id !== screenId) return screen
        return { ...screen, assets: [asset] }
      }))
      toast.success(`Assigned "${document.name}" to screen`)
    } catch {
      toast.error('Failed to assign asset')
    } finally {
      setAssigningId(null)
      setDragOverId(null)
    }
  }

  function handleDrop(event: DragEvent<HTMLDivElement>, screenId: string) {
    event.preventDefault()
    const payload = event.dataTransfer.getData('application/json')
    if (!payload) {
      setDragOverId(null)
      return
    }

    try {
      const document = JSON.parse(payload) as DocumentAsset
      if (!document.id) throw new Error('Missing document id')
      assignAsset(screenId, document)
    } catch {
      toast.error('Could not read dragged asset')
      setDragOverId(null)
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
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
            {Array.from({ length: 6 }).map((_, idx) => (
              <Skeleton key={idx} className="aspect-square rounded-2xl" />
            ))}
          </div>
        ) : screens.length === 0 ? (
          <div className="h-full min-h-64 flex flex-col items-center justify-center text-center text-gray-400 gap-3">
            <Monitor className="size-10" />
            <p className="text-sm font-medium">No screens registered.</p>
            <p className="text-xs">Add a screen to track display endpoints.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
            {screens.map((screen) => {
              const assets = screen.assets || []
              const latestAsset = assets[0]
              const isActiveDrop = dragOverId === screen.id

              return (
                <div
                  key={screen.id}
                  onDragOver={(event) => {
                    event.preventDefault()
                    event.dataTransfer.dropEffect = 'copy'
                    setDragOverId(screen.id)
                  }}
                  onDragLeave={() => setDragOverId(null)}
                  onDrop={(event) => handleDrop(event, screen.id)}
                  className={`group relative aspect-square overflow-hidden rounded-2xl border bg-zinc-50 transition-all ${
                    isActiveDrop
                      ? 'border-black ring-4 ring-black/10'
                      : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                  }`}
                >
                  <div className="absolute inset-0">
                    {latestAsset ? (
                      <AssetPreview document={latestAsset.document} />
                    ) : (
                      <div className="flex h-full w-full flex-col items-center justify-center gap-3 p-6 text-center text-gray-400">
                        <Monitor className="size-12" />
                        <p className="text-xs font-medium">Drop an asset here</p>
                      </div>
                    )}
                  </div>

                  <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-3 bg-gradient-to-b from-white/95 to-white/0 p-4">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-zinc-950">{screen.name}</p>
                      <p className="text-xs font-medium text-zinc-500">
                        {latestAsset ? '1 asset assigned' : 'No asset assigned'}
                      </p>
                    </div>
                    <div className="flex shrink-0 gap-1">
                      <button
                        onClick={() => window.open(`/view/screen/${screen.id}`, '_blank', 'noopener,noreferrer')}
                        className="flex size-8 items-center justify-center rounded-lg bg-white/90 text-zinc-500 shadow-sm ring-1 ring-zinc-200 transition hover:text-black"
                        aria-label={`Open ${screen.name}`}
                        title="Open screen URL"
                      >
                        <ExternalLink className="size-4" />
                      </button>
                      <button
                        onClick={() => removeScreen(screen.id)}
                        className="flex size-8 items-center justify-center rounded-lg bg-white/90 text-zinc-400 shadow-sm ring-1 ring-zinc-200 transition hover:bg-rose-50 hover:text-rose-600"
                        aria-label={`Remove ${screen.name}`}
                        title="Remove screen"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </div>

                  {isActiveDrop ? (
                    <div className="absolute inset-3 flex items-center justify-center rounded-xl border-2 border-dashed border-black bg-white/80 text-xs font-bold text-zinc-900">
                      Drop to assign
                    </div>
                  ) : null}

                  {assigningId === screen.id ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/80 text-xs font-bold text-zinc-900">
                      Saving...
                    </div>
                  ) : null}

                  {latestAsset ? (
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-black/0 p-4 pt-12">
                      <div className="flex items-end justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate text-xs font-semibold text-white">{latestAsset.document.name}</p>
                          <p className="mt-0.5 text-[10px] font-medium uppercase text-white/60">
                            {latestAsset.document.sourceType === 'WEBSITE' ? 'Website' : latestAsset.document.mimeType}
                          </p>
                        </div>
                        <button
                          onClick={() => removeAsset(screen.id, latestAsset.id)}
                          className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-white/15 text-white transition hover:bg-white/25"
                          aria-label={`Remove ${latestAsset.document.name}`}
                          title="Remove assigned asset"
                        >
                          <X className="size-3.5" />
                        </button>
                      </div>
                    </div>
                  ) : null}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
