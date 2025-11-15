// 🎵 FireLives Music API Server - ENHANCED
// Multi-API Integration: Deezer, iTunes, JioSaavn, Spotify (Web API)
// Supports 30+ songs per search with auto-refresh from multiple sources

const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// ============================================
// 💾 CACHING SYSTEM
// ============================================
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

function getCacheKey(query, country, limit) {
    return `${query.toLowerCase()}_${country}_${limit}`;
}

function getFromCache(key) {
    const cached = cache.get(key);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        return cached.data;
    }
    cache.delete(key);
    return null;
}

function setCache(key, data) {
    cache.set(key, { data, timestamp: Date.now() });
    // Clean old cache entries
    if (cache.size > 100) {
        const oldestKey = cache.keys().next().value;
        cache.delete(oldestKey);
    }
}

// ============================================
// 📊 ANALYTICS & TRENDING
// ============================================
const searchStats = new Map();
const playStats = new Map();

function trackSearch(query) {
    const count = searchStats.get(query) || 0;
    searchStats.set(query, count + 1);
}

function trackPlay(songId) {
    const count = playStats.get(songId) || 0;
    playStats.set(songId, count + 1);
}

// ============================================
// 🌍 MULTI-API MUSIC SOURCES
// ============================================

// API Sources with country support
const API_SOURCES = {
  deezer: {
    name: "Deezer",
    countries: [
      "global",
      "us",
      "uk",
      "fr",
      "de",
      "es",
      "it",
      "br",
      "mx",
      "in",
      "jp",
      "kr",
      "cn",
    ],
    baseUrl: "https://api.deezer.com",
  },
  itunes: {
    name: "iTunes",
    countries: [
      "us",
      "uk",
      "ca",
      "au",
      "jp",
      "kr",
      "cn",
      "in",
      "br",
      "mx",
      "fr",
      "de",
      "es",
    ],
    baseUrl: "https://itunes.apple.com",
  },
  jiosaavn: {
    name: "JioSaavn",
    countries: ["in", "pk", "bd", "lk", "np"],
    baseUrl: "https://www.jiosaavn.com/api.php",
  },
  jamendo: {
    name: "Jamendo",
    countries: ["global"],
    baseUrl: "https://api.jamendo.com/v3.0",
    clientId: "50cf56ee", // Valid public client ID for testing
  },
};

// ============================================
// 🔍 ENHANCED SEARCH - 30+ RESULTS FROM MULTIPLE SOURCES
// ============================================

app.get('/api/music/search', async (req, res) => {
    try {
        const { q, type = 'track', limit = 30, country = 'us', refresh = 'true' } = req.query;
        
        if (!q) {
            return res.status(400).json({ 
                success: false, 
                error: 'Query parameter "q" is required' 
            });
        }

        // Track search for analytics
        trackSearch(q);

        // Check cache first
        const cacheKey = getCacheKey(q, country, limit);
        const cached = getFromCache(cacheKey);
        if (cached && refresh !== 'true') {
            return res.json({ ...cached, cached: true });
        }

        const allResults = [];
        const errors = [];

        // Search Jamendo FIRST (Full-length songs! 🎉)
        // Get MORE full songs by increasing Jamendo limit
        try {
            const jamendoResults = await searchJamendo(q, type, Math.ceil(limit / 2)); // 50% from Jamendo (full songs)
            allResults.push(...jamendoResults);
        } catch (error) {
            errors.push({ source: 'Jamendo', error: error.message });
        }

        // Search Deezer (Global - 90M+ tracks, all languages - 30s previews)
        try {
            const deezerResults = await searchDeezer(q, type, Math.ceil(limit / 6)); // Reduced to 16%
            allResults.push(...deezerResults);
        } catch (error) {
            errors.push({ source: 'Deezer', error: error.message });
        }

        // Search iTunes (Multi-country support - 30s previews)
        try {
            const itunesResults = await searchItunes(q, type, Math.ceil(limit / 6), country); // Reduced to 16%
            allResults.push(...itunesResults);
        } catch (error) {
            errors.push({ source: 'iTunes', error: error.message });
        }

        // Search JioSaavn (Indian/South Asian music - 30s previews)
        if (['in', 'pk', 'bd', 'lk', 'np'].includes(country.toLowerCase())) {
            try {
                const saavnResults = await searchJioSaavn(q, type, Math.ceil(limit / 6)); // Reduced to 16%
                allResults.push(...saavnResults);
            } catch (error) {
                errors.push({ source: 'JioSaavn', error: error.message });
            }
        }

        // Remove duplicates based on title + artist
        const uniqueResults = [];
        const seen = new Set();
        
        for (const track of allResults) {
            const key = `${track.title.toLowerCase()}-${track.artist.toLowerCase()}`;
            if (!seen.has(key)) {
                seen.add(key);
                uniqueResults.push(track);
            }
        }

        // Sort by relevance (you can implement scoring here)
        const sortedResults = uniqueResults.slice(0, parseInt(limit));

        const response = { 
            success: true, 
            results: sortedResults,
            total: sortedResults.length,
            sources: {
                jamendo: allResults.filter(r => r.source === 'jamendo').length,
                deezer: allResults.filter(r => r.source === 'deezer').length,
                itunes: allResults.filter(r => r.source === 'itunes').length,
                jiosaavn: allResults.filter(r => r.source === 'jiosaavn').length
            },
            errors: errors.length > 0 ? errors : undefined,
            cached: false
        };

        // Cache the response
        setCache(cacheKey, response);

        res.json(response);
    } catch (error) {
        console.error('Search error:', error.message);
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

// ============================================
// 🎵 DEEZER API (90M+ tracks, all languages)
// ============================================

async function searchDeezer(query, type, limit) {
    const endpoint = type === 'track' ? 'search' : `search/${type}`;
    const response = await axios.get(
        `https://api.deezer.com/${endpoint}?q=${encodeURIComponent(query)}&limit=${limit}`
    );
    
    return response.data.data.map(item => {
        if (type === 'track') {
            return {
                id: `deezer-${item.id}`,
                source: 'deezer',
                title: item.title,
                artist: item.artist.name,
                artistId: item.artist.id,
                album: item.album.title,
                albumId: item.album.id,
                duration: item.duration,
                preview: item.preview, // 30-second preview
                cover: item.album.cover_medium || item.album.cover_big,
                coverLarge: item.album.cover_xl || item.album.cover_big,
                coverSmall: item.album.cover_small,
                explicit: item.explicit_lyrics || false
            };
        }
        return item;
    });
}

// ============================================
// 🍎 ITUNES API (Multi-country, 100M+ tracks)
// ============================================

async function searchItunes(query, type, limit, country) {
    const mediaType = type === 'track' ? 'music' : type;
    const response = await axios.get(
        `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&media=${mediaType}&limit=${limit}&country=${country}`
    );
    
    return response.data.results.map(item => ({
        id: `itunes-${item.trackId || item.collectionId}`,
        source: 'itunes',
        title: item.trackName || item.collectionName,
        artist: item.artistName,
        artistId: item.artistId,
        album: item.collectionName,
        albumId: item.collectionId,
        duration: Math.floor((item.trackTimeMillis || 0) / 1000),
        preview: item.previewUrl, // 30-second preview
        cover: item.artworkUrl100?.replace('100x100', '600x600') || item.artworkUrl100,
        coverLarge: item.artworkUrl100?.replace('100x100', '600x600') || item.artworkUrl100,
        coverSmall: item.artworkUrl60,
        explicit: item.trackExplicitness === 'explicit',
        releaseDate: item.releaseDate,
        genre: item.primaryGenreName,
        country: item.country
    }));
}

// ============================================
// 🇮🇳 JIOSAAVN API (Indian/South Asian music)
// ============================================

async function searchJioSaavn(query, type, limit) {
    try {
        // JioSaavn public API endpoint
        const response = await axios.get(
            `https://www.jiosaavn.com/api.php?__call=autocomplete.get&_format=json&_marker=0&cc=in&includeMetaTags=1&query=${encodeURIComponent(query)}`
        );
        
        const songs = response.data.songs?.data || [];
        
        return songs.slice(0, limit).map(item => ({
            id: `jiosaavn-${item.id}`,
            source: 'jiosaavn',
            title: item.title,
            artist: item.more_info?.artistMap?.primary_artists?.[0]?.name || item.subtitle || 'Unknown Artist',
            artistId: item.more_info?.artistMap?.primary_artists?.[0]?.id,
            album: item.more_info?.album || item.title,
            albumId: item.more_info?.album_id,
            duration: parseInt(item.more_info?.duration) || 0,
            preview: item.more_info?.encrypted_media_url || item.perma_url,
            cover: item.image?.replace('150x150', '500x500') || item.image,
            coverLarge: item.image?.replace('150x150', '500x500') || item.image,
            coverSmall: item.image,
            explicit: item.explicit_content === '1',
            language: item.language || 'hindi'
        }));
    } catch (error) {
        console.error('JioSaavn search error:', error.message);
        return [];
    }
}

// ============================================
// 🎸 JAMENDO API (Full-length FREE music!)
// ============================================

async function searchJamendo(query, type, limit) {
    try {
        const clientId = API_SOURCES.jamendo.clientId;
        const response = await axios.get(
            `https://api.jamendo.com/v3.0/tracks/?client_id=${clientId}&format=json&limit=${limit}&fuzzytags=${encodeURIComponent(query)}&audioformat=mp32`
        );
        
        return response.data.results.map(track => ({
            id: `jamendo-${track.id}`,
            source: 'jamendo',
            title: track.name,
            artist: track.artist_name,
            artistId: track.artist_id,
            album: track.album_name,
            albumId: track.album_id,
            duration: track.duration, // Full duration!
            preview: track.audio, // FULL SONG MP3 URL! 🎉
            cover: track.album_image?.replace('1.100.jpg', '1.500.jpg') || track.album_image,
            coverLarge: track.album_image?.replace('1.100.jpg', '1.500.jpg') || track.album_image,
            coverSmall: track.album_image,
            explicit: false,
            license: track.license_ccurl,
            releaseDate: track.releasedate,
            genre: track.musicinfo?.tags?.genres?.[0] || 'Unknown'
        }));
    } catch (error) {
        console.error('Jamendo search error:', error.message);
        return [];
    }
}

// ============================================
// 🎵 TRACK DETAILS BY ID
// ============================================

app.get('/api/music/track/:id', async (req, res) => {
    try {
        const [source, trackId] = req.params.id.split('-');
        
        let track;
        if (source === 'jamendo') {
            const clientId = API_SOURCES.jamendo.clientId;
            const response = await axios.get(`https://api.jamendo.com/v3.0/tracks/?client_id=${clientId}&format=json&id=${trackId}&audioformat=mp32`);
            const t = response.data.results[0];
            track = {
                id: req.params.id,
                source: 'jamendo',
                title: t.name,
                artist: t.artist_name,
                artistId: t.artist_id,
                album: t.album_name,
                albumId: t.album_id,
                duration: t.duration,
                preview: t.audio, // Full song!
                cover: t.album_image?.replace('1.100.jpg', '1.500.jpg'),
                coverLarge: t.album_image?.replace('1.100.jpg', '1.500.jpg'),
                releaseDate: t.releasedate,
                license: t.license_ccurl
            };
        } else if (source === 'deezer') {
            const response = await axios.get(`https://api.deezer.com/track/${trackId}`);
            const t = response.data;
            track = {
                id: req.params.id,
                source: 'deezer',
                title: t.title,
                artist: t.artist.name,
                artistId: t.artist.id,
                album: t.album.title,
                albumId: t.album.id,
                duration: t.duration,
                preview: t.preview,
                cover: t.album.cover_medium,
                coverLarge: t.album.cover_xl,
                releaseDate: t.release_date,
                bpm: t.bpm,
                gain: t.gain
            };
        } else if (source === 'itunes') {
            const response = await axios.get(`https://itunes.apple.com/lookup?id=${trackId}`);
            const t = response.data.results[0];
            track = {
                id: req.params.id,
                source: 'itunes',
                title: t.trackName,
                artist: t.artistName,
                album: t.collectionName,
                duration: Math.floor(t.trackTimeMillis / 1000),
                preview: t.previewUrl,
                cover: t.artworkUrl100?.replace('100x100', '600x600'),
                coverLarge: t.artworkUrl100?.replace('100x100', '600x600'),
                releaseDate: t.releaseDate
            };
        }
        
        res.json({ success: true, track });
    } catch (error) {
        console.error('Track error:', error.message);
        res.status(500).json({ success: false, error: error.message });
    }
});

// ============================================
// 📊 TOP CHARTS (Multi-country)
// ============================================

app.get('/api/music/charts', async (req, res) => {
    try {
        const { country = 'us' } = req.query;
        
        // Get charts from multiple sources
        const [deezerCharts, itunesCharts] = await Promise.all([
            getChartsDeezer(),
            getChartsItunes(country)
        ]);
        
        // Combine and deduplicate
        const allTracks = [...deezerCharts, ...itunesCharts];
        const uniqueTracks = [];
        const seen = new Set();
        
        for (const track of allTracks) {
            const key = `${track.title.toLowerCase()}-${track.artist.toLowerCase()}`;
            if (!seen.has(key) && uniqueTracks.length < 50) {
                seen.add(key);
                uniqueTracks.push(track);
            }
        }
        
        res.json({ 
            success: true, 
            charts: {
                tracks: uniqueTracks,
                country: country
            }
        });
    } catch (error) {
        console.error('Charts error:', error.message);
        res.status(500).json({ success: false, error: error.message });
    }
});

async function getChartsDeezer() {
    const response = await axios.get('https://api.deezer.com/chart');
    return response.data.tracks.data.slice(0, 25).map(track => ({
        id: `deezer-${track.id}`,
        source: 'deezer',
        title: track.title,
        artist: track.artist.name,
        album: track.album.title,
        duration: track.duration,
        preview: track.preview,
        cover: track.album.cover_medium,
        position: track.position
    }));
}

async function getChartsItunes(country) {
    try {
        // iTunes doesn't have a direct charts API, so we search for popular terms
        const response = await axios.get(
            `https://itunes.apple.com/search?term=top+hits&media=music&limit=25&country=${country}`
        );
        return response.data.results.map((item, index) => ({
            id: `itunes-${item.trackId}`,
            source: 'itunes',
            title: item.trackName,
            artist: item.artistName,
            album: item.collectionName,
            duration: Math.floor(item.trackTimeMillis / 1000),
            preview: item.previewUrl,
            cover: item.artworkUrl100?.replace('100x100', '600x600'),
            position: index + 1
        }));
    } catch (error) {
        return [];
    }
}

// ============================================
// 🎭 GENRES
// ============================================

app.get('/api/music/genres', async (req, res) => {
    try {
        const response = await axios.get('https://api.deezer.com/genre');
        const genres = response.data.data.map(genre => ({
            id: genre.id,
            name: genre.name,
            picture: genre.picture_medium
        }));
        
        res.json({ success: true, genres });
    } catch (error) {
        console.error('Genres error:', error.message);
        res.status(500).json({ success: false, error: error.message });
    }
});

// ============================================
// 📻 RADIO STATIONS
// ============================================

app.get('/api/music/radio', async (req, res) => {
    try {
        const response = await axios.get('https://api.deezer.com/radio');
        const radios = response.data.data.map(radio => ({
            id: radio.id,
            title: radio.title,
            picture: radio.picture_medium,
            pictureLarge: radio.picture_xl
        }));
        
        res.json({ success: true, radios });
    } catch (error) {
        console.error('Radio error:', error.message);
        res.status(500).json({ success: false, error: error.message });
    }
});

// ============================================
// 🌍 SUPPORTED COUNTRIES
// ============================================

app.get('/api/music/countries', (req, res) => {
    const countries = [
        { code: 'us', name: 'United States', flag: '🇺🇸' },
        { code: 'uk', name: 'United Kingdom', flag: '🇬🇧' },
        { code: 'ca', name: 'Canada', flag: '🇨🇦' },
        { code: 'au', name: 'Australia', flag: '🇦🇺' },
        { code: 'in', name: 'India', flag: '🇮🇳' },
        { code: 'jp', name: 'Japan', flag: '🇯🇵' },
        { code: 'kr', name: 'South Korea', flag: '🇰🇷' },
        { code: 'cn', name: 'China', flag: '🇨🇳' },
        { code: 'br', name: 'Brazil', flag: '🇧🇷' },
        { code: 'mx', name: 'Mexico', flag: '🇲🇽' },
        { code: 'fr', name: 'France', flag: '🇫🇷' },
        { code: 'de', name: 'Germany', flag: '🇩🇪' },
        { code: 'es', name: 'Spain', flag: '🇪🇸' },
        { code: 'it', name: 'Italy', flag: '🇮🇹' },
        { code: 'pk', name: 'Pakistan', flag: '🇵🇰' },
        { code: 'bd', name: 'Bangladesh', flag: '🇧🇩' }
    ];
    
    res.json({ success: true, countries });
});

// ============================================
// 📊 ANALYTICS & TRENDING ENDPOINTS
// ============================================

// Track song play
app.post('/api/music/track-play', (req, res) => {
    const { songId } = req.body;
    if (songId) {
        trackPlay(songId);
        res.json({ success: true, message: 'Play tracked' });
    } else {
        res.status(400).json({ success: false, error: 'songId required' });
    }
});

// Get trending searches
app.get('/api/music/trending/searches', (req, res) => {
    const limit = parseInt(req.query.limit) || 10;
    const trending = Array.from(searchStats.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, limit)
        .map(([query, count]) => ({ query, count }));
    
    res.json({ success: true, trending });
});

// Get most played songs
app.get('/api/music/trending/songs', (req, res) => {
    const limit = parseInt(req.query.limit) || 10;
    const trending = Array.from(playStats.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, limit)
        .map(([songId, count]) => ({ songId, plays: count }));
    
    res.json({ success: true, trending });
});

// Get cache statistics
app.get('/api/music/stats', (req, res) => {
    res.json({
        success: true,
        stats: {
            cacheSize: cache.size,
            totalSearches: Array.from(searchStats.values()).reduce((a, b) => a + b, 0),
            uniqueSearches: searchStats.size,
            totalPlays: Array.from(playStats.values()).reduce((a, b) => a + b, 0),
            uniqueSongs: playStats.size,
            cacheDuration: `${CACHE_DURATION / 1000}s`,
            uptime: process.uptime()
        }
    });
});

// Health check
app.get('/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        service: 'FireLives Music API - Enhanced Multi-Source',
        sources: Object.keys(API_SOURCES),
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        cacheSize: cache.size
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🔥 FireLives Music API Server - ENHANCED               ║
║                                                           ║
║   🌍 Multi-API Sources:                                  ║
║      • Deezer (90M+ tracks, all languages)              ║
║      • iTunes (100M+ tracks, multi-country)             ║
║      • JioSaavn (Indian/South Asian music)              ║
║                                                           ║
║   ✨ Features:                                           ║
║      • 30+ songs per search                             ║
║      • Auto-refresh from multiple sources               ║
║      • Multi-language support                           ║
║      • 16+ countries supported                          ║
║                                                           ║
║   🚀 Server running on http://localhost:${PORT}            ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
    `);
});
