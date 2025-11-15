# 🎵 FireLives - Spotify-Inspired Design

## Design Philosophy
Clean, minimal design inspired by Spotify with **red accents only on icons and buttons**. No gradients anywhere.

---

## Color Palette

### Primary Colors
- **Red Accent**: `#e13238` (main red)
- **Red Hover**: `#ff4444` (hover state)

### Background Colors
- **Base**: `#000000` (pure black)
- **Elevated**: `#121212` (cards, elevated surfaces)
- **Highlight**: `#1a1a1a` (hover states)

### Text Colors
- **Base**: `#ffffff` (primary text)
- **Subdued**: `#b3b3b3` (secondary text)
- **Muted**: `#6a6a6a` (tertiary text)

### Border
- **Border**: `#282828` (subtle borders)

---

## Layout Structure

### Grid System
- **Desktop**: Auto-fill grid with min 180px columns
- **Tablet**: Min 160px columns
- **Mobile**: 2 columns fixed

### Spacing
- **Container padding**: 32px (desktop), 16px (mobile)
- **Card gap**: 24px (desktop), 12px (mobile)
- **Element gap**: 8-16px

---

## Components

### 1. Header
- **Background**: Pure black (`#000000`)
- **Height**: Auto (padding-based)
- **Position**: Sticky top
- **Border**: 1px bottom border
- **Logo**: White text with red fire icon
- **Search**: Rounded pill shape, elevated background

### 2. Search Bar
- **Shape**: Rounded pill (500px border-radius)
- **Background**: Elevated (`#121212`)
- **Max width**: 364px
- **Hover**: Highlight background
- **Focus**: White outline

### 3. Category Filters
- **Shape**: Rounded pills
- **Default**: Elevated background, white text
- **Active**: **Red background** (`#e13238`)
- **Hover**: Scale 1.04

### 4. Station Cards
- **Background**: Elevated (`#121212`)
- **Border radius**: 8px
- **Padding**: 16px
- **Hover**: Highlight background
- **Thumbnail**: Square (1:1 aspect ratio)
- **Shadow**: Subtle black shadow on thumbnail

### 5. Play Button (on cards)
- **Shape**: Circle (48px)
- **Background**: **Red** (`#e13238`)
- **Position**: Absolute bottom-right of thumbnail
- **Visibility**: Hidden by default, visible on card hover
- **Hover**: Brighter red, scale 1.06
- **Icon**: White play/pause icon

### 6. Mini Player (Bottom Bar)
- **Position**: Fixed bottom
- **Background**: Elevated (`#121212`)
- **Border**: 1px top border
- **Height**: Auto (padding-based)
- **Layout**: Flexbox (info left, controls right)

### 7. Control Button (in mini player)
- **Shape**: Circle (32px)
- **Background**: **Red** (`#e13238`)
- **Icon**: White play/pause
- **Hover**: Brighter red, scale 1.06

### 8. Volume Slider
- **Track**: Highlight background
- **Progress**: Subdued text color
- **Thumb**: White circle (hidden by default)
- **Thumb on hover**: Visible

---

## Typography

### Font Family
```css
-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', sans-serif
```

### Font Sizes
- **Logo**: 24px, weight 700
- **Card title**: 16px, weight 700
- **Search input**: 14px, weight 400
- **Filter buttons**: 14px, weight 500
- **Meta text**: 13px, weight 400
- **Mini player title**: 14px, weight 500
- **Mini player subtitle**: 12px, weight 400

---

## Interactions

### Hover Effects
- **Cards**: Background changes to highlight
- **Buttons**: Scale 1.04-1.06
- **Play button**: Appears on card hover
- **Volume thumb**: Appears on slider hover

### Active States
- **Filter buttons**: Red background
- **Play button**: Visible when playing

### Transitions
- **All elements**: 0.2-0.3s ease
- **Smooth, subtle animations**

---

## Red Accent Usage

### Where Red is Used:
1. ✅ **Fire icon** (logo)
2. ✅ **Active filter button** (background)
3. ✅ **Play button** (background on cards)
4. ✅ **Control button** (background in mini player)

### Where Red is NOT Used:
- ❌ Text (except in red buttons)
- ❌ Backgrounds (except buttons)
- ❌ Borders
- ❌ Gradients (no gradients anywhere!)
- ❌ Thumbnails
- ❌ Icons (except fire icon)

---

## Responsive Breakpoints

### Desktop (1024px+)
- Full grid layout
- 32px padding
- Volume control visible

### Tablet (768px - 1023px)
- Adjusted grid (160px min)
- 16px padding
- Volume control visible

### Mobile (<768px)
- 2-column grid
- 16px padding
- Volume control hidden
- Smaller cards

---

## Key Differences from Previous Design

### Removed:
- ❌ All gradients
- ❌ Fire animations (flicker, heartbeat)
- ❌ Glow effects
- ❌ Multiple colors in fire icon
- ❌ Gradient text
- ❌ Gradient buttons
- ❌ Gradient thumbnails
- ❌ Pulse animations

### Added:
- ✅ Clean Spotify-like layout
- ✅ Minimal color palette
- ✅ Red accents only on interactive elements
- ✅ Subtle hover effects
- ✅ Better spacing and typography
- ✅ Cleaner card design
- ✅ Professional appearance

---

## Accessibility

- **Contrast**: High contrast (white on black)
- **Focus states**: Clear outline on search
- **Hover states**: Visual feedback on all interactive elements
- **Button sizes**: Minimum 32px touch targets
- **Text sizes**: Readable (14px minimum)

---

## Performance

- **No animations**: Except simple transforms
- **GPU acceleration**: Transform and opacity only
- **Minimal repaints**: Efficient CSS
- **Fast load**: No heavy effects

---

## Files Modified

1. **styles.css** - Complete redesign
2. **app.tsx** - Simplified icons, updated layout
3. **live.html** - Updated inline React code
4. **index.html** - Uses new styles

---

## Usage

Open in browser:
```
http://localhost:3000/live.html
```

Enjoy the clean, Spotify-inspired design! 🎵
