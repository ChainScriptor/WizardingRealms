import { useEffect, useMemo, useState } from 'react'
import { useCurrentAccount } from '@mysten/dapp-kit'
import { Checkins, computeStreak } from '@/utils/checkin'
import { achievementsAPI, userAPI } from '@/services/api'

type Ach = { id: string; title: string; desc?: string; threshold: number; xp?: number }

const ACHIEVEMENTS: Ach[] = [
  { id: 'streak-3', title: '3 Day Streak', threshold: 3, xp: 100 },
  { id: 'streak-7', title: '7 Day Streak', threshold: 7, xp: 200 },
  { id: 'streak-14', title: '14 Day Streak', threshold: 14, xp: 400 },
  { id: 'streak-30', title: '30 Day Streak', threshold: 30, xp: 800 },
  { id: 'streak-60', title: '60 Day Streak', threshold: 60, xp: 1500 },
  { id: 'streak-90', title: '90 Day Streak', threshold: 90, xp: 2500 },
  { id: 'streak-120', title: '120 Day Streak', threshold: 120, xp: 3500 },
  { id: 'streak-160', title: '160 Day Streak', threshold: 160, xp: 5000 },
  { id: 'streak-180', title: '180 Day Streak', threshold: 180, xp: 6000 },
  { id: 'streak-240', title: '240 Day Streak', threshold: 240, xp: 9000 },
  { id: 'streak-300', title: '300 Day Streak', threshold: 300, xp: 10000 }
]

export default function AchievementList({ checkins }: { checkins: Checkins }) {
  const currentAccount = useCurrentAccount()
  const walletAddress = currentAccount?.address || null
  const [streak, setStreak] = useState(0)
  const [unlockedAchievements, setUnlockedAchievements] = useState<Set<string>>(new Set())
  
  // Load current streak from MongoDB (calculated by backend)
  useEffect(() => {
    async function loadStreak() {
      if (!walletAddress) {
        // Fallback to local calculation if no wallet
        setStreak(computeStreak(checkins))
        return
      }
      try {
        const user = await userAPI.getUser(walletAddress)
        setStreak(user.currentStreak || 0)
      } catch (error) {
        console.error('Error loading streak:', error)
        // Fallback to local calculation
        setStreak(computeStreak(checkins))
      }
    }
    loadStreak()
  }, [walletAddress, checkins])

  // Load unlocked achievements
  useEffect(() => {
    async function loadAchievements() {
      if (!walletAddress) return
      try {
        const data = await achievementsAPI.getAchievements(walletAddress)
        setUnlockedAchievements(new Set(data.unlockedAchievements || []))
      } catch (error) {
        console.error('Error loading achievements:', error)
      }
    }
    loadAchievements()
  }, [walletAddress])

  // Auto-unlock achievements when streak threshold is reached
  useEffect(() => {
    async function checkAndUnlock() {
      if (!walletAddress) return

      for (const achievement of ACHIEVEMENTS) {
        if (streak >= achievement.threshold && !unlockedAchievements.has(achievement.id)) {
          try {
            await achievementsAPI.unlockAchievement(walletAddress, achievement.id, achievement.xp || 0)
            setUnlockedAchievements((prev) => new Set([...prev, achievement.id]))
            console.log(`Unlocked achievement: ${achievement.title}`)
          } catch (error) {
            console.error(`Error unlocking achievement ${achievement.id}:`, error)
          }
        }
      }
    }
    checkAndUnlock()
  }, [streak, walletAddress, unlockedAchievements])

  return (
    <div className="rounded-xl bg-zinc-900/70 ring-1 ring-zinc-700/60 p-4">
      <div className="font-semibold mb-3">Achievements</div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {ACHIEVEMENTS.map((a, index) => {
          const unlocked = unlockedAchievements.has(a.id) || streak >= a.threshold
          const badgeNumber = index + 2 // 2.png, 3.png, ..., 13.png
          return (
            <div
              key={a.id}
              className={`rounded-xl p-4 ring-1 transition relative flex flex-col items-center ${
                unlocked ? 'bg-zinc-800/60 ring-emerald-500/60 shadow-[0_0_20px_rgba(16,185,129,0.25)]' : 'bg-zinc-800/40 ring-zinc-700/60 opacity-90'
              }`}
            >
              {/* Badge Image */}
              <div className="flex justify-center mb-3">
                <img
                  src={`/${badgeNumber}.png`}
                  alt={`Badge ${badgeNumber}`}
                  className={`w-20 h-20 object-contain ${unlocked ? 'opacity-100' : 'opacity-60'}`}
                />
              </div>
              {/* Day Streak Title - Centered */}
              <div className="text-center mb-2">
                <div className="font-semibold">{a.title}</div>
              </div>
              {/* Status and XP */}
              <div className="flex items-center justify-between w-full mt-auto">
                <div className={`text-xs ${unlocked ? 'text-emerald-400' : 'text-zinc-400'}`}>
                  {unlocked ? 'Unlocked' : `${streak}/${a.threshold}`}
                </div>
                {a.xp && <div className="text-xs text-amber-300">+{a.xp.toLocaleString()} XP</div>}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

