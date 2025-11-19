import { useEffect, useMemo, useState } from 'react'
import { Checkins, checkToday, computeStreak, isChecked, loadCheckins, toggleDay } from '@/utils/checkin'

export default function CheckinGrid() {
  const [checkins, setCheckins] = useState<Checkins>(new Set())
  // Only render the actual checked-in days, oldest -> newest
  const sortedChecked = useMemo(() => {
    return Array.from(checkins).sort((a, b) => (a < b ? -1 : a > b ? 1 : 0))
  }, [checkins])
  const streak = useMemo(() => computeStreak(checkins), [checkins])

  useEffect(() => {
    setCheckins(loadCheckins())
  }, [])

  function handleCheck() {
    setCheckins((c) => checkToday(c))
  }

  return (
    <div className="rounded-xl bg-zinc-900/70 ring-1 ring-zinc-700/60 p-4">
      <div className="flex items-center justify-between">
        <div className="font-semibold">Check-ins</div>
        <div className="text-sm text-zinc-400">Streak: <span className="font-semibold text-emerald-400">{streak}</span> days</div>
      </div>
      <div className="mt-3 text-sm text-zinc-300">Κάθε πάτημα στο "Check‑in for today" προσθέτει άλλη μία μέρα. Μπορείς να πατήσεις σε τετράγωνο για να το αφαιρέσεις.</div>
      <div className="mt-3 grid grid-cols-8 sm:grid-cols-10 md:grid-cols-12 lg:grid-cols-14 gap-2">
        {sortedChecked.map((d, idx) => (
          <button
            key={d}
            onClick={() => setCheckins((c) => toggleDay(c, d))}
            className="h-8 rounded-md text-xs font-semibold transition bg-emerald-600/90 ring-1 ring-emerald-400 text-emerald-50 hover:opacity-90"
            title={d}
          >
            {idx + 1}
          </button>
        ))}
      </div>
      <div className="mt-4">
        <button onClick={handleCheck} className="rounded-lg bg-gradient-to-r from-mana-600 to-amber-500 px-4 py-2 font-semibold text-zinc-900 shadow-glow hover:opacity-90 transition">
          Check-in for today
        </button>
      </div>
    </div>
  )
}

