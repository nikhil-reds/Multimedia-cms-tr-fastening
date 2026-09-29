"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  FileText,
  LayoutDashboard,
  Monitor,
  Tv,
} from "lucide-react"

import { cn } from "@/lib/utils"

const navigationItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    matcher: (pathname: string) => pathname.startsWith("/dashboard"),
  },
  {
    label: "Documents",
    href: "/documents",
    icon: FileText,
    matcher: (pathname: string) => pathname === "/" || pathname.startsWith("/documents"),
  },
  {
    label: "Main Screen",
    href: "/main-screen",
    icon: Tv,
    matcher: (pathname: string) => pathname.startsWith("/main-screen"),
  },
  {
    label: "Screens",
    href: "/screens",
    icon: Monitor,
    matcher: (pathname: string) => pathname.startsWith("/screens"),
  },
]

type AppSidebarProps = {
  onNavigate?: () => void
}

export default function AppSidebar({ onNavigate }: AppSidebarProps) {
  const pathname = usePathname()

  return (
    <aside className="flex h-full w-full flex-col bg-white text-zinc-950">
      <div className="flex h-16 items-center gap-3 border-b border-zinc-200 px-5">
        <div className="flex size-9 items-center justify-center rounded-lg bg-black text-white">
          <Tv className="size-4" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-bold leading-5">Rubenius</p>
          <p className="truncate text-xs font-medium text-zinc-500">Multimedia Console</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigationItems.map((item) => {
          const isActive = item.matcher(pathname)
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex h-10 items-center gap-3 rounded-lg px-3 text-sm font-semibold transition-colors",
                isActive
                  ? "bg-black text-white shadow-sm"
                  : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950"
              )}
            >
              <Icon className="size-4" />
              <span className="truncate">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-zinc-200 p-4">
        <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3">
          <p className="text-xs font-bold text-zinc-900">Media workspace</p>
          <p className="mt-1 text-xs leading-5 text-zinc-500">
            Manage uploads, documents, and connected displays.
          </p>
        </div>
      </div>
    </aside>
  )
}
