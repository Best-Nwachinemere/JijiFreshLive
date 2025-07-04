// JijiFresh Agent API utilities
export interface ChatContext {
  userRole?: string;
  userName?: string;
  isLoggedIn: boolean;
  currentPage: string;
}

export interface ChatRequest {
  message: string;
  context?: ChatContext;
  file?: File;
}

export interface ChatResponse {
  response: string;
  suggestions?: string[];
  actions?: {
    type: 'navigate' | 'open_modal' | 'trigger_action';
    payload: any;
  }[];
}

export class JijiFreshAgentAPI {
  private baseUrl: string;

  constructor(baseUrl: string = 'http://127.0.0.1:5000') {
    this.baseUrl = baseUrl;
  }

  async sendMessage(request: ChatRequest): Promise<ChatResponse> {
    const formData = new FormData();
    formData.append('message', request.message);
    
    if (request.context) {
      formData.append('context', JSON.stringify(request.context));
    }
    
    if (request.file) {
      formData.append('file', request.file);
    }

    const response = await fetch(`${this.baseUrl}/chat`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  }

  // Health check for the agent API
  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/health`, {
        method: 'GET',
      });
      return response.ok;
    } catch {
      return false;
    }
  }
}

// Singleton instance
export const agentAPI = new JijiFreshAgentAPI();

// Fallback responses for when API is unavailable
export const getFallbackResponse = (message: string, context?: ChatContext): string => {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('sell') || lowerMessage.includes('list')) {
    return `🏪 **Ready to sell on JijiFresh?**

Here's how to get started:
1. Go to your Seller Dashboard
2. Click "New Listing" 
3. Add photos and detailed description
4. Set your price (negotiable or fixed)
5. Choose your location

💡 **Pro tip:** Items with good photos sell 3x faster!

Would you like me to take you to the seller dashboard?`;
  }
  
  if (lowerMessage.includes('buy') || lowerMessage.includes('find') || lowerMessage.includes('search')) {
    return `🛒 **Looking for something specific?**

Here's how to find great deals:
1. Use the search bar above
2. Browse by categories
3. Filter by location (Akwa Ibom areas)
4. Check out flash sales for best prices

🔥 **Hot tip:** Enable notifications for new listings in your area!

What are you looking to buy today?`;
  }
  
  if (lowerMessage.includes('help') || lowerMessage.includes('support')) {
    return `❓ **Need help with JijiFresh?**

I can assist you with:
• 🛒 Finding and buying items
• 📦 Listing items for sale  
• 💬 Negotiating with sellers
• 🚚 Delivery and pickup options
• 🔒 Safety and security tips
• 💳 Payment methods

What specific help do you need?`;
  }
  
  if (lowerMessage.includes('price') || lowerMessage.includes('negotiate')) {
    return `💰 **Smart negotiation tips:**

✅ **Do:**
• Research similar items first
• Be polite and respectful
• Make reasonable offers
• Ask about bulk discounts

❌ **Don't:**
• Lowball excessively 
• Be rude or demanding
• Waste seller's time

🎯 Most sellers accept 10-20% below asking price!`;
  }

  if (lowerMessage.includes('delivery') || lowerMessage.includes('pickup')) {
    return `🚚 **Delivery & Pickup Options:**

**Self Pickup (FREE):**
• Meet at seller's location
• Inspect item before paying
• No extra charges

**Home Delivery:**
• 1-2 items: ₦1,000
• 3-6 items: ₦2,000  
• 7-10 items: ₦3,000
• 10+ items: ₦4,000

📍 Currently serving all Akwa Ibom State areas!`;
  }

  // Default response
  return `👋🏽 **Welcome to JijiFresh!**

I'm here to help you with:
🛒 **Buying** - Find great deals near you
📦 **Selling** - List your items quickly  
💬 **Support** - Get help anytime
🔥 **Flash Sales** - Don't miss hot deals

What would you like to do today?

*Type "help" for more options or just tell me what you're looking for!*`;
};