"use client"

import { useState } from "react"
import { Menu } from "lucide-react"

import AppSidebar from "@/components/AppSidebar"
import Navbar from "@/components/Navbar"
import { Button } from "@/components/ui/button"

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50 lg:flex">
      <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-30 lg:block lg:w-64 lg:border-r lg:border-zinc-200 dark:lg:border-zinc-800">
        <AppSidebar />
      </div>

      <div className="flex min-h-screen min-w-0 flex-1 flex-col lg:pl-64">
        <Navbar
          menuControl={
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsSidebarOpen(true)}
              aria-label="Open navigation"
            >
              <Menu className="size-5" />
            </Button>
          }
        />
        {isSidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <button
              type="button"
              className="absolute inset-0 bg-black/20 dark:bg-black/60"
              onClick={() => setIsSidebarOpen(false)}
              aria-label="Close navigation"
            />
            <div
              role="dialog"
              aria-label="Main navigation"
              className="relative h-full w-72 max-w-[85vw] border-r border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 shadow-xl"
            >
              <AppSidebar onNavigate={() => setIsSidebarOpen(false)} />
            </div>
          </div>
        )}
        <main className="min-w-0 flex-1 overflow-x-hidden">{children}</main>
      </div>
    </div>
  )
}
