import { useEffect, useState } from 'react'
import { useCurrentAccount } from '@mysten/dapp-kit'
import MainLayout from '@/components/MainLayout'
import CheckinGrid from '@/components/CheckinGrid'
import AchievementList from '@/components/AchievementList'
import SupporterBadges from '@/components/SupporterBadges'
import InviteBadges from '@/components/InviteBadges'
import { Checkins, loadCheckins } from '@/utils/checkin'
import { userAPI, achievementsAPI } from '@/services/api'

export default function Achievements() {
  const currentAccount = useCurrentAccount()
  const walletAddress = currentAccount?.address || null
  const [checkins, setCheckins] = useState<Checkins>(new Set())
  const [invitedCount, setInvitedCount] = useState(0)
  const [unlockedSupporterBadges, setUnlockedSupporterBadges] = useState<string[]>([])

  useEffect(() => {
    async function load() {
      if (walletAddress) {
        const loaded = await loadCheckins(walletAddress)
        setCheckins(loaded)
        
        // Load user data for invited count and badges
        try {
          const user = await userAPI.getUser(walletAddress)
          setInvitedCount(user.invitedCount || 0)
          
          // Load achievements to get supporter badges
          const achievements = await achievementsAPI.getAchievements(walletAddress)
          setUnlockedSupporterBadges(achievements.unlockedSupporterBadges || [])
        } catch (error) {
          console.error('Error loading user data:', error)
        }
      } else {
        const loaded = await loadCheckins(null)
        setCheckins(loaded)
      }
    }
    load()
  }, [walletAddress])

  return (
    <MainLayout>
      <div className="space-y-4">
        <div className="font-wizard text-3xl glow-text">Achievements</div>
        <CheckinGrid />
        <AchievementList checkins={checkins} />
        <SupporterBadges unlockedIds={unlockedSupporterBadges} />
        <InviteBadges invitedCount={invitedCount} />
      </div>
    </MainLayout>
  )
}

