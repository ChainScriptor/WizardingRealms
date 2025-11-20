import MainLayout from '@/components/MainLayout'
import AnnouncementBar from '@/components/AnnouncementBar'
import ChartWidget from '@/components/ChartWidget'
import SwapWidget from '@/components/SwapWidget'

export default function Swap() {
  return (
    <MainLayout>
      <div className="space-y-6">
          <AnnouncementBar />

          {/* Swap Section with Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ChartWidget />
            <SwapWidget />
          </div>

          {/* Video Section */}
          <div className="relative rounded-xl overflow-hidden bg-zinc-900/50 ring-1 ring-zinc-700/60">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-auto max-h-[500px] object-cover"
            >
              <source src="/video.mp4" type="video/mp4" />
            </video>
          </div>
        </div>
    </MainLayout>
  )
}

