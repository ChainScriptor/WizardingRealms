import { motion } from 'framer-motion'
import { useMemo } from 'react'

interface Particle {
  left: string
  duration: number
  delay: number
  size: number
  opacity: number
}

export default function ManaParticles({ count = 18 }: { count?: number }) {
  const particles = useMemo<Particle[]>(() => {
    return new Array(count).fill(0).map((_, i) => {
      const size = Math.random() * 6 + 3
      return {
        left: `${Math.random() * 100}%`,
        duration: 6 + Math.random() * 8,
        delay: Math.random() * 6,
        size,
        opacity: 0.25 + Math.random() * 0.45
      }
    })
  }, [count])

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {particles.map((p, idx) => (
        <motion.span
          key={idx}
          initial={{ y: 16 }}
          animate={{ y: -40 }}
          transition={{ duration: p.duration, delay: p.delay, ease: 'easeInOut', repeat: Infinity, repeatType: 'reverse' }}
          className="absolute top-1/2 rounded-full blur"
          style={{
            left: p.left,
            width: p.size,
            height: p.size,
            background: 'radial-gradient(circle at 30% 30%, rgba(123, 211, 255, 0.8), rgba(58, 155, 255, 0.1))',
            opacity: p.opacity,
            boxShadow: '0 0 16px rgba(91, 191, 255, 0.45), 0 0 32px rgba(91, 191, 255, 0.25)'
          }}
        />
      ))}
    </div>
  )
}

