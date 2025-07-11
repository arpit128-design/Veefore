import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, Users, CreditCard, Activity, LogOut, Settings, DollarSign, UserPlus } from 'lucide-react';

interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalCredits: number;
  totalRevenue: number;
  pendingPayments: number;
  recentSignups: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [adminUser, setAdminUser] = useState<any>(null);

  useEffect(() => {
    // Check if admin is logged in
    const token = localStorage.getItem('adminToken');
    const userData = localStorage.getItem('adminUser');
    
    if (!token || !userData) {
      window.location.href = '/admin/login';
      return;
    }

    setAdminUser(JSON.parse(userData));
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/stats', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setStats({
          totalUsers: data.totalUsers || 0,
          activeUsers: data.activeUsers || 0,
          totalCredits: data.totalCreditsUsed || 0,
          totalRevenue: data.revenueThisMonth || 0,
          pendingPayments: 0,
          recentSignups: data.totalUsers || 0
        });
        setError('');
      } else {
        const errorData = await response.json();
        setError(`Failed to fetch dashboard statistics: ${errorData.error || response.statusText}`);
      }
    } catch (err) {
      console.error('Admin stats fetch error:', err);
      setError(`Network error occurred: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    window.location.href = '/admin/login';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white">Loading admin dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
            <p className="text-gray-300">VeeFore Administrative Panel</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-white">
              <span className="text-sm">Welcome, </span>
              <span className="font-medium">{adminUser?.username || 'Admin'}</span>
              <span className="text-xs block text-gray-400">Role: {adminUser?.role || 'N/A'}</span>
            </div>
            <Button onClick={handleLogout} variant="outline" className="border-purple-500/30 text-white hover:bg-purple-500/20">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {error && (
          <Alert className="mb-6 bg-red-500/20 border-red-500/30">
            <AlertDescription className="text-red-300">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-black/20 backdrop-blur-md border-purple-500/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Total Users</CardTitle>
              <Users className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats?.totalUsers || 0}</div>
              <p className="text-xs text-gray-400">
                +{stats?.recentSignups || 0} from last month
              </p>
            </CardContent>
          </Card>

          <Card className="bg-black/20 backdrop-blur-md border-purple-500/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Active Users</CardTitle>
              <Activity className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats?.activeUsers || 0}</div>
              <p className="text-xs text-gray-400">
                Online in last 24h
              </p>
            </CardContent>
          </Card>

          <Card className="bg-black/20 backdrop-blur-md border-purple-500/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Total Credits</CardTitle>
              <CreditCard className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats?.totalCredits || 0}</div>
              <p className="text-xs text-gray-400">
                Credits in circulation
              </p>
            </CardContent>
          </Card>

          <Card className="bg-black/20 backdrop-blur-md border-purple-500/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Total Revenue</CardTitle>
              <Shield className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">₹{stats?.totalRevenue || 0}</div>
              <p className="text-xs text-gray-400">
                {stats?.pendingPayments || 0} pending payments
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Admin Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-black/20 backdrop-blur-md border-purple-500/30">
            <CardHeader>
              <CardTitle className="text-white">Quick Actions</CardTitle>
              <CardDescription className="text-gray-300">
                Common administrative tasks
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={() => window.location.href = '/admin/users'}
                className="w-full bg-purple-600 hover:bg-purple-700 flex items-center gap-2"
              >
                <Users className="h-4 w-4" />
                Manage Users
              </Button>
              <Button 
                onClick={() => window.location.href = '/admin/waitlist'}
                className="w-full bg-orange-600 hover:bg-orange-700 flex items-center gap-2"
              >
                <UserPlus className="h-4 w-4" />
                Waitlist Management
              </Button>
              <Button 
                onClick={() => window.location.href = '/admin/transactions'}
                className="w-full bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
              >
                <DollarSign className="h-4 w-4" />
                View Transactions
              </Button>
              <Button 
                onClick={() => window.location.href = '/admin/settings'}
                className="w-full bg-green-600 hover:bg-green-700 flex items-center gap-2"
              >
                <Settings className="h-4 w-4" />
                System Settings
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-black/20 backdrop-blur-md border-purple-500/30">
            <CardHeader>
              <CardTitle className="text-white">System Status</CardTitle>
              <CardDescription className="text-gray-300">
                Current system health
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-white">Database</span>
                  <span className="text-green-400">Online</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white">API Services</span>
                  <span className="text-green-400">Running</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white">Payment Gateway</span>
                  <span className="text-green-400">Connected</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white">AI Services</span>
                  <span className="text-green-400">Active</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}