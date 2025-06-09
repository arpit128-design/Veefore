import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  Activity, 
  Settings, 
  Bell, 
  Shield,
  LogOut,
  Search,
  Filter,
  BarChart3,
  Globe,
  MessageSquare,
  FileText,
  AlertTriangle
} from "lucide-react";

interface AdminStats {
  totalUsers: number;
  totalWorkspaces: number;
  totalContent: number;
  totalCreditsUsed: number;
  revenueThisMonth: number;
  activeUsers: number;
}

interface User {
  id: number;
  email: string;
  username: string;
  displayName?: string;
  plan: string;
  credits: number;
  createdAt: string;
  lastLogin?: string;
  isActive: boolean;
}

const AdminDashboard = () => {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedTab, setSelectedTab] = useState("overview");
  const [userSearch, setUserSearch] = useState("");
  const [userFilter, setUserFilter] = useState("all");

  const adminUser = JSON.parse(localStorage.getItem("admin_user") || "{}");
  const adminToken = localStorage.getItem("admin_token");

  useEffect(() => {
    if (!adminToken) {
      setLocation("/admin/login");
    }
  }, [adminToken, setLocation]);

  // Admin Stats Query
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["admin", "stats"],
    queryFn: async () => {
      const response = await fetch("/api/admin/stats", {
        headers: {
          "Authorization": `Bearer ${adminToken}`
        }
      });
      if (!response.ok) throw new Error("Failed to fetch stats");
      return response.json() as AdminStats;
    },
    enabled: !!adminToken
  });

  // Users Query
  const { data: usersData, isLoading: usersLoading } = useQuery({
    queryKey: ["admin", "users", userSearch, userFilter],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (userSearch) params.append("search", userSearch);
      if (userFilter !== "all") params.append("filter", userFilter);
      
      const response = await fetch(`/api/admin/users?${params}`, {
        headers: {
          "Authorization": `Bearer ${adminToken}`
        }
      });
      if (!response.ok) throw new Error("Failed to fetch users");
      return response.json();
    },
    enabled: !!adminToken && selectedTab === "users"
  });

  // Content Query
  const { data: contentData, isLoading: contentLoading } = useQuery({
    queryKey: ["admin", "content", contentSearch, contentFilter],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (contentSearch) params.append("search", contentSearch);
      if (contentFilter !== "all") params.append("filter", contentFilter);
      
      const response = await fetch(`/api/admin/content?${params}`, {
        headers: {
          "Authorization": `Bearer ${adminToken}`
        }
      });
      if (!response.ok) throw new Error("Failed to fetch content");
      return response.json();
    },
    enabled: !!adminToken && selectedTab === "content"
  });

  // Notifications Query
  const { data: notificationsData, isLoading: notificationsLoading } = useQuery({
    queryKey: ["admin", "notifications", notificationFilter],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (notificationFilter !== "all") params.append("type", notificationFilter);
      
      const response = await fetch(`/api/admin/notifications?${params}`, {
        headers: {
          "Authorization": `Bearer ${adminToken}`
        }
      });
      if (!response.ok) throw new Error("Failed to fetch notifications");
      return response.json();
    },
    enabled: !!adminToken && selectedTab === "notifications"
  });

  // Logout Mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/admin/logout", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${adminToken}`
        }
      });
      if (!response.ok) throw new Error("Logout failed");
      return response.json();
    },
    onSuccess: () => {
      localStorage.removeItem("admin_token");
      localStorage.removeItem("admin_user");
      toast({
        title: "Logged out successfully",
        description: "You have been securely logged out."
      });
      setLocation("/admin/login");
    },
    onError: () => {
      // Force logout even if API call fails
      localStorage.removeItem("admin_token");
      localStorage.removeItem("admin_user");
      setLocation("/admin/login");
    }
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  if (!adminToken) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-lg border-b border-purple-500/20">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">VeeFore Admin Panel</h1>
                <p className="text-sm text-gray-300">Welcome back, {adminUser.username}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="bg-green-900/20 text-green-300 border-green-500/20">
                {adminUser.role || "Admin"}
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                disabled={logoutMutation.isPending}
                className="border-red-500/20 text-red-300 hover:bg-red-900/20"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-5 bg-black/20 backdrop-blur-lg border border-purple-500/20">
            <TabsTrigger value="overview" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-white">
              <BarChart3 className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-white">
              <Users className="w-4 h-4 mr-2" />
              Users
            </TabsTrigger>
            <TabsTrigger value="content" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-white">
              <FileText className="w-4 h-4 mr-2" />
              Content
            </TabsTrigger>
            <TabsTrigger value="notifications" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-white">
              <Bell className="w-4 h-4 mr-2" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-white">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="bg-black/40 backdrop-blur-lg border-purple-500/20">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-purple-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">
                    {statsLoading ? "..." : formatNumber(stats?.totalUsers || 0)}
                  </div>
                  <p className="text-xs text-gray-400">Active platform users</p>
                </CardContent>
              </Card>

              <Card className="bg-black/40 backdrop-blur-lg border-purple-500/20">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-green-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">
                    {statsLoading ? "..." : formatCurrency(stats?.revenueThisMonth || 0)}
                  </div>
                  <p className="text-xs text-gray-400">This month</p>
                </CardContent>
              </Card>

              <Card className="bg-black/40 backdrop-blur-lg border-purple-500/20">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">Active Users</CardTitle>
                  <Activity className="h-4 w-4 text-blue-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">
                    {statsLoading ? "..." : formatNumber(stats?.activeUsers || 0)}
                  </div>
                  <p className="text-xs text-gray-400">Last 30 days</p>
                </CardContent>
              </Card>

              <Card className="bg-black/40 backdrop-blur-lg border-purple-500/20">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">Workspaces</CardTitle>
                  <Globe className="h-4 w-4 text-orange-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">
                    {statsLoading ? "..." : formatNumber(stats?.totalWorkspaces || 0)}
                  </div>
                  <p className="text-xs text-gray-400">Total workspaces</p>
                </CardContent>
              </Card>

              <Card className="bg-black/40 backdrop-blur-lg border-purple-500/20">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">Content Created</CardTitle>
                  <MessageSquare className="h-4 w-4 text-pink-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">
                    {statsLoading ? "..." : formatNumber(stats?.totalContent || 0)}
                  </div>
                  <p className="text-xs text-gray-400">AI-generated posts</p>
                </CardContent>
              </Card>

              <Card className="bg-black/40 backdrop-blur-lg border-purple-500/20">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">Credits Used</CardTitle>
                  <TrendingUp className="h-4 w-4 text-yellow-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">
                    {statsLoading ? "..." : formatNumber(stats?.totalCreditsUsed || 0)}
                  </div>
                  <p className="text-xs text-gray-400">Total consumption</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <Card className="bg-black/40 backdrop-blur-lg border-purple-500/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-white">User Management</CardTitle>
                    <CardDescription className="text-gray-300">
                      Manage platform users and their access
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search users..."
                        value={userSearch}
                        onChange={(e) => setUserSearch(e.target.value)}
                        className="pl-10 bg-white/5 border-purple-500/20 text-white placeholder:text-gray-400"
                      />
                    </div>
                    <Select value={userFilter} onValueChange={setUserFilter}>
                      <SelectTrigger className="w-32 bg-white/5 border-purple-500/20 text-white">
                        <Filter className="w-4 h-4 mr-2" />
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Users</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="premium">Premium</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {usersLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="w-6 h-6 border-2 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow className="border-purple-500/20 hover:bg-purple-500/5">
                        <TableHead className="text-gray-300">User</TableHead>
                        <TableHead className="text-gray-300">Plan</TableHead>
                        <TableHead className="text-gray-300">Credits</TableHead>
                        <TableHead className="text-gray-300">Last Login</TableHead>
                        <TableHead className="text-gray-300">Status</TableHead>
                        <TableHead className="text-gray-300">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {usersData?.users?.map((user: User) => (
                        <TableRow key={user.id} className="border-purple-500/20 hover:bg-purple-500/5">
                          <TableCell>
                            <div>
                              <div className="font-medium text-white">{user.displayName || user.username}</div>
                              <div className="text-sm text-gray-400">{user.email}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={user.plan === "premium" ? "default" : "secondary"}>
                              {user.plan}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-white">{user.credits || 0}</TableCell>
                          <TableCell className="text-gray-300">
                            {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : "Never"}
                          </TableCell>
                          <TableCell>
                            <Badge variant={user.isActive ? "default" : "destructive"}>
                              {user.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button variant="outline" size="sm" className="border-purple-500/20 text-purple-300 hover:bg-purple-900/20">
                              Edit
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Content Tab */}
          <TabsContent value="content" className="space-y-6">
            <Card className="bg-black/40 backdrop-blur-lg border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-white">Content Management</CardTitle>
                <CardDescription className="text-gray-300">
                  Monitor and manage AI-generated content across the platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-400">
                  Content management features coming soon...
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <Card className="bg-black/40 backdrop-blur-lg border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-white">System Notifications</CardTitle>
                <CardDescription className="text-gray-300">
                  Manage platform-wide notifications and announcements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-400">
                  Notification management features coming soon...
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card className="bg-black/40 backdrop-blur-lg border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-white">System Settings</CardTitle>
                <CardDescription className="text-gray-300">
                  Configure platform settings and security options
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-400">
                  System settings features coming soon...
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;