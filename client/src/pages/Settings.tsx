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
  Zap, 
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
  Rocket,
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
  Plus
} from "lucide-react";
import { Link } from "wouter";

export default function Settings() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);

  // Profile data state
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

  // Preferences state
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
      creativity: 70,
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

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Modern Header */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="p-4 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-lg">
                  <SettingsIcon className="h-8 w-8 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 h-4 w-4 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Settings</h1>
                <p className="text-slate-600 mt-1">Customize your VeeFore experience</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={() => window.location.reload()}
                className="border-slate-300 hover:bg-slate-50 text-slate-700"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button
                variant="outline"
                onClick={handleLogout}
                className="border-red-300 text-red-600 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          {/* Tab Navigation */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-3">
            <TabsList className="grid grid-cols-6 w-full bg-slate-100 rounded-xl p-2 h-auto">
              <TabsTrigger 
                value="profile" 
                className="flex flex-col items-center space-y-2 py-4 px-6 data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-blue-600 rounded-lg transition-all duration-200"
              >
                <User className="h-5 w-5" />
                <span className="text-sm font-medium">Profile</span>
              </TabsTrigger>
              <TabsTrigger 
                value="security" 
                className="flex flex-col items-center space-y-2 py-4 px-6 data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-blue-600 rounded-lg transition-all duration-200"
              >
                <Shield className="h-5 w-5" />
                <span className="text-sm font-medium">Security</span>
              </TabsTrigger>
              <TabsTrigger 
                value="notifications" 
                className="flex flex-col items-center space-y-2 py-4 px-6 data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-blue-600 rounded-lg transition-all duration-200"
              >
                <Bell className="h-5 w-5" />
                <span className="text-sm font-medium">Notifications</span>
              </TabsTrigger>
              <TabsTrigger 
                value="appearance" 
                className="flex flex-col items-center space-y-2 py-4 px-6 data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-blue-600 rounded-lg transition-all duration-200"
              >
                <Palette className="h-5 w-5" />
                <span className="text-sm font-medium">Appearance</span>
              </TabsTrigger>
              <TabsTrigger 
                value="ai" 
                className="flex flex-col items-center space-y-2 py-4 px-6 data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-blue-600 rounded-lg transition-all duration-200"
              >
                <Brain className="h-5 w-5" />
                <span className="text-sm font-medium">AI Assistant</span>
              </TabsTrigger>
              <TabsTrigger 
                value="advanced" 
                className="flex flex-col items-center space-y-2 py-4 px-6 data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-blue-600 rounded-lg transition-all duration-200"
              >
                <Zap className="h-5 w-5" />
                <span className="text-sm font-medium">Advanced</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-8">
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
              {/* Main Profile Section */}
              <div className="xl:col-span-3 space-y-8">
                {/* Profile Header Card */}
                <Card className="bg-white shadow-sm border border-slate-200 rounded-2xl overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 h-32 relative">
                    <div className="absolute inset-0 bg-black/20"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <div className="flex items-end space-x-6">
                        <div className="relative">
                          <Avatar className="h-24 w-24 border-4 border-white shadow-xl">
                            <AvatarImage src={user?.avatar || ""} alt={user?.username || ""} />
                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-2xl font-bold">
                              {user?.username?.charAt(0).toUpperCase() || "U"}
                            </AvatarFallback>
                          </Avatar>
                          <Button
                            size="sm"
                            className="absolute -bottom-2 -right-2 rounded-full h-8 w-8 p-0 bg-blue-600 hover:bg-blue-700 shadow-lg"
                          >
                            <Camera className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex-1 pb-2">
                          <h2 className="text-2xl font-bold text-white mb-1">
                            {user?.displayName || user?.username}
                          </h2>
                          <p className="text-blue-100">@{user?.username}</p>
                          <div className="flex items-center space-x-3 mt-3">
                            <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
                              <Crown className="h-3 w-3 mr-1" />
                              {user?.plan?.toUpperCase() || 'FREE'}
                            </Badge>
                            <Badge className="bg-green-500/20 text-green-100 border-green-400/30 backdrop-blur-sm">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Verified
                            </Badge>
                          </div>
                        </div>
                        <Button
                          onClick={() => setIsEditing(!isEditing)}
                          className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm"
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          {isEditing ? 'Cancel' : 'Edit Profile'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Profile Information */}
                <Card className="bg-white shadow-sm border border-slate-200 rounded-2xl">
                  <CardHeader className="pb-6">
                    <CardTitle className="flex items-center space-x-3 text-xl">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <User className="h-5 w-5 text-blue-600" />
                      </div>
                      <span>Personal Information</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <Label htmlFor="display-name" className="text-sm font-semibold text-slate-700 flex items-center space-x-2">
                          <User className="h-4 w-4" />
                          <span>Display Name</span>
                        </Label>
                        <Input
                          id="display-name"
                          value={profileData.displayName}
                          onChange={(e) => setProfileData(prev => ({ ...prev, displayName: e.target.value }))}
                          disabled={!isEditing}
                          className="h-12 bg-slate-50 border-slate-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl"
                          placeholder="Enter your display name"
                        />
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="username" className="text-sm font-semibold text-slate-700 flex items-center space-x-2">
                          <Target className="h-4 w-4" />
                          <span>Username</span>
                        </Label>
                        <Input
                          id="username"
                          value={profileData.username}
                          onChange={(e) => setProfileData(prev => ({ ...prev, username: e.target.value }))}
                          disabled={!isEditing}
                          className="h-12 bg-slate-50 border-slate-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl"
                          placeholder="Choose a unique username"
                        />
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="email" className="text-sm font-semibold text-slate-700 flex items-center space-x-2">
                          <Mail className="h-4 w-4" />
                          <span>Email Address</span>
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={profileData.email}
                          onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                          disabled={!isEditing}
                          className="h-12 bg-slate-50 border-slate-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl"
                          placeholder="your@email.com"
                        />
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="phone" className="text-sm font-semibold text-slate-700 flex items-center space-x-2">
                          <Phone className="h-4 w-4" />
                          <span>Phone Number</span>
                        </Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={profileData.phone}
                          onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                          disabled={!isEditing}
                          placeholder="+1 (555) 123-4567"
                          className="h-12 bg-slate-50 border-slate-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl"
                        />
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="location" className="text-sm font-semibold text-slate-700 flex items-center space-x-2">
                          <MapPin className="h-4 w-4" />
                          <span>Location</span>
                        </Label>
                        <Input
                          id="location"
                          value={profileData.location}
                          onChange={(e) => setProfileData(prev => ({ ...prev, location: e.target.value }))}
                          disabled={!isEditing}
                          placeholder="New York, NY"
                          className="h-12 bg-slate-50 border-slate-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl"
                        />
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="website" className="text-sm font-semibold text-slate-700 flex items-center space-x-2">
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
                          className="h-12 bg-slate-50 border-slate-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl"
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="bio" className="text-sm font-semibold text-slate-700">Bio</Label>
                      <Textarea
                        id="bio"
                        value={profileData.bio}
                        onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                        disabled={!isEditing}
                        placeholder="Tell us about yourself..."
                        rows={4}
                        className="bg-slate-50 border-slate-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl resize-none"
                      />
                      <p className="text-xs text-slate-500 flex justify-between">
                        <span>Share a brief description about yourself</span>
                        <span>{profileData.bio.length}/500</span>
                      </p>
                    </div>

                    {isEditing && (
                      <div className="flex items-center space-x-4 pt-6 border-t border-slate-200">
                        <Button 
                          onClick={handleSaveProfile}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl"
                        >
                          <Save className="h-4 w-4 mr-2" />
                          Save Changes
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={() => setIsEditing(false)}
                          className="border-slate-300 text-slate-700 hover:bg-slate-50 px-8 py-3 rounded-xl"
                        >
                          <X className="h-4 w-4 mr-2" />
                          Cancel
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Account Overview */}
                <Card className="bg-white shadow-sm border border-slate-200 rounded-2xl">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center space-x-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <BarChart3 className="h-5 w-5 text-green-600" />
                      </div>
                      <span>Account Stats</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-blue-50 rounded-xl">
                        <div className="text-2xl font-bold text-blue-600">{user?.credits || 0}</div>
                        <div className="text-sm text-slate-600">Credits</div>
                      </div>
                      <div className="text-center p-4 bg-purple-50 rounded-xl">
                        <div className="text-2xl font-bold text-purple-600">{user?.plan || 'Free'}</div>
                        <div className="text-sm text-slate-600">Plan</div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-600">Member Since</span>
                        <span className="text-sm font-medium text-slate-900">
                          {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Recently'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-600">Last Active</span>
                        <span className="text-sm font-medium text-slate-900">Today</span>
                      </div>
                    </div>
                    
                    <Link href="/billing">
                      <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl py-3">
                        <Crown className="h-4 w-4 mr-2" />
                        Upgrade Plan
                      </Button>
                    </Link>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card className="bg-white shadow-sm border border-slate-200 rounded-2xl">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center space-x-3">
                      <div className="p-2 bg-orange-100 rounded-lg">
                        <Rocket className="h-5 w-5 text-orange-600" />
                      </div>
                      <span>Quick Actions</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button variant="outline" className="w-full justify-start rounded-xl border-slate-200 hover:bg-slate-50">
                      <Download className="h-4 w-4 mr-3" />
                      Export Data
                    </Button>
                    <Button variant="outline" className="w-full justify-start rounded-xl border-slate-200 hover:bg-slate-50">
                      <Share2 className="h-4 w-4 mr-3" />
                      Share Profile
                    </Button>
                    <Button variant="outline" className="w-full justify-start rounded-xl border-slate-200 hover:bg-slate-50">
                      <RefreshCw className="h-4 w-4 mr-3" />
                      Sync Data
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="bg-white shadow-sm border border-slate-200 rounded-2xl">
                <CardHeader className="pb-6">
                  <CardTitle className="flex items-center space-x-3 text-xl">
                    <div className="p-2 bg-red-100 rounded-lg">
                      <Shield className="h-5 w-5 text-red-600" />
                    </div>
                    <span>Security Settings</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                      <div className="space-y-1">
                        <Label className="text-sm font-semibold text-slate-900">Two-Factor Authentication</Label>
                        <p className="text-sm text-slate-600">Add an extra layer of security to your account</p>
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
                    
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                      <div className="space-y-1">
                        <Label className="text-sm font-semibold text-slate-900">Login Alerts</Label>
                        <p className="text-sm text-slate-600">Get notified of new login attempts</p>
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

                    <div className="space-y-3">
                      <Label className="text-sm font-semibold text-slate-900">Session Timeout</Label>
                      <Select 
                        value={preferences.security.sessionTimeout.toString()} 
                        onValueChange={(value) => 
                          setPreferences(prev => ({
                            ...prev,
                            security: { ...prev.security, sessionTimeout: parseInt(value) }
                          }))
                        }
                      >
                        <SelectTrigger className="h-12 bg-slate-50 border-slate-200 rounded-xl">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="15">15 minutes</SelectItem>
                          <SelectItem value="30">30 minutes</SelectItem>
                          <SelectItem value="60">1 hour</SelectItem>
                          <SelectItem value="240">4 hours</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start rounded-xl border-slate-200 hover:bg-slate-50 h-12">
                      <Key className="h-4 w-4 mr-3" />
                      Change Password
                    </Button>
                    <Button variant="outline" className="w-full justify-start rounded-xl border-slate-200 hover:bg-slate-50 h-12">
                      <Smartphone className="h-4 w-4 mr-3" />
                      Manage Devices
                    </Button>
                    <Button variant="outline" className="w-full justify-start rounded-xl border-slate-200 hover:bg-slate-50 h-12">
                      <Archive className="h-4 w-4 mr-3" />
                      Security Log
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-sm border border-slate-200 rounded-2xl">
                <CardHeader className="pb-6">
                  <CardTitle className="flex items-center space-x-3 text-xl">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <BarChart3 className="h-5 w-5 text-blue-600" />
                    </div>
                    <span>Account Usage</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-blue-600 rounded-xl">
                        <Crown className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-blue-900">Current Plan</h4>
                        <p className="text-blue-700">{user?.plan || 'Free'} Plan</p>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800 px-3 py-1">Active</Badge>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-700">Storage Used</span>
                        <span className="text-sm text-slate-600">2.4 GB / 10 GB</span>
                      </div>
                      <Progress value={24} className="h-3 bg-slate-100" />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-700">Credits Used</span>
                        <span className="text-sm text-slate-600">45 / 300</span>
                      </div>
                      <Progress value={15} className="h-3 bg-slate-100" />
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <Link href="/billing">
                      <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl h-12">
                        <Crown className="h-4 w-4 mr-2" />
                        Manage Billing
                      </Button>
                    </Link>
                    <Button variant="outline" className="w-full justify-start rounded-xl border-slate-200 hover:bg-slate-50 h-12">
                      <FileText className="h-4 w-4 mr-3" />
                      Billing History
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-8">
            <Card className="bg-white shadow-sm border border-slate-200 rounded-2xl">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center space-x-3 text-xl">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Bell className="h-5 w-5 text-green-600" />
                  </div>
                  <span>Notification Preferences</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <h4 className="font-semibold text-slate-900 text-lg">Communication Channels</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                        <div className="space-y-1">
                          <Label className="text-sm font-semibold text-slate-900 flex items-center space-x-2">
                            <Mail className="h-4 w-4" />
                            <span>Email Notifications</span>
                          </Label>
                          <p className="text-sm text-slate-600">Receive updates via email</p>
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
                      
                      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                        <div className="space-y-1">
                          <Label className="text-sm font-semibold text-slate-900 flex items-center space-x-2">
                            <Smartphone className="h-4 w-4" />
                            <span>Push Notifications</span>
                          </Label>
                          <p className="text-sm text-slate-600">Browser and mobile notifications</p>
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

                      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                        <div className="space-y-1">
                          <Label className="text-sm font-semibold text-slate-900 flex items-center space-x-2">
                            <Phone className="h-4 w-4" />
                            <span>SMS Notifications</span>
                          </Label>
                          <p className="text-sm text-slate-600">Important alerts via text</p>
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

                      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                        <div className="space-y-1">
                          <Label className="text-sm font-semibold text-slate-900 flex items-center space-x-2">
                            <TrendingUp className="h-4 w-4" />
                            <span>Marketing Updates</span>
                          </Label>
                          <p className="text-sm text-slate-600">Product news and promotions</p>
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

                  <div className="space-y-6">
                    <h4 className="font-semibold text-slate-900 text-lg">Notification Types</h4>
                    <div className="space-y-4">
                      <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                        <div className="flex items-center space-x-3 mb-3">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          <span className="font-medium text-green-900">Account Activity</span>
                        </div>
                        <p className="text-sm text-green-700">Login alerts, security changes, and account updates</p>
                      </div>

                      <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                        <div className="flex items-center space-x-3 mb-3">
                          <AlertTriangle className="h-5 w-5 text-blue-600" />
                          <span className="font-medium text-blue-900">System Updates</span>
                        </div>
                        <p className="text-sm text-blue-700">Maintenance windows and feature releases</p>
                      </div>

                      <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
                        <div className="flex items-center space-x-3 mb-3">
                          <Sparkles className="h-5 w-5 text-purple-600" />
                          <span className="font-medium text-purple-900">AI Insights</span>
                        </div>
                        <p className="text-sm text-purple-700">AI-generated recommendations and insights</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Button variant="outline" className="w-full justify-start rounded-xl border-slate-200 hover:bg-slate-50 h-12">
                        <Timer className="h-4 w-4 mr-3" />
                        Notification Schedule
                      </Button>
                      <Button variant="outline" className="w-full justify-start rounded-xl border-slate-200 hover:bg-slate-50 h-12">
                        <Volume2 className="h-4 w-4 mr-3" />
                        Sound Settings
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Appearance Tab */}
          <TabsContent value="appearance" className="space-y-8">
            <Card className="bg-white shadow-sm border border-slate-200 rounded-2xl">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center space-x-3 text-xl">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <Palette className="h-5 w-5 text-indigo-600" />
                  </div>
                  <span>Appearance & Theme</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <h4 className="font-semibold text-slate-900 text-lg">Theme Settings</h4>
                    <div className="space-y-4">
                      <div className="space-y-3">
                        <Label className="text-sm font-semibold text-slate-900">Theme Mode</Label>
                        <div className="grid grid-cols-3 gap-3">
                          <Button
                            variant={preferences.theme === 'light' ? 'default' : 'outline'}
                            onClick={() => setPreferences(prev => ({ ...prev, theme: 'light' }))}
                            className="flex flex-col items-center space-y-2 h-20 rounded-xl"
                          >
                            <Sun className="h-5 w-5" />
                            <span className="text-sm">Light</span>
                          </Button>
                          <Button
                            variant={preferences.theme === 'dark' ? 'default' : 'outline'}
                            onClick={() => setPreferences(prev => ({ ...prev, theme: 'dark' }))}
                            className="flex flex-col items-center space-y-2 h-20 rounded-xl"
                          >
                            <Moon className="h-5 w-5" />
                            <span className="text-sm">Dark</span>
                          </Button>
                          <Button
                            variant={preferences.theme === 'auto' ? 'default' : 'outline'}
                            onClick={() => setPreferences(prev => ({ ...prev, theme: 'auto' }))}
                            className="flex flex-col items-center space-y-2 h-20 rounded-xl"
                          >
                            <Monitor className="h-5 w-5" />
                            <span className="text-sm">Auto</span>
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <Label className="text-sm font-semibold text-slate-900">Language</Label>
                        <Select 
                          value={preferences.language} 
                          onValueChange={(value) => setPreferences(prev => ({ ...prev, language: value }))}
                        >
                          <SelectTrigger className="h-12 bg-slate-50 border-slate-200 rounded-xl">
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
                  </div>

                  <div className="space-y-6">
                    <h4 className="font-semibold text-slate-900 text-lg">Workspace Settings</h4>
                    <div className="space-y-4">
                      <div className="space-y-3">
                        <Label className="text-sm font-semibold text-slate-900">Default View</Label>
                        <Select 
                          value={preferences.workspace.defaultView} 
                          onValueChange={(value) => 
                            setPreferences(prev => ({
                              ...prev,
                              workspace: { ...prev.workspace, defaultView: value }
                            }))
                          }
                        >
                          <SelectTrigger className="h-12 bg-slate-50 border-slate-200 rounded-xl">
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

                      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                        <div className="space-y-1">
                          <Label className="text-sm font-semibold text-slate-900">Auto-save</Label>
                          <p className="text-sm text-slate-600">Automatically save changes</p>
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

                      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                        <div className="space-y-1">
                          <Label className="text-sm font-semibold text-slate-900">Auto-sync</Label>
                          <p className="text-sm text-slate-600">Sync across devices</p>
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
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* AI Tab */}
          <TabsContent value="ai" className="space-y-8">
            <Card className="bg-white shadow-sm border border-slate-200 rounded-2xl">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center space-x-3 text-xl">
                  <div className="p-2 bg-pink-100 rounded-lg">
                    <Brain className="h-5 w-5 text-pink-600" />
                  </div>
                  <span>AI Assistant Settings</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <h4 className="font-semibold text-slate-900 text-lg">AI Behavior</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                        <div className="space-y-1">
                          <Label className="text-sm font-semibold text-slate-900">AI Suggestions</Label>
                          <p className="text-sm text-slate-600">Get AI-powered content suggestions</p>
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
                      
                      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                        <div className="space-y-1">
                          <Label className="text-sm font-semibold text-slate-900">Auto-complete</Label>
                          <p className="text-sm text-slate-600">AI-powered text completion</p>
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
                        <Label className="text-sm font-semibold text-slate-900">Response Speed</Label>
                        <Select 
                          value={preferences.ai.responseSpeed} 
                          onValueChange={(value) => 
                            setPreferences(prev => ({
                              ...prev,
                              ai: { ...prev.ai, responseSpeed: value }
                            }))
                          }
                        >
                          <SelectTrigger className="h-12 bg-slate-50 border-slate-200 rounded-xl">
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

                  <div className="space-y-6">
                    <h4 className="font-semibold text-slate-900 text-lg">Creativity Settings</h4>
                    <div className="space-y-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <Label className="text-sm font-semibold text-slate-900">Creativity Level</Label>
                          <span className="text-sm font-medium text-slate-600 bg-slate-100 px-3 py-1 rounded-lg">
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
                        <div className="flex justify-between text-xs text-slate-500">
                          <span>Conservative</span>
                          <span>Balanced</span>
                          <span>Creative</span>
                        </div>
                      </div>

                      <div className="p-6 bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl border border-pink-200">
                        <div className="flex items-start space-x-4">
                          <div className="p-2 bg-pink-600 rounded-lg">
                            <Sparkles className="h-5 w-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-pink-900 mb-2">AI Pro Features</h4>
                            <p className="text-sm text-pink-700 mb-3">
                              Unlock advanced AI capabilities with our Pro plan
                            </p>
                            <div className="space-y-2">
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
                              <Button size="sm" className="mt-4 bg-pink-600 hover:bg-pink-700 text-white rounded-lg">
                                <Crown className="h-4 w-4 mr-2" />
                                Upgrade Now
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Advanced Tab */}
          <TabsContent value="advanced" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="bg-white shadow-sm border border-slate-200 rounded-2xl">
                <CardHeader className="pb-6">
                  <CardTitle className="flex items-center space-x-3 text-xl">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <Database className="h-5 w-5 text-gray-600" />
                    </div>
                    <span>System Management</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="p-6 bg-slate-50 rounded-xl">
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-semibold text-slate-900">Cache Status</span>
                      <Badge className="bg-green-100 text-green-800 px-3 py-1">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Optimized
                      </Badge>
                    </div>
                    <div className="space-y-3 text-sm text-slate-600">
                      <div className="flex justify-between">
                        <span>Browser Cache</span>
                        <span className="font-medium">24.5 MB</span>
                      </div>
                      <div className="flex justify-between">
                        <span>App Data</span>
                        <span className="font-medium">156 MB</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Media Cache</span>
                        <span className="font-medium">892 MB</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start rounded-xl border-slate-200 hover:bg-slate-50 h-12">
                      <RefreshCw className="h-4 w-4 mr-3" />
                      Clear Cache
                    </Button>
                    <Button variant="outline" className="w-full justify-start rounded-xl border-slate-200 hover:bg-slate-50 h-12">
                      <Download className="h-4 w-4 mr-3" />
                      Export Settings
                    </Button>
                    <Button variant="outline" className="w-full justify-start rounded-xl border-slate-200 hover:bg-slate-50 h-12">
                      <Upload className="h-4 w-4 mr-3" />
                      Import Settings
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-sm border border-slate-200 rounded-2xl">
                <CardHeader className="pb-6">
                  <CardTitle className="flex items-center space-x-3 text-xl">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <Zap className="h-5 w-5 text-orange-600" />
                    </div>
                    <span>Developer Tools</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="p-4 bg-orange-50 rounded-xl border border-orange-200">
                    <div className="flex items-start space-x-3">
                      <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-orange-900">Advanced Settings</h4>
                        <p className="text-sm text-orange-700 mt-1">
                          These settings are for advanced users only. Proceed with caution.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start rounded-xl border-slate-200 hover:bg-slate-50 h-12">
                      <FileText className="h-4 w-4 mr-3" />
                      API Documentation
                    </Button>
                    <Button variant="outline" className="w-full justify-start rounded-xl border-slate-200 hover:bg-slate-50 h-12">
                      <Key className="h-4 w-4 mr-3" />
                      Manage API Keys
                    </Button>
                    <Button variant="outline" className="w-full justify-start rounded-xl border-slate-200 hover:bg-slate-50 h-12">
                      <Activity className="h-4 w-4 mr-3" />
                      System Diagnostics
                    </Button>
                    <Button variant="outline" className="w-full justify-start rounded-xl border-slate-200 hover:bg-slate-50 h-12">
                      <HardDrive className="h-4 w-4 mr-3" />
                      Storage Analytics
                    </Button>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start text-orange-600 border-orange-200 hover:bg-orange-50 rounded-xl h-12">
                      <RefreshCw className="h-4 w-4 mr-3" />
                      Reset All Settings
                    </Button>
                    <Button variant="outline" className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50 rounded-xl h-12">
                      <Trash2 className="h-4 w-4 mr-3" />
                      Factory Reset
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* System Information */}
            <Card className="bg-white shadow-sm border border-slate-200 rounded-2xl">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center space-x-3 text-xl">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Info className="h-5 w-5 text-blue-600" />
                  </div>
                  <span>System Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-slate-900">Application</h4>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Version</span>
                        <span className="font-mono font-medium">v2.1.4</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Build</span>
                        <span className="font-mono font-medium">2024.7.11</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Environment</span>
                        <Badge className="bg-green-100 text-green-800">Production</Badge>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold text-slate-900">Performance</h4>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Uptime</span>
                        <span className="font-medium">99.9%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Response Time</span>
                        <span className="font-medium">142ms</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Last Updated</span>
                        <span className="font-medium">2 minutes ago</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold text-slate-900">Resources</h4>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-600">CPU Usage</span>
                        <span className="font-medium">23%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Memory</span>
                        <span className="font-medium">1.2 GB</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Network</span>
                        <Badge className="bg-green-100 text-green-800">Online</Badge>
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