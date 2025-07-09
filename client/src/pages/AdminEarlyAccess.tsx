import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Users, 
  Mail, 
  Crown, 
  Target, 
  TrendingUp, 
  UserCheck, 
  Clock, 
  Search,
  Filter,
  ChevronUp,
  ChevronDown,
  Send
} from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface WaitlistUser {
  id: string;
  name: string;
  email: string;
  referralCode: string;
  referredBy: string | null;
  referralCount: number;
  credits: number;
  status: 'waitlisted' | 'early_access' | 'approved';
  dailyLogins: number;
  feedbackSubmitted: boolean;
  createdAt: string;
  updatedAt: string;
  approvedAt?: string;
}

interface AdminStats {
  totalUsers: number;
  todaySignups: number;
  totalReferrals: number;
  averageReferrals: number;
  statusBreakdown: Record<string, number>;
  topReferrers: WaitlistUser[];
  recentSignups: WaitlistUser[];
  earlyAccessUsers: number;
  pendingApprovals: number;
}

export default function AdminEarlyAccess() {
  const [users, setUsers] = useState<WaitlistUser[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('referralCount');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [selectedUserForEmail, setSelectedUserForEmail] = useState<WaitlistUser | null>(null);
  const [processingAction, setProcessingAction] = useState<string | null>(null);

  // Mock admin token for development
  const adminToken = 'admin-token-123';

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load users
      const usersResponse = await fetch('/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      });
      
      if (usersResponse.ok) {
        const usersData = await usersResponse.json();
        setUsers(usersData.users || []);
      }

      // Load stats
      const statsResponse = await fetch('/api/admin/stats', {
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      });
      
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData.stats);
      }
    } catch (error) {
      console.error('Error loading admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const upgradeUser = async (userId: string, credits: number = 100) => {
    try {
      setProcessingAction(`upgrade-${userId}`);
      
      const response = await fetch('/api/admin/upgrade-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({ userId, credits })
      });

      if (response.ok) {
        await loadData(); // Refresh data
      }
    } catch (error) {
      console.error('Error upgrading user:', error);
    } finally {
      setProcessingAction(null);
    }
  };

  const bulkUpgrade = async (credits: number = 100) => {
    try {
      setProcessingAction('bulk-upgrade');
      
      const response = await fetch('/api/admin/bulk-upgrade', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({ 
          userIds: Array.from(selectedUsers), 
          credits 
        })
      });

      if (response.ok) {
        setSelectedUsers(new Set());
        await loadData(); // Refresh data
      }
    } catch (error) {
      console.error('Error bulk upgrading users:', error);
    } finally {
      setProcessingAction(null);
    }
  };

  const sendEmail = async (userId: string) => {
    try {
      setProcessingAction(`email-${userId}`);
      
      const response = await fetch('/api/admin/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({ userId })
      });

      if (response.ok) {
        setEmailModalOpen(false);
        setSelectedUserForEmail(null);
      }
    } catch (error) {
      console.error('Error sending email:', error);
    } finally {
      setProcessingAction(null);
    }
  };

  const getReferralBadge = (referralCount: number) => {
    if (referralCount >= 10) return { icon: '🎯', label: 'Top Referrer', color: 'bg-yellow-500' };
    if (referralCount >= 5) return { icon: '💎', label: 'Super Referrer', color: 'bg-purple-500' };
    if (referralCount >= 3) return { icon: '🚀', label: 'Active Referrer', color: 'bg-blue-500' };
    if (referralCount >= 1) return { icon: '⭐', label: 'Referrer', color: 'bg-green-500' };
    return null;
  };

  const filteredAndSortedUsers = users
    .filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      const aValue = a[sortBy as keyof WaitlistUser];
      const bValue = b[sortBy as keyof WaitlistUser];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      }
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      return 0;
    });

  const toggleUserSelection = (userId: string) => {
    const newSelected = new Set(selectedUsers);
    if (newSelected.has(userId)) {
      newSelected.delete(userId);
    } else {
      newSelected.add(userId);
    }
    setSelectedUsers(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedUsers.size === filteredAndSortedUsers.length) {
      setSelectedUsers(new Set());
    } else {
      setSelectedUsers(new Set(filteredAndSortedUsers.map(u => u.id)));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
            <p className="text-white">Loading admin panel...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 pt-10">
          <h1 className="text-4xl font-bold text-white mb-2">
            Early Access Admin Panel
          </h1>
          <p className="text-gray-300">
            Manage waitlist users and early access approvals
          </p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-300">Total Users</p>
                    <p className="text-2xl font-bold">{stats.totalUsers}</p>
                  </div>
                  <Users className="w-8 h-8 text-purple-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-300">Early Access</p>
                    <p className="text-2xl font-bold">{stats.earlyAccessUsers}</p>
                  </div>
                  <UserCheck className="w-8 h-8 text-green-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-300">Pending Approvals</p>
                    <p className="text-2xl font-bold">{stats.pendingApprovals}</p>
                  </div>
                  <Clock className="w-8 h-8 text-yellow-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-300">Today's Signups</p>
                    <p className="text-2xl font-bold">{stats.todaySignups}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-blue-400" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Content */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-2xl">Waitlist Management</CardTitle>
              <div className="flex space-x-2">
                {selectedUsers.size > 0 && (
                  <Button
                    onClick={() => bulkUpgrade(100)}
                    disabled={processingAction === 'bulk-upgrade'}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    {processingAction === 'bulk-upgrade' ? 'Upgrading...' : `Upgrade ${selectedUsers.size} Users`}
                  </Button>
                )}
                <Button
                  onClick={loadData}
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/20"
                >
                  Refresh
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Filters */}
            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex items-center space-x-2">
                <Search className="w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                />
              </div>
              
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-48 bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="waitlisted">Waitlisted</SelectItem>
                  <SelectItem value="early_access">Early Access</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48 bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="referralCount">Referral Count</SelectItem>
                  <SelectItem value="createdAt">Join Date</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="status">Status</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="border-white/20 text-white hover:bg-white/20"
              >
                {sortOrder === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </Button>
            </div>

            {/* Users Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/20">
                    <th className="text-left p-4">
                      <Checkbox
                        checked={selectedUsers.size === filteredAndSortedUsers.length && filteredAndSortedUsers.length > 0}
                        onCheckedChange={toggleSelectAll}
                      />
                    </th>
                    <th className="text-left p-4">User</th>
                    <th className="text-left p-4">Status</th>
                    <th className="text-left p-4">Referrals</th>
                    <th className="text-left p-4">Credits</th>
                    <th className="text-left p-4">Joined</th>
                    <th className="text-left p-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAndSortedUsers.map((user) => {
                    const referralBadge = getReferralBadge(user.referralCount);
                    return (
                      <tr key={user.id} className="border-b border-white/10 hover:bg-white/5">
                        <td className="p-4">
                          <Checkbox
                            checked={selectedUsers.has(user.id)}
                            onCheckedChange={() => toggleUserSelection(user.id)}
                          />
                        </td>
                        <td className="p-4">
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-sm text-gray-400">{user.email}</div>
                            <div className="text-xs text-gray-500">Code: {user.referralCode}</div>
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge 
                            className={
                              user.status === 'early_access' ? 'bg-green-500' :
                              user.status === 'approved' ? 'bg-blue-500' :
                              'bg-yellow-500'
                            }
                          >
                            {user.status}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center space-x-2">
                            <span className="text-2xl font-bold">{user.referralCount}</span>
                            {referralBadge && (
                              <Badge className={referralBadge.color}>
                                {referralBadge.icon} {referralBadge.label}
                              </Badge>
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="font-medium">{user.credits}</span>
                        </td>
                        <td className="p-4">
                          <span className="text-sm text-gray-400">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex space-x-2">
                            {user.status !== 'early_access' && (
                              <Button
                                onClick={() => upgradeUser(user.id)}
                                disabled={processingAction === `upgrade-${user.id}`}
                                size="sm"
                                className="bg-purple-600 hover:bg-purple-700"
                              >
                                {processingAction === `upgrade-${user.id}` ? 'Upgrading...' : 'Grant Access'}
                              </Button>
                            )}
                            <Button
                              onClick={() => {
                                setSelectedUserForEmail(user);
                                setEmailModalOpen(true);
                              }}
                              disabled={processingAction === `email-${user.id}`}
                              size="sm"
                              variant="outline"
                              className="border-white/20 text-white hover:bg-white/20"
                            >
                              <Mail className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {filteredAndSortedUsers.length === 0 && (
              <div className="text-center py-8 text-gray-400">
                No users found matching your criteria.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Email Modal */}
        <Dialog open={emailModalOpen} onOpenChange={setEmailModalOpen}>
          <DialogContent className="bg-slate-900 border-white/20 text-white">
            <DialogHeader>
              <DialogTitle>Send Early Access Email</DialogTitle>
              <DialogDescription>
                Send approval email to {selectedUserForEmail?.name}
              </DialogDescription>
            </DialogHeader>
            
            {selectedUserForEmail && (
              <div className="space-y-4">
                <div className="p-4 bg-white/10 rounded-lg">
                  <p><strong>Name:</strong> {selectedUserForEmail.name}</p>
                  <p><strong>Email:</strong> {selectedUserForEmail.email}</p>
                  <p><strong>Status:</strong> {selectedUserForEmail.status}</p>
                  <p><strong>Referrals:</strong> {selectedUserForEmail.referralCount}</p>
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setEmailModalOpen(false)}
                    className="border-white/20 text-white hover:bg-white/20"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => sendEmail(selectedUserForEmail.id)}
                    disabled={processingAction === `email-${selectedUserForEmail.id}`}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    {processingAction === `email-${selectedUserForEmail.id}` ? 'Sending...' : 'Send Email'}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}