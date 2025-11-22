const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

async function fetchAPI(endpoint: string, options?: RequestInit) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }))
    throw new Error(error.error || `HTTP error! status: ${response.status}`)
  }

  return response.json()
}

// User API
export const userAPI = {
  async getUser(walletAddress: string) {
    return fetchAPI(`/user/${walletAddress}`)
  },

  async updateUser(walletAddress: string, data: any) {
    return fetchAPI(`/user/${walletAddress}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },

  async recordReferral(walletAddress: string, referrerCode: string) {
    return fetchAPI(`/user/${walletAddress}/referral`, {
      method: 'POST',
      body: JSON.stringify({ referrerCode }),
    })
  },
}

// Check-in API
export const checkinAPI = {
  async getCheckins(walletAddress: string): Promise<string[]> {
    const data = await fetchAPI(`/checkins/${walletAddress}`)
    return data.dates || []
  },

  async addCheckin(walletAddress: string, date: string) {
    return fetchAPI(`/checkins/${walletAddress}`, {
      method: 'POST',
      body: JSON.stringify({ date }),
    })
  },

  async removeCheckin(walletAddress: string, date: string) {
    return fetchAPI(`/checkins/${walletAddress}/${date}`, {
      method: 'DELETE',
    })
  },
}

// Achievements API
export const achievementsAPI = {
  async getAchievements(walletAddress: string) {
    return fetchAPI(`/achievements/${walletAddress}`)
  },

  async unlockAchievement(walletAddress: string, achievementId: string, xp: number) {
    return fetchAPI(`/achievements/${walletAddress}/unlock`, {
      method: 'POST',
      body: JSON.stringify({ achievementId, xp }),
    })
  },

  async unlockSupporterBadge(walletAddress: string, badgeId: string, xp: number) {
    return fetchAPI(`/achievements/${walletAddress}/supporter-badge`, {
      method: 'POST',
      body: JSON.stringify({ badgeId, xp }),
    })
  },

  async unlockInviteBadge(walletAddress: string, badgeId: string, xp: number) {
    return fetchAPI(`/achievements/${walletAddress}/invite-badge`, {
      method: 'POST',
      body: JSON.stringify({ badgeId, xp }),
    })
  },
}

