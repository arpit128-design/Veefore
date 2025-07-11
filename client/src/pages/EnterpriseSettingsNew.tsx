import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { useAuth } from '@/hooks/useAuth';
import { 
  User, Shield, Bell, Palette, Bot, CreditCard, 
  Link, Settings, Eye, Code, Search, Save,
  Globe, Smartphone, Users, Zap, Lock, 
  BarChart3, Database, Cloud, Cpu, Monitor
} from 'lucide-react';

interface UserProfile {
  displayName: string;
  email: string;
  jobTitle: string;
  company: string;
  department: string;
  bio: string;
  phone: string;
  location: string;
  website: string;
  timezone: string;
  avatar: string;
}

interface SecuritySettings {
  twoFactorAuth: boolean;
  loginAlerts: boolean;
  deviceTracking: boolean;
  sessionTimeout: number;
  dataEncryption: boolean;
  privacyMode: boolean;
  auditLogs: boolean;
  securityNotifications: boolean;
  biometricAuth: boolean;
  passwordExpiry: number;
}

interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsAlerts: boolean;
  inAppNotifications: boolean;
  socialMediaAlerts: boolean;
  weeklyReports: boolean;
  monthlyReports: boolean;
  securityAlerts: boolean;
  systemUpdates: boolean;
  marketingEmails: boolean;
}

interface WorkspaceSettings {
  theme: string;
  language: string;
  timezone: string;
  displayDensity: string;
  sidebarCollapsed: boolean;
  autoSave: boolean;
  gridView: boolean;
  showTips: boolean;
  customColors: boolean;
  collaborationMode: boolean;
}

interface AIAssistantSettings {
  personality: string;
  creativityLevel: number;
  responseSpeed: string;
  autoSuggestions: boolean;
  learningEnabled: boolean;
  voiceEnabled: boolean;
  proactiveHelp: boolean;
  contextAware: boolean;
  betaFeatures: boolean;
  customPrompts: boolean;
}

interface BillingSettings {
  autoRenewal: boolean;
  invoiceEmail: string;
  paymentMethod: string;
  billingCycle: string;
  usageAlerts: boolean;
  spendingLimit: number;
  taxExempt: boolean;
  budgetAlerts: boolean;
  startupCredits: boolean;
  referralCredits: boolean;
}

interface IntegrationSettings {
  instagram: boolean;
  facebook: boolean;
  twitter: boolean;
  linkedin: boolean;
  youtube: boolean;
  tiktok: boolean;
  pinterest: boolean;
  snapchat: boolean;
  zapier: boolean;
  webhooks: boolean;
}

interface AccessibilitySettings {
  highContrast: boolean;
  reducedMotion: boolean;
  largeText: boolean;
  keyboardNav: boolean;
  screenReader: boolean;
  colorBlind: boolean;
  voiceControl: boolean;
  autoTranscript: boolean;
  subtitles: boolean;
  magnification: boolean;
}

interface DeveloperSettings {
  debugMode: boolean;
  apiKey: string;
  webhookUrl: string;
  betaFeatures: boolean;
  advancedMetrics: boolean;
  verboseLogging: boolean;
  performanceProfile: boolean;
  errorReporting: boolean;
  usageAnalytics: boolean;
  testingEnvironment: string;
  advancedAnalytics: {
    realTimeMetrics: boolean;
    customDashboards: boolean;
    predictiveAnalytics: boolean;
    businessIntelligence: boolean;
    dataVisualization: boolean;
    reportAutomation: boolean;
    exportOptions: string[];
    scheduledReports: boolean;
    alertThresholds: boolean;
    performanceTracking: boolean;
  };
  enterpriseSecurity: {
    advancedThreatProtection: boolean;
    zeroTrustArchitecture: boolean;
    endpointSecurity: boolean;
    networkMonitoring: boolean;
    vulnerabilityScanning: boolean;
    penetrationTesting: boolean;
    securityAudits: boolean;
    complianceReporting: boolean;
    dataLineage: boolean;
    privacyControls: boolean;
  };
  integrationSuite: {
    restApiAccess: boolean;
    graphqlSupport: boolean;
    webhookManagement: boolean;
    realTimeSync: boolean;
    batchProcessing: boolean;
    customConnectors: boolean;
    enterpriseSSO: boolean;
    ldapIntegration: boolean;
    samlSupport: boolean;
    oauthProviders: string[];
  };
  performanceSettings: {
    cacheOptimization: boolean;
    compressionEnabled: boolean;
    cdnAcceleration: boolean;
    loadBalancing: boolean;
    autoScaling: boolean;
    performanceMonitoring: boolean;
    resourceOptimization: boolean;
    memoryManagement: boolean;
    cpuOptimization: boolean;
    networkOptimization: boolean;
  };
  qualityAssurance: {
    automatedTesting: boolean;
    codeQuality: boolean;
    staticAnalysis: boolean;
    securityScanning: boolean;
    performanceTesting: boolean;
    crossBrowserTesting: boolean;
    mobileTesting: boolean;
    accessibilityTesting: boolean;
    usabilityTesting: boolean;
    regressionTesting: boolean;
  };
  collaboration: {
    teamWorkspaces: boolean;
    projectManagement: boolean;
    taskTracking: boolean;
    documentSharing: boolean;
    versionControl: boolean;
    commentSystem: boolean;
    approvalWorkflows: boolean;
    notificationCenter: boolean;
    activityFeed: boolean;
    teamChat: boolean;
  };
}

interface SettingsState {
  profile: UserProfile;
  security: SecuritySettings;
  notifications: NotificationSettings;
  workspace: WorkspaceSettings;
  aiAssistant: AIAssistantSettings;
  billing: BillingSettings;
  integrations: IntegrationSettings;
  accessibility: AccessibilitySettings;
  developer: DeveloperSettings;
}

export default function EnterpriseSettings() {
  const { user, logout } = useAuth();
  const [activeSection, setActiveSection] = useState('profile');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [userData, setUserData] = useState(user);

  // Initialize settings state with comprehensive default values
  const [settings, setSettings] = useState<SettingsState>({
    profile: {
      displayName: '',
      email: '',
      jobTitle: '',
      company: '',
      department: '',
      bio: '',
      phone: '',
      location: '',
      website: '',
      timezone: 'UTC',
      avatar: ''
    },
    security: {
      twoFactorAuth: false,
      loginAlerts: true,
      deviceTracking: true,
      sessionTimeout: 30,
      dataEncryption: true,
      privacyMode: false,
      auditLogs: true,
      securityNotifications: true,
      biometricAuth: false,
      passwordExpiry: 90
    },
    notifications: {
      emailNotifications: true,
      pushNotifications: true,
      smsAlerts: false,
      inAppNotifications: true,
      socialMediaAlerts: true,
      weeklyReports: true,
      monthlyReports: false,
      securityAlerts: true,
      systemUpdates: true,
      marketingEmails: false
    },
    workspace: {
      theme: 'light',
      language: 'en',
      timezone: 'UTC',
      displayDensity: 'comfortable',
      sidebarCollapsed: false,
      autoSave: true,
      gridView: false,
      showTips: true,
      customColors: false,
      collaborationMode: true
    },
    aiAssistant: {
      personality: 'professional',
      creativityLevel: 7,
      responseSpeed: 'balanced',
      autoSuggestions: true,
      learningEnabled: true,
      voiceEnabled: false,
      proactiveHelp: true,
      contextAware: true,
      betaFeatures: false,
      customPrompts: false
    },
    billing: {
      autoRenewal: true,
      invoiceEmail: '',
      paymentMethod: 'credit_card',
      billingCycle: 'monthly',
      usageAlerts: true,
      spendingLimit: 1000,
      taxExempt: false,
      budgetAlerts: true,
      startupCredits: false,
      referralCredits: true
    },
    integrations: {
      instagram: false,
      facebook: false,
      twitter: false,
      linkedin: false,
      youtube: false,
      tiktok: false,
      pinterest: false,
      snapchat: false,
      zapier: false,
      webhooks: false
    },
    accessibility: {
      highContrast: false,
      reducedMotion: false,
      largeText: false,
      keyboardNav: true,
      screenReader: false,
      colorBlind: false,
      voiceControl: false,
      autoTranscript: false,
      subtitles: false,
      magnification: false
    },
    developer: {
      debugMode: false,
      apiKey: '',
      webhookUrl: '',
      betaFeatures: false,
      advancedMetrics: false,
      verboseLogging: false,
      performanceProfile: false,
      errorReporting: true,
      usageAnalytics: true,
      testingEnvironment: 'production',
      advancedAnalytics: {
        realTimeMetrics: false,
        customDashboards: false,
        predictiveAnalytics: false,
        businessIntelligence: false,
        dataVisualization: false,
        reportAutomation: false,
        exportOptions: ['json', 'csv', 'pdf', 'excel'],
        scheduledReports: false,
        alertThresholds: false,
        performanceTracking: false
      },
      enterpriseSecurity: {
        advancedThreatProtection: false,
        zeroTrustArchitecture: false,
        endpointSecurity: false,
        networkMonitoring: false,
        vulnerabilityScanning: false,
        penetrationTesting: false,
        securityAudits: false,
        complianceReporting: false,
        dataLineage: false,
        privacyControls: false
      },
      integrationSuite: {
        restApiAccess: true,
        graphqlSupport: false,
        webhookManagement: true,
        realTimeSync: false,
        batchProcessing: false,
        customConnectors: false,
        enterpriseSSO: false,
        ldapIntegration: false,
        samlSupport: false,
        oauthProviders: ['google', 'microsoft', 'github']
      },
      performanceSettings: {
        cacheOptimization: true,
        compressionEnabled: true,
        cdnAcceleration: false,
        loadBalancing: false,
        autoScaling: false,
        performanceMonitoring: true,
        resourceOptimization: false,
        memoryManagement: false,
        cpuOptimization: false,
        networkOptimization: false
      },
      qualityAssurance: {
        automatedTesting: false,
        codeQuality: false,
        staticAnalysis: false,
        securityScanning: false,
        performanceTesting: false,
        crossBrowserTesting: false,
        mobileTesting: false,
        accessibilityTesting: false,
        usabilityTesting: false,
        regressionTesting: false
      },
      collaboration: {
        teamWorkspaces: false,
        projectManagement: false,
        taskTracking: false,
        documentSharing: false,
        versionControl: true,
        commentSystem: false,
        approvalWorkflows: false,
        notificationCenter: false,
        activityFeed: false,
        teamChat: false
      }
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

  // Set user data from auth context
  useEffect(() => {
    console.log('Setting user data from auth context:', user);
    if (user) {
      setUserData(user);
      
      // Update profile with real user data
      setSettings(prev => ({
        ...prev,
        profile: {
          ...prev.profile,
          displayName: user.displayName || user.username || '',
          email: user.email || '',
        },
        billing: {
          ...prev.billing,
          invoiceEmail: user.email || '',
        }
      }));
    }
  }, [user]);

  // Settings sections configuration
  const sections = [
    { id: 'profile', label: 'Profile & Account', icon: User },
    { id: 'security', label: 'Security & Privacy', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'workspace', label: 'Workspace', icon: Palette },
    { id: 'aiAssistant', label: 'AI Assistant', icon: Bot },
    { id: 'billing', label: 'Billing & Usage', icon: CreditCard },
    { id: 'integrations', label: 'Integrations', icon: Link },
    { id: 'accessibility', label: 'Accessibility', icon: Eye },
    { id: 'developer', label: 'Developer Tools', icon: Code },
  ];

  // Filter sections based on search
  const filteredSections = sections.filter(section =>
    section.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderProfileSection = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="displayName">Display Name</Label>
            <Input
              id="displayName"
              value={settings.profile.displayName}
              onChange={(e) => {
                setSettings(prev => ({
                  ...prev,
                  profile: { ...prev.profile, displayName: e.target.value }
                }));
                setHasChanges(true);
              }}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={settings.profile.email}
              onChange={(e) => {
                setSettings(prev => ({
                  ...prev,
                  profile: { ...prev.profile, email: e.target.value }
                }));
                setHasChanges(true);
              }}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="jobTitle">Job Title</Label>
            <Input
              id="jobTitle"
              value={settings.profile.jobTitle}
              onChange={(e) => {
                setSettings(prev => ({
                  ...prev,
                  profile: { ...prev.profile, jobTitle: e.target.value }
                }));
                setHasChanges(true);
              }}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="company">Company</Label>
            <Input
              id="company"
              value={settings.profile.company}
              onChange={(e) => {
                setSettings(prev => ({
                  ...prev,
                  profile: { ...prev.profile, company: e.target.value }
                }));
                setHasChanges(true);
              }}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="department">Department</Label>
            <Input
              id="department"
              value={settings.profile.department}
              onChange={(e) => {
                setSettings(prev => ({
                  ...prev,
                  profile: { ...prev.profile, department: e.target.value }
                }));
                setHasChanges(true);
              }}
              className="mt-1"
            />
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              value={settings.profile.phone}
              onChange={(e) => {
                setSettings(prev => ({
                  ...prev,
                  profile: { ...prev.profile, phone: e.target.value }
                }));
                setHasChanges(true);
              }}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={settings.profile.location}
              onChange={(e) => {
                setSettings(prev => ({
                  ...prev,
                  profile: { ...prev.profile, location: e.target.value }
                }));
                setHasChanges(true);
              }}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              value={settings.profile.website}
              onChange={(e) => {
                setSettings(prev => ({
                  ...prev,
                  profile: { ...prev.profile, website: e.target.value }
                }));
                setHasChanges(true);
              }}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="timezone">Timezone</Label>
            <Select 
              value={settings.profile.timezone} 
              onValueChange={(value) => {
                setSettings(prev => ({
                  ...prev,
                  profile: { ...prev.profile, timezone: value }
                }));
                setHasChanges(true);
              }}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="UTC">UTC</SelectItem>
                <SelectItem value="America/New_York">Eastern Time</SelectItem>
                <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                <SelectItem value="Europe/London">London</SelectItem>
                <SelectItem value="Asia/Tokyo">Tokyo</SelectItem>
                <SelectItem value="Asia/Kolkata">India Standard Time</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="bio">Bio</Label>
            <textarea
              id="bio"
              rows={4}
              value={settings.profile.bio}
              onChange={(e) => {
                setSettings(prev => ({
                  ...prev,
                  profile: { ...prev.profile, bio: e.target.value }
                }));
                setHasChanges(true);
              }}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Tell us about yourself..."
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderCurrentSection = () => {
    switch (activeSection) {
      case 'profile':
        return renderProfileSection();
      default:
        return (
          <div className="text-center py-12">
            <Code className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">Section Under Development</h3>
            <p className="mt-2 text-gray-600">This settings section is being enhanced with more features.</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Enterprise Settings</h1>
            <p className="text-gray-600">Manage your account and application preferences</p>
          </div>
          <Button 
            onClick={handleSaveChanges}
            disabled={!hasChanges || isLoading}
            className="bg-gray-900 hover:bg-gray-800 text-white"
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving...
              </div>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-72 bg-white border-r border-gray-200 h-screen sticky top-0">
          <div className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search settings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <nav className="px-6">
            <div className="space-y-1">
              {filteredSections.map((section) => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center px-3 py-2 text-left rounded-lg transition-colors ${
                      activeSection === section.id
                        ? 'bg-gray-900 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {section.label}
                  </button>
                );
              })}
            </div>
          </nav>

          {/* User Info */}
          {userData && (
            <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {userData.displayName?.[0] || userData.username?.[0] || userData.email?.[0] || 'U'}
                    </span>
                  </div>
                </div>
                <div className="ml-3 flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {userData.displayName || userData.username || 'User'}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{userData.email}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="ml-2"
                >
                  Sign out
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                {sections.find(s => s.id === activeSection)?.icon && (
                  React.createElement(sections.find(s => s.id === activeSection)!.icon, {
                    className: "w-6 h-6 mr-2"
                  })
                )}
                {sections.find(s => s.id === activeSection)?.label}
              </CardTitle>
              <CardDescription>
                Configure your {sections.find(s => s.id === activeSection)?.label.toLowerCase()} settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              {renderCurrentSection()}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}