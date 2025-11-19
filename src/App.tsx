import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import Landing from './pages/Landing'
import Gallery from './pages/Gallery'
import PlotDetail from './pages/PlotDetail'
import TopBar from './components/TopBar'
import Dashboard from './pages/Dashboard'
import WizardLands from './pages/WizardLands'
import Achievements from './pages/Achievements'

export default function App() {
  const location = useLocation()
  const isWizardLands = location.pathname === '/wizard-lands'
  return (
    <div className="min-h-screen bg-parchment-900 bg-texture bg-blend-multiply bg-fixed">
      {!isWizardLands && <TopBar />}
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/lore" element={<Landing />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/plot/:id" element={<PlotDetail />} />
        <Route path="/achievements" element={<Achievements />} />
        <Route path="/wizard-lands" element={<WizardLands />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}

