import { useMemo, useState } from 'react'
import { createPortal } from 'react-dom'

type SupporterBadge = {
  id: string
  name: string
  xp: number
  color: string // circle bg
  icon: 'hand' | 'bolt' | 'medal' | 'diamond' | 'crown' | 'rocket' | 'mythic' | 'legend'
  requiredSui: number
}

const BADGES: SupporterBadge[] = [
  { id: 'helping-paw', name: 'Helping Paw', xp: 1000, color: '#10B981', icon: 'hand', requiredSui: 1 },
  { id: 'awesome-suppawter', name: 'Awesome Suppawter', xp: 3000, color: '#3B82F6', icon: 'bolt', requiredSui: 3 },
  { id: 'golden-pawtato', name: 'Golden Pawtato', xp: 5000, color: '#F59E0B', icon: 'medal', requiredSui: 5 },
  { id: 'diamond-pawtato', name: 'Diamond Pawtato', xp: 6000, color: '#9CA3AF', icon: 'diamond', requiredSui: 10 },
  { id: 'platinum-pawtato', name: 'Platinum Pawtato', xp: 10500, color: '#9CA3AF', icon: 'crown', requiredSui: 25 },
  { id: 'galactic-pawtato', name: 'Galactic Pawtato', xp: 15000, color: '#6B7280', icon: 'rocket', requiredSui: 50 },
  { id: 'mythic-pawtato', name: 'Mythic Pawtato', xp: 17500, color: '#6B7280', icon: 'mythic', requiredSui: 75 },
  { id: 'legendary-pawtato', name: 'Legendary Pawtato', xp: 20000, color: '#6B7280', icon: 'legend', requiredSui: 100 },
]

function Icon({ type, className }: { type: SupporterBadge['icon']; className?: string }) {
  switch (type) {
    case 'hand':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
          <path d="M8 13V7a2 2 0 1 1 4 0v4" />
          <path d="M12 11V6a2 2 0 1 1 4 0v5" />
          <path d="M16 10V8a2 2 0 1 1 4 0v6a6 6 0 0 1-6 6H9a6 6 0 0 1-6-6v-2a2 2 0 0 1 4 0" />
        </svg>
      )
    case 'bolt':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
          <path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z" />
        </svg>
      )
    case 'medal':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
          <circle cx="12" cy="8" r="5" />
          <path d="M8 13l-2 9 6-4 6 4-2-9" />
        </svg>
      )
    case 'diamond':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={className}>
          <path d="M3 9l9-7 9 7-9 13-9-13z" />
          <path d="M3 9h18" />
          <path d="M12 2l3 7-3 13-3-13 3-7z" />
        </svg>
      )
    case 'crown':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
          <path d="M3 7l4 4 5-7 5 7 4-4v10H3z" />
        </svg>
      )
    case 'rocket':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
          <path d="M12 2c4 1 7 4 8 8-2 1-4 2-6 2l-2 6c-2 0-4-1-6-3 2-1 3-3 3-5 0-3 1-6 3-8z" />
          <circle cx="14.5" cy="7.5" r="1.5" />
        </svg>
      )
    case 'mythic':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
          <path d="M12 2l3 6 6 1-4 4 1 6-6-3-6 3 1-6-4-4 6-1z" />
        </svg>
      )
    case 'legend':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
          <path d="M4 20l8-18 8 18-8-4-8 4z" />
        </svg>
      )
  }
}

export default function SupporterBadges({ unlockedIds = [] as string[] }: { unlockedIds?: string[] }) {
  const unlockedSet = useMemo(() => new Set(unlockedIds), [unlockedIds])
  const [selected, setSelected] = useState<SupporterBadge | null>(null)

  return (
    <div className="rounded-xl bg-zinc-900/70 ring-1 ring-zinc-700/60 p-4">
      <div className="flex items-center justify-between">
        <div className="font-semibold">Wizarding Supporter</div>
      </div>
      <div className="mt-3 grid gap-6 md:grid-cols-3 lg:grid-cols-4">
        {BADGES.map((b) => {
          const unlocked = unlockedSet.has(b.id)
          return (
            <button
              key={b.id}
              type="button"
              onClick={() => setSelected(b)}
              className="flex flex-col items-center gap-3 focus:outline-none"
            >
              <div
                className="relative grid place-items-center rounded-full shadow-xl"
                style={{
                  width: 88,
                  height: 88,
                  background: b.color,
                  boxShadow: unlocked
                    ? '0 0 0 4px rgba(16,185,129,0.35), 0 10px 30px rgba(0,0,0,0.35)'
                    : '0 10px 30px rgba(0,0,0,0.35)',
                }}
              >
                <Icon
                  type={b.icon}
                  className={`w-8 h-8 ${b.icon === 'diamond' ? 'text-zinc-200' : 'text-black/80'}`}
                />
                {unlocked && (
                  <div className="absolute -right-2 -bottom-2 h-7 w-7 rounded-full bg-emerald-600 grid place-items-center ring-4 ring-zinc-900">
                    <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" className="w-4 h-4">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  </div>
                )}
              </div>
              <div className="text-sm font-semibold text-white text-center">{b.name}</div>
              {b.xp > 0 && (
                <div className="flex items-center gap-1 rounded-full bg-zinc-800/70 px-3 py-1 text-xs text-amber-300 ring-1 ring-zinc-700/60">
                  <span role="img" aria-label="coin">🪙</span>
                  +{b.xp.toLocaleString()} XP
                </div>
              )}
            </button>
          )
        })}
      </div>
      {selected &&
        createPortal(
          <div
            className="fixed inset-0 z-[220] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
            onClick={() => setSelected(null)}
          >
            <div
              className="w-full max-w-md rounded-2xl border border-zinc-700 bg-zinc-950 p-5 shadow-2xl text-white"
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
            >
              <div className="text-center mb-4">
                <div className="inline-flex items-center justify-center mb-3">
                  <div
                    className="grid place-items-center rounded-full"
                    style={{ width: 72, height: 72, background: selected.color }}
                  >
                    <Icon type={selected.icon} className="w-8 h-8 text-black/80" />
                  </div>
                </div>
                <h3 className="text-xl font-bold">{selected.name}</h3>
                <p className="mt-2 text-sm text-zinc-400">
                  Contribute {selected.requiredSui} SUI to support Wizarding Realms and unlock this badge.
                </p>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-zinc-900 ring-1 ring-zinc-800 px-4 py-3">
                <div className="text-sm text-zinc-300">Requirement</div>
                <div className="text-sm font-semibold"> {selected.requiredSui} SUI</div>
              </div>
              <div className="mt-2 flex items-center justify-between rounded-xl bg-zinc-900 ring-1 ring-zinc-800 px-4 py-3">
                <div className="text-sm text-zinc-300">Reward</div>
                <div className="text-sm font-semibold text-amber-300">+{selected.xp.toLocaleString()} XP</div>
              </div>
              <div className="mt-5 flex justify-end">
                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  className="rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm text-zinc-200 hover:bg-zinc-800"
                >
                  Close
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  )
}


