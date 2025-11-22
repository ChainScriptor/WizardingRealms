import { useEffect, useMemo, useState } from 'react'
import { useCurrentAccount } from '@mysten/dapp-kit'
import { achievementsAPI } from '@/services/api'

type InviteBadge = {
  id: string
  name: string
  needed: number
  xp: number
  icon: 'user' | 'group' | 'compass' | 'sword' | 'diamond' | 'shield' | 'galactic'
}

const BADGES: InviteBadge[] = [
  { id: 'friendly', name: 'Friendly Inviter', needed: 1, xp: 500, icon: 'user' },
  { id: 'power', name: 'Power Inviter', needed: 2, xp: 500, icon: 'group' },
  { id: 'bronze', name: 'Bronze Inviter', needed: 5, xp: 1000, icon: 'group' },
  { id: 'silver', name: 'Silver Inviter', needed: 10, xp: 2000, icon: 'compass' },
  { id: 'gold', name: 'Gold Inviter', needed: 25, xp: 2500, icon: 'sword' },
  { id: 'diamond', name: 'Diamond Inviter', needed: 50, xp: 3000, icon: 'diamond' },
  { id: 'platinum', name: 'Platinum Inviter', needed: 75, xp: 3000, icon: 'shield' },
  { id: 'galactic', name: 'Galactic Inviter', needed: 100, xp: 6000, icon: 'galactic' },
]

function Icon({ type, className }: { type: InviteBadge['icon']; className?: string }) {
  switch (type) {
    case 'user':
      return <svg viewBox="0 0 24 24" fill="currentColor" className={className}><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 4-6 8-6s8 2 8 6"/></svg>
    case 'group':
      return <svg viewBox="0 0 24 24" fill="currentColor" className={className}><circle cx="8" cy="8" r="3"/><circle cx="16" cy="8" r="3"/><path d="M2 20c0-3 3-5 6-5"/><path d="M22 20c0-3-3-5-6-5"/></svg>
    case 'compass':
      return <svg viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M12 2a10 10 0 100 20 10 10 0 000-20zm3 5l-3 7-7 3 3-7 7-3z"/></svg>
    case 'sword':
      return <svg viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M21 3l-8 8-2-2 8-8 2 2z"/><path d="M7 11l-5 10 10-5 5-5-5-5-5 5z"/></svg>
    case 'diamond':
      return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={className}><path d="M3 8l9-6 9 6-9 12-9-12z"/><path d="M3 8h18M12 2l3 6-3 12-3-12 3-6z"/></svg>
    case 'shield':
      return <svg viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M12 2l8 4v6c0 5-3.4 8.2-8 10-4.6-1.8-8-5-8-10V6l8-4z"/></svg>
    case 'galactic':
      return <svg viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M12 2c4 1 7 4 8 8-2 1-4 2-6 2l-2 6c-2 0-4-1-6-3 2-1 3-3 3-5 0-3 1-6 3-8z"/><circle cx="15" cy="7" r="1.5"/></svg>
  }
}

export default function InviteBadges({ invitedCount = 0 }: { invitedCount?: number }) {
  const currentAccount = useCurrentAccount()
  const walletAddress = currentAccount?.address || null
  const [unlockedBadges, setUnlockedBadges] = useState<Set<string>>(new Set())

  // Load unlocked badges from MongoDB
  useEffect(() => {
    async function loadBadges() {
      if (!walletAddress) return
      try {
        const data = await achievementsAPI.getAchievements(walletAddress)
        setUnlockedBadges(new Set(data.unlockedInviteBadges || []))
      } catch (error) {
        console.error('Error loading invite badges:', error)
      }
    }
    loadBadges()
  }, [walletAddress])

  // Calculate which badges should be unlocked based on invitedCount
  const shouldBeUnlocked = useMemo(() => {
    return new Set(BADGES.filter((b) => invitedCount >= b.needed).map((b) => b.id))
  }, [invitedCount])

  // Auto-unlock badges when threshold is reached
  useEffect(() => {
    async function checkAndUnlock() {
      if (!walletAddress) return

      for (const badge of BADGES) {
        if (invitedCount >= badge.needed && !unlockedBadges.has(badge.id)) {
          try {
            await achievementsAPI.unlockInviteBadge(walletAddress, badge.id, badge.xp)
            setUnlockedBadges((prev) => new Set([...prev, badge.id]))
            console.log(`Unlocked invite badge: ${badge.name}`)
          } catch (error) {
            console.error(`Error unlocking invite badge ${badge.id}:`, error)
          }
        }
      }
    }
    checkAndUnlock()
  }, [invitedCount, walletAddress, unlockedBadges])

  // Use unlocked badges from DB, fallback to calculated if not loaded yet
  const unlockedIds = useMemo(() => {
    if (unlockedBadges.size > 0) {
      return unlockedBadges
    }
    return shouldBeUnlocked
  }, [unlockedBadges, shouldBeUnlocked])

  return (
    <div className="rounded-xl bg-zinc-900/70 ring-1 ring-zinc-700/60 p-4">
      <div className="flex items-center justify-between">
        <div className="font-semibold">Circle Expander</div>
        <div className="text-sm text-amber-300">{invitedCount} invited</div>
      </div>
      <div className="mt-3 grid gap-6 md:grid-cols-3 lg:grid-cols-4">
        {BADGES.map((b) => {
          const unlocked = unlockedIds.has(b.id)
          return (
            <div key={b.id} className="flex flex-col items-center gap-2">
              <div
                className={`grid place-items-center rounded-full w-20 h-20 shadow-xl ${unlocked ? 'bg-zinc-700' : 'bg-zinc-800/70'}`}
              >
                <Icon type={b.icon} className={`w-8 h-8 ${unlocked ? 'text-white' : 'text-zinc-400'}`} />
              </div>
              <div className="text-sm font-semibold text-white text-center">{b.name}</div>
              <div className="flex items-center gap-1 rounded-full bg-zinc-800/70 px-3 py-1 text-xs text-amber-300 ring-1 ring-zinc-700/60">
                <span role="img" aria-label="coin">🪙</span> +{b.xp.toLocaleString()} XP
              </div>
              <div className="text-xs text-zinc-400">Invite {b.needed}+ friends</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}


