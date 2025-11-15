# 🎵 Real Music API Integration Guide

## Overview
This guide shows how to integrate **real music APIs** into FireLives for actual music search, playback, and streaming.

---

## 🎧 Available Music APIs

### 1. **Spotify Web API** (Recommended)
- **Best for:** Full music catalog, high-quality playback
- **Features:** 70M+ tracks, playlists, albums, artists
- **Playback:** 30-second previews (free), full tracks (Premium required)
- **Cost:** Free tier available
- **Docs:** https://developer.spotify.com/documentation/web-api

### 2. **Deezer API** (Free Alternative)
- **Best for:** Free music streaming
- **Features:** 90M+ tracks, full 30-second previews
- **Playback:** Free preview URLs
- **Cost:** Completely free
- **Docs:** https://developers.deezer.com/api

### 3. **Last.fm API**
- **Best for:** Music metadata, recommendations, scrobbling
- **Features:** Artist info, similar tracks, top charts
- **Playback:** No direct playback (metadata only)
- **Cost:** Free
- **Docs:** https://www.last.fm/api

### 4. **Jamendo API**
- **Best for:** Free, legal music streaming
- **Features:** 500K+ Creative Commons tracks
- **Playback:** Full track streaming (free)
- **Cost:** Free
- **Docs:** https://developer.jamendo.com/

### 5. **SoundCloud API**
- **Best for:** Independent artists, remixes
- **Features:** 200M+ tracks
- **Playback:** Full streaming
- **Cost:** Free (limited), paid tiers available
- **Docs:** https://developers.soundcloud.com/

---

## 🚀 Quick Start: Deezer API (Easiest)

Deezer is the **easiest to integrate** - no API key required for basic search!

### Step 1: Search for Music
```javascript
async function searchMusic(query) {
    const response = await fetch(`https://api.deezer.com/search?q=${encodeURIComponent(query)}`);
    const data = await response.json();
    return data.data; // Array of tracks
}
```

### Step 2: Get Track Details
```javascript
async function getTrack(trackId) {
    const response = await fetch(`https://api.deezer.com/track/${trackId}`);
    return await response.json();
}
```

### Step 3: Play Preview (30 seconds)
```javascript
const audio = new Audio(track.preview); // 30-second preview URL
audio.play();
```

---

## 🎵 Integration Example: Spotify API

### Step 1: Get API Credentials
1. Go to https://developer.spotify.com/dashboard
2. Create an app
3. Get your **Client ID** and **Client Secret**

### Step 2: Get Access Token
```javascript
async function getSpotifyToken(clientId, clientSecret) {
    const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret)
        },
        body: 'grant_type=client_credentials'
    });
    const data = await response.json();
    return data.access_token;
}
```

### Step 3: Search for Music
```javascript
async function searchSpotify(query, token) {
    const response = await fetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=20`,
        {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
    );
    const data = await response.json();
    return data.tracks.items;
}
```

### Step 4: Play Track Preview
```javascript
const audio = new Audio(track.preview_url); // 30-second preview
audio.play();
```

---

## 🔥 Complete Integration for FireLives

### Backend API (Node.js + Express)

```javascript
// server.js
const express = require('express');
const axios = require('axios');
const app = express();

// Deezer Search (No API key needed!)
app.get('/api/music/search', async (req, res) => {
    try {
        const { q } = req.query;
        const response = await axios.get(`https://api.deezer.com/search?q=${q}`);
        
        const tracks = response.data.data.map(track => ({
            id: track.id,
            title: track.title,
            artist: track.artist.name,
            album: track.album.title,
            duration: track.duration,
            preview: track.preview, // 30-second preview URL
            cover: track.album.cover_medium,
            coverLarge: track.album.cover_xl
        }));
        
        res.json({ success: true, tracks });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get Track by ID
app.get('/api/music/track/:id', async (req, res) => {
    try {
        const response = await axios.get(`https://api.deezer.com/track/${req.params.id}`);
        res.json({ success: true, track: response.data });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get Artist Info
app.get('/api/music/artist/:id', async (req, res) => {
    try {
        const response = await axios.get(`https://api.deezer.com/artist/${req.params.id}`);
        res.json({ success: true, artist: response.data });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get Top Charts
app.get('/api/music/charts', async (req, res) => {
    try {
        const response = await axios.get('https://api.deezer.com/chart');
        res.json({ success: true, charts: response.data });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get Genre Playlists
app.get('/api/music/genre/:id', async (req, res) => {
    try {
        const response = await axios.get(`https://api.deezer.com/genre/${req.params.id}/artists`);
        res.json({ success: true, artists: response.data.data });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.listen(3001, () => console.log('Music API server running on port 3001'));
```

---

## 🎨 Frontend Integration

### Search Music
```javascript
async function searchMusic(query) {
    try {
        const response = await fetch(`/api/music/search?q=${encodeURIComponent(query)}`);
        const data = await response.json();
        if (data.success) {
            setSearchResults(data.tracks);
        }
    } catch (error) {
        console.error('Search error:', error);
    }
}
```

### Play Track
```javascript
function playTrack(track) {
    if (audioRef.current) {
        audioRef.current.src = track.preview; // 30-second preview
        audioRef.current.play();
        setCurrentTrack(track);
        setIsPlaying(true);
    }
}
```

---

## 🌟 Deezer API Endpoints

### Search
- **Tracks:** `https://api.deezer.com/search?q=eminem`
- **Albums:** `https://api.deezer.com/search/album?q=thriller`
- **Artists:** `https://api.deezer.com/search/artist?q=drake`
- **Playlists:** `https://api.deezer.com/search/playlist?q=workout`

### Browse
- **Charts:** `https://api.deezer.com/chart`
- **Genres:** `https://api.deezer.com/genre`
- **Radio:** `https://api.deezer.com/radio`

### Details
- **Track:** `https://api.deezer.com/track/{id}`
- **Album:** `https://api.deezer.com/album/{id}`
- **Artist:** `https://api.deezer.com/artist/{id}`
- **Playlist:** `https://api.deezer.com/playlist/{id}`

---

## 🎯 Genre IDs (Deezer)

```javascript
const GENRES = {
    POP: 132,
    ROCK: 152,
    ELECTRONIC: 106,
    HIP_HOP: 116,
    JAZZ: 129,
    CLASSICAL: 98,
    REGGAE: 144,
    COUNTRY: 100,
    BLUES: 95,
    METAL: 464
};
```

---

## 🔒 CORS Proxy (If Needed)

If you encounter CORS issues, use a proxy:

```javascript
// Option 1: Use cors-anywhere
const PROXY = 'https://cors-anywhere.herokuapp.com/';
const url = PROXY + 'https://api.deezer.com/search?q=test';

// Option 2: Set up your own proxy
app.use('/proxy', (req, res) => {
    const url = req.query.url;
    axios.get(url).then(response => res.json(response.data));
});
```

---

## 📊 Response Format (Deezer)

```json
{
  "data": [
    {
      "id": 3135556,
      "title": "Harder, Better, Faster, Stronger",
      "duration": 224,
      "preview": "https://cdns-preview-e.dzcdn.net/stream/...",
      "artist": {
        "id": 27,
        "name": "Daft Punk",
        "picture": "https://api.deezer.com/artist/27/image"
      },
      "album": {
        "id": 302127,
        "title": "Discovery",
        "cover": "https://api.deezer.com/album/302127/image",
        "cover_medium": "https://e-cdns-images.dzcdn.net/images/cover/...",
        "cover_xl": "https://e-cdns-images.dzcdn.net/images/cover/..."
      }
    }
  ]
}
```

---

## 🚀 Next Steps

1. **Choose API:** Start with Deezer (easiest, no key needed)
2. **Create Backend:** Set up Express server with music endpoints
3. **Update Frontend:** Replace mock data with real API calls
4. **Add Features:**
   - Real-time search
   - Genre browsing
   - Top charts
   - Artist pages
   - Album pages
   - Playlists
5. **Enhance Playback:**
   - Queue management
   - Shuffle/repeat
   - Volume control
   - Progress bar
6. **Add Premium Features:**
   - Full track playback (requires Spotify Premium API)
   - Offline downloads
   - High-quality audio
   - No ads

---

## 💡 Pro Tips

1. **Cache API responses** to reduce requests
2. **Implement rate limiting** to avoid API bans
3. **Use CDN** for album artwork
4. **Preload audio** for smooth playback
5. **Add error handling** for failed requests
6. **Show loading states** during API calls
7. **Implement pagination** for large result sets

---

## 📝 Legal Notes

- **Deezer:** 30-second previews are free and legal
- **Spotify:** 30-second previews are free and legal
- **Full playback:** Requires proper licensing and user authentication
- **Commercial use:** Check each API's terms of service

---

## 🎉 Ready to Rock!

You now have everything you need to integrate **real music** into FireLives! Start with Deezer for the easiest implementation, then expand to Spotify for more features.

**Questions?** Check the official API documentation or ask for help!
