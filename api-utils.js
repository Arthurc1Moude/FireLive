// API Utilities for FireLives
// This file contains helper functions for interacting with live audio APIs

const axios = require('axios');

/**
 * Radio Browser API endpoints
 */
const RADIO_BROWSER_APIS = [
    'https://de1.api.radio-browser.info',
    'https://nl1.api.radio-browser.info',
    'https://at1.api.radio-browser.info',
    'https://fr1.api.radio-browser.info',
];

/**
 * Fetch stations from Radio Browser API
 * @param {Object} options - Search options
 * @returns {Promise<Array>} Array of stations
 */
async function fetchStations(options = {}) {
    const {
        search = '',
        category = '',
        limit = 20,
        order = 'votes',
        reverse = true,
    } = options;

    const params = {
        limit,
        order,
        reverse,
        hidebroken: true,
    };

    if (search) params.name = search;
    if (category && category !== 'All') params.tag = category.toLowerCase();

    for (const baseUrl of RADIO_BROWSER_APIS) {
        try {
            const response = await axios.get(`${baseUrl}/json/stations/search`, {
                params,
                timeout: 5000,
                headers: {
                    'User-Agent': 'FireLives/1.0',
                },
            });

            if (response.data && response.data.length > 0) {
                return response.data;
            }
        } catch (error) {
            console.log(`Failed to fetch from ${baseUrl}, trying next...`);
        }
    }

    throw new Error('Unable to fetch stations from any API');
}

/**
 * Fetch top voted stations
 * @param {number} limit - Number of stations to fetch
 * @returns {Promise<Array>} Array of top stations
 */
async function fetchTopStations(limit = 20) {
    for (const baseUrl of RADIO_BROWSER_APIS) {
        try {
            const response = await axios.get(`${baseUrl}/json/stations/topvote/${limit}`, {
                timeout: 5000,
                headers: {
                    'User-Agent': 'FireLives/1.0',
                },
            });

            if (response.data && response.data.length > 0) {
                return response.data;
            }
        } catch (error) {
            console.log(`Failed to fetch from ${baseUrl}, trying next...`);
        }
    }

    throw new Error('Unable to fetch top stations from any API');
}

/**
 * Fetch available categories/tags
 * @param {number} limit - Number of categories to fetch
 * @returns {Promise<Array>} Array of categories
 */
async function fetchCategories(limit = 50) {
    for (const baseUrl of RADIO_BROWSER_APIS) {
        try {
            const response = await axios.get(`${baseUrl}/json/tags`, {
                params: {
                    limit,
                    order: 'stationcount',
                },
                timeout: 5000,
                headers: {
                    'User-Agent': 'FireLives/1.0',
                },
            });

            if (response.data && response.data.length > 0) {
                return response.data;
            }
        } catch (error) {
            console.log(`Failed to fetch from ${baseUrl}, trying next...`);
        }
    }

    throw new Error('Unable to fetch categories from any API');
}

/**
 * Format station data for FireLives
 * @param {Object} station - Raw station data
 * @param {number} index - Station index
 * @returns {Object} Formatted station object
 */
function formatStation(station, index) {
    return {
        id: station.stationuuid || `stream-${index}`,
        title: station.name || 'Unknown Station',
        author: station.country || 'Unknown',
        listeners: station.votes || Math.floor(Math.random() * 1000),
        thumbnail: station.favicon || '',
        category: station.tags ? station.tags.split(',')[0] : 'Music',
        url: station.url || station.url_resolved || '',
        isLive: true,
        bitrate: station.bitrate || 128,
        codec: station.codec || 'MP3',
        homepage: station.homepage || '',
        language: station.language || 'Unknown',
    };
}

module.exports = {
    fetchStations,
    fetchTopStations,
    fetchCategories,
    formatStation,
    RADIO_BROWSER_APIS,
};
