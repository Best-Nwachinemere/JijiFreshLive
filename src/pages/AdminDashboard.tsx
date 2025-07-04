import React, { useState, useEffect } from 'react';
import { Plus, MessageSquare, Users, Package, Flag, CheckCircle, XCircle, Edit3, Trash2 } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { mockBulletinPosts, mockListings, mockUsers } from '../utils/mockData';
import { BulletinPost, Listing, User } from '../types';

const AdminDashboard: React.FC = () => {
  const { state, dispatch } = useApp();
  const [activeTab, setActiveTab] = useState('bulletin');
  const [bulletinPosts, setBulletinPosts] = useState<BulletinPost[]>([]);
  const [showNewPostForm, setShowNewPostForm] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '' });

  useEffect(() => {
    setBulletinPosts(mockBulletinPosts);
    dispatch({ type: 'SET_BULLETIN_POSTS', payload: mockBulletinPosts });
    dispatch({ type: 'SET_LISTINGS', payload: mockListings });
  }, [dispatch]);

  const handleSubmitPost = (e: React.FormEvent) => {
    e.preventDefault();
    const post: BulletinPost = {
      id: Date.now().toString(),
      title: newPost.title,
      content: newPost.content,
      author: 'Admin',
      createdAt: new Date(),
      isActive: true
    };
    
    dispatch({ type: 'ADD_BULLETIN_POST', payload: post });
    setBulletinPosts(prev => [post, ...prev]);
    setNewPost({ title: '', content: '' });
    setShowNewPostForm(false);
  };

  const handleDeletePost = (postId: string) => {
    setBulletinPosts(prev => prev.filter(post => post.id !== postId));
  };

  const tabs = [
    { id: 'bulletin', label: 'Bulletin Board', icon: MessageSquare },
    { id: 'listings', label: 'Manage Listings', icon: Package },
    { id: 'sellers', label: 'Sellers', icon: Users },
    { id: 'reports', label: 'Reports', icon: Flag }
  ];

  if (!state.user || state.user.role !== 'admin') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
        <div className="text-6xl mb-4">🚫</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
        <p className="text-gray-600">Admin access required.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="text-3xl">🌱</div>
          <h1 className={`text-3xl font-bold ${
            state.isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Admin Dashboard
          </h1>
        </div>
        <p className={`text-lg ${
          state.isDarkMode ? 'text-gray-400' : 'text-gray-600'
        }`}>
          Manage your JijiFresh marketplace
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className={`p-6 rounded-2xl ${
          state.isDarkMode ? 'bg-gray-800' : 'bg-white border border-gray-100'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${
                state.isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Total Listings
              </p>
              <p className={`text-2xl font-bold ${
                state.isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {mockListings.length}
              </p>
            </div>
            <Package className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className={`p-6 rounded-2xl ${
          state.isDarkMode ? 'bg-gray-800' : 'bg-white border border-gray-100'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${
                state.isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Active Sellers
              </p>
              <p className={`text-2xl font-bold ${
                state.isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {mockUsers.filter(u => u.role === 'seller').length}
              </p>
            </div>
            <Users className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className={`p-6 rounded-2xl ${
          state.isDarkMode ? 'bg-gray-800' : 'bg-white border border-gray-100'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${
                state.isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Pending Reports
              </p>
              <p className={`text-2xl font-bold ${
                state.isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                3
              </p>
            </div>
            <Flag className="w-8 h-8 text-red-600" />
          </div>
        </div>

        <div className={`p-6 rounded-2xl ${
          state.isDarkMode ? 'bg-gray-800' : 'bg-white border border-gray-100'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${
                state.isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Bulletin Posts
              </p>
              <p className={`text-2xl font-bold ${
                state.isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {bulletinPosts.length}
              </p>
            </div>
            <MessageSquare className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-8">
        <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className={`rounded-2xl ${
        state.isDarkMode ? 'bg-gray-800' : 'bg-white border border-gray-100'
      }`}>
        {activeTab === 'bulletin' && (
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-xl font-bold ${
                state.isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Bulletin Board Posts
              </h2>
              <button
                onClick={() => setShowNewPostForm(!showNewPostForm)}
                className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>New Post</span>
              </button>
            </div>

            {showNewPostForm && (
              <div className={`mb-6 p-6 rounded-xl ${
                state.isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
              }`}>
                <h3 className={`text-lg font-bold mb-4 ${
                  state.isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Create New Bulletin Post
                </h3>
                
                <form onSubmit={handleSubmitPost} className="space-y-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      state.isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={newPost.title}
                      onChange={(e) => setNewPost(prev => ({ ...prev, title: e.target.value }))}
                      className={`w-full p-3 rounded-lg border transition-colors ${
                        state.isDarkMode
                          ? 'bg-gray-600 border-gray-500 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      } focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                      placeholder="Enter post title..."
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      state.isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      Content *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={newPost.content}
                      onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                      className={`w-full p-3 rounded-lg border transition-colors ${
                        state.isDarkMode
                          ? 'bg-gray-600 border-gray-500 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      } focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                      placeholder="Enter post content..."
                    />
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowNewPostForm(false)}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        state.isDarkMode
                          ? 'bg-gray-600 text-white hover:bg-gray-500'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Publish Post
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="space-y-4">
              {bulletinPosts.map(post => (
                <div
                  key={post.id}
                  className={`p-4 rounded-xl border ${
                    state.isDarkMode
                      ? 'bg-gray-700 border-gray-600'
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className={`font-bold text-lg ${
                      state.isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      {post.title}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <button className={`p-2 rounded-lg transition-colors ${
                        state.isDarkMode
                          ? 'text-gray-400 hover:bg-gray-600'
                          : 'text-gray-600 hover:bg-gray-200'
                      }`}>
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeletePost(post.id)}
                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <p className={`mb-3 ${
                    state.isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    {post.content}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className={`${
                      state.isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      By {post.author} • {post.createdAt.toLocaleDateString()}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      post.isActive
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
                    }`}>
                      {post.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'listings' && (
          <div className="p-6">
            <h2 className={`text-xl font-bold mb-6 ${
              state.isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Manage Listings
            </h2>
            
            <div className="space-y-4">
              {mockListings.map(listing => (
                <div
                  key={listing.id}
                  className={`p-4 rounded-xl border ${
                    state.isDarkMode
                      ? 'bg-gray-700 border-gray-600'
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <img
                        src={listing.image}
                        alt={listing.title}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div>
                        <h3 className={`font-bold ${
                          state.isDarkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                          {listing.title}
                        </h3>
                        <p className={`text-sm ${
                          state.isDarkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          By {listing.sellerName} • ₦{listing.price.toLocaleString()}
                        </p>
                        <p className={`text-sm ${
                          state.isDarkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          {listing.location} • {listing.createdAt.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        listing.status === 'active'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
                      }`}>
                        {listing.status}
                      </span>
                      <button className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors">
                        <CheckCircle className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                        <XCircle className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'sellers' && (
          <div className="p-6">
            <h2 className={`text-xl font-bold mb-6 ${
              state.isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Seller Management
            </h2>
            
            <div className="space-y-4">
              {mockUsers.filter(user => user.role === 'seller').map(seller => (
                <div
                  key={seller.id}
                  className={`p-4 rounded-xl border ${
                    state.isDarkMode
                      ? 'bg-gray-700 border-gray-600'
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <img
                        src={seller.profilePhoto || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=60&h=60&fit=crop'}
                        alt={seller.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className={`font-bold ${
                            state.isDarkMode ? 'text-white' : 'text-gray-900'
                          }`}>
                            {seller.name}
                          </h3>
                          {seller.isVerified && (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          )}
                        </div>
                        <p className={`text-sm ${
                          state.isDarkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          {seller.email} • {seller.location}
                        </p>
                        <p className={`text-sm ${
                          state.isDarkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          Joined {seller.joinedAt.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button className="px-3 py-1 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                        Verify
                      </button>
                      <button className="px-3 py-1 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                        Block
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="p-6">
            <h2 className={`text-xl font-bold mb-6 ${
              state.isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Reports & Flags
            </h2>
            
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📊</div>
              <h3 className={`text-xl font-semibold mb-2 ${
                state.isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                No reports yet
              </h3>
              <p className={`${
                state.isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                User reports and flagged content will appear here
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;