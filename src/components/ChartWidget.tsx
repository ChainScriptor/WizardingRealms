import { useMemo } from 'react'

export default function ChartWidget() {
  // Create a pseudo-random path for a placeholder chart
  const path = useMemo(() => {
    const w = 560
    const h = 260
    let d = `M0 ${h / 2}`
    let y = h / 2
    for (let x = 10; x <= w; x += 10) {
      y += (Math.random() - 0.5) * 20
      y = Math.max(20, Math.min(h - 20, y))
      d += ` L ${x} ${y}`
    }
    return d
  }, [])

  return (
    <div className="rounded-xl bg-zinc-900/70 ring-1 ring-zinc-700/60 p-3">
      <div className="flex items-center justify-between px-1 pb-2">
        <div className="font-semibold">WIZ / SUI</div>
        <div className="text-xs text-zinc-400">15m • demo</div>
      </div>
      <div className="relative h-[300px] w-full overflow-hidden rounded-lg bg-gradient-to-b from-zinc-950 to-zinc-900">
        <svg viewBox="0 0 560 260" width="100%" height="100%" preserveAspectRatio="none">
          <defs>
            <linearGradient id="line" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3a9bff" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#3a9bff" stopOpacity="0.05" />
            </linearGradient>
          </defs>
          <path d={path} fill="none" stroke="url(#line)" strokeWidth="2" />
        </svg>
      </div>
    </div>
  )
}

