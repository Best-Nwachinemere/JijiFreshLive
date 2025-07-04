import React, { useState } from 'react';
import { X, User, MapPin, CreditCard, Lock, Camera, Save } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { akwaIbomAreas } from '../utils/mockData';

interface ProfileSettingsProps {
  onClose: () => void;
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({ onClose }) => {
  const { state, dispatch } = useApp();
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({
    name: state.user?.name || '',
    email: state.user?.email || '',
    phone: state.user?.phone || '',
    bio: state.user?.bio || '',
    location: state.user?.location || '',
    pickupAddress: state.user?.pickupAddress || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    bankName: '',
    accountNumber: '',
    accountName: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveProfile = async () => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (state.user) {
      const updatedUser = {
        ...state.user,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        bio: formData.bio,
        location: formData.location,
        pickupAddress: formData.pickupAddress
      };
      
      dispatch({ type: 'SET_USER', payload: updatedUser });
      alert('Profile updated successfully! 🎉');
    }
    
    setIsLoading(false);
  };

  const handleChangePassword = async () => {
    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      alert('Please fill all password fields');
      return;
    }
    
    if (formData.newPassword !== formData.confirmPassword) {
      alert('New passwords do not match');
      return;
    }
    
    if (formData.newPassword.length < 6) {
      alert('Password must be at least 6 characters');
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    alert('Password changed successfully! 🔒');
    setFormData(prev => ({
      ...prev,
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }));
    
    setIsLoading(false);
  };

  const handleSavePayment = async () => {
    if (!formData.bankName || !formData.accountNumber || !formData.accountName) {
      alert('Please fill all payment fields');
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    alert('Payment settings saved successfully! 💳');
    setIsLoading(false);
  };

  const tabs = [
    { id: 'profile', label: 'Edit Profile', icon: User },
    { id: 'location', label: 'Update Location', icon: MapPin },
    { id: 'payment', label: 'Payment Settings', icon: CreditCard },
    { id: 'password', label: 'Change Password', icon: Lock }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className={`max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-2xl ${
        state.isDarkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        {/* Header */}
        <div className={`sticky top-0 p-6 border-b flex items-center justify-between ${
          state.isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
        }`}>
          <h2 className={`text-2xl font-bold ${
            state.isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Profile Settings
          </h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${
              state.isDarkMode
                ? 'hover:bg-gray-700 text-gray-400'
                : 'hover:bg-gray-100 text-gray-600'
            }`}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="p-6">
          <div className="flex space-x-1 bg-gray-100 dark:bg-gray-700 rounded-xl p-1 mb-6">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg font-medium transition-colors text-sm ${
                  activeTab === tab.id
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="space-y-6">
            {activeTab === 'profile' && (
              <div className="space-y-6">
                {/* Profile Photo */}
                <div className="text-center">
                  <div className="relative inline-block">
                    <img
                      src={state.user?.profilePhoto || 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'}
                      alt="Profile"
                      className="w-24 h-24 rounded-full object-cover"
                    />
                    <button className="absolute bottom-0 right-0 p-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors">
                      <Camera className="w-4 h-4" />
                    </button>
                  </div>
                  <p className={`text-sm mt-2 ${
                    state.isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Click to change profile photo
                  </p>
                </div>

                {/* Form Fields */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      state.isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className={`w-full p-3 rounded-lg border transition-colors ${
                        state.isDarkMode
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      } focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      state.isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={`w-full p-3 rounded-lg border transition-colors ${
                        state.isDarkMode
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      } focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      state.isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="+234 xxx xxx xxxx"
                      className={`w-full p-3 rounded-lg border transition-colors ${
                        state.isDarkMode
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      } focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      state.isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      Location (Area/Town)
                    </label>
                    <select
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      className={`w-full p-3 rounded-lg border transition-colors ${
                        state.isDarkMode
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      } focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                    >
                      <option value="">Select Area</option>
                      {akwaIbomAreas.map(area => (
                        <option key={area} value={`${area}, Akwa Ibom`}>{area}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Pickup Address for Sellers */}
                {state.user?.role === 'seller' && (
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      state.isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      Pickup Address *
                    </label>
                    <input
                      type="text"
                      value={formData.pickupAddress}
                      onChange={(e) => handleInputChange('pickupAddress', e.target.value)}
                      placeholder="e.g., Shop 15, Uyo Main Market, Ikot Ekpene Road, Uyo"
                      className={`w-full p-3 rounded-lg border transition-colors ${
                        state.isDarkMode
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      } focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                    />
                    <p className={`text-xs mt-1 ${
                      state.isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      This address will be shared with buyers who choose pickup
                    </p>
                  </div>
                )}

                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    state.isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    Bio
                  </label>
                  <textarea
                    rows={4}
                    value={formData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    placeholder="Tell buyers about yourself..."
                    className={`w-full p-3 rounded-lg border transition-colors ${
                      state.isDarkMode
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                    } focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                  />
                </div>

                <button
                  onClick={handleSaveProfile}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center space-x-2 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  <Save className="w-5 h-5" />
                  <span>{isLoading ? 'Saving...' : 'Save Profile'}</span>
                </button>
              </div>
            )}

            {activeTab === 'location' && (
              <div className="space-y-6">
                <div>
                  <h3 className={`text-lg font-semibold mb-4 ${
                    state.isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    Update Your Location
                  </h3>
                  <p className={`text-sm mb-4 ${
                    state.isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Your location helps buyers find items near them and helps with delivery estimates.
                    Currently serving Akwa Ibom State only.
                  </p>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    state.isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    Area/Town in Akwa Ibom *
                  </label>
                  <select
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    className={`w-full p-3 rounded-lg border transition-colors ${
                      state.isDarkMode
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                    } focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                  >
                    <option value="">Select Area</option>
                    {akwaIbomAreas.map(area => (
                      <option key={area} value={`${area}, Akwa Ibom`}>{area}</option>
                    ))}
                  </select>
                </div>

                {state.user?.role === 'seller' && (
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      state.isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      Pickup Address *
                    </label>
                    <input
                      type="text"
                      value={formData.pickupAddress}
                      onChange={(e) => handleInputChange('pickupAddress', e.target.value)}
                      placeholder="e.g., Shop 15, Uyo Main Market, Ikot Ekpene Road, Uyo"
                      className={`w-full p-3 rounded-lg border transition-colors ${
                        state.isDarkMode
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      } focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                    />
                    <p className={`text-xs mt-1 ${
                      state.isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      Specific address where buyers can pick up items
                    </p>
                  </div>
                )}

                <button
                  onClick={handleSaveProfile}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center space-x-2 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  <MapPin className="w-5 h-5" />
                  <span>{isLoading ? 'Updating...' : 'Update Location'}</span>
                </button>
              </div>
            )}

            {activeTab === 'payment' && (
              <div className="space-y-6">
                <div>
                  <h3 className={`text-lg font-semibold mb-4 ${
                    state.isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    Payment Settings
                  </h3>
                  <p className={`text-sm mb-4 ${
                    state.isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Add your bank details to receive payments from sales.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      state.isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      Bank Name *
                    </label>
                    <select
                      value={formData.bankName}
                      onChange={(e) => handleInputChange('bankName', e.target.value)}
                      className={`w-full p-3 rounded-lg border transition-colors ${
                        state.isDarkMode
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      } focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                    >
                      <option value="">Select Bank</option>
                      <option value="access">Access Bank</option>
                      <option value="gtb">GTBank</option>
                      <option value="first">First Bank</option>
                      <option value="zenith">Zenith Bank</option>
                      <option value="uba">UBA</option>
                      <option value="fidelity">Fidelity Bank</option>
                      <option value="moniepoint">Moniepoint</option>
                      <option value="opay">OPay</option>
                      <option value="kuda">Kuda Bank</option>
                    </select>
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      state.isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      Account Number *
                    </label>
                    <input
                      type="text"
                      value={formData.accountNumber}
                      onChange={(e) => handleInputChange('accountNumber', e.target.value)}
                      placeholder="1234567890"
                      className={`w-full p-3 rounded-lg border transition-colors ${
                        state.isDarkMode
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      } focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      state.isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      Account Name *
                    </label>
                    <input
                      type="text"
                      value={formData.accountName}
                      onChange={(e) => handleInputChange('accountName', e.target.value)}
                      placeholder="John Doe"
                      className={`w-full p-3 rounded-lg border transition-colors ${
                        state.isDarkMode
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      } focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                    />
                  </div>
                </div>

                <button
                  onClick={handleSavePayment}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center space-x-2 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  <CreditCard className="w-5 h-5" />
                  <span>{isLoading ? 'Saving...' : 'Save Payment Settings'}</span>
                </button>
              </div>
            )}

            {activeTab === 'password' && (
              <div className="space-y-6">
                <div>
                  <h3 className={`text-lg font-semibold mb-4 ${
                    state.isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    Change Password
                  </h3>
                  <p className={`text-sm mb-4 ${
                    state.isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Keep your account secure with a strong password.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      state.isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      Current Password *
                    </label>
                    <input
                      type="password"
                      value={formData.currentPassword}
                      onChange={(e) => handleInputChange('currentPassword', e.target.value)}
                      className={`w-full p-3 rounded-lg border transition-colors ${
                        state.isDarkMode
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      } focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      state.isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      New Password *
                    </label>
                    <input
                      type="password"
                      value={formData.newPassword}
                      onChange={(e) => handleInputChange('newPassword', e.target.value)}
                      className={`w-full p-3 rounded-lg border transition-colors ${
                        state.isDarkMode
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      } focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      state.isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      Confirm New Password *
                    </label>
                    <input
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      className={`w-full p-3 rounded-lg border transition-colors ${
                        state.isDarkMode
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      } focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                    />
                  </div>
                </div>

                <button
                  onClick={handleChangePassword}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center space-x-2 bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  <Lock className="w-5 h-5" />
                  <span>{isLoading ? 'Changing...' : 'Change Password'}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;