import FilePanel from '@/components/main-screen/FilePanel'
import ScreenPanel from '@/components/main-screen/ScreenPanel'

export default function MainScreen() {
  return (
    <div
      className="bg-gray-50 flex gap-5 px-6 py-6 overflow-hidden"
      style={{ height: 'calc(100vh - 113px)' }}
    >
      <FilePanel />
      <ScreenPanel />
    </div>
  )
}

