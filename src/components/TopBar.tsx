import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import WalletConnectButton from './WalletConnectButton'
import ManaParticles from './ManaParticles'
import { useEffect, useMemo, useState } from 'react'

function useHousePoints() {
  const [points, setPoints] = useState({ Gryffindor: 1520, Slytherin: 1475, Ravenclaw: 1588, Hufflepuff: 1402 })
  useEffect(() => {
    const id = setInterval(() => {
      setPoints(p => {
        const houseKeys = Object.keys(p) as Array<keyof typeof p>
        const key = houseKeys[Math.floor(Math.random() * houseKeys.length)]
        return { ...p, [key]: p[key] + Math.floor(Math.random() * 5) }
      })
    }, 4000)
    return () => clearInterval(id)
  }, [])
  return points
}

export default function TopBar() {
  const loc = useLocation()
  const points = useHousePoints()
  const total = useMemo(() => Object.values(points).reduce((a, b) => a + b, 0), [points])

  return (
    <div className="sticky top-0 z-50 bg-gradient-to-b from-parchment-900/95 to-parchment-900/40 backdrop-blur-md border-b border-zinc-800/60">
      <div className="relative">
        <ManaParticles count={22} />
        <div className="mx-auto max-w-7xl px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <Link to="/" className="group inline-flex items-center gap-3">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="h-9 w-9 rounded-full ring-2 ring-mana-500 shadow-glow"
                style={{ background: 'radial-gradient(60% 60% at 50% 50%, #3066BE, #0b1020)' }}
              />
              <div className="font-wizard text-lg md:text-2xl glow-text">Wizarding Realms</div>
            </Link>
            <div className="hidden md:flex items-center gap-6 text-sm flex-1 justify-center">
              <div className="hidden lg:flex items-center gap-2">
                <div className="px-2 py-1 rounded-md bg-zinc-900/60 ring-1 ring-zinc-700/60">
                  <span className="text-zinc-400">SUI</span> <span className="mx-1">$1.64</span>
                  <span className="text-rose-400 text-xs">-0.23%</span>
                </div>
                <div className="px-2 py-1 rounded-md bg-zinc-900/60 ring-1 ring-zinc-700/60">
                  <span className="text-zinc-400">All Wallets</span>
                </div>
              </div>
              <div className="hidden md:flex items-center w-full max-w-md">
                <input
                  placeholder="Search for a creature, plot or relic..."
                  className="w-full rounded-lg bg-zinc-900/60 ring-1 ring-zinc-700/60 px-3 py-1.5 text-sm outline-none focus:ring-mana-500/60"
                />
              </div>
              <Link to="/gallery" className={`hidden lg:block hover:text-mana-400 transition ${loc.pathname === '/gallery' ? 'text-mana-400' : 'text-zinc-300'}`}>Gallery</Link>
              <Link to="/achievements" className={`hidden lg:block hover:text-mana-400 transition ${loc.pathname === '/achievements' ? 'text-mana-400' : 'text-zinc-300'}`}>Achievements</Link>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-2">
                <div className="px-2 py-1 rounded-md bg-zinc-900/60 ring-1 ring-zinc-700/60 text-xs">Achievements</div>
                <div className="px-2 py-1 rounded-md bg-zinc-900/60 ring-1 ring-zinc-700/60 text-xs">
                  Mana <span className="font-semibold">{total}</span>
                </div>
              </div>
              <WalletConnectButton />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

