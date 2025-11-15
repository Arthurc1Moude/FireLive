# 🔥 FireLives - Usage Guide

## Quick Start

Your FireLives server is now running! 🎉

### Access the Application

1. **Launcher Page** (Recommended for first-time users)
   ```
   http://localhost:3000/launcher.html
   ```

2. **Simple HTML Version** (No build required)
   ```
   http://localhost:3000/index-simple.html
   ```

3. **Full React Version**
   ```
   http://localhost:3000/index.html
   ```

## 🎵 How to Use FireLives

### 1. Browse Live Streams
- When you open the app, it automatically loads the top live radio stations
- Scroll through the grid of stream cards
- Each card shows:
  - 🔴 LIVE badge (animated)
  - Station name
  - Country/Author
  - Category tag
  - Listener count
  - Play button

### 2. Search for Streams
- Use the search bar at the top
- Search by:
  - Station name (e.g., "Jazz FM")
  - Country (e.g., "USA", "UK")
  - Genre (e.g., "rock", "classical")
- Press Enter or click the 🔍 Search button

### 3. Filter by Category
- Click any category button to filter streams:
  - All
  - Music
  - Rock
  - Electronic
  - Jazz
  - Hip Hop
  - Classical
  - Pop
  - Talk

### 4. Play a Stream
- Click on any stream card OR
- Click the "▶ Play" button
- The player bar appears at the bottom
- Stream starts playing automatically

### 5. Control Playback
The player bar at the bottom includes:
- **Play/Pause button** (⏸/▶)
- **Volume slider** (🔊)
- **Current stream info** (title & author)
- **Stream thumbnail**

## 🔌 API Endpoints

### Get Streams
```bash
GET http://localhost:3000/api/streams
```

**Query Parameters:**
- `search` - Search term (optional)
- `category` - Category filter (optional)
- `limit` - Number of results (default: 20)

**Example:**
```bash
curl "http://localhost:3000/api/streams?search=jazz&limit=10"
```

### Get Top Streams
```bash
GET http://localhost:3000/api/streams/top?limit=20
```

### Get Categories
```bash
GET http://localhost:3000/api/categories
```

### Health Check
```bash
GET http://localhost:3000/health
```

## 🎨 Design Features

### Fire Icon with Heart ❤️
The custom logo features:
- Red-orange gradient fire flame
- Small red heart in the center
- Flickering animation effect

### Color Scheme
- **Fire Red**: #ff4500
- **Fire Orange**: #ff8c00
- **Fire Dark**: #cc3700
- **Fire Light**: #ffb347

### Animations
- ✨ Hover effects on cards
- 🔴 Pulsing LIVE badges
- 🔥 Flickering fire icon
- 🌊 Smooth transitions

## 📱 Responsive Design

FireLives works perfectly on:
- 🖥️ Desktop (1400px+)
- 📱 Tablet (768px - 1399px)
- 📱 Mobile (< 768px)

## 🛠️ Technical Details

### Technologies Used
- **Frontend**: React 18, TypeScript, JSX/TSX
- **Backend**: Node.js, Express
- **Styling**: CSS3 with custom animations
- **API**: Axios for HTTP requests
- **Data Source**: Radio Browser API

### File Structure
```
firelives/
├── index.html              # Main HTML (React version)
├── index-simple.html       # Simple HTML version
├── launcher.html           # Launcher page
├── app.tsx                 # React application
├── styles.css              # All styling
├── server.js               # Express server
├── api-utils.js            # API helper functions
├── package.json            # Dependencies
├── tsconfig.json           # TypeScript config
├── start.sh                # Start script
└── README.md               # Documentation
```

## 🚀 Starting/Stopping the Server

### Start Server
```bash
cd /home/aimoude149/firelives
npm start
```

Or use the start script:
```bash
./start.sh
```

### Stop Server
Press `Ctrl + C` in the terminal

### Check if Server is Running
```bash
curl http://localhost:3000/health
```

## 🔧 Troubleshooting

### Server Won't Start
1. Check if port 3000 is available:
   ```bash
   lsof -i :3000
   ```
2. Kill any process using port 3000:
   ```bash
   kill -9 <PID>
   ```

### No Streams Loading
1. Check your internet connection
2. The app uses Radio Browser API - it may be temporarily unavailable
3. Try clicking the "🔄 Retry" button
4. Check browser console for errors (F12)

### Audio Not Playing
1. Check browser permissions for audio
2. Some browsers block autoplay - click play manually
3. Try a different stream
4. Check volume settings

### Search Not Working
1. Make sure you have streams loaded first
2. Try different search terms
3. Clear the search and try filtering by category

## 🎯 Tips & Tricks

1. **Favorite Stations**: Bookmark streams you like in your browser
2. **Better Performance**: Use the simple HTML version for older devices
3. **Keyboard Shortcuts**: Press Enter in search bar to search
4. **Multiple Tabs**: You can open multiple streams in different tabs
5. **API Integration**: Use the API endpoints to build your own apps

## 🌟 Features Coming Soon

- [ ] User accounts & authentication
- [ ] Favorite stations list
- [ ] Playlist creation
- [ ] Social sharing
- [ ] Audio visualization
- [ ] Dark/Light theme toggle
- [ ] Podcast support
- [ ] Download/record functionality
- [ ] Sleep timer
- [ ] Equalizer

## 📞 Support

If you encounter any issues:
1. Check this usage guide
2. Review the README.md
3. Check browser console for errors
4. Verify server is running
5. Test API endpoints directly

## 💖 Enjoy!

FireLives - Where passion meets audio streaming! 🔥❤️

---

**Current Status**: ✅ Server Running on http://localhost:3000

**Quick Links**:
- 🚀 Launcher: http://localhost:3000/launcher.html
- 🎵 Simple App: http://localhost:3000/index-simple.html
- ⚡ Full App: http://localhost:3000/index.html
- 🔌 API: http://localhost:3000/api/streams
