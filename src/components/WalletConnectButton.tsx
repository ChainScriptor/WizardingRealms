import { useCallback, useMemo, useState } from 'react'
import { useWalletKit } from '@mysten/wallet-kit'

const SUI_WALLETS = [
  { name: 'Suiet', icon: '/wallets/suiet.png' },
  { name: 'Sui Wallet', icon: '/wallets/sui-wallet.png' },
  { name: 'Ethos Wallet', icon: '/wallets/ethos.png' },
  { name: 'OKX Wallet', icon: '/wallets/okx.png' },
  { name: 'Nightly', icon: '/wallets/nightly.png' },
  { name: 'Martian Wallet', icon: '/wallets/martian.png' },
  { name: 'Slush', icon: '/wallets/slush.png' },
  { name: 'Phantom', icon: '/wallets/phantom.png' }
]

type WalletAdapter = { name: string }

export default function WalletConnectButton() {
  const { currentWallet, connect, isConnected } = useWalletKit()
  const [showModal, setShowModal] = useState(false)
  const availableWallets = useMemo(() => SUI_WALLETS, [])

  const handleConnect = useCallback(
    async (walletName: string) => {
      const adapters: WalletAdapter[] = ((window as any)?.wallets as WalletAdapter[]) ?? []
      const adapter = adapters.find((wallet) => wallet.name === walletName)
      if (!adapter) {
        console.warn(`Wallet ${walletName} not found in window.wallets`)
        return
      }
      await connect(adapter as any)
      setShowModal(false)
    },
    [connect]
  )

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="flex items-center gap-3 rounded-full bg-gradient-to-r from-purple-700 to-indigo-800 px-8 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-purple-600 hover:to-indigo-700"
      >
        <span className="text-2xl" role="img" aria-label="magic wand">
          🪄
        </span>
        {isConnected ? <span>{currentWallet?.name} Connected</span> : <span>Connect Wallet</span>}
      </button>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl border-2 border-purple-600 bg-gradient-to-b from-slate-900 to-purple-950 p-8 shadow-2xl">
            <div className="mb-8 text-center">
              <h2 className="bg-gradient-to-r from-yellow-400 to-purple-400 bg-clip-text text-3xl font-bold text-transparent">
                Choose Your Wand
              </h2>
              <p className="mt-2 text-sm text-gray-400">Connect with a Sui wallet</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {availableWallets.map((wallet) => (
                <button
                  className="group flex flex-col items-center gap-3 rounded-2xl border border-purple-500 bg-slate-800 p-6 transition-all duration-200 hover:scale-105 hover:border-yellow-400 hover:bg-slate-700"
                  key={wallet.name}
                  onClick={() => handleConnect(wallet.name)}
                >
                  <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-gray-700">
                    <img src={wallet.icon} alt={wallet.name} className="h-12 w-12 object-contain" />
                  </div>
                  <span className="text-sm font-medium text-white transition-colors group-hover:text-yellow-400">
                    {wallet.name}
                  </span>
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowModal(false)}
              className="mt-6 w-full py-3 text-sm font-medium text-gray-400 transition hover:text-white"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  )
}