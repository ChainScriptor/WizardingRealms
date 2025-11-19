import { useState } from 'react'

export default function SwapWidget() {
  const [pay, setPay] = useState('1')
  const rate = 131.8332679 // placeholder
  const get = Number(pay || 0) * rate

  return (
    <div className="rounded-xl bg-zinc-900/70 ring-1 ring-zinc-700/60 p-4">
      <div className="flex items-center justify-between">
        <div className="font-semibold">Swap</div>
        <div className="text-xs text-zinc-400">r: {rate.toFixed(2)}</div>
      </div>

      <div className="mt-4 space-y-3">
        <div className="rounded-lg bg-zinc-800/60 p-3 ring-1 ring-zinc-700/60">
          <div className="text-xs text-zinc-400 mb-1">You pay</div>
          <div className="flex items-center gap-3">
            <input
              value={pay}
              onChange={(e) => setPay(e.target.value)}
              className="w-full bg-transparent outline-none text-lg"
              placeholder="0.0"
            />
            <div className="text-sm px-2 py-1 rounded-md bg-zinc-900/60 ring-1 ring-zinc-700/60">SUI</div>
          </div>
          <div className="mt-2 flex gap-2 text-xs">
            {[25, 50, 75, 100].map((p) => (
              <button key={p} className="px-2 py-1 rounded-md bg-zinc-900/60 ring-1 ring-zinc-700/60 hover:ring-mana-500/50 transition">{p}%</button>
            ))}
          </div>
        </div>

        <div className="grid place-items-center">
          <span className="text-zinc-400">↓</span>
        </div>

        <div className="rounded-lg bg-zinc-800/60 p-3 ring-1 ring-zinc-700/60">
          <div className="text-xs text-zinc-400 mb-1">You get</div>
          <div className="flex items-center gap-3">
            <div className="w-full text-lg font-mono">{get ? get.toFixed(6) : '0.000000'}</div>
            <div className="text-sm px-2 py-1 rounded-md bg-zinc-900/60 ring-1 ring-zinc-700/60">WIZ</div>
          </div>
          <div className="mt-1 text-xs text-zinc-400">$ {(Number(pay || 0) * 1.64).toFixed(2)} • +0.23%</div>
        </div>

        <button
          className="mt-2 w-full rounded-lg bg-gradient-to-r from-mana-600 via-pink-500 to-amber-500 px-4 py-2 font-semibold text-zinc-900 hover:opacity-90 transition shadow-glow"
        >
          Swap
        </button>
      </div>
    </div>
  )
}

