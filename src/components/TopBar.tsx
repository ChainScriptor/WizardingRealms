import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useRef, useEffect } from 'react'
import WalletConnectButton from './WalletConnectButton'
import ManaParticles from './ManaParticles'

interface SuiPrice {
  price: number
  change24h: number
}

export default function TopBar() {
  const [showHelpModal, setShowHelpModal] = useState(false)
  const helpButtonRef = useRef<HTMLButtonElement>(null)
  const [suiPrice, setSuiPrice] = useState<SuiPrice>({ price: 1.6175, change24h: -3.29 })

  useEffect(() => {
    // Fetch SUI price - you can replace this with actual API call
    const fetchSuiPrice = async () => {
      try {
        // Example: Using CoinGecko API
        // const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=sui&vs_currencies=usd&include_24hr_change=true')
        // const data = await response.json()
        // setSuiPrice({ price: data.sui.usd, change24h: data.sui.usd_24h_change })
        
        // For now using mock data - update every 30 seconds
        const interval = setInterval(() => {
          // Simulate price updates
          setSuiPrice(prev => ({
            price: prev.price + (Math.random() - 0.5) * 0.01,
            change24h: prev.change24h + (Math.random() - 0.5) * 0.1
          }))
        }, 30000)
        
        return () => clearInterval(interval)
      } catch (error) {
        console.error('Error fetching SUI price:', error)
      }
    }

    fetchSuiPrice()
  }, [])

  return (
    <div className="sticky top-0 z-50 bg-gradient-to-b from-parchment-900/95 to-parchment-900/40 backdrop-blur-md border-b border-zinc-800/60">
      <div className="relative overflow-hidden">
        <ManaParticles count={22} />
        <div className="mx-auto max-w-[1920px] px-4 pt-1 pb-0 relative">
          {/* Spell Effect - Wave on bottom border */}
          <motion.div
            className="absolute bottom-0 left-0 pointer-events-none"
            style={{ width: '2px', height: '2px' }}
            animate={{
              x: ['1rem', 'calc(100% - 1rem)', '1rem']
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              times: [0, 0.5, 1],
              ease: ['easeOut', 'easeIn']
            }}
          >
            <div className="relative w-full h-full">
              {/* Thin wave beam on border */}
              <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-emerald-400/40 to-transparent blur-sm" />
              <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-24 h-0.5 bg-gradient-to-r from-transparent via-emerald-300/30 to-transparent" />
              {/* Center glow point */}
              <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-emerald-400/60 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
            </div>
          </motion.div>
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-4 -ml-4 md:ml-0" style={{ paddingLeft: '1rem' }}>
              <Link to="/" className="group inline-flex items-center gap-3">
                <motion.img
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6 }}
                  src="/logo.png"
                  alt="Wizarding Realms"
                  className="h-16 md:h-20 lg:h-24 w-auto object-contain"
                />
              </Link>
              {/* SUI Price Display */}
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900/60 ring-1 ring-zinc-700/60">
                <img src="/sui.png" alt="SUI" className="w-6 h-6 object-contain flex-shrink-0" />
                <span className="text-sm font-semibold text-white">SUI</span>
                <span className="text-sm font-semibold text-white">${suiPrice.price.toFixed(4)}</span>
                <span
                  className={`text-xs font-semibold ${
                    suiPrice.change24h >= 0 ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {suiPrice.change24h >= 0 ? '↑' : '↓'} {Math.abs(suiPrice.change24h).toFixed(2)}%
                </span>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-6 text-sm flex-1 justify-center">
              <div className="hidden md:flex items-center w-full max-w-md">
                <input
                  placeholder="Search for a creature, plot or relic..."
                  className="w-full rounded-lg bg-zinc-900/60 ring-1 ring-zinc-700/60 px-3 py-1.5 text-sm outline-none focus:ring-mana-500/60"
                />
              </div>
            </div>
            <div className="flex items-center gap-3 relative">
              <button
                ref={helpButtonRef}
                onClick={() => setShowHelpModal(true)}
                className="flex items-center justify-center w-10 h-10 rounded-lg bg-zinc-900/60 ring-1 ring-zinc-700/60 hover:bg-zinc-900/80 hover:ring-zinc-600/60 transition-all"
                aria-label="Help & Support"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-5 h-5 text-white"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                  <path d="M12 17h.01" />
                </svg>
              </button>
              <WalletConnectButton />
            </div>
          </div>
        </div>
      </div>

      {/* Help & Support Modal */}
      <AnimatePresence>
        {showHelpModal && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowHelpModal(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            />
            {/* Modal - positioned below the help button */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ type: 'spring', duration: 0.3 }}
              className="fixed z-[101]"
              style={{
                top: helpButtonRef.current
                  ? `${helpButtonRef.current.getBoundingClientRect().bottom + 8}px`
                  : '56px',
                right: helpButtonRef.current
                  ? `${window.innerWidth - helpButtonRef.current.getBoundingClientRect().right}px`
                  : '1rem',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-gradient-to-br from-zinc-900 via-zinc-900/95 to-zinc-800 rounded-xl p-6 max-w-md w-[400px] ring-1 ring-zinc-700/60 shadow-2xl">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-white">Help & Support</h2>
                  <button
                    onClick={() => setShowHelpModal(false)}
                    className="flex items-center justify-center w-8 h-8 rounded-lg bg-zinc-800/60 hover:bg-zinc-700/60 text-zinc-400 hover:text-white transition-colors"
                    aria-label="Close"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-5 h-5"
                    >
                      <path d="M18 6L6 18" />
                      <path d="M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="space-y-4 text-white">
                  <p className="text-zinc-300">
                    Encountering an issue or have a suggestion to improve your experience? Our team is ready to assist you!
                  </p>
                  <p className="text-zinc-300">
                    For prompt support, please open a ticket in our Discord, and we'll get back to you as soon as possible.
                  </p>
                  <a
                    href="https://discord.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 w-full rounded-lg bg-gradient-to-r from-[#5865F2] to-[#9B59B6] px-4 py-3 text-white font-semibold hover:opacity-90 transition-opacity shadow-lg"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-5 h-5"
                    >
                      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                    </svg>
                    <span>Join our Discord</span>
                  </a>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

