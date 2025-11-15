import React, { useEffect, useRef, useState } from 'react';

// Fire Icon Component - Simple red icon
const FireIcon: React.FC<{ size?: number; className?: string }> = ({ size = 40, className = '' }) => (
  <svg className={`fire-icon ${className}`} viewBox="0 0 100 100" width={size} height={size}>
    <path 
      d="M50 15 Q45 25 45 35 Q45 45 40 50 Q35 55 35 65 Q35 75 40 82 Q45 89 50 90 Q55 89 60 82 Q65 75 65 65 Q65 55 60 50 Q55 45 55 35 Q55 25 50 15 Z" 
      fill="currentColor"
    />
    <path 
      d="M50 25 Q48 32 48 40 Q48 48 50 55 Q52 48 52 40 Q52 32 50 25 Z" 
      fill="currentColor" 
      opacity="0.6"
    />
  </svg>
);

// Music Note Icon
const MusicIcon: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
  </svg>
);

// Play Icon
const PlayIcon: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M8 5v14l11-7z"/>
  </svg>
);

// Pause Icon
const PauseIcon: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
  </svg>
);

// Volume Icon
const VolumeIcon: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
  </svg>
);

// Search Icon
const SearchIcon: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
  </svg>
);

// Location Icon
const LocationIcon: React.FC = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
  </svg>
);

// Users Icon
const UsersIcon: React.FC = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
  </svg>
);

interface Stream {
  id: string;
  title: string;
  author: string;
  listeners: number;
  thumbnail: string;
  category: string;
  url: string;
  isLive: boolean;
  bitrate?: number;
  codec?: string;
}

const App: React.FC = () => {
  const [streams, setStreams] = useState<Stream[]>([]);
  const [filteredStreams, setFilteredStreams] = useState<Stream[]>([]);
  const [currentStream, setCurrentStream] = useState<Stream | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(70);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  
  const audioRef = useRef<HTMLAudioElement>(null);

  const categories = ['All', 'Electronic', 'Rock', 'Jazz', 'Pop', 'Hip Hop', 'Classical', 'Talk'];

  // Fetch streams
  useEffect(() => {
    fetchStreams();
  }, [selectedCategory]);

  // Filter streams by search
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredStreams(streams);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = streams.filter(stream =>
        stream.title.toLowerCase().includes(query) ||
        stream.author.toLowerCase().includes(query) ||
        stream.category.toLowerCase().includes(query)
      );
      setFilteredStreams(filtered);
    }
  }, [searchQuery, streams]);

  const fetchStreams = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedCategory !== 'All') {
        params.append('category', selectedCategory);
      }
      params.append('limit', '20');

      const response = await fetch(`/api/streams?${params}`);
      const data = await response.json();
      
      if (data.success) {
        setStreams(data.streams);
        setFilteredStreams(data.streams);
      }
    } catch (error) {
      console.error('Error fetching streams:', error);
    } finally {
      setLoading(false);
    }
  };

  const playStream = (stream: Stream) => {
    if (audioRef.current) {
      if (currentStream?.id === stream.id && isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        setCurrentStream(stream);
        audioRef.current.src = stream.url;
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100;
    }
  };

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <FireIcon size={32} />
            <h1>FireLives</h1>
          </div>
          <div className="search-container">
            <SearchIcon />
            <input
              type="text"
              className="search-input"
              placeholder="What do you want to listen to?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </header>

      {/* Category Filters */}
      <div className="filters">
        {categories.map(category => (
          <button
            key={category}
            className={`filter-btn ${selectedCategory === category ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Streams Grid */}
      <main className="main-content">
        {loading ? (
          <div className="loading">
            <FireIcon size={60} className="loading-icon" />
            <p>Loading stations...</p>
          </div>
        ) : filteredStreams.length === 0 ? (
          <div className="no-results">
            <p>No stations found</p>
          </div>
        ) : (
          <div className="streams-grid">
            {filteredStreams.map(stream => (
              <div key={stream.id} className="stream-card" onClick={() => playStream(stream)}>
                <div className="stream-thumbnail">
                  {stream.thumbnail ? (
                    <img src={stream.thumbnail} alt={stream.title} />
                  ) : (
                    <div className="thumbnail-placeholder">
                      <MusicIcon />
                    </div>
                  )}
                  {stream.isLive && <span className="live-badge">🔴 LIVE</span>}
                  <button
                    className={`play-button ${currentStream?.id === stream.id && isPlaying ? 'playing' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      playStream(stream);
                    }}
                  >
                    {currentStream?.id === stream.id && isPlaying ? <PauseIcon /> : <PlayIcon />}
                  </button>
                </div>
                <div className="stream-info">
                  <h3 className="stream-title">{stream.title}</h3>
                  <div className="stream-meta">
                    <span className="meta-item">
                      <LocationIcon />
                      {stream.author}
                    </span>
                  </div>
                  <div className="stream-category">{stream.category}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Mini Player at Bottom */}
      <div className={`mini-player ${currentStream ? 'visible' : ''}`}>
        <div className="mini-player-content">
          <div className="mini-player-info">
            <div className="mini-player-thumbnail">
              {currentStream?.thumbnail ? (
                <img src={currentStream.thumbnail} alt={currentStream.title} />
              ) : (
                <FireIcon size={32} />
              )}
            </div>
            <div className="mini-player-details">
              <div className="mini-player-title">{currentStream?.title || 'No station playing'}</div>
              <div className="mini-player-author">
                {currentStream?.author || '---'}
              </div>
            </div>
          </div>
          
          <div className="mini-player-controls">
            <button className="control-btn" onClick={togglePlayPause}>
              {isPlaying ? <PauseIcon /> : <PlayIcon />}
            </button>
            
            <div className="volume-control">
              <VolumeIcon />
              <input
                type="range"
                className="volume-slider"
                min="0"
                max="100"
                value={volume}
                onChange={handleVolumeChange}
                style={{ '--volume-percent': `${volume}%` } as React.CSSProperties}
              />
              <span className="volume-value">{volume}%</span>
            </div>
          </div>
        </div>
      </div>

      <audio ref={audioRef} />
    </div>
  );
};

export default App;
