import { useEffect, useRef } from 'react'
import { useCurrentAccount } from '@mysten/dapp-kit'
import { achievementsAPI, userAPI } from '@/services/api'
import { computeStreak, loadCheckins } from '@/utils/checkin'

/**
 * Syncs all existing badges and achievements from localStorage/local state to MongoDB
 * This ensures that badges earned before wallet connection are saved to the database
 */
export function useBadgeSync() {
  const currentAccount = useCurrentAccount()
  const walletAddress = currentAccount?.address || null
  const syncedRef = useRef<string | null>(null)

  useEffect(() => {
    async function syncBadges() {
      if (!walletAddress) {
        syncedRef.current = null
        return
      }

      // Skip if already synced in this session
      if (syncedRef.current === walletAddress) {
        return
      }

      try {
        // Wait a bit for user registration to complete
        await new Promise(resolve => setTimeout(resolve, 500))

        // Get user data
        const user = await userAPI.getUser(walletAddress)
        const existingAchievements = new Set(user.unlockedAchievements || [])
        const existingInviteBadges = new Set(user.unlockedInviteBadges || [])
        const existingSupporterBadges = new Set(user.unlockedSupporterBadges || [])

        // Get current streak from user data (calculated by backend)
        // The backend calculates streak correctly (resets if a day is missed)
        const currentStreak = user.currentStreak || 0
        
        const ACHIEVEMENTS = [
          { id: 'streak-3', threshold: 3, xp: 100 },
          { id: 'streak-7', threshold: 7, xp: 200 },
          { id: 'streak-14', threshold: 14, xp: 400 },
          { id: 'streak-30', threshold: 30, xp: 800 },
          { id: 'streak-60', threshold: 60, xp: 1500 },
          { id: 'streak-90', threshold: 90, xp: 2500 },
          { id: 'streak-120', threshold: 120, xp: 3500 },
          { id: 'streak-160', threshold: 160, xp: 5000 },
          { id: 'streak-180', threshold: 180, xp: 6000 },
          { id: 'streak-240', threshold: 240, xp: 9000 },
          { id: 'streak-300', threshold: 300, xp: 10000 }
        ]

        // Sync achievements that should be unlocked based on current streak
        for (const achievement of ACHIEVEMENTS) {
          if (currentStreak >= achievement.threshold && !existingAchievements.has(achievement.id)) {
            try {
              await achievementsAPI.unlockAchievement(walletAddress, achievement.id, achievement.xp)
              console.log(`✅ Synced achievement: ${achievement.id}`)
            } catch (error) {
              console.error(`Error syncing achievement ${achievement.id}:`, error)
            }
          }
        }

        // Sync invite badges based on invitedCount
        const INVITE_BADGES = [
          { id: 'friendly', needed: 1, xp: 500 },
          { id: 'power', needed: 2, xp: 500 },
          { id: 'bronze', needed: 5, xp: 1000 },
          { id: 'silver', needed: 10, xp: 2000 },
          { id: 'gold', needed: 25, xp: 2500 },
          { id: 'diamond', needed: 50, xp: 3000 },
          { id: 'platinum', needed: 75, xp: 3000 },
          { id: 'galactic', needed: 100, xp: 6000 },
        ]

        const invitedCount = user.invitedCount || 0
        for (const badge of INVITE_BADGES) {
          if (invitedCount >= badge.needed && !existingInviteBadges.has(badge.id)) {
            try {
              await achievementsAPI.unlockInviteBadge(walletAddress, badge.id, badge.xp)
              console.log(`✅ Synced invite badge: ${badge.id}`)
            } catch (error) {
              console.error(`Error syncing invite badge ${badge.id}:`, error)
            }
          }
        }

        syncedRef.current = walletAddress
        console.log('✅ Badge sync completed for:', walletAddress)
      } catch (error) {
        console.error('❌ Error syncing badges:', error)
      }
    }

    // Only sync if wallet is connected
    if (walletAddress) {
      syncBadges()
    }
  }, [walletAddress])

  return {
    isSynced: syncedRef.current === walletAddress,
    walletAddress,
  }
}

