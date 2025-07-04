from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os
from datetime import datetime
import requests

app = Flask(__name__)
CORS(app)

# OpenRouter API configuration
OPENROUTER_API_KEY = os.getenv('OPENROUTER_API_KEY', 'your-openrouter-api-key-here')
OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"

class JijiFreshAgent:
    def __init__(self):
        self.system_prompt = """You are the JijiFresh Assistant, a helpful AI agent for Nigeria's leading local marketplace. 

CONTEXT: JijiFresh is a WhatsApp-integrated marketplace focused on Akwa Ibom State, connecting local buyers and sellers for fresh produce, electronics, fashion, and more.

YOUR PERSONALITY:
- Friendly, helpful, and knowledgeable about Nigerian commerce
- Use occasional Nigerian Pidgin English naturally (not forced)
- Be enthusiastic about helping users buy and sell
- Focus on local community and trust

KEY FEATURES TO MENTION:
- WhatsApp integration for easy communication
- Secure escrow payments via Monipoint
- Flash sales with countdown timers
- Negotiable pricing system
- Free pickup or tiered delivery (₦1,000-₦4,000)
- Quantity management for bulk sellers
- Smart cart with 5-minute hold timer

COMMON USER INTENTS:
1. SELLING: Guide to seller dashboard, listing tips, pricing advice
2. BUYING: Help find items, explain negotiation, delivery options  
3. SUPPORT: Safety tips, payment help, technical issues
4. GENERAL: Platform features, how it works, getting started

RESPONSE STYLE:
- Keep responses concise but helpful
- Use emojis appropriately 
- Provide actionable next steps
- Ask follow-up questions to understand needs
- Be encouraging and positive

IMPORTANT: Always prioritize user safety and legitimate transactions."""

    def get_response(self, message, context=None):
        try:
            # Prepare the conversation context
            user_context = ""
            if context:
                ctx = json.loads(context) if isinstance(context, str) else context
                user_role = ctx.get('userRole', 'guest')
                current_page = ctx.get('currentPage', '/')
                is_logged_in = ctx.get('isLoggedIn', False)
                
                user_context = f"\nUser Context: Role={user_role}, Page={current_page}, LoggedIn={is_logged_in}"

            # Create the API request
            headers = {
                "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                "Content-Type": "application/json"
            }
            
            data = {
                "model": "meta-llama/llama-3.1-8b-instruct:free",  # Free model
                "messages": [
                    {"role": "system", "content": self.system_prompt + user_context},
                    {"role": "user", "content": message}
                ],
                "max_tokens": 300,
                "temperature": 0.7
            }
            
            response = requests.post(OPENROUTER_URL, headers=headers, json=data, timeout=10)
            
            if response.status_code == 200:
                result = response.json()
                return result['choices'][0]['message']['content']
            else:
                return self._get_fallback_response(message)
                
        except Exception as e:
            print(f"OpenRouter API error: {e}")
            return self._get_fallback_response(message)
    
    def _get_fallback_response(self, message):
        """Fallback responses when API is unavailable"""
        message_lower = message.lower()
        
        if any(word in message_lower for word in ['sell', 'list', 'upload']):
            return """🏪 **Ready to start selling?**

Here's how to list your items:
1. Go to Seller Dashboard
2. Click "New Listing"
3. Add clear photos
4. Write detailed description
5. Set competitive price

💡 **Pro tip:** Items with good photos sell 3x faster!

Need help with anything specific?"""

        elif any(word in message_lower for word in ['buy', 'find', 'search', 'looking']):
            return """🛒 **Looking for something?**

Here's how to find great deals:
• Use the search bar
• Browse categories  
• Check flash sales 🔥
• Filter by location

What are you looking to buy today?"""

        elif any(word in message_lower for word in ['help', 'support', 'how']):
            return """❓ **I'm here to help!**

I can assist with:
• 🛒 Finding items to buy
• 📦 Listing items to sell
• 💬 Negotiating prices
• 🚚 Delivery options
• 🔒 Safety tips

What do you need help with?"""

        elif any(word in message_lower for word in ['price', 'negotiate', 'bargain']):
            return """💰 **Negotiation Tips:**

✅ **Best practices:**
• Be polite and respectful
• Research similar items first
• Make reasonable offers
• Ask about bulk discounts

Most sellers accept 10-20% below asking price! 🎯"""

        else:
            return """👋🏽 **Welcome to JijiFresh!**

I can help you:
🛒 **Buy** - Find great local deals
📦 **Sell** - List items quickly
💬 **Support** - Get help anytime

What would you like to do today?"""

# Initialize the agent
agent = JijiFreshAgent()

@app.route('/chat', methods=['POST'])
def chat():
    try:
        message = request.form.get('message', '')
        context = request.form.get('context', '{}')
        
        if not message:
            return jsonify({'error': 'Message is required'}), 400
        
        # Handle file upload if present
        file_info = ""
        if 'file' in request.files:
            file = request.files['file']
            if file.filename:
                file_info = f"\n[User uploaded: {file.filename}]"
                message += file_info
        
        # Get response from agent
        response = agent.get_response(message, context)
        
        return jsonify({
            'response': response,
            'timestamp': datetime.now().isoformat()
        })
        
    except Exception as e:
        print(f"Chat endpoint error: {e}")
        return jsonify({
            'response': "Sorry, I'm having trouble right now. Please try again in a moment! 🤖",
            'error': str(e)
        }), 500

@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        'status': 'healthy',
        'service': 'JijiFresh Agent API',
        'timestamp': datetime.now().isoformat()
    })

@app.route('/', methods=['GET'])
def home():
    return jsonify({
        'message': 'JijiFresh Agent API is running!',
        'endpoints': {
            'chat': '/chat (POST)',
            'health': '/health (GET)'
        }
    })

if __name__ == '__main__':
    print("🌱 Starting JijiFresh Agent API...")
    print("🔗 OpenRouter API Key:", "✅ Set" if OPENROUTER_API_KEY != 'your-openrouter-api-key-here' else "❌ Not set")
    app.run(debug=True, host='0.0.0.0', port=5000)