import { FileText, Monitor, Radio } from "lucide-react"

import BrandLogo from "@/components/BrandLogo"

const highlights = [
  { icon: FileText, title: "Upload once", text: "Photos, videos, PDFs and website links in one library." },
  { icon: Monitor, title: "Assign to screens", text: "Drag any asset onto a display in seconds." },
  { icon: Radio, title: "Play everywhere", text: "Screens pick up new content automatically." },
]

// Decorative left side of the auth layout. Hidden on small screens.
export default function BrandPanel() {
  return (
    <div className="relative hidden overflow-hidden bg-zinc-950 p-10 text-white lg:flex lg:flex-col lg:justify-between">
      {/* Subtle grid backdrop */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <BrandLogo tone="light" className="relative" />

      <div className="relative max-w-md space-y-8">
        <ScreenMockup />
        <div className="space-y-3">
          <h2 className="text-3xl font-bold leading-tight tracking-tight">
            Every screen, one console.
          </h2>
          <p className="text-sm leading-relaxed text-white/60">
            Manage what plays on each of your displays from a single place.
          </p>
        </div>
        <ul className="space-y-4">
          {highlights.map(({ icon: Icon, title, text }) => (
            <li key={title} className="flex gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white/10 ring-1 ring-white/10">
                <Icon className="size-4 text-white/80" />
              </div>
              <div>
                <p className="text-sm font-semibold">{title}</p>
                <p className="text-xs text-white/50">{text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <p className="relative text-xs text-white/40">© {new Date().getFullYear()} TR Fastenings. All rights reserved.</p>
    </div>
  )
}

// A small illustration of the screens grid.
function ScreenMockup() {
  return (
    <div aria-hidden className="grid grid-cols-3 gap-2 rounded-2xl bg-white/5 p-3 ring-1 ring-white/10">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className={`aspect-video rounded-md ${
            index === 1 ? "bg-gradient-to-br from-sky-400/70 to-indigo-500/70" : index === 3 ? "bg-white/25" : "bg-white/10"
          }`}
        />
      ))}
    </div>
  )
}
