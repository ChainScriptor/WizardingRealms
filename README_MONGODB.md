# MongoDB Integration for Wizarding Realms

Η ενσωμάτωση MongoDB έχει ολοκληρωθεί! Όλα τα δεδομένα των χρηστών (πορτοφόλι, check-ins, achievements, referrals) αποθηκεύονται τώρα στη MongoDB.

## Setup

### 1. Εγκατάσταση Backend Dependencies

```bash
cd server
npm install
```

### 2. Environment Variables

Δημιούργησε ένα `.env` αρχείο στον φάκελο `server`:

```env
MONGODB_URI=mongodb+srv://wizarding_realms:-Slayertiger39@cluster0.f7dcxtt.mongodb.net/?appName=Cluster0
PORT=3001
```

**Σημείωση**: Το connection string είναι ήδη ρυθμισμένο στον κώδικα, αλλά καλύτερα να το βάλεις στο `.env` για ασφάλεια.

### 3. Εκκίνηση Backend Server

```bash
cd server
npm run dev
```

Ο API server θα τρέξει στο `http://localhost:3001`

### 4. Frontend Environment

Πρόσθεσε στο frontend `.env` αρχείο (ή άλλαξε το `src/services/api.ts`):

```env
VITE_API_URL=http://localhost:3001/api
```

Για production, άλλαξε το `API_BASE_URL` στο `src/services/api.ts`.

## Database Schema

### Collections

#### `users`
- `walletAddress` (string, unique, indexed)
- `referralCode` (string, unique, indexed)
- `referredBy` (string, nullable) - wallet address of referrer
- `invitedCount` (number) - number of successful referrals
- `totalXP` (number) - total experience points
- `totalCheckins` (number) - **total number of daily check-ins** (never resets)
- `currentStreak` (number) - **current consecutive days streak** (resets to 0 if a day is missed)
- `lastCheckinDate` (string, nullable) - last check-in date (YYYY-MM-DD format)
- `unlockedAchievements` (array of strings) - streak achievement IDs (e.g., "streak-3", "streak-7")
- `unlockedSupporterBadges` (array of strings) - supporter badge IDs (e.g., "helping-paw", "golden-pawtato")
- `unlockedInviteBadges` (array of strings) - invite badge IDs (e.g., "friendly", "gold", "galactic")
- `createdAt` (Date)
- `updatedAt` (Date)

#### `checkins`
- `walletAddress` (string, indexed)
- `date` (string) - format: "YYYY-MM-DD"
- `checkedAt` (Date)
- Unique index on `(walletAddress, date)`

#### `referrals`
- `referrerWallet` (string, indexed)
- `referredWallet` (string, indexed)
- `createdAt` (Date)
- Unique index on `(referrerWallet, referredWallet)`

## API Endpoints

### User Endpoints

- `GET /api/user/:walletAddress` - Get or create user
- `PUT /api/user/:walletAddress` - Update user
- `POST /api/user/:walletAddress/referral` - Record referral

### Check-in Endpoints

- `GET /api/checkins/:walletAddress` - Get all check-ins for user
- `POST /api/checkins/:walletAddress` - Add check-in
- `DELETE /api/checkins/:walletAddress/:date` - Remove check-in

### Achievement Endpoints

- `GET /api/achievements/:walletAddress` - Get all unlocked achievements and badges
- `POST /api/achievements/:walletAddress/unlock` - Unlock streak achievement
- `POST /api/achievements/:walletAddress/supporter-badge` - Unlock supporter badge
- `POST /api/achievements/:walletAddress/invite-badge` - Unlock invite badge

## Features

1. **Wallet-based User Profiles**: Each wallet address has a unique profile
2. **Daily Check-ins**: Tracked per wallet with date-based storage
3. **Referral System**: Automatic tracking when users visit with `?ref=CODE`
4. **Streak Achievements**: Auto-unlocked based on daily check-in streak milestones
5. **Invite Badges**: Auto-unlocked based on number of referrals (Circle Expander badges)
6. **Supporter Badges**: Track unlocked supporter badges (when user contributes SUI)
7. **XP System**: Total XP tracked per user (awarded when unlocking achievements/badges)
8. **Complete Badge Tracking**: All badges and achievements are permanently stored in MongoDB

## Automatic User Registration & Badge Sync

**Κάθε φορά που ένας χρήστης συνδέει το πορτοφόλι του:**
- Αυτόματα δημιουργείται/φορτώνεται ο χρήστης στη MongoDB
- Το `useWalletRegistration` hook (στο `App.tsx`) παρακολουθεί το wallet connection
- Καλείται το `GET /api/user/:walletAddress` που δημιουργεί νέο χρήστη αν δεν υπάρχει
- Το `useBadgeSync` hook συγχρονίζει όλα τα badges/achievements στη MongoDB:
  - **Streak Achievements**: Συγχρονίζονται βάσει του current streak από check-ins
  - **Invite Badges**: Συγχρονίζονται βάσει του `invitedCount`
  - **Supporter Badges**: Διατηρούνται στη βάση
- Όλα τα δεδομένα (check-ins, achievements, badges) αποθηκεύονται με το wallet address

**Στη MongoDB μπορείς να δεις:**
- `users` collection: Κάθε χρήστης με:
  - `walletAddress`: Το πορτοφόλι
  - `unlockedAchievements`: Array με streak achievement IDs (π.χ. ["streak-3", "streak-7"])
  - `unlockedInviteBadges`: Array με invite badge IDs (π.χ. ["friendly", "gold"])
  - `unlockedSupporterBadges`: Array με supporter badge IDs (π.χ. ["helping-paw"])
  - `totalXP`: Συνολικό XP
  - `invitedCount`: Αριθμός referrals

## Migration from localStorage

The system includes fallback to localStorage if:
- Wallet is not connected
- API is unavailable
- Error occurs during API calls

Data will be synced to MongoDB when wallet is connected and API is available.

