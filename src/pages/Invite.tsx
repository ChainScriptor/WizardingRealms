import MainLayout from '@/components/MainLayout'
import InvitePanel from '@/components/InvitePanel'
import SphereImageGrid, { ImageData } from '@/components/ui/img-sphere'
import { useMemo } from 'react'

export default function Invite() {
  const wizardImages: ImageData[] = useMemo(() => {
    const total = 21
    const arr: ImageData[] = []
    for (let i = 1; i <= total; i++) {
      arr.push({
        id: `wizard-${i}`,
        src: `/wizards/${i}.jpg`,
        alt: `Wizard ${i}`,
        title: `Wizard #${i}`,
      })
    }
    return arr
  }, [])

  return (
    <MainLayout>
      <div className="space-y-4">
        <div className="font-wizard text-3xl glow-text">Invite a Friend</div>
        <InvitePanel />
        <div className="rounded-2xl bg-zinc-900/70 ring-1 ring-zinc-700/60 p-4">
          <div className="mb-3 font-semibold text-white">Meet the Wizards</div>
          <div className="w-full flex justify-center">
            <SphereImageGrid
              images={wizardImages}
              containerSize={600}
              sphereRadius={220}
              dragSensitivity={0.8}
              momentumDecay={0.96}
              maxRotationSpeed={6}
              baseImageScale={0.15}
              hoverScale={1.3}
              perspective={1000}
              autoRotate
              autoRotateSpeed={0.2}
            />
          </div>
        </div>
      </div>
    </MainLayout>
  )
}


