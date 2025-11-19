import { useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion, useMotionTemplate, useMotionValue, useTransform } from 'framer-motion'
import { generatePlot } from '@/utils/data'
import { tierToColorHex } from '@/utils/rarity'

export default function PlotDetail() {
  const { id } = useParams()
  const num = Number(id || 1)
  const plot = useMemo(() => generatePlot(num), [num])
  const rarityColor = tierToColorHex(plot.rarity)

  // 3D tilt
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateX = useTransform(y, [-50, 50], [8, -8])
  const rotateY = useTransform(x, [-50, 50], [-8, 8])
  const bg = useMotionTemplate`radial-gradient(60% 60% at 50% 50%, rgba(63,173,255,0.10), rgba(0,0,0,0))`

  function onMouseMove(e: React.MouseEvent) {
    const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect()
    const px = e.clientX - rect.left - rect.width / 2
    const py = e.clientY - rect.top - rect.height / 2
    x.set(px)
    y.set(py)
  }

  function onMouseLeave() {
    x.set(0)
    y.set(0)
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-6 flex items-center justify-between">
        <Link to="/gallery" className="text-zinc-400 hover:text-zinc-200 transition">&larr; Back to Gallery</Link>
        <div className="text-zinc-400">Plot <span className="font-semibold">{plot.id}</span></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3">
          <motion.div
            className="relative rounded-2xl overflow-hidden ring-2 shadow-xl"
            onMouseMove={onMouseMove}
            onMouseLeave={onMouseLeave}
            style={{ borderColor: rarityColor, boxShadow: `0 0 32px ${rarityColor}55` }}
          >
            <motion.div style={{ rotateX, rotateY }} transition={{ type: 'spring', stiffness: 120, damping: 12 }}>
              <div className="relative">
                <div className="absolute inset-0" style={{ background: bg as unknown as string }}></div>
                <img
                  src={plot.image}
                  className="w-full h-[28rem] object-cover"
                  alt={plot.title}
                />
                <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/70 to-black/0">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-wizard text-2xl glow-text">{plot.title}</div>
                      <div className="text-zinc-300">{plot.house} • Mana {plot.manaYield}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <HouseBadge house={plot.house} />
                      <div className="text-xs px-2 py-1 rounded-md bg-zinc-900/70" style={{ border: `1px solid ${rarityColor}`, boxShadow: `0 0 16px ${rarityColor}55` }}>
                        {plot.rarity}
                      </div>
                    </div>
                  </div>
                </div>
                {plot.hasRoomOfRequirement && (
                  <div className="absolute top-3 right-3">
                    <span className="animate-pulse inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ring-2 ring-pink-400/60 text-pink-200 bg-zinc-900/70 shadow-glow-mythic">
                      Room of Requirement
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        </div>
        <div className="lg:col-span-2">
          <div className="rounded-2xl p-5 bg-zinc-900/60 ring-1 ring-zinc-700/60">
            <div className="font-wizard text-xl mb-3 gold-glow-text">Traits</div>
            <div className="grid grid-cols-2 gap-3">
              {plot.traits.map((t) => (
                <div key={t.name} className="rounded-lg bg-zinc-800/60 p-3">
                  <div className="text-xs text-zinc-400">{t.name}</div>
                  <div className="font-semibold">{t.value}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-6 rounded-2xl p-5 bg-zinc-900/60 ring-1 ring-zinc-700/60">
            <div className="font-wizard text-xl mb-3 gold-glow-text">Lore</div>
            <p className="text-zinc-300">
              Whispers tell of arcane wards and spectral guardians bound to this land. Only those attuned to the old magics may unveil its deepest secrets.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function HouseBadge({ house }: { house: string }) {
  const colors: Record<string, string> = {
    Gryffindor: '#b91c1c',
    Slytherin: '#065f46',
    Ravenclaw: '#1e40af',
    Hufflepuff: '#b45309'
  }
  const c = colors[house] ?? '#3a9bff'
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="h-10 w-10 rounded-full grid place-items-center font-wizard text-sm"
      style={{ background: 'rgba(0,0,0,0.6)', border: `2px solid ${c}`, boxShadow: `0 0 18px ${c}66` }}
      title={house}
    >
      {house[0]}
    </motion.div>
  )
}

