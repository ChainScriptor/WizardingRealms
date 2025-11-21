import MainLayout from '@/components/MainLayout'
import { FireSphere } from '@/components/ui/fire-sphere'

export default function Coins() {
  return (
    <MainLayout>
      <div className="space-y-4">
        <div className="font-wizard text-3xl glow-text">Coins</div>
        {/* Fire Sphere full-bleed panel with overlay text */}
        <div className="relative rounded-2xl overflow-hidden ring-1 ring-zinc-800 bg-black" style={{ height: '70vh' }}>
          <FireSphere className="absolute inset-0 h-full w-full" />
          <div className="absolute inset-0 z-10 flex items-center justify-start pl-6 md:pl-12 lg:pl-20">
            <div className="text-white font-wizard text-4xl md:text-6xl drop-shadow-[0_2px_20px_rgba(255,140,0,0.35)] text-left">
              WIZ coming soon ...
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}




