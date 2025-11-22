import express from 'express'
import cors from 'cors'
import { MongoClient } from 'mongodb'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors())
app.use(express.json())

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://wizarding_realms:-Slayertiger39@cluster0.f7dcxtt.mongodb.net/?appName=Cluster0'
const DB_NAME = 'wizarding_realms'

let db = null
let client = null

async function connectDB() {
  try {
    client = new MongoClient(MONGODB_URI)
    await client.connect()
    db = client.db(DB_NAME)
    console.log('✅ Connected to MongoDB')
    
    // Create indexes
    await db.collection('users').createIndex({ walletAddress: 1 }, { unique: true })
    await db.collection('users').createIndex({ referralCode: 1 }, { unique: true, sparse: true })
    await db.collection('checkins').createIndex({ walletAddress: 1, date: 1 }, { unique: true })
    await db.collection('referrals').createIndex({ referrerWallet: 1, referredWallet: 1 }, { unique: true })
  } catch (error) {
    console.error('❌ MongoDB connection error:', error)
    throw error
  }
}

// Initialize database connection
connectDB().catch(console.error)

// ========== USER ENDPOINTS ==========

// Get or create user
app.get('/api/user/:walletAddress', async (req, res) => {
  try {
    const { walletAddress } = req.params
    
    let user = await db.collection('users').findOne({ walletAddress })
    
    if (!user) {
      // Create new user - this happens automatically when wallet connects
      const referralCode = walletAddress.slice(2, 10)
      user = {
        walletAddress,
        referralCode,
        referredBy: null,
        invitedCount: 0,
        totalXP: 0,
        totalCheckins: 0,
        currentStreak: 0,
        lastCheckinDate: null,
        unlockedAchievements: [],
        unlockedSupporterBadges: [],
        unlockedInviteBadges: [],
        createdAt: new Date(),
        updatedAt: new Date()
      }
      await db.collection('users').insertOne(user)
      console.log(`✅ New user created: ${walletAddress} (referral: ${referralCode})`)
    } else {
      // Update last connection time and ensure all fields exist
      await db.collection('users').updateOne(
        { walletAddress },
        { 
          $set: { 
            updatedAt: new Date(),
            // Ensure all badge arrays exist (for backward compatibility)
            unlockedAchievements: user.unlockedAchievements || [],
            unlockedSupporterBadges: user.unlockedSupporterBadges || [],
            unlockedInviteBadges: user.unlockedInviteBadges || [],
            // Ensure check-in stats exist
            totalCheckins: user.totalCheckins ?? 0,
            currentStreak: user.currentStreak ?? 0
          } 
        }
      )
      // Reload user to get updated data
      user = await db.collection('users').findOne({ walletAddress })
    }
    
    res.json(user)
  } catch (error) {
    console.error('Error getting user:', error)
    res.status(500).json({ error: error.message })
  }
})

// Update user
app.put('/api/user/:walletAddress', async (req, res) => {
  try {
    const { walletAddress } = req.params
    const updateData = {
      ...req.body,
      updatedAt: new Date()
    }
    
    const result = await db.collection('users').findOneAndUpdate(
      { walletAddress },
      { $set: updateData },
      { returnDocument: 'after', upsert: true }
    )
    
    res.json(result.value)
  } catch (error) {
    console.error('Error updating user:', error)
    res.status(500).json({ error: error.message })
  }
})

// Handle referral tracking
app.post('/api/user/:walletAddress/referral', async (req, res) => {
  try {
    const { walletAddress } = req.params
    const { referrerCode } = req.body
    
    // Find referrer by code
    const referrer = await db.collection('users').findOne({ referralCode: referrerCode })
    
    if (!referrer || referrer.walletAddress === walletAddress) {
      return res.status(400).json({ error: 'Invalid referral code' })
    }
    
    // Check if already referred
    const existingReferral = await db.collection('referrals').findOne({
      referrerWallet: referrer.walletAddress,
      referredWallet: walletAddress
    })
    
    if (existingReferral) {
      return res.json({ message: 'Already referred', referrer: referrer.walletAddress })
    }
    
    // Create referral record
    await db.collection('referrals').insertOne({
      referrerWallet: referrer.walletAddress,
      referredWallet: walletAddress,
      createdAt: new Date()
    })
    
    // Update user's referredBy
    await db.collection('users').updateOne(
      { walletAddress },
      { $set: { referredBy: referrer.walletAddress, updatedAt: new Date() } }
    )
    
    // Update referrer's invitedCount
    await db.collection('users').updateOne(
      { walletAddress: referrer.walletAddress },
      { 
        $inc: { invitedCount: 1 },
        $set: { updatedAt: new Date() }
      }
    )
    
    res.json({ 
      message: 'Referral recorded',
      referrer: referrer.walletAddress,
      invitedCount: referrer.invitedCount + 1
    })
  } catch (error) {
    console.error('Error recording referral:', error)
    res.status(500).json({ error: error.message })
  }
})

// ========== CHECK-IN ENDPOINTS ==========

// Helper function to calculate current streak (resets if a day is missed)
async function calculateStreak(db, walletAddress) {
  const checkins = await db.collection('checkins')
    .find({ walletAddress })
    .sort({ date: -1 })
    .toArray()
  
  if (checkins.length === 0) return 0
  
  // Sort dates and check for consecutive days starting from today
  const dates = checkins.map(c => c.date).sort().reverse()
  let streak = 0
  let expectedDate = new Date()
  expectedDate.setHours(0, 0, 0, 0)
  
  for (const dateStr of dates) {
    const checkinDate = new Date(dateStr + 'T00:00:00')
    checkinDate.setHours(0, 0, 0, 0)
    
    // Check if this date matches expected date
    const daysDiff = Math.floor((expectedDate.getTime() - checkinDate.getTime()) / (1000 * 60 * 60 * 24))
    
    if (daysDiff === 0) {
      // Today - start or continue streak
      streak++
      expectedDate = new Date(checkinDate)
      expectedDate.setDate(expectedDate.getDate() - 1)
    } else if (daysDiff === 1 && streak > 0) {
      // Yesterday - continue streak
      streak++
      expectedDate = new Date(checkinDate)
      expectedDate.setDate(expectedDate.getDate() - 1)
    } else if (daysDiff > 1) {
      // Gap found - streak broken
      break
    }
  }
  
  return streak
}

// Get check-ins for a user
app.get('/api/checkins/:walletAddress', async (req, res) => {
  try {
    const { walletAddress } = req.params
    const checkins = await db.collection('checkins')
      .find({ walletAddress })
      .sort({ date: 1 })
      .toArray()
    
    const dates = checkins.map(c => c.date)
    res.json({ dates })
  } catch (error) {
    console.error('Error getting check-ins:', error)
    res.status(500).json({ error: error.message })
  }
})

// Add check-in
app.post('/api/checkins/:walletAddress', async (req, res) => {
  try {
    const { walletAddress } = req.params
    const { date } = req.body
    
    // Check if check-in already exists
    const existing = await db.collection('checkins').findOne({ walletAddress, date })
    if (existing) {
      // Already checked in today, just recalculate streak
      const streak = await calculateStreak(db, walletAddress)
      const totalCheckins = await db.collection('checkins').countDocuments({ walletAddress })
      await db.collection('users').updateOne(
        { walletAddress },
        { $set: { currentStreak: streak, totalCheckins, lastCheckinDate: date, updatedAt: new Date() } }
      )
      return res.json({ date, streak, totalCheckins })
    }
    
    // Add new check-in
    const result = await db.collection('checkins').findOneAndUpdate(
      { walletAddress, date },
      { 
        $set: { 
          walletAddress, 
          date, 
          checkedAt: new Date() 
        } 
      },
      { upsert: true, returnDocument: 'after' }
    )
    
    // Update user stats
    const user = await db.collection('users').findOne({ walletAddress })
    if (user) {
      const totalCheckins = await db.collection('checkins').countDocuments({ walletAddress })
      const streak = await calculateStreak(db, walletAddress)
      
      await db.collection('users').updateOne(
        { walletAddress },
        { 
          $set: { 
            totalCheckins,
            currentStreak: streak,
            lastCheckinDate: date,
            updatedAt: new Date() 
          } 
        }
      )
      
      console.log(`✅ Check-in added: ${walletAddress} - Total: ${totalCheckins}, Streak: ${streak}`)
    }
    
    res.json({ date: result.value.date })
  } catch (error) {
    console.error('Error adding check-in:', error)
    res.status(500).json({ error: error.message })
  }
})

// Remove check-in
app.delete('/api/checkins/:walletAddress/:date', async (req, res) => {
  try {
    const { walletAddress, date } = req.params
    
    await db.collection('checkins').deleteOne({ walletAddress, date })
    
    // Recalculate user stats
    const user = await db.collection('users').findOne({ walletAddress })
    if (user) {
      const totalCheckins = await db.collection('checkins').countDocuments({ walletAddress })
      const streak = await calculateStreak(db, walletAddress)
      
      await db.collection('users').updateOne(
        { walletAddress },
        { 
          $set: { 
            totalCheckins,
            currentStreak: streak,
            updatedAt: new Date() 
          } 
        }
      )
    }
    
    res.json({ message: 'Check-in removed' })
  } catch (error) {
    console.error('Error removing check-in:', error)
    res.status(500).json({ error: error.message })
  }
})

// ========== ACHIEVEMENTS ENDPOINTS ==========

// Get achievements for a user
app.get('/api/achievements/:walletAddress', async (req, res) => {
  try {
    const { walletAddress } = req.params
    const user = await db.collection('users').findOne({ walletAddress })
    
    res.json({
      unlockedAchievements: user?.unlockedAchievements || [],
      unlockedSupporterBadges: user?.unlockedSupporterBadges || [],
      unlockedInviteBadges: user?.unlockedInviteBadges || []
    })
  } catch (error) {
    console.error('Error getting achievements:', error)
    res.status(500).json({ error: error.message })
  }
})

// Unlock achievement
app.post('/api/achievements/:walletAddress/unlock', async (req, res) => {
  try {
    const { walletAddress } = req.params
    const { achievementId, xp } = req.body
    
    const user = await db.collection('users').findOne({ walletAddress })
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }
    
    if (user.unlockedAchievements?.includes(achievementId)) {
      return res.json({ message: 'Already unlocked', user })
    }
    
    await db.collection('users').updateOne(
      { walletAddress },
      {
        $addToSet: { unlockedAchievements: achievementId },
        $inc: { totalXP: xp || 0 },
        $set: { updatedAt: new Date() }
      }
    )
    
    const updatedUser = await db.collection('users').findOne({ walletAddress })
    console.log(`✅ Achievement unlocked: ${achievementId} for ${walletAddress} (+${xp} XP)`)
    res.json(updatedUser)
  } catch (error) {
    console.error('Error unlocking achievement:', error)
    res.status(500).json({ error: error.message })
  }
})

// Unlock supporter badge
app.post('/api/achievements/:walletAddress/supporter-badge', async (req, res) => {
  try {
    const { walletAddress } = req.params
    const { badgeId, xp } = req.body
    
    const user = await db.collection('users').findOne({ walletAddress })
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }
    
    if (user.unlockedSupporterBadges?.includes(badgeId)) {
      return res.json({ message: 'Already unlocked', user })
    }
    
    await db.collection('users').updateOne(
      { walletAddress },
      {
        $addToSet: { unlockedSupporterBadges: badgeId },
        $inc: { totalXP: xp || 0 },
        $set: { updatedAt: new Date() }
      }
    )
    
    const updatedUser = await db.collection('users').findOne({ walletAddress })
    console.log(`✅ Supporter badge unlocked: ${badgeId} for ${walletAddress} (+${xp} XP)`)
    res.json(updatedUser)
  } catch (error) {
    console.error('Error unlocking supporter badge:', error)
    res.status(500).json({ error: error.message })
  }
})

// Unlock invite badge
app.post('/api/achievements/:walletAddress/invite-badge', async (req, res) => {
  try {
    const { walletAddress } = req.params
    const { badgeId, xp } = req.body
    
    const user = await db.collection('users').findOne({ walletAddress })
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }
    
    if (user.unlockedInviteBadges?.includes(badgeId)) {
      return res.json({ message: 'Already unlocked', user })
    }
    
    await db.collection('users').updateOne(
      { walletAddress },
      {
        $addToSet: { unlockedInviteBadges: badgeId },
        $inc: { totalXP: xp || 0 },
        $set: { updatedAt: new Date() }
      }
    )
    
    const updatedUser = await db.collection('users').findOne({ walletAddress })
    console.log(`✅ Invite badge unlocked: ${badgeId} for ${walletAddress} (+${xp} XP)`)
    res.json(updatedUser)
  } catch (error) {
    console.error('Error unlocking invite badge:', error)
    res.status(500).json({ error: error.message })
  }
})

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', db: db ? 'connected' : 'disconnected' })
})

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
})

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, closing MongoDB connection...')
  if (client) {
    await client.close()
  }
  process.exit(0)
})

