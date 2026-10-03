import FilePanel from '@/components/main-screen/FilePanel'
import ScreenPanel from '@/components/main-screen/ScreenPanel'

export default function MainScreen() {
  // Background: white at the top, light sea blue in the middle, dark blue at the bottom.
  return (
    <div
      className="bg-[linear-gradient(to_top,#0a1f5c_0%,#1d4ed8_22%,#5cc8e0_52%,#d6f4fa_78%,#ffffff_100%)] dark:bg-[linear-gradient(to_top,#020617_0%,#0f172a_50%,#1e293b_100%)] flex gap-5 px-6 py-6 overflow-hidden"
      style={{ height: 'calc(100vh - 64px)' }}
    >
      <FilePanel />
      <ScreenPanel />
    </div>
  )
}

