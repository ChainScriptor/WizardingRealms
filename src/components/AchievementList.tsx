import { useMemo } from 'react'
import { Checkins, computeStreak } from '@/utils/checkin'

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
  const streak = useMemo(() => computeStreak(checkins), [checkins])

  return (
    <div className="rounded-xl bg-zinc-900/70 ring-1 ring-zinc-700/60 p-4">
      <div className="font-semibold mb-3">Achievements</div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {ACHIEVEMENTS.map((a) => {
          const unlocked = streak >= a.threshold
          return (
            <div
              key={a.id}
              className={`rounded-xl p-4 ring-1 transition ${
                unlocked ? 'bg-zinc-800/60 ring-emerald-500/60 shadow-[0_0_20px_rgba(16,185,129,0.25)]' : 'bg-zinc-800/40 ring-zinc-700/60 opacity-90'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="font-semibold">{a.title}</div>
                <div className={`text-xs ${unlocked ? 'text-emerald-400' : 'text-zinc-400'}`}>{unlocked ? 'Unlocked' : `${streak}/${a.threshold}`}</div>
              </div>
              {a.xp && <div className="mt-1 text-xs text-amber-300">+{a.xp.toLocaleString()} XP</div>}
            </div>
          )
        })}
      </div>
    </div>
  )
}

