import React, { useState, useEffect } from 'react';
import { Search, Filter, MapPin, MessageCircle, Heart, Star, Eye, ShoppingCart } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { mockListings, haggleMessages, categories, nigerianStates } from '../utils/mockData';
import { Listing } from '../types';
import SearchBar from '../components/SearchBar';
import LoadingSpinner from '../components/LoadingSpinner';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import { useDebounce } from '../hooks/useDebounce';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useNotifications } from '../components/NotificationSystem';
import { analytics } from '../utils/analytics';

const ITEMS_PER_PAGE = 12;

const ListingsPage: React.FC = () => {
  const { state, dispatch } = useApp();
  const { showSuccess, showError } = useNotifications();
  const [listings, setListings] = useState<Listing[]>([]);
  const [displayedListings, setDisplayedListings] = useState<Listing[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [showBargainModal, setShowBargainModal] = useState(false);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [bargainMessage, setBargainMessage] = useState('');
  const [offerPrice, setOfferPrice] = useState('');
  const [favorites, setFavorites] = useLocalStorage<string[]>('favorites', []);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    dispatch({ type: 'SET_LISTINGS', payload: mockListings });
    setListings(mockListings);
    analytics.trackPageView('/listings');
  }, [dispatch]);

  const filteredListings = listings.filter(listing => {
    const matchesSearch = listing.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
                         listing.description.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
                         listing.tags?.some(tag => tag.toLowerCase().includes(debouncedSearchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || listing.category === selectedCategory;
    const matchesLocation = selectedLocation === 'All' || listing.location.includes(selectedLocation);
    const matchesPrice = (!priceRange.min || listing.price >= parseInt(priceRange.min)) &&
                        (!priceRange.max || listing.price <= parseInt(priceRange.max));
    return matchesSearch && matchesCategory && matchesLocation && matchesPrice && listing.status === 'active';
  }).sort((a, b) => {
    switch (sortBy) {
      case 'price-low': return a.price - b.price;
      case 'price-high': return b.price - a.price;
      case 'popular': return b.views - a.views;
      case 'newest': 
      default: return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  useEffect(() => {
    setDisplayedListings(filteredListings.slice(0, currentPage * ITEMS_PER_PAGE));
  }, [filteredListings, currentPage]);

  useEffect(() => {
    if (debouncedSearchTerm) {
      analytics.trackSearch(debouncedSearchTerm, filteredListings.length);
    }
  }, [debouncedSearchTerm, filteredListings.length]);

  const loadMore = () => {
    setIsLoading(true);
    setTimeout(() => {
      setCurrentPage(prev => prev + 1);
      setIsLoading(false);
    }, 500);
  };

  const hasMore = displayedListings.length < filteredListings.length;
  const { ref: loadMoreRef } = useInfiniteScroll(loadMore, hasMore);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const handleBargain = (listing: Listing) => {
    setSelectedListing(listing);
    setShowBargainModal(true);
    const randomMessage = haggleMessages[Math.floor(Math.random() * haggleMessages.length)];
    setBargainMessage(randomMessage);
    setOfferPrice(listing.minPrice?.toString() || '');
    analytics.trackUserAction('bargain_initiated', { listingId: listing.id });
  };

  const handleBuyNow = (listing: Listing) => {
    analytics.trackUserAction('buy_now_clicked', { listingId: listing.id, price: listing.price });
    showSuccess('Purchase Initiated', `Redirecting to payment for ${listing.title}`);
    setTimeout(() => {
      window.location.href = '/checkout';
    }, 1500);
  };

  const sendBargainMessage = () => {
    if (!selectedListing || !offerPrice) return;
    
    analytics.trackUserAction('bargain_offer_sent', { 
      listingId: selectedListing.id, 
      offerPrice: parseInt(offerPrice),
      originalPrice: selectedListing.price 
    });
    
    showSuccess('Offer Sent!', `Your bargain offer of ₦${parseInt(offerPrice).toLocaleString()} has been sent to ${selectedListing.sellerName}!`);
    setShowBargainModal(false);
    setBargainMessage('');
    setOfferPrice('');
  };

  const toggleFavorite = (listingId: string) => {
    const newFavorites = favorites.includes(listingId)
      ? favorites.filter(id => id !== listingId)
      : [...favorites, listingId];
    
    setFavorites(newFavorites);
    analytics.trackUserAction('favorite_toggled', { listingId, isFavorited: !favorites.includes(listingId) });
  };

  const handleListingView = (listing: Listing) => {
    analytics.trackListingView(listing.id, listing.category);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="text-3xl">🌱</div>
          <h1 className={`text-3xl font-bold ${
            state.isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Browse Fresh Deals
          </h1>
        </div>
        <p className={`text-lg ${
          state.isDarkMode ? 'text-gray-400' : 'text-gray-600'
        }`}>
          Discover amazing products from trusted local sellers across Nigeria
        </p>
      </div>

      {/* Enhanced Search */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <SearchBar 
            onSearch={handleSearch}
            className="flex-1"
          />
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center space-x-2 px-6 py-3 rounded-xl transition-colors ${
              state.isDarkMode
                ? 'bg-gray-800 text-white hover:bg-gray-700'
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Filter className="w-5 h-5" />
            <span>Filters</span>
          </button>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className={`p-6 rounded-xl border ${
            state.isDarkMode
              ? 'bg-gray-800 border-gray-700'
              : 'bg-white border-gray-200'
          }`}>
            <div className="grid md:grid-cols-4 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  state.isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className={`w-full p-2 rounded-lg border ${
                    state.isDarkMode
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  <option value="All">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  state.isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Location
                </label>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className={`w-full p-2 rounded-lg border ${
                    state.isDarkMode
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  <option value="All">All Locations</option>
                  {nigerianStates.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  state.isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Price Range (₦)
                </label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                    className={`w-full p-2 rounded-lg border ${
                      state.isDarkMode
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                    className={`w-full p-2 rounded-lg border ${
                      state.isDarkMode
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  state.isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className={`w-full p-2 rounded-lg border ${
                    state.isDarkMode
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  <option value="newest">Newest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="popular">Most Popular</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Quick Categories */}
        <div className="flex flex-wrap gap-2">
          {['All', ...categories.slice(0, 6)].map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-green-600 text-white'
                  : state.isDarkMode
                    ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-6 flex items-center justify-between">
        <p className={`text-sm ${
          state.isDarkMode ? 'text-gray-400' : 'text-gray-600'
        }`}>
          Showing {displayedListings.length} of {filteredListings.length} results
          {searchTerm && ` for "${searchTerm}"`}
          {selectedCategory !== 'All' && ` in ${selectedCategory}`}
        </p>
      </div>

      {/* Listings Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedListings.map(listing => (
          <div
            key={listing.id}
            onClick={() => handleListingView(listing)}
            className={`group rounded-2xl overflow-hidden transition-all duration-300 hover:scale-105 cursor-pointer ${
              state.isDarkMode
                ? 'bg-gray-800 hover:bg-gray-750'
                : 'bg-white hover:shadow-xl border border-gray-100'
            }`}
          >
            {/* Image */}
            <div className="relative aspect-video overflow-hidden">
              <img
                src={listing.image}
                alt={listing.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                loading="lazy"
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(listing.id);
                }}
                className={`absolute top-3 right-3 p-2 rounded-full transition-colors ${
                  favorites.includes(listing.id)
                    ? 'bg-red-500 text-white'
                    : 'bg-white/80 text-gray-600 hover:bg-white'
                }`}
              >
                <Heart className={`w-4 h-4 ${favorites.includes(listing.id) ? 'fill-current' : ''}`} />
              </button>
              
              {/* Badges */}
              <div className="absolute top-3 left-3 flex flex-col space-y-1">
                {listing.isNegotiable && (
                  <div className="bg-green-600 text-white text-xs px-2 py-1 rounded-full">
                    Negotiable
                  </div>
                )}
                {listing.condition === 'new' && (
                  <div className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                    New
                  </div>
                )}
              </div>

              {/* Stats */}
              <div className="absolute bottom-3 left-3 flex items-center space-x-3 text-white text-xs">
                <div className="flex items-center space-x-1 bg-black/50 px-2 py-1 rounded-full">
                  <Eye className="w-3 h-3" />
                  <span>{listing.views}</span>
                </div>
                <div className="flex items-center space-x-1 bg-black/50 px-2 py-1 rounded-full">
                  <Heart className="w-3 h-3" />
                  <span>{listing.likes}</span>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <h3 className={`font-bold text-lg mb-2 line-clamp-1 ${
                state.isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {listing.title}
              </h3>
              
              <p className={`text-sm mb-4 line-clamp-2 ${
                state.isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {listing.description}
              </p>

              {/* Price */}
              <div className="mb-4">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-bold text-green-600">
                    ₦{listing.price.toLocaleString()}
                  </span>
                  {listing.isNegotiable && listing.minPrice && (
                    <span className={`text-sm ${
                      state.isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      (Min: ₦{listing.minPrice.toLocaleString()})
                    </span>
                  )}
                </div>
              </div>

              {/* Seller Info */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div className={`text-sm font-medium ${
                    state.isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {listing.sellerName}
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="w-3 h-3 text-yellow-400 fill-current" />
                    <span className="text-xs text-gray-500">4.8</span>
                  </div>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  listing.condition === 'new' 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                }`}>
                  {listing.condition}
                </span>
              </div>

              {/* Location */}
              <div className="flex items-center space-x-1 mb-4">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className={`text-sm ${
                  state.isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  {listing.location}
                </span>
              </div>

              {/* Tags */}
              {listing.tags && listing.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-4">
                  {listing.tags.slice(0, 3).map(tag => (
                    <span
                      key={tag}
                      className={`text-xs px-2 py-1 rounded-full ${
                        state.isDarkMode
                          ? 'bg-gray-700 text-gray-300'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Actions */}
              <div className="flex space-x-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleBuyNow(listing);
                  }}
                  className="flex-1 flex items-center justify-center space-x-2 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Buy Item</span>
                </button>
                
                {listing.isNegotiable && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBargain(listing);
                    }}
                    className={`flex items-center justify-center space-x-1 px-3 py-2 rounded-lg transition-colors ${
                      state.isDarkMode
                        ? 'bg-gray-700 text-white hover:bg-gray-600'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span className="hidden sm:inline">Bargain</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Load More */}
      {hasMore && (
        <div ref={loadMoreRef} className="flex justify-center mt-8">
          {isLoading ? (
            <LoadingSpinner text="Loading more items..." />
          ) : (
            <button
              onClick={loadMore}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
            >
              Load More Items
            </button>
          )}
        </div>
      )}

      {/* Empty State */}
      {filteredListings.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className={`text-xl font-semibold mb-2 ${
            state.isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            No listings found
          </h3>
          <p className={`mb-4 ${
            state.isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Try adjusting your search terms or filters
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('All');
              setSelectedLocation('All');
              setPriceRange({ min: '', max: '' });
            }}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Bargain Modal */}
      {showBargainModal && selectedListing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className={`max-w-md w-full rounded-2xl p-6 ${
            state.isDarkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <h3 className={`text-xl font-bold mb-4 ${
              state.isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Bargain with {selectedListing.sellerName}
            </h3>
            
            <div className="mb-4">
              <p className={`text-sm mb-2 ${
                state.isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Product: {selectedListing.title}
              </p>
              <p className={`text-sm mb-2 ${
                state.isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Listed Price: ₦{selectedListing.price.toLocaleString()}
              </p>
              {selectedListing.minPrice && (
                <p className={`text-sm mb-4 ${
                  state.isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Minimum Price: ₦{selectedListing.minPrice.toLocaleString()}
                </p>
              )}
            </div>

            <div className="mb-4">
              <label className={`block text-sm font-medium mb-2 ${
                state.isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Your Offer (₦) *
              </label>
              <input
                type="number"
                value={offerPrice}
                onChange={(e) => setOfferPrice(e.target.value)}
                min={selectedListing.minPrice || 0}
                max={selectedListing.price}
                className={`w-full p-3 rounded-lg border transition-colors ${
                  state.isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                } focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                placeholder="Enter your offer..."
              />
            </div>

            <div className="mb-4">
              <label className={`block text-sm font-medium mb-2 ${
                state.isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Your Message (Nigerian Pidgin Welcome! 😄)
              </label>
              <textarea
                value={bargainMessage}
                onChange={(e) => setBargainMessage(e.target.value)}
                rows={3}
                className={`w-full p-3 rounded-lg border transition-colors ${
                  state.isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                } focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                placeholder="Enter your message..."
              />
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowBargainModal(false)}
                className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
                  state.isDarkMode
                    ? 'bg-gray-700 text-white hover:bg-gray-600'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Cancel
              </button>
              <button
                onClick={sendBargainMessage}
                disabled={!offerPrice}
                className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Send Offer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListingsPage;