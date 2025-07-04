import React, { useState, useEffect, useRef } from 'react';
import { Send, X } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { Listing } from '../types';

interface BargainChatProps {
  item: Listing;
  onClose: () => void;
  onAccepted: (finalPrice: number) => void;
}

interface ChatMessage {
  id: string;
  sender: 'buyer' | 'seller' | 'system';
  message: string;
  timestamp: Date;
  offer?: number;
}

const nigerianResponses = [
  "Haba nau, this price never reach reach.",
  "Add am small thing nau, customer!",
  "If I sell am this price, I go just pack go back my papa village!",
  "Abeg na, do last price.",
  "Wetin be your final? Talk true abeg.",
  "This one no be Lagos price o!",
  "You sef check am na, I dey try for you.",
  "Boss, make we meet halfway na!",
  "I dey beg you, consider am well well.",
  "Na because you be my customer I dey do this price.",
  "My friend, this item na quality o! Check am well.",
  "I fit reduce am small, but no too much o.",
  "This na my final price, I no fit go below am.",
  "You be serious buyer? Make we talk business.",
  "I dey do this price because na you ask."
];

const BargainChat: React.FC<BargainChatProps> = ({ item, onClose, onAccepted }) => {
  const { state } = useApp();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentOffer, setCurrentOffer] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [lastSellerOffer, setLastSellerOffer] = useState(item.price);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const minPrice = item.minPrice || Math.floor(item.price * 0.7);

  useEffect(() => {
    // Initial greeting
    setMessages([
      {
        id: '1',
        sender: 'system',
        message: `You're bargaining for "${item.title}" with ${item.sellerName}`,
        timestamp: new Date()
      },
      {
        id: '2',
        sender: 'seller',
        message: `Hello! You wan buy my ${item.title}? The price na ₦${item.price.toLocaleString()}. Make we talk business!`,
        timestamp: new Date()
      }
    ]);
  }, [item]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const simulateSellerResponse = (buyerOffer: number) => {
    setIsTyping(true);
    
    setTimeout(() => {
      setIsTyping(false);
      
      if (buyerOffer >= minPrice) {
        // Offer accepted!
        const acceptMessage: ChatMessage = {
          id: Date.now().toString(),
          sender: 'seller',
          message: "No wahala na, oya go pay now! 🎉",
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, acceptMessage]);
        
        setTimeout(() => {
          onAccepted(buyerOffer);
        }, 1500);
        
      } else {
        // Offer too low - reduce by exactly ₦50 from last seller offer
        const newSellerOffer = Math.max(minPrice, lastSellerOffer - 50);
        setLastSellerOffer(newSellerOffer);
        
        let responseMessage: string;
        
        if (newSellerOffer === minPrice) {
          // Final offer at minimum price
          responseMessage = `This na my final price o! ₦${newSellerOffer.toLocaleString()} - I no fit go below am again.`;
        } else {
          // Regular counter-offer
          const randomResponse = nigerianResponses[Math.floor(Math.random() * nigerianResponses.length)];
          responseMessage = `${randomResponse} How about ₦${newSellerOffer.toLocaleString()}?`;
        }
        
        const responseMsg: ChatMessage = {
          id: Date.now().toString(),
          sender: 'seller',
          message: responseMessage,
          timestamp: new Date(),
          offer: newSellerOffer
        };
        
        setMessages(prev => [...prev, responseMsg]);
      }
    }, 1500 + Math.random() * 1000); // Random delay for realism
  };

  const handleSendOffer = () => {
    if (!currentOffer) return;
    
    const offer = parseInt(currentOffer);
    
    if (offer >= item.price) {
      // Show error in chat instead of browser alert
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        sender: 'system',
        message: '❌ Your offer should be below the listing price!',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
      return;
    }
    
    if (offer <= 0) {
      // Show error in chat instead of browser alert
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        sender: 'system',
        message: '❌ Please enter a valid amount!',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
      return;
    }
    
    const buyerMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'buyer',
      message: `I fit pay ₦${offer.toLocaleString()} for this item. Wetin you talk?`,
      timestamp: new Date(),
      offer: offer
    };
    
    setMessages(prev => [...prev, buyerMessage]);
    setCurrentOffer('');
    
    simulateSellerResponse(offer);
  };

  const handleQuickOffer = (percentage: number) => {
    const offer = Math.floor(item.price * percentage);
    setCurrentOffer(offer.toString());
  };

  const handleCounterOffer = (sellerOffer: number) => {
    setCurrentOffer(sellerOffer.toString());
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className={`max-w-md w-full h-[600px] rounded-2xl flex flex-col ${
        state.isDarkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        {/* Header */}
        <div className={`p-4 border-b flex items-center justify-between ${
          state.isDarkMode ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <div>
            <h3 className={`font-bold ${
              state.isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Bargain with {item.sellerName}
            </h3>
            <p className={`text-sm ${
              state.isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Listed: ₦{item.price.toLocaleString()}
            </p>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${
              state.isDarkMode
                ? 'hover:bg-gray-700 text-gray-400'
                : 'hover:bg-gray-100 text-gray-600'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'buyer' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-3 text-sm ${
                  message.sender === 'buyer'
                    ? 'chat-bubble-buyer'
                    : message.sender === 'seller'
                    ? 'chat-bubble-seller'
                    : 'chat-bubble-system'
                }`}
              >
                <p>{message.message}</p>
                {message.offer && message.sender === 'seller' && (
                  <div className="mt-2">
                    <button
                      onClick={() => handleCounterOffer(message.offer!)}
                      className="text-xs bg-white/20 hover:bg-white/30 px-2 py-1 rounded transition-colors"
                    >
                      Accept ₦{message.offer.toLocaleString()}
                    </button>
                  </div>
                )}
                <div className="text-xs opacity-75 mt-1">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="chat-bubble-seller p-3 text-sm">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Offers */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <p className={`text-xs mb-2 ${
            state.isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Quick offers:
          </p>
          <div className="flex space-x-2 mb-3">
            {[0.7, 0.8, 0.9].map((percentage) => (
              <button
                key={percentage}
                onClick={() => handleQuickOffer(percentage)}
                className="flex-1 py-2 px-3 text-xs bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all"
              >
                ₦{Math.floor(item.price * percentage).toLocaleString()}
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className={`p-4 border-t ${
          state.isDarkMode ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <div className="flex space-x-2">
            <input
              type="number"
              value={currentOffer}
              onChange={(e) => setCurrentOffer(e.target.value)}
              placeholder="Enter your offer..."
              className={`flex-1 p-3 rounded-lg border transition-colors ${
                state.isDarkMode
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              } focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
              onKeyPress={(e) => e.key === 'Enter' && handleSendOffer()}
            />
            <button
              onClick={handleSendOffer}
              disabled={!currentOffer || isTyping}
              className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BargainChat;