import { useEffect, useMemo, useState } from 'react'
import { useCurrentAccount } from '@mysten/dapp-kit'
import { userAPI } from '@/services/api'

export default function InvitePanel() {
  const current = useCurrentAccount()
  const walletAddress = current?.address || null
  const [copied, setCopied] = useState(false)
  const [invitedCount, setInvitedCount] = useState(0)

  const referralCode = useMemo(() => {
    const base = current?.address ?? 'guest'
    return base.slice(2, 10)
  }, [current?.address])

  const inviteLink = useMemo(() => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://wizarding.realms'
    return `${origin}/?ref=${referralCode}`
  }, [referralCode])

  useEffect(() => {
    async function loadInvitedCount() {
      if (walletAddress) {
        try {
          const user = await userAPI.getUser(walletAddress)
          setInvitedCount(user.invitedCount || 0)
        } catch (error) {
          console.error('Error loading invited count:', error)
          // Fallback to localStorage
          setInvitedCount(Number(localStorage.getItem('invitedCount') || 0))
        }
      } else {
        setInvitedCount(Number(localStorage.getItem('invitedCount') || 0))
      }
    }
    loadInvitedCount()
  }, [walletAddress])

  const shareOnTelegram = () => {
    const text = `Join me in Wizarding Realms!`
    const url = `https://t.me/share/url?url=${encodeURIComponent(inviteLink)}&text=${encodeURIComponent(text)}`
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 1200)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="rounded-2xl bg-gradient-to-b from-zinc-950 to-zinc-900 ring-1 ring-zinc-800 p-6 text-white relative">
      <div className="absolute right-4 top-4 text-sm text-amber-300">
        <span role="img" aria-label="invite">🧙‍♂️</span> {invitedCount} invited
      </div>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold">Invite a Friend</h2>
        <p className="text-zinc-400 mt-1">Share your referral link with friends</p>
      </div>
      <div className="flex justify-center">
        <button
          onClick={shareOnTelegram}
          className="w-full max-w-lg flex items-center justify-center gap-2 rounded-xl bg-[#229ED9] px-6 py-3 font-semibold shadow-lg hover:opacity-90"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-5 h-5"><path d="M9.042 13.28l-.376 5.305c.537 0 .769-.231 1.046-.508l2.511-2.407 5.205 3.804c.953.527 1.63.251 1.889-.882l3.423-16.02.001-.001c.304-1.415-.51-1.973-1.439-1.63L1.677 9.21C.306 9.737.327 10.49 1.441 10.833l5.542 1.727L19.384 5.73c.621-.415 1.184-.185.72.23"/></svg>
          Share on Telegram
        </button>
      </div>
      <div className="my-6 flex items-center gap-3">
        <div className="flex-1 h-px bg-zinc-800" />
        <span className="text-zinc-500 text-sm">or</span>
        <div className="flex-1 h-px bg-zinc-800" />
      </div>
      <div className="flex justify-center">
        <button
          onClick={copyLink}
          className="w-full max-w-lg flex items-center justify-center gap-2 rounded-xl bg-zinc-900 ring-1 ring-zinc-800 px-6 py-3 font-medium hover:bg-zinc-850"
        >
          <span className="text-zinc-300">{copied ? 'Copied!' : 'Copy invite link'}</span>
        </button>
      </div>
      <div className="mt-6 grid gap-3 max-w-lg mx-auto">
        <div className="grid grid-cols-[140px_1fr] items-center gap-3">
          <div className="text-sm text-zinc-400">Referral Code</div>
          <input
            readOnly
            value={referralCode}
            className="w-full rounded-lg bg-zinc-900 ring-1 ring-zinc-800 px-3 py-2 font-mono text-sm"
          />
        </div>
        <div className="grid grid-cols-[140px_1fr] items-center gap-3">
          <div className="text-sm text-zinc-400">Invite Link</div>
          <input
            readOnly
            value={inviteLink}
            className="w-full rounded-lg bg-zinc-900 ring-1 ring-zinc-800 px-3 py-2 font-mono text-sm"
          />
        </div>
      </div>
    </div>
  )
}


