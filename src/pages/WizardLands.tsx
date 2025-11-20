import { useState } from 'react'
import { Link } from 'react-router-dom'

// Primary background from public root and a fallback asset
// Place your file at: public/background.jpg
const BG_PRIMARY = '/background.jpg'
const BG_FALLBACK = '/assets/wizard-lands-bg.jpg'
const WASM_GAME_URL =
  import.meta.env.VITE_WASM_GAME_URL ?? 'http://localhost:8080/web/'

export default function WizardLands() {
  const [gameOpen, setGameOpen] = useState(false)

  const handlePlay = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    setGameOpen(true)
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${BG_PRIMARY}), url(${BG_FALLBACK})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-black/20" />

      {/* Top wood-like bar */}
      <div className="relative z-10">
        <div className="mx-auto max-w-7xl px-4 pt-4">
          <div className="rounded-2xl bg-gradient-to-b from-zinc-900/80 to-zinc-900/50 ring-1 ring-zinc-700/60 px-3 py-2 flex items-center justify-between">
            <Link to="/" className="text-sm rounded-lg bg-zinc-800/60 px-3 py-1 ring-1 ring-zinc-700/60 hover:ring-mana-500/50 transition">
              ← Back to Board
            </Link>
            <div className="font-wizard text-xl glow-text">Wizard Lands • Genesis</div>
            <a
              href={WASM_GAME_URL}
              onClick={handlePlay}
              className="rounded-lg bg-gradient-to-r from-mana-600 to-amber-500 px-4 py-1.5 text-zinc-900 font-semibold shadow-glow"
            >
              Play
            </a>
          </div>
        </div>
      </div>

      {/* Center CTA card */}
      <div className="relative z-10">
        <div className="mx-auto max-w-7xl px-4 py-16">
          <div className="grid place-items-center">
            <div className="rounded-2xl bg-zinc-900/80 backdrop-blur-md ring-1 ring-zinc-700/60 px-8 py-6 text-center shadow-xl">
              <div className="text-lg font-semibold">WIZ IS LIVE</div>
              <a
                href="#"
                className="mt-4 inline-flex rounded-xl bg-gradient-to-r from-mana-600 via-pink-500 to-amber-500 px-6 py-3 font-semibold text-zinc-900 shadow-glow"
              >
                Trade now
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom toolbar */}
      <div className="absolute inset-x-0 bottom-4 z-10">
        <div className="mx-auto max-w-5xl px-4">
          <div className="grid grid-cols-8 gap-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <button
                key={i}
                className="h-14 rounded-xl bg-zinc-900/80 ring-1 ring-zinc-700/60 hover:ring-mana-500/50 transition"
                title={`Action ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {gameOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4">
          <div className="relative w-full max-w-5xl aspect-video rounded-2xl overflow-hidden ring-2 ring-mana-500/70 shadow-glow">
            <iframe
              src={WASM_GAME_URL}
              title="Wizard Lands WASM Game"
              className="h-full w-full border-0 bg-black"
              allow="fullscreen"
            />
            <button
              onClick={() => setGameOpen(false)}
              className="absolute top-3 right-3 rounded-full bg-black/70 px-3 py-1 text-sm font-semibold text-white hover:bg-black/90 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

