import React, { useState, useEffect } from 'react';
import { Plus, Edit3, Trash2, Eye, Camera, MapPin, DollarSign, Package, TrendingUp, MessageSquare, Star, Users, Clock, Flame, Settings } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { mockListings, categories, nigerianStates } from '../utils/mockData';
import { Listing } from '../types';
import ProfileSettings from '../components/ProfileSettings';
import ImageOptimizer from '../components/ImageOptimizer';
import LoadingSpinner from '../components/LoadingSpinner';
import { useNotifications } from '../components/NotificationSystem';
import { analytics } from '../utils/analytics';

const SellerDashboard: React.FC = () => {
  const { state, dispatch } = useApp();
  const { showSuccess, showError } = useNotifications();
  const [showNewListingForm, setShowNewListingForm] = useState(false);
  const [showProfileSettings, setShowProfileSettings] = useState(false);
  const [sellerListings, setSellerListings] = useState<Listing[]>([]);
  const [activeTab, setActiveTab] = useState('listings');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newListing, setNewListing] = useState({
    title: '',
    description: '',
    price: '',
    minPrice: '',
    category: 'Fresh Produce',
    condition: 'new' as 'new' | 'used' | 'refurbished',
    isNegotiable: true,
    location: state.user?.location || '',
    tags: '',
    image: '',
    isFlashSale: false,
    flashSaleHours: '24',
    availableQuantity: '1',
    maxQuantityPerOrder: ''
  });

  useEffect(() => {
    if (state.user) {
      const userListings = mockListings.filter(listing => listing.sellerId === state.user!.id);
      
      // Get stored items from localStorage
      const storedItems = localStorage.getItem('listedItems');
      const listedItems = storedItems ? JSON.parse(storedItems) : [];
      const userStoredItems = listedItems
        .filter((item: Listing) => item.sellerId === state.user!.id)
        .map((item: any) => ({
          ...item,
          createdAt: new Date(item.createdAt),
          flashSaleEnd: item.flashSaleEnd ? new Date(item.flashSaleEnd) : undefined
        }));
      
      setSellerListings([...userListings, ...userStoredItems]);
      analytics.trackPageView('/seller-dashboard');
    }
  }, [state.user]);

  const handleImageSelect = (file: File, preview: string) => {
    setNewListing(prev => ({ ...prev, image: preview }));
  };

  const handleSubmitListing = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!state.user) return;

    setIsSubmitting(true);

    try {
      const price = parseInt(newListing.price);
      const minPrice = newListing.isNegotiable && newListing.minPrice 
        ? parseInt(newListing.minPrice) 
        : Math.floor(price * 0.7);
      const availableQuantity = parseInt(newListing.availableQuantity) || 1;
      const maxQuantityPerOrder = newListing.maxQuantityPerOrder 
        ? parseInt(newListing.maxQuantityPerOrder) 
        : availableQuantity;

      // Calculate flash sale end time if applicable
      const flashSaleEnd = newListing.isFlashSale 
        ? new Date(Date.now() + parseInt(newListing.flashSaleHours) * 60 * 60 * 1000)
        : undefined;

      const listing: Listing = {
        id: Date.now().toString(),
        title: newListing.title,
        description: newListing.description,
        price: price,
        minPrice: minPrice,
        isNegotiable: newListing.isNegotiable,
        image: newListing.image || `https://images.pexels.com/photos/533280/pexels-photo-533280.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop`,
        location: newListing.location,
        sellerName: state.user.name,
        sellerId: state.user.id,
        category: newListing.category,
        condition: newListing.condition,
        createdAt: new Date(),
        status: 'active',
        views: 0,
        likes: 0,
        tags: newListing.tags ? newListing.tags.split(',').map(tag => tag.trim()) : [],
        flashSaleEnd: flashSaleEnd,
        availableQuantity: availableQuantity,
        maxQuantityPerOrder: maxQuantityPerOrder
      };

      // Save to localStorage
      const storedItems = localStorage.getItem('listedItems');
      const listedItems = storedItems ? JSON.parse(storedItems) : [];
      listedItems.push(listing);
      localStorage.setItem('listedItems', JSON.stringify(listedItems));

      dispatch({ type: 'ADD_LISTING', payload: listing });
      setSellerListings(prev => [listing, ...prev]);
      
      // Reset form
      setNewListing({
        title: '',
        description: '',
        price: '',
        minPrice: '',
        category: 'Fresh Produce',
        condition: 'new',
        isNegotiable: true,
        location: state.user.location,
        tags: '',
        image: '',
        isFlashSale: false,
        flashSaleHours: '24',
        availableQuantity: '1',
        maxQuantityPerOrder: ''
      });
      
      setShowNewListingForm(false);
      showSuccess('Listing Created!', 'Your item has been listed successfully');
      
      analytics.trackUserAction('listing_created', {
        category: listing.category,
        price: listing.price,
        isFlashSale: listing.flashSaleEnd ? true : false,
        quantity: listing.availableQuantity
      });
      
    } catch (error) {
      showError('Error', 'Failed to create listing. Please try again.');
      analytics.trackError(error as Error, 'listing_creation');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteListing = (listingId: string) => {
    if (confirm('Are you sure you want to delete this listing?')) {
      // Remove from localStorage
      const storedItems = localStorage.getItem('listedItems');
      if (storedItems) {
        const listedItems = JSON.parse(storedItems);
        const updatedItems = listedItems.filter((item: Listing) => item.id !== listingId);
        localStorage.setItem('listedItems', JSON.stringify(updatedItems));
      }

      dispatch({ type: 'DELETE_LISTING', payload: listingId });
      setSellerListings(prev => prev.filter(listing => listing.id !== listingId));
      showSuccess('Listing Deleted', 'Your listing has been removed');
      analytics.trackUserAction('listing_deleted', { listingId });
    }
  };

  const tabs = [
    { id: 'listings', label: 'My Listings', icon: Package },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
    { id: 'sales', label: 'Sales History', icon: DollarSign },
    { id: 'reviews', label: 'Reviews', icon: Star },
    { id: 'profile', label: 'Profile', icon: Users }
  ];

  if (!state.user || state.user.role !== 'seller') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
        <div className="text-6xl mb-4">🚫</div>
        <h2 className={`text-2xl font-bold mb-4 ${
          state.isDarkMode ? 'text-white' : 'text-gray-900'
        }`}>
          Access Denied
        </h2>
        <p className={`${
          state.isDarkMode ? 'text-gray-400' : 'text-gray-600'
        }`}>
          Please log in as a seller to access the dashboard.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <div className="text-3xl">🌱</div>
              <h1 className={`text-2xl sm:text-3xl font-bold ${
                state.isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Seller Dashboard
              </h1>
            </div>
            <p className={`text-base sm:text-lg ${
              state.isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Welcome back, {state.user.name}! 🎉
            </p>
          </div>
          <button
            onClick={() => setShowNewListingForm(!showNewListingForm)}
            className="flex items-center justify-center space-x-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-4 sm:px-6 py-3 rounded-xl hover:from-green-600 hover:to-green-700 transition-all transform hover:scale-105 w-full sm:w-auto"
          >
            <Plus className="w-5 h-5" />
            <span>New Listing</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        <div className={`p-4 sm:p-6 rounded-2xl backdrop-blur-sm ${
          state.isDarkMode ? 'bg-gray-800/80 border border-gray-700/50' : 'bg-white/80 border border-white/50'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-xs sm:text-sm ${
                state.isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Active Listings
              </p>
              <p className={`text-xl sm:text-2xl font-bold ${
                state.isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {sellerListings.filter(l => l.status === 'active').length}
              </p>
            </div>
            <Package className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
          </div>
        </div>

        <div className={`p-4 sm:p-6 rounded-2xl backdrop-blur-sm ${
          state.isDarkMode ? 'bg-gray-800/80 border border-gray-700/50' : 'bg-white/80 border border-white/50'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-xs sm:text-sm ${
                state.isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Total Views
              </p>
              <p className={`text-xl sm:text-2xl font-bold ${
                state.isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {sellerListings.reduce((sum, listing) => sum + listing.views, 0)}
              </p>
            </div>
            <Eye className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
          </div>
        </div>

        <div className={`p-4 sm:p-6 rounded-2xl backdrop-blur-sm ${
          state.isDarkMode ? 'bg-gray-800/80 border border-gray-700/50' : 'bg-white/80 border border-white/50'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-xs sm:text-sm ${
                state.isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Flash Sales
              </p>
              <p className={`text-xl sm:text-2xl font-bold ${
                state.isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {sellerListings.filter(l => l.flashSaleEnd && new Date(l.flashSaleEnd) > new Date()).length}
              </p>
            </div>
            <Flame className="w-6 h-6 sm:w-8 sm:h-8 text-red-600" />
          </div>
        </div>

        <div className={`p-4 sm:p-6 rounded-2xl backdrop-blur-sm ${
          state.isDarkMode ? 'bg-gray-800/80 border border-gray-700/50' : 'bg-white/80 border border-white/50'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-xs sm:text-sm ${
                state.isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Rating
              </p>
              <div className="flex items-center space-x-1">
                <p className={`text-xl sm:text-2xl font-bold ${
                  state.isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {state.user.rating}
                </p>
                <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 fill-current" />
              </div>
            </div>
            <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* New Listing Form */}
      {showNewListingForm && (
        <div className={`mb-8 p-4 sm:p-6 rounded-2xl backdrop-blur-sm ${
          state.isDarkMode ? 'bg-gray-800/80 border border-gray-700/50' : 'bg-white/80 border border-white/50'
        }`}>
          <h2 className={`text-lg sm:text-xl font-bold mb-6 ${
            state.isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Create New Listing
          </h2>
          
          <form onSubmit={handleSubmitListing} className="space-y-6">
            {/* Image Upload */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                state.isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Product Images
              </label>
              <ImageOptimizer
                onImageSelect={handleImageSelect}
                maxSize={5}
                multiple={false}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  state.isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Product Title *
                </label>
                <input
                  type="text"
                  required
                  value={newListing.title}
                  onChange={(e) => setNewListing(prev => ({ ...prev, title: e.target.value }))}
                  className={`w-full p-3 rounded-lg border transition-colors ${
                    state.isDarkMode
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  } focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                  placeholder="e.g., Fresh Tomatoes - Premium Quality"
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  state.isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Category *
                </label>
                <select
                  value={newListing.category}
                  onChange={(e) => setNewListing(prev => ({ ...prev, category: e.target.value }))}
                  className={`w-full p-3 rounded-lg border transition-colors ${
                    state.isDarkMode
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  } focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${
                state.isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Description *
              </label>
              <textarea
                required
                rows={4}
                value={newListing.description}
                onChange={(e) => setNewListing(prev => ({ ...prev, description: e.target.value }))}
                className={`w-full p-3 rounded-lg border transition-colors ${
                  state.isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                } focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                placeholder="Describe your product in detail..."
              />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  state.isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Listing Price (₦) *
                </label>
                <input
                  type="number"
                  required
                  value={newListing.price}
                  onChange={(e) => setNewListing(prev => ({ ...prev, price: e.target.value }))}
                  className={`w-full p-3 rounded-lg border transition-colors ${
                    state.isDarkMode
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  } focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                  placeholder="3000"
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  state.isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Min Price (₦)
                </label>
                <input
                  type="number"
                  value={newListing.minPrice}
                  onChange={(e) => setNewListing(prev => ({ ...prev, minPrice: e.target.value }))}
                  disabled={!newListing.isNegotiable}
                  className={`w-full p-3 rounded-lg border transition-colors ${
                    state.isDarkMode
                      ? 'bg-gray-700 border-gray-600 text-white disabled:opacity-50'
                      : 'bg-white border-gray-300 text-gray-900 disabled:opacity-50'
                  } focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                  placeholder={newListing.price ? Math.floor(parseInt(newListing.price) * 0.7).toString() : "2100"}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  state.isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Quantity *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={newListing.availableQuantity}
                  onChange={(e) => setNewListing(prev => ({ ...prev, availableQuantity: e.target.value }))}
                  className={`w-full p-3 rounded-lg border transition-colors ${
                    state.isDarkMode
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  } focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                  placeholder="1"
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  state.isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Max/Order
                </label>
                <input
                  type="number"
                  min="1"
                  value={newListing.maxQuantityPerOrder}
                  onChange={(e) => setNewListing(prev => ({ ...prev, maxQuantityPerOrder: e.target.value }))}
                  className={`w-full p-3 rounded-lg border transition-colors ${
                    state.isDarkMode
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  } focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                  placeholder="No limit"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  state.isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Condition *
                </label>
                <select
                  value={newListing.condition}
                  onChange={(e) => setNewListing(prev => ({ ...prev, condition: e.target.value as 'new' | 'used' | 'refurbished' }))}
                  className={`w-full p-3 rounded-lg border transition-colors ${
                    state.isDarkMode
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  } focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                >
                  <option value="new">New</option>
                  <option value="used">Used</option>
                  <option value="refurbished">Refurbished</option>
                </select>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  state.isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Location *
                </label>
                <select
                  value={newListing.location}
                  onChange={(e) => setNewListing(prev => ({ ...prev, location: e.target.value }))}
                  className={`w-full p-3 rounded-lg border transition-colors ${
                    state.isDarkMode
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  } focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                >
                  {nigerianStates.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${
                state.isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Tags (comma separated)
              </label>
              <input
                type="text"
                value={newListing.tags}
                onChange={(e) => setNewListing(prev => ({ ...prev, tags: e.target.value }))}
                className={`w-full p-3 rounded-lg border transition-colors ${
                  state.isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                } focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                placeholder="organic, fresh, premium"
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="negotiable"
                  checked={newListing.isNegotiable}
                  onChange={(e) => setNewListing(prev => ({ ...prev, isNegotiable: e.target.checked }))}
                  className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500"
                />
                <label htmlFor="negotiable" className={`text-sm ${
                  state.isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Price is negotiable (buyers can make offers)
                </label>
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="flashSale"
                  checked={newListing.isFlashSale}
                  onChange={(e) => setNewListing(prev => ({ ...prev, isFlashSale: e.target.checked }))}
                  className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500"
                />
                <label htmlFor="flashSale" className={`text-sm ${
                  state.isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Add to Flash Sale ⚡
                </label>
                {newListing.isFlashSale && (
                  <select
                    value={newListing.flashSaleHours}
                    onChange={(e) => setNewListing(prev => ({ ...prev, flashSaleHours: e.target.value }))}
                    className={`ml-2 p-2 rounded border text-sm ${
                      state.isDarkMode
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  >
                    <option value="6">6 hours</option>
                    <option value="12">12 hours</option>
                    <option value="24">24 hours</option>
                    <option value="48">48 hours</option>
                    <option value="72">72 hours</option>
                  </select>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4">
              <button
                type="button"
                onClick={() => setShowNewListingForm(false)}
                className={`px-6 py-3 rounded-lg transition-colors ${
                  state.isDarkMode
                    ? 'bg-gray-700 text-white hover:bg-gray-600'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all disabled:opacity-50"
              >
                {isSubmitting ? (
                  <div className="flex items-center space-x-2">
                    <LoadingSpinner size="sm" />
                    <span>Creating...</span>
                  </div>
                ) : (
                  'Create Listing'
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tabs */}
      <div className="mb-8">
        <div className="flex space-x-1 bg-gray-100/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-1 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap text-sm ${
                activeTab === tab.id
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className={`rounded-2xl backdrop-blur-sm ${
        state.isDarkMode ? 'bg-gray-800/80 border border-gray-700/50' : 'bg-white/80 border border-white/50'
      }`}>
        {activeTab === 'listings' && (
          <div className="p-4 sm:p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-lg sm:text-xl font-bold ${
                state.isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Your Listings ({sellerListings.length})
              </h2>
            </div>

            {sellerListings.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📦</div>
                <h3 className={`text-xl font-semibold mb-2 ${
                  state.isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  No listings yet
                </h3>
                <p className={`mb-4 ${
                  state.isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Create your first listing to start selling!
                </p>
                <button
                  onClick={() => setShowNewListingForm(true)}
                  className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg hover:from-green-600 hover:to-green-700 transition-all"
                >
                  Create Listing
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {sellerListings.map(listing => (
                  <div
                    key={listing.id}
                    className={`rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 ${
                      state.isDarkMode
                        ? 'bg-gray-700/80'
                        : 'bg-gray-50/80 border border-gray-200'
                    }`}
                  >
                    <div className="aspect-video overflow-hidden relative">
                      <img
                        src={listing.image}
                        alt={listing.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      
                      {/* Flash Sale Badge */}
                      {listing.flashSaleEnd && new Date(listing.flashSaleEnd) > new Date() && (
                        <div className="absolute top-2 left-2 bg-gradient-to-r from-red-500 to-pink-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center space-x-1">
                          <Flame className="w-3 h-3" />
                          <span>FLASH</span>
                        </div>
                      )}
                      
                      <div className="absolute top-2 right-2 flex space-x-1">
                        <div className="bg-black/50 text-white text-xs px-2 py-1 rounded-full flex items-center space-x-1">
                          <Eye className="w-3 h-3" />
                          <span>{listing.views}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <h3 className={`font-bold text-lg mb-2 line-clamp-1 ${
                        state.isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        {listing.title}
                      </h3>
                      
                      <div className="mb-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xl sm:text-2xl font-bold text-green-600">
                            ₦{listing.price.toLocaleString()}
                          </span>
                          {listing.isNegotiable && listing.minPrice && (
                            <span className={`text-xs ${
                              state.isDarkMode ? 'text-gray-400' : 'text-gray-500'
                            }`}>
                              Min: ₦{listing.minPrice.toLocaleString()}
                            </span>
                          )}
                        </div>
                        {listing.isNegotiable && (
                          <span className="text-xs text-blue-600 dark:text-blue-400">
                            Negotiable
                          </span>
                        )}
                      </div>

                      {/* Quantity Info */}
                      {listing.availableQuantity && (
                        <div className="mb-3">
                          <p className={`text-sm ${
                            state.isDarkMode ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            Stock: {listing.availableQuantity} available
                            {listing.maxQuantityPerOrder && (
                              <span> • Max {listing.maxQuantityPerOrder} per order</span>
                            )}
                          </p>
                        </div>
                      )}

                      {/* Flash Sale Timer */}
                      {listing.flashSaleEnd && new Date(listing.flashSaleEnd) > new Date() && (
                        <div className="mb-3 p-2 bg-red-50 dark:bg-red-900/20 rounded text-center">
                          <div className="flex items-center justify-center space-x-1 text-red-600 dark:text-red-400 text-xs">
                            <Clock className="w-3 h-3" />
                            <span>Flash Sale Active</span>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between text-sm mb-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          listing.status === 'active' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
                        }`}>
                          {listing.status}
                        </span>
                        <span className={`text-xs ${
                          state.isDarkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          {listing.createdAt.toLocaleDateString()}
                        </span>
                      </div>

                      <div className="flex space-x-2">
                        <button className={`flex-1 flex items-center justify-center space-x-1 py-2 px-3 rounded-lg transition-colors text-sm ${
                          state.isDarkMode
                            ? 'bg-gray-600 text-white hover:bg-gray-500'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}>
                          <Edit3 className="w-4 h-4" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteListing(listing.id)}
                          className="flex items-center justify-center px-3 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
              <h2 className={`text-lg sm:text-xl font-bold ${
                state.isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Profile Settings
              </h2>
              <button
                onClick={() => setShowProfileSettings(true)}
                className="flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all w-full sm:w-auto"
              >
                <Settings className="w-4 h-4" />
                <span>Edit Settings</span>
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-4">
                <img
                  src={state.user.profilePhoto || 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop'}
                  alt={state.user.name}
                  className="w-20 h-20 rounded-full object-cover"
                />
                <div className="text-center sm:text-left">
                  <h4 className={`font-semibold text-lg ${
                    state.isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {state.user.name}
                  </h4>
                  <p className={`text-sm ${
                    state.isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {state.user.email}
                  </p>
                  <div className="flex items-center justify-center sm:justify-start space-x-1 mt-1">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className={`text-sm ${
                      state.isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {state.user.location}
                    </span>
                  </div>
                  <div className="flex items-center justify-center sm:justify-start space-x-1 mt-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className={`text-sm ${
                      state.isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {state.user.rating} rating • {state.user.totalSales || 0} sales
                    </span>
                  </div>
                </div>
              </div>

              {state.user.bio && (
                <div>
                  <h5 className={`font-medium mb-2 ${
                    state.isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    Bio
                  </h5>
                  <p className={`${
                    state.isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {state.user.bio}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Other tabs remain the same */}
        {activeTab === 'messages' && (
          <div className="p-4 sm:p-6">
            <h2 className={`text-lg sm:text-xl font-bold mb-6 ${
              state.isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Messages & Offers
            </h2>
            
            <div className="text-center py-12">
              <div className="text-6xl mb-4">💬</div>
              <h3 className={`text-xl font-semibold mb-2 ${
                state.isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                No messages yet
              </h3>
              <p className={`${
                state.isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Buyer messages and offers will appear here
              </p>
            </div>
          </div>
        )}

        {activeTab === 'sales' && (
          <div className="p-4 sm:p-6">
            <h2 className={`text-lg sm:text-xl font-bold mb-6 ${
              state.isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Sales History
            </h2>
            
            <div className="text-center py-12">
              <div className="text-6xl mb-4">💰</div>
              <h3 className={`text-xl font-semibold mb-2 ${
                state.isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                No sales yet
              </h3>
              <p className={`${
                state.isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Your completed sales will be tracked here
              </p>
            </div>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="p-4 sm:p-6">
            <h2 className={`text-lg sm:text-xl font-bold mb-6 ${
              state.isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Customer Reviews
            </h2>
            
            <div className="text-center py-12">
              <div className="text-6xl mb-4">⭐</div>
              <h3 className={`text-xl font-semibold mb-2 ${
                state.isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                No reviews yet
              </h3>
              <p className={`${
                state.isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Customer reviews and ratings will appear here
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Profile Settings Modal */}
      {showProfileSettings && (
        <ProfileSettings onClose={() => setShowProfileSettings(false)} />
      )}
    </div>
  );
};

export default SellerDashboard;