import CloseButton from '../../[docId]/CloseButton'

type ScreenPlayerProps = {
  screenName: string
}

export default function ScreenPlayer({ screenName }: ScreenPlayerProps) {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-zinc-950 text-white select-none">
      <div className="max-w-md text-center p-8 bg-zinc-900 rounded-2xl border border-zinc-800 shadow-2xl flex flex-col items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-zinc-800 flex items-center justify-center border border-zinc-700">
          <svg className="w-8 h-8 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <h2 className="text-lg font-bold text-white/90">{screenName}</h2>
        <p className="text-sm text-zinc-500">
          This display is registered and ready. No playback workflow is configured.
        </p>
        <CloseButton />
      </div>
    </div>
  )
}
