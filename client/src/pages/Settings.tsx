import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { logout } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Settings as SettingsIcon, User, Bell, Shield, CreditCard, LogOut, Save } from "lucide-react";

export default function Settings() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    displayName: user?.displayName || '',
    username: user?.username || '',
    email: user?.email || '',
    bio: ''
  });

  const handleSaveProfile = () => {
    // In a real app, this would make an API call to update the user profile
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
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-4xl font-orbitron font-bold neon-text text-asteroid-silver">
          Settings
        </h2>
        <Button
          onClick={handleLogout}
          variant="outline"
          className="glassmorphism text-red-400 border-red-400/50 hover:bg-red-400/10"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Settings */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="content-card holographic">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5 text-electric-cyan" />
                <span className="text-xl font-orbitron font-semibold">Profile Settings</span>
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
                className="text-electric-cyan"
              >
                {isEditing ? 'Cancel' : 'Edit'}
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-6">
                <Avatar className="w-20 h-20 border-2 border-electric-cyan">
                  <AvatarImage src={user?.avatar || ""} alt={user?.username || ""} />
                  <AvatarFallback className="bg-gradient-to-r from-electric-cyan to-nebula-purple text-xl">
                    {user?.username?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{user?.displayName || user?.username}</h3>
                  <p className="text-asteroid-silver">@{user?.username}</p>
                  <Badge className="mt-2 bg-solar-gold/20 text-solar-gold">
                    {user?.plan?.toUpperCase() || 'FREE'} Plan
                  </Badge>
                </div>
              </div>

              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="display-name">Display Name</Label>
                    <Input
                      id="display-name"
                      value={profileData.displayName}
                      onChange={(e) => setProfileData({ ...profileData, displayName: e.target.value })}
                      disabled={!isEditing}
                      className="glassmorphism"
                    />
                  </div>
                  <div>
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      value={profileData.username}
                      onChange={(e) => setProfileData({ ...profileData, username: e.target.value })}
                      disabled={!isEditing}
                      className="glassmorphism"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    disabled={!isEditing}
                    className="glassmorphism"
                  />
                </div>

                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    placeholder="Tell us about yourself..."
                    value={profileData.bio}
                    onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                    disabled={!isEditing}
                    className="glassmorphism"
                  />
                </div>

                {isEditing && (
                  <Button
                    onClick={handleSaveProfile}
                    className="bg-gradient-to-r from-electric-cyan to-blue-500"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card className="content-card holographic">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5 text-nebula-purple" />
                <span className="text-xl font-orbitron font-semibold">Notification Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">Content Generation Complete</Label>
                  <p className="text-sm text-asteroid-silver">Get notified when AI content generation is finished</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">Optimal Posting Times</Label>
                  <p className="text-sm text-asteroid-silver">Receive alerts for best posting windows</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">Credit Low Warning</Label>
                  <p className="text-sm text-asteroid-silver">Alert when credits are running low</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">Weekly Performance Report</Label>
                  <p className="text-sm text-asteroid-silver">Get weekly analytics summaries</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card className="content-card holographic">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-green-400" />
                <span className="text-xl font-orbitron font-semibold">Security & Privacy</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">Two-Factor Authentication</Label>
                  <p className="text-sm text-asteroid-silver">Add an extra layer of security to your account</p>
                </div>
                <Button variant="outline" size="sm" className="glassmorphism">
                  Enable
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">Login Sessions</Label>
                  <p className="text-sm text-asteroid-silver">Manage your active login sessions</p>
                </div>
                <Button variant="outline" size="sm" className="glassmorphism">
                  Manage
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">Data Export</Label>
                  <p className="text-sm text-asteroid-silver">Download all your data</p>
                </div>
                <Button variant="outline" size="sm" className="glassmorphism">
                  Export
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Account Summary */}
        <div className="space-y-6">
          <Card className="content-card holographic">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CreditCard className="h-5 w-5 text-solar-gold" />
                <span className="text-lg font-orbitron font-semibold">Account Summary</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-solar-gold mb-1">
                  {user?.credits?.toLocaleString() || 0}
                </div>
                <div className="text-sm text-asteroid-silver">Credits Remaining</div>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-asteroid-silver">Plan:</span>
                  <Badge className="bg-solar-gold/20 text-solar-gold">
                    {user?.plan?.toUpperCase() || 'FREE'}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-asteroid-silver">Total Referrals:</span>
                  <span>{user?.totalReferrals || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-asteroid-silver">Credits Earned:</span>
                  <span className="text-green-400">{user?.totalEarned || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-asteroid-silver">Member Since:</span>
                  <span>{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</span>
                </div>
              </div>

              <Button className="w-full bg-gradient-to-r from-solar-gold to-orange-500">
                Upgrade Plan
              </Button>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="content-card holographic">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <SettingsIcon className="h-5 w-5 text-electric-cyan" />
                <span className="text-lg font-orbitron font-semibold">Quick Actions</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full glassmorphism justify-start">
                <CreditCard className="w-4 h-4 mr-2" />
                Billing & Payments
              </Button>
              <Button variant="outline" className="w-full glassmorphism justify-start">
                <Bell className="w-4 h-4 mr-2" />
                Email Preferences
              </Button>
              <Button variant="outline" className="w-full glassmorphism justify-start">
                <Shield className="w-4 h-4 mr-2" />
                Privacy Settings
              </Button>
              <Button 
                variant="outline" 
                className="w-full glassmorphism justify-start text-red-400 border-red-400/50 hover:bg-red-400/10"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
