import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Paperclip, Image, Video, ExternalLink } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
}

interface JijiFreshAgentProps {
  className?: string;
}

const JijiFreshAgent: React.FC<JijiFreshAgentProps> = ({ className = '' }) => {
  const { state } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasShownWelcome, setHasShownWelcome] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Welcome message animation
  useEffect(() => {
    if (isOpen && !hasShownWelcome) {
      setIsTyping(true);
      
      setTimeout(() => {
        setIsTyping(false);
        const welcomeMessage: Message = {
          id: Date.now().toString(),
          text: "👋🏽 Welcome to JijiFresh! Because Fresh Things Move Fast.\n\nWhat would you like to do today?\n\n🛒 Browse items\n📦 Sell something\n❓ Get help",
          sender: 'bot',
          timestamp: new Date()
        };
        setMessages([welcomeMessage]);
        setHasShownWelcome(true);
      }, 1500);
    }
  }, [isOpen, hasShownWelcome]);

  // Handle file selection
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  // Clear file selection
  const clearFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Send message to API
  const sendMessage = async (messageText: string, file?: File) => {
    if (!messageText.trim() && !file) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      sender: 'user',
      timestamp: new Date(),
      mediaUrl: file ? previewUrl || undefined : undefined,
      mediaType: file ? (file.type.startsWith('image/') ? 'image' : 'video') : undefined
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    clearFile();
    setIsTyping(true);

    try {
      // Prepare form data for API call
      const formData = new FormData();
      formData.append('message', messageText);
      if (file) {
        formData.append('file', file);
      }

      // Add context about user state
      const context = {
        userRole: state.user?.role || 'guest',
        userName: state.user?.name || 'Guest',
        isLoggedIn: !!state.user,
        currentPage: window.location.pathname
      };
      formData.append('context', JSON.stringify(context));

      const response = await fetch('http://127.0.0.1:5000/chat', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Add bot response
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.response || "I'm sorry, I couldn't process that request. Please try again.",
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);

    } catch (error) {
      console.error('Chat API error:', error);
      
      // Fallback responses based on message content
      let fallbackResponse = "⚠️ I'm having trouble connecting to my brain right now. Let me try to help you anyway!\n\n";
      
      const lowerMessage = messageText.toLowerCase();
      
      if (lowerMessage.includes('sell') || lowerMessage.includes('list')) {
        fallbackResponse += "🏪 To sell items:\n1. Go to Seller Dashboard\n2. Click 'New Listing'\n3. Add photos and details\n4. Set your price\n\nWould you like me to take you there?";
      } else if (lowerMessage.includes('buy') || lowerMessage.includes('find') || lowerMessage.includes('search')) {
        fallbackResponse += "🛒 To find items:\n1. Use the search bar\n2. Browse categories\n3. Filter by location\n4. Contact sellers directly\n\nCheck out our listings page!";
      } else if (lowerMessage.includes('help') || lowerMessage.includes('support')) {
        fallbackResponse += "📞 Need help?\n• Browse our FAQ\n• Contact support\n• Check safety tips\n• Read user guides\n\nWhat specific help do you need?";
      } else {
        fallbackResponse += "I can help you with:\n🛒 Finding items to buy\n📦 Listing items to sell\n❓ General questions\n🔧 Technical support\n\nWhat would you like to do?";
      }

      const fallbackMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: fallbackResponse,
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, fallbackMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSend = () => {
    sendMessage(input, selectedFile || undefined);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  // Mobile detection
  const isMobile = window.innerWidth <= 768;

  return (
    <>
      {/* Floating Chat Bubble */}
      {!isOpen && (
        <button
          onClick={toggleChat}
          className={`fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 flex items-center justify-center ${className}`}
          aria-label="Open JijiFresh Assistant"
        >
          <MessageCircle className="w-6 h-6" />
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className={`fixed z-50 transition-all duration-300 ${
          isMobile 
            ? 'inset-0 bg-white dark:bg-gray-900' 
            : 'bottom-6 right-6 w-96 h-[600px] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700'
        }`}>
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-t-2xl">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                🌱
              </div>
              <div>
                <h3 className="font-bold text-lg">JijiFresh Assistant</h3>
                <p className="text-xs opacity-90">Always here to help!</p>
              </div>
            </div>
            <button
              onClick={toggleChat}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              aria-label="Close chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div 
            ref={chatContainerRef}
            className={`overflow-y-auto p-4 space-y-4 ${
              isMobile ? 'h-[calc(100vh-140px)]' : 'h-[400px]'
            } ${state.isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}
          >
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-2xl shadow-sm ${
                    message.sender === 'user'
                      ? 'bg-gradient-to-r from-green-500 to-green-600 text-white rounded-br-md'
                      : state.isDarkMode
                      ? 'bg-gray-800 text-white border border-gray-700 rounded-bl-md'
                      : 'bg-white text-gray-800 border border-gray-200 rounded-bl-md'
                  }`}
                >
                  {/* Media preview */}
                  {message.mediaUrl && (
                    <div className="mb-2">
                      {message.mediaType === 'image' ? (
                        <img 
                          src={message.mediaUrl} 
                          alt="Uploaded content" 
                          className="max-w-full h-auto rounded-lg"
                        />
                      ) : (
                        <video 
                          src={message.mediaUrl} 
                          controls 
                          className="max-w-full h-auto rounded-lg"
                        />
                      )}
                    </div>
                  )}
                  
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {message.text}
                  </p>
                  
                  <div className={`text-xs mt-2 opacity-70 ${
                    message.sender === 'user' ? 'text-white/70' : 'text-gray-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className={`p-3 rounded-2xl rounded-bl-md ${
                  state.isDarkMode 
                    ? 'bg-gray-800 border border-gray-700' 
                    : 'bg-white border border-gray-200'
                }`}>
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* File Preview */}
          {previewUrl && (
            <div className={`p-3 border-t border-gray-200 dark:border-gray-700 ${
              state.isDarkMode ? 'bg-gray-800' : 'bg-gray-50'
            }`}>
              <div className="flex items-center space-x-3">
                <div className="relative">
                  {selectedFile?.type.startsWith('image/') ? (
                    <img src={previewUrl} alt="Preview" className="w-12 h-12 object-cover rounded-lg" />
                  ) : (
                    <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-lg flex items-center justify-center">
                      <Video className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                    </div>
                  )}
                  <button
                    onClick={clearFile}
                    className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
                <div className="flex-1">
                  <p className={`text-sm font-medium ${
                    state.isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {selectedFile?.name}
                  </p>
                  <p className={`text-xs ${
                    state.isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    {selectedFile && (selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className={`p-4 border-t border-gray-200 dark:border-gray-700 ${
            state.isDarkMode ? 'bg-gray-800' : 'bg-white'
          } ${isMobile ? '' : 'rounded-b-2xl'}`}>
            <div className="flex items-end space-x-2">
              {/* File Upload */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className={`p-2 rounded-lg transition-colors ${
                  state.isDarkMode
                    ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
                aria-label="Attach file"
              >
                <Paperclip className="w-5 h-5" />
              </button>

              {/* Text Input */}
              <div className="flex-1">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  rows={1}
                  className={`w-full p-3 rounded-xl border resize-none transition-colors ${
                    state.isDarkMode
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                      : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
                  } focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                  style={{ minHeight: '44px', maxHeight: '120px' }}
                />
              </div>

              {/* Send Button */}
              <button
                onClick={handleSend}
                disabled={!input.trim() && !selectedFile}
                className="p-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Send message"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>

            {/* Footer Link */}
            <div className="mt-3 text-center">
              <a
                href="/listings"
                onClick={toggleChat}
                className={`inline-flex items-center space-x-1 text-xs transition-colors ${
                  state.isDarkMode
                    ? 'text-gray-400 hover:text-white'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <span>🌐 Prefer to browse? Visit the full Marketplace</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default JijiFreshAgent;