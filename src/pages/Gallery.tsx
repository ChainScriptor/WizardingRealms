import { useEffect, useRef, useState } from 'react'
import PlotCard from '@/components/PlotCard'
import { Plot, getPlotsSlice } from '@/utils/data'
import { motion } from 'framer-motion'

const PAGE_SIZE = 48

export default function Gallery() {
  const [items, setItems] = useState<Plot[]>([])
  const [offset, setOffset] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const loaderRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    // initial load
    const first = getPlotsSlice(0, PAGE_SIZE)
    setItems(first)
    setOffset(PAGE_SIZE)
  }, [])

  useEffect(() => {
    const el = loaderRef.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            loadMore()
          }
        })
      },
      { rootMargin: '1000px 0px 1000px 0px' }
    )
    io.observe(el)
    return () => io.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaderRef.current])

  function loadMore() {
    if (!hasMore) return
    const next = getPlotsSlice(offset, PAGE_SIZE)
    setItems((prev) => [...prev, ...next])
    setOffset((o) => o + PAGE_SIZE)
    if (next.length < PAGE_SIZE) setHasMore(false)
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <div className="font-wizard text-3xl glow-text">Enchanted Plots</div>
          <div className="text-zinc-400 mt-1">Total 15,555</div>
        </div>
      </div>

      <div className="masonry md:columns-2 lg:columns-3 xl:columns-4">
        {items.map((plot) => (
          <motion.div
            key={plot.id}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <PlotCard plot={plot} />
          </motion.div>
        ))}
      </div>

      <div ref={loaderRef} className="h-12"></div>
      {!hasMore && (
        <div className="text-center text-zinc-400 py-6">You have reached the ancient edge of the realm.</div>
      )}
    </div>
  )
}

