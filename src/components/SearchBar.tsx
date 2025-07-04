import React, { useState, useRef, useEffect } from 'react';
import { Search, X, Clock, TrendingUp } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

interface SearchBarProps {
  onSearch: (term: string) => void;
  placeholder?: string;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  onSearch, 
  placeholder = "Search for products, brands, or keywords...",
  className = ""
}) => {
  const { state } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);

  const trendingSearches = [
    'iPhone', 'Tomatoes', 'Rice', 'Ankara dress', 'Samsung', 'Fresh pepper'
  ];

  useEffect(() => {
    // Load recent searches from localStorage
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (term: string) => {
    if (term.trim()) {
      // Add to recent searches
      const updated = [term, ...recentSearches.filter(s => s !== term)].slice(0, 5);
      setRecentSearches(updated);
      localStorage.setItem('recentSearches', JSON.stringify(updated));
      
      onSearch(term);
      setShowSuggestions(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(searchTerm);
  };

  const clearSearch = () => {
    setSearchTerm('');
    onSearch('');
  };

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <form onSubmit={handleSubmit} className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setShowSuggestions(true)}
          className={`w-full pl-10 pr-12 py-3 rounded-xl border transition-colors ${
            state.isDarkMode
              ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
              : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
          } focus:ring-2 focus:ring-green-500 focus:border-transparent`}
        />
        {searchTerm && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </form>

      {/* Search Suggestions */}
      {showSuggestions && (
        <div className={`absolute top-full left-0 right-0 mt-2 rounded-xl border shadow-lg z-50 ${
          state.isDarkMode
            ? 'bg-gray-800 border-gray-700'
            : 'bg-white border-gray-200'
        }`}>
          {recentSearches.length > 0 && (
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-2 mb-3">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className={`text-sm font-medium ${
                  state.isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Recent Searches
                </span>
              </div>
              <div className="space-y-1">
                {recentSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSearchTerm(search);
                      handleSearch(search);
                    }}
                    className={`block w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      state.isDarkMode
                        ? 'text-gray-300 hover:bg-gray-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {search}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="p-4">
            <div className="flex items-center space-x-2 mb-3">
              <TrendingUp className="w-4 h-4 text-gray-400" />
              <span className={`text-sm font-medium ${
                state.isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Trending Searches
              </span>
            </div>
            <div className="space-y-1">
              {trendingSearches.map((search, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setSearchTerm(search);
                    handleSearch(search);
                  }}
                  className={`block w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    state.isDarkMode
                      ? 'text-gray-300 hover:bg-gray-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {search}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;