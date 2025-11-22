import { checkinAPI } from '@/services/api'

const STORAGE_KEY = 'wr.checkins'

export type Checkins = Set<string>

export function dateKey(d = new Date()): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function addDays(d: Date, delta: number): Date {
  const nd = new Date(d)
  nd.setDate(nd.getDate() + delta)
  return nd
}

// Load check-ins from MongoDB (requires wallet address)
export async function loadCheckins(walletAddress: string | null): Promise<Checkins> {
  if (!walletAddress) {
    // Fallback to localStorage if no wallet connected
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return new Set()
      const arr: string[] = JSON.parse(raw)
      return new Set(arr)
    } catch {
      return new Set()
    }
  }

  try {
    const dates = await checkinAPI.getCheckins(walletAddress)
    return new Set(dates)
  } catch (error) {
    console.error('Error loading check-ins from API:', error)
    // Fallback to localStorage
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return new Set()
      const arr: string[] = JSON.parse(raw)
      return new Set(arr)
    } catch {
      return new Set()
    }
  }
}

// Save check-ins to MongoDB (requires wallet address)
export async function saveCheckins(checkins: Checkins, walletAddress: string | null) {
  if (!walletAddress) {
    // Fallback to localStorage if no wallet connected
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(checkins)))
    return
  }

  try {
    // Sync all check-ins to MongoDB
    const dates = Array.from(checkins)
    for (const date of dates) {
      try {
        await checkinAPI.addCheckin(walletAddress, date)
      } catch (error) {
        console.error(`Error saving check-in ${date}:`, error)
      }
    }
    // Also save to localStorage as backup
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dates))
  } catch (error) {
    console.error('Error saving check-ins to API:', error)
    // Fallback to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(checkins)))
  }
}

export function isChecked(checkins: Checkins, key: string): boolean {
  return checkins.has(key)
}

export async function toggleDay(
  checkins: Checkins,
  key: string,
  walletAddress: string | null
): Promise<Checkins> {
  const next = new Set(checkins)
  if (next.has(key)) {
    next.delete(key)
    if (walletAddress) {
      try {
        await checkinAPI.removeCheckin(walletAddress, key)
      } catch (error) {
        console.error('Error removing check-in:', error)
      }
    }
  } else {
    next.add(key)
    if (walletAddress) {
      try {
        await checkinAPI.addCheckin(walletAddress, key)
      } catch (error) {
        console.error('Error adding check-in:', error)
      }
    }
  }
  await saveCheckins(next, walletAddress)
  return next
}

export async function checkToday(
  checkins: Checkins,
  walletAddress: string | null
): Promise<Checkins> {
  const k = dateKey()
  if (checkins.has(k)) return checkins
  
  const next = new Set(checkins)
  next.add(k)
  await saveCheckins(next, walletAddress)
  
  // The backend will automatically update totalCheckins and currentStreak
  // when the check-in is saved via the API
  
  return next
}

export function computeStreak(checkins: Checkins): number {
  let streak = 0
  let day = new Date()
  while (true) {
    const k = dateKey(day)
    if (checkins.has(k)) {
      streak += 1
      day = addDays(day, -1)
    } else {
      break
    }
  }
  return streak
}

export function lastNDays(n: number): string[] {
  const out: string[] = []
  for (let i = n - 1; i >= 0; i--) {
    out.push(dateKey(addDays(new Date(), -i)))
  }
  return out
}

