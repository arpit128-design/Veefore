import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { useAuth } from "@/hooks/useAuth";
import { logout } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Brain, 
  Cog, 
  Save, 
  Edit,
  Camera,
  Mail,
  Phone,
  MapPin,
  Globe,
  Calendar,
  Lock,
  Key,
  Smartphone,
  Monitor,
  Moon,
  Sun,
  Download,
  Upload,
  Trash2,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Crown,
  TrendingUp,
  Share2,
  Heart,
  Target,
  Building,
  Sparkles,
  Cpu,
  Activity,
  BarChart3,
  FileText,
  Archive,
  Clock,
  Timer,
  Database,
  Gauge,
  Volume2,
  Grid,
  HardDrive,
  LogOut,
  Info,
  X,
  Check,
  Plus,
  Zap,
  Rocket,
  Users,
  CreditCard,
  Eye,
  EyeOff,
  Wifi,
  WifiOff,
  Link,
  Unlink,
  Search,
  Filter,
  Copy,
  ExternalLink,
  Languages,
  Accessibility,
  MousePointer,
  Keyboard,
  Headphones,
  Mic,
  Video,
  Image,
  FileVideo,
  Folder,
  Cloud,
  Server,
  Terminal,
  Code,
  GitBranch,
  Package,
  Layers
} from "lucide-react";
import { Link as RouterLink } from "wouter";

export default function Settings() {
  // Add CSS to completely eliminate yellow colors and ensure black text
  const settingsStyles = `
    /* Force all text to be black and override any yellow backgrounds */
    .settings-page *, 
    .settings-page h1, 
    .settings-page h2, 
    .settings-page h3, 
    .settings-page h4, 
    .settings-page h5, 
    .settings-page h6,
    .settings-page p,
    .settings-page span,
    .settings-page label,
    .settings-page div {
      color: #000000 !important;
    }
    
    /* Override all switch/toggle backgrounds and states */
    .settings-page [role="switch"],
    .settings-page button[role="switch"],
    .settings-page .toggle-switch {
      background-color: #e5e7eb !important;
      border-color: #d1d5db !important;
    }
    
    .settings-page [role="switch"][data-state="checked"],
    .settings-page button[role="switch"][data-state="checked"],
    .settings-page .toggle-switch[data-state="checked"] {
      background-color: #111827 !important;
      border-color: #111827 !important;
    }
    
    .settings-page [role="switch"] span,
    .settings-page button[role="switch"] span {
      background-color: #ffffff !important;
    }
    
    /* Override all slider backgrounds and handles */
    .settings-page [role="slider"],
    .settings-page .slider-track,
    .settings-page [data-radix-slider-track],
    .settings-page [class*="slider"] {
      background-color: #e5e7eb !important;
    }
    
    .settings-page [role="slider"] [data-orientation="horizontal"],
    .settings-page .slider-range,
    .settings-page [data-radix-slider-range],
    .settings-page [class*="slider-range"] {
      background-color: #111827 !important;
    }
    
    .settings-page [role="slider"] [data-orientation="horizontal"] > span,
    .settings-page .slider-thumb,
    .settings-page [data-radix-slider-thumb],
    .settings-page [class*="slider-thumb"] {
      background-color: #111827 !important;
      border-color: #111827 !important;
    }
    
    /* Target specific slider color sections */
    .settings-page [role="slider"] > span:last-child,
    .settings-page [data-radix-slider-track] > span:last-child {
      background-color: #e5e7eb !important;
    }
    
    /* Force all slider components to use gray colors */
    .settings-page [role="slider"] * {
      background-color: #e5e7eb !important;
    }
    
    .settings-page [role="slider"] [style*="background"] {
      background-color: #e5e7eb !important;
    }
    
    /* Ultimate slider yellow elimination - target any yellow values */
    .settings-page * {
      background-image: none !important;
    }
    
    .settings-page [role="slider"] {
      background: linear-gradient(to right, #111827 0%, #111827 70%, #e5e7eb 70%, #e5e7eb 100%) !important;
    }
    
    /* Override all button backgrounds */
    .settings-page button:not(.save-button) {
      background-color: #ffffff !important;
      color: #000000 !important;
      border-color: #d1d5db !important;
    }
    
    .settings-page button:not(.save-button):hover {
      background-color: #f3f4f6 !important;
      color: #000000 !important;
    }
    
    /* Override input field backgrounds */
    .settings-page input[type="text"],
    .settings-page input[type="email"],
    .settings-page input[type="password"],
    .settings-page input[type="number"],
    .settings-page input {
      background-color: #ffffff !important;
      color: #000000 !important;
      border-color: #d1d5db !important;
    }
    
    .settings-page input:focus {
      border-color: #6b7280 !important;
      box-shadow: 0 0 0 1px #6b7280 !important;
      background-color: #ffffff !important;
      color: #000000 !important;
    }
    
    /* Override textarea backgrounds */
    .settings-page textarea {
      background-color: #ffffff !important;
      color: #000000 !important;
      border-color: #d1d5db !important;
    }
    
    .settings-page textarea:focus {
      border-color: #6b7280 !important;
      box-shadow: 0 0 0 1px #6b7280 !important;
      background-color: #ffffff !important;
      color: #000000 !important;
    }
    
    /* Override select backgrounds */
    .settings-page select,
    .settings-page [role="combobox"] {
      background-color: #ffffff !important;
      color: #000000 !important;
      border-color: #d1d5db !important;
    }
    
    /* Override progress bar backgrounds */
    .settings-page [role="progressbar"],
    .settings-page .progress-bar {
      background-color: #e5e7eb !important;
    }
    
    .settings-page [role="progressbar"] > div,
    .settings-page .progress-bar-fill {
      background-color: #111827 !important;
    }
    
    /* Override badge backgrounds */
    .settings-page .badge,
    .settings-page [class*="badge"] {
      background-color: #f3f4f6 !important;
      color: #000000 !important;
      border-color: #d1d5db !important;
    }
    
    /* Override any remaining yellow/amber elements */
    .settings-page *[style*="yellow"],
    .settings-page *[style*="amber"],
    .settings-page *[class*="yellow"],
    .settings-page *[class*="amber"],
    .settings-page *[class*="bg-yellow"],
    .settings-page *[class*="bg-amber"] {
      background-color: #e5e7eb !important;
      color: #000000 !important;
    }
    
    /* Specific targeting for gradient colors and RGB values that might be yellow */
    .settings-page *[style*="rgb(255, 255, 0)"],
    .settings-page *[style*="rgb(255, 247, 0)"],
    .settings-page *[style*="#ffff00"],
    .settings-page *[style*="#fbbf24"],
    .settings-page *[style*="#f59e0b"],
    .settings-page *[style*="hsl(45"],
    .settings-page *[style*="hsl(50"],
    .settings-page *[style*="hsl(55"],
    .settings-page *[style*="hsl(60"] {
      background-color: #e5e7eb !important;
      color: #000000 !important;
    }
    
    /* Target all possible slider color variations */
    .settings-page [role="slider"] > span[style*="background"],
    .settings-page [role="slider"] span[style*="background"],
    .settings-page [role="slider"] div[style*="background"] {
      background-color: #e5e7eb !important;
    }
    
    .settings-page [role="slider"] > span:first-child {
      background-color: #111827 !important;
    }
    
    /* Target specific Radix UI components */
    .settings-page [data-radix-collection-item],
    .settings-page [data-state],
    .settings-page [data-orientation] {
      color: #000000 !important;
    }
    
    /* Save button specific styling */
    .settings-page .save-button {
      background-color: #1f2937 !important;
      color: #ffffff !important;
      border-color: #1f2937 !important;
      border: 1px solid #1f2937 !important;
      font-weight: 500 !important;
      padding: 12px 24px !important;
      border-radius: 8px !important;
      box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05) !important;
    }
    
    .settings-page .save-button:hover {
      background-color: #111827 !important;
      color: #ffffff !important;
      border-color: #111827 !important;
      box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1) !important;
    }
    
    .settings-page .save-button:active {
      background-color: #0f172a !important;
      color: #ffffff !important;
      border-color: #0f172a !important;
    }
    
    /* Eliminate any focus rings with yellow */
    .settings-page *:focus {
      outline: 2px solid #6b7280 !important;
      outline-offset: 2px !important;
    }
    
    /* Force all card backgrounds to white */
    .settings-page .card,
    .settings-page [class*="card"] {
      background-color: #ffffff !important;
      border-color: #e5e7eb !important;
    }
  `;
  
  // Inject styles
  if (typeof document !== 'undefined') {
    const styleElement = document.createElement('style');
    styleElement.textContent = settingsStyles;
    if (!document.head.querySelector('[data-settings-styles]')) {
      styleElement.setAttribute('data-settings-styles', 'true');
      document.head.appendChild(styleElement);
    }
  }
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("account");
  const [isEditing, setIsEditing] = useState(false);

  // Enhanced profile state
  const [profileData, setProfileData] = useState({
    displayName: user?.displayName || '',
    username: user?.username || '',
    email: user?.email || '',
    bio: '',
    location: '',
    website: '',
    phone: '',
    jobTitle: '',
    company: '',
    department: '',
    timezone: 'UTC',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12h',
    language: 'en',
    profileVisibility: 'public'
  });

  // Enhanced preferences state
  const [preferences, setPreferences] = useState({
    general: {
      theme: 'light',
      language: 'en',
      timezone: 'UTC',
      dateFormat: 'MM/DD/YYYY',
      numberFormat: 'US',
      currency: 'USD'
    },
    notifications: {
      email: {
        marketing: false,
        security: true,
        updates: true,
        digest: true,
        mentions: true,
        comments: true
      },
      push: {
        enabled: true,
        marketing: false,
        security: true,
        updates: false,
        sound: true,
        vibration: true
      },
      sms: {
        enabled: false,
        security: true,
        emergency: true
      },
      desktop: {
        enabled: true,
        position: 'top-right',
        duration: 5000
      }
    },
    privacy: {
      profileVisibility: 'public',
      activityStatus: true,
      onlineStatus: false,
      dataCollection: true,
      analytics: true,
      thirdPartyIntegrations: false,
      searchEngineIndexing: true
    },
    security: {
      twoFactor: false,
      sessionTimeout: 30,
      loginAlerts: true,
      deviceTracking: true,
      ipWhitelist: false,
      apiAccess: false,
      downloadSessions: true
    },
    workspace: {
      defaultView: 'grid',
      itemsPerPage: 20,
      autoSave: true,
      autoSync: true,
      collaborativeEditing: true,
      versionHistory: true,
      backup: true,
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
    },
    integrations: {
      googleWorkspace: false,
      microsoftOffice: false,
      slack: false,
      zapier: false,
      webhooks: false
    },
    billing: {
      autoRenew: true,
      invoiceEmail: true,
      usageAlerts: true,
      budgetLimit: 0
    }
  });

  const handleSaveProfile = () => {
    toast({
      title: "Settings Updated",
      description: "Your settings have been saved successfully.",
    });
    setIsEditing(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
    } catch (error) {
      toast({
        title: "Logout Failed",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="settings-page min-h-screen bg-gray-50" style={{ backgroundColor: '#f9fafb' }}>
      {/* Professional Header */}
      <div className="bg-white border-b border-gray-200" style={{ backgroundColor: '#ffffff', borderColor: '#e5e7eb' }}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gray-900 rounded-lg" style={{ backgroundColor: '#111827' }}>
                  <SettingsIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-semibold text-black" style={{ color: '#000000 !important' }}>Settings</h1>
                  <p className="text-gray-700 text-sm" style={{ color: '#000000 !important' }}>Manage your account and application preferences</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm" className="text-gray-700 border-gray-300 hover:bg-gray-100" style={{ color: '#374151', borderColor: '#d1d5db', backgroundColor: '#ffffff' }}>
                <Search className="h-4 w-4 mr-2" />
                Search Settings
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout} className="text-red-600 border-red-300 hover:bg-red-50" style={{ color: '#dc2626', borderColor: '#fca5a5', backgroundColor: '#ffffff' }}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex gap-6">
          {/* Sidebar Navigation */}
          <div className="w-64 shrink-0">
            <div className="bg-white rounded-lg border border-gray-200 p-4" style={{ backgroundColor: '#ffffff', borderColor: '#e5e7eb' }}>
              <nav className="space-y-1">
                <button
                  onClick={() => setActiveTab("account")}
                  className={`w-full flex items-center px-3 py-2 text-left text-sm font-medium rounded-md transition-colors`}
                  style={activeTab === "account" 
                    ? { backgroundColor: '#111827', color: '#ffffff' }
                    : { color: '#000000', backgroundColor: 'transparent' }
                  }
                  onMouseEnter={(e) => {
                    if (activeTab !== "account") {
                      e.currentTarget.style.backgroundColor = '#f3f4f6';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (activeTab !== "account") {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  <User className="h-4 w-4 mr-3" />
                  Account & Profile
                </button>
                <button
                  onClick={() => setActiveTab("security")}
                  className={`w-full flex items-center px-3 py-2 text-left text-sm font-medium rounded-md transition-colors`}
                  style={activeTab === "security" 
                    ? { backgroundColor: '#111827', color: '#ffffff' }
                    : { color: '#000000', backgroundColor: 'transparent' }
                  }
                  onMouseEnter={(e) => {
                    if (activeTab !== "security") {
                      e.currentTarget.style.backgroundColor = '#f3f4f6';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (activeTab !== "security") {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  <Shield className="h-4 w-4 mr-3" />
                  Security & Privacy
                </button>
                <button
                  onClick={() => setActiveTab("notifications")}
                  className={`w-full flex items-center px-3 py-2 text-left text-sm font-medium rounded-md transition-colors`}
                  style={activeTab === "notifications" 
                    ? { backgroundColor: '#111827', color: '#ffffff' }
                    : { color: '#000000', backgroundColor: 'transparent' }
                  }
                  onMouseEnter={(e) => {
                    if (activeTab !== "notifications") {
                      e.currentTarget.style.backgroundColor = '#f3f4f6';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (activeTab !== "notifications") {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  <Bell className="h-4 w-4 mr-3" />
                  Notifications
                </button>
                <button
                  onClick={() => setActiveTab("workspace")}
                  className={`w-full flex items-center px-3 py-2 text-left text-sm font-medium rounded-md transition-colors`}
                  style={activeTab === "workspace" 
                    ? { backgroundColor: '#111827', color: '#ffffff' }
                    : { color: '#000000', backgroundColor: 'transparent' }
                  }
                  onMouseEnter={(e) => {
                    if (activeTab !== "workspace") {
                      e.currentTarget.style.backgroundColor = '#f3f4f6';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (activeTab !== "workspace") {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  <Building className="h-4 w-4 mr-3" />
                  Workspace
                </button>
                <button
                  onClick={() => setActiveTab("ai")}
                  className={`w-full flex items-center px-3 py-2 text-left text-sm font-medium rounded-md transition-colors`}
                  style={activeTab === "ai" 
                    ? { backgroundColor: '#111827', color: '#ffffff' }
                    : { color: '#000000', backgroundColor: 'transparent' }
                  }
                  onMouseEnter={(e) => {
                    if (activeTab !== "ai") {
                      e.currentTarget.style.backgroundColor = '#f3f4f6';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (activeTab !== "ai") {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  <Brain className="h-4 w-4 mr-3" />
                  AI Assistant
                </button>
                <button
                  onClick={() => setActiveTab("billing")}
                  className={`w-full flex items-center px-3 py-2 text-left text-sm font-medium rounded-md transition-colors`}
                  style={activeTab === "billing" 
                    ? { backgroundColor: '#111827', color: '#ffffff' }
                    : { color: '#000000', backgroundColor: 'transparent' }
                  }
                  onMouseEnter={(e) => {
                    if (activeTab !== "billing") {
                      e.currentTarget.style.backgroundColor = '#f3f4f6';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (activeTab !== "billing") {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  <CreditCard className="h-4 w-4 mr-3" />
                  Billing & Usage
                </button>
                <button
                  onClick={() => setActiveTab("integrations")}
                  className={`w-full flex items-center px-3 py-2 text-left text-sm font-medium rounded-md transition-colors`}
                  style={activeTab === "integrations" 
                    ? { backgroundColor: '#111827', color: '#ffffff' }
                    : { color: '#000000', backgroundColor: 'transparent' }
                  }
                  onMouseEnter={(e) => {
                    if (activeTab !== "integrations") {
                      e.currentTarget.style.backgroundColor = '#f3f4f6';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (activeTab !== "integrations") {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  <Link className="h-4 w-4 mr-3" />
                  Integrations
                </button>
                <button
                  onClick={() => setActiveTab("accessibility")}
                  className={`w-full flex items-center px-3 py-2 text-left text-sm font-medium rounded-md transition-colors`}
                  style={activeTab === "accessibility" 
                    ? { backgroundColor: '#111827', color: '#ffffff' }
                    : { color: '#000000', backgroundColor: 'transparent' }
                  }
                  onMouseEnter={(e) => {
                    if (activeTab !== "accessibility") {
                      e.currentTarget.style.backgroundColor = '#f3f4f6';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (activeTab !== "accessibility") {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  <Accessibility className="h-4 w-4 mr-3" />
                  Accessibility
                </button>
                <button
                  onClick={() => setActiveTab("developer")}
                  className={`w-full flex items-center px-3 py-2 text-left text-sm font-medium rounded-md transition-colors`}
                  style={activeTab === "developer" 
                    ? { backgroundColor: '#111827', color: '#ffffff' }
                    : { color: '#000000', backgroundColor: 'transparent' }
                  }
                  onMouseEnter={(e) => {
                    if (activeTab !== "developer") {
                      e.currentTarget.style.backgroundColor = '#f3f4f6';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (activeTab !== "developer") {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  <Code className="h-4 w-4 mr-3" />
                  Developer Tools
                </button>
              </nav>

              {/* Quick Stats */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">Account Status</div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Plan</span>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      {user?.plan?.toUpperCase() || 'FREE'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Credits</span>
                    <span className="text-sm font-medium text-gray-900">{user?.credits || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Storage</span>
                    <span className="text-sm font-medium text-gray-900">2.4 GB</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 space-y-6">
            {/* Account & Profile Tab */}
            {activeTab === "account" && (
              <div className="space-y-6">
                {/* Profile Header */}
                <Card className="bg-white border border-gray-200">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-6">
                      <div className="relative">
                        <Avatar className="h-20 w-20 border-2 border-gray-200">
                          <AvatarImage src={user?.avatar || ""} alt={user?.username || ""} />
                          <AvatarFallback className="bg-gray-900 text-white text-xl font-semibold">
                            {user?.username?.charAt(0).toUpperCase() || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <Button size="sm" className="absolute -bottom-1 -right-1 h-8 w-8 p-0 bg-gray-900 hover:bg-gray-800">
                          <Camera className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{user?.displayName || user?.username}</h3>
                            <p className="text-gray-600">@{user?.username}</p>
                            <p className="text-gray-500 text-sm mt-1">{profileData.jobTitle || "No title set"} • {profileData.company || "No company"}</p>
                          </div>
                          <Button
                            variant="outline"
                            onClick={() => setIsEditing(!isEditing)}
                            className="border-gray-300"
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            {isEditing ? 'Cancel' : 'Edit Profile'}
                          </Button>
                        </div>
                        <div className="flex items-center space-x-4 mt-4">
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Verified
                          </Badge>
                          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                            <Crown className="h-3 w-3 mr-1" />
                            {user?.plan?.toUpperCase() || 'FREE'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Personal Information */}
                <Card className="bg-white border border-gray-200">
                  <CardHeader className="border-b border-gray-200">
                    <CardTitle className="flex items-center text-lg">
                      <User className="h-5 w-5 mr-2 text-gray-700" />
                      Personal Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="display-name" className="text-sm font-medium text-black" style={{ color: '#000000' }}>Display Name</Label>
                        <Input
                          id="display-name"
                          value={profileData.displayName}
                          onChange={(e) => setProfileData(prev => ({ ...prev, displayName: e.target.value }))}
                          disabled={!isEditing}
                          className="mt-1 border-gray-300 focus:border-gray-500 focus:ring-gray-500"
                          style={{ backgroundColor: '#ffffff', color: '#000000', borderColor: '#d1d5db' }}
                        />
                      </div>
                      <div>
                        <Label htmlFor="username" className="text-sm font-medium text-gray-700">Username</Label>
                        <Input
                          id="username"
                          value={profileData.username}
                          onChange={(e) => setProfileData(prev => ({ ...prev, username: e.target.value }))}
                          disabled={!isEditing}
                          className="mt-1 border-gray-300 focus:border-gray-500 focus:ring-gray-500"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          value={profileData.email}
                          onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                          disabled={!isEditing}
                          className="mt-1 border-gray-300 focus:border-gray-500 focus:ring-gray-500"
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone" className="text-sm font-medium text-gray-700">Phone Number</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={profileData.phone}
                          onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                          disabled={!isEditing}
                          className="mt-1 border-gray-300 focus:border-gray-500 focus:ring-gray-500"
                        />
                      </div>
                      <div>
                        <Label htmlFor="job-title" className="text-sm font-medium text-gray-700">Job Title</Label>
                        <Input
                          id="job-title"
                          value={profileData.jobTitle}
                          onChange={(e) => setProfileData(prev => ({ ...prev, jobTitle: e.target.value }))}
                          disabled={!isEditing}
                          className="mt-1 border-gray-300 focus:border-gray-500 focus:ring-gray-500"
                        />
                      </div>
                      <div>
                        <Label htmlFor="company" className="text-sm font-medium text-gray-700">Company</Label>
                        <Input
                          id="company"
                          value={profileData.company}
                          onChange={(e) => setProfileData(prev => ({ ...prev, company: e.target.value }))}
                          disabled={!isEditing}
                          className="mt-1 border-gray-300 focus:border-gray-500 focus:ring-gray-500"
                        />
                      </div>
                      <div>
                        <Label htmlFor="location" className="text-sm font-medium text-gray-700">Location</Label>
                        <Input
                          id="location"
                          value={profileData.location}
                          onChange={(e) => setProfileData(prev => ({ ...prev, location: e.target.value }))}
                          disabled={!isEditing}
                          className="mt-1 border-gray-300 focus:border-gray-500 focus:ring-gray-500"
                        />
                      </div>
                      <div>
                        <Label htmlFor="website" className="text-sm font-medium text-gray-700">Website</Label>
                        <Input
                          id="website"
                          type="url"
                          value={profileData.website}
                          onChange={(e) => setProfileData(prev => ({ ...prev, website: e.target.value }))}
                          disabled={!isEditing}
                          className="mt-1 border-gray-300 focus:border-gray-500 focus:ring-gray-500"
                        />
                      </div>
                    </div>
                    <div className="mt-6">
                      <Label htmlFor="bio" className="text-sm font-medium text-gray-700">Bio</Label>
                      <Textarea
                        id="bio"
                        value={profileData.bio}
                        onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                        disabled={!isEditing}
                        rows={3}
                        className="mt-1 border-gray-300 focus:border-gray-500 focus:ring-gray-500"
                        placeholder="Tell us about yourself..."
                      />
                    </div>

                    {isEditing && (
                      <div className="flex items-center space-x-4 mt-6 pt-6 border-t border-gray-200">
                        <Button onClick={handleSaveProfile} className="bg-gray-900 hover:bg-gray-800">
                          <Save className="h-4 w-4 mr-2" />
                          Save Changes
                        </Button>
                        <Button variant="outline" onClick={() => setIsEditing(false)}>
                          Cancel
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Regional Settings */}
                <Card className="bg-white border border-gray-200">
                  <CardHeader className="border-b border-gray-200">
                    <CardTitle className="flex items-center text-lg">
                      <Globe className="h-5 w-5 mr-2 text-gray-700" />
                      Regional & Language Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Timezone</Label>
                        <Select value={preferences.general.timezone} onValueChange={(value) => 
                          setPreferences(prev => ({ ...prev, general: { ...prev.general, timezone: value } }))
                        }>
                          <SelectTrigger className="mt-1 border-gray-300">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="UTC">UTC</SelectItem>
                            <SelectItem value="America/New_York">Eastern Time</SelectItem>
                            <SelectItem value="America/Chicago">Central Time</SelectItem>
                            <SelectItem value="America/Denver">Mountain Time</SelectItem>
                            <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                            <SelectItem value="Europe/London">London</SelectItem>
                            <SelectItem value="Europe/Paris">Paris</SelectItem>
                            <SelectItem value="Asia/Tokyo">Tokyo</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Date Format</Label>
                        <Select value={preferences.general.dateFormat} onValueChange={(value) => 
                          setPreferences(prev => ({ ...prev, general: { ...prev.general, dateFormat: value } }))
                        }>
                          <SelectTrigger className="mt-1 border-gray-300">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                            <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                            <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Language</Label>
                        <Select value={preferences.general.language} onValueChange={(value) => 
                          setPreferences(prev => ({ ...prev, general: { ...prev.general, language: value } }))
                        }>
                          <SelectTrigger className="mt-1 border-gray-300">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="es">Español</SelectItem>
                            <SelectItem value="fr">Français</SelectItem>
                            <SelectItem value="de">Deutsch</SelectItem>
                            <SelectItem value="ja">日本語</SelectItem>
                            <SelectItem value="zh">中文</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Security & Privacy Tab */}
            {activeTab === "security" && (
              <div className="space-y-6">
                {/* Security Settings */}
                <Card className="bg-white border border-gray-200">
                  <CardHeader className="border-b border-gray-200">
                    <CardTitle className="flex items-center text-lg">
                      <Shield className="h-5 w-5 mr-2 text-gray-700" />
                      Security Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-6">
                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div>
                          <div className="font-medium text-gray-900">Two-Factor Authentication</div>
                          <div className="text-sm text-gray-600">Add an extra layer of security to your account</div>
                        </div>
                        <Switch 
                          checked={preferences.security.twoFactor}
                          onCheckedChange={(checked) => 
                            setPreferences(prev => ({
                              ...prev,
                              security: { ...prev.security, twoFactor: checked }
                            }))
                          }
                        />
                      </div>
                      
                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div>
                          <div className="font-medium text-gray-900">Login Alerts</div>
                          <div className="text-sm text-gray-600">Get notified of new login attempts</div>
                        </div>
                        <Switch 
                          checked={preferences.security.loginAlerts}
                          onCheckedChange={(checked) => 
                            setPreferences(prev => ({
                              ...prev,
                              security: { ...prev.security, loginAlerts: checked }
                            }))
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div>
                          <div className="font-medium text-gray-900">Device Tracking</div>
                          <div className="text-sm text-gray-600">Monitor devices that access your account</div>
                        </div>
                        <Switch 
                          checked={preferences.security.deviceTracking}
                          onCheckedChange={(checked) => 
                            setPreferences(prev => ({
                              ...prev,
                              security: { ...prev.security, deviceTracking: checked }
                            }))
                          }
                        />
                      </div>

                      <div>
                        <Label className="text-sm font-medium text-gray-700">Session Timeout</Label>
                        <Select 
                          value={preferences.security.sessionTimeout.toString()} 
                          onValueChange={(value) => 
                            setPreferences(prev => ({
                              ...prev,
                              security: { ...prev.security, sessionTimeout: parseInt(value) }
                            }))
                          }
                        >
                          <SelectTrigger className="mt-1 border-gray-300">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="15">15 minutes</SelectItem>
                            <SelectItem value="30">30 minutes</SelectItem>
                            <SelectItem value="60">1 hour</SelectItem>
                            <SelectItem value="240">4 hours</SelectItem>
                            <SelectItem value="720">12 hours</SelectItem>
                            <SelectItem value="1440">24 hours</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Button variant="outline" className="border-gray-300">
                          <Key className="h-4 w-4 mr-2" />
                          Change Password
                        </Button>
                        <Button variant="outline" className="border-gray-300">
                          <Smartphone className="h-4 w-4 mr-2" />
                          Manage Devices
                        </Button>
                        <Button variant="outline" className="border-gray-300">
                          <Download className="h-4 w-4 mr-2" />
                          Download Data
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Privacy Settings */}
                <Card className="bg-white border border-gray-200">
                  <CardHeader className="border-b border-gray-200">
                    <CardTitle className="flex items-center text-lg">
                      <Eye className="h-5 w-5 mr-2 text-gray-700" />
                      Privacy Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-6">
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Profile Visibility</Label>
                        <Select 
                          value={preferences.privacy.profileVisibility} 
                          onValueChange={(value) => 
                            setPreferences(prev => ({
                              ...prev,
                              privacy: { ...prev.privacy, profileVisibility: value }
                            }))
                          }
                        >
                          <SelectTrigger className="mt-1 border-gray-300">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="public">Public</SelectItem>
                            <SelectItem value="private">Private</SelectItem>
                            <SelectItem value="team">Team Only</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div>
                          <div className="font-medium text-gray-900">Activity Status</div>
                          <div className="text-sm text-gray-600">Show when you're active on the platform</div>
                        </div>
                        <Switch 
                          checked={preferences.privacy.activityStatus}
                          onCheckedChange={(checked) => 
                            setPreferences(prev => ({
                              ...prev,
                              privacy: { ...prev.privacy, activityStatus: checked }
                            }))
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div>
                          <div className="font-medium text-gray-900">Data Collection</div>
                          <div className="text-sm text-gray-600">Allow usage analytics to improve the service</div>
                        </div>
                        <Switch 
                          checked={preferences.privacy.dataCollection}
                          onCheckedChange={(checked) => 
                            setPreferences(prev => ({
                              ...prev,
                              privacy: { ...prev.privacy, dataCollection: checked }
                            }))
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div>
                          <div className="font-medium text-gray-900">Third-party Integrations</div>
                          <div className="text-sm text-gray-600">Allow third-party apps to access your data</div>
                        </div>
                        <Switch 
                          checked={preferences.privacy.thirdPartyIntegrations}
                          onCheckedChange={(checked) => 
                            setPreferences(prev => ({
                              ...prev,
                              privacy: { ...prev.privacy, thirdPartyIntegrations: checked }
                            }))
                          }
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === "notifications" && (
              <div className="space-y-6">
                {/* Email Notifications */}
                <Card className="bg-white border border-gray-200">
                  <CardHeader className="border-b border-gray-200">
                    <CardTitle className="flex items-center text-lg">
                      <Mail className="h-5 w-5 mr-2 text-gray-700" />
                      Email Notifications
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div>
                          <div className="font-medium text-gray-900">Security Alerts</div>
                          <div className="text-sm text-gray-600">Login attempts, password changes, and security updates</div>
                        </div>
                        <Switch 
                          checked={preferences.notifications.email.security}
                          onCheckedChange={(checked) => 
                            setPreferences(prev => ({
                              ...prev,
                              notifications: { 
                                ...prev.notifications, 
                                email: { ...prev.notifications.email, security: checked }
                              }
                            }))
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div>
                          <div className="font-medium text-gray-900">Product Updates</div>
                          <div className="text-sm text-gray-600">New features, improvements, and announcements</div>
                        </div>
                        <Switch 
                          checked={preferences.notifications.email.updates}
                          onCheckedChange={(checked) => 
                            setPreferences(prev => ({
                              ...prev,
                              notifications: { 
                                ...prev.notifications, 
                                email: { ...prev.notifications.email, updates: checked }
                              }
                            }))
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div>
                          <div className="font-medium text-gray-900">Weekly Digest</div>
                          <div className="text-sm text-gray-600">Summary of your activity and insights</div>
                        </div>
                        <Switch 
                          checked={preferences.notifications.email.digest}
                          onCheckedChange={(checked) => 
                            setPreferences(prev => ({
                              ...prev,
                              notifications: { 
                                ...prev.notifications, 
                                email: { ...prev.notifications.email, digest: checked }
                              }
                            }))
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div>
                          <div className="font-medium text-gray-900">Marketing Communications</div>
                          <div className="text-sm text-gray-600">Tips, best practices, and promotional offers</div>
                        </div>
                        <Switch 
                          checked={preferences.notifications.email.marketing}
                          onCheckedChange={(checked) => 
                            setPreferences(prev => ({
                              ...prev,
                              notifications: { 
                                ...prev.notifications, 
                                email: { ...prev.notifications.email, marketing: checked }
                              }
                            }))
                          }
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Push Notifications */}
                <Card className="bg-white border border-gray-200">
                  <CardHeader className="border-b border-gray-200">
                    <CardTitle className="flex items-center text-lg">
                      <Smartphone className="h-5 w-5 mr-2 text-gray-700" />
                      Push Notifications
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div>
                          <div className="font-medium text-gray-900">Enable Push Notifications</div>
                          <div className="text-sm text-gray-600">Receive notifications on your devices</div>
                        </div>
                        <Switch 
                          checked={preferences.notifications.push.enabled}
                          onCheckedChange={(checked) => 
                            setPreferences(prev => ({
                              ...prev,
                              notifications: { 
                                ...prev.notifications, 
                                push: { ...prev.notifications.push, enabled: checked }
                              }
                            }))
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div>
                          <div className="font-medium text-gray-900">Security Alerts</div>
                          <div className="text-sm text-gray-600">Important security notifications</div>
                        </div>
                        <Switch 
                          checked={preferences.notifications.push.security}
                          onCheckedChange={(checked) => 
                            setPreferences(prev => ({
                              ...prev,
                              notifications: { 
                                ...prev.notifications, 
                                push: { ...prev.notifications.push, security: checked }
                              }
                            }))
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div>
                          <div className="font-medium text-gray-900">Sound</div>
                          <div className="text-sm text-gray-600">Play sound for notifications</div>
                        </div>
                        <Switch 
                          checked={preferences.notifications.push.sound}
                          onCheckedChange={(checked) => 
                            setPreferences(prev => ({
                              ...prev,
                              notifications: { 
                                ...prev.notifications, 
                                push: { ...prev.notifications.push, sound: checked }
                              }
                            }))
                          }
                        />
                      </div>

                      <div>
                        <Label className="text-sm font-medium text-gray-700">Notification Position</Label>
                        <Select 
                          value={preferences.notifications.desktop.position} 
                          onValueChange={(value) => 
                            setPreferences(prev => ({
                              ...prev,
                              notifications: { 
                                ...prev.notifications, 
                                desktop: { ...prev.notifications.desktop, position: value }
                              }
                            }))
                          }
                        >
                          <SelectTrigger className="mt-1 border-gray-300">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="top-right">Top Right</SelectItem>
                            <SelectItem value="top-left">Top Left</SelectItem>
                            <SelectItem value="bottom-right">Bottom Right</SelectItem>
                            <SelectItem value="bottom-left">Bottom Left</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Workspace Tab */}
            {activeTab === "workspace" && (
              <div className="space-y-6">
                {/* Workspace Preferences */}
                <Card className="bg-white border border-gray-200">
                  <CardHeader className="border-b border-gray-200">
                    <CardTitle className="flex items-center text-lg">
                      <Building className="h-5 w-5 mr-2 text-gray-700" />
                      Workspace Preferences
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Default View</Label>
                        <Select 
                          value={preferences.workspace.defaultView} 
                          onValueChange={(value) => 
                            setPreferences(prev => ({
                              ...prev,
                              workspace: { ...prev.workspace, defaultView: value }
                            }))
                          }
                        >
                          <SelectTrigger className="mt-1 border-gray-300">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="grid">Grid View</SelectItem>
                            <SelectItem value="list">List View</SelectItem>
                            <SelectItem value="kanban">Kanban Board</SelectItem>
                            <SelectItem value="timeline">Timeline View</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label className="text-sm font-medium text-gray-700">Items Per Page</Label>
                        <Select 
                          value={preferences.workspace.itemsPerPage.toString()} 
                          onValueChange={(value) => 
                            setPreferences(prev => ({
                              ...prev,
                              workspace: { ...prev.workspace, itemsPerPage: parseInt(value) }
                            }))
                          }
                        >
                          <SelectTrigger className="mt-1 border-gray-300">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="10">10 items</SelectItem>
                            <SelectItem value="20">20 items</SelectItem>
                            <SelectItem value="50">50 items</SelectItem>
                            <SelectItem value="100">100 items</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="mt-6 space-y-4">
                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div>
                          <div className="font-medium text-gray-900">Auto-save</div>
                          <div className="text-sm text-gray-600">Automatically save changes as you work</div>
                        </div>
                        <Switch 
                          checked={preferences.workspace.autoSave}
                          onCheckedChange={(checked) => 
                            setPreferences(prev => ({
                              ...prev,
                              workspace: { ...prev.workspace, autoSave: checked }
                            }))
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div>
                          <div className="font-medium text-gray-900">Cloud Sync</div>
                          <div className="text-sm text-gray-600">Sync your work across all devices</div>
                        </div>
                        <Switch 
                          checked={preferences.workspace.cloudSync}
                          onCheckedChange={(checked) => 
                            setPreferences(prev => ({
                              ...prev,
                              workspace: { ...prev.workspace, cloudSync: checked }
                            }))
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div>
                          <div className="font-medium text-gray-900">Collaborative Editing</div>
                          <div className="text-sm text-gray-600">Allow real-time collaboration on shared content</div>
                        </div>
                        <Switch 
                          checked={preferences.workspace.collaborativeEditing}
                          onCheckedChange={(checked) => 
                            setPreferences(prev => ({
                              ...prev,
                              workspace: { ...prev.workspace, collaborativeEditing: checked }
                            }))
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div>
                          <div className="font-medium text-gray-900">Version History</div>
                          <div className="text-sm text-gray-600">Keep track of changes and enable rollback</div>
                        </div>
                        <Switch 
                          checked={preferences.workspace.versionHistory}
                          onCheckedChange={(checked) => 
                            setPreferences(prev => ({
                              ...prev,
                              workspace: { ...prev.workspace, versionHistory: checked }
                            }))
                          }
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Theme Settings */}
                <Card className="bg-white border border-gray-200">
                  <CardHeader className="border-b border-gray-200">
                    <CardTitle className="flex items-center text-lg">
                      <Palette className="h-5 w-5 mr-2 text-gray-700" />
                      Appearance & Theme
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-6">
                      <div>
                        <Label className="text-sm font-medium text-gray-700 mb-3 block">Theme</Label>
                        <div className="grid grid-cols-3 gap-4">
                          <button
                            onClick={() => setPreferences(prev => ({ ...prev, general: { ...prev.general, theme: 'light' } }))}
                            className={`p-4 border rounded-lg flex flex-col items-center space-y-2 transition-colors ${
                              preferences.general.theme === 'light' 
                                ? 'border-gray-900 bg-gray-50' 
                                : 'border-gray-300 hover:border-gray-400'
                            }`}
                          >
                            <Sun className="h-6 w-6 text-gray-600" />
                            <span className="text-sm font-medium">Light</span>
                          </button>
                          <button
                            onClick={() => setPreferences(prev => ({ ...prev, general: { ...prev.general, theme: 'dark' } }))}
                            className={`p-4 border rounded-lg flex flex-col items-center space-y-2 transition-colors ${
                              preferences.general.theme === 'dark' 
                                ? 'border-gray-900 bg-gray-50' 
                                : 'border-gray-300 hover:border-gray-400'
                            }`}
                          >
                            <Moon className="h-6 w-6 text-gray-600" />
                            <span className="text-sm font-medium">Dark</span>
                          </button>
                          <button
                            onClick={() => setPreferences(prev => ({ ...prev, general: { ...prev.general, theme: 'auto' } }))}
                            className={`p-4 border rounded-lg flex flex-col items-center space-y-2 transition-colors ${
                              preferences.general.theme === 'auto' 
                                ? 'border-gray-900 bg-gray-50' 
                                : 'border-gray-300 hover:border-gray-400'
                            }`}
                          >
                            <Monitor className="h-6 w-6 text-gray-600" />
                            <span className="text-sm font-medium">Auto</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* AI Assistant Tab */}
            {activeTab === "ai" && (
              <div className="space-y-6">
                <Card className="bg-white border border-gray-200">
                  <CardHeader className="border-b border-gray-200">
                    <CardTitle className="flex items-center text-lg">
                      <Brain className="h-5 w-5 mr-2 text-gray-700" />
                      AI Assistant Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-6">
                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div>
                          <div className="font-medium text-gray-900">AI Assistant</div>
                          <div className="text-sm text-gray-600">Enable AI-powered features and suggestions</div>
                        </div>
                        <Switch 
                          checked={preferences.ai.enabled}
                          onCheckedChange={(checked) => 
                            setPreferences(prev => ({
                              ...prev,
                              ai: { ...prev.ai, enabled: checked }
                            }))
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div>
                          <div className="font-medium text-gray-900">Smart Suggestions</div>
                          <div className="text-sm text-gray-600">Get AI-powered content and workflow suggestions</div>
                        </div>
                        <Switch 
                          checked={preferences.ai.suggestions}
                          onCheckedChange={(checked) => 
                            setPreferences(prev => ({
                              ...prev,
                              ai: { ...prev.ai, suggestions: checked }
                            }))
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div>
                          <div className="font-medium text-gray-900">Auto-complete</div>
                          <div className="text-sm text-gray-600">AI-powered text completion while typing</div>
                        </div>
                        <Switch 
                          checked={preferences.ai.autoComplete}
                          onCheckedChange={(checked) => 
                            setPreferences(prev => ({
                              ...prev,
                              ai: { ...prev.ai, autoComplete: checked }
                            }))
                          }
                        />
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label className="text-sm font-medium text-gray-700">Creativity Level</Label>
                          <span className="text-sm font-medium text-gray-900 px-2 py-1 bg-gray-100 rounded">
                            {preferences.ai.creativity}%
                          </span>
                        </div>
                        <Slider
                          value={[preferences.ai.creativity]}
                          onValueChange={(value) => 
                            setPreferences(prev => ({
                              ...prev,
                              ai: { ...prev.ai, creativity: value[0] }
                            }))
                          }
                          max={100}
                          step={1}
                          className="w-full"
                        />
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>Conservative</span>
                          <span>Balanced</span>
                          <span>Creative</span>
                        </div>
                      </div>

                      <div>
                        <Label className="text-sm font-medium text-gray-700">Response Speed</Label>
                        <Select 
                          value={preferences.ai.responseSpeed} 
                          onValueChange={(value) => 
                            setPreferences(prev => ({
                              ...prev,
                              ai: { ...prev.ai, responseSpeed: value }
                            }))
                          }
                        >
                          <SelectTrigger className="mt-1 border-gray-300">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="fast">Fast & Simple</SelectItem>
                            <SelectItem value="balanced">Balanced</SelectItem>
                            <SelectItem value="detailed">Detailed & Thorough</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div>
                          <div className="font-medium text-gray-900">Personalized Recommendations</div>
                          <div className="text-sm text-gray-600">Use your data to improve AI suggestions</div>
                        </div>
                        <Switch 
                          checked={preferences.ai.personalizedRecommendations}
                          onCheckedChange={(checked) => 
                            setPreferences(prev => ({
                              ...prev,
                              ai: { ...prev.ai, personalizedRecommendations: checked }
                            }))
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div>
                          <div className="font-medium text-gray-900">Beta Features</div>
                          <div className="text-sm text-gray-600">Access experimental AI features</div>
                        </div>
                        <Switch 
                          checked={preferences.ai.betaFeatures}
                          onCheckedChange={(checked) => 
                            setPreferences(prev => ({
                              ...prev,
                              ai: { ...prev.ai, betaFeatures: checked }
                            }))
                          }
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Billing & Usage Tab */}
            {activeTab === "billing" && (
              <div className="space-y-6">
                {/* Current Plan */}
                <Card className="bg-white border border-gray-200">
                  <CardHeader className="border-b border-gray-200">
                    <CardTitle className="flex items-center text-lg">
                      <Crown className="h-5 w-5 mr-2 text-gray-700" />
                      Current Plan
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{user?.plan?.toUpperCase() || 'FREE'} Plan</h3>
                        <p className="text-gray-600">Your current subscription plan</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900">$0<span className="text-lg text-gray-600">/month</span></div>
                        <RouterLink href="/billing">
                          <Button className="mt-2 bg-gray-900 hover:bg-gray-800">
                            <Crown className="h-4 w-4 mr-2" />
                            Upgrade Plan
                          </Button>
                        </RouterLink>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Usage Statistics */}
                <Card className="bg-white border border-gray-200">
                  <CardHeader className="border-b border-gray-200">
                    <CardTitle className="flex items-center text-lg">
                      <BarChart3 className="h-5 w-5 mr-2 text-gray-700" />
                      Usage Statistics
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-6">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">Credits Used</span>
                          <span className="text-sm text-gray-600">{user?.credits || 0} / 300</span>
                        </div>
                        <Progress value={((user?.credits || 0) / 300) * 100} className="h-2" />
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">Storage Used</span>
                          <span className="text-sm text-gray-600">2.4 GB / 10 GB</span>
                        </div>
                        <Progress value={24} className="h-2" />
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">API Calls</span>
                          <span className="text-sm text-gray-600">1,245 / 10,000</span>
                        </div>
                        <Progress value={12.45} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Billing Settings */}
                <Card className="bg-white border border-gray-200">
                  <CardHeader className="border-b border-gray-200">
                    <CardTitle className="flex items-center text-lg">
                      <CreditCard className="h-5 w-5 mr-2 text-gray-700" />
                      Billing Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div>
                          <div className="font-medium text-gray-900">Auto-renewal</div>
                          <div className="text-sm text-gray-600">Automatically renew your subscription</div>
                        </div>
                        <Switch 
                          checked={preferences.billing.autoRenew}
                          onCheckedChange={(checked) => 
                            setPreferences(prev => ({
                              ...prev,
                              billing: { ...prev.billing, autoRenew: checked }
                            }))
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div>
                          <div className="font-medium text-gray-900">Invoice Emails</div>
                          <div className="text-sm text-gray-600">Receive invoices and receipts via email</div>
                        </div>
                        <Switch 
                          checked={preferences.billing.invoiceEmail}
                          onCheckedChange={(checked) => 
                            setPreferences(prev => ({
                              ...prev,
                              billing: { ...prev.billing, invoiceEmail: checked }
                            }))
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div>
                          <div className="font-medium text-gray-900">Usage Alerts</div>
                          <div className="text-sm text-gray-600">Get notified when approaching limits</div>
                        </div>
                        <Switch 
                          checked={preferences.billing.usageAlerts}
                          onCheckedChange={(checked) => 
                            setPreferences(prev => ({
                              ...prev,
                              billing: { ...prev.billing, usageAlerts: checked }
                            }))
                          }
                        />
                      </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Button variant="outline" className="border-gray-300">
                          <Download className="h-4 w-4 mr-2" />
                          Download Invoices
                        </Button>
                        <Button variant="outline" className="border-gray-300">
                          <CreditCard className="h-4 w-4 mr-2" />
                          Payment Methods
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Integrations Tab */}
            {activeTab === "integrations" && (
              <div className="space-y-6">
                <Card className="bg-white border border-gray-200">
                  <CardHeader className="border-b border-gray-200">
                    <CardTitle className="flex items-center text-lg">
                      <Link className="h-5 w-5 mr-2 text-gray-700" />
                      Connected Services
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Globe className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">Google Workspace</div>
                            <div className="text-sm text-gray-600">Gmail, Drive, Calendar integration</div>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" className="border-gray-300">
                          Connect
                        </Button>
                      </div>

                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                            <Building className="h-5 w-5 text-purple-600" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">Slack</div>
                            <div className="text-sm text-gray-600">Team communication and notifications</div>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" className="border-gray-300">
                          Connect
                        </Button>
                      </div>

                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                            <Zap className="h-5 w-5 text-orange-600" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">Zapier</div>
                            <div className="text-sm text-gray-600">Automate workflows with 5000+ apps</div>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" className="border-gray-300">
                          Connect
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Webhooks */}
                <Card className="bg-white border border-gray-200">
                  <CardHeader className="border-b border-gray-200">
                    <CardTitle className="flex items-center text-lg">
                      <Wifi className="h-5 w-5 mr-2 text-gray-700" />
                      Webhooks
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">Webhook Endpoints</h3>
                        <p className="text-sm text-gray-600">Configure webhooks to receive real-time updates</p>
                      </div>
                      <Button variant="outline" className="border-gray-300">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Webhook
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Accessibility Tab */}
            {activeTab === "accessibility" && (
              <div className="space-y-6">
                <Card className="bg-white border border-gray-200">
                  <CardHeader className="border-b border-gray-200">
                    <CardTitle className="flex items-center text-lg">
                      <Accessibility className="h-5 w-5 mr-2 text-gray-700" />
                      Accessibility Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div>
                          <div className="font-medium text-gray-900">Screen Reader Support</div>
                          <div className="text-sm text-gray-600">Optimize interface for screen readers</div>
                        </div>
                        <Switch 
                          checked={preferences.accessibility.screenReader}
                          onCheckedChange={(checked) => 
                            setPreferences(prev => ({
                              ...prev,
                              accessibility: { ...prev.accessibility, screenReader: checked }
                            }))
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div>
                          <div className="font-medium text-gray-900">High Contrast Mode</div>
                          <div className="text-sm text-gray-600">Increase color contrast for better visibility</div>
                        </div>
                        <Switch 
                          checked={preferences.accessibility.highContrast}
                          onCheckedChange={(checked) => 
                            setPreferences(prev => ({
                              ...prev,
                              accessibility: { ...prev.accessibility, highContrast: checked }
                            }))
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div>
                          <div className="font-medium text-gray-900">Large Text</div>
                          <div className="text-sm text-gray-600">Increase font size throughout the interface</div>
                        </div>
                        <Switch 
                          checked={preferences.accessibility.largeText}
                          onCheckedChange={(checked) => 
                            setPreferences(prev => ({
                              ...prev,
                              accessibility: { ...prev.accessibility, largeText: checked }
                            }))
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div>
                          <div className="font-medium text-gray-900">Reduced Motion</div>
                          <div className="text-sm text-gray-600">Minimize animations and transitions</div>
                        </div>
                        <Switch 
                          checked={preferences.accessibility.reducedMotion}
                          onCheckedChange={(checked) => 
                            setPreferences(prev => ({
                              ...prev,
                              accessibility: { ...prev.accessibility, reducedMotion: checked }
                            }))
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div>
                          <div className="font-medium text-gray-900">Keyboard Navigation</div>
                          <div className="text-sm text-gray-600">Enhanced keyboard shortcuts and navigation</div>
                        </div>
                        <Switch 
                          checked={preferences.accessibility.keyboardNavigation}
                          onCheckedChange={(checked) => 
                            setPreferences(prev => ({
                              ...prev,
                              accessibility: { ...prev.accessibility, keyboardNavigation: checked }
                            }))
                          }
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Developer Tools Tab */}
            {activeTab === "developer" && (
              <div className="space-y-6">
                <Card className="bg-white border border-gray-200">
                  <CardHeader className="border-b border-gray-200">
                    <CardTitle className="flex items-center text-lg">
                      <Code className="h-5 w-5 mr-2 text-gray-700" />
                      API & Developer Tools
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-gray-900">API Access</h3>
                          <p className="text-sm text-gray-600">Generate and manage API keys for development</p>
                        </div>
                        <Button variant="outline" className="border-gray-300">
                          <Key className="h-4 w-4 mr-2" />
                          Manage API Keys
                        </Button>
                      </div>

                      <Separator />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Button variant="outline" className="border-gray-300 justify-start h-auto p-4">
                          <div className="flex items-center space-x-3">
                            <FileText className="h-5 w-5 text-gray-600" />
                            <div className="text-left">
                              <div className="font-medium">API Documentation</div>
                              <div className="text-sm text-gray-600">View API reference and examples</div>
                            </div>
                          </div>
                        </Button>

                        <Button variant="outline" className="border-gray-300 justify-start h-auto p-4">
                          <div className="flex items-center space-x-3">
                            <Terminal className="h-5 w-5 text-gray-600" />
                            <div className="text-left">
                              <div className="font-medium">Webhook Logs</div>
                              <div className="text-sm text-gray-600">Monitor webhook events and responses</div>
                            </div>
                          </div>
                        </Button>

                        <Button variant="outline" className="border-gray-300 justify-start h-auto p-4">
                          <div className="flex items-center space-x-3">
                            <Activity className="h-5 w-5 text-gray-600" />
                            <div className="text-left">
                              <div className="font-medium">System Status</div>
                              <div className="text-sm text-gray-600">Check API uptime and performance</div>
                            </div>
                          </div>
                        </Button>

                        <Button variant="outline" className="border-gray-300 justify-start h-auto p-4">
                          <div className="flex items-center space-x-3">
                            <Download className="h-5 w-5 text-gray-600" />
                            <div className="text-left">
                              <div className="font-medium">Export Data</div>
                              <div className="text-sm text-gray-600">Download your data in various formats</div>
                            </div>
                          </div>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* System Information */}
                <Card className="bg-white border border-gray-200">
                  <CardHeader className="border-b border-gray-200">
                    <CardTitle className="flex items-center text-lg">
                      <Info className="h-5 w-5 mr-2 text-gray-700" />
                      System Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">Application</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Version</span>
                            <span className="font-mono">v2.1.4</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Build</span>
                            <span className="font-mono">2024.7.11</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Environment</span>
                            <Badge variant="secondary" className="bg-green-100 text-green-800">Production</Badge>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">Performance</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Uptime</span>
                            <span>99.9%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Response Time</span>
                            <span>142ms</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Last Updated</span>
                            <span>2 min ago</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">Resources</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">CPU Usage</span>
                            <span>23%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Memory</span>
                            <span>1.2 GB</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Storage</span>
                            <span>2.4 GB</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Button variant="outline" className="border-gray-300">
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Clear Cache
                        </Button>
                        <Button variant="outline" className="border-gray-300">
                          <Upload className="h-4 w-4 mr-2" />
                          Export Settings
                        </Button>
                        <Button variant="outline" className="border-red-300 text-red-600 hover:bg-red-50">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Reset Settings
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Save Button */}
            <div className="flex items-center justify-between p-6 bg-white border border-gray-200 rounded-lg" style={{ backgroundColor: '#ffffff', borderColor: '#e5e7eb' }}>
              <div>
                <h3 className="font-medium text-black" style={{ color: '#000000' }}>Save Settings</h3>
                <p className="text-sm text-black" style={{ color: '#000000' }}>Changes are automatically saved as you make them</p>
              </div>
              <Button 
                onClick={handleSaveProfile} 
                className="save-button px-6 py-3 text-base font-medium rounded-lg transition-colors" 
                style={{ 
                  backgroundColor: '#1f2937', 
                  color: '#ffffff', 
                  borderColor: '#1f2937',
                  border: '1px solid #1f2937'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#111827';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#1f2937';
                }}
              >
                <Save className="h-4 w-4 mr-2" />
                Save All Changes
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}