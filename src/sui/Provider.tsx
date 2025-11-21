import { ReactNode, useEffect } from 'react'
import { SuiClientProvider, WalletProvider, createNetworkConfig } from '@mysten/dapp-kit'
import { getFullnodeUrl } from '@mysten/sui.js/client'

export default function SuiProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    // Load dapp-kit base styles (safe for production)
    const cssPath = '@mysten' + '/dapp-kit/dist/index.css'
    import(/* @vite-ignore */ cssPath).catch(() => {
      // ignore missing style file; component still works without default styles
    })
  }, [])

  // Production-ready defaults for Sui networks
  const { networkConfig } = createNetworkConfig({
    mainnet: { url: getFullnodeUrl('mainnet') },
    testnet: { url: getFullnodeUrl('testnet') },
    devnet: { url: getFullnodeUrl('devnet') },
  })

  return (
    <SuiClientProvider networks={networkConfig} defaultNetwork="mainnet">
      <WalletProvider>{children}</WalletProvider>
    </SuiClientProvider>
  )
}
