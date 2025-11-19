type Tab = { key: string; label: string }

export default function Tabs({
  tabs,
  active,
  onChange
}: {
  tabs: Tab[]
  active: string
  onChange: (k: string) => void
}) {
  return (
    <div className="rounded-xl bg-zinc-900/70 ring-1 ring-zinc-700/60 p-1 grid grid-cols-3 text-sm">
      {tabs.map((t) => {
        const is = t.key === active
        return (
          <button
            key={t.key}
            onClick={() => onChange(t.key)}
            className={`rounded-lg px-3 py-2 transition ${
              is ? 'bg-zinc-800 ring-1 ring-mana-500/50 text-mana-200 shadow-glow' : 'hover:bg-zinc-800/60 text-zinc-300'
            }`}
          >
            {t.label}
          </button>
        )
      })}
    </div>
  )
}

