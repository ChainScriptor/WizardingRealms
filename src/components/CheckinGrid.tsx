import { useEffect, useMemo, useState } from 'react'
import { useCurrentAccount } from '@mysten/dapp-kit'
import { Checkins, checkToday, computeStreak, isChecked, loadCheckins, toggleDay } from '@/utils/checkin'
import { userAPI } from '@/services/api'

export default function CheckinGrid() {
  const currentAccount = useCurrentAccount()
  const walletAddress = currentAccount?.address || null
  const [checkins, setCheckins] = useState<Checkins>(new Set())
  const [loading, setLoading] = useState(true)
  const [totalCheckins, setTotalCheckins] = useState(0)
  const [currentStreak, setCurrentStreak] = useState(0)
  
  // Only render the actual checked-in days, oldest -> newest
  const sortedChecked = useMemo(() => {
    return Array.from(checkins).sort((a, b) => (a < b ? -1 : a > b ? 1 : 0))
  }, [checkins])
  
  // Load user stats from MongoDB
  useEffect(() => {
    async function loadStats() {
      if (!walletAddress) return
      try {
        const user = await userAPI.getUser(walletAddress)
        setTotalCheckins(user.totalCheckins || 0)
        setCurrentStreak(user.currentStreak || 0)
      } catch (error) {
        console.error('Error loading user stats:', error)
      }
    }
    loadStats()
  }, [walletAddress, checkins])

  useEffect(() => {
    async function load() {
      setLoading(true)
      const loaded = await loadCheckins(walletAddress)
      setCheckins(loaded)
      setLoading(false)
    }
    load()
  }, [walletAddress])

  async function handleCheck() {
    const updated = await checkToday(checkins, walletAddress)
    setCheckins(updated)
    
    // Reload stats from server after check-in
    if (walletAddress) {
      try {
        const user = await userAPI.getUser(walletAddress)
        setTotalCheckins(user.totalCheckins || 0)
        setCurrentStreak(user.currentStreak || 0)
      } catch (error) {
        console.error('Error reloading stats:', error)
      }
    }
  }

  async function handleToggle(day: string) {
    const updated = await toggleDay(checkins, day, walletAddress)
    setCheckins(updated)
    
    // Reload stats from server after toggle
    if (walletAddress) {
      try {
        const user = await userAPI.getUser(walletAddress)
        setTotalCheckins(user.totalCheckins || 0)
        setCurrentStreak(user.currentStreak || 0)
      } catch (error) {
        console.error('Error reloading stats:', error)
      }
    }
  }

  return (
    <div className="rounded-xl bg-zinc-900/70 ring-1 ring-zinc-700/60 p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="font-semibold">Check-ins</div>
        <div className="flex items-center gap-4 text-sm">
          <div className="text-zinc-400">
            Total: <span className="font-semibold text-white">{totalCheckins}</span>
          </div>
          <div className="text-zinc-400">
            Streak: <span className="font-semibold text-emerald-400">{currentStreak}</span> days
          </div>
        </div>
      </div>
      <div className="mt-3 text-sm text-zinc-300">
        Κάνε daily check-in για να διατηρήσεις το streak σου! Αν χάσεις μια μέρα, το streak μηδενίζεται.
        <br />
        <span className="text-xs text-zinc-400">Total: Συνολικός αριθμός check-ins | Streak: Συνεχόμενες μέρες (μηδενίζεται αν λείπει μια μέρα)</span>
      </div>
      <div className="mt-3 grid grid-cols-8 sm:grid-cols-10 md:grid-cols-12 lg:grid-cols-14 gap-2">
        {loading ? (
          <div className="text-sm text-zinc-400">Loading check-ins...</div>
        ) : (
          sortedChecked.map((d, idx) => (
            <button
              key={d}
              onClick={() => handleToggle(d)}
              className="h-8 rounded-md text-xs font-semibold transition bg-emerald-600/90 ring-1 ring-emerald-400 text-emerald-50 hover:opacity-90"
              title={d}
            >
              {idx + 1}
            </button>
          ))
        )}
      </div>
      <div className="mt-4">
        <button onClick={handleCheck} className="rounded-lg bg-gradient-to-r from-mana-600 to-amber-500 px-4 py-2 font-semibold text-zinc-900 shadow-glow hover:opacity-90 transition">
          Check-in for today
        </button>
      </div>
    </div>
  )
}

