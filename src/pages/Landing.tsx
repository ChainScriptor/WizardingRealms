import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import ManaParticles from '@/components/ManaParticles'

export default function Landing() {
  return (
    <div className="relative">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-forest bg-cover bg-center opacity-40"></div>
        <div className="absolute inset-0" style={{ background: 'radial-gradient(60% 60% at 50% 30%, rgba(18, 28, 46, 0.75), rgba(5, 8, 14, 0.95))' }}></div>
        <ManaParticles count={28} />
        <div className="relative mx-auto max-w-7xl px-4 py-24 md:py-32">
          <div className="max-w-3xl">
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="font-wizard text-5xl md:text-6xl tracking-wide glow-text"
            >
              Wizarding Realms
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.7 }}
              className="mt-5 text-lg md:text-xl text-zinc-300"
            >
              Explore 15,555 enchanted plots beyond the Forbidden Forest. Forge your legacy, uncover relics, and claim House points in a world woven with ancient magic.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.7 }}
              className="mt-10 flex items-center gap-4"
            >
              <Link
                to="/gallery"
                className="relative inline-flex items-center justify-center rounded-xl px-6 py-3 font-semibold ring-2 ring-mana-500 text-mana-200 bg-zinc-900/60 hover:bg-zinc-900/80 shadow-glow transition"
              >
                Enter Gallery
              </Link>
              <a
                href="https://unsplash.com"
                className="text-zinc-400 hover:text-zinc-200 transition"
                target="_blank" rel="noreferrer"
              >
                Lore & Assets
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="relative">
        <div className="mx-auto max-w-7xl px-4 py-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: 'Ancient Runes', desc: 'Decode arcane glyphs to unlock hidden traits.' },
            { title: 'House Honors', desc: 'Compete for glory and raise your banner.' },
            { title: 'Relic Crafting', desc: 'Merge artifacts to enhance your plot.' }
          ].map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className="rounded-2xl p-6 bg-zinc-900/60 ring-1 ring-zinc-700/60"
            >
              <div className="font-wizard text-2xl gold-glow-text">{f.title}</div>
              <p className="mt-3 text-zinc-300">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  )
}

