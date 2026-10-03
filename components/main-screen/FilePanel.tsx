'use client'

import { useEffect, useMemo, useState } from 'react'
import { FileText, Globe2, Search } from 'lucide-react'
import { toast } from 'sonner'
import { Document, FileIcon, formatBytes, formatDate, iconBg, StatusBadge } from './shared'
import { DocumentListSkeleton } from './skeletons'

type DocumentItem = Document & {
  cloudinaryUrl?: string | null
  websiteUrl?: string | null
  sourceType?: 'FILE' | 'WEBSITE'
  createdAt?: string
  updatedAt?: string
}

export default function FilePanel() {
  const [documents, setDocuments] = useState<DocumentItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    function loadDocuments() {
      fetch('/api/documents')
        .then((response) => {
          if (!response.ok) throw new Error('Failed to load documents')
          return response.json()
        })
        .then((data: DocumentItem[]) => {
          const normalized = Array.isArray(data)
            ? data.map((doc) => ({
                ...doc,
                s3Url: doc.s3Url || doc.cloudinaryUrl || doc.websiteUrl || '',
              }))
            : []

          setDocuments(normalized)
        })
        .catch(() => {
          setDocuments([])
          toast.error('Failed to load documents')
        })
        .finally(() => setLoading(false))
    }

    loadDocuments()
    // ScreenPanel fires this after creating a document from an external drop.
    window.addEventListener('documents:changed', loadDocuments)
    return () => window.removeEventListener('documents:changed', loadDocuments)
  }, [])

  const filteredDocuments = useMemo(() => {
    const query = searchTerm.trim().toLowerCase()
    if (!query) return documents

    return documents.filter((doc) => (
      doc.name.toLowerCase().includes(query) ||
      doc.mimeType.toLowerCase().includes(query)
    ))
  }, [documents, searchTerm])

  return (
    <aside className="w-80 shrink-0 rounded-2xl bg-white/85 dark:bg-zinc-950/85 backdrop-blur-md border border-white/70 dark:border-zinc-800 shadow-lg shadow-blue-950/10 dark:shadow-black/40 flex flex-col overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 dark:border-zinc-800 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-xs font-semibold text-gray-400 dark:text-zinc-400 tracking-widest uppercase">
              Documents
            </h2>
            <p className="mt-1 text-sm font-semibold text-gray-950 dark:text-zinc-50">
              All uploaded files
            </p>
          </div>
          <span className="rounded-full bg-gray-100 dark:bg-zinc-800 px-2.5 py-1 text-xs font-semibold text-gray-600 dark:text-zinc-300">
            {documents.length}
          </span>
        </div>

        <label className="relative block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-zinc-400" />
          <input
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search documents"
            className="h-10 w-full rounded-lg border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900 pl-9 pr-3 text-sm text-gray-900 dark:text-zinc-100 outline-none transition focus:border-gray-300 dark:focus:border-zinc-700 focus:bg-white dark:focus:bg-zinc-950"
          />
        </label>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {loading ? (
          <DocumentListSkeleton />
        ) : filteredDocuments.length === 0 ? (
          <div className="flex min-h-80 flex-col items-center justify-center gap-3 px-6 text-center text-gray-400 dark:text-zinc-500">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-100 dark:bg-zinc-800/50">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700 dark:text-zinc-300">
                No documents found
              </p>
              <p className="mt-1 text-xs leading-relaxed">
                Uploaded documents will appear here automatically.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredDocuments.map((doc) => {
              // Image/video links show as media; other links show as websites.
              const isWebsite = (doc.sourceType === 'WEBSITE' || Boolean(doc.websiteUrl)) && !/^(image|video)\//.test(doc.mimeType)
              return (
                <a
                  key={doc.id}
                  href={doc.s3Url || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  draggable={Boolean(doc.s3Url)}
                  onClick={(event) => {
                    if (!doc.s3Url) event.preventDefault()
                  }}
                  onDragStart={(event) => {
                    event.dataTransfer.setData('application/json', JSON.stringify(doc))
                    event.dataTransfer.effectAllowed = 'copy'
                  }}
                  className="group block rounded-xl border border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-3 transition hover:border-gray-200 dark:hover:border-zinc-700 hover:shadow-sm active:cursor-grabbing"
                >
                  <div className="flex gap-3">
                    <div className={`h-12 w-12 shrink-0 rounded-xl flex items-center justify-center ${isWebsite ? 'bg-sky-50 dark:bg-sky-950/50' : iconBg(doc.mimeType)} overflow-hidden`}>
                      {isWebsite ? (
                        <Globe2 className="h-6 w-6 text-sky-600" />
                      ) : doc.mimeType.startsWith('image/') && doc.s3Url ? (
                        <img src={doc.s3Url} alt={doc.name} className="h-full w-full object-cover" />
                      ) : doc.mimeType.startsWith('video/') && doc.s3Url ? (
                        <video src={doc.s3Url} className="h-full w-full object-cover" preload="metadata" muted />
                      ) : (
                        <FileIcon mimeType={doc.mimeType} className="h-6 w-6" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-2 break-words text-sm font-semibold leading-snug text-gray-900 dark:text-zinc-100 group-hover:text-black dark:group-hover:text-white">
                        {doc.name}
                      </p>
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <StatusBadge status={doc.status} />
                        <span className="text-xs text-gray-400 dark:text-zinc-500">
                          {isWebsite ? 'Website' : formatBytes(doc.size)}
                        </span>
                      </div>
                      {doc.createdAt ? (
                        <p className="mt-2 truncate text-xs text-gray-400 dark:text-zinc-500">
                          {formatDate(doc.createdAt)}
                        </p>
                      ) : null}
                    </div>
                  </div>
                </a>
              )
            })}
          </div>
        )}
      </div>
    </aside>
  )
}
