import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useCurrentAccount } from '@mysten/dapp-kit'
import { userAPI } from '@/services/api'

export function useReferralTracking() {
  const [searchParams] = useSearchParams()
  const currentAccount = useCurrentAccount()
  const walletAddress = currentAccount?.address || null

  useEffect(() => {
    async function handleReferral() {
      const refCode = searchParams.get('ref')
      if (!refCode || !walletAddress) return

      // Check if user already has a referrer
      try {
        const user = await userAPI.getUser(walletAddress)
        if (user.referredBy) {
          // Already referred, skip
          return
        }

        // Record the referral
        await userAPI.recordReferral(walletAddress, refCode)
        console.log('Referral recorded:', refCode)
      } catch (error) {
        console.error('Error recording referral:', error)
      }
    }

    handleReferral()
  }, [searchParams, walletAddress])
}

