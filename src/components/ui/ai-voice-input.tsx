"use client"

import { Headphones } from 'lucide-react'
import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface AIVoiceInputProps {
  onStart?: () => void
  onStop?: (duration: number) => void
  visualizerBars?: number
  demoMode?: boolean
  demoInterval?: number
  className?: string
}

export function AIVoiceInput({
  onStart,
  onStop,
  visualizerBars = 48,
  demoMode = false,
  demoInterval = 3000,
  className
}: AIVoiceInputProps) {
  const [submitted, setSubmitted] = useState(false)
  const [time, setTime] = useState(0)
  const [isClient, setIsClient] = useState(false)
  const [isDemo, setIsDemo] = useState(demoMode)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    let intervalId: NodeJS.Timeout

    if (submitted) {
      onStart?.()
      intervalId = setInterval(() => {
        setTime((t) => t + 1)
      }, 1000)
    } else {
      onStop?.(time)
      setTime(0)
    }

    return () => clearInterval(intervalId)
  }, [submitted, time, onStart, onStop])

  useEffect(() => {
    if (!isDemo) return

    let timeoutId: NodeJS.Timeout
    const runAnimation = () => {
      setSubmitted(true)
      timeoutId = setTimeout(() => {
        setSubmitted(false)
        timeoutId = setTimeout(runAnimation, 1000)
      }, demoInterval)
    }

    const initialTimeout = setTimeout(runAnimation, 100)
    return () => {
      clearTimeout(timeoutId)
      clearTimeout(initialTimeout)
    }
  }, [isDemo, demoInterval])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleClick = () => {
    if (isDemo) {
      setIsDemo(false)
      setSubmitted(false)
    } else {
      setSubmitted((prev) => !prev)
    }
  }

  return (
    <div className={cn('w-full', className)}>
      <div className="relative w-full mx-auto flex items-center flex-col gap-1.5">
        <button
          className={cn(
            'group w-12 h-12 rounded-lg flex items-center justify-center transition-colors',
            submitted ? 'bg-none' : 'bg-zinc-900/40 hover:bg-zinc-900/70 ring-1 ring-zinc-700/60'
          )}
          type="button"
          onClick={handleClick}
        >
          {submitted ? (
            <div
              className="w-5 h-5 rounded-sm animate-spin bg-mana-400 cursor-pointer pointer-events-auto"
              style={{ animationDuration: '3s' }}
            />
          ) : (
            <Headphones className="w-5 h-5 text-zinc-300" />
          )}
        </button>

        <span
          className={cn(
            'font-mono text-xs transition-opacity duration-300',
            submitted ? 'text-zinc-200' : 'text-zinc-500'
          )}
        >
          {formatTime(time)}
        </span>

        <div className="h-3 w-full flex items-center justify-center gap-0.5">
          {[...Array(visualizerBars)].map((_, i) => (
            <div
              key={i}
              className={cn(
                'w-0.5 rounded-full transition-all duration-300',
                submitted ? 'bg-mana-400/70 animate-pulse' : 'bg-zinc-700/30 h-1'
              )}
              style={
                submitted && isClient
                  ? {
                      height: `${20 + Math.random() * 80}%`,
                      animationDelay: `${i * 0.05}s`
                    }
                  : undefined
              }
            />
          ))}
        </div>

        <p className="h-3 text-[10px] text-zinc-400">{submitted ? 'Playing...' : 'Click to hear'}</p>
      </div>
    </div>
  )
}

