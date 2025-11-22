import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import Landing from './pages/Landing'
import Gallery from './pages/Gallery'
import PlotDetail from './pages/PlotDetail'
import TopBar from './components/TopBar'
import Dashboard from './pages/Dashboard'
import WizardLands from './pages/WizardLands'
import Achievements from './pages/Achievements'
import Swap from './pages/Swap'
import Bridge from './pages/Bridge'
import YouFoundMe from './pages/YouFoundMe'
import Leaderboard from './pages/Leaderboard'
import Invite from './pages/Invite'
import Coins from './pages/Coins'
import { useReferralTracking } from './hooks/useReferralTracking'
import { useWalletRegistration } from './hooks/useWalletRegistration'
import { useBadgeSync } from './hooks/useBadgeSync'

export default function App() {
  const location = useLocation()
  const isWizardLands = location.pathname === '/wizard-lands'
  
  // Automatically register user in MongoDB when wallet connects
  useWalletRegistration()
  
  // Sync all badges/achievements to MongoDB when wallet connects
  useBadgeSync()
  
  // Track referrals when user visits with ?ref= parameter
  useReferralTracking()
  return (
    <div className="min-h-screen bg-parchment-900 relative">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="fixed inset-0 w-full h-full object-cover opacity-30 -z-10"
        style={{
          objectPosition: 'center 45%',
          transform: 'scale(1.4)'
        }}
      >
        <source src="/video.mp4" type="video/mp4" />
      </video>
      {/* Dark overlay */}
      <div className="fixed inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60 -z-10" />
      
      {!isWizardLands && <TopBar />}
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/lore" element={<Landing />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/plot/:id" element={<PlotDetail />} />
        <Route path="/achievements" element={<Achievements />} />
        <Route path="/wizard-lands" element={<WizardLands />} />
        <Route path="/bridge" element={<Bridge />} />
        <Route path="/swap" element={<Swap />} />
        <Route path="/you-found-me" element={<YouFoundMe />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/coins" element={<Coins />} />
        <Route path="/invite" element={<Invite />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}

