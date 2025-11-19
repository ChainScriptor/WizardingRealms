import { motion } from 'framer-motion'

export default function AnnouncementBar() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-xl px-4 py-2 bg-gradient-to-r from-mana-600/40 via-pink-500/30 to-amber-500/40 ring-1 ring-zinc-700/60 text-center text-sm"
    >
      <span className="mr-2">🪄</span>
      <span className="font-semibold">WIZ is LIVE!</span>
      <span className="ml-2 text-zinc-300">Claim your enchanted plots and begin earning mana.</span>
    </motion.div>
  )
}

