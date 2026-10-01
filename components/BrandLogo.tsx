import Image from "next/image"

import { cn } from "@/lib/utils"

type BrandLogoProps = {
  // "dark" for light backgrounds, "light" for the black brand panel.
  tone?: "dark" | "light"
  size?: "sm" | "md"
  className?: string
}

// TR Fastenings logo (public/tr_logo.jpg) with the product name beside it.
export default function BrandLogo({ tone = "dark", size = "md", className }: BrandLogoProps) {
  const isLight = tone === "light"
  const isSmall = size === "sm"

  return (
    <div className={cn("flex items-center gap-3", className)}>
      {/* The logo has a white background, so it sits on a white tile on dark panels. */}
      <div
        className={cn(
          "flex shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white",
          isLight && "p-1 ring-1 ring-white/20",
          isSmall ? "size-11" : "size-12"
        )}
      >
        <Image
          src="/tr_logo.jpg"
          alt="TR Fastenings — part of the Trifast plc Group"
          width={140}
          height={134}
          priority
          className="h-full w-full object-contain"
        />
      </div>
      <div className="min-w-0">
        <p
          className={cn(
            "truncate font-bold leading-5",
            isSmall ? "text-sm" : "text-base",
            isLight ? "text-white" : "text-zinc-950"
          )}
        >
          TR Fastenings
        </p>
        <p className={cn("truncate text-xs font-medium", isLight ? "text-white/60" : "text-zinc-500")}>
          Multimedia Console
        </p>
      </div>
    </div>
  )
}
