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

export function loadCheckins(): Checkins {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return new Set()
    const arr: string[] = JSON.parse(raw)
    return new Set(arr)
  } catch {
    return new Set()
  }
}

export function saveCheckins(checkins: Checkins) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(checkins)))
}

export function isChecked(checkins: Checkins, key: string): boolean {
  return checkins.has(key)
}

export function toggleDay(checkins: Checkins, key: string): Checkins {
  const next = new Set(checkins)
  if (next.has(key)) next.delete(key)
  else next.add(key)
  saveCheckins(next)
  return next
}

export function checkToday(checkins: Checkins): Checkins {
  const k = dateKey()
  if (checkins.has(k)) return checkins
  const next = new Set(checkins)
  next.add(k)
  saveCheckins(next)
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

