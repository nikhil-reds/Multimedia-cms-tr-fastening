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
      <div className="min-w-0 flex flex-col justify-center h-full">
        <p
          className={cn(
            "truncate font-bold",
            isSmall ? "text-base" : "text-lg",
            isLight ? "text-white" : "text-zinc-950 dark:text-zinc-100"
          )}
        >
          Multimedia Console
        </p>
      </div>
    </div>
  )
}
