# 🎵 How to Enable Full-Length Songs with Jamendo

## The Problem
The Jamendo API test client IDs are suspended. You need your own API key to get full-length songs working.

## Quick Fix (5 minutes)

### Step 1: Get Your Jamendo API Key
1. Visit: **https://devportal.jamendo.com/signup**
2. Sign up for a free developer account
3. Create a new application
4. Copy your **Client ID**

### Step 2: Update the Music Server
Open `/home/aimoude149/firelives/music-server.js` and find line 85:

```javascript
clientId: '709fa152' // Valid public client ID for testing
```

Replace `709fa152` with your new Client ID:

```javascript
clientId: 'YOUR_NEW_CLIENT_ID_HERE'
```

### Step 3: Restart the Music Server
```bash
pkill -f "node.*music-server.js"
cd /home/aimoude149/firelives && node music-server.js &
```

### Step 4: Test It
```bash
curl "http://localhost:3001/api/music/search?q=rock&limit=10"
```

You should now see Jamendo results with full-length songs!

---

## Alternative: Use Other Free Music APIs

If you don't want to register for Jamendo, I can integrate these alternatives:

### Option A: Free Music Archive (FMA)
- Royalty-free music
- Creative Commons licensed
- Full-length downloads
- No API key needed (web scraping)

### Option B: Internet Archive Audio
- Public domain music
- Full-length songs
- Free API access
- Large catalog

### Option C: ccMixter
- Creative Commons remixes
- Full-length tracks
- Free downloads
- No registration

**Let me know which option you prefer, and I'll implement it!**

---

## Why This Happened
- Commercial APIs (Deezer, iTunes, JioSaavn) only provide 30-second previews due to copyright
- Jamendo provides full songs legally, but requires API registration
- Test/public API keys get suspended due to overuse
- You need your own key for reliable access

## What Works Now
✅ Deezer - 30-second previews (working)
✅ iTunes - 30-second previews (working)  
✅ JioSaavn - 30-second previews (working)
❌ Jamendo - Full songs (needs your API key)

Once you add your Jamendo key, you'll get:
- 50% full-length songs (Jamendo)
- 50% preview songs (Deezer/iTunes/JioSaavn)
