import Sidebar from '@/components/Sidebar'
import AnnouncementBar from '@/components/AnnouncementBar'
import ChartWidget from '@/components/ChartWidget'
import SwapWidget from '@/components/SwapWidget'
import PriceInfoPanel from '@/components/PriceInfoPanel'
import Tabs from '@/components/Tabs'
import { useState } from 'react'

export default function Dashboard() {
  const [tab, setTab] = useState<'swap' | 'limit' | 'multi'>('swap')

  return (
    <div className="min-h-[calc(100vh-56px)] flex">
      <Sidebar />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-4 space-y-4">
          <AnnouncementBar />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-2">
              <Tabs
                tabs={[
                  { key: 'swap', label: 'Swap' },
                  { key: 'limit', label: 'Limit Order' },
                  { key: 'multi', label: 'Multi Swap' }
                ]}
                active={tab}
                onChange={(k) => setTab(k as typeof tab)}
              />
            </div>
            <div className="hidden md:block" />
          </div>

          <div className="mt-2 grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ChartWidget />
            {tab === 'swap' ? (
              <SwapWidget />
            ) : (
              <div className="rounded-xl bg-zinc-900/70 ring-1 ring-zinc-700/60 p-4 grid place-items-center text-zinc-400">
                {tab === 'limit' ? 'Limit orders coming soon.' : 'Multi-swap route optimizer coming soon.'}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <PriceInfoPanel />
            <div className="rounded-xl bg-zinc-900/70 ring-1 ring-zinc-700/60 p-4">
              <div className="font-semibold mb-2">Activity</div>
              <div className="text-sm text-zinc-400">Recent swaps and events will appear here.</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

