import { useState } from 'react'
import { createPortal } from 'react-dom'
import {
  useCurrentAccount,
  useConnectWallet,
  useDisconnectWallet,
  useWallets,
} from '@mysten/dapp-kit'

function truncateAddress(addr: string, left = 6, right = 6) {
  if (!addr) return ''
  return `${addr.slice(0, left)}…${addr.slice(-right)}`
}

export default function WalletConnectButton() {
  const currentAccount = useCurrentAccount()
  const { mutateAsync: connect, isPending: isConnecting } = useConnectWallet()
  const { mutate: disconnect } = useDisconnectWallet()
  const wallets = useWallets()

  const [open, setOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleConnect(index: number) {
    try {
      setError(null)
      const w = wallets[index]
      if (!w) {
        setError('Selected wallet unavailable.')
        return
      }
      await connect({ wallet: w })
      setOpen(false)
    } catch (e: any) {
      setError(e?.message || 'Failed to connect to wallet')
    }
  }

  function handleDisconnect() {
    try {
      setError(null)
      disconnect()
      setOpen(false)
    } catch (e: any) {
      setError(e?.message || 'Failed to disconnect')
    }
  }

  const label = currentAccount
    ? truncateAddress(currentAccount.address)
    : isConnecting
    ? 'Connecting…'
    : 'Connect Wallet'

  return (
    <div className="relative inline-block">
      {/* Μαύρο, pill-shaped κουμπί */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        disabled={isConnecting}
        className="flex items-center gap-2 rounded-full border border-zinc-700 bg-black px-6 py-2 font-wizard font-bold text-white shadow-lg transition-all duration-200 hover:shadow-[0_6px_20px_rgba(0,0,0,0.35)] disabled:opacity-80"
      >
        {label}
      </button>

      {open &&
        createPortal(
          <div
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
            onClick={() => setOpen(false)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') setOpen(false)
            }}
            tabIndex={-1}
          >
            <div
              className="w-full max-w-md rounded-2xl border border-zinc-700 bg-zinc-950 p-5 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-labelledby="wallet-modal-title"
            >
              <div className="mb-4 text-center">
                <h2 id="wallet-modal-title" className="text-xl font-bold text-white">Choose a wallet</h2>
                <p className="mt-1 text-sm text-zinc-400">Connect with a Sui-compatible wallet</p>
              </div>

              {!currentAccount ? (
                wallets.length ? (
                  <div className="grid grid-cols-2 gap-3">
                    {wallets.map((w, idx) => (
                      <button
                        key={w.name}
                        type="button"
                        onClick={() => handleConnect(idx)}
                        disabled={isConnecting}
                        className="group flex flex-col items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 hover:bg-zinc-900"
                      >
                        {'icon' in w && (w as any).icon ? (
                          <img src={(w as any).icon} alt="" className="h-10 w-10 rounded" />
                        ) : (
                          <div className="h-10 w-10 rounded bg-zinc-800 grid place-items-center text-sm text-zinc-400">
                            {w.name[0]}
                          </div>
                        )}
                        <span className="text-sm font-semibold text-white">{w.name}</span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-3 text-sm text-zinc-400">
                    Δεν βρέθηκαν Sui wallets. Εγκατάστησε ένα (π.χ.{' '}
                    <a
                      href="https://wallet.sui.io"
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-400 hover:underline"
                    >
                      Sui Wallet
                    </a>
                    ) και κάνε refresh.
                  </div>
                )
              ) : (
                <div className="grid gap-3">
                  <div className="rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 py-2 font-mono text-sm text-white">
                    {truncateAddress(currentAccount.address)}
                  </div>
                  <button
                    type="button"
                    onClick={handleDisconnect}
                    className="rounded-lg border border-zinc-700 bg-zinc-100 px-3 py-2 text-zinc-900 font-semibold hover:bg-white"
                  >
                    Disconnect
                  </button>
                </div>
              )}

              {error && (
                <div className="mt-3 rounded-lg border border-red-900 bg-red-950/60 px-3 py-2 text-xs text-red-300">
                  {error}
                </div>
              )}

              <div className="mt-5 flex justify-end">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm text-zinc-200 hover:bg-zinc-800"
                >
                  Close
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  )
}