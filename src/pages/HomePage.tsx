import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, MapPin, Zap, Star, TrendingUp, Users, CheckCircle, Clock, Flame, ShoppingCart, MessageCircle, Eye, Heart, Plus, Minus } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { mockListings, mockUsers, categories } from '../utils/mockData';
import { Listing } from '../types';
import BargainChat from '../components/BargainChat';
import DeliveryModal from '../components/DeliveryModal';

const HomePage: React.FC = () => {
  const { state, dispatch } = useApp();
  const [flashSaleItems, setFlashSaleItems] = useState<Listing[]>([]);
  const [categoryItems, setCategoryItems] = useState<{ [key: string]: Listing[] }>({});
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [showBargainChat, setShowBargainChat] = useState(false);
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Listing | null>(null);
  const [finalPrice, setFinalPrice] = useState(0);
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    dispatch({ type: 'SET_LISTINGS', payload: mockListings });
    
    // Get stored items from localStorage
    const storedItems = localStorage.getItem('listedItems');
    const listedItems = storedItems ? JSON.parse(storedItems) : [];
    const allItems = [...mockListings, ...listedItems];
    
    // Filter flash sale items (items with flashSaleEnd date)
    const flashItems = allItems.filter(item => 
      item.flashSaleEnd && new Date(item.flashSaleEnd) > new Date()
    );
    setFlashSaleItems(flashItems);
    
    // Group items by category
    const grouped: { [key: string]: Listing[] } = {};
    categories.forEach(category => {
      grouped[category] = allItems.filter(item => 
        item.category === category && item.status === 'active'
      ).slice(0, 4); // Show max 4 items per category
    });
    setCategoryItems(grouped);

    // Initialize quantities
    const initialQuantities: { [key: string]: number } = {};
    allItems.forEach(item => {
      initialQuantities[item.id] = 1;
    });
    setQuantities(initialQuantities);
  }, [dispatch]);

  const getFlashSaleTimeLeft = (endDate: Date) => {
    const now = new Date();
    const diff = endDate.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const addToCart = (item: Listing, quantity: number = 1, negotiatedPrice?: number) => {
    const savedCart = localStorage.getItem('jijiFreshCart');
    const cart = savedCart ? JSON.parse(savedCart) : [];
    
    const existingItem = cart.find((cartItem: any) => cartItem.id === item.id);
    
    if (existingItem) {
      existingItem.quantity += quantity;
      existingItem.holdExpiry = new Date(Date.now() + 5 * 60 * 1000); // Reset timer
    } else {
      cart.push({
        ...item,
        quantity,
        negotiatedPrice,
        holdExpiry: new Date(Date.now() + 5 * 60 * 1000)
      });
    }
    
    localStorage.setItem('jijiFreshCart', JSON.stringify(cart));
    
    // Dispatch custom event to update cart count
    window.dispatchEvent(new CustomEvent('cartUpdated'));
  };

  const handleBuySharpSharp = (item: Listing) => {
    const quantity = quantities[item.id] || 1;
    addToCart(item, quantity);
    setSelectedItem(item);
    setFinalPrice(item.price * quantity);
    setShowDeliveryModal(true);
  };

  const handleAddToCart = (item: Listing) => {
    const quantity = quantities[item.id] || 1;
    addToCart(item, quantity);
    
    // Show success feedback
    const event = new CustomEvent('showNotification', {
      detail: {
        type: 'success',
        title: 'Added to Cart!',
        message: `${quantity}x ${item.title} added to your cart`,
        duration: 3000
      }
    });
    window.dispatchEvent(event);
  };

  const handleMakeOffer = (item: Listing) => {
    setSelectedItem(item);
    setShowBargainChat(true);
  };

  const handleBargainAccepted = (acceptedPrice: number) => {
    setShowBargainChat(false);
    setFinalPrice(acceptedPrice);
    
    // Add negotiated item to cart
    if (selectedItem) {
      const quantity = quantities[selectedItem.id] || 1;
      addToCart(selectedItem, quantity, acceptedPrice);
      setShowDeliveryModal(true);
    }
  };

  const handleDeliveryConfirm = (deliveryOption: 'pickup' | 'delivery', phoneNumber?: string) => {
    setShowDeliveryModal(false);
    
    // Get current checkout item and add delivery info
    const checkoutData = localStorage.getItem('jijiFreshCheckoutItem');
    if (checkoutData) {
      const checkout = JSON.parse(checkoutData);
      checkout.deliveryOption = deliveryOption;
      checkout.deliveryFee = deliveryOption === 'delivery' ? 1000 : 0;
      checkout.phoneNumber = phoneNumber;
      checkout.totalAmount = finalPrice + (deliveryOption === 'delivery' ? 1000 : 0);
      localStorage.setItem('jijiFreshCheckoutItem', JSON.stringify(checkout));
    }
    
    // Redirect to checkout page
    window.location.href = '/checkout';
  };

  const toggleFavorite = (itemId: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(itemId)) {
      newFavorites.delete(itemId);
    } else {
      newFavorites.add(itemId);
    }
    setFavorites(newFavorites);
  };

  const updateQuantity = (itemId: string, change: number) => {
    setQuantities(prev => {
      const currentQty = prev[itemId] || 1;
      const newQty = Math.max(1, currentQty + change);
      const item = [...mockListings, ...flashSaleItems, ...Object.values(categoryItems).flat()].find(i => i.id === itemId);
      const maxQty = item?.maxQuantityPerOrder || item?.availableQuantity || 99;
      return {
        ...prev,
        [itemId]: Math.min(newQty, maxQty)
      };
    });
  };

  const renderItemCard = (item: Listing, isFlashSale = false) => (
    <div
      key={item.id}
      className={`group rounded-2xl overflow-hidden transition-all duration-300 hover:scale-105 backdrop-blur-sm ${
        state.isDarkMode 
          ? 'bg-gray-800/80 hover:bg-gray-750/80 border border-gray-700/50' 
          : 'bg-white/80 hover:shadow-xl border border-white/50'
      }`}
    >
      {/* Image */}
      <div className="relative aspect-video overflow-hidden">
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        
        {/* Flash Sale Badge */}
        {isFlashSale && item.flashSaleEnd && (
          <div className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-1 animate-pulse">
            <Flame className="w-3 h-3" />
            <span>FLASH SALE</span>
          </div>
        )}
        
        {/* Stock Badge */}
        {item.availableQuantity && item.availableQuantity <= 5 && (
          <div className="absolute top-3 right-12 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold">
            Only {item.availableQuantity} left!
          </div>
        )}
        
        {/* Favorite Button */}
        <button
          onClick={() => toggleFavorite(item.id)}
          className={`absolute top-3 right-3 p-2 rounded-full transition-all backdrop-blur-sm ${
            favorites.has(item.id)
              ? 'bg-red-500 text-white scale-110'
              : 'bg-white/80 text-gray-600 hover:bg-white hover:scale-110'
          }`}
        >
          <Heart className={`w-4 h-4 ${favorites.has(item.id) ? 'fill-current' : ''}`} />
        </button>

        {/* Stats */}
        <div className="absolute bottom-3 left-3 flex items-center space-x-3 text-white text-xs">
          <div className="flex items-center space-x-1 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full">
            <Eye className="w-3 h-3" />
            <span>{item.views}</span>
          </div>
          <div className="flex items-center space-x-1 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full">
            <Heart className="w-3 h-3" />
            <span>{item.likes}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className={`font-bold text-lg mb-2 line-clamp-1 ${
          state.isDarkMode ? 'text-white' : 'text-gray-900'
        }`}>
          {item.title}
        </h3>
        
        <p className={`text-sm mb-4 line-clamp-2 ${
          state.isDarkMode ? 'text-gray-400' : 'text-gray-600'
        }`}>
          {item.description}
        </p>

        {/* Flash Sale Timer */}
        {isFlashSale && item.flashSaleEnd && (
          <div className="mb-4 p-3 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-lg border border-red-200 dark:border-red-800">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-red-600 dark:text-red-400">
                Ends in:
              </span>
              <div className="flex items-center space-x-1 text-red-600 dark:text-red-400 font-bold">
                <Clock className="w-4 h-4" />
                <span>{getFlashSaleTimeLeft(new Date(item.flashSaleEnd))}</span>
              </div>
            </div>
          </div>
        )}

        {/* Price */}
        <div className="mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent">
              ₦{item.price.toLocaleString()}
            </span>
            {item.isNegotiable && (
              <span className={`text-sm px-2 py-1 rounded-full ${
                state.isDarkMode ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-600'
              }`}>
                Negotiable
              </span>
            )}
          </div>
          {item.availableQuantity && (
            <p className={`text-xs mt-1 ${
              state.isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              {item.availableQuantity} available
            </p>
          )}
        </div>

        {/* Seller Info */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className={`text-sm font-medium ${
              state.isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              {item.sellerName}
            </div>
            <div className="flex items-center space-x-1">
              <Star className="w-3 h-3 text-yellow-400 fill-current" />
              <span className="text-xs text-gray-500">4.8</span>
            </div>
          </div>
          <span className={`text-xs px-2 py-1 rounded-full ${
            item.condition === 'new' 
              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
              : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
          }`}>
            {item.condition}
          </span>
        </div>

        {/* Location */}
        <div className="flex items-center space-x-1 mb-4">
          <MapPin className="w-4 h-4 text-gray-400" />
          <span className={`text-sm ${
            state.isDarkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>
            {item.location}
          </span>
        </div>

        {/* Quantity Selector */}
        <div className="flex items-center justify-between mb-4">
          <span className={`text-sm font-medium ${
            state.isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Quantity:
          </span>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => updateQuantity(item.id, -1)}
              className={`p-1 rounded transition-colors ${
                state.isDarkMode
                  ? 'hover:bg-gray-700 text-gray-400'
                  : 'hover:bg-gray-200 text-gray-600'
              }`}
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className={`font-medium min-w-[2rem] text-center ${
              state.isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              {quantities[item.id] || 1}
            </span>
            <button
              onClick={() => updateQuantity(item.id, 1)}
              className={`p-1 rounded transition-colors ${
                state.isDarkMode
                  ? 'hover:bg-gray-700 text-gray-400'
                  : 'hover:bg-gray-200 text-gray-600'
              }`}
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2">
          <div className="flex space-x-2">
            <button
              onClick={() => handleBuySharpSharp(item)}
              className="flex-1 flex items-center justify-center space-x-2 bg-gradient-to-r from-green-500 to-green-600 text-white py-2 px-4 rounded-lg hover:from-green-600 hover:to-green-700 transition-all transform hover:scale-105"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Buy Now</span>
            </button>
            
            {item.isNegotiable && (
              <button
                onClick={() => handleMakeOffer(item)}
                className={`flex items-center justify-center space-x-1 px-3 py-2 rounded-lg transition-all transform hover:scale-105 ${
                  state.isDarkMode
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700'
                    : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600'
                }`}
              >
                <MessageCircle className="w-4 h-4" />
                <span className="hidden sm:inline">Offer</span>
              </button>
            )}
          </div>
          
          <button
            onClick={() => handleAddToCart(item)}
            className={`w-full flex items-center justify-center space-x-2 py-2 px-4 rounded-lg transition-all ${
              state.isDarkMode
                ? 'bg-gray-700 text-white hover:bg-gray-600'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>Add to Cart</span>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="mb-8 animate-bounce-slow">
              <div className="text-8xl mb-4">🌱</div>
            </div>
            <h1 className={`text-4xl md:text-6xl font-bold mb-6 ${
              state.isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Welcome to{' '}
              <span className="bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent">
                JijiFresh
              </span>
            </h1>
            <p className={`text-xl md:text-2xl mb-8 max-w-3xl mx-auto ${
              state.isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              {state.currentSlogan}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/listings"
                className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-200 transform hover:scale-105"
              >
                Browse All Items
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Flash Sales Section */}
      {flashSaleItems.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <Flame className="w-8 h-8 text-red-500" />
              <h2 className={`text-3xl font-bold ${
                state.isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Flash Sales ⚡
              </h2>
            </div>
            <Link
              to="/listings?filter=flash-sale"
              className="text-green-600 hover:text-green-700 font-medium"
            >
              View All →
            </Link>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {flashSaleItems.map(item => renderItemCard(item, true))}
          </div>
        </section>
      )}

      {/* Category Sections */}
      {Object.entries(categoryItems).map(([category, items]) => 
        items.length > 0 && (
          <section key={category} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className={`text-3xl font-bold ${
                state.isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {category}
              </h2>
              <Link
                to={`/listings?category=${encodeURIComponent(category)}`}
                className="text-green-600 hover:text-green-700 font-medium"
              >
                View All →
              </Link>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {items.map(item => renderItemCard(item))}
            </div>
          </section>
        )
      )}

      {/* Bargain Chat Modal */}
      {showBargainChat && selectedItem && (
        <BargainChat
          item={selectedItem}
          onClose={() => setShowBargainChat(false)}
          onAccepted={handleBargainAccepted}
        />
      )}

      {/* Delivery Modal */}
      {showDeliveryModal && selectedItem && (
        <DeliveryModal
          item={selectedItem}
          finalPrice={finalPrice}
          onClose={() => setShowDeliveryModal(false)}
          onConfirm={handleDeliveryConfirm}
        />
      )}
    </div>
  );
};

export default HomePage;