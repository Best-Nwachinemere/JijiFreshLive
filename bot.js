const express = require('express');
const qrcode = require('qrcode-terminal');
const fs = require('fs');
const path = require('path');

// Mock WhatsApp client for WebContainer environment
class MockWhatsAppClient {
  constructor(options) {
    this.options = options;
    this.eventHandlers = {};
  }

  on(event, handler) {
    this.eventHandlers[event] = handler;
  }

  async initialize() {
    console.log('🌱 JijiFresh WhatsApp Bot - Mock Mode (WebContainer Environment)');
    console.log('📱 In production, this would connect to WhatsApp Web');
    
    // Simulate QR code generation
    if (this.eventHandlers.qr) {
      const mockQR = 'MOCK_QR_CODE_FOR_WEBCONTAINER';
      this.eventHandlers.qr(mockQR);
    }
    
    // Simulate ready state
    setTimeout(() => {
      if (this.eventHandlers.ready) {
        this.eventHandlers.ready();
      }
    }, 2000);
  }

  async sendMessage(chatId, message) {
    console.log(`📤 Mock send to ${chatId}: ${message}`);
    return Promise.resolve({ success: true });
  }
}

class JijiFreshBot {
  constructor() {
    this.app = express();
    
    // Use mock client in WebContainer environment
    this.client = new MockWhatsAppClient({
      authStrategy: { name: 'LocalAuth' },
      puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      }
    });
    
    this.listings = new Map(); // In production, this would be a database
    this.users = new Map();
    this.onboarders = new Map();
    this.jijiPoints = new Map();
    
    this.setupMiddleware();
    this.setupWhatsAppHandlers();
    this.setupRoutes();
    this.seedMockData();
  }

  seedMockData() {
    // Add some mock data for demonstration
    const mockListings = [
      {
        id: 'JF1701234567890',
        title: 'Fresh Tomatoes',
        price: 500,
        location: 'Uyo',
        seller: '2348123456789',
        sellerName: 'Mama Blessing',
        createdAt: new Date(),
        status: 'active',
        category: 'Fresh Produce'
      },
      {
        id: 'JF1701234567891',
        title: 'Local Rice',
        price: 3000,
        location: 'Eket',
        seller: '2348123456788',
        sellerName: 'Alhaji Musa',
        createdAt: new Date(),
        status: 'active',
        category: 'Food & Food Items'
      }
    ];

    mockListings.forEach(listing => {
      this.listings.set(listing.id, listing);
    });

    // Mock users
    this.users.set('2348123456789', {
      role: 'seller',
      name: 'Mama Blessing',
      registeredAt: new Date(),
      state: 'active'
    });

    this.users.set('2348123456788', {
      role: 'seller',
      name: 'Alhaji Musa',
      registeredAt: new Date(),
      state: 'active'
    });
  }

  setupMiddleware() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(require('cors')());
  }

  setupWhatsAppHandlers() {
    // QR Code for initial setup
    this.client.on('qr', (qr) => {
      console.log('🌱 JijiFresh WhatsApp Bot - Scan this QR code:');
      console.log('📱 Mock QR Code:', qr);
      console.log('ℹ️  In production, this would show a real QR code to scan');
    });

    // Bot ready
    this.client.on('ready', () => {
      console.log('🚀 JijiFresh WhatsApp Bot is ready! (Mock Mode)');
      console.log('📋 Available API endpoints:');
      console.log('   GET  /api/listings - View all listings');
      console.log('   GET  /api/users - View all users');
      console.log('   POST /api/simulate-message - Simulate WhatsApp message');
    });

    // Handle incoming messages (mock)
    this.client.on('message', async (message) => {
      await this.handleMessage(message);
    });
  }

  async handleMessage(message) {
    const contact = { number: message.from || '2348123456789' };
    const phoneNumber = contact.number;
    const messageText = message.body.toLowerCase().trim();
    const isGroup = false; // Mock: no group messages
    
    // Ignore group messages and own messages
    if (isGroup || message.fromMe) return;

    console.log(`📱 Message from ${phoneNumber}: ${message.body}`);

    try {
      // Route message based on content
      if (messageText.includes('hi jijifresh') || messageText.includes('hello jijifresh')) {
        await this.handleGreeting(message, phoneNumber);
      } else if (messageText.startsWith('sell ') || messageText.startsWith('list ')) {
        await this.handleQuickListing(message, phoneNumber);
      } else if (messageText.startsWith('find ') || messageText.startsWith('search ')) {
        await this.handleSearch(message, phoneNumber);
      } else if (messageText.startsWith('buy ')) {
        await this.handleBuyRequest(message, phoneNumber);
      } else if (messageText.startsWith('offer ') || messageText.startsWith('bargain ')) {
        await this.handleBargainOffer(message, phoneNumber);
      } else if (messageText === 'my shop' || messageText === 'my items') {
        await this.handleMyShop(message, phoneNumber);
      } else if (messageText === 'help' || messageText === 'commands') {
        await this.handleHelp(message, phoneNumber);
      } else if (messageText.includes('onboard') && messageText.includes('seller')) {
        await this.handleOnboardingRequest(message, phoneNumber);
      } else if (message.hasMedia) {
        await this.handleMediaMessage(message, phoneNumber);
      } else {
        await this.handleUnknownCommand(message, phoneNumber);
      }
    } catch (error) {
      console.error('Error handling message:', error);
      await this.mockReply(message, 'Sorry, something went wrong. Please try again later.');
    }
  }

  async mockReply(message, text) {
    console.log(`🤖 Bot Reply: ${text}`);
    return Promise.resolve();
  }

  async handleGreeting(message, phoneNumber) {
    const user = this.users.get(phoneNumber);
    
    if (!user) {
      // New user registration
      const welcomeMessage = `🌱 *Welcome to JijiFresh!*

I'm your personal marketplace assistant! 

*Are you a:*
1️⃣ *Seller* - I want to sell items
2️⃣ *Buyer* - I want to buy items  
3️⃣ *Onboarder* - I want to earn JijiPoints

Reply with just the number (1, 2, or 3)`;

      await this.mockReply(message, welcomeMessage);
      
      // Store temporary registration state
      this.users.set(phoneNumber, { 
        state: 'registering',
        timestamp: Date.now()
      });
    } else {
      // Returning user
      const welcomeBack = `🌱 Welcome back to JijiFresh!

*Quick Commands:*
• *sell tomatoes 500 uyo* - List an item
• *find rice uyo* - Search for items
• *my shop* - View your listings
• *help* - See all commands

What would you like to do today?`;

      await this.mockReply(message, welcomeBack);
    }
  }

  async handleQuickListing(message, phoneNumber) {
    const user = this.users.get(phoneNumber);
    
    if (!user || user.role !== 'seller') {
      await this.mockReply(message, '❌ Only registered sellers can list items. Send "Hi JijiFresh" to register!');
      return;
    }

    // Parse: "sell tomatoes 500 uyo" or "list rice 3000 eket"
    const parts = message.body.toLowerCase().split(' ');
    
    if (parts.length < 4) {
      await this.mockReply(message, `❌ *Incorrect format!*

*Correct format:*
sell [item] [price] [location]

*Example:*
sell tomatoes 500 uyo`);
      return;
    }

    const item = parts.slice(1, -2).join(' ');
    const price = parseInt(parts[parts.length - 2]);
    const location = parts[parts.length - 1];

    if (isNaN(price) || price <= 0) {
      await this.mockReply(message, '❌ Please enter a valid price in Naira');
      return;
    }

    // Create listing
    const listingId = `JF${Date.now()}`;
    const listing = {
      id: listingId,
      title: this.capitalizeWords(item),
      price: price,
      location: this.capitalizeWords(location),
      seller: phoneNumber,
      sellerName: user.name || phoneNumber,
      createdAt: new Date(),
      status: 'active',
      category: this.categorizeItem(item)
    };

    this.listings.set(listingId, listing);

    // Award points to onboarder if applicable
    if (user.onboardedBy) {
      this.awardPoints(user.onboardedBy, 15, 'first_listing');
    }

    const successMessage = `✅ *Item Listed Successfully!*

📦 *${listing.title}*
💰 ₦${price.toLocaleString()}
📍 ${listing.location}
🆔 ID: ${listingId}

Your item is now live on JijiFresh! 🎉

*Next steps:*
• Add a photo: Send me a photo with description
• Edit listing: Type "edit ${listingId}"
• View all items: Type "my shop"`;

    await this.mockReply(message, successMessage);

    // Sync with web dashboard
    await this.syncToWebDashboard(listing);
  }

  async handleSearch(message, phoneNumber) {
    // Parse: "find tomatoes uyo" or "search rice eket"
    const parts = message.body.toLowerCase().split(' ');
    const searchTerm = parts.slice(1, -1).join(' ');
    const location = parts[parts.length - 1];

    if (parts.length < 3) {
      await this.mockReply(message, `❌ *Incorrect format!*

*Correct format:*
find [item] [location]

*Example:*
find tomatoes uyo`);
      return;
    }

    // Search listings
    const results = Array.from(this.listings.values()).filter(listing => 
      listing.status === 'active' &&
      listing.title.toLowerCase().includes(searchTerm) &&
      listing.location.toLowerCase().includes(location)
    );

    if (results.length === 0) {
      await this.mockReply(message, `😔 No "${searchTerm}" found in ${location}.

*Try:*
• Different spelling
• Nearby locations
• Broader search terms

*Popular items:* rice, tomatoes, phones, clothes`);
      return;
    }

    let searchResults = `🔍 *Found ${results.length} item(s) for "${searchTerm}" in ${location}:*\n\n`;

    results.slice(0, 5).forEach((listing, index) => {
      searchResults += `${index + 1}️⃣ *${listing.title}*
💰 ₦${listing.price.toLocaleString()}
👤 ${listing.sellerName}
📍 ${listing.location}
🆔 ${listing.id}

`;
    });

    searchResults += `*To buy:* buy ${results[0].id}
*To bargain:* offer ${results[0].id} [your_price]

*Need help?* Type "help"`;

    await this.mockReply(message, searchResults);
  }

  async handleBuyRequest(message, phoneNumber) {
    // Parse: "buy JF1234567890"
    const parts = message.body.split(' ');
    const listingId = parts[1];

    if (!listingId) {
      await this.mockReply(message, '❌ Please specify item ID. Example: buy JF1234567890');
      return;
    }

    const listing = this.listings.get(listingId);
    
    if (!listing) {
      await this.mockReply(message, '❌ Item not found. Please check the ID and try again.');
      return;
    }

    if (listing.status !== 'active') {
      await this.mockReply(message, '❌ This item is no longer available.');
      return;
    }

    if (listing.seller === phoneNumber) {
      await this.mockReply(message, '❌ You cannot buy your own item!');
      return;
    }

    // Create purchase intent
    const purchaseId = `PUR${Date.now()}`;
    const purchase = {
      id: purchaseId,
      listingId: listingId,
      buyer: phoneNumber,
      seller: listing.seller,
      price: listing.price,
      status: 'pending',
      createdAt: new Date()
    };

    const confirmMessage = `🛒 *Purchase Confirmation*

📦 *${listing.title}*
💰 ₦${listing.price.toLocaleString()}
👤 Seller: ${listing.sellerName}
📍 ${listing.location}

*Payment Instructions:*
💳 Transfer ₦${listing.price.toLocaleString()} to:
🏦 Moniepoint MFB
🔢 8123456789
👤 JijiFresh Escrow

*After payment:*
Reply "paid ${purchaseId}" with your receipt

*Questions?* Contact seller or type "help"`;

    await this.mockReply(message, confirmMessage);

    // Notify seller (mock)
    const sellerNotification = `🔔 *New Purchase Request!*

📦 Someone wants to buy your *${listing.title}*
💰 ₦${listing.price.toLocaleString()}
🆔 Purchase ID: ${purchaseId}

The buyer will contact you after payment confirmation.`;

    console.log(`📤 Seller notification to ${listing.seller}: ${sellerNotification}`);
  }

  async handleBargainOffer(message, phoneNumber) {
    // Parse: "offer JF1234567890 400" or "bargain JF1234567890 400"
    const parts = message.body.split(' ');
    const listingId = parts[1];
    const offerPrice = parseInt(parts[2]);

    if (!listingId || isNaN(offerPrice)) {
      await this.mockReply(message, `❌ *Incorrect format!*

*Correct format:*
offer [item_id] [your_price]

*Example:*
offer JF1234567890 400`);
      return;
    }

    const listing = this.listings.get(listingId);
    
    if (!listing) {
      await this.mockReply(message, '❌ Item not found. Please check the ID and try again.');
      return;
    }

    if (listing.seller === phoneNumber) {
      await this.mockReply(message, '❌ You cannot bargain for your own item!');
      return;
    }

    if (offerPrice >= listing.price) {
      await this.mockReply(message, `❌ Your offer should be below ₦${listing.price.toLocaleString()}`);
      return;
    }

    // Simulate seller response
    const responses = [
      `Haba nau, this price never reach reach. How about ₦${listing.price - 50}?`,
      `Add am small thing nau, customer! I fit do ₦${listing.price - 50}`,
      `Boss, make we meet halfway na! ₦${listing.price - 50} final price`,
      `You sef check am na, I dey try for you. ₦${listing.price - 50} last price`,
      `Na because you be my customer I dey do ₦${listing.price - 50}`
    ];

    const randomResponse = responses[Math.floor(Math.random() * responses.length)];

    setTimeout(async () => {
      const bargainResponse = `💬 *Seller Response:*

"${randomResponse}"

*To accept:* buy ${listingId}
*To counter-offer:* offer ${listingId} [new_price]
*To cancel:* Type "cancel"`;

      await this.mockReply(message, bargainResponse);
    }, 2000);

    // Notify seller about the offer (mock)
    const sellerNotification = `💰 *New Offer Received!*

📦 *${listing.title}*
💵 Offer: ₦${offerPrice.toLocaleString()}
📝 Listed: ₦${listing.price.toLocaleString()}
👤 From: ${phoneNumber}

Reply to negotiate or accept the offer.`;

    console.log(`📤 Seller notification to ${listing.seller}: ${sellerNotification}`);
  }

  async handleMyShop(message, phoneNumber) {
    const userListings = Array.from(this.listings.values()).filter(
      listing => listing.seller === phoneNumber
    );

    if (userListings.length === 0) {
      await this.mockReply(message, `📦 *Your shop is empty*

*Start selling:*
sell [item] [price] [location]

*Example:*
sell tomatoes 500 uyo

*Need help?* Type "help"`);
      return;
    }

    let shopMessage = `🏪 *Your JijiFresh Shop* (${userListings.length} items)\n\n`;

    userListings.forEach((listing, index) => {
      const status = listing.status === 'active' ? '✅' : '❌';
      shopMessage += `${index + 1}️⃣ ${status} *${listing.title}*
💰 ₦${listing.price.toLocaleString()}
📍 ${listing.location}
🆔 ${listing.id}
📅 ${listing.createdAt.toLocaleDateString()}

`;
    });

    shopMessage += `*Commands:*
• *edit [ID]* - Edit item
• *delete [ID]* - Remove item
• *sell [item] [price] [location]* - Add new item`;

    await this.mockReply(message, shopMessage);
  }

  async handleOnboardingRequest(message, phoneNumber) {
    const onboarder = this.onboarders.get(phoneNumber);
    
    if (!onboarder) {
      const onboardingMessage = `🎯 *Become a JijiFresh Onboarder!*

*Earn JijiPoints by onboarding sellers:*
• 10 points per seller signup
• 15 points per first listing
• 25 points per first sale
• 50 points for 30-day active seller

*Monthly Payouts:*
• 1000+ points: $50 USDT
• 500-999 points: $25 USDT  
• 100-499 points: $10 USDT

*Ready to start?* Reply "yes onboard"`;

      await this.mockReply(message, onboardingMessage);
      return;
    }

    // Show onboarder stats
    const points = this.jijiPoints.get(phoneNumber) || 0;
    const statsMessage = `📊 *Your Onboarding Stats*

🎯 Total JijiPoints: ${points}
👥 Sellers Onboarded: ${onboarder.sellersOnboarded || 0}
💰 Estimated Payout: $${this.calculatePayout(points)}

*This Month:*
• New signups: ${onboarder.monthlySignups || 0}
• Active sellers: ${onboarder.activeSellers || 0}

*Keep onboarding to earn more!*`;

    await this.mockReply(message, statsMessage);
  }

  async handleMediaMessage(message, phoneNumber) {
    const user = this.users.get(phoneNumber);
    
    if (!user || user.role !== 'seller') {
      await this.mockReply(message, '❌ Only registered sellers can upload photos. Send "Hi JijiFresh" to register!');
      return;
    }

    const photoMessage = `📸 *Photo received!*

Now describe your item:

*Format:*
[item_name] [price] [location] [description]

*Example:*
Fresh tomatoes 500 uyo Premium quality, just harvested

*Or use quick listing:*
sell tomatoes 500 uyo`;

    await this.mockReply(message, photoMessage);
    
    // Store photo for next listing (mock)
    user.pendingPhoto = `https://jijifresh.com/uploads/${Date.now()}.jpg`;
    this.users.set(phoneNumber, user);
  }

  async handleHelp(message, phoneNumber) {
    const helpMessage = `🌱 *JijiFresh Commands*

*🛒 For Buyers:*
• *find [item] [location]* - Search items
• *buy [item_id]* - Purchase item
• *offer [item_id] [price]* - Make offer

*📦 For Sellers:*
• *sell [item] [price] [location]* - List item
• *my shop* - View your listings
• *edit [item_id]* - Edit listing
• *delete [item_id]* - Remove listing

*🎯 For Onboarders:*
• *onboard seller* - Earn JijiPoints
• *my stats* - View earnings

*📱 General:*
• *help* - Show this menu
• Send photos to add to listings

*Examples:*
• find rice uyo
• sell tomatoes 500 eket
• buy JF1234567890
• offer JF1234567890 400

*Need support?* Contact admin`;

    await this.mockReply(message, helpMessage);
  }

  async handleUnknownCommand(message, phoneNumber) {
    const user = this.users.get(phoneNumber);
    
    if (user && user.state === 'registering') {
      await this.handleRegistration(message, phoneNumber);
      return;
    }

    const unknownMessage = `❓ I didn't understand that command.

*Try:*
• *help* - See all commands
• *find rice uyo* - Search for items
• *sell tomatoes 500 uyo* - List an item

*New here?* Send "Hi JijiFresh" to get started!`;

    await this.mockReply(message, unknownMessage);
  }

  async handleRegistration(message, phoneNumber) {
    const choice = message.body.trim();
    
    if (choice === '1') {
      // Register as seller
      this.users.set(phoneNumber, {
        role: 'seller',
        registeredAt: new Date(),
        state: 'active'
      });

      const sellerWelcome = `🎉 *Welcome, Seller!*

You can now list items on JijiFresh!

*Quick start:*
sell [item] [price] [location]

*Example:*
sell tomatoes 500 uyo

*Your seller benefits:*
✅ Reach thousands of buyers
✅ Secure escrow payments  
✅ Free listing and selling
✅ 24/7 support

*Ready to list your first item?*`;

      await this.mockReply(message, sellerWelcome);

    } else if (choice === '2') {
      // Register as buyer
      this.users.set(phoneNumber, {
        role: 'buyer',
        registeredAt: new Date(),
        state: 'active'
      });

      const buyerWelcome = `🛒 *Welcome, Buyer!*

Start shopping on JijiFresh!

*How to shop:*
find [item] [location]

*Example:*
find rice uyo

*Your buyer benefits:*
✅ Fresh local products
✅ Secure payments
✅ Bargain with sellers
✅ Fast delivery options

*Ready to find great deals?*`;

      await this.mockReply(message, buyerWelcome);

    } else if (choice === '3') {
      // Register as onboarder
      this.users.set(phoneNumber, {
        role: 'onboarder',
        registeredAt: new Date(),
        state: 'active'
      });

      this.onboarders.set(phoneNumber, {
        sellersOnboarded: 0,
        monthlySignups: 0,
        activeSellers: 0
      });

      const onboarderWelcome = `🎯 *Welcome, Onboarder!*

Start earning JijiPoints today!

*How to earn:*
• Find potential sellers
• Help them register
• Guide their first listing
• Earn points for each milestone

*Your earning potential:*
💰 $50+ per month possible
🎯 Unlimited earning potential
🏆 Top performers get bonuses

*Ready to start onboarding?*`;

      await this.mockReply(message, onboarderWelcome);

    } else {
      await this.mockReply(message, '❌ Please reply with 1, 2, or 3 to choose your role.');
    }
  }

  // Utility methods
  capitalizeWords(str) {
    return str.replace(/\w\S*/g, (txt) => 
      txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
  }

  categorizeItem(item) {
    const categories = {
      'Fresh Produce': ['tomato', 'pepper', 'onion', 'vegetable', 'fruit'],
      'Food & Food Items': ['rice', 'beans', 'garri', 'yam', 'plantain'],
      'Electronics': ['phone', 'laptop', 'tv', 'radio', 'charger'],
      'Fashion': ['dress', 'shirt', 'shoe', 'bag', 'cloth'],
      'Home & Garden': ['furniture', 'chair', 'table', 'bed', 'plant']
    };

    for (const [category, keywords] of Object.entries(categories)) {
      if (keywords.some(keyword => item.toLowerCase().includes(keyword))) {
        return category;
      }
    }
    return 'Other';
  }

  awardPoints(onboarderPhone, points, reason) {
    const currentPoints = this.jijiPoints.get(onboarderPhone) || 0;
    this.jijiPoints.set(onboarderPhone, currentPoints + points);
    
    // Mock notification
    console.log(`🎯 Points awarded to ${onboarderPhone}: +${points} for ${reason} (Total: ${currentPoints + points})`);
  }

  calculatePayout(points) {
    if (points >= 1000) return 50;
    if (points >= 500) return 25;
    if (points >= 100) return 10;
    return 0;
  }

  async uploadImage(media) {
    // Mock image upload
    return `https://jijifresh.com/uploads/${Date.now()}.jpg`;
  }

  async syncToWebDashboard(listing) {
    // Mock sync with web dashboard
    console.log('📊 Syncing listing to web dashboard:', listing.title);
  }

  setupRoutes() {
    // API endpoints for web dashboard integration
    this.app.get('/api/listings', (req, res) => {
      const listings = Array.from(this.listings.values());
      res.json(listings);
    });

    this.app.get('/api/users', (req, res) => {
      const users = Array.from(this.users.entries()).map(([phone, user]) => ({
        phone,
        ...user
      }));
      res.json(users);
    });

    this.app.get('/api/onboarders', (req, res) => {
      const onboarders = Array.from(this.onboarders.entries()).map(([phone, data]) => ({
        phone,
        points: this.jijiPoints.get(phone) || 0,
        ...data
      }));
      res.json(onboarders);
    });

    this.app.post('/api/send-message', async (req, res) => {
      const { phone, message } = req.body;
      try {
        await this.client.sendMessage(`${phone}@c.us`, message);
        res.json({ success: true });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // New endpoint to simulate WhatsApp messages for testing
    this.app.post('/api/simulate-message', async (req, res) => {
      const { phone, message } = req.body;
      
      if (!phone || !message) {
        return res.status(400).json({ error: 'Phone and message are required' });
      }

      try {
        const mockMessage = {
          body: message,
          from: phone,
          fromMe: false,
          hasMedia: false
        };

        await this.handleMessage(mockMessage);
        res.json({ success: true, message: 'Message processed successfully' });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // Health check endpoint
    this.app.get('/health', (req, res) => {
      res.json({ 
        status: 'healthy', 
        mode: 'mock',
        listings: this.listings.size,
        users: this.users.size,
        timestamp: new Date().toISOString()
      });
    });
  }

  async start() {
    // Initialize WhatsApp client (mock)
    await this.client.initialize();
    
    // Start Express server
    const PORT = process.env.PORT || 3001;
    this.app.listen(PORT, () => {
      console.log(`🌱 JijiFresh Bot API running on port ${PORT}`);
      console.log(`🔗 Health check: http://localhost:${PORT}/health`);
      console.log(`📋 API endpoints: http://localhost:${PORT}/api/listings`);
      console.log(`🧪 Test endpoint: POST http://localhost:${PORT}/api/simulate-message`);
    });
  }
}

// Start the bot
const bot = new JijiFreshBot();
bot.start().catch(console.error);

module.exports = JijiFreshBot;