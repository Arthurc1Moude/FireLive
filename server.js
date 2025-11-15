const express = require('express');
const cors = require('cors');
const path = require('path');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// Demo data for offline mode
const DEMO_STREAMS = [
  {
    id: 'demo-1',
    title: '🔥 Fire Beats Radio',
    author: 'United States',
    listeners: 5420,
    thumbnail: 'https://via.placeholder.com/100/ff4500/ffffff?text=FB',
    category: 'Electronic',
    url: 'https://stream.zeno.fm/f3wvbbqmdg8uv',
    isLive: true,
    bitrate: 320,
    codec: 'MP3',
    homepage: 'https://firelives.com'
  },
  {
    id: 'demo-2',
    title: '❤️ Heart & Soul FM',
    author: 'United Kingdom',
    listeners: 3890,
    thumbnail: 'https://via.placeholder.com/100/ff8c00/ffffff?text=HS',
    category: 'Pop',
    url: 'https://stream.zeno.fm/0r0xa792kwzuv',
    isLive: true,
    bitrate: 256,
    codec: 'MP3',
    homepage: 'https://firelives.com'
  },
  {
    id: 'demo-3',
    title: '🎸 Rock Fire Station',
    author: 'Germany',
    listeners: 4250,
    thumbnail: 'https://via.placeholder.com/100/cc3700/ffffff?text=RF',
    category: 'Rock',
    url: 'https://stream.zeno.fm/f7vc8g4mdg8uv',
    isLive: true,
    bitrate: 192,
    codec: 'MP3',
    homepage: 'https://firelives.com'
  },
  {
    id: 'demo-4',
    title: '🎵 Jazz Flames',
    author: 'France',
    listeners: 2180,
    thumbnail: 'https://via.placeholder.com/100/ffb347/000000?text=JF',
    category: 'Jazz',
    url: 'https://stream.zeno.fm/8khcqq3mdg8uv',
    isLive: true,
    bitrate: 256,
    codec: 'AAC',
    homepage: 'https://firelives.com'
  },
  {
    id: 'demo-5',
    title: '🎤 Hip Hop Heat',
    author: 'Canada',
    listeners: 6720,
    thumbnail: 'https://via.placeholder.com/100/ff4500/ffffff?text=HH',
    category: 'Hip Hop',
    url: 'https://stream.zeno.fm/66prs7n2p18uv',
    isLive: true,
    bitrate: 320,
    codec: 'MP3',
    homepage: 'https://firelives.com'
  },
  {
    id: 'demo-6',
    title: '🎼 Classical Fire',
    author: 'Austria',
    listeners: 1560,
    thumbnail: 'https://via.placeholder.com/100/ff8c00/ffffff?text=CF',
    category: 'Classical',
    url: 'https://stream.zeno.fm/0r0xa792kwzuv',
    isLive: true,
    bitrate: 192,
    codec: 'AAC',
    homepage: 'https://firelives.com'
  },
  {
    id: 'demo-7',
    title: '💬 Talk Fire Network',
    author: 'Australia',
    listeners: 3340,
    thumbnail: 'https://via.placeholder.com/100/cc3700/ffffff?text=TF',
    category: 'Talk',
    url: 'https://stream.zeno.fm/f3wvbbqmdg8uv',
    isLive: true,
    bitrate: 128,
    codec: 'MP3',
    homepage: 'https://firelives.com'
  },
  {
    id: 'demo-8',
    title: '🌟 Top 40 Blaze',
    author: 'Netherlands',
    listeners: 8920,
    thumbnail: 'https://via.placeholder.com/100/ffb347/000000?text=T40',
    category: 'Pop',
    url: 'https://stream.zeno.fm/8khcqq3mdg8uv',
    isLive: true,
    bitrate: 320,
    codec: 'MP3',
    homepage: 'https://firelives.com'
  },
  {
    id: 'demo-9',
    title: '🎹 Electronic Inferno',
    author: 'Sweden',
    listeners: 5670,
    thumbnail: 'https://via.placeholder.com/100/ff4500/ffffff?text=EI',
    category: 'Electronic',
    url: 'https://stream.zeno.fm/66prs7n2p18uv',
    isLive: true,
    bitrate: 256,
    codec: 'AAC',
    homepage: 'https://firelives.com'
  },
  {
    id: 'demo-10',
    title: '🎺 Smooth Jazz Fire',
    author: 'Italy',
    listeners: 2890,
    thumbnail: 'https://via.placeholder.com/100/ff8c00/ffffff?text=SJ',
    category: 'Jazz',
    url: 'https://stream.zeno.fm/f7vc8g4mdg8uv',
    isLive: true,
    bitrate: 192,
    codec: 'MP3',
    homepage: 'https://firelives.com'
  },
  {
    id: 'demo-11',
    title: '🔊 Bass & Fire',
    author: 'Brazil',
    listeners: 7450,
    thumbnail: 'https://via.placeholder.com/100/cc3700/ffffff?text=BF',
    category: 'Electronic',
    url: 'https://stream.zeno.fm/0r0xa792kwzuv',
    isLive: true,
    bitrate: 320,
    codec: 'MP3',
    homepage: 'https://firelives.com'
  },
  {
    id: 'demo-12',
    title: '🎸 Metal Meltdown',
    author: 'Finland',
    listeners: 4120,
    thumbnail: 'https://via.placeholder.com/100/ffb347/000000?text=MM',
    category: 'Rock',
    url: 'https://stream.zeno.fm/f3wvbbqmdg8uv',
    isLive: true,
    bitrate: 256,
    codec: 'MP3',
    homepage: 'https://firelives.com'
  }
];

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// API endpoint to fetch live streams
app.get('/api/streams', async (req, res) => {
  try {
    const { search, category, limit = 20 } = req.query;
    
    // Radio Browser API endpoints
    const apis = [
      'https://de1.api.radio-browser.info/json/stations/search',
      'https://nl1.api.radio-browser.info/json/stations/search',
      'https://at1.api.radio-browser.info/json/stations/search',
    ];

    let params = {
      limit: limit,
      order: 'votes',
      reverse: true,
      hidebroken: true,
    };

    if (search) {
      params.name = search;
    }

    if (category && category !== 'All') {
      params.tag = category.toLowerCase();
    }

    let data = null;
    let lastError = null;

    // Try each API endpoint
    for (const apiUrl of apis) {
      try {
        const response = await axios.get(apiUrl, { 
          params,
          timeout: 5000,
          headers: {
            'User-Agent': 'FireLives/1.0'
          }
        });
        
        if (response.data && response.data.length > 0) {
          data = response.data;
          break;
        }
      } catch (err) {
        lastError = err;
        console.log(`Failed to fetch from ${apiUrl}, trying next...`);
      }
    }

    if (!data) {
      // Use demo data as fallback
      console.log('Using demo data (offline mode)');
      let filteredStreams = [...DEMO_STREAMS];
      
      // Apply search filter
      if (search) {
        filteredStreams = filteredStreams.filter(s => 
          s.title.toLowerCase().includes(search.toLowerCase()) ||
          s.author.toLowerCase().includes(search.toLowerCase()) ||
          s.category.toLowerCase().includes(search.toLowerCase())
        );
      }
      
      // Apply category filter
      if (category && category !== 'All') {
        filteredStreams = filteredStreams.filter(s => 
          s.category.toLowerCase() === category.toLowerCase()
        );
      }
      
      // Apply limit
      filteredStreams = filteredStreams.slice(0, parseInt(limit));
      
      return res.json({
        success: true,
        count: filteredStreams.length,
        streams: filteredStreams,
        demo: true,
        message: 'Using demo data (offline mode)'
      });
    }

    // Format the response
    const streams = data.map((station, index) => ({
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
    }));

    res.json({
      success: true,
      count: streams.length,
      streams: streams,
    });

  } catch (error) {
    console.error('Error fetching streams:', error.message);
    
    // Return demo data on error
    let filteredStreams = [...DEMO_STREAMS];
    if (req.query.limit) {
      filteredStreams = filteredStreams.slice(0, parseInt(req.query.limit));
    }
    
    res.json({
      success: true,
      count: filteredStreams.length,
      streams: filteredStreams,
      demo: true,
      message: 'Using demo data (API unavailable)'
    });
  }
});

// Get top voted stations
app.get('/api/streams/top', async (req, res) => {
  try {
    const limit = req.query.limit || 20;
    const response = await axios.get(
      `https://de1.api.radio-browser.info/json/stations/topvote/${limit}`,
      {
        timeout: 5000,
        headers: {
          'User-Agent': 'FireLives/1.0'
        }
      }
    );

    const streams = response.data.map((station, index) => ({
      id: station.stationuuid || `stream-${index}`,
      title: station.name || 'Unknown Station',
      author: station.country || 'Unknown',
      listeners: station.votes || 0,
      thumbnail: station.favicon || '',
      category: station.tags ? station.tags.split(',')[0] : 'Music',
      url: station.url || station.url_resolved || '',
      isLive: true,
    }));

    res.json({
      success: true,
      count: streams.length,
      streams: streams,
    });

  } catch (error) {
    console.error('Error fetching top streams:', error.message);
    
    // Return demo data sorted by listeners
    const topStreams = [...DEMO_STREAMS]
      .sort((a, b) => b.listeners - a.listeners)
      .slice(0, parseInt(req.query.limit || 20));
    
    res.json({
      success: true,
      count: topStreams.length,
      streams: topStreams,
      demo: true,
      message: 'Using demo data (API unavailable)'
    });
  }
});

// Get categories/tags
app.get('/api/categories', async (req, res) => {
  try {
    const response = await axios.get(
      'https://de1.api.radio-browser.info/json/tags?limit=50&order=stationcount',
      {
        timeout: 5000,
        headers: {
          'User-Agent': 'FireLives/1.0'
        }
      }
    );

    const categories = response.data.map(tag => ({
      name: tag.name,
      count: tag.stationcount,
    }));

    res.json({
      success: true,
      categories: categories,
    });

  } catch (error) {
    console.error('Error fetching categories:', error.message);
    
    // Return demo categories
    const demoCategories = [
      { name: 'All', count: DEMO_STREAMS.length },
      { name: 'Electronic', count: DEMO_STREAMS.filter(s => s.category === 'Electronic').length },
      { name: 'Rock', count: DEMO_STREAMS.filter(s => s.category === 'Rock').length },
      { name: 'Jazz', count: DEMO_STREAMS.filter(s => s.category === 'Jazz').length },
      { name: 'Pop', count: DEMO_STREAMS.filter(s => s.category === 'Pop').length },
      { name: 'Hip Hop', count: DEMO_STREAMS.filter(s => s.category === 'Hip Hop').length },
      { name: 'Classical', count: DEMO_STREAMS.filter(s => s.category === 'Classical').length },
      { name: 'Talk', count: DEMO_STREAMS.filter(s => s.category === 'Talk').length },
    ];
    
    res.json({
      success: true,
      categories: demoCategories,
      demo: true,
      message: 'Using demo data (API unavailable)'
    });
  }
});

// Serve the main HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// ============================================
// 💳 PAYMENT & SUBSCRIPTION ENDPOINTS
// ============================================

// In-memory database for subscriptions (use real DB in production)
const subscriptions = new Map();
const orders = new Map();

// Subscription plans
const PLANS = {
  fyre: { id: 'fyre', name: 'Fyre', price: 0, features: ['Ad-supported', 'Basic quality'] },
  plus: { id: 'plus', name: 'Plus', price: 4.99, features: ['Ad-free', 'High quality', 'Offline mode'] },
  pro: { id: 'pro', name: 'Pro', price: 9.99, features: ['Everything in Plus', 'HD quality', 'Unlimited skips'] },
  family: { id: 'family', name: 'Family', price: 14.99, features: ['Everything in Pro', '6 accounts', 'Family mix'] }
};

// Create Stripe checkout session
app.post('/api/stripe/create-checkout', async (req, res) => {
  try {
    const { planId, userId } = req.body;
    
    if (!PLANS[planId]) {
      return res.status(400).json({ success: false, error: 'Invalid plan' });
    }
    
    const plan = PLANS[planId];
    const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Store order
    orders.set(orderId, {
      orderId,
      userId,
      planId,
      plan: plan.name,
      amount: plan.price,
      status: 'pending',
      paymentMethod: 'stripe',
      createdAt: new Date().toISOString()
    });
    
    // Simulate Stripe session (in production, use real Stripe API)
    const sessionId = `cs_test_${Math.random().toString(36).substr(2, 9)}`;
    
    res.json({
      success: true,
      sessionId,
      orderId,
      // In production, redirect to real Stripe checkout
      url: `/premium/success?session_id=${sessionId}&order_id=${orderId}`
    });
    
  } catch (error) {
    console.error('Stripe checkout error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create PayPal order
app.post('/api/paypal/create-order', async (req, res) => {
  try {
    const { planId, userId } = req.body;
    
    if (!PLANS[planId]) {
      return res.status(400).json({ success: false, error: 'Invalid plan' });
    }
    
    const plan = PLANS[planId];
    const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Store order
    orders.set(orderId, {
      orderId,
      userId,
      planId,
      plan: plan.name,
      amount: plan.price,
      status: 'pending',
      paymentMethod: 'paypal',
      createdAt: new Date().toISOString()
    });
    
    res.json({
      success: true,
      orderId,
      // In production, return real PayPal order ID
      paypalOrderId: `PAYPAL_${orderId}`
    });
    
  } catch (error) {
    console.error('PayPal order error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Capture PayPal payment
app.post('/api/paypal/capture-order', async (req, res) => {
  try {
    const { orderId, userId } = req.body;
    
    const order = orders.get(orderId);
    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }
    
    // Update order status
    order.status = 'completed';
    order.completedAt = new Date().toISOString();
    orders.set(orderId, order);
    
    // Create subscription
    const subscriptionId = `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    subscriptions.set(userId, {
      subscriptionId,
      userId,
      planId: order.planId,
      status: 'active',
      paymentMethod: 'paypal',
      startDate: new Date().toISOString(),
      nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    });
    
    res.json({
      success: true,
      subscription: subscriptions.get(userId)
    });
    
  } catch (error) {
    console.error('PayPal capture error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Process Apple Pay
app.post('/api/apple-pay/process', async (req, res) => {
  try {
    const { planId, userId, paymentToken } = req.body;
    
    if (!PLANS[planId]) {
      return res.status(400).json({ success: false, error: 'Invalid plan' });
    }
    
    const plan = PLANS[planId];
    const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Store order
    orders.set(orderId, {
      orderId,
      userId,
      planId,
      plan: plan.name,
      amount: plan.price,
      status: 'completed',
      paymentMethod: 'apple',
      createdAt: new Date().toISOString(),
      completedAt: new Date().toISOString()
    });
    
    // Create subscription
    const subscriptionId = `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    subscriptions.set(userId, {
      subscriptionId,
      userId,
      planId,
      status: 'active',
      paymentMethod: 'apple',
      startDate: new Date().toISOString(),
      nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    });
    
    res.json({
      success: true,
      subscription: subscriptions.get(userId)
    });
    
  } catch (error) {
    console.error('Apple Pay error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Process Google Pay
app.post('/api/google-pay/process', async (req, res) => {
  try {
    const { planId, userId, paymentToken } = req.body;
    
    if (!PLANS[planId]) {
      return res.status(400).json({ success: false, error: 'Invalid plan' });
    }
    
    const plan = PLANS[planId];
    const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Store order
    orders.set(orderId, {
      orderId,
      userId,
      planId,
      plan: plan.name,
      amount: plan.price,
      status: 'completed',
      paymentMethod: 'google',
      createdAt: new Date().toISOString(),
      completedAt: new Date().toISOString()
    });
    
    // Create subscription
    const subscriptionId = `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    subscriptions.set(userId, {
      subscriptionId,
      userId,
      planId,
      status: 'active',
      paymentMethod: 'google',
      startDate: new Date().toISOString(),
      nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    });
    
    res.json({
      success: true,
      subscription: subscriptions.get(userId)
    });
    
  } catch (error) {
    console.error('Google Pay error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get user subscription
app.get('/api/subscription/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    const subscription = subscriptions.get(userId);
    
    if (!subscription) {
      return res.json({ success: true, subscription: null });
    }
    
    res.json({ success: true, subscription });
    
  } catch (error) {
    console.error('Get subscription error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Cancel subscription
app.post('/api/subscription/cancel', (req, res) => {
  try {
    const { userId } = req.body;
    const subscription = subscriptions.get(userId);
    
    if (!subscription) {
      return res.status(404).json({ success: false, error: 'Subscription not found' });
    }
    
    subscription.status = 'canceled';
    subscription.canceledAt = new Date().toISOString();
    subscriptions.set(userId, subscription);
    
    res.json({ success: true, subscription });
    
  } catch (error) {
    console.error('Cancel subscription error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get all orders for a user
app.get('/api/orders/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    const userOrders = Array.from(orders.values()).filter(o => o.userId === userId);
    
    res.json({ success: true, orders: userOrders });
    
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'FireLives API' });
});

// Start server
app.listen(PORT, () => {
  console.log(`
  🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥
  
    FireLives Server is running!
    
    🌐 URL: http://localhost:${PORT}
    🎵 API: http://localhost:${PORT}/api/streams
    ❤️  Made with fire and love!
    
  🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥
  `);
});

module.exports = app;
