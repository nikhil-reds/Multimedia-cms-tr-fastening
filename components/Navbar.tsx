"use client"

type NavbarProps = {
  menuControl?: React.ReactNode
}

export default function Navbar({ menuControl }: NavbarProps) {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-zinc-200 bg-white/95 px-4 backdrop-blur lg:px-6">
      <div className="flex min-w-0 items-center gap-3">
        {menuControl}
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-zinc-950">Rubenius Multimedia</p>
          <p className="truncate text-xs font-medium text-zinc-500">
            Streaming media management
          </p>
        </div>
      </div>

      <div className="hidden text-xs font-semibold text-zinc-500 sm:block">
        Documents and screens
      </div>
    </header>
  )
}
