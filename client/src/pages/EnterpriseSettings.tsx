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
  X,
  Wallet,
  Plus
} from 'lucide-react';

const EnterpriseSettings = () => {
  const { user, token } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("profile");
  const [searchQuery, setSearchQuery] = useState("");
  const [hasChanges, setHasChanges] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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
      betaFeatures: false,
      autoOptimization: true,
      smartScheduling: true,
      predictiveAnalytics: false,
      customPrompts: true,
      multiLanguage: false,
      imageGeneration: true,
      videoSummaries: false,
      trendAnalysis: true,
      competitorInsights: false,
      hashtagSuggestions: true,
      contentOptimization: true,
      audienceInsights: false,
      performanceTracking: true
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
  const handleSaveChanges = async () => {
    setIsLoading(true);
    try {
      // Simulate save API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setHasChanges(false);
      toast({
        title: "Settings saved",
        description: "Your settings have been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Set user data from auth context (which already has the correct data)
  useEffect(() => {
    console.log('Setting user data from auth context:', user);
    if (user) {
      setUserData(user);
      
      // Update profile with real user data
      setProfile(prev => ({
        ...prev,
        displayName: user.displayName || user.username || '',
        email: user.email || ''
      }));
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
                  {/* AI Core Features */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                    <div className="p-6 border-b border-gray-200">
                      <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                        <Brain className="h-5 w-5 mr-2 text-gray-700" />
                        AI Assistant Core Features
                      </h2>
                      <p className="text-sm text-gray-600 mt-1">Configure your AI assistant's primary capabilities</p>
                    </div>
                    <div className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg">
                          <div>
                            <h3 className="font-medium text-blue-900">AI Assistant</h3>
                            <p className="text-sm text-blue-600">Enable all AI-powered features</p>
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
                                preferences.ai.enabled ? 'bg-gradient-to-r from-blue-500 to-purple-500' : 'bg-gray-200'
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
                        
                        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-cyan-50 to-teal-50 border border-cyan-200 rounded-lg">
                          <div>
                            <h3 className="font-medium text-cyan-900">Smart Suggestions</h3>
                            <p className="text-sm text-cyan-600">AI-powered content recommendations</p>
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
                                preferences.ai.suggestions ? 'bg-gradient-to-r from-cyan-500 to-teal-500' : 'bg-gray-200'
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
                        
                        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg">
                          <div>
                            <h3 className="font-medium text-green-900">Auto-Optimization</h3>
                            <p className="text-sm text-green-600">Automatically optimize content performance</p>
                          </div>
                          <div className="relative">
                            <input
                              type="checkbox"
                              checked={preferences.ai.autoOptimization}
                              onChange={(e) => setPreferences(prev => ({
                                ...prev,
                                ai: { ...prev.ai, autoOptimization: e.target.checked }
                              }))}
                              className="sr-only"
                            />
                            <div 
                              className={`w-11 h-6 rounded-full cursor-pointer transition-colors ${
                                preferences.ai.autoOptimization ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gray-200'
                              }`}
                              onClick={() => setPreferences(prev => ({
                                ...prev,
                                ai: { ...prev.ai, autoOptimization: !prev.ai.autoOptimization }
                              }))}
                            >
                              <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                                preferences.ai.autoOptimization ? 'translate-x-5' : 'translate-x-0.5'
                              } mt-0.5`}></div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200 rounded-lg">
                          <div>
                            <h3 className="font-medium text-indigo-900">Smart Scheduling</h3>
                            <p className="text-sm text-indigo-600">AI-powered optimal posting times</p>
                          </div>
                          <div className="relative">
                            <input
                              type="checkbox"
                              checked={preferences.ai.smartScheduling}
                              onChange={(e) => setPreferences(prev => ({
                                ...prev,
                                ai: { ...prev.ai, smartScheduling: e.target.checked }
                              }))}
                              className="sr-only"
                            />
                            <div 
                              className={`w-11 h-6 rounded-full cursor-pointer transition-colors ${
                                preferences.ai.smartScheduling ? 'bg-gradient-to-r from-indigo-500 to-blue-500' : 'bg-gray-200'
                              }`}
                              onClick={() => setPreferences(prev => ({
                                ...prev,
                                ai: { ...prev.ai, smartScheduling: !prev.ai.smartScheduling }
                              }))}
                            >
                              <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                                preferences.ai.smartScheduling ? 'translate-x-5' : 'translate-x-0.5'
                              } mt-0.5`}></div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg">
                          <div>
                            <h3 className="font-medium text-purple-900">Image Generation</h3>
                            <p className="text-sm text-purple-600">AI-powered image creation</p>
                          </div>
                          <div className="relative">
                            <input
                              type="checkbox"
                              checked={preferences.ai.imageGeneration}
                              onChange={(e) => setPreferences(prev => ({
                                ...prev,
                                ai: { ...prev.ai, imageGeneration: e.target.checked }
                              }))}
                              className="sr-only"
                            />
                            <div 
                              className={`w-11 h-6 rounded-full cursor-pointer transition-colors ${
                                preferences.ai.imageGeneration ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-gray-200'
                              }`}
                              onClick={() => setPreferences(prev => ({
                                ...prev,
                                ai: { ...prev.ai, imageGeneration: !prev.ai.imageGeneration }
                              }))}
                            >
                              <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                                preferences.ai.imageGeneration ? 'translate-x-5' : 'translate-x-0.5'
                              } mt-0.5`}></div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-lg">
                          <div>
                            <h3 className="font-medium text-red-900">Trend Analysis</h3>
                            <p className="text-sm text-red-600">Real-time trend monitoring</p>
                          </div>
                          <div className="relative">
                            <input
                              type="checkbox"
                              checked={preferences.ai.trendAnalysis}
                              onChange={(e) => setPreferences(prev => ({
                                ...prev,
                                ai: { ...prev.ai, trendAnalysis: e.target.checked }
                              }))}
                              className="sr-only"
                            />
                            <div 
                              className={`w-11 h-6 rounded-full cursor-pointer transition-colors ${
                                preferences.ai.trendAnalysis ? 'bg-gradient-to-r from-red-500 to-orange-500' : 'bg-gray-200'
                              }`}
                              onClick={() => setPreferences(prev => ({
                                ...prev,
                                ai: { ...prev.ai, trendAnalysis: !prev.ai.trendAnalysis }
                              }))}
                            >
                              <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                                preferences.ai.trendAnalysis ? 'translate-x-5' : 'translate-x-0.5'
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
                      <div className="space-y-3 p-4 bg-gradient-to-r from-slate-50 to-gray-50 border border-slate-200 rounded-lg">
                        <label className="text-sm font-medium text-slate-700 mb-2 block">Response Speed</label>
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
              )}

              {/* Security Tab */}
              {activeTab === 'security' && (
                <div className="space-y-6">
                  {/* Security Overview */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                    <div className="p-6 border-b border-gray-200">
                      <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                        <Shield className="h-5 w-5 mr-2 text-gray-700" />
                        Security & Privacy Settings
                      </h2>
                      <p className="text-sm text-gray-600 mt-1">Protect your account with advanced security features</p>
                    </div>
                    <div className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-lg">
                          <div>
                            <h3 className="font-medium text-emerald-900">Two-Factor Authentication</h3>
                            <p className="text-sm text-emerald-600">Add an extra layer of security</p>
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
                                preferences.security.twoFactorEnabled ? 'bg-gradient-to-r from-emerald-500 to-teal-500' : 'bg-gray-200'
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
                        
                        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
                          <div>
                            <h3 className="font-medium text-blue-900">Login Alerts</h3>
                            <p className="text-sm text-blue-600">Get notified of new logins</p>
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
                                preferences.security.loginAlerts ? 'bg-gradient-to-r from-blue-500 to-indigo-500' : 'bg-gray-200'
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
                        
                        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg">
                          <div>
                            <h3 className="font-medium text-purple-900">Device Tracking</h3>
                            <p className="text-sm text-purple-600">Monitor device access</p>
                          </div>
                          <div className="relative">
                            <input
                              type="checkbox"
                              checked={preferences.security.deviceTracking}
                              onChange={(e) => setPreferences(prev => ({
                                ...prev,
                                security: { ...prev.security, deviceTracking: e.target.checked }
                              }))}
                              className="sr-only"
                            />
                            <div 
                              className={`w-11 h-6 rounded-full cursor-pointer transition-colors ${
                                preferences.security.deviceTracking ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-gray-200'
                              }`}
                              onClick={() => setPreferences(prev => ({
                                ...prev,
                                security: { ...prev.security, deviceTracking: !prev.security.deviceTracking }
                              }))}
                            >
                              <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                                preferences.security.deviceTracking ? 'translate-x-5' : 'translate-x-0.5'
                              } mt-0.5`}></div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-lg">
                          <div>
                            <h3 className="font-medium text-orange-900">Biometric Authentication</h3>
                            <p className="text-sm text-orange-600">Fingerprint & face recognition</p>
                          </div>
                          <div className="relative">
                            <input
                              type="checkbox"
                              checked={preferences.security.biometricAuth}
                              onChange={(e) => setPreferences(prev => ({
                                ...prev,
                                security: { ...prev.security, biometricAuth: e.target.checked }
                              }))}
                              className="sr-only"
                            />
                            <div 
                              className={`w-11 h-6 rounded-full cursor-pointer transition-colors ${
                                preferences.security.biometricAuth ? 'bg-gradient-to-r from-orange-500 to-red-500' : 'bg-gray-200'
                              }`}
                              onClick={() => setPreferences(prev => ({
                                ...prev,
                                security: { ...prev.security, biometricAuth: !prev.security.biometricAuth }
                              }))}
                            >
                              <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                                preferences.security.biometricAuth ? 'translate-x-5' : 'translate-x-0.5'
                              } mt-0.5`}></div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Session Timeout */}
                      <div className="mt-6 space-y-3 p-4 bg-gradient-to-r from-slate-50 to-gray-50 border border-slate-200 rounded-lg">
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-medium text-slate-700">Session Timeout</label>
                          <span className="text-sm font-medium text-slate-900 px-2 py-1 bg-gradient-to-r from-slate-100 to-gray-100 rounded">
                            {preferences.security.sessionTimeout} minutes
                          </span>
                        </div>
                        <div className="relative">
                          <input
                            type="range"
                            min="5"
                            max="120"
                            value={preferences.security.sessionTimeout}
                            onChange={(e) => setPreferences(prev => ({
                              ...prev,
                              security: { ...prev.security, sessionTimeout: parseInt(e.target.value) }
                            }))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                            style={{
                              background: `linear-gradient(to right, #64748b 0%, #64748b ${(preferences.security.sessionTimeout - 5) / 115 * 100}%, #e5e7eb ${(preferences.security.sessionTimeout - 5) / 115 * 100}%, #e5e7eb 100%)`
                            }}
                          />
                        </div>
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>5 min</span>
                          <span>30 min</span>
                          <span>60 min</span>
                          <span>120 min</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Privacy Controls */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                    <div className="p-6 border-b border-gray-200">
                      <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                        <Eye className="h-5 w-5 mr-2 text-gray-700" />
                        Privacy Controls
                      </h2>
                      <p className="text-sm text-gray-600 mt-1">Control your data and privacy preferences</p>
                    </div>
                    <div className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <label className="text-sm font-medium text-gray-700">Profile Visibility</label>
                          <select
                            value={preferences.privacy.profileVisibility}
                            onChange={(e) => setPreferences(prev => ({
                              ...prev,
                              privacy: { ...prev.privacy, profileVisibility: e.target.value }
                            }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                            style={{ backgroundColor: '#ffffff !important', color: '#000000 !important' }}
                          >
                            <option value="public">Public</option>
                            <option value="private">Private</option>
                            <option value="team">Team Only</option>
                          </select>
                        </div>
                        
                        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-teal-50 border border-green-200 rounded-lg">
                          <div>
                            <h3 className="font-medium text-green-900">Activity Status</h3>
                            <p className="text-sm text-green-600">Show when you're active</p>
                          </div>
                          <div className="relative">
                            <input
                              type="checkbox"
                              checked={preferences.privacy.activityStatus}
                              onChange={(e) => setPreferences(prev => ({
                                ...prev,
                                privacy: { ...prev.privacy, activityStatus: e.target.checked }
                              }))}
                              className="sr-only"
                            />
                            <div 
                              className={`w-11 h-6 rounded-full cursor-pointer transition-colors ${
                                preferences.privacy.activityStatus ? 'bg-gradient-to-r from-green-500 to-teal-500' : 'bg-gray-200'
                              }`}
                              onClick={() => setPreferences(prev => ({
                                ...prev,
                                privacy: { ...prev.privacy, activityStatus: !prev.privacy.activityStatus }
                              }))}
                            >
                              <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                                preferences.privacy.activityStatus ? 'translate-x-5' : 'translate-x-0.5'
                              } mt-0.5`}></div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
                          <div>
                            <h3 className="font-medium text-blue-900">Data Collection</h3>
                            <p className="text-sm text-blue-600">Analytics and insights</p>
                          </div>
                          <div className="relative">
                            <input
                              type="checkbox"
                              checked={preferences.privacy.dataCollection}
                              onChange={(e) => setPreferences(prev => ({
                                ...prev,
                                privacy: { ...prev.privacy, dataCollection: e.target.checked }
                              }))}
                              className="sr-only"
                            />
                            <div 
                              className={`w-11 h-6 rounded-full cursor-pointer transition-colors ${
                                preferences.privacy.dataCollection ? 'bg-gradient-to-r from-blue-500 to-indigo-500' : 'bg-gray-200'
                              }`}
                              onClick={() => setPreferences(prev => ({
                                ...prev,
                                privacy: { ...prev.privacy, dataCollection: !prev.privacy.dataCollection }
                              }))}
                            >
                              <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                                preferences.privacy.dataCollection ? 'translate-x-5' : 'translate-x-0.5'
                              } mt-0.5`}></div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg">
                          <div>
                            <h3 className="font-medium text-purple-900">Third-Party Integrations</h3>
                            <p className="text-sm text-purple-600">External app connections</p>
                          </div>
                          <div className="relative">
                            <input
                              type="checkbox"
                              checked={preferences.privacy.thirdPartyIntegrations}
                              onChange={(e) => setPreferences(prev => ({
                                ...prev,
                                privacy: { ...prev.privacy, thirdPartyIntegrations: e.target.checked }
                              }))}
                              className="sr-only"
                            />
                            <div 
                              className={`w-11 h-6 rounded-full cursor-pointer transition-colors ${
                                preferences.privacy.thirdPartyIntegrations ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-gray-200'
                              }`}
                              onClick={() => setPreferences(prev => ({
                                ...prev,
                                privacy: { ...prev.privacy, thirdPartyIntegrations: !prev.privacy.thirdPartyIntegrations }
                              }))}
                            >
                              <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                                preferences.privacy.thirdPartyIntegrations ? 'translate-x-5' : 'translate-x-0.5'
                              } mt-0.5`}></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  {/* Push Notifications */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                    <div className="p-6 border-b border-gray-200">
                      <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                        <Bell className="h-5 w-5 mr-2 text-gray-700" />
                        Push Notifications
                      </h2>
                      <p className="text-sm text-gray-600 mt-1">Control how you receive notifications</p>
                    </div>
                    <div className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg">
                          <div>
                            <h3 className="font-medium text-green-900">Push Notifications</h3>
                            <p className="text-sm text-green-600">Receive notifications on your device</p>
                          </div>
                          <div className="relative">
                            <input
                              type="checkbox"
                              checked={preferences.notifications.push.enabled}
                              onChange={(e) => setPreferences(prev => ({
                                ...prev,
                                notifications: { ...prev.notifications, push: { ...prev.notifications.push, enabled: e.target.checked } }
                              }))}
                              className="sr-only"
                            />
                            <div 
                              className={`w-11 h-6 rounded-full cursor-pointer transition-colors ${
                                preferences.notifications.push.enabled ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gray-200'
                              }`}
                              onClick={() => setPreferences(prev => ({
                                ...prev,
                                notifications: { ...prev.notifications, push: { ...prev.notifications.push, enabled: !prev.notifications.push.enabled } }
                              }))}
                            >
                              <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                                preferences.notifications.push.enabled ? 'translate-x-5' : 'translate-x-0.5'
                              } mt-0.5`}></div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-lg">
                          <div>
                            <h3 className="font-medium text-blue-900">Marketing Notifications</h3>
                            <p className="text-sm text-blue-600">Product updates and tips</p>
                          </div>
                          <div className="relative">
                            <input
                              type="checkbox"
                              checked={preferences.notifications.push.marketing}
                              onChange={(e) => setPreferences(prev => ({
                                ...prev,
                                notifications: { ...prev.notifications, push: { ...prev.notifications.push, marketing: e.target.checked } }
                              }))}
                              className="sr-only"
                            />
                            <div 
                              className={`w-11 h-6 rounded-full cursor-pointer transition-colors ${
                                preferences.notifications.push.marketing ? 'bg-gradient-to-r from-blue-500 to-cyan-500' : 'bg-gray-200'
                              }`}
                              onClick={() => setPreferences(prev => ({
                                ...prev,
                                notifications: { ...prev.notifications, push: { ...prev.notifications.push, marketing: !prev.notifications.push.marketing } }
                              }))}
                            >
                              <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                                preferences.notifications.push.marketing ? 'translate-x-5' : 'translate-x-0.5'
                              } mt-0.5`}></div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg">
                          <div>
                            <h3 className="font-medium text-purple-900">Security Alerts</h3>
                            <p className="text-sm text-purple-600">Account security notifications</p>
                          </div>
                          <div className="relative">
                            <input
                              type="checkbox"
                              checked={preferences.notifications.push.security}
                              onChange={(e) => setPreferences(prev => ({
                                ...prev,
                                notifications: { ...prev.notifications, push: { ...prev.notifications.push, security: e.target.checked } }
                              }))}
                              className="sr-only"
                            />
                            <div 
                              className={`w-11 h-6 rounded-full cursor-pointer transition-colors ${
                                preferences.notifications.push.security ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-gray-200'
                              }`}
                              onClick={() => setPreferences(prev => ({
                                ...prev,
                                notifications: { ...prev.notifications, push: { ...prev.notifications.push, security: !prev.notifications.push.security } }
                              }))}
                            >
                              <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                                preferences.notifications.push.security ? 'translate-x-5' : 'translate-x-0.5'
                              } mt-0.5`}></div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-lg">
                          <div>
                            <h3 className="font-medium text-orange-900">Updates</h3>
                            <p className="text-sm text-orange-600">Feature updates and releases</p>
                          </div>
                          <div className="relative">
                            <input
                              type="checkbox"
                              checked={preferences.notifications.push.updates}
                              onChange={(e) => setPreferences(prev => ({
                                ...prev,
                                notifications: { ...prev.notifications, push: { ...prev.notifications.push, updates: e.target.checked } }
                              }))}
                              className="sr-only"
                            />
                            <div 
                              className={`w-11 h-6 rounded-full cursor-pointer transition-colors ${
                                preferences.notifications.push.updates ? 'bg-gradient-to-r from-orange-500 to-red-500' : 'bg-gray-200'
                              }`}
                              onClick={() => setPreferences(prev => ({
                                ...prev,
                                notifications: { ...prev.notifications, push: { ...prev.notifications.push, updates: !prev.notifications.push.updates } }
                              }))}
                            >
                              <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                                preferences.notifications.push.updates ? 'translate-x-5' : 'translate-x-0.5'
                              } mt-0.5`}></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Desktop Notifications */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                    <div className="p-6 border-b border-gray-200">
                      <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                        <Monitor className="h-5 w-5 mr-2 text-gray-700" />
                        Desktop Notifications
                      </h2>
                      <p className="text-sm text-gray-600 mt-1">Customize desktop notification behavior</p>
                    </div>
                    <div className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200 rounded-lg">
                          <div>
                            <h3 className="font-medium text-indigo-900">Desktop Notifications</h3>
                            <p className="text-sm text-indigo-600">Show notifications on desktop</p>
                          </div>
                          <div className="relative">
                            <input
                              type="checkbox"
                              checked={preferences.notifications.desktop.enabled}
                              onChange={(e) => setPreferences(prev => ({
                                ...prev,
                                notifications: { ...prev.notifications, desktop: { ...prev.notifications.desktop, enabled: e.target.checked } }
                              }))}
                              className="sr-only"
                            />
                            <div 
                              className={`w-11 h-6 rounded-full cursor-pointer transition-colors ${
                                preferences.notifications.desktop.enabled ? 'bg-gradient-to-r from-indigo-500 to-blue-500' : 'bg-gray-200'
                              }`}
                              onClick={() => setPreferences(prev => ({
                                ...prev,
                                notifications: { ...prev.notifications, desktop: { ...prev.notifications.desktop, enabled: !prev.notifications.desktop.enabled } }
                              }))}
                            >
                              <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                                preferences.notifications.desktop.enabled ? 'translate-x-5' : 'translate-x-0.5'
                              } mt-0.5`}></div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <label className="text-sm font-medium text-gray-700">Position</label>
                          <select
                            value={preferences.notifications.desktop.position}
                            onChange={(e) => setPreferences(prev => ({
                              ...prev,
                              notifications: { ...prev.notifications, desktop: { ...prev.notifications.desktop, position: e.target.value } }
                            }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                            style={{ backgroundColor: '#ffffff !important', color: '#000000 !important' }}
                          >
                            <option value="top-right">Top Right</option>
                            <option value="top-left">Top Left</option>
                            <option value="bottom-right">Bottom Right</option>
                            <option value="bottom-left">Bottom Left</option>
                          </select>
                        </div>
                        
                        <div className="space-y-3">
                          <label className="text-sm font-medium text-gray-700">Duration</label>
                          <select
                            value={preferences.notifications.desktop.duration}
                            onChange={(e) => setPreferences(prev => ({
                              ...prev,
                              notifications: { ...prev.notifications, desktop: { ...prev.notifications.desktop, duration: parseInt(e.target.value) } }
                            }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                            style={{ backgroundColor: '#ffffff !important', color: '#000000 !important' }}
                          >
                            <option value="3000">3 seconds</option>
                            <option value="5000">5 seconds</option>
                            <option value="10000">10 seconds</option>
                            <option value="0">Manual dismiss</option>
                          </select>
                        </div>
                        
                        <div className="space-y-3">
                          <label className="text-sm font-medium text-gray-700">Priority</label>
                          <select
                            value={preferences.notifications.desktop.priority}
                            onChange={(e) => setPreferences(prev => ({
                              ...prev,
                              notifications: { ...prev.notifications, desktop: { ...prev.notifications.desktop, priority: e.target.value } }
                            }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                            style={{ backgroundColor: '#ffffff !important', color: '#000000 !important' }}
                          >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                            <option value="critical">Critical</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Workspace Tab */}
              {activeTab === 'workspace' && (
                <div className="space-y-6">
                  {/* Workspace Overview */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                    <div className="p-6 border-b border-gray-200">
                      <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                        <Building className="h-5 w-5 mr-2 text-gray-700" />
                        Workspace Settings
                      </h2>
                      <p className="text-sm text-gray-600 mt-1">Configure your workspace appearance and behavior</p>
                    </div>
                    <div className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <label className="text-sm font-medium text-gray-700">Workspace Name</label>
                          <input
                            type="text"
                            value={preferences.workspace.name}
                            onChange={(e) => setPreferences(prev => ({
                              ...prev,
                              workspace: { ...prev.workspace, name: e.target.value }
                            }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                            style={{ backgroundColor: '#ffffff !important', color: '#000000 !important' }}
                            placeholder="Enter workspace name"
                          />
                        </div>
                        
                        <div className="space-y-3">
                          <label className="text-sm font-medium text-gray-700">Theme</label>
                          <select
                            value={preferences.workspace.theme}
                            onChange={(e) => setPreferences(prev => ({
                              ...prev,
                              workspace: { ...prev.workspace, theme: e.target.value }
                            }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                            style={{ backgroundColor: '#ffffff !important', color: '#000000 !important' }}
                          >
                            <option value="light">Light</option>
                            <option value="dark">Dark</option>
                            <option value="auto">Auto</option>
                          </select>
                        </div>
                        
                        <div className="space-y-3">
                          <label className="text-sm font-medium text-gray-700">Language</label>
                          <select
                            value={preferences.workspace.language}
                            onChange={(e) => setPreferences(prev => ({
                              ...prev,
                              workspace: { ...prev.workspace, language: e.target.value }
                            }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                            style={{ backgroundColor: '#ffffff !important', color: '#000000 !important' }}
                          >
                            <option value="en">English</option>
                            <option value="es">Spanish</option>
                            <option value="fr">French</option>
                            <option value="de">German</option>
                            <option value="it">Italian</option>
                            <option value="pt">Portuguese</option>
                            <option value="zh">Chinese</option>
                            <option value="ja">Japanese</option>
                            <option value="ko">Korean</option>
                            <option value="hi">Hindi</option>
                          </select>
                        </div>
                        
                        <div className="space-y-3">
                          <label className="text-sm font-medium text-gray-700">Timezone</label>
                          <select
                            value={preferences.workspace.timezone}
                            onChange={(e) => setPreferences(prev => ({
                              ...prev,
                              workspace: { ...prev.workspace, timezone: e.target.value }
                            }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                            style={{ backgroundColor: '#ffffff !important', color: '#000000 !important' }}
                          >
                            <option value="UTC">UTC</option>
                            <option value="America/New_York">Eastern Time</option>
                            <option value="America/Chicago">Central Time</option>
                            <option value="America/Denver">Mountain Time</option>
                            <option value="America/Los_Angeles">Pacific Time</option>
                            <option value="Europe/London">London</option>
                            <option value="Europe/Paris">Paris</option>
                            <option value="Europe/Berlin">Berlin</option>
                            <option value="Asia/Tokyo">Tokyo</option>
                            <option value="Asia/Shanghai">Shanghai</option>
                            <option value="Asia/Kolkata">India</option>
                            <option value="Australia/Sydney">Sydney</option>
                          </select>
                        </div>
                      </div>
                      
                      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-lg">
                          <div>
                            <h3 className="font-medium text-blue-900">Auto-save</h3>
                            <p className="text-sm text-blue-600">Automatically save your work</p>
                          </div>
                          <div className="relative">
                            <input
                              type="checkbox"
                              checked={preferences.workspace.autoSave}
                              onChange={(e) => setPreferences(prev => ({
                                ...prev,
                                workspace: { ...prev.workspace, autoSave: e.target.checked }
                              }))}
                              className="sr-only"
                            />
                            <div 
                              className={`w-11 h-6 rounded-full cursor-pointer transition-colors ${
                                preferences.workspace.autoSave ? 'bg-gradient-to-r from-blue-500 to-cyan-500' : 'bg-gray-200'
                              }`}
                              onClick={() => setPreferences(prev => ({
                                ...prev,
                                workspace: { ...prev.workspace, autoSave: !prev.workspace.autoSave }
                              }))}
                            >
                              <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                                preferences.workspace.autoSave ? 'translate-x-5' : 'translate-x-0.5'
                              } mt-0.5`}></div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg">
                          <div>
                            <h3 className="font-medium text-green-900">Real-time Collaboration</h3>
                            <p className="text-sm text-green-600">Enable collaborative editing</p>
                          </div>
                          <div className="relative">
                            <input
                              type="checkbox"
                              checked={preferences.workspace.collaboration}
                              onChange={(e) => setPreferences(prev => ({
                                ...prev,
                                workspace: { ...prev.workspace, collaboration: e.target.checked }
                              }))}
                              className="sr-only"
                            />
                            <div 
                              className={`w-11 h-6 rounded-full cursor-pointer transition-colors ${
                                preferences.workspace.collaboration ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gray-200'
                              }`}
                              onClick={() => setPreferences(prev => ({
                                ...prev,
                                workspace: { ...prev.workspace, collaboration: !prev.workspace.collaboration }
                              }))}
                            >
                              <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                                preferences.workspace.collaboration ? 'translate-x-5' : 'translate-x-0.5'
                              } mt-0.5`}></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Display Settings */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                    <div className="p-6 border-b border-gray-200">
                      <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                        <Monitor className="h-5 w-5 mr-2 text-gray-700" />
                        Display Settings
                      </h2>
                      <p className="text-sm text-gray-600 mt-1">Customize the appearance of your workspace</p>
                    </div>
                    <div className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-lg">
                          <div className="flex items-center justify-between">
                            <label className="text-sm font-medium text-indigo-700">Sidebar Width</label>
                            <span className="text-sm font-medium text-indigo-900 px-2 py-1 bg-gradient-to-r from-indigo-100 to-purple-100 rounded">
                              {preferences.workspace.sidebarWidth}px
                            </span>
                          </div>
                          <div className="relative">
                            <input
                              type="range"
                              min="200"
                              max="400"
                              value={preferences.workspace.sidebarWidth}
                              onChange={(e) => setPreferences(prev => ({
                                ...prev,
                                workspace: { ...prev.workspace, sidebarWidth: parseInt(e.target.value) }
                              }))}
                              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                              style={{
                                background: `linear-gradient(to right, #6366f1 0%, #6366f1 ${(preferences.workspace.sidebarWidth - 200) / 200 * 100}%, #e5e7eb ${(preferences.workspace.sidebarWidth - 200) / 200 * 100}%, #e5e7eb 100%)`
                              }}
                            />
                          </div>
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>Narrow</span>
                            <span>Wide</span>
                          </div>
                        </div>
                        
                        <div className="space-y-3 p-4 bg-gradient-to-r from-teal-50 to-green-50 border border-teal-200 rounded-lg">
                          <div className="flex items-center justify-between">
                            <label className="text-sm font-medium text-teal-700">Font Size</label>
                            <span className="text-sm font-medium text-teal-900 px-2 py-1 bg-gradient-to-r from-teal-100 to-green-100 rounded">
                              {preferences.workspace.fontSize}px
                            </span>
                          </div>
                          <div className="relative">
                            <input
                              type="range"
                              min="12"
                              max="18"
                              value={preferences.workspace.fontSize}
                              onChange={(e) => setPreferences(prev => ({
                                ...prev,
                                workspace: { ...prev.workspace, fontSize: parseInt(e.target.value) }
                              }))}
                              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                              style={{
                                background: `linear-gradient(to right, #14b8a6 0%, #14b8a6 ${(preferences.workspace.fontSize - 12) / 6 * 100}%, #e5e7eb ${(preferences.workspace.fontSize - 12) / 6 * 100}%, #e5e7eb 100%)`
                              }}
                            />
                          </div>
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>Small</span>
                            <span>Large</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg">
                          <div>
                            <h3 className="font-medium text-purple-900">Compact Mode</h3>
                            <p className="text-sm text-purple-600">Reduce spacing and padding</p>
                          </div>
                          <div className="relative">
                            <input
                              type="checkbox"
                              checked={preferences.workspace.compactMode}
                              onChange={(e) => setPreferences(prev => ({
                                ...prev,
                                workspace: { ...prev.workspace, compactMode: e.target.checked }
                              }))}
                              className="sr-only"
                            />
                            <div 
                              className={`w-11 h-6 rounded-full cursor-pointer transition-colors ${
                                preferences.workspace.compactMode ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-gray-200'
                              }`}
                              onClick={() => setPreferences(prev => ({
                                ...prev,
                                workspace: { ...prev.workspace, compactMode: !prev.workspace.compactMode }
                              }))}
                            >
                              <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                                preferences.workspace.compactMode ? 'translate-x-5' : 'translate-x-0.5'
                              } mt-0.5`}></div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-lg">
                          <div>
                            <h3 className="font-medium text-orange-900">Animations</h3>
                            <p className="text-sm text-orange-600">Enable smooth animations</p>
                          </div>
                          <div className="relative">
                            <input
                              type="checkbox"
                              checked={preferences.workspace.animations}
                              onChange={(e) => setPreferences(prev => ({
                                ...prev,
                                workspace: { ...prev.workspace, animations: e.target.checked }
                              }))}
                              className="sr-only"
                            />
                            <div 
                              className={`w-11 h-6 rounded-full cursor-pointer transition-colors ${
                                preferences.workspace.animations ? 'bg-gradient-to-r from-orange-500 to-red-500' : 'bg-gray-200'
                              }`}
                              onClick={() => setPreferences(prev => ({
                                ...prev,
                                workspace: { ...prev.workspace, animations: !prev.workspace.animations }
                              }))}
                            >
                              <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                                preferences.workspace.animations ? 'translate-x-5' : 'translate-x-0.5'
                              } mt-0.5`}></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Billing Tab */}
              {activeTab === 'billing' && (
                <div className="space-y-6">
                  {/* Billing Overview */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                    <div className="p-6 border-b border-gray-200">
                      <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                        <CreditCard className="h-5 w-5 mr-2 text-gray-700" />
                        Billing & Usage
                      </h2>
                      <p className="text-sm text-gray-600 mt-1">Manage your subscription and billing preferences</p>
                    </div>
                    <div className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-medium text-blue-900">Current Plan</h3>
                              <p className="text-sm text-blue-600">Free Plan</p>
                            </div>
                            <div className="text-2xl font-bold text-blue-700">₹0</div>
                          </div>
                        </div>
                        
                        <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-medium text-green-900">Credits Used</h3>
                              <p className="text-sm text-green-600">This month</p>
                            </div>
                            <div className="text-2xl font-bold text-green-700">0</div>
                          </div>
                        </div>
                        
                        <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-medium text-purple-900">Credits Remaining</h3>
                              <p className="text-sm text-purple-600">Available</p>
                            </div>
                            <div className="text-2xl font-bold text-purple-700">20</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-lg">
                          <div>
                            <h3 className="font-medium text-orange-900">Auto-renewal</h3>
                            <p className="text-sm text-orange-600">Automatically renew subscription</p>
                          </div>
                          <div className="relative">
                            <input
                              type="checkbox"
                              checked={preferences.billing.autoRenewal}
                              onChange={(e) => setPreferences(prev => ({
                                ...prev,
                                billing: { ...prev.billing, autoRenewal: e.target.checked }
                              }))}
                              className="sr-only"
                            />
                            <div 
                              className={`w-11 h-6 rounded-full cursor-pointer transition-colors ${
                                preferences.billing.autoRenewal ? 'bg-gradient-to-r from-orange-500 to-red-500' : 'bg-gray-200'
                              }`}
                              onClick={() => setPreferences(prev => ({
                                ...prev,
                                billing: { ...prev.billing, autoRenewal: !prev.billing.autoRenewal }
                              }))}
                            >
                              <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                                preferences.billing.autoRenewal ? 'translate-x-5' : 'translate-x-0.5'
                              } mt-0.5`}></div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200 rounded-lg">
                          <div>
                            <h3 className="font-medium text-indigo-900">Usage Alerts</h3>
                            <p className="text-sm text-indigo-600">Notify when credits are low</p>
                          </div>
                          <div className="relative">
                            <input
                              type="checkbox"
                              checked={preferences.billing.usageAlerts}
                              onChange={(e) => setPreferences(prev => ({
                                ...prev,
                                billing: { ...prev.billing, usageAlerts: e.target.checked }
                              }))}
                              className="sr-only"
                            />
                            <div 
                              className={`w-11 h-6 rounded-full cursor-pointer transition-colors ${
                                preferences.billing.usageAlerts ? 'bg-gradient-to-r from-indigo-500 to-blue-500' : 'bg-gray-200'
                              }`}
                              onClick={() => setPreferences(prev => ({
                                ...prev,
                                billing: { ...prev.billing, usageAlerts: !prev.billing.usageAlerts }
                              }))}
                            >
                              <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                                preferences.billing.usageAlerts ? 'translate-x-5' : 'translate-x-0.5'
                              } mt-0.5`}></div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Alert Threshold */}
                      <div className="mt-6 space-y-3 p-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg">
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-medium text-amber-700">Alert Threshold</label>
                          <span className="text-sm font-medium text-amber-900 px-2 py-1 bg-gradient-to-r from-amber-100 to-orange-100 rounded">
                            {preferences.billing.alertThreshold}% remaining
                          </span>
                        </div>
                        <div className="relative">
                          <input
                            type="range"
                            min="10"
                            max="50"
                            value={preferences.billing.alertThreshold}
                            onChange={(e) => setPreferences(prev => ({
                              ...prev,
                              billing: { ...prev.billing, alertThreshold: parseInt(e.target.value) }
                            }))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                            style={{
                              background: `linear-gradient(to right, #f59e0b 0%, #f59e0b ${(preferences.billing.alertThreshold - 10) / 40 * 100}%, #e5e7eb ${(preferences.billing.alertThreshold - 10) / 40 * 100}%, #e5e7eb 100%)`
                            }}
                          />
                        </div>
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>10%</span>
                          <span>20%</span>
                          <span>30%</span>
                          <span>50%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Payment Methods */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                    <div className="p-6 border-b border-gray-200">
                      <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                        <Wallet className="h-5 w-5 mr-2 text-gray-700" />
                        Payment Methods
                      </h2>
                      <p className="text-sm text-gray-600 mt-1">Manage your payment methods and billing information</p>
                    </div>
                    <div className="p-6">
                      <div className="space-y-4">
                        <div className="p-4 border border-gray-200 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="w-12 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded flex items-center justify-center">
                                <span className="text-white text-xs font-bold">VISA</span>
                              </div>
                              <div className="ml-3">
                                <p className="text-sm font-medium text-gray-900">•••• •••• •••• 4242</p>
                                <p className="text-xs text-gray-500">Expires 12/25</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded">Default</span>
                              <button className="text-sm text-gray-600 hover:text-gray-900">Edit</button>
                            </div>
                          </div>
                        </div>
                        
                        <button className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors">
                          <div className="flex items-center justify-center">
                            <Plus className="h-5 w-5 text-gray-400 mr-2" />
                            <span className="text-sm text-gray-600">Add Payment Method</span>
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Integrations Tab */}
              {activeTab === 'integrations' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                    <div className="p-6 border-b border-gray-200">
                      <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                        <Globe className="h-5 w-5 mr-2 text-gray-700" />
                        Integrations
                      </h2>
                      <p className="text-sm text-gray-600 mt-1">Connect and manage your external services</p>
                    </div>
                    <div className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg flex items-center justify-center">
                                <span className="text-white text-lg font-bold">IG</span>
                              </div>
                              <div className="ml-3">
                                <h3 className="font-medium text-gray-900">Instagram</h3>
                                <p className="text-sm text-gray-500">Connected</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                              <button className="text-sm text-red-600 hover:text-red-700">Disconnect</button>
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                                <span className="text-white text-lg font-bold">FB</span>
                              </div>
                              <div className="ml-3">
                                <h3 className="font-medium text-gray-900">Facebook</h3>
                                <p className="text-sm text-gray-500">Not connected</p>
                              </div>
                            </div>
                            <button className="text-sm text-blue-600 hover:text-blue-700">Connect</button>
                          </div>
                        </div>
                        
                        <div className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="w-12 h-12 bg-gradient-to-r from-sky-400 to-blue-500 rounded-lg flex items-center justify-center">
                                <span className="text-white text-lg font-bold">TW</span>
                              </div>
                              <div className="ml-3">
                                <h3 className="font-medium text-gray-900">Twitter</h3>
                                <p className="text-sm text-gray-500">Not connected</p>
                              </div>
                            </div>
                            <button className="text-sm text-blue-600 hover:text-blue-700">Connect</button>
                          </div>
                        </div>
                        
                        <div className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                                <span className="text-white text-lg font-bold">LI</span>
                              </div>
                              <div className="ml-3">
                                <h3 className="font-medium text-gray-900">LinkedIn</h3>
                                <p className="text-sm text-gray-500">Not connected</p>
                              </div>
                            </div>
                            <button className="text-sm text-blue-600 hover:text-blue-700">Connect</button>
                          </div>
                        </div>
                        
                        <div className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-lg flex items-center justify-center">
                                <span className="text-white text-lg font-bold">YT</span>
                              </div>
                              <div className="ml-3">
                                <h3 className="font-medium text-gray-900">YouTube</h3>
                                <p className="text-sm text-gray-500">Connected</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                              <button className="text-sm text-red-600 hover:text-red-700">Disconnect</button>
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center">
                                <span className="text-white text-lg font-bold">ZP</span>
                              </div>
                              <div className="ml-3">
                                <h3 className="font-medium text-gray-900">Zapier</h3>
                                <p className="text-sm text-gray-500">Not connected</p>
                              </div>
                            </div>
                            <button className="text-sm text-blue-600 hover:text-blue-700">Connect</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Accessibility Tab */}
              {activeTab === 'accessibility' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                    <div className="p-6 border-b border-gray-200">
                      <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                        <Accessibility className="h-5 w-5 mr-2 text-gray-700" />
                        Accessibility Options
                      </h2>
                      <p className="text-sm text-gray-600 mt-1">Customize accessibility features for better usability</p>
                    </div>
                    <div className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-lg">
                          <div>
                            <h3 className="font-medium text-blue-900">High Contrast</h3>
                            <p className="text-sm text-blue-600">Increase contrast for better visibility</p>
                          </div>
                          <div className="relative">
                            <input
                              type="checkbox"
                              checked={preferences.accessibility.highContrast}
                              onChange={(e) => setPreferences(prev => ({
                                ...prev,
                                accessibility: { ...prev.accessibility, highContrast: e.target.checked }
                              }))}
                              className="sr-only"
                            />
                            <div 
                              className={`w-11 h-6 rounded-full cursor-pointer transition-colors ${
                                preferences.accessibility.highContrast ? 'bg-gradient-to-r from-blue-500 to-cyan-500' : 'bg-gray-200'
                              }`}
                              onClick={() => setPreferences(prev => ({
                                ...prev,
                                accessibility: { ...prev.accessibility, highContrast: !prev.accessibility.highContrast }
                              }))}
                            >
                              <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                                preferences.accessibility.highContrast ? 'translate-x-5' : 'translate-x-0.5'
                              } mt-0.5`}></div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg">
                          <div>
                            <h3 className="font-medium text-green-900">Reduced Motion</h3>
                            <p className="text-sm text-green-600">Minimize animations and transitions</p>
                          </div>
                          <div className="relative">
                            <input
                              type="checkbox"
                              checked={preferences.accessibility.reducedMotion}
                              onChange={(e) => setPreferences(prev => ({
                                ...prev,
                                accessibility: { ...prev.accessibility, reducedMotion: e.target.checked }
                              }))}
                              className="sr-only"
                            />
                            <div 
                              className={`w-11 h-6 rounded-full cursor-pointer transition-colors ${
                                preferences.accessibility.reducedMotion ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gray-200'
                              }`}
                              onClick={() => setPreferences(prev => ({
                                ...prev,
                                accessibility: { ...prev.accessibility, reducedMotion: !prev.accessibility.reducedMotion }
                              }))}
                            >
                              <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                                preferences.accessibility.reducedMotion ? 'translate-x-5' : 'translate-x-0.5'
                              } mt-0.5`}></div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg">
                          <div>
                            <h3 className="font-medium text-purple-900">Large Text</h3>
                            <p className="text-sm text-purple-600">Increase text size for readability</p>
                          </div>
                          <div className="relative">
                            <input
                              type="checkbox"
                              checked={preferences.accessibility.largeText}
                              onChange={(e) => setPreferences(prev => ({
                                ...prev,
                                accessibility: { ...prev.accessibility, largeText: e.target.checked }
                              }))}
                              className="sr-only"
                            />
                            <div 
                              className={`w-11 h-6 rounded-full cursor-pointer transition-colors ${
                                preferences.accessibility.largeText ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-gray-200'
                              }`}
                              onClick={() => setPreferences(prev => ({
                                ...prev,
                                accessibility: { ...prev.accessibility, largeText: !prev.accessibility.largeText }
                              }))}
                            >
                              <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                                preferences.accessibility.largeText ? 'translate-x-5' : 'translate-x-0.5'
                              } mt-0.5`}></div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-lg">
                          <div>
                            <h3 className="font-medium text-orange-900">Keyboard Navigation</h3>
                            <p className="text-sm text-orange-600">Enhanced keyboard shortcuts</p>
                          </div>
                          <div className="relative">
                            <input
                              type="checkbox"
                              checked={preferences.accessibility.keyboardNavigation}
                              onChange={(e) => setPreferences(prev => ({
                                ...prev,
                                accessibility: { ...prev.accessibility, keyboardNavigation: e.target.checked }
                              }))}
                              className="sr-only"
                            />
                            <div 
                              className={`w-11 h-6 rounded-full cursor-pointer transition-colors ${
                                preferences.accessibility.keyboardNavigation ? 'bg-gradient-to-r from-orange-500 to-red-500' : 'bg-gray-200'
                              }`}
                              onClick={() => setPreferences(prev => ({
                                ...prev,
                                accessibility: { ...prev.accessibility, keyboardNavigation: !prev.accessibility.keyboardNavigation }
                              }))}
                            >
                              <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                                preferences.accessibility.keyboardNavigation ? 'translate-x-5' : 'translate-x-0.5'
                              } mt-0.5`}></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Developer Tools Tab */}
              {activeTab === 'developer' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                    <div className="p-6 border-b border-gray-200">
                      <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                        <Code className="h-5 w-5 mr-2 text-gray-700" />
                        Developer Tools
                      </h2>
                      <p className="text-sm text-gray-600 mt-1">Advanced settings for developers and power users</p>
                    </div>
                    <div className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-gray-50 border border-slate-200 rounded-lg">
                          <div>
                            <h3 className="font-medium text-slate-900">Debug Mode</h3>
                            <p className="text-sm text-slate-600">Enable detailed logging</p>
                          </div>
                          <div className="relative">
                            <input
                              type="checkbox"
                              checked={preferences.developer.debugMode}
                              onChange={(e) => setPreferences(prev => ({
                                ...prev,
                                developer: { ...prev.developer, debugMode: e.target.checked }
                              }))}
                              className="sr-only"
                            />
                            <div 
                              className={`w-11 h-6 rounded-full cursor-pointer transition-colors ${
                                preferences.developer.debugMode ? 'bg-gradient-to-r from-slate-500 to-gray-500' : 'bg-gray-200'
                              }`}
                              onClick={() => setPreferences(prev => ({
                                ...prev,
                                developer: { ...prev.developer, debugMode: !prev.developer.debugMode }
                              }))}
                            >
                              <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                                preferences.developer.debugMode ? 'translate-x-5' : 'translate-x-0.5'
                              } mt-0.5`}></div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
                          <div>
                            <h3 className="font-medium text-blue-900">API Access</h3>
                            <p className="text-sm text-blue-600">Enable API endpoints</p>
                          </div>
                          <div className="relative">
                            <input
                              type="checkbox"
                              checked={preferences.developer.apiAccess}
                              onChange={(e) => setPreferences(prev => ({
                                ...prev,
                                developer: { ...prev.developer, apiAccess: e.target.checked }
                              }))}
                              className="sr-only"
                            />
                            <div 
                              className={`w-11 h-6 rounded-full cursor-pointer transition-colors ${
                                preferences.developer.apiAccess ? 'bg-gradient-to-r from-blue-500 to-indigo-500' : 'bg-gray-200'
                              }`}
                              onClick={() => setPreferences(prev => ({
                                ...prev,
                                developer: { ...prev.developer, apiAccess: !prev.developer.apiAccess }
                              }))}
                            >
                              <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                                preferences.developer.apiAccess ? 'translate-x-5' : 'translate-x-0.5'
                              } mt-0.5`}></div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg">
                          <div>
                            <h3 className="font-medium text-green-900">Beta Features</h3>
                            <p className="text-sm text-green-600">Access experimental features</p>
                          </div>
                          <div className="relative">
                            <input
                              type="checkbox"
                              checked={preferences.developer.betaFeatures}
                              onChange={(e) => setPreferences(prev => ({
                                ...prev,
                                developer: { ...prev.developer, betaFeatures: e.target.checked }
                              }))}
                              className="sr-only"
                            />
                            <div 
                              className={`w-11 h-6 rounded-full cursor-pointer transition-colors ${
                                preferences.developer.betaFeatures ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gray-200'
                              }`}
                              onClick={() => setPreferences(prev => ({
                                ...prev,
                                developer: { ...prev.developer, betaFeatures: !prev.developer.betaFeatures }
                              }))}
                            >
                              <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                                preferences.developer.betaFeatures ? 'translate-x-5' : 'translate-x-0.5'
                              } mt-0.5`}></div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg">
                          <div>
                            <h3 className="font-medium text-purple-900">Advanced Metrics</h3>
                            <p className="text-sm text-purple-600">Detailed performance data</p>
                          </div>
                          <div className="relative">
                            <input
                              type="checkbox"
                              checked={preferences.developer.advancedMetrics}
                              onChange={(e) => setPreferences(prev => ({
                                ...prev,
                                developer: { ...prev.developer, advancedMetrics: e.target.checked }
                              }))}
                              className="sr-only"
                            />
                            <div 
                              className={`w-11 h-6 rounded-full cursor-pointer transition-colors ${
                                preferences.developer.advancedMetrics ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-gray-200'
                              }`}
                              onClick={() => setPreferences(prev => ({
                                ...prev,
                                developer: { ...prev.developer, advancedMetrics: !prev.developer.advancedMetrics }
                              }))}
                            >
                              <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                                preferences.developer.advancedMetrics ? 'translate-x-5' : 'translate-x-0.5'
                              } mt-0.5`}></div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-6 space-y-4">
                        <div className="space-y-3">
                          <label className="text-sm font-medium text-gray-700">API Key</label>
                          <div className="flex">
                            <input
                              type="password"
                              value={preferences.developer.apiKey}
                              onChange={(e) => setPreferences(prev => ({
                                ...prev,
                                developer: { ...prev.developer, apiKey: e.target.value }
                              }))}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                              style={{ backgroundColor: '#ffffff !important', color: '#000000 !important' }}
                              placeholder="Enter your API key"
                            />
                            <button className="px-4 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-lg hover:bg-gray-200 transition-colors">
                              <Eye className="h-4 w-4 text-gray-600" />
                            </button>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <label className="text-sm font-medium text-gray-700">Webhook URL</label>
                          <input
                            type="url"
                            value={preferences.developer.webhookUrl}
                            onChange={(e) => setPreferences(prev => ({
                              ...prev,
                              developer: { ...prev.developer, webhookUrl: e.target.value }
                            }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                            style={{ backgroundColor: '#ffffff !important', color: '#000000 !important' }}
                            placeholder="https://your-webhook-url.com/endpoint"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Save Button */}
              <div className="flex justify-end">
                <button
                  onClick={handleSaveChanges}
                  disabled={!hasChanges || isLoading}
                  className={`px-6 py-3 rounded-lg font-medium transition-all ${
                    hasChanges && !isLoading
                      ? 'bg-gray-900 text-white hover:bg-gray-800 shadow-lg'
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnterpriseSettings;
