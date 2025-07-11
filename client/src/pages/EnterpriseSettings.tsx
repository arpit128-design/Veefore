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
                <div className="p-2 bg-gray-900 rounded-lg">
                  <SettingsIcon className="h-5 w-5 text-white" />
                </div>
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
              
              {/* Save Button */}
              <button
                onClick={handleSaveChanges}
                disabled={!hasChanges}
                className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 save-button"
                style={{ 
                  backgroundColor: hasChanges ? '#111827 !important' : '#9ca3af !important',
                  color: '#ffffff !important'
                }}
              >
                <Save className="h-4 w-4" style={{ color: '#ffffff !important' }} />
                <span style={{ color: '#ffffff !important' }}>Save Changes</span>
              </button>
              
              {/* Sign Out */}
              <button
                onClick={handleLogout}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center space-x-2"
                style={{ backgroundColor: '#ffffff !important', color: '#374151 !important' }}
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
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
                    <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-white" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{profile.displayName || 'User'}</h3>
                    <p className="text-sm text-gray-600">Free Plan</p>
                  </div>
                </div>
                
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Storage Used</span>
                    <span className="font-medium text-gray-900">2.3 GB / 10 GB</span>
                  </div>
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gray-900 h-2 rounded-full" 
                      style={{ width: '23%', backgroundColor: '#111827 !important' }}
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
                        ? 'bg-gray-900 text-white' 
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                    style={activeTab === item.id 
                      ? { backgroundColor: '#dbeafe !important', color: '#1e40af !important', fontWeight: '600' }
                      : { backgroundColor: 'transparent !important', color: '#374151 !important' }
                    }
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
                          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                            <div>
                              <h3 className="font-medium text-gray-900">AI Assistant</h3>
                              <p className="text-sm text-gray-600">Enable AI-powered features</p>
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
                                  preferences.ai.enabled ? 'bg-gray-900' : 'bg-gray-200'
                                }`}
                                style={{ backgroundColor: preferences.ai.enabled ? '#111827 !important' : '#e5e7eb !important' }}
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
                          
                          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                            <div>
                              <h3 className="font-medium text-gray-900">Smart Suggestions</h3>
                              <p className="text-sm text-gray-600">AI-powered recommendations</p>
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
                                  preferences.ai.suggestions ? 'bg-gray-900' : 'bg-gray-200'
                                }`}
                                style={{ backgroundColor: preferences.ai.suggestions ? '#111827 !important' : '#e5e7eb !important' }}
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
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <label className="text-sm font-medium text-gray-700">Creativity Level</label>
                            <span className="text-sm font-medium text-gray-900 px-2 py-1 bg-gray-100 rounded">
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
                                background: `linear-gradient(to right, #111827 0%, #111827 ${preferences.ai.creativity}%, #e5e7eb ${preferences.ai.creativity}%, #e5e7eb 100%)`
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
                          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                            <div>
                              <h3 className="font-medium text-gray-900">Two-Factor Authentication</h3>
                              <p className="text-sm text-gray-600">Add extra security to your account</p>
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
                                  preferences.security.twoFactorEnabled ? 'bg-gray-900' : 'bg-gray-200'
                                }`}
                                style={{ backgroundColor: preferences.security.twoFactorEnabled ? '#111827 !important' : '#e5e7eb !important' }}
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
                          
                          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                            <div>
                              <h3 className="font-medium text-gray-900">Login Alerts</h3>
                              <p className="text-sm text-gray-600">Get notified of new logins</p>
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
                                  preferences.security.loginAlerts ? 'bg-gray-900' : 'bg-gray-200'
                                }`}
                                style={{ backgroundColor: preferences.security.loginAlerts ? '#111827 !important' : '#e5e7eb !important' }}
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
                        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                          <div>
                            <h3 className="font-medium text-gray-900">Email Notifications</h3>
                            <p className="text-sm text-gray-600">Receive updates via email</p>
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
                                preferences.notifications.email.enabled ? 'bg-gray-900' : 'bg-gray-200'
                              }`}
                              style={{ backgroundColor: preferences.notifications.email.enabled ? '#111827 !important' : '#e5e7eb !important' }}
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
                        
                        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                          <div>
                            <h3 className="font-medium text-gray-900">Push Notifications</h3>
                            <p className="text-sm text-gray-600">Receive browser notifications</p>
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
                                preferences.notifications.push.enabled ? 'bg-gray-900' : 'bg-gray-200'
                              }`}
                              style={{ backgroundColor: preferences.notifications.push.enabled ? '#111827 !important' : '#e5e7eb !important' }}
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
      <style jsx={true} global={true}>{`
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
        
        /* Navigation tab active state - Light Blue */
        .w-full.flex.items-center.justify-between[data-active="true"] {
          background-color: #dbeafe !important;
          color: #1e40af !important;
          font-weight: 600 !important;
        }
        
        .w-full.flex.items-center.justify-between[data-active="true"] * {
          color: #1e40af !important;
        }
        
        /* Save button specific override */
        .save-button {
          background-color: #111827 !important;
          color: #ffffff !important;
        }
        
        .save-button * {
          color: #ffffff !important;
        }
        
        .save-button:disabled {
          background-color: #9ca3af !important;
          color: #ffffff !important;
        }
      `}</style>
    </div>
  );
};

export default EnterpriseSettings;