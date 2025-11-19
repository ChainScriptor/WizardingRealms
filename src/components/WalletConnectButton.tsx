import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export default function WalletConnectButton() {
  const [ConnectButton, setConnectButton] = useState<any>(null)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const lib = '@mysten' + '/dapp-kit'
        // @ts-expect-error
        const mod = await import(/* @vite-ignore */ lib)
        if (!mounted) return
        setConnectButton(() => (mod as any).ConnectButton)
        // styles best-effort
        try {
          const cssPath = '@mysten' + '/dapp-kit/dist/index.css'
          // @ts-expect-error
          await import(/* @vite-ignore */ cssPath)
        } catch {}
      } catch (e) {
        // module not installed; render fallback
      }
    })()
    return () => {
      mounted = false
    }
  }, [])

  return (
    <motion.div
      initial={{ filter: 'brightness(0.8)', opacity: 0, y: -6 }}
      animate={{ filter: 'brightness(1)', opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="relative"
    >
      <div
        className="pointer-events-none absolute -inset-1 rounded-xl opacity-70 blur-sm"
        style={{ background: 'radial-gradient(60% 60% at 50% 50%, rgba(63,173,255,0.35), rgba(0,0,0,0))' }}
      />
      {ConnectButton ? (
        <ConnectButton />
      ) : (
        <button
          title="Install @mysten/dapp-kit to enable Sui wallet connect"
          className="rounded-xl px-4 py-2 bg-zinc-900/60 ring-1 ring-zinc-700/60 text-zinc-300"
          disabled
        >
          Wallet (Sui)
        </button>
      )}
    </motion.div>
  )
}

