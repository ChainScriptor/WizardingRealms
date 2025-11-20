import { ReactNode, useEffect } from 'react'
import { WalletKitProvider } from '@mysten/wallet-kit'

export default function SuiProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const cssPath = '@mysten' + '/wallet-kit/dist/index.css'
    import(/* @vite-ignore */ cssPath).catch(() => {
      // ignore missing style file; component still works without default styles
    })
  }, [])

  return <WalletKitProvider>{children}</WalletKitProvider>
}
