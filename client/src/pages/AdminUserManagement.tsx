import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Users, Mail, Calendar, CreditCard, ChevronLeft, ChevronRight, Eye, Edit, Trash2, UserPlus } from 'lucide-react';

interface User {
  id: string;
  username: string;
  email: string;
  displayName?: string;
  plan: string;
  credits: number;
  status: string;
  lastLogin?: Date;
  createdAt: Date;
  totalWorkspaces: number;
}

interface WaitlistUser {
  id: string;
  name: string;
  email: string;
  referralCode: string;
  referredBy?: string;
  referralCount: number;
  credits: number;
  status: string;
  discountCode?: string;
  createdAt: Date;
}

export default function AdminUserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [waitlistUsers, setWaitlistUsers] = useState<WaitlistUser[]>([]);
  const [activeTab, setActiveTab] = useState('users');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      window.location.href = '/admin/login';
      return;
    }
    fetchUsers();
  }, [currentPage, searchTerm, filterStatus, activeTab]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      
      const endpoint = activeTab === 'waitlist' ? '/api/admin/waitlist' : '/api/admin/users';
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
        search: searchTerm,
        filter: filterStatus
      });

      const response = await fetch(`${endpoint}?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        
        if (activeTab === 'waitlist') {
          setWaitlistUsers(data.users || []);
        } else {
          setUsers(data.users || []);
        }
        
        setTotalPages(data.pagination?.pages || 1);
        setTotalUsers(data.pagination?.total || 0);
        setError('');
      } else {
        const errorData = await response.json();
        setError(`Failed to fetch ${activeTab}: ${errorData.error || response.statusText}`);
      }
    } catch (err) {
      console.error(`${activeTab} fetch error:`, err);
      setError(`Network error occurred: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleUserAction = async (userId: string, action: string) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/admin/users/${userId}/${action}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        fetchUsers(); // Refresh the list
      } else {
        const errorData = await response.json();
        setError(`Failed to ${action} user: ${errorData.error}`);
      }
    } catch (err) {
      setError(`Error performing action: ${err.message}`);
    }
  };

  const handleWaitlistAction = async (userId: string, action: string) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/admin/waitlist/${userId}/${action}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        fetchUsers(); // Refresh the list
      } else {
        const errorData = await response.json();
        setError(`Failed to ${action} waitlist user: ${errorData.error}`);
      }
    } catch (err) {
      setError(`Error performing action: ${err.message}`);
    }
  };

  const formatDate = (date: Date | string) => {
    if (!date) return 'Never';
    return new Date(date).toLocaleDateString();
  };

  const getStatusBadge = (status: string) => {
    const statusColors = {
      active: 'bg-green-500',
      inactive: 'bg-gray-500',
      waitlisted: 'bg-yellow-500',
      early_access: 'bg-blue-500',
      launched: 'bg-purple-500'
    };
    return (
      <Badge className={`${statusColors[status] || 'bg-gray-500'} text-white`}>
        {status}
      </Badge>
    );
  };

  const getPlanBadge = (plan: string) => {
    const planColors = {
      Free: 'bg-gray-600',
      Starter: 'bg-blue-600',
      Pro: 'bg-purple-600',
      Business: 'bg-gold-600'
    };
    return (
      <Badge className={`${planColors[plan] || 'bg-gray-600'} text-white`}>
        {plan || 'Free'}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">User Management</h1>
            <p className="text-gray-300">Manage platform users and waitlist</p>
          </div>
          <Button 
            onClick={() => window.location.href = '/admin/dashboard'} 
            variant="outline" 
            className="border-purple-500/30 text-white hover:bg-purple-500/20"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>

        {error && (
          <Alert className="mb-6 bg-red-500/20 border-red-500/30">
            <AlertDescription className="text-red-300">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Tab Navigation */}
        <div className="flex space-x-4 mb-6">
          <Button
            onClick={() => setActiveTab('users')}
            variant={activeTab === 'users' ? 'default' : 'outline'}
            className={activeTab === 'users' ? 'bg-purple-600 text-white' : 'border-purple-500/30 text-white hover:bg-purple-500/20'}
          >
            <Users className="h-4 w-4 mr-2" />
            Platform Users
          </Button>
          <Button
            onClick={() => setActiveTab('waitlist')}
            variant={activeTab === 'waitlist' ? 'default' : 'outline'}
            className={activeTab === 'waitlist' ? 'bg-purple-600 text-white' : 'border-purple-500/30 text-white hover:bg-purple-500/20'}
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Waitlist Management
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder={`Search ${activeTab}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-black/20 border-purple-500/30 text-white placeholder-gray-400"
              />
            </div>
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-48 bg-black/20 border-purple-500/30 text-white">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Users</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              {activeTab === 'waitlist' && (
                <>
                  <SelectItem value="waitlisted">Waitlisted</SelectItem>
                  <SelectItem value="early_access">Early Access</SelectItem>
                </>
              )}
            </SelectContent>
          </Select>
        </div>

        {/* Users Table */}
        <Card className="bg-black/20 backdrop-blur-md border-purple-500/30">
          <CardHeader>
            <CardTitle className="text-white">
              {activeTab === 'waitlist' ? 'Waitlist Users' : 'Platform Users'} ({totalUsers})
            </CardTitle>
            <CardDescription className="text-gray-300">
              {activeTab === 'waitlist' 
                ? 'Users waiting for early access to the platform' 
                : 'Registered users on the platform'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-white">Loading...</div>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow className="border-purple-500/30">
                      <TableHead className="text-gray-300">User</TableHead>
                      <TableHead className="text-gray-300">Email</TableHead>
                      {activeTab === 'waitlist' ? (
                        <>
                          <TableHead className="text-gray-300">Referrals</TableHead>
                          <TableHead className="text-gray-300">Credits</TableHead>
                          <TableHead className="text-gray-300">Status</TableHead>
                        </>
                      ) : (
                        <>
                          <TableHead className="text-gray-300">Plan</TableHead>
                          <TableHead className="text-gray-300">Credits</TableHead>
                          <TableHead className="text-gray-300">Last Login</TableHead>
                          <TableHead className="text-gray-300">Status</TableHead>
                        </>
                      )}
                      <TableHead className="text-gray-300">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activeTab === 'waitlist' ? (
                      waitlistUsers.map((user) => (
                        <TableRow key={user.id} className="border-purple-500/30">
                          <TableCell className="text-white">
                            <div>
                              <div className="font-medium">{user.name}</div>
                              <div className="text-sm text-gray-400">ID: {user.id}</div>
                            </div>
                          </TableCell>
                          <TableCell className="text-white">{user.email}</TableCell>
                          <TableCell className="text-white">
                            <div className="flex items-center space-x-2">
                              <span>{user.referralCount}</span>
                              <Badge variant="outline" className="text-xs">
                                {user.referralCode}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell className="text-white">{user.credits}</TableCell>
                          <TableCell>{getStatusBadge(user.status)}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                onClick={() => handleWaitlistAction(user.id, 'grant-early-access')}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                Grant Access
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleWaitlistAction(user.id, 'remove')}
                                className="border-red-500 text-red-500 hover:bg-red-500/20"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      users.map((user) => (
                        <TableRow key={user.id} className="border-purple-500/30">
                          <TableCell className="text-white">
                            <div>
                              <div className="font-medium">{user.username}</div>
                              <div className="text-sm text-gray-400">{user.displayName || 'No display name'}</div>
                            </div>
                          </TableCell>
                          <TableCell className="text-white">{user.email}</TableCell>
                          <TableCell>{getPlanBadge(user.plan)}</TableCell>
                          <TableCell className="text-white">
                            <div className="flex items-center space-x-2">
                              <CreditCard className="h-4 w-4" />
                              <span>{user.credits}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-white">
                            {formatDate(user.lastLogin)}
                          </TableCell>
                          <TableCell>{getStatusBadge(user.status)}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleUserAction(user.id, 'view')}
                                className="border-purple-500/30 text-white hover:bg-purple-500/20"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleUserAction(user.id, 'edit')}
                                className="border-blue-500/30 text-blue-400 hover:bg-blue-500/20"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>

                {/* Pagination */}
                <div className="flex justify-between items-center mt-6">
                  <div className="text-sm text-gray-400">
                    Showing {Math.min((currentPage - 1) * 10 + 1, totalUsers)} to {Math.min(currentPage * 10, totalUsers)} of {totalUsers} users
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="border-purple-500/30 text-white hover:bg-purple-500/20"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-white px-3 py-1">
                      Page {currentPage} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="border-purple-500/30 text-white hover:bg-purple-500/20"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}