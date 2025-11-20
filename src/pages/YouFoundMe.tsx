import { useState, useRef, useEffect } from 'react'
import MainLayout from '@/components/MainLayout'
import { Headphones } from 'lucide-react'
import AnoAI from '@/components/ui/animated-shader-background'
import { ComicText } from '@/components/ui/comic-text'

// Subtitle data with timing (in seconds)
// Adjust these timings based on your actual audio duration
const SUBTITLES = [
  { start: 0, end: 3, text: 'Little warm creatures…' },
  { start: 3, end: 8, text: 'You truly believe that with your light, your wands, your childish spells,' },
  { start: 8, end: 12, text: 'you will rebuild what we have shattered…' },
  { start: 12, end: 15, text: 'You are mistaken.' },
  { start: 15, end: 19, text: 'I am the memory you can never erase.' },
  { start: 19, end: 23, text: 'I am the mother you never saw again,' },
  { start: 23, end: 27, text: 'the friend lost forever in the dark,' },
  { start: 27, end: 31, text: 'the laughter that drowned in the night.' },
  { start: 31, end: 35, text: 'Every stone you lift to rebuild your world' },
  { start: 35, end: 39, text: 'will be frozen by my kiss.' },
  { start: 39, end: 43, text: 'Every dream you dare to dream' },
  { start: 43, end: 47, text: 'I will suck dry before it even spreads its wings.' },
  { start: 47, end: 51, text: 'There is no "after" for you.' },
  { start: 51, end: 54, text: 'Only the cold.' },
  { start: 54, end: 58, text: 'Only the void I leave behind.' },
  { start: 58, end: 60, text: 'Try.' },
  { start: 60, end: 65, text: 'Build castles, schools, homes, hopes…' },
  { start: 65, end: 69, text: 'I will be there — unseen —' },
  { start: 69, end: 74, text: 'to extinguish the last candle before it is even lit.' },
  { start: 74, end: 79, text: 'You will never again see the sun the way you remember it.' },
  { start: 79, end: 83, text: 'Because your sun…' },
  { start: 83, end: 90, text: 'I swallowed it whole.' }
]

export default function YouFoundMe() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentSubtitle, setCurrentSubtitle] = useState<string>('')
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    let animationFrameId: number

    const updateSubtitle = () => {
      if (!audio) return
      const currentTime = audio.currentTime
      
      // Find the subtitle that matches the current time
      const subtitle = SUBTITLES.find((sub) => currentTime >= sub.start && currentTime < sub.end)
      
      if (subtitle) {
        setCurrentSubtitle(subtitle.text)
      } else {
        // Clear subtitle if no match found
        setCurrentSubtitle('')
      }
    }

    const handleTimeUpdate = () => {
      updateSubtitle()
    }

    // Use requestAnimationFrame for smoother updates when playing
    const animate = () => {
      if (audio && !audio.paused) {
        updateSubtitle()
        animationFrameId = requestAnimationFrame(animate)
      }
    }

    const handlePlay = () => {
      animate()
    }

    const handlePause = () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
      updateSubtitle()
    }

    const handleEnded = () => {
      setIsPlaying(false)
      setCurrentSubtitle('')
      audio.currentTime = 0
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
    }

    const handleSeeked = () => {
      updateSubtitle()
    }

    // Use both timeupdate (for compatibility) and requestAnimationFrame (for smoothness)
    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('play', handlePlay)
    audio.addEventListener('pause', handlePause)
    audio.addEventListener('ended', handleEnded)
    audio.addEventListener('seeked', handleSeeked)

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('play', handlePlay)
      audio.removeEventListener('pause', handlePause)
      audio.removeEventListener('ended', handleEnded)
      audio.removeEventListener('seeked', handleSeeked)
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
    }
  }, [])

  const handleTogglePlay = () => {
    const audio = audioRef.current
    if (!audio) return

    if (audio.paused) {
      audio.play()
      setIsPlaying(true)
    } else {
      audio.pause()
      setIsPlaying(false)
    }
  }

  return (
    <MainLayout>
      <div className="flex items-center justify-center min-h-full relative overflow-hidden">
        {/* Animated Shader Background - only in main section */}
        <div className="absolute inset-0 w-full h-full overflow-hidden z-0">
          <AnoAI />
        </div>
        <div className="max-w-4xl w-full space-y-8 relative z-10">
          {/* Character Image */}
          <div className="flex justify-center">
            <div className="relative z-20">
              <img
                src="/dark.jpg"
                alt="Character"
                className="w-64 h-64 md:w-80 md:h-80 object-cover rounded-2xl ring-2 ring-mana-500/50 shadow-glow"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-2xl" />
            </div>
          </div>

          {/* Audio Player */}
          <div className="flex flex-col items-center gap-4">
            <button
              onClick={handleTogglePlay}
              className={`
                w-20 h-20 rounded-full flex items-center justify-center transition-all
                ${isPlaying
                  ? 'bg-mana-500/20 ring-2 ring-mana-500/50 shadow-glow'
                  : 'bg-zinc-900/60 ring-2 ring-zinc-700/60 hover:bg-zinc-900/80 hover:ring-mana-500/50'
                }
              `}
            >
              {isPlaying ? (
                <div className="w-8 h-8 rounded-sm animate-spin bg-mana-400" style={{ animationDuration: '3s' }} />
              ) : (
                <Headphones className="w-8 h-8 text-zinc-300" />
              )}
            </button>

            <p className="text-sm text-zinc-400">{isPlaying ? 'Playing...' : 'Click to hear'}</p>
          </div>

          {/* Subtitles */}
          <div className="min-h-[120px] flex items-center justify-center">
            {currentSubtitle && (
              <div className="px-8 py-6">
                <ComicText fontSize={2.5} className="animate-fade-in">
                  {currentSubtitle}
                </ComicText>
              </div>
            )}
          </div>

          {/* Hidden Audio Element */}
          <audio ref={audioRef} preload="auto" className="hidden">
            <source src="/voice.mp3" type="audio/mpeg" />
          </audio>
        </div>
      </div>
    </MainLayout>
  )
}

