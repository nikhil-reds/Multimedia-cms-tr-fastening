import BrandLogo from "@/components/BrandLogo"
import BrandPanel from "./BrandPanel"

type AuthLayoutProps = {
  title: string
  description?: string
  children: React.ReactNode
  footer?: React.ReactNode
}

// Split layout shared by auth pages: brand panel on the left, form on the right.
export default function AuthLayout({ title, description, children, footer }: AuthLayoutProps) {
  return (
    <div className="grid min-h-screen bg-zinc-50 lg:grid-cols-2">
      <BrandPanel />

      <main className="flex items-center justify-center px-4 py-10 sm:px-8">
        <div className="w-full max-w-sm space-y-8">
          <BrandLogo className="lg:hidden" />

          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight text-zinc-950">{title}</h1>
            {description ? <p className="text-sm text-zinc-500">{description}</p> : null}
          </div>

          {children}

          {footer ? <div className="text-center text-sm text-zinc-500">{footer}</div> : null}
        </div>
      </main>
    </div>
  )
}
