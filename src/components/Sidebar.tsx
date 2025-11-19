import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import WalletConnectButton from './WalletConnectButton'

const nav = [
  { to: '/dashboard', label: 'Dashboard', icon: '🏰' },
  { to: '/gallery', label: 'Gallery', icon: '🗺️' },
  { to: '/plot/1', label: 'My Plot', icon: '📜' },
  { to: '/wizard-lands', label: 'Wizard Lands', icon: '🧙‍♂️', external: true },
  { to: '/achievements', label: 'Achievements', icon: '🏆' },
  { to: '#', label: 'Coins', icon: '🪙' },
  { to: '#', label: 'Swap', icon: '🔄' },
  { to: '#', label: 'Airdrops', icon: '🎁' },
  { to: '#', label: 'Leaderboard', icon: '🏆' },
  { to: '#', label: 'Market Stats', icon: '📈' },
  { to: '#', label: 'Bridge', icon: '🌉' },
  { to: '#', label: 'Invite a Friend', icon: '🪄' }
]

export default function Sidebar() {
  const loc = useLocation()
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Mobile toggle */}
      <div className="md:hidden sticky top-[56px] z-40 bg-parchment-900/80 backdrop-blur-sm border-b border-zinc-800/60">
        <div className="px-4 py-2 flex items-center justify-between">
          <div className="font-wizard">Menu</div>
          <button onClick={() => setOpen((v) => !v)} className="px-3 py-1 rounded-md bg-zinc-800/70 ring-1 ring-zinc-700">
            {open ? 'Close' : 'Open'}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {(open || typeof window === 'undefined') && (
          <motion.aside
            initial={{ x: -240, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -240, opacity: 0 }}
            transition={{ type: 'tween', duration: 0.25 }}
            className="md:hidden fixed z-40 left-0 top-0 bottom-0 w-64 bg-gradient-to-b from-parchment-900 to-parchment-800/90 border-r border-zinc-800/60 p-4"
          >
            <SidebarInner activePath={loc.pathname} onNavigate={() => setOpen(false)} />
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Desktop */}
      <aside className="hidden md:flex md:flex-col md:w-64 md:shrink-0 bg-gradient-to-b from-parchment-900 to-parchment-800/90 border-r border-zinc-800/60 p-4">
        <SidebarInner activePath={loc.pathname} />
      </aside>
    </>
  )
}

function SidebarInner({ activePath, onNavigate }: { activePath: string; onNavigate?: () => void }) {
  return (
    <div className="flex h-full flex-col">
      <div className="mb-4">
        <div className="font-wizard text-xl glow-text">Wizard Panel</div>
        <div className="text-xs text-zinc-400">v0.1 • demo</div>
      </div>

      {/* Promo card */}
      <div className="mb-3 rounded-xl p-3 bg-gradient-to-br from-zinc-900 via-zinc-900/70 to-zinc-800 ring-1 ring-zinc-700/60">
        <div className="text-xs text-amber-300 font-semibold">WIZ IS LIVE!</div>
        <div className="mt-1 text-sm text-zinc-300">Claim via TGE Portal</div>
        <a
          href="#"
          className="mt-2 inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-mana-600 to-amber-500 px-3 py-1.5 text-zinc-900 font-semibold shadow-glow"
        >
          TGE Portal
        </a>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto pr-1">
        {nav.map((n) => {
          const active = activePath === n.to
          return n.external ? (
            <a
              key={n.label}
              href={n.to}
              target="_blank"
              rel="noreferrer"
              onClick={onNavigate}
              className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm ring-1 transition bg-zinc-900/40 ring-zinc-700/60 hover:bg-zinc-900/70 text-zinc-300`}
            >
              <span>{n.icon}</span>
              <span>{n.label}</span>
            </a>
          ) : (
            <Link
              key={n.label}
              to={n.to}
              onClick={onNavigate}
              className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm ring-1 transition ${
                active
                  ? 'bg-zinc-900/70 ring-mana-500/50 text-mana-200 shadow-glow'
                  : 'bg-zinc-900/40 ring-zinc-700/60 hover:bg-zinc-900/70 text-zinc-300'
              }`}
            >
              <span>{n.icon}</span>
              <span>{n.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="mt-4 pt-4 border-t border-zinc-800/60">
        <WalletConnectButton />
        <div className="mt-3 grid grid-cols-5 gap-2 text-lg text-zinc-300">
          {['✉️', '⚙️', '🧭', '🌐', '📊'].map((i) => (
            <button key={i} className="rounded-md bg-zinc-900/60 ring-1 ring-zinc-700/60 py-1 hover:ring-mana-500/50 transition">{i}</button>
          ))}
        </div>
      </div>
    </div>
  )
}

