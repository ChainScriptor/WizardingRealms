export default function PriceInfoPanel() {
  return (
    <div className="rounded-xl bg-zinc-900/70 ring-1 ring-zinc-700/60 p-4">
      <div className="font-semibold mb-2">Price Information</div>
      <div className="space-y-2 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-zinc-400">SUI</span>
          <span>$1.64 <span className="text-rose-400 text-xs">-0.23%</span></span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-zinc-400">WIZ</span>
          <span>$0.012 <span className="text-emerald-400 text-xs">+3.3%</span></span>
        </div>
        <div className="pt-2 border-t border-zinc-800/60 text-xs text-zinc-400">
          Minimum received • 127.001937 WIZ
        </div>
      </div>
    </div>
  )
}

