import { RarityTier } from './rarity'

export type House = 'Gryffindor' | 'Slytherin' | 'Ravenclaw' | 'Hufflepuff'

export interface Plot {
  id: number
  title: string
  image: string
  rarity: RarityTier
  house: House
  hasRoomOfRequirement: boolean
  traits: Array<{ name: string; value: string }>
  manaYield: number
}

const forestImages = [
  'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=2070&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=2070&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1499346030926-9a72daac6c63?q=80&w=2069&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=2070&auto=format&fit=crop'
]

const rarities: RarityTier[] = ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary', 'Mythic']
const houses: House[] = ['Gryffindor', 'Slytherin', 'Ravenclaw', 'Hufflepuff']

export function generatePlot(id: number): Plot {
  const rarity = weightedRarity()
  const house = houses[id % houses.length]
  const traits = [
    { name: 'Biome', value: ['Forest', 'Cliff', 'River', 'Cave'][id % 4] },
    { name: 'Relic', value: ['Wand Core', 'Phoenix Feather', 'Basilisk Fang', 'Time Turner'][id % 4] },
    { name: 'Sky', value: ['Aurora', 'Stormy', 'Clear Night', 'Misty'][id % 4] },
    { name: 'Creature', value: ['Hippogriff', 'Thestral', 'Phoenix', 'Niffler'][id % 4] }
  ]
  return {
    id,
    title: `Plot #${id.toString().padStart(4, '0')}`,
    image: forestImages[id % forestImages.length],
    rarity,
    house,
    hasRoomOfRequirement: (id % 37) === 0,
    traits,
    manaYield: Math.floor(Math.random() * 100) + rarityWeight(rarity) * 10
  }
}

export function getPlotsSlice(offset: number, limit: number): Plot[] {
  const max = 15555
  const end = Math.min(offset + limit, max)
  const arr: Plot[] = []
  for (let i = offset; i < end; i++) {
    arr.push(generatePlot(i + 1))
  }
  return arr
}

function weightedRarity(): RarityTier {
  const r = Math.random()
  if (r < 0.60) return 'Common'
  if (r < 0.85) return 'Uncommon'
  if (r < 0.95) return 'Rare'
  if (r < 0.985) return 'Epic'
  if (r < 0.998) return 'Legendary'
  return 'Mythic'
}

export function rarityWeight(r: RarityTier): number {
  switch (r) {
    case 'Common':
      return 1
    case 'Uncommon':
      return 2
    case 'Rare':
      return 3
    case 'Epic':
      return 5
    case 'Legendary':
      return 8
    case 'Mythic':
      return 13
  }
}

