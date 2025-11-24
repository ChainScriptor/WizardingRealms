import { useEffect, useRef } from 'react'
import { useCurrentAccount } from '@mysten/dapp-kit'
import { userAPI } from '@/services/api'

/**
 * Hook that automatically registers/loads user in MongoDB when wallet is connected
 * This ensures every wallet connection creates or loads the user profile
 */
export function useWalletRegistration() {
  const currentAccount = useCurrentAccount()
  const walletAddress = currentAccount?.address || null
  const registeredRef = useRef<string | null>(null)

  useEffect(() => {
    async function registerUser() {
      if (!walletAddress) {
        registeredRef.current = null
        return
      }

      // Skip if already registered in this session
      if (registeredRef.current === walletAddress) {
        return
      }

      try {
        // This will create the user if they don't exist, or return existing user
        const user = await userAPI.getUser(walletAddress)
        registeredRef.current = walletAddress
        
        console.log('✅ User registered/loaded:', {
          walletAddress: user.walletAddress,
          referralCode: user.referralCode,
          invitedCount: user.invitedCount,
          totalXP: user.totalXP,
          achievements: user.unlockedAchievements?.length || 0,
          inviteBadges: user.unlockedInviteBadges?.length || 0,
          supporterBadges: user.unlockedSupporterBadges?.length || 0,
        })
      } catch (error) {
        console.error('❌ Error registering user:', error)
        // Don't set registeredRef on error, so it will retry
      }
    }

    registerUser()
  }, [walletAddress])

  return {
    isRegistered: registeredRef.current === walletAddress,
    walletAddress,
  }
}



