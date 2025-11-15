#!/usr/bin/env python3
import re

# Read the file
with open('/home/aimoude149/firelives/live.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Find and replace the play/pause button section
old_pattern = r'(\s+{/\* Play/Pause Button \*/}\s+<button className="control-btn" onClick={togglePlayPause}>\s+{isPlaying \? <PauseIcon /> : <PlayIcon />}\s+</button>)'

new_content = '''
                            {/* Previous Button */}
                            <button 
                                className="control-btn small" 
                                onClick={playPrevious}
                                disabled={!playlist || playlist.length === 0}
                                title="Previous"
                            >
                                <SkipPreviousIcon />
                            </button>

                            {/* Play/Pause Button */}
                            <button className="control-btn" onClick={togglePlayPause}>
                                {isPlaying ? <PauseIcon /> : <PlayIcon />}
                            </button>

                            {/* Next Button */}
                            <button 
                                className="control-btn small" 
                                onClick={playNext}
                                disabled={!playlist || playlist.length === 0}
                                title="Next"
                            >
                                <SkipNextIcon />
                            </button>

                            {/* Play Order Button */}
                            <button 
                                className={`control-btn small ${playOrder !== 'sequential' ? 'active' : ''}`}
                                onClick={togglePlayOrder}
                                title={`Play Order: ${playOrder}`}
                                style={{ marginLeft: '8px' }}
                            >
                                {getPlayOrderIcon()}
                            </button>'''

# Replace
content = re.sub(old_pattern, new_content, content)

# Write back
with open('/home/aimoude149/firelives/live.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Controls added successfully!")
