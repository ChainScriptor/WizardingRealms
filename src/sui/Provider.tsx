import { ReactNode, useEffect, useState } from 'react'

type Kit = any

export default function SuiProvider({ children }: { children: ReactNode }) {
  const [kit, setKit] = useState<Kit | null>(null)
  const [networkConfig, setNetworkConfig] = useState<any>(null)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const lib = '@mysten' + '/dapp-kit'
        // avoid Vite pre-bundling; load at runtime if present
        // @ts-expect-error
        const mod = await import(/* @vite-ignore */ lib)
        const { createNetworkConfig } = mod as any
        const cfg = createNetworkConfig({
          mainnet: { url: 'https://fullnode.mainnet.sui.io' },
          testnet: { url: 'https://fullnode.testnet.sui.io' },
          devnet: { url: 'https://fullnode.devnet.sui.io' }
        })
        if (!mounted) return
        setKit(mod)
        setNetworkConfig(cfg.networkConfig)
        // try to load styles (optional)
        try {
          const cssPath = '@mysten' + '/dapp-kit/dist/index.css'
          // @ts-expect-error
          await import(/* @vite-ignore */ cssPath)
        } catch {}
      } catch (e) {
        console.warn('Sui Dapp Kit not available. Wallet features disabled until installed.', e)
      }
    })()
    return () => {
      mounted = false
    }
  }, [])

  if (!kit || !networkConfig) {
    return <>{children}</>
  }

  const SuiClientProvider = (kit as any).SuiClientProvider
  const WalletProvider = (kit as any).WalletProvider

  return (
    <SuiClientProvider networks={networkConfig} defaultNetwork="mainnet">
      <WalletProvider autoConnect>{children}</WalletProvider>
    </SuiClientProvider>
  )
}


