# 🔥 FireLives - Live Audio Streaming Platform

> **Your ultimate live audio streaming platform with a passionate fire theme and heart ❤️**

![FireLives](https://img.shields.io/badge/FireLives-Live-ff4500?style=for-the-badge&logo=fire)
![React](https://img.shields.io/badge/React-18-61dafb?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?style=for-the-badge&logo=typescript)
![Node.js](https://img.shields.io/badge/Node.js-18-339933?style=for-the-badge&logo=node.js)

---

## 🚀 Quick Start

### 1. Start the Server
```bash
cd /home/aimoude149/firelives
node server.js
```

### 2. Open in Browser
- **🏠 Launcher**: http://localhost:3000/launcher.html
- **🔥 Main App**: http://localhost:3000/live.html
- **🎧 Demo**: http://localhost:3000/demo.html

---

## ✨ Features

### 🎨 **Beautiful Dark UI**
- Dark background with fire-themed gradients
- Red-orange color scheme throughout
- Smooth animations and transitions
- Responsive design for all devices

### 🔥 **Custom Fire Icon**
- Hand-drawn SVG fire with CSS animations
- Flickering flame effect
- Small red heart ❤️ in the center
- Glowing effects

### 🎵 **Mini Player (Always Visible)**
- Fixed at the bottom of the screen
- Shows current playing station
- Play/Pause controls
- Volume slider with percentage
- Smooth slide-up animation

### 🔴 **Live Streaming**
- Real-time audio streaming
- 12+ demo stations included
- Multiple genres: Electronic, Rock, Jazz, Pop, Hip Hop, Classical, Talk
- Live badges with pulse animation

### 🔍 **Smart Search & Filters**
- Search by station name, country, or genre
- Category filters with gradient buttons
- Real-time filtering
- Instant results

### 🎧 **Audio Controls**
- Click any station to play
- Play/Pause toggle
- Volume control (0-100%)
- Smooth audio transitions

---

## 🎨 Design System

### Colors
```css
--fire-red: #ff4500
--fire-orange: #ff8c00
--fire-dark: #cc3700
--fire-light: #ffb347
--fire-yellow: #ffeb3b
--dark-bg: #0a0a0a
--dark-card: #1a1a1a
```

### Gradients (渐变色)
```css
--gradient-fire: linear-gradient(135deg, #ff4500 0%, #ff8c00 50%, #ffb347 100%)
--gradient-dark: linear-gradient(180deg, #0a0a0a 0%, #1a1a1a 100%)
```

### Icons
- All icons drawn with SVG
- Material Design inspired
- Consistent sizing and styling
- Smooth hover effects

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **CSS3** - Styling with animations
- **SVG** - Custom icons and graphics

### Backend
- **Node.js 18** - Runtime
- **Express.js** - Web server
- **Axios** - HTTP client
- **CORS** - Cross-origin support

### APIs
- Radio Browser API (with fallback)
- Demo data for offline mode

---

## 📁 Project Structure

```
firelives/
├── server.js           # Express server with API
├── app.tsx            # React TypeScript app
├── index.tsx          # React entry point
├── live.html          # Standalone React app
├── demo.html          # Demo version
├── launcher.html      # Welcome page
├── styles.css         # Complete styling
├── package.json       # Dependencies
├── tsconfig.json      # TypeScript config
└── README.md          # This file
```

---

## 🎵 Demo Stations

1. 🔥 **Fire Beats Radio** - Electronic (USA)
2. ❤️ **Heart & Soul FM** - Pop (UK)
3. 🎸 **Rock Fire Station** - Rock (Germany)
4. 🎵 **Jazz Flames** - Jazz (France)
5. 🎤 **Hip Hop Heat** - Hip Hop (Canada)
6. 🎼 **Classical Fire** - Classical (Austria)
7. 💬 **Talk Fire Network** - Talk (Australia)
8. 🌟 **Top 40 Blaze** - Pop (Netherlands)
9. 🎹 **Electronic Inferno** - Electronic (Sweden)
10. 🎺 **Smooth Jazz Fire** - Jazz (Italy)
11. 🔊 **Bass & Fire** - Electronic (Brazil)
12. 🎸 **Metal Meltdown** - Rock (Finland)

---

## 🎯 Key Components

### Fire Icon Component
```tsx
<FireIcon size={50} className="custom-class" />
```
- Animated SVG flame
- Customizable size
- CSS animations included

### Mini Player
- Always visible at bottom
- Slides up when playing
- Shows station info
- Volume control
- Play/Pause button

### Stream Cards
- Thumbnail with gradient fallback
- Live badge (animated)
- Station metadata
- Category tag
- Play button with gradient

---

## 🌐 API Endpoints

### GET `/api/streams`
Fetch live streams with filters
```
?category=Rock&search=fire&limit=20
```

### GET `/api/streams/top`
Get top voted stations
```
?limit=20
```

### GET `/api/categories`
Get available categories

### GET `/health`
Server health check

---

## 🎨 CSS Features

### Animations
- `flicker` - Fire flame animation
- `heartbeat` - Heart pulse
- `pulse-badge` - Live badge pulse
- `float` - Floating effect
- `glow` - Glowing text effect

### Responsive Breakpoints
- Desktop: 1400px+
- Tablet: 768px - 1399px
- Mobile: < 768px

### Custom Scrollbar
- Fire gradient thumb
- Dark track
- Smooth hover effect

---

## 🚀 Performance

- Lazy loading for images
- Optimized SVG icons
- CSS animations (GPU accelerated)
- Debounced search
- Efficient React rendering

---

## 🔧 Configuration

### Server Port
Default: `3000`
Change in `server.js`:
```javascript
const PORT = process.env.PORT || 3000;
```

### API Timeout
Default: `5000ms`
Change in `server.js`:
```javascript
timeout: 5000
```

---

## 📱 Mobile Support

- Touch-friendly buttons
- Responsive grid layout
- Optimized mini player
- Swipe gestures ready
- Mobile-first design

---

## 🎉 Credits

**Built with:**
- ❤️ Love and passion
- 🔥 Fire and energy
- 🎵 Music and creativity
- ⚛️ React and TypeScript
- 🎨 CSS and SVG art

---

## 📄 License

MIT License - Feel free to use and modify!

---

## 🔥 Made with Fire & Heart ❤️

**FireLives** - Where music meets passion! 🎵✨
