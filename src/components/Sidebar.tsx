import { Link, useLocation } from 'react-router-dom'
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { AIVoiceInput } from '@/components/ui/ai-voice-input'

const nav = [
  { to: '/', label: 'Dashboard', icon: '🏰' },
  { to: '/swap', label: 'Swap', icon: '🔄' },
  { to: '/bridge', label: 'Bridge', icon: '🌉' },
  { to: '/wizard-lands', label: 'Wizard Lands', icon: '🧙‍♂️', external: true },
  { to: '/achievements', label: 'Achievements', icon: '🏆' },
  { to: '/you-found-me', label: 'You Found Me', icon: '👁️' },
  { to: '/coins', label: 'Coins', icon: '🪙' },
  { to: '/leaderboard', label: 'Leaderboard', icon: '🏆' },
  { to: '/invite', label: 'Invite a Friend', icon: '🪄' }
]

export default function Sidebar() {
  const loc = useLocation()
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Mobile toggle */}
      <div className="md:hidden sticky top-[56px] z-40 bg-parchment-900/80 backdrop-blur-sm border-b border-zinc-800/60">
        <div className="px-4 py-2 flex items-center justify-between">
          <div className="font-wizard">Menu</div>
          <button onClick={() => setOpen((v) => !v)} className="px-3 py-1 rounded-md bg-zinc-800/70 ring-1 ring-zinc-700">
            {open ? 'Close' : 'Open'}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {(open || typeof window === 'undefined') && (
          <motion.aside
            initial={{ x: -240, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -240, opacity: 0 }}
            transition={{ type: 'tween', duration: 0.25 }}
            className="md:hidden fixed z-40 left-0 top-0 bottom-0 w-64 bg-gradient-to-b from-parchment-900 to-parchment-800/90 border-r border-zinc-800/60 p-2"
          >
            <SidebarInner activePath={loc.pathname} onNavigate={() => setOpen(false)} />
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Desktop */}
      <aside className="hidden md:flex md:flex-col md:w-64 md:shrink-0 bg-gradient-to-b from-parchment-900 to-parchment-800/90 border-r border-zinc-800/60 p-2 relative z-20">
        <SidebarInner activePath={loc.pathname} />
      </aside>
    </>
  )
}

function SidebarInner({ activePath, onNavigate }: { activePath: string; onNavigate?: () => void }) {
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Ensure audio is loaded on mount
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.load()
    }
  }, [])

  const handleVoiceStart = () => {
    // Play voice sound when button is clicked
    if (audioRef.current) {
      audioRef.current.currentTime = 0
      audioRef.current.volume = 1.0
      const playPromise = audioRef.current.play()
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log('Audio playing')
          })
          .catch((err) => {
            console.error('Error playing audio:', err)
            // Try to load and play again
            audioRef.current?.load()
            audioRef.current?.play().catch((e) => console.error('Retry failed:', e))
          })
      }
    } else {
      console.error('Audio ref is null')
    }
  }

  const handleVoiceStop = () => {
    // Stop audio when button is clicked again
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      console.log('Audio stopped')
    }
  }

  return (
    <div className="flex h-full flex-col">
      <div className="mb-1">
        <div className="font-wizard text-xl glow-text">Wizard Panel</div>
        <div className="text-xs text-zinc-400">v0.1 • demo</div>
      </div>

      {/* Profile Video */}
      <div className="mb-1">
        <video
          src="/video2.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-auto rounded-xl"
        />
      </div>

      {/* Promo card */}
      <div className="mb-1 rounded-xl p-2 bg-gradient-to-br from-zinc-900 via-zinc-900/70 to-zinc-800 ring-1 ring-zinc-700/60">
        <div className="text-xs text-amber-300 font-semibold">WIZ IS LIVE!</div>
        <div className="mt-0.5 text-sm text-zinc-300">Claim via TGE Portal</div>
        <a
          href="#"
          className="mt-1 inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-mana-600 to-amber-500 px-2 py-1 text-zinc-900 font-semibold shadow-glow text-xs"
        >
          TGE Portal
        </a>
      </div>

      <nav className="flex-1 space-y-3 overflow-y-auto pr-1">
        {nav.map((n) => {
          const active = activePath === n.to
          return n.external ? (
            <a
              key={n.label}
              href={n.to}
              target="_blank"
              rel="noreferrer"
              onClick={onNavigate}
              className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-sm ring-1 transition bg-zinc-900/40 ring-zinc-700/60 hover:bg-zinc-900/70 text-zinc-300`}
            >
              <span>{n.icon}</span>
              <span>{n.label}</span>
            </a>
          ) : (
            <Link
              key={n.label}
              to={n.to}
              onClick={onNavigate}
              className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-sm ring-1 transition ${
                active
                  ? 'bg-zinc-900/70 ring-mana-500/50 text-mana-200 shadow-glow'
                  : 'bg-zinc-900/40 ring-zinc-700/60 hover:bg-zinc-900/70 text-zinc-300'
              }`}
            >
              <span>{n.icon}</span>
              <span>{n.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Sidebar image right after Invite a Friend */}
      <div className="mt-0.5 flex items-center justify-center">
        <img
          src="/sidebar.png"
          alt="Sidebar decoration"
          className="w-full h-auto object-contain max-h-[200px]"
        />
      </div>

      {/* AI Voice Input */}
      <div className="mt-1 mb-1">
        <AIVoiceInput
          onStart={handleVoiceStart}
          onStop={handleVoiceStop}
          visualizerBars={20}
          className="py-1"
        />
        <audio
          ref={audioRef}
          preload="auto"
          className="hidden"
          onError={(e) => {
            console.error('Audio error:', e)
          }}
          onLoadStart={() => {
            console.log('Audio loading started')
          }}
          onCanPlay={() => {
            console.log('Audio can play')
          }}
        >
          <source src="/voice.mp3" type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      </div>

      {/* Social Links */}
      <div className="mt-1 mb-0 flex flex-wrap items-center justify-center gap-1.5">
        <Button
          variant="outline"
          size="icon"
          asChild
          className="border-zinc-700/60 bg-zinc-900/40 hover:bg-zinc-900/70 hover:border-zinc-600/60"
        >
          <a
            href="https://discord.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center"
          >
            <img
              src="https://cdn.shadcnstudio.com/ss-assets/brand-logo/discord-icon.png?width=20&height=20&format=auto"
              alt="Discord Icon"
              className="size-5"
              onError={(e) => {
                // Fallback to a simple Discord icon if image fails
                e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMjAgMzE3LjU5MkMyMCAzMjIuMjQyIDIwIDMyNC41NjcgMTkuNTQyIDMyNi40NzlDMTkuMDQ2IDMyOC42MDggMTguMDAyIDMzMC41MzggMTYuNTI0IDMzMi4wMTZDMTUuMDQ2IDMzMy40OTQgMTMuMTE2IDMzNC41MzggMTAuOTg4IDMzNS4wMzRDOC44NjYgMzM1LjQ5MiA2LjU0MSAzMzUuNDkyIDEuODkxIDMzNS40OTJMMS4zMzMgMzM2LjA1SDYuNDQ0QzExLjA5NCAzMzYuMDUgMTMuNDE5IDMzNi4wNSAxNS41NDEgMzM1LjU5MkMxNy42NjkgMzM1LjA5NiAxOS41OTkgMzM0LjA1MiAyMS4wNzcgMzMyLjU3NEMyMi41NTUgMzMxLjA5NiAyMy41OTkgMzI5LjE2NiAyNC4wOTUgMzI3LjA0NEMyNC41NTMgMzI0LjkyMiAyNC41NTMgMzIyLjU5NyAyNC41NTMgMzE3Ljk0N1YxMTAuNDA4QzI0LjU1MyAxMDUuNzU4IDI0LjU1MyAxMDMuNDMzIDI0LjA5NSAxMDEuMzExQzIzLjU5OSA5OS4xODMgMjIuNTU1IDk3LjI1MyAyMS4wNzcgOTUuNzc1QzE5LjU5OSA5NC4yOTcgMTcuNjY5IDkzLjI1MyAxNS41NDEgOTIuNzU3QzEzLjQxOSA5Mi4zIDExLjA5NCA5Mi4zIDYuNDQ0IDkyLjNIMS4zMzNMMS44OTEgOTEuNzQyQzYuNTQxIDkxLjc0MiA4Ljg2NiA5MS43NDIgMTAuOTg4IDkyLjJDMTMuMTE2IDkyLjY5NiAxNS4wNDYgOTMuNzQgMTYuNTI0IDk1LjIxOEMxOC4wMDIgOTYuNjkgMTkuMDQ2IDk4LjYyIDE5LjU0MiAxMDAuNzQ4QzIwIDEwMi44NyAyMCAxMDUuMTk1IDIwIDExMC44NDVWMzE3LjU5MloiIGZpbGw9IiM1ODY1RjIiLz48L3N2Zz4='
              }}
            />
          </a>
        </Button>
        <Button
          variant="outline"
          size="icon"
          asChild
          className="border-zinc-700/60 bg-zinc-900/40 hover:bg-zinc-900/70 hover:border-zinc-600/60"
        >
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center"
          >
            <img
              src="https://cdn.shadcnstudio.com/ss-assets/brand-logo/twitter-icon.png?width=20&height=20&format=auto"
              alt="X Icon"
              className="size-5 dark:invert"
            />
          </a>
        </Button>
        <Button
          variant="outline"
          size="icon"
          asChild
          className="border-zinc-700/60 bg-zinc-900/40 hover:bg-zinc-900/70 hover:border-zinc-600/60"
        >
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center"
          >
            <img
              src="https://cdn.shadcnstudio.com/ss-assets/brand-logo/github-icon.png?width=20&height=20&format=auto"
              alt="GitHub Icon"
              className="size-5 dark:invert"
            />
          </a>
        </Button>
      </div>
    </div>
  )
}

