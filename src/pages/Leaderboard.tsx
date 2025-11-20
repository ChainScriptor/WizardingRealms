import MainLayout from '@/components/MainLayout'
import LightningText from '@/components/ui/lightning-text'

// Mock leaderboard data
const LEADERBOARD_DATA = [
  { rank: 1, name: 'WizardMaster', score: 125000, change: '+5' },
  { rank: 2, name: 'SorcererKing', score: 118500, change: '+2' },
  { rank: 3, name: 'MageLord', score: 112000, change: '-1' },
  { rank: 4, name: 'Enchanter', score: 105500, change: '+3' },
  { rank: 5, name: 'SpellCaster', score: 98000, change: '+1' },
  { rank: 6, name: 'ArcaneWizard', score: 94500, change: '-2' },
  { rank: 7, name: 'MysticMage', score: 91000, change: '+4' },
  { rank: 8, name: 'WizardElite', score: 87500, change: '—' },
  { rank: 9, name: 'MagicMaster', score: 84000, change: '-3' },
  { rank: 10, name: 'SorcererPro', score: 80500, change: '+2' }
]

export default function Leaderboard() {
  return (
    <MainLayout>
      <div className="relative flex flex-col min-h-full">
        {/* Lightning Text - Top Section */}
        <div className="h-64 flex-shrink-0">
          <LightningText text="Wizarding Realms" height="h-full" />
        </div>

        {/* Leaderboard Table */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-6xl mx-auto">
            <div className="rounded-3xl bg-gradient-to-br from-[#0b1124]/90 via-[#1a1f3a]/80 to-[#0b1124]/90 ring-1 ring-white/10 p-6 shadow-2xl">
              <div className="mb-6">
                <h2 className="text-3xl font-bold text-white mb-2">Top Wizards</h2>
                <p className="text-zinc-400 text-sm">Rankings based on total achievements and contributions</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-4 px-4 text-zinc-400 font-semibold text-sm uppercase tracking-wide">Rank</th>
                      <th className="text-left py-4 px-4 text-zinc-400 font-semibold text-sm uppercase tracking-wide">Wizard</th>
                      <th className="text-right py-4 px-4 text-zinc-400 font-semibold text-sm uppercase tracking-wide">Score</th>
                      <th className="text-right py-4 px-4 text-zinc-400 font-semibold text-sm uppercase tracking-wide">Change</th>
                    </tr>
                  </thead>
                  <tbody>
                    {LEADERBOARD_DATA.map((entry) => (
                      <tr
                        key={entry.rank}
                        className="border-b border-white/5 hover:bg-white/5 transition-colors"
                      >
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <span
                              className={`text-lg font-bold ${
                                entry.rank === 1
                                  ? 'text-yellow-400'
                                  : entry.rank === 2
                                  ? 'text-zinc-300'
                                  : entry.rank === 3
                                  ? 'text-amber-600'
                                  : 'text-zinc-500'
                              }`}
                            >
                              #{entry.rank}
                            </span>
                            {entry.rank <= 3 && (
                              <span className="text-xl">
                                {entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : '🥉'}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-white font-semibold">{entry.name}</div>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <div className="text-white font-semibold">{entry.score.toLocaleString()}</div>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <span
                            className={`text-sm font-semibold ${
                              entry.change.startsWith('+')
                                ? 'text-emerald-400'
                                : entry.change.startsWith('-')
                                ? 'text-rose-400'
                                : 'text-zinc-500'
                            }`}
                          >
                            {entry.change}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}

