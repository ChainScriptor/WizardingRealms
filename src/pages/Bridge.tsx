import { useEffect, useMemo, useState } from 'react'
import MainLayout from '@/components/MainLayout'
import AnnouncementBar from '@/components/AnnouncementBar'

const CHAINS = [
  { id: 'sui', label: 'Sui Network', ecosystem: 'Sui Native', accent: 'text-mana-300', badge: 'Origin' },
  { id: 'eth', label: 'Ethereum', ecosystem: 'EVM', accent: 'text-indigo-300', badge: 'LayerZero' },
  { id: 'sol', label: 'Solana', ecosystem: 'Solana', accent: 'text-orange-300', badge: 'Wormhole' },
  { id: 'sei', label: 'Sei Network', ecosystem: 'Cosmos', accent: 'text-cyan-300', badge: 'IBC' },
  { id: 'bsc', label: 'BNB Chain', ecosystem: 'EVM', accent: 'text-yellow-300', badge: 'LayerZero' }
]

const ROUTES = [
  { from: 'sui', to: 'eth', fee: 0.18, eta: '2-4 min', liquidity: '$12.5M', minted: 'SUI.e', relayer: 'LayerZero Edge' },
  { from: 'sui', to: 'sol', fee: 0.22, eta: '3-5 min', liquidity: '$6.8M', minted: 'SUI.sol', relayer: 'Wormhole v3' },
  { from: 'sui', to: 'sei', fee: 0.12, eta: '90s', liquidity: '$2.1M', minted: 'SUI.sei', relayer: 'IBC Turbo' },
  { from: 'sui', to: 'bsc', fee: 0.2, eta: '4-6 min', liquidity: '$4.4M', minted: 'SUI.b', relayer: 'LayerZero Edge' },
  { from: 'eth', to: 'sui', fee: 0.25, eta: '4-7 min', liquidity: '$10.3M', minted: 'SUI', relayer: 'LayerZero Edge' },
  { from: 'sol', to: 'sui', fee: 0.3, eta: '5-8 min', liquidity: '$5.1M', minted: 'SUI', relayer: 'Wormhole v3' }
]

const ASSETS: Record<string, string[]> = {
  sui: ['SUI', 'WIZ'],
  eth: ['SUI.e', 'USDC.e'],
  sol: ['SUI.sol', 'USDC'],
  sei: ['SUI.sei', 'USDC'],
  bsc: ['SUI.b', 'USDT']
}

const HISTORY = [
  { hash: '0x4ab1…ff09', from: 'Sui', to: 'Ethereum', amount: '350 SUI', status: 'Confirmed', time: '2 min ago' },
  { hash: '0xd712…90bb', from: 'Sui', to: 'Solana', amount: '120 SUI', status: 'Finalizing', time: '6 min ago' },
  { hash: '0xa812…c012', from: 'Ethereum', to: 'Sui', amount: '50 SUI.e', status: 'Confirmed', time: '18 min ago' }
]

export default function Bridge() {
  const [fromChain, setFromChain] = useState('sui')
  const [toChain, setToChain] = useState('eth')
  const [token, setToken] = useState('SUI')
  const [amount, setAmount] = useState('150')

  const destinationChains = useMemo(() => CHAINS.filter((c) => c.id !== fromChain), [fromChain])
  const availableTokens = ASSETS[fromChain] ?? ['SUI']

  useEffect(() => {
    if (!destinationChains.some((c) => c.id === toChain)) {
      setToChain(destinationChains[0]?.id ?? '')
    }
  }, [destinationChains, toChain])

  useEffect(() => {
    if (!availableTokens.includes(token)) {
      setToken(availableTokens[0])
    }
  }, [availableTokens, token])

  const currentRoute = ROUTES.find((route) => route.from === fromChain && route.to === toChain)
  const feeRate = currentRoute?.fee ?? 0.25
  const eta = currentRoute?.eta ?? '—'
  const mintedSymbol = currentRoute?.minted ?? token
  const relayer = currentRoute?.relayer ?? 'Aggregated routers'
  const amountNum = Number(amount) || 0
  const receiveAmount = amountNum * (1 - feeRate / 100)

  const handleSwapDirection = () => {
    setFromChain(toChain)
    setToChain(fromChain)
  }

  return (
    <MainLayout>
      <div className="space-y-6">
          <AnnouncementBar />

          <section className="rounded-[28px] bg-gradient-to-br from-[#1f1c3a]/80 via-[#241f4d]/70 to-[#090b19]/90 ring-1 ring-white/10 p-6 shadow-xl shadow-indigo-900/20">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="text-xs uppercase tracking-[0.35em] text-white/60">Cross-ecosystem Bridge</div>
                <div className="mt-2 text-3xl font-semibold text-white">Move Sui anywhere</div>
                <p className="text-sm text-white/70 mt-1 max-w-xl">
                  Send native SUI or wrapped assets to Ethereum, Solana, Cosmos and EVM partners using battle-tested relayers.
                </p>
              </div>
              <div className="rounded-2xl bg-white/10 px-4 py-3 text-right">
                <div className="text-xs text-white/60">Daily bridged</div>
                <div className="text-2xl text-white font-semibold">$7.1M</div>
                <div className="text-xs text-emerald-300">+12.4% vs yesterday</div>
              </div>
            </div>
          </section>

          <div className="grid gap-6 lg:grid-cols-[1.2fr,0.8fr]">
            <div className="rounded-3xl bg-[#0b1124]/80 ring-1 ring-white/5 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-white text-lg font-semibold">Bridge builder</div>
                <button onClick={handleSwapDirection} className="text-sm text-white/60 hover:text-white transition">
                  Swap direction ↺
                </button>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
                  <label className="text-xs text-white/60">From chain</label>
                  <select
                    value={fromChain}
                    onChange={(e) => setFromChain(e.target.value)}
                    className="mt-1 w-full bg-transparent text-white text-lg font-semibold outline-none"
                  >
                    {CHAINS.map((chain) => (
                      <option key={chain.id} value={chain.id} className="bg-[#0b1124] text-white">
                        {chain.label}
                      </option>
                    ))}
                  </select>
                  <div className="text-xs text-white/50 mt-1">{CHAINS.find((c) => c.id === fromChain)?.ecosystem}</div>
                </div>

                <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
                  <label className="text-xs text-white/60">Destination</label>
                  <select
                    value={toChain}
                    onChange={(e) => setToChain(e.target.value)}
                    className="mt-1 w-full bg-transparent text-white text-lg font-semibold outline-none"
                  >
                    {destinationChains.map((chain) => (
                      <option key={chain.id} value={chain.id} className="bg-[#0b1124] text-white">
                        {chain.label}
                      </option>
                    ))}
                  </select>
                  <div className="text-xs text-white/50 mt-1">{CHAINS.find((c) => c.id === toChain)?.ecosystem}</div>
                </div>
              </div>

              <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <label className="text-xs text-white/60">Amount</label>
                  <div className="flex gap-2 text-xs">
                    {[25, 50, 75, 100].map((pct) => (
                      <button
                        key={pct}
                        onClick={() => setAmount(((pct / 100) * 500).toString())}
                        className="px-3 py-1 rounded-full bg-white/10 text-white/70 hover:text-white hover:bg-white/20 transition"
                      >
                        {pct}%
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 items-center">
                  <input
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="flex-1 bg-transparent text-3xl font-semibold text-white outline-none"
                    placeholder="0.00"
                  />
                  <select
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    className="bg-white/10 text-white px-3 py-1.5 rounded-xl font-semibold outline-none"
                  >
                    {availableTokens.map((asset) => (
                      <option key={asset} value={asset} className="bg-[#0b1124] text-white">
                        {asset}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="rounded-2xl bg-black/20 p-3 text-sm text-white/70 flex items-center justify-between">
                  <span>Receive</span>
                  <span className="font-semibold text-white">
                    {receiveAmount.toFixed(3)} {mintedSymbol}
                  </span>
                </div>
              </div>

              <div className="rounded-2xl bg-black/30 p-4 ring-1 ring-white/5 space-y-3 text-sm">
                <div className="flex justify-between text-white/70">
                  <span>Bridge fee</span>
                  <span>
                    {feeRate}% • {(amountNum * (feeRate / 100)).toFixed(3)} {token}
                  </span>
                </div>
                <div className="flex justify-between text-white/70">
                  <span>ETA</span>
                  <span>{eta}</span>
                </div>
                <div className="flex justify-between text-white/70">
                  <span>Route relayer</span>
                  <span>{relayer}</span>
                </div>
                <div className="flex justify-between text-white/70">
                  <span>Destination liquidity</span>
                  <span>{currentRoute?.liquidity ?? '$—'}</span>
                </div>
              </div>

              <button
                disabled={!currentRoute}
                className="w-full rounded-2xl bg-gradient-to-r from-mana-500 via-cyan-500 to-amber-400 py-3 text-zinc-900 font-semibold shadow-lg shadow-mana-500/30 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {currentRoute ? 'Bridge now' : 'Route unavailable'}
              </button>
            </div>

            <div className="space-y-5">
              <div className="rounded-3xl bg-[#0c1228]/80 ring-1 ring-white/5 p-5 space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-white text-lg font-semibold">Route overview</div>
                    <div className="text-xs text-white/50">
                      {CHAINS.find((c) => c.id === fromChain)?.label} → {CHAINS.find((c) => c.id === toChain)?.label}
                    </div>
                  </div>
                  <span className="text-xs px-3 py-1 rounded-full bg-white/10 text-white/70">{currentRoute?.badge ?? 'Aggregated'}</span>
                </div>
                <div className="rounded-2xl bg-black/20 p-4 space-y-3 text-sm text-white/70">
                  <div>
                    <div className="text-xs uppercase tracking-wide text-white/50">Relayer</div>
                    <div className="text-white">{relayer}</div>
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-wide text-white/50">Path health</div>
                    <div className="text-emerald-300">Operational • 99.97% uptime</div>
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-wide text-white/50">Compliance</div>
                    <div>MEV shield + double validator attestation</div>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl bg-[#0c1326]/80 ring-1 ring-white/5 p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-white text-lg font-semibold">Bridge history</div>
                  <button className="text-xs text-white/60">View all</button>
                </div>
                <div className="space-y-3 text-sm text-white/70">
                  {HISTORY.map((item) => (
                    <div key={item.hash} className="rounded-2xl bg-black/20 p-3">
                      <div className="flex justify-between text-xs text-white/50">
                        <span>{item.hash}</span>
                        <span>{item.time}</span>
                      </div>
                      <div className="mt-1 flex items-center justify-between text-white">
                        <span>
                          {item.from} → {item.to}
                        </span>
                        <span>{item.amount}</span>
                      </div>
                      <div className="text-xs text-emerald-300 mt-1">{item.status}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl bg-[#0a0f20]/80 ring-1 ring-white/5 p-5">
                <div className="text-white text-lg font-semibold mb-3">Network support</div>
                <div className="grid grid-cols-2 gap-3 text-sm text-white/70">
                  {CHAINS.map((chain) => (
                    <div key={chain.id} className="rounded-2xl bg-white/5 p-3">
                      <div className="text-white font-semibold">{chain.label}</div>
                      <div className="text-xs">{chain.ecosystem}</div>
                      <div className={`text-[10px] uppercase tracking-wide mt-1 ${chain.accent}`}>{chain.badge}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
      </div>
    </MainLayout>
  )
}

