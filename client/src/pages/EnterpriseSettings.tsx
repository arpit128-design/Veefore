import React, { useState, useEffect } from 'react';
import { useAuth } from "@/hooks/useAuth";
import { logout } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { 
  User, 
  Shield, 
  Bell, 
  Building, 
  Brain, 
  CreditCard, 
  Link, 
  Accessibility, 
  Code, 
  Settings as SettingsIcon,
  Crown,
  Save,
  Search,
  LogOut,
  Camera,
  Mail,
  Phone,
  Globe,
  Clock,
  Palette,
  Lock,
  Eye,
  Smartphone,
  Monitor,
  Sun,
  Moon,
  Zap,
  Target,
  BarChart3,
  Users,
  ChevronRight,
  Check,
  X
} from 'lucide-react';

const EnterpriseSettings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("profile");
  const [searchQuery, setSearchQuery] = useState("");
  const [hasChanges, setHasChanges] = useState(false);
  const [userData, setUserData] = useState(null);

  // Save settings handler
  const handleSaveSettings = async () => {
    try {
      // Simulate API call to save settings
      await new Promise(resolve => setTimeout(resolve, 1000));
      setHasChanges(false);
      toast({
        title: "Settings saved",
        description: "Your settings have been successfully updated.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Enhanced user profile state
  const [profile, setProfile] = useState({
    displayName: user?.displayName || '',
    email: user?.email || '',
    bio: '',
    location: '',
    website: '',
    phone: '',
    jobTitle: '',
    company: '',
    department: '',
    timezone: 'UTC',
    avatar: null as File | null
  });

  // Comprehensive preferences state
  const [preferences, setPreferences] = useState({
    general: {
      theme: 'light',
      language: 'en',
      timezone: 'UTC',
      dateFormat: 'MM/DD/YYYY',
      timeFormat: '12h',
      currency: 'USD',
      compactMode: false,
      animationsEnabled: true
    },
    notifications: {
      email: {
        enabled: true,
        marketing: false,
        security: true,
        updates: true,
        digest: true,
        frequency: 'daily'
      },
      push: {
        enabled: true,
        marketing: false,
        security: true,
        updates: false,
        sound: true,
        vibration: true
      },
      desktop: {
        enabled: true,
        position: 'top-right',
        duration: 5000,
        priority: 'high'
      }
    },
    security: {
      twoFactorEnabled: false,
      sessionTimeout: 30,
      loginAlerts: true,
      deviceTracking: true,
      biometricAuth: false,
      passwordStrength: 'strong'
    },
    privacy: {
      profileVisibility: 'public',
      activityStatus: true,
      onlineStatus: false,
      dataCollection: true,
      analytics: true,
      thirdPartyIntegrations: false
    },
    workspace: {
      defaultView: 'grid',
      itemsPerPage: 20,
      autoSave: true,
      collaborativeEditing: true,
      versionHistory: true,
      cloudSync: true
    },
    ai: {
      enabled: true,
      suggestions: true,
      autoComplete: true,
      creativity: 70,
      responseSpeed: 'balanced',
      personalizedRecommendations: true,
      dataTraining: false,
      betaFeatures: false
    },
    accessibility: {
      screenReader: false,
      highContrast: false,
      largeText: false,
      reducedMotion: false,
      keyboardNavigation: true,
      focusIndicators: true
    }
  });

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Signed out successfully",
        description: "You have been signed out of your account.",
      });
    } catch (error) {
      toast({
        title: "Error signing out",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle save changes
  const handleSaveChanges = () => {
    // Simulate save API call
    setTimeout(() => {
      setHasChanges(false);
      toast({
        title: "Settings saved",
        description: "Your settings have been updated successfully.",
      });
    }, 1000);
  };

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/user', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setUserData(data);
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      }
    };

    if (user) {
      fetchUserData();
    }
  }, [user]);

  // Helper function to get user initials
  const getUserInitials = (name, username) => {
    if (name && name.trim()) {
      const names = name.trim().split(' ');
      if (names.length >= 2) {
        return names[0][0] + names[1][0];
      }
      return names[0][0];
    }
    if (username) {
      return username[0].toUpperCase();
    }
    return 'U';
  };

  // Helper function to get subscription plan
  const getSubscriptionPlan = (userData) => {
    if (!userData) return 'Free Plan';
    
    // Check if user has active subscription
    if (userData.subscription && userData.subscription.plan) {
      const plan = userData.subscription.plan.toLowerCase();
      if (plan === 'starter') return 'Starter Plan';
      if (plan === 'pro') return 'Pro Plan';
      if (plan === 'business') return 'Business Plan';
    }
    
    // Check if user has trial
    if (userData.trialExpiresAt && new Date(userData.trialExpiresAt) > new Date()) {
      return 'Free Trial';
    }
    
    return 'Free Plan';
  };

  // Mark changes when preferences update
  useEffect(() => {
    setHasChanges(true);
  }, [preferences, profile]);

  // Navigation items
  const navigationItems = [
    { id: 'profile', label: 'Profile & Account', icon: User, badge: null },
    { id: 'security', label: 'Security & Privacy', icon: Shield, badge: null },
    { id: 'notifications', label: 'Notifications', icon: Bell, badge: '3' },
    { id: 'workspace', label: 'Workspace', icon: Building, badge: null },
    { id: 'ai', label: 'AI Assistant', icon: Brain, badge: 'New' },
    { id: 'billing', label: 'Billing & Usage', icon: CreditCard, badge: null },
    { id: 'integrations', label: 'Integrations', icon: Link, badge: null },
    { id: 'accessibility', label: 'Accessibility', icon: Accessibility, badge: null },
    { id: 'developer', label: 'Developer Tools', icon: Code, badge: null }
  ];

  // Filter navigation items based on search
  const filteredItems = navigationItems.filter(item => 
    item.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50" style={{ 
      backgroundColor: '#f9fafb !important',
      color: '#000000 !important'
    }}>
      {/* Enhanced Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <SettingsIcon className="h-6 w-6 text-gray-700" />
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Settings</h1>
                  <p className="text-sm text-gray-600">Manage your account and preferences</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative">
                <Search className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search settings..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                  style={{ backgroundColor: '#ffffff !important', color: '#000000 !important' }}
                />
              </div>
              
              {/* Save Button - Darker colors with conditional animation */}
              <button
                onClick={handleSaveChanges}
                disabled={!hasChanges}
                className="save-button px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg text-sm font-medium hover:from-emerald-600 hover:to-teal-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 transition-all duration-300 shadow-md hover:shadow-xl transform hover:scale-105"
                style={{ 
                  background: hasChanges ? 'linear-gradient(135deg, #10b981 0%, #14b8a6 100%)' : 'linear-gradient(135deg, #d1d5db 0%, #9ca3af 100%)',
                  color: '#ffffff !important',
                  border: 'none',
                  animation: hasChanges ? 'gentle-pulse 2s infinite' : 'none'
                }}
              >
                <Save className={`h-4 w-4 ${hasChanges ? 'animate-bounce' : ''}`} style={{ color: '#ffffff !important' }} />
                <span style={{ color: '#ffffff !important' }}>Save Changes</span>
              </button>
              
              {/* Sign Out - Darker colors with animation */}
              <button
                onClick={handleLogout}
                className="sign-out-button px-6 py-2.5 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg text-sm font-medium hover:from-red-600 hover:to-pink-600 flex items-center space-x-2 transition-all duration-300 shadow-md hover:shadow-xl transform hover:scale-105 hover:rotate-1"
                style={{ 
                  background: 'linear-gradient(135deg, #ef4444 0%, #ec4899 100%)',
                  color: '#ffffff !important',
                  border: 'none'
                }}
              >
                <LogOut className="h-4 w-4 hover:animate-spin" style={{ color: '#ffffff !important' }} />
                <span style={{ color: '#ffffff !important' }}>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Enhanced Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 sticky top-24">
              {/* Account Status Card */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-lg">
                        {getUserInitials(userData?.displayName || userData?.username, userData?.username)}
                      </span>
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {userData?.displayName || userData?.username || 'User'}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {getSubscriptionPlan(userData)}
                    </p>
                  </div>
                </div>
                
                <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-blue-700">Storage Used</span>
                    <span className="font-medium text-purple-800">2.3 GB / 10 GB</span>
                  </div>
                  <div className="mt-2 w-full bg-gradient-to-r from-blue-100 to-purple-100 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full shadow-sm" 
                      style={{ width: '23%' }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <nav className="p-4 space-y-1">
                {filteredItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 text-left text-sm font-medium rounded-lg transition-colors group ${
                      activeTab === item.id 
                        ? 'bg-cyan-50 text-cyan-800' 
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                    data-active={activeTab === item.id ? 'true' : 'false'}
                  >
                    <div className="flex items-center space-x-3">
                      <item.icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {item.badge && (
                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                          item.badge === 'New' ? 'bg-blue-100 text-blue-800' : 
                          item.badge === '3' ? 'bg-red-100 text-red-800' : 
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                      <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </button>
                ))}
              </nav>

              {/* Quick Actions */}
              <div className="p-4 border-t border-gray-200">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Quick Actions</h4>
                <div className="space-y-2">
                  <button className="w-full flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900 py-1">
                    <Crown className="h-4 w-4" />
                    <span>Upgrade Plan</span>
                  </button>
                  <button className="w-full flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900 py-1">
                    <Users className="h-4 w-4" />
                    <span>Invite Team</span>
                  </button>
                  <button className="w-full flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900 py-1">
                    <BarChart3 className="h-4 w-4" />
                    <span>View Analytics</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Main Content */}
          <div className="lg:col-span-3">
            <div className="space-y-6">
              {/* Profile & Account Tab */}
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  {/* Profile Information */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                    <div className="p-6 border-b border-gray-200">
                      <h2 className="text-lg font-semibold text-gray-900">Profile Information</h2>
                      <p className="text-sm text-gray-600 mt-1">Update your personal information and profile settings</p>
                    </div>
                    <div className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Display Name</label>
                          <input
                            type="text"
                            value={profile.displayName}
                            onChange={(e) => setProfile(prev => ({ ...prev, displayName: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                            style={{ backgroundColor: '#ffffff !important', color: '#000000 !important' }}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                          <input
                            type="email"
                            value={profile.email}
                            onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                            style={{ backgroundColor: '#ffffff !important', color: '#000000 !important' }}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Job Title</label>
                          <input
                            type="text"
                            value={profile.jobTitle}
                            onChange={(e) => setProfile(prev => ({ ...prev, jobTitle: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                            style={{ backgroundColor: '#ffffff !important', color: '#000000 !important' }}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                          <input
                            type="text"
                            value={profile.company}
                            onChange={(e) => setProfile(prev => ({ ...prev, company: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                            style={{ backgroundColor: '#ffffff !important', color: '#000000 !important' }}
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                          <textarea
                            value={profile.bio}
                            onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                            style={{ backgroundColor: '#ffffff !important', color: '#000000 !important' }}
                            placeholder="Tell us about yourself..."
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                    <div className="p-6 border-b border-gray-200">
                      <h2 className="text-lg font-semibold text-gray-900">Contact Information</h2>
                      <p className="text-sm text-gray-600 mt-1">Manage your contact details and preferences</p>
                    </div>
                    <div className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                          <input
                            type="tel"
                            value={profile.phone}
                            onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                            style={{ backgroundColor: '#ffffff !important', color: '#000000 !important' }}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                          <input
                            type="text"
                            value={profile.location}
                            onChange={(e) => setProfile(prev => ({ ...prev, location: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                            style={{ backgroundColor: '#ffffff !important', color: '#000000 !important' }}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                          <input
                            type="url"
                            value={profile.website}
                            onChange={(e) => setProfile(prev => ({ ...prev, website: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                            style={{ backgroundColor: '#ffffff !important', color: '#000000 !important' }}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Time Zone</label>
                          <select
                            value={profile.timezone}
                            onChange={(e) => setProfile(prev => ({ ...prev, timezone: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                            style={{ backgroundColor: '#ffffff !important', color: '#000000 !important' }}
                          >
                            <option value="UTC">UTC</option>
                            <option value="EST">Eastern Time</option>
                            <option value="PST">Pacific Time</option>
                            <option value="GMT">Greenwich Mean Time</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* AI Assistant Tab */}
              {activeTab === 'ai' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                    <div className="p-6 border-b border-gray-200">
                      <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                        <Brain className="h-5 w-5 mr-2 text-gray-700" />
                        AI Assistant Settings
                      </h2>
                      <p className="text-sm text-gray-600 mt-1">Configure your AI assistant preferences and behavior</p>
                    </div>
                    <div className="p-6">
                      <div className="space-y-6">
                        {/* AI Features */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-lg">
                            <div>
                              <h3 className="font-medium text-orange-900">AI Assistant</h3>
                              <p className="text-sm text-orange-600">Enable AI-powered features</p>
                            </div>
                            <div className="relative">
                              <input
                                type="checkbox"
                                checked={preferences.ai.enabled}
                                onChange={(e) => setPreferences(prev => ({
                                  ...prev,
                                  ai: { ...prev.ai, enabled: e.target.checked }
                                }))}
                                className="sr-only"
                              />
                              <div 
                                className={`w-11 h-6 rounded-full cursor-pointer transition-colors ${
                                  preferences.ai.enabled ? 'bg-gradient-to-r from-orange-500 to-red-500' : 'bg-gray-200'
                                }`}
                                onClick={() => setPreferences(prev => ({
                                  ...prev,
                                  ai: { ...prev.ai, enabled: !prev.ai.enabled }
                                }))}
                              >
                                <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                                  preferences.ai.enabled ? 'translate-x-5' : 'translate-x-0.5'
                                } mt-0.5`}></div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-cyan-50 to-blue-50 border border-cyan-200 rounded-lg">
                            <div>
                              <h3 className="font-medium text-cyan-900">Smart Suggestions</h3>
                              <p className="text-sm text-cyan-600">AI-powered recommendations</p>
                            </div>
                            <div className="relative">
                              <input
                                type="checkbox"
                                checked={preferences.ai.suggestions}
                                onChange={(e) => setPreferences(prev => ({
                                  ...prev,
                                  ai: { ...prev.ai, suggestions: e.target.checked }
                                }))}
                                className="sr-only"
                              />
                              <div 
                                className={`w-11 h-6 rounded-full cursor-pointer transition-colors ${
                                  preferences.ai.suggestions ? 'bg-gradient-to-r from-cyan-500 to-blue-500' : 'bg-gray-200'
                                }`}
                                onClick={() => setPreferences(prev => ({
                                  ...prev,
                                  ai: { ...prev.ai, suggestions: !prev.ai.suggestions }
                                }))}
                              >
                                <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                                  preferences.ai.suggestions ? 'translate-x-5' : 'translate-x-0.5'
                                } mt-0.5`}></div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Creativity Level */}
                        <div className="space-y-3 p-4 bg-gradient-to-r from-violet-50 to-purple-50 border border-violet-200 rounded-lg">
                          <div className="flex items-center justify-between">
                            <label className="text-sm font-medium text-violet-700">Creativity Level</label>
                            <span className="text-sm font-medium text-violet-900 px-2 py-1 bg-gradient-to-r from-violet-100 to-purple-100 rounded">
                              {preferences.ai.creativity}%
                            </span>
                          </div>
                          <div className="relative">
                            <input
                              type="range"
                              min="0"
                              max="100"
                              value={preferences.ai.creativity}
                              onChange={(e) => setPreferences(prev => ({
                                ...prev,
                                ai: { ...prev.ai, creativity: parseInt(e.target.value) }
                              }))}
                              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                              style={{
                                background: `linear-gradient(to right, #8b5cf6 0%, #8b5cf6 ${preferences.ai.creativity}%, #e5e7eb ${preferences.ai.creativity}%, #e5e7eb 100%)`
                              }}
                            />
                          </div>
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>Conservative</span>
                            <span>Balanced</span>
                            <span>Creative</span>
                          </div>
                        </div>

                        {/* Response Speed */}
                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-2 block">Response Speed</label>
                          <select
                            value={preferences.ai.responseSpeed}
                            onChange={(e) => setPreferences(prev => ({
                              ...prev,
                              ai: { ...prev.ai, responseSpeed: e.target.value }
                            }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                            style={{ backgroundColor: '#ffffff !important', color: '#000000 !important' }}
                          >
                            <option value="fast">Fast & Simple</option>
                            <option value="balanced">Balanced</option>
                            <option value="detailed">Detailed & Thorough</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Security Tab */}
              {activeTab === 'security' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                    <div className="p-6 border-b border-gray-200">
                      <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                        <Shield className="h-5 w-5 mr-2 text-gray-700" />
                        Security Settings
                      </h2>
                      <p className="text-sm text-gray-600 mt-1">Manage your account security and privacy settings</p>
                    </div>
                    <div className="p-6">
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg">
                            <div>
                              <h3 className="font-medium text-green-900">Two-Factor Authentication</h3>
                              <p className="text-sm text-green-600">Add extra security to your account</p>
                            </div>
                            <div className="relative">
                              <input
                                type="checkbox"
                                checked={preferences.security.twoFactorEnabled}
                                onChange={(e) => setPreferences(prev => ({
                                  ...prev,
                                  security: { ...prev.security, twoFactorEnabled: e.target.checked }
                                }))}
                                className="sr-only"
                              />
                              <div 
                                className={`w-11 h-6 rounded-full cursor-pointer transition-colors ${
                                  preferences.security.twoFactorEnabled ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gray-200'
                                }`}
                                onClick={() => setPreferences(prev => ({
                                  ...prev,
                                  security: { ...prev.security, twoFactorEnabled: !prev.security.twoFactorEnabled }
                                }))}
                              >
                                <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                                  preferences.security.twoFactorEnabled ? 'translate-x-5' : 'translate-x-0.5'
                                } mt-0.5`}></div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg">
                            <div>
                              <h3 className="font-medium text-purple-900">Login Alerts</h3>
                              <p className="text-sm text-purple-600">Get notified of new logins</p>
                            </div>
                            <div className="relative">
                              <input
                                type="checkbox"
                                checked={preferences.security.loginAlerts}
                                onChange={(e) => setPreferences(prev => ({
                                  ...prev,
                                  security: { ...prev.security, loginAlerts: e.target.checked }
                                }))}
                                className="sr-only"
                              />
                              <div 
                                className={`w-11 h-6 rounded-full cursor-pointer transition-colors ${
                                  preferences.security.loginAlerts ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-gray-200'
                                }`}
                                onClick={() => setPreferences(prev => ({
                                  ...prev,
                                  security: { ...prev.security, loginAlerts: !prev.security.loginAlerts }
                                }))}
                              >
                                <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                                  preferences.security.loginAlerts ? 'translate-x-5' : 'translate-x-0.5'
                                } mt-0.5`}></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Add more tabs as needed */}
              {activeTab === 'notifications' && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                  <div className="p-6 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                      <Bell className="h-5 w-5 mr-2 text-gray-700" />
                      Notification Settings
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">Choose how you want to be notified</p>
                  </div>
                  <div className="p-6">
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
                          <div>
                            <h3 className="font-medium text-blue-900">Email Notifications</h3>
                            <p className="text-sm text-blue-600">Receive updates via email</p>
                          </div>
                          <div className="relative">
                            <input
                              type="checkbox"
                              checked={preferences.notifications.email.enabled}
                              onChange={(e) => setPreferences(prev => ({
                                ...prev,
                                notifications: { 
                                  ...prev.notifications, 
                                  email: { ...prev.notifications.email, enabled: e.target.checked }
                                }
                              }))}
                              className="sr-only"
                            />
                            <div 
                              className={`w-11 h-6 rounded-full cursor-pointer transition-colors ${
                                preferences.notifications.email.enabled ? 'bg-gradient-to-r from-blue-500 to-indigo-500' : 'bg-gray-200'
                              }`}

                              onClick={() => setPreferences(prev => ({
                                ...prev,
                                notifications: { 
                                  ...prev.notifications, 
                                  email: { ...prev.notifications.email, enabled: !prev.notifications.email.enabled }
                                }
                              }))}
                            >
                              <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                                preferences.notifications.email.enabled ? 'translate-x-5' : 'translate-x-0.5'
                              } mt-0.5`}></div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-200 rounded-lg">
                          <div>
                            <h3 className="font-medium text-rose-900">Push Notifications</h3>
                            <p className="text-sm text-rose-600">Receive browser notifications</p>
                          </div>
                          <div className="relative">
                            <input
                              type="checkbox"
                              checked={preferences.notifications.push.enabled}
                              onChange={(e) => setPreferences(prev => ({
                                ...prev,
                                notifications: { 
                                  ...prev.notifications, 
                                  push: { ...prev.notifications.push, enabled: e.target.checked }
                                }
                              }))}
                              className="sr-only"
                            />
                            <div 
                              className={`w-11 h-6 rounded-full cursor-pointer transition-colors ${
                                preferences.notifications.push.enabled ? 'bg-gradient-to-r from-rose-500 to-pink-500' : 'bg-gray-200'
                              }`}
                              onClick={() => setPreferences(prev => ({
                                ...prev,
                                notifications: { 
                                  ...prev.notifications, 
                                  push: { ...prev.notifications.push, enabled: !prev.notifications.push.enabled }
                                }
                              }))}
                            >
                              <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                                preferences.notifications.push.enabled ? 'translate-x-5' : 'translate-x-0.5'
                              } mt-0.5`}></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Placeholder for other tabs */}
              {!['profile', 'ai', 'security', 'notifications'].includes(activeTab) && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                  <div className="p-12 text-center">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <SettingsIcon className="h-6 w-6 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {navigationItems.find(item => item.id === activeTab)?.label || 'Settings'}
                    </h3>
                    <p className="text-gray-600 mb-4">This section is under development</p>
                    <div className="text-sm text-gray-500">
                      More options will be available soon
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>



      {/* Enhanced global styles to prevent yellow colors */}
      <style>{`
        /* Force all elements to use specified colors */
        * {
          --yellow-50: #f9fafb !important;
          --yellow-100: #f3f4f6 !important;
          --yellow-200: #e5e7eb !important;
          --yellow-300: #d1d5db !important;
          --yellow-400: #9ca3af !important;
          --yellow-500: #6b7280 !important;
          --yellow-600: #4b5563 !important;
          --yellow-700: #374151 !important;
          --yellow-800: #1f2937 !important;
          --yellow-900: #111827 !important;
        }

        /* Override any yellow backgrounds */
        [class*="yellow"], [class*="bg-yellow"], [style*="yellow"] {
          background-color: #f3f4f6 !important;
        }

        /* Force text colors to be black */
        body, html, div, span, p, h1, h2, h3, h4, h5, h6, a, button, input, textarea, select, label {
          color: #000000 !important;
        }

        /* Override all slider and toggle components */
        input[type="range"] {
          -webkit-appearance: none;
          appearance: none;
          background: transparent;
          cursor: pointer;
        }

        input[type="range"]::-webkit-slider-track {
          background: #e5e7eb;
          height: 6px;
          border-radius: 3px;
        }

        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          background: #111827;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          border: 3px solid #fff;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        /* Override all backgrounds and borders */
        .bg-white { background-color: #ffffff !important; }
        .bg-gray-50 { background-color: #f9fafb !important; }
        .bg-gray-100 { background-color: #f3f4f6 !important; }
        .bg-gray-200 { background-color: #e5e7eb !important; }
        .bg-gray-900 { background-color: #111827 !important; }
        
        .text-gray-900 { color: #111827 !important; }
        .text-gray-800 { color: #1f2937 !important; }
        .text-gray-700 { color: #374151 !important; }
        .text-gray-600 { color: #4b5563 !important; }
        .text-gray-500 { color: #6b7280 !important; }
        .text-white { color: #ffffff !important; }
        .text-black { color: #000000 !important; }
        
        .border-gray-200 { border-color: #e5e7eb !important; }
        .border-gray-300 { border-color: #d1d5db !important; }
        
        /* Navigation tab active state - Cyan color matching main Settings tab */
        .bg-cyan-50 {
          background-color: #cffafe !important;
        }
        
        .text-cyan-800 {
          color: #0f766e !important;
        }
        
        .bg-cyan-50 * {
          color: #0f766e !important;
        }
        
        /* Force light blue on active navigation buttons - matching main Settings tab */
        nav button[data-active="true"] {
          background-color: #cffafe !important;
          color: #0f766e !important;
          font-weight: 600 !important;
        }
        
        nav button[data-active="true"] * {
          color: #0f766e !important;
        }
        
        nav button[data-active="true"] svg {
          color: #0f766e !important;
        }
        
        /* Enhanced button styling with darker colors and conditional animations */
        .save-button {
          background: linear-gradient(135deg, #10b981 0%, #14b8a6 100%) !important;
          color: #ffffff !important;
          border: none !important;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06) !important;
          transition: all 0.3s ease-in-out !important;
        }
        
        .save-button:not(:disabled) {
          animation: gentle-pulse 2s infinite !important;
        }
        
        .save-button:hover:not(:disabled) {
          background: linear-gradient(135deg, #059669 0%, #0f766e 100%) !important;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04) !important;
          transform: scale(1.05) translateY(-2px) !important;
        }
        
        .save-button * {
          color: #ffffff !important;
        }
        
        .save-button:disabled {
          background: linear-gradient(135deg, #d1d5db 0%, #9ca3af 100%) !important;
          color: #ffffff !important;
          opacity: 0.6 !important;
          cursor: not-allowed !important;
          transform: none !important;
          animation: none !important;
        }
        
        /* Sign out button styling with darker colors */
        .sign-out-button {
          background: linear-gradient(135deg, #ef4444 0%, #ec4899 100%) !important;
          color: #ffffff !important;
          border: none !important;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06) !important;
          transition: all 0.3s ease-in-out !important;
        }
        
        .sign-out-button:hover {
          background: linear-gradient(135deg, #dc2626 0%, #db2777 100%) !important;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04) !important;
          transform: scale(1.05) translateY(-2px) rotate(1deg) !important;
        }
        
        .sign-out-button * {
          color: #ffffff !important;
        }
        
        /* Custom animation keyframes */
        @keyframes gentle-pulse {
          0%, 100% {
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          }
          50% {
            box-shadow: 0 8px 12px -2px rgba(16, 185, 129, 0.3), 0 4px 8px -2px rgba(16, 185, 129, 0.2);
          }
        }
        
        @keyframes button-float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-3px);
          }
        }
        
        /* Enhanced colorful styling for all form elements */
        input[type="text"], input[type="email"], input[type="password"], 
        input[type="number"], input[type="tel"], input[type="url"], 
        textarea, select {
          background-color: #ffffff !important;
          color: #000000 !important;
          border-color: #d1d5db !important;
        }
        
        input[type="text"]:focus, input[type="email"]:focus, 
        input[type="password"]:focus, input[type="number"]:focus, 
        input[type="tel"]:focus, input[type="url"]:focus, 
        textarea:focus, select:focus {
          border-color: #3b82f6 !important;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1) !important;
        }
        
        /* Enhanced button styling with colors */
        button {
          background-color: #ffffff !important;
          color: #000000 !important;
          border-color: #d1d5db !important;
        }
        
        button:hover {
          background-color: #f9fafb !important;
          border-color: #9ca3af !important;
        }
        
        /* Gradient backgrounds for different sections */
        .security-section {
          background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%) !important;
        }
        
        .ai-section {
          background: linear-gradient(135deg, #fef3c7 0%, #fed7aa 100%) !important;
        }
        
        .notifications-section {
          background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%) !important;
        }
        
        .profile-section {
          background: linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%) !important;
        }
        
        /* Colorful card enhancements */
        .settings-card {
          background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%) !important;
          border: 1px solid #e2e8f0 !important;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1) !important;
        }
        
        .settings-card:hover {
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1) !important;
          transform: translateY(-2px) !important;
        }
        
        /* Comprehensive toggle switch styling */
        .toggle-switch {
          background: linear-gradient(135deg, #e5e7eb 0%, #d1d5db 100%) !important;
          border: 1px solid #9ca3af !important;
        }
        
        .toggle-switch.active {
          background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%) !important;
          border: 1px solid #1e40af !important;
        }
        
        .toggle-switch.active.green {
          background: linear-gradient(135deg, #10b981 0%, #047857 100%) !important;
          border: 1px solid #065f46 !important;
        }
        
        .toggle-switch.active.purple {
          background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%) !important;
          border: 1px solid #6d28d9 !important;
        }
        
        .toggle-switch.active.orange {
          background: linear-gradient(135deg, #f97316 0%, #ea580c 100%) !important;
          border: 1px solid #c2410c !important;
        }
        
        .toggle-switch.active.cyan {
          background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%) !important;
          border: 1px solid #0e7490 !important;
        }
        
        .toggle-switch.active.rose {
          background: linear-gradient(135deg, #f43f5e 0%, #e11d48 100%) !important;
          border: 1px solid #be123c !important;
        }
        
        /* Enhanced range slider styling */
        input[type="range"] {
          background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%) !important;
          border: 1px solid #d1d5db !important;
          border-radius: 6px !important;
        }
        
        input[type="range"]::-webkit-slider-thumb {
          background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%) !important;
          border: 2px solid #ffffff !important;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2) !important;
        }
        
        input[type="range"]::-moz-range-thumb {
          background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%) !important;
          border: 2px solid #ffffff !important;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2) !important;
        }
        
        /* Enhanced footer styling */
        .colorful-footer {
          background: linear-gradient(135deg, #dcfce7 0%, #d1fae5 50%, #cffafe 100%) !important;
          border-top: 2px solid #10b981 !important;
          box-shadow: 0 -4px 6px -1px rgba(0, 0, 0, 0.1) !important;
        }
        
        /* Status indicators */
        .status-indicator.green {
          background: linear-gradient(135deg, #10b981 0%, #047857 100%) !important;
          box-shadow: 0 0 10px rgba(16, 185, 129, 0.5) !important;
        }
        
        .status-indicator.blue {
          background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%) !important;
          box-shadow: 0 0 10px rgba(59, 130, 246, 0.5) !important;
        }
        
        .status-indicator.purple {
          background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%) !important;
          box-shadow: 0 0 10px rgba(139, 92, 246, 0.5) !important;
        }
        
        /* Enhanced text colors */
        .text-emerald-700 { color: #047857 !important; }
        .text-blue-700 { color: #1d4ed8 !important; }
        .text-purple-700 { color: #7c3aed !important; }
        .text-orange-700 { color: #ea580c !important; }
        .text-cyan-700 { color: #0891b2 !important; }
        .text-rose-700 { color: #e11d48 !important; }
        .text-violet-700 { color: #7c3aed !important; }
        .text-pink-700 { color: #be185d !important; }
        
        /* Enhanced background colors */
        .bg-emerald-50 { background-color: #ecfdf5 !important; }
        .bg-blue-50 { background-color: #eff6ff !important; }
        .bg-purple-50 { background-color: #faf5ff !important; }
        .bg-orange-50 { background-color: #fff7ed !important; }
        .bg-cyan-50 { background-color: #ecfeff !important; }
        .bg-rose-50 { background-color: #fff1f2 !important; }
        .bg-violet-50 { background-color: #f5f3ff !important; }
        .bg-pink-50 { background-color: #fdf2f8 !important; }
        
        /* Enhanced border colors */
        .border-emerald-200 { border-color: #a7f3d0 !important; }
        .border-blue-200 { border-color: #bfdbfe !important; }
        .border-purple-200 { border-color: #e9d5ff !important; }
        .border-orange-200 { border-color: #fed7aa !important; }
        .border-cyan-200 { border-color: #a5f3fc !important; }
        .border-rose-200 { border-color: #fecaca !important; }
        .border-violet-200 { border-color: #ddd6fe !important; }
        .border-pink-200 { border-color: #fbcfe8 !important; }
      `}</style>
    </div>
  );
};

export default EnterpriseSettings;