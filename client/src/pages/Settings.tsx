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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
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
  CreditCard, 
  LogOut, 
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
  Eye,
  EyeOff,
  Smartphone,
  Monitor,
  Moon,
  Sun,
  Palette,
  Zap,
  Database,
  Download,
  Upload,
  Trash2,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Info,
  HelpCircle,
  Star,
  Crown,
  Gift,
  TrendingUp,
  Users,
  Share2,
  Bookmark,
  Heart,
  Target,
  Brain,
  Rocket,
  Sparkles,
  Wand2,
  Cpu,
  Activity,
  BarChart3,
  FileText,
  Archive,
  Clock,
  Timer,
  Gauge,
  Volume2,
  Mic,
  Video,
  Image,
  Music,
  Headphones,
  Wifi,
  HardDrive,
  Power,
  Cloud,
  Folder,
  File,
  Package,
  MessageCircle,
  AtSign,
  Hash,
  Tag,
  Plus,
  Minus,
  X,
  Check,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Move,
  RotateCw,
  Search,
  Filter,
  Sort,
  List,
  Grid,
  Layers,
  Focus,
  Brightness,
  Contrast
} from "lucide-react";
import { Link } from "wouter";

export default function Settings() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    displayName: user?.displayName || '',
    username: user?.username || '',
    email: user?.email || '',
    bio: '',
    location: '',
    website: '',
    phone: '',
    birthDate: '',
    timezone: 'UTC'
  });

  const [preferences, setPreferences] = useState({
    theme: 'light',
    language: 'en',
    notifications: {
      email: true,
      push: true,
      sms: false,
      marketing: false
    },
    privacy: {
      profileVisible: true,
      activityVisible: false,
      dataCollection: true
    },
    security: {
      twoFactor: false,
      sessionTimeout: 30,
      loginAlerts: true
    },
    workspace: {
      autoSave: true,
      autoSync: true,
      defaultView: 'grid',
      itemsPerPage: 20
    },
    ai: {
      suggestions: true,
      autoComplete: true,
      creativity: 50,
      responseSpeed: 'balanced'
    }
  });

  const handleSaveProfile = () => {
    toast({
      title: "Profile Updated",
      description: "Your profile has been updated successfully.",
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

  const handleExportData = () => {
    toast({
      title: "Data Export",
      description: "Your data export has been started. You'll receive an email when ready.",
    });
  };

  const handleDeleteAccount = () => {
    toast({
      title: "Account Deletion",
      description: "Account deletion request submitted. This action cannot be undone.",
      variant: "destructive",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Professional Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-600 rounded-xl">
                <SettingsIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
                <p className="text-gray-600">Manage your account preferences and configurations</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={() => window.location.reload()}
                className="flex items-center space-x-2"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Refresh</span>
              </Button>
              <Button
                variant="outline"
                onClick={handleLogout}
                className="flex items-center space-x-2 text-red-600 border-red-200 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          {/* Modern Tab Navigation */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-2">
            <TabsList className="grid grid-cols-7 w-full bg-gray-50 rounded-lg p-1">
              <TabsTrigger 
                value="profile" 
                className="flex items-center space-x-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Profile</span>
              </TabsTrigger>
              <TabsTrigger 
                value="account" 
                className="flex items-center space-x-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                <Shield className="h-4 w-4" />
                <span className="hidden sm:inline">Account</span>
              </TabsTrigger>
              <TabsTrigger 
                value="notifications" 
                className="flex items-center space-x-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                <Bell className="h-4 w-4" />
                <span className="hidden sm:inline">Notifications</span>
              </TabsTrigger>
              <TabsTrigger 
                value="privacy" 
                className="flex items-center space-x-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                <Lock className="h-4 w-4" />
                <span className="hidden sm:inline">Privacy</span>
              </TabsTrigger>
              <TabsTrigger 
                value="workspace" 
                className="flex items-center space-x-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                <Cpu className="h-4 w-4" />
                <span className="hidden sm:inline">Workspace</span>
              </TabsTrigger>
              <TabsTrigger 
                value="ai" 
                className="flex items-center space-x-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                <Brain className="h-4 w-4" />
                <span className="hidden sm:inline">AI</span>
              </TabsTrigger>
              <TabsTrigger 
                value="advanced" 
                className="flex items-center space-x-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                <Zap className="h-4 w-4" />
                <span className="hidden sm:inline">Advanced</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                {/* Profile Information */}
                <Card className="bg-white shadow-sm border border-gray-200">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center space-x-2">
                        <User className="h-5 w-5 text-blue-600" />
                        <span>Profile Information</span>
                      </CardTitle>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsEditing(!isEditing)}
                        className="flex items-center space-x-2"
                      >
                        <Edit className="h-4 w-4" />
                        <span>{isEditing ? 'Cancel' : 'Edit'}</span>
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Avatar Section */}
                    <div className="flex items-center space-x-6">
                      <div className="relative">
                        <Avatar className="h-20 w-20 border-4 border-gray-100 shadow-sm">
                          <AvatarImage src={user?.avatar || ""} alt={user?.username || ""} />
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xl font-bold">
                            {user?.username?.charAt(0).toUpperCase() || "U"}
                          </AvatarFallback>
                        </Avatar>
                        {isEditing && (
                          <Button
                            size="sm"
                            className="absolute -bottom-2 -right-2 rounded-full h-8 w-8 p-0 bg-blue-600 hover:bg-blue-700"
                          >
                            <Camera className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {user?.displayName || user?.username}
                        </h3>
                        <p className="text-gray-600">@{user?.username}</p>
                        <div className="flex items-center space-x-2 mt-2">
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                            <Crown className="h-3 w-3 mr-1" />
                            {user?.plan?.toUpperCase() || 'FREE'}
                          </Badge>
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Verified
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Profile Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="display-name" className="text-sm font-medium text-gray-700">
                          Display Name
                        </Label>
                        <Input
                          id="display-name"
                          value={profileData.displayName}
                          onChange={(e) => setProfileData(prev => ({ ...prev, displayName: e.target.value }))}
                          disabled={!isEditing}
                          className="bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="username" className="text-sm font-medium text-gray-700">
                          Username
                        </Label>
                        <Input
                          id="username"
                          value={profileData.username}
                          onChange={(e) => setProfileData(prev => ({ ...prev, username: e.target.value }))}
                          disabled={!isEditing}
                          className="bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-medium text-gray-700 flex items-center space-x-1">
                          <Mail className="h-4 w-4" />
                          <span>Email</span>
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={profileData.email}
                          onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                          disabled={!isEditing}
                          className="bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-sm font-medium text-gray-700 flex items-center space-x-1">
                          <Phone className="h-4 w-4" />
                          <span>Phone</span>
                        </Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={profileData.phone}
                          onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                          disabled={!isEditing}
                          placeholder="+1 (555) 123-4567"
                          className="bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="location" className="text-sm font-medium text-gray-700 flex items-center space-x-1">
                          <MapPin className="h-4 w-4" />
                          <span>Location</span>
                        </Label>
                        <Input
                          id="location"
                          value={profileData.location}
                          onChange={(e) => setProfileData(prev => ({ ...prev, location: e.target.value }))}
                          disabled={!isEditing}
                          placeholder="New York, NY"
                          className="bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="website" className="text-sm font-medium text-gray-700 flex items-center space-x-1">
                          <Globe className="h-4 w-4" />
                          <span>Website</span>
                        </Label>
                        <Input
                          id="website"
                          type="url"
                          value={profileData.website}
                          onChange={(e) => setProfileData(prev => ({ ...prev, website: e.target.value }))}
                          disabled={!isEditing}
                          placeholder="https://yourwebsite.com"
                          className="bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="birth-date" className="text-sm font-medium text-gray-700 flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>Birth Date</span>
                        </Label>
                        <Input
                          id="birth-date"
                          type="date"
                          value={profileData.birthDate}
                          onChange={(e) => setProfileData(prev => ({ ...prev, birthDate: e.target.value }))}
                          disabled={!isEditing}
                          className="bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="timezone" className="text-sm font-medium text-gray-700 flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>Timezone</span>
                        </Label>
                        <Select 
                          value={profileData.timezone} 
                          onValueChange={(value) => setProfileData(prev => ({ ...prev, timezone: value }))}
                          disabled={!isEditing}
                        >
                          <SelectTrigger className="bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="UTC">UTC (GMT+0)</SelectItem>
                            <SelectItem value="EST">Eastern (GMT-5)</SelectItem>
                            <SelectItem value="PST">Pacific (GMT-8)</SelectItem>
                            <SelectItem value="GMT">Greenwich (GMT+0)</SelectItem>
                            <SelectItem value="IST">India (GMT+5:30)</SelectItem>
                            <SelectItem value="JST">Japan (GMT+9)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio" className="text-sm font-medium text-gray-700">
                        Bio
                      </Label>
                      <Textarea
                        id="bio"
                        value={profileData.bio}
                        onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                        disabled={!isEditing}
                        placeholder="Tell us about yourself..."
                        rows={4}
                        className="bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      />
                      <p className="text-xs text-gray-500">
                        {profileData.bio.length}/500 characters
                      </p>
                    </div>

                    {isEditing && (
                      <div className="flex items-center space-x-3 pt-4">
                        <Button 
                          onClick={handleSaveProfile}
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          <Save className="h-4 w-4 mr-2" />
                          Save Changes
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={() => setIsEditing(false)}
                        >
                          <X className="h-4 w-4 mr-2" />
                          Cancel
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Quick Stats Sidebar */}
              <div className="space-y-6">
                <Card className="bg-white shadow-sm border border-gray-200">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center space-x-2">
                      <BarChart3 className="h-5 w-5 text-green-600" />
                      <span>Account Overview</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Credits</span>
                        <Badge variant="outline" className="bg-green-50 text-green-700">
                          {user?.credits || 0}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Plan</span>
                        <Badge className="bg-blue-100 text-blue-800">
                          {user?.plan || 'Free'}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Member Since</span>
                        <span className="text-sm font-medium text-gray-900">
                          {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Recently'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Last Login</span>
                        <span className="text-sm font-medium text-gray-900">Today</span>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <Link href="/billing">
                      <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                        <Crown className="h-4 w-4 mr-2" />
                        Upgrade Plan
                      </Button>
                    </Link>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card className="bg-white shadow-sm border border-gray-200">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center space-x-2">
                      <Zap className="h-5 w-5 text-orange-600" />
                      <span>Quick Actions</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={handleExportData}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export Data
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      Share Profile
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Sync Data
                    </Button>
                    <Separator />
                    <Button 
                      variant="outline" 
                      className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50"
                      onClick={handleDeleteAccount}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Account
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Account Tab */}
          <TabsContent value="account" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Security Settings */}
              <Card className="bg-white shadow-sm border border-gray-200">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="h-5 w-5 text-red-600" />
                    <span>Security Settings</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label className="text-sm font-medium">Two-Factor Authentication</Label>
                        <p className="text-xs text-gray-500">Add an extra layer of security</p>
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
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label className="text-sm font-medium">Login Alerts</Label>
                        <p className="text-xs text-gray-500">Get notified of new login attempts</p>
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

                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Session Timeout</Label>
                      <Select 
                        value={preferences.security.sessionTimeout.toString()} 
                        onValueChange={(value) => 
                          setPreferences(prev => ({
                            ...prev,
                            security: { ...prev.security, sessionTimeout: parseInt(value) }
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="15">15 minutes</SelectItem>
                          <SelectItem value="30">30 minutes</SelectItem>
                          <SelectItem value="60">1 hour</SelectItem>
                          <SelectItem value="240">4 hours</SelectItem>
                          <SelectItem value="480">8 hours</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start">
                      <Key className="h-4 w-4 mr-2" />
                      Change Password
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Smartphone className="h-4 w-4 mr-2" />
                      Manage Devices
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Archive className="h-4 w-4 mr-2" />
                      Download Security Log
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Account Management */}
              <Card className="bg-white shadow-sm border border-gray-200">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <CreditCard className="h-5 w-5 text-blue-600" />
                    <span>Account Management</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-600 rounded-lg">
                          <Crown className="h-4 w-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-blue-900">Current Plan</h4>
                          <p className="text-sm text-blue-700">{user?.plan || 'Free'} Plan</p>
                        </div>
                        <Badge className="bg-blue-100 text-blue-800">Active</Badge>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Storage Used</span>
                        <span className="text-sm font-medium">2.4 GB / 10 GB</span>
                      </div>
                      <Progress value={24} className="h-2" />
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Credits Used This Month</span>
                        <span className="text-sm font-medium">45 / 300</span>
                      </div>
                      <Progress value={15} className="h-2" />
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <Link href="/billing">
                      <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white">
                        <Crown className="h-4 w-4 mr-2" />
                        Manage Billing
                      </Button>
                    </Link>
                    <Button variant="outline" className="w-full justify-start">
                      <FileText className="h-4 w-4 mr-2" />
                      Billing History
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Gift className="h-4 w-4 mr-2" />
                      Referral Program
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <Card className="bg-white shadow-sm border border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bell className="h-5 w-5 text-yellow-600" />
                  <span>Notification Preferences</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">Communication</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label className="text-sm font-medium flex items-center space-x-2">
                            <Mail className="h-4 w-4" />
                            <span>Email Notifications</span>
                          </Label>
                          <p className="text-xs text-gray-500">Receive updates via email</p>
                        </div>
                        <Switch 
                          checked={preferences.notifications.email}
                          onCheckedChange={(checked) => 
                            setPreferences(prev => ({
                              ...prev,
                              notifications: { ...prev.notifications, email: checked }
                            }))
                          }
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label className="text-sm font-medium flex items-center space-x-2">
                            <Smartphone className="h-4 w-4" />
                            <span>Push Notifications</span>
                          </Label>
                          <p className="text-xs text-gray-500">Receive push notifications</p>
                        </div>
                        <Switch 
                          checked={preferences.notifications.push}
                          onCheckedChange={(checked) => 
                            setPreferences(prev => ({
                              ...prev,
                              notifications: { ...prev.notifications, push: checked }
                            }))
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label className="text-sm font-medium flex items-center space-x-2">
                            <MessageCircle className="h-4 w-4" />
                            <span>SMS Notifications</span>
                          </Label>
                          <p className="text-xs text-gray-500">Receive text messages</p>
                        </div>
                        <Switch 
                          checked={preferences.notifications.sms}
                          onCheckedChange={(checked) => 
                            setPreferences(prev => ({
                              ...prev,
                              notifications: { ...prev.notifications, sms: checked }
                            }))
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label className="text-sm font-medium flex items-center space-x-2">
                            <Target className="h-4 w-4" />
                            <span>Marketing Communications</span>
                          </Label>
                          <p className="text-xs text-gray-500">Product updates and promotions</p>
                        </div>
                        <Switch 
                          checked={preferences.notifications.marketing}
                          onCheckedChange={(checked) => 
                            setPreferences(prev => ({
                              ...prev,
                              notifications: { ...prev.notifications, marketing: checked }
                            }))
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">Activity</h4>
                    <div className="space-y-4">
                      <div className="p-4 bg-gray-50 rounded-lg space-y-3">
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-sm font-medium">Account activity</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-sm font-medium">Security alerts</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-sm font-medium">Billing updates</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <AlertTriangle className="h-4 w-4 text-orange-600" />
                          <span className="text-sm font-medium">System maintenance</span>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <Button variant="outline" className="w-full justify-start">
                          <Timer className="h-4 w-4 mr-2" />
                          Notification Schedule
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          <Volume2 className="h-4 w-4 mr-2" />
                          Sound Settings
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Privacy Tab */}
          <TabsContent value="privacy" className="space-y-6">
            <Card className="bg-white shadow-sm border border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Lock className="h-5 w-5 text-purple-600" />
                  <span>Privacy & Data</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">Profile Visibility</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label className="text-sm font-medium">Public Profile</Label>
                          <p className="text-xs text-gray-500">Make your profile visible to others</p>
                        </div>
                        <Switch 
                          checked={preferences.privacy.profileVisible}
                          onCheckedChange={(checked) => 
                            setPreferences(prev => ({
                              ...prev,
                              privacy: { ...prev.privacy, profileVisible: checked }
                            }))
                          }
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label className="text-sm font-medium">Activity Status</Label>
                          <p className="text-xs text-gray-500">Show when you're active</p>
                        </div>
                        <Switch 
                          checked={preferences.privacy.activityVisible}
                          onCheckedChange={(checked) => 
                            setPreferences(prev => ({
                              ...prev,
                              privacy: { ...prev.privacy, activityVisible: checked }
                            }))
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label className="text-sm font-medium">Data Collection</Label>
                          <p className="text-xs text-gray-500">Allow analytics and improvements</p>
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
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">Data Management</h4>
                    <div className="space-y-3">
                      <Button variant="outline" className="w-full justify-start">
                        <Download className="h-4 w-4 mr-2" />
                        Download My Data
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Eye className="h-4 w-4 mr-2" />
                        View Data Usage
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Shield className="h-4 w-4 mr-2" />
                        Privacy Settings
                      </Button>
                      <Button variant="outline" className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete All Data
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Workspace Tab */}
          <TabsContent value="workspace" className="space-y-6">
            <Card className="bg-white shadow-sm border border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Cpu className="h-5 w-5 text-indigo-600" />
                  <span>Workspace Preferences</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">General Settings</h4>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Default View</Label>
                        <Select 
                          value={preferences.workspace.defaultView} 
                          onValueChange={(value) => 
                            setPreferences(prev => ({
                              ...prev,
                              workspace: { ...prev.workspace, defaultView: value }
                            }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="grid">Grid View</SelectItem>
                            <SelectItem value="list">List View</SelectItem>
                            <SelectItem value="kanban">Kanban Board</SelectItem>
                            <SelectItem value="timeline">Timeline</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Items Per Page</Label>
                        <Select 
                          value={preferences.workspace.itemsPerPage.toString()} 
                          onValueChange={(value) => 
                            setPreferences(prev => ({
                              ...prev,
                              workspace: { ...prev.workspace, itemsPerPage: parseInt(value) }
                            }))
                          }
                        >
                          <SelectTrigger>
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

                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label className="text-sm font-medium">Auto-save</Label>
                          <p className="text-xs text-gray-500">Automatically save changes</p>
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

                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label className="text-sm font-medium">Auto-sync</Label>
                          <p className="text-xs text-gray-500">Sync across devices</p>
                        </div>
                        <Switch 
                          checked={preferences.workspace.autoSync}
                          onCheckedChange={(checked) => 
                            setPreferences(prev => ({
                              ...prev,
                              workspace: { ...prev.workspace, autoSync: checked }
                            }))
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">Theme & Appearance</h4>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Theme</Label>
                        <div className="grid grid-cols-3 gap-2">
                          <Button
                            variant={preferences.theme === 'light' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setPreferences(prev => ({ ...prev, theme: 'light' }))}
                            className="flex items-center space-x-2"
                          >
                            <Sun className="h-4 w-4" />
                            <span>Light</span>
                          </Button>
                          <Button
                            variant={preferences.theme === 'dark' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setPreferences(prev => ({ ...prev, theme: 'dark' }))}
                            className="flex items-center space-x-2"
                          >
                            <Moon className="h-4 w-4" />
                            <span>Dark</span>
                          </Button>
                          <Button
                            variant={preferences.theme === 'auto' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setPreferences(prev => ({ ...prev, theme: 'auto' }))}
                            className="flex items-center space-x-2"
                          >
                            <Monitor className="h-4 w-4" />
                            <span>Auto</span>
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Language</Label>
                        <Select 
                          value={preferences.language} 
                          onValueChange={(value) => setPreferences(prev => ({ ...prev, language: value }))}
                        >
                          <SelectTrigger>
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

                      <div className="space-y-3">
                        <Button variant="outline" className="w-full justify-start">
                          <Palette className="h-4 w-4 mr-2" />
                          Customize Colors
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          <Layout className="h-4 w-4 mr-2" />
                          Layout Settings
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* AI Tab */}
          <TabsContent value="ai" className="space-y-6">
            <Card className="bg-white shadow-sm border border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="h-5 w-5 text-pink-600" />
                  <span>AI Assistant Settings</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">AI Behavior</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label className="text-sm font-medium">AI Suggestions</Label>
                          <p className="text-xs text-gray-500">Get AI-powered content suggestions</p>
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
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label className="text-sm font-medium">Auto-complete</Label>
                          <p className="text-xs text-gray-500">AI-powered text completion</p>
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

                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Response Speed</Label>
                        <Select 
                          value={preferences.ai.responseSpeed} 
                          onValueChange={(value) => 
                            setPreferences(prev => ({
                              ...prev,
                              ai: { ...prev.ai, responseSpeed: value }
                            }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="fast">Fast & Simple</SelectItem>
                            <SelectItem value="balanced">Balanced</SelectItem>
                            <SelectItem value="detailed">Detailed & Thorough</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">Creativity Settings</h4>
                    <div className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label className="text-sm font-medium">Creativity Level</Label>
                          <span className="text-sm text-gray-600">{preferences.ai.creativity}%</span>
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

                      <div className="space-y-3">
                        <Button variant="outline" className="w-full justify-start">
                          <Wand2 className="h-4 w-4 mr-2" />
                          AI Model Settings
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          <Target className="h-4 w-4 mr-2" />
                          Custom Prompts
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          <Activity className="h-4 w-4 mr-2" />
                          Usage Analytics
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg border border-pink-200">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-pink-600 rounded-lg">
                      <Sparkles className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-pink-900">AI Pro Features</h4>
                      <p className="text-sm text-pink-700 mt-1">
                        Unlock advanced AI capabilities with our Pro plan
                      </p>
                      <div className="mt-3 space-y-2">
                        <div className="flex items-center space-x-2 text-sm text-pink-800">
                          <Check className="h-4 w-4" />
                          <span>Advanced AI models</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-pink-800">
                          <Check className="h-4 w-4" />
                          <span>Custom AI training</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-pink-800">
                          <Check className="h-4 w-4" />
                          <span>Priority processing</span>
                        </div>
                      </div>
                      <Link href="/billing">
                        <Button size="sm" className="mt-3 bg-pink-600 hover:bg-pink-700 text-white">
                          <Crown className="h-4 w-4 mr-2" />
                          Upgrade Now
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Advanced Tab */}
          <TabsContent value="advanced" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* System Settings */}
              <Card className="bg-white shadow-sm border border-gray-200">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Database className="h-5 w-5 text-gray-600" />
                    <span>System Settings</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-medium text-gray-900">Cache Status</span>
                        <Badge variant="outline" className="bg-green-50 text-green-700">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Optimized
                        </Badge>
                      </div>
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex justify-between">
                          <span>Browser Cache</span>
                          <span>24.5 MB</span>
                        </div>
                        <div className="flex justify-between">
                          <span>App Data</span>
                          <span>156 MB</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Media Cache</span>
                          <span>892 MB</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Button variant="outline" className="w-full justify-start">
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Clear Cache
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Download className="h-4 w-4 mr-2" />
                        Export Settings
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Upload className="h-4 w-4 mr-2" />
                        Import Settings
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Developer Settings */}
              <Card className="bg-white shadow-sm border border-gray-200">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Zap className="h-5 w-5 text-yellow-600" />
                    <span>Developer Options</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                      <div className="flex items-start space-x-3">
                        <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-yellow-900">Advanced Settings</h4>
                          <p className="text-sm text-yellow-700 mt-1">
                            These settings are for advanced users only. Proceed with caution.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Button variant="outline" className="w-full justify-start">
                        <FileText className="h-4 w-4 mr-2" />
                        API Documentation
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Key className="h-4 w-4 mr-2" />
                        Manage API Keys
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Activity className="h-4 w-4 mr-2" />
                        System Diagnostics
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <HardDrive className="h-4 w-4 mr-2" />
                        Storage Analytics
                      </Button>
                    </div>

                    <Separator />

                    <div className="space-y-3">
                      <Button variant="outline" className="w-full justify-start text-orange-600 border-orange-200 hover:bg-orange-50">
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Reset All Settings
                      </Button>
                      <Button variant="outline" className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Factory Reset
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* System Information */}
            <Card className="bg-white shadow-sm border border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Info className="h-5 w-5 text-blue-600" />
                  <span>System Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-900">Application</h4>
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
                        <Badge variant="outline" className="bg-green-50 text-green-700">Production</Badge>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-900">Performance</h4>
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
                        <span>2 minutes ago</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-900">Resources</h4>
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
                        <span className="text-gray-600">Network</span>
                        <Badge variant="outline" className="bg-green-50 text-green-700">Online</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}