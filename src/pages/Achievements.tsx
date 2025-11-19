import { useEffect, useState } from 'react'
import CheckinGrid from '@/components/CheckinGrid'
import AchievementList from '@/components/AchievementList'
import { Checkins, loadCheckins } from '@/utils/checkin'

export default function Achievements() {
  const [checkins, setCheckins] = useState<Checkins>(new Set())
  useEffect(() => {
    setCheckins(loadCheckins())
    const onStorage = () => setCheckins(loadCheckins())
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 space-y-4">
      <div className="font-wizard text-3xl glow-text">Achievements</div>
      <CheckinGrid />
      <AchievementList checkins={checkins} />
    </div>
  )
}

