export type RarityTier = 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary' | 'Mythic'

export function rarityToClass(tier: RarityTier): string {
  switch (tier) {
    case 'Common':
      return 'ring-[--rarity-common] shadow'
    case 'Uncommon':
      return 'ring-[--rarity-uncommon] shadow-glow'
    case 'Rare':
      return 'ring-[--rarity-rare] shadow-glow'
    case 'Epic':
      return 'ring-[--rarity-epic] shadow-glow'
    case 'Legendary':
      return 'ring-[--rarity-legendary] shadow-glow-gold'
    case 'Mythic':
      return 'ring-[--rarity-mythic] shadow-glow-mythic'
    default:
      return 'ring-zinc-600'
  }
}

export function tierToColorHex(tier: RarityTier): string {
  const map: Record<RarityTier, string> = {
    Common: '#5a5a5a',
    Uncommon: '#2dd4bf',
    Rare: '#60a5fa',
    Epic: '#a78bfa',
    Legendary: '#f59e0b',
    Mythic: '#f472b6'
  }
  return map[tier]
}

