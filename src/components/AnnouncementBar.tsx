import { Banner } from '@/components/ui/banner'

export default function AnnouncementBar() {
  return (
    <Banner
      id="wiz-live-banner"
      variant="rainbow"
      height="3.5rem"
      className="shadow-lg bg-zinc-900/90 backdrop-blur-sm border-b border-zinc-800/50"
      rainbowColors={[
        "rgba(231,77,255,0.77)",
        "rgba(231,77,255,0.77)",
        "transparent",
        "rgba(231,77,255,0.77)",
        "transparent",
        "rgba(231,77,255,0.77)",
        "transparent",
      ]}
    >
      🚀 Project evolving more features soon!
    </Banner>
  )
}

