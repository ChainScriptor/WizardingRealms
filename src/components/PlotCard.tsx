import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Plot } from '@/utils/data'
import { tierToColorHex } from '@/utils/rarity'

export default function PlotCard({ plot }: { plot: Plot }) {
  const rarityColor = tierToColorHex(plot.rarity)

  return (
    <div className="relative flip">
      {plot.hasRoomOfRequirement && (
        <motion.div
          initial={{ y: -6, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="pointer-events-none absolute -top-2 -right-2 z-10"
        >
          <span className="animate-bounce inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ring-2 ring-pink-400/60 text-pink-200 bg-zinc-900/70 shadow-glow-mythic">
            Room of Requirement
          </span>
        </motion.div>
      )}
      <Link to={`/plot/${plot.id}`} className="block">
        <div className="flip-inner rounded-xl overflow-hidden">
          {/* Front */}
          <div className="flip-face relative">
            <div
              className="relative h-64 w-full bg-cover bg-center"
              style={{ backgroundImage: `url(${plot.image})` }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/10"></div>
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold">{plot.title}</div>
                    <div className="text-xs text-zinc-300">{plot.house} • Mana {plot.manaYield}</div>
                  </div>
                  <div className="text-xs px-2 py-1 rounded-md bg-zinc-900/70" style={{ border: `1px solid ${rarityColor}`, boxShadow: `0 0 16px ${rarityColor}55` }}>
                    {plot.rarity}
                  </div>
                </div>
              </div>
            </div>
            <div className="ring-2 rounded-xl" style={{ borderColor: rarityColor, boxShadow: `0 0 24px ${rarityColor}55` }}></div>
          </div>
          {/* Back */}
          <div className="flip-face flip-back absolute inset-0 rounded-xl bg-zinc-900/80 backdrop-blur-sm ring-2" style={{ borderColor: rarityColor }}>
            <div className="p-4">
              <div className="font-wizard text-lg mb-2" style={{ textShadow: `0 0 10px ${rarityColor}66` }}>Traits</div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {plot.traits.slice(0, 6).map((t) => (
                  <div key={t.name} className="rounded-md bg-zinc-800/60 px-2 py-1">
                    <div className="text-xs text-zinc-400">{t.name}</div>
                    <div className="font-semibold">{t.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}

