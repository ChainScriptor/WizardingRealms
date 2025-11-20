import MainLayout from '@/components/MainLayout'
import AnnouncementBar from '@/components/AnnouncementBar'

const notifications = [
  { time: '14:02', text: 'agnes claimed 3 Influence for Shardfarm', tag: 'Quest' },
  { time: '14:01', text: '0x34f…101 pledged 1 Influence to Wizard Lands', tag: 'Stake' },
  { time: '14:01', text: 'agnes minted Pawtato Hero #27755 on Turbo', tag: 'NFT' },
  { time: '13:58', text: 'guild bought Pawtato Hero #27755 for 11 SUI', tag: 'Market' },
  { time: '13:55', text: 'New quest available: Collect 100 Mana Crystals', tag: 'Quest' }
]

const marketPrices = [
  { asset: 'BTC', price: '$90,233', change: -2.42, cap: '$1.8T' },
  { asset: 'SUI', price: '$1.6175', change: -3.29, cap: '$5.9B' },
  { asset: 'WAL', price: '$0.177', change: -6.92, cap: '$256.9M' },
  { asset: 'DEEP', price: '$0.0497', change: 4.32, cap: '$95.2M' },
  { asset: 'BLUE', price: '$0.0477', change: -1.44, cap: '$50.2M' },
  { asset: 'IKA', price: '$0.0218', change: -4.97, cap: '$23.7M' },
  { asset: 'CETUS', price: '$0.0328', change: 1.77, cap: '$27.5M' },
  { asset: 'TATO', price: '$0.0216', change: 1.63, cap: '$12.6M' }
]

const newsFeed = [
  { title: '$TATO is live!', date: 'Nov 15', category: 'TGE' },
  { title: 'TATO verified on Slush Wallet', date: 'Nov 14', category: 'announcement' },
  { title: 'TATO listing on CoinGecko', date: 'Nov 14', category: 'announcement' },
  { title: 'Blast + Turbo Integration now live', date: 'Nov 8', category: 'new feature' },
  { title: 'Wizarding Heroes sold out!', date: 'Nov 7', category: 'collection' }
]

export default function Dashboard() {
  return (
    <MainLayout>
      <div className="space-y-6">
          <AnnouncementBar />

          {/* Total Net Worth Section */}
          <div className="rounded-3xl bg-gradient-to-br from-[#4227a6]/70 via-[#862bb3]/50 to-[#111432]/80 ring-1 ring-white/10 shadow-2xl shadow-indigo-900/20 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.35em] text-white/70">Total Net Worth</div>
                <div className="mt-2 text-4xl md:text-5xl font-bold text-white">$508.43</div>
              </div>
              <button className="text-white/70 hover:text-white transition">🔄</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="rounded-2xl bg-white/5 backdrop-blur p-4 ring-1 ring-white/10">
                <div className="text-white/80 text-sm">Total Assets</div>
                <div className="text-2xl font-bold text-white mt-1">$114.3</div>
              </div>
              <div className="rounded-2xl bg-white/5 backdrop-blur p-4 ring-1 ring-white/10">
                <div className="text-white/80 text-sm">Total Debt</div>
                <div className="text-2xl font-bold text-white mt-1">$0</div>
              </div>
              <div className="rounded-2xl bg-white/5 backdrop-blur p-4 ring-1 ring-white/10">
                <div className="text-white/80 text-sm">NFT Value</div>
                <div className="text-2xl font-bold text-white mt-1">$394.12</div>
              </div>
            </div>
            <div className="mt-4 text-xs text-emerald-300">Protocol rewards: $0.0064</div>
          </div>

          <div className="grid lg:grid-cols-[1fr,1fr] gap-6">
            {/* Recent Notifications */}
            <div className="rounded-3xl bg-[#0f1424]/85 ring-1 ring-white/5 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-white text-lg font-semibold">Recent Notifications</div>
                <span className="text-xs text-white/50 bg-white/5 rounded-full px-2 py-0.5">Live</span>
              </div>
              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {notifications.map((note, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-sm text-white/80">
                    <div className="text-xs text-white/50 w-12">{note.time}</div>
                    <div className="flex-1">
                      <div>{note.text}</div>
                      <div className="text-[10px] uppercase tracking-wide text-white/50 mt-0.5">{note.tag}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Market Prices */}
            <div className="rounded-3xl bg-[#0c1122]/80 ring-1 ring-white/5 p-5 overflow-x-auto">
              <div className="flex items-center justify-between mb-4">
                <div className="text-white text-lg font-semibold">Market Prices</div>
                <div className="text-xs text-white/50">24h change</div>
              </div>
              <table className="w-full text-sm text-white/80">
                <thead className="text-white/50 text-xs uppercase tracking-wide">
                  <tr>
                    <th className="text-left pb-2">Asset</th>
                    <th className="text-left pb-2">Price</th>
                    <th className="text-left pb-2">24h</th>
                    <th className="text-left pb-2">Market cap</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {marketPrices.map((row) => (
                    <tr key={row.asset} className="h-12">
                      <td className="font-semibold">{row.asset}</td>
                      <td>{row.price}</td>
                      <td className={row.change >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                        {row.change >= 0 ? '+' : ''}
                        {row.change.toFixed(2)}%
                      </td>
                      <td>{row.cap}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid lg:grid-cols-[2fr,1fr] gap-6">
            {/* Latest News */}
            <div className="rounded-3xl bg-[#0c1428]/80 ring-1 ring-white/5 p-5">
              <div className="text-white text-lg font-semibold mb-3">Latest News</div>
              <div className="space-y-3">
                {newsFeed.map((item, idx) => (
                  <div key={idx} className="rounded-2xl bg-white/5 p-3 hover:bg-white/10 transition">
                    <div className="flex justify-between text-xs text-white/50 mb-1">
                      <span>{item.date}</span>
                      <span className="uppercase tracking-wide">{item.category}</span>
                    </div>
                    <div className="text-white text-sm font-medium">{item.title}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Partner */}
            <div className="rounded-3xl bg-gradient-to-br from-sky-500/40 via-cyan-500/30 to-indigo-700/40 ring-1 ring-white/10 p-5 text-white shadow-lg">
              <div className="text-xs uppercase tracking-[0.35em] text-white/70">Partner</div>
              <div className="text-2xl font-semibold mt-2">Turbo x Wizarding</div>
              <p className="text-sm text-white/80 mt-2">Experience 180+ markets with boosted leverage.</p>
              <button className="mt-4 w-full rounded-2xl bg-white text-slate-900 font-semibold py-2 hover:scale-[1.02] transition">
                Trade & Win
              </button>
            </div>
          </div>
        </div>
    </MainLayout>
  )
}

