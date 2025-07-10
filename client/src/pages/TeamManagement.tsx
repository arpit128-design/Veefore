import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, UserPlus, Crown, Shield, Edit, Trash2, MoreVertical, Search, Download,
  Clock, Activity, TrendingUp, MessageSquare, Award, Mail, Copy, Settings,
  CheckCircle, XCircle, Eye, UserCheck, AlertTriangle, Key, Star, Zap, Target,
  Filter, Calendar, BarChart3, FileText, Video, Phone, Headphones, Globe,
  Briefcase, Code, Palette, Camera, Megaphone, TrendingDown, UserX, UserMinus,
  Plus, Minus, RotateCcw, RefreshCw, Archive, Bookmark, Tag, Hash, AtSign,
  ChevronRight, ChevronDown, ExternalLink, LinkIcon, Wifi, WifiOff
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/hooks/useAuth';
import { useWorkspace } from '@/hooks/useWorkspace';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

// Enhanced role system with more detailed permissions
const enhancedRolePermissions = {
  owner: {
    label: 'Owner',
    color: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white',
    icon: Crown,
    description: 'Full control over workspace and team management',
    permissions: {
      can: [
        'Full workspace access',
        'Manage all team members',
        'Delete workspace',
        'Change workspace settings',
        'Manage billing and subscriptions',
        'Access all features and integrations',
        'Export all data',
        'Manage API keys and webhooks'
      ],
      cannot: []
    }
  },
  admin: {
    label: 'Administrator',
    color: 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white',
    icon: Shield,
    description: 'Advanced management capabilities with most permissions',
    permissions: {
      can: [
        'Manage team members',
        'Edit workspace settings',
        'Access all content features',
        'Manage automation rules',
        'View analytics and reports',
        'Manage integrations',
        'Create and schedule content',
        'Moderate team conversations'
      ],
      cannot: [
        'Delete workspace',
        'Remove owner',
        'Manage billing'
      ]
    }
  },
  manager: {
    label: 'Manager',
    color: 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white',
    icon: Briefcase,
    description: 'Team leadership with content and project management',
    permissions: {
      can: [
        'Manage team projects',
        'Create and edit content',
        'Schedule posts',
        'View team analytics',
        'Assign tasks to team members',
        'Manage content calendar',
        'Access automation features',
        'Moderate team discussions'
      ],
      cannot: [
        'Add/remove team members',
        'Change workspace settings',
        'Access billing information',
        'Manage API integrations'
      ]
    }
  },
  editor: {
    label: 'Content Editor',
    color: 'bg-gradient-to-r from-orange-500 to-red-500 text-white',
    icon: Edit,
    description: 'Content creation and editing specialist',
    permissions: {
      can: [
        'Create and edit content',
        'Upload media files',
        'Schedule posts',
        'Use AI content tools',
        'Access content templates',
        'Collaborate on drafts',
        'View content analytics',
        'Manage content tags'
      ],
      cannot: [
        'Manage team members',
        'Delete published content',
        'Access workspace settings',
        'Manage automations'
      ]
    }
  },
  designer: {
    label: 'Visual Designer',
    color: 'bg-gradient-to-r from-pink-500 to-purple-500 text-white',
    icon: Palette,
    description: 'Creative specialist for visual content and branding',
    permissions: {
      can: [
        'Create visual content',
        'Design graphics and thumbnails',
        'Manage brand assets',
        'Access design tools',
        'Create content templates',
        'Collaborate on visual projects',
        'Upload and organize media',
        'Preview content layouts'
      ],
      cannot: [
        'Publish content directly',
        'Manage team members',
        'Access analytics',
        'Manage automations'
      ]
    }
  },
  analyst: {
    label: 'Data Analyst',
    color: 'bg-gradient-to-r from-indigo-500 to-blue-500 text-white',
    icon: BarChart3,
    description: 'Performance analysis and reporting specialist',
    permissions: {
      can: [
        'View all analytics',
        'Create custom reports',
        'Export data and insights',
        'Track performance metrics',
        'Analyze audience insights',
        'Monitor engagement trends',
        'Access competitive analysis',
        'Generate performance summaries'
      ],
      cannot: [
        'Create or edit content',
        'Manage team members',
        'Change workspace settings',
        'Access content creation tools'
      ]
    }
  },
  developer: {
    label: 'Developer',
    color: 'bg-gradient-to-r from-gray-700 to-gray-900 text-white',
    icon: Code,
    description: 'Technical specialist for integrations and automation',
    permissions: {
      can: [
        'Manage API integrations',
        'Create custom automations',
        'Access webhook settings',
        'Configure third-party tools',
        'Debug technical issues',
        'Manage custom code snippets',
        'Access developer tools',
        'Monitor system performance'
      ],
      cannot: [
        'Manage team members',
        'Delete workspace',
        'Access billing information',
        'Manage content directly'
      ]
    }
  },
  viewer: {
    label: 'Viewer',
    color: 'bg-gradient-to-r from-gray-400 to-gray-600 text-white',
    icon: Eye,
    description: 'Read-only access to workspace content',
    permissions: {
      can: [
        'View published content',
        'Access content calendar',
        'View basic analytics',
        'Comment on content',
        'Access shared resources',
        'View team activity',
        'Export allowed reports',
        'Participate in discussions'
      ],
      cannot: [
        'Create or edit content',
        'Manage team members',
        'Access workspace settings',
        'Use AI tools'
      ]
    }
  }
};

// Team member interface
interface TeamMember {
  id: number;
  userId: number;
  workspaceId: number;
  role: string;
  status: string;
  joinedAt: string;
  lastActiveAt?: string;
  permissions: string[];
  department?: string;
  position?: string;
  skills?: string[];
  user: {
    id: number;
    username: string;
    email: string;
    displayName: string;
    avatar: string;
    timezone?: string;
    language?: string;
  };
}

// Enhanced team invitation interface
interface TeamInvitation {
  id: number;
  email: string;
  role: string;
  status: string;
  createdAt: string;
  expiresAt: string;
  invitedBy: number;
  department?: string;
  message?: string;
  permissions?: string[];
}

// Enhanced team statistics
interface TeamStats {
  totalMembers: number;
  activeMembers: number;
  pendingInvites: number;
  monthlyActivity: number;
  averageResponseTime: string;
  collaborationScore: number;
  contentContributions: number;
  tasksCompleted: number;
  projectsActive: number;
  departmentDistribution: { [key: string]: number };
}

export default function TeamManagement() {
  const { user } = useAuth();
  const { currentWorkspace } = useWorkspace();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Enhanced state management
  const [selectedTab, setSelectedTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [bulkActionMode, setBulkActionMode] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState<number[]>([]);
  
  // Enhanced invite form state
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('viewer');
  const [inviteDepartment, setInviteDepartment] = useState('');
  const [inviteMessage, setInviteMessage] = useState('');
  const [invitePermissions, setInvitePermissions] = useState<string[]>([]);

  // Fetch team members
  const { data: members = [], isLoading: membersLoading } = useQuery({
    queryKey: [`/api/workspaces/${currentWorkspace?.id}/members`],
    enabled: !!currentWorkspace?.id,
  });

  // Fetch team invitations
  const { data: invitations = [], isLoading: invitationsLoading } = useQuery({
    queryKey: [`/api/workspaces/${currentWorkspace?.id}/invitations`],
    enabled: !!currentWorkspace?.id,
  });

  // Enhanced team statistics
  const teamStats: TeamStats = {
    totalMembers: members.length,
    activeMembers: members.filter((m: TeamMember) => m.lastActiveAt && 
      new Date(m.lastActiveAt) > new Date(Date.now() - 24 * 60 * 60 * 1000)).length,
    pendingInvites: invitations.filter((i: TeamInvitation) => i.status === 'pending').length,
    monthlyActivity: 85,
    averageResponseTime: '2.3h',
    collaborationScore: 94,
    contentContributions: 127,
    tasksCompleted: 89,
    projectsActive: 12,
    departmentDistribution: {
      'Content': 3,
      'Design': 2,
      'Marketing': 4,
      'Analytics': 2,
      'Development': 1
    }
  };

  // Permission checks
  const canManageTeam = user?.id === currentWorkspace?.userId || members.find(
    (m: TeamMember) => m.userId === user?.id && ['owner', 'admin', 'manager'].includes(m.role)
  );

  // Enhanced filtering
  const filteredMembers = members.filter((member: TeamMember) => {
    const matchesSearch = member.user.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.user.username?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || member.role === filterRole;
    const matchesStatus = filterStatus === 'all' || member.status === filterStatus;
    const matchesDepartment = filterDepartment === 'all' || member.department === filterDepartment;
    
    return matchesSearch && matchesRole && matchesStatus && matchesDepartment;
  });

  const filteredInvitations = invitations.filter((invitation: TeamInvitation) => {
    const matchesSearch = invitation.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || invitation.role === filterRole;
    const matchesDepartment = filterDepartment === 'all' || invitation.department === filterDepartment;
    
    return matchesSearch && matchesRole && matchesDepartment;
  });

  // Enhanced invite mutation
  const inviteMutation = useMutation({
    mutationFn: async (inviteData: {
      email: string;
      role: string;
      department?: string;
      message?: string;
      permissions?: string[];
    }) => {
      return apiRequest(`/api/workspaces/${currentWorkspace?.id}/invitations`, {
        method: 'POST',
        body: JSON.stringify(inviteData),
        headers: { 'Content-Type': 'application/json' },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/workspaces/${currentWorkspace?.id}/invitations`] });
      setInviteDialogOpen(false);
      setInviteEmail('');
      setInviteRole('viewer');
      setInviteDepartment('');
      setInviteMessage('');
      setInvitePermissions([]);
      toast({ title: 'Invitation sent successfully!' });
    },
    onError: (error) => {
      toast({ title: 'Failed to send invitation', description: error.message, variant: 'destructive' });
    },
  });

  // Enhanced invite form handler
  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    inviteMutation.mutate({
      email: inviteEmail,
      role: inviteRole,
      department: inviteDepartment,
      message: inviteMessage,
      permissions: invitePermissions
    });
  };

  // Bulk actions
  const handleBulkAction = (action: string) => {
    console.log(`Performing bulk action: ${action} on members:`, selectedMembers);
    toast({ title: `Bulk action: ${action}`, description: `Applied to ${selectedMembers.length} members` });
    setSelectedMembers([]);
    setBulkActionMode(false);
  };

  // Loading state
  if (membersLoading || invitationsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-slate-200 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-32 bg-slate-200 rounded-lg"></div>
              ))}
            </div>
            <div className="h-96 bg-slate-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        
        {/* Enhanced Header with Gradient Background */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 p-8 text-white">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-xl bg-white/20 backdrop-blur-sm">
                  <Users className="h-8 w-8" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold">Team Management</h1>
                  <p className="text-blue-100 mt-1">Manage your workspace team with advanced controls</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="text-2xl font-bold">{teamStats.totalMembers}</div>
                  <div className="text-sm text-blue-100">Active Members</div>
                </div>
                
                {canManageTeam && (
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      className="bg-white/20 border-white/30 text-white hover:bg-white/30"
                      onClick={() => setBulkActionMode(!bulkActionMode)}
                    >
                      {bulkActionMode ? <Minus className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                      Bulk Actions
                    </Button>
                    <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
                      <DialogTrigger asChild>
                        <Button className="bg-white text-blue-600 hover:bg-blue-50">
                          <UserPlus className="w-4 h-4 mr-2" />
                          Invite Member
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle className="text-2xl font-bold">Invite Team Member</DialogTitle>
                          <DialogDescription>
                            Send an invitation to join your workspace with customized permissions and role.
                          </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleInviteSubmit} className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="email">Email Address</Label>
                              <Input
                                id="email"
                                type="email"
                                value={inviteEmail}
                                onChange={(e) => setInviteEmail(e.target.value)}
                                placeholder="colleague@company.com"
                                className="mt-1"
                                required
                              />
                            </div>
                            <div>
                              <Label htmlFor="role">Role</Label>
                              <Select value={inviteRole} onValueChange={setInviteRole}>
                                <SelectTrigger className="mt-1">
                                  <SelectValue placeholder="Select a role" />
                                </SelectTrigger>
                                <SelectContent>
                                  {Object.entries(enhancedRolePermissions).map(([key, role]) => (
                                    <SelectItem key={key} value={key}>
                                      <div className="flex items-center space-x-2">
                                        <role.icon className="w-4 h-4" />
                                        <span>{role.label}</span>
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          
                          <div>
                            <Label htmlFor="department">Department (Optional)</Label>
                            <Select value={inviteDepartment} onValueChange={setInviteDepartment}>
                              <SelectTrigger className="mt-1">
                                <SelectValue placeholder="Select department" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="content">Content & Marketing</SelectItem>
                                <SelectItem value="design">Design & Creative</SelectItem>
                                <SelectItem value="analytics">Analytics & Data</SelectItem>
                                <SelectItem value="development">Development & Tech</SelectItem>
                                <SelectItem value="management">Management & Strategy</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div>
                            <Label htmlFor="message">Personal Message (Optional)</Label>
                            <Input
                              id="message"
                              value={inviteMessage}
                              onChange={(e) => setInviteMessage(e.target.value)}
                              placeholder="Welcome to our team! Looking forward to working together."
                              className="mt-1"
                            />
                          </div>
                          
                          <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setInviteDialogOpen(false)}>
                              Cancel
                            </Button>
                            <Button type="submit" disabled={inviteMutation.isPending}>
                              {inviteMutation.isPending ? "Sending..." : "Send Invitation"}
                            </Button>
                          </DialogFooter>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Statistics Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Total Members</p>
                  <p className="text-3xl font-bold text-slate-900">{teamStats.totalMembers}</p>
                </div>
                <div className="p-3 rounded-xl bg-blue-100">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Active Now</p>
                  <p className="text-3xl font-bold text-emerald-600">{teamStats.activeMembers}</p>
                </div>
                <div className="p-3 rounded-xl bg-emerald-100">
                  <Activity className="h-6 w-6 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Pending Invites</p>
                  <p className="text-3xl font-bold text-orange-600">{teamStats.pendingInvites}</p>
                </div>
                <div className="p-3 rounded-xl bg-orange-100">
                  <Clock className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Collaboration</p>
                  <p className="text-3xl font-bold text-purple-600">{teamStats.collaborationScore}</p>
                </div>
                <div className="p-3 rounded-xl bg-purple-100">
                  <Award className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Content Created</p>
                  <p className="text-3xl font-bold text-indigo-600">{teamStats.contentContributions}</p>
                </div>
                <div className="p-3 rounded-xl bg-indigo-100">
                  <FileText className="h-6 w-6 text-indigo-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Active Projects</p>
                  <p className="text-3xl font-bold text-cyan-600">{teamStats.projectsActive}</p>
                </div>
                <div className="p-3 rounded-xl bg-cyan-100">
                  <Target className="h-6 w-6 text-cyan-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Controls Bar */}
        <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search team members..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white/50"
                  />
                </div>
                <div className="flex gap-2">
                  <Select value={filterRole} onValueChange={setFilterRole}>
                    <SelectTrigger className="w-40 bg-white/50">
                      <SelectValue placeholder="Filter by role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Roles</SelectItem>
                      {Object.entries(enhancedRolePermissions).map(([key, role]) => (
                        <SelectItem key={key} value={key}>{role.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={filterDepartment} onValueChange={setFilterDepartment}>
                    <SelectTrigger className="w-40 bg-white/50">
                      <SelectValue placeholder="Department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Departments</SelectItem>
                      <SelectItem value="content">Content</SelectItem>
                      <SelectItem value="design">Design</SelectItem>
                      <SelectItem value="analytics">Analytics</SelectItem>
                      <SelectItem value="development">Development</SelectItem>
                      <SelectItem value="management">Management</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  Grid
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  List
                </Button>
                <Button
                  variant={viewMode === 'analytics' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('analytics')}
                >
                  Analytics
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bulk Actions Bar */}
        {bulkActionMode && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-blue-600 text-white p-4 rounded-lg shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="font-medium">
                  {selectedMembers.length} member{selectedMembers.length !== 1 ? 's' : ''} selected
                </span>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-white/20 border-white/30 text-white hover:bg-white/30"
                    onClick={() => handleBulkAction('change-role')}
                    disabled={selectedMembers.length === 0}
                  >
                    Change Role
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-white/20 border-white/30 text-white hover:bg-white/30"
                    onClick={() => handleBulkAction('send-message')}
                    disabled={selectedMembers.length === 0}
                  >
                    Send Message
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-red-500/20 border-red-300/30 text-white hover:bg-red-500/30"
                    onClick={() => handleBulkAction('remove')}
                    disabled={selectedMembers.length === 0}
                  >
                    Remove
                  </Button>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
                onClick={() => {
                  setBulkActionMode(false);
                  setSelectedMembers([]);
                }}
              >
                <XCircle className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        )}

        {/* Enhanced Tab Navigation */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 bg-white/60 backdrop-blur-sm border-0 shadow-lg">
            <TabsTrigger value="overview" className="data-[state=active]:bg-white data-[state=active]:shadow-md">
              <BarChart3 className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="members" className="data-[state=active]:bg-white data-[state=active]:shadow-md">
              <Users className="h-4 w-4 mr-2" />
              Members ({filteredMembers.length})
            </TabsTrigger>
            <TabsTrigger value="invitations" className="data-[state=active]:bg-white data-[state=active]:shadow-md">
              <Mail className="h-4 w-4 mr-2" />
              Invitations ({filteredInvitations.length})
            </TabsTrigger>
            <TabsTrigger value="roles" className="data-[state=active]:bg-white data-[state=active]:shadow-md">
              <Shield className="h-4 w-4 mr-2" />
              Roles & Permissions
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-white data-[state=active]:shadow-md">
              <TrendingUp className="h-4 w-4 mr-2" />
              Team Analytics
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-white data-[state=active]:shadow-md">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Department Distribution */}
              <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Briefcase className="h-5 w-5" />
                    <span>Department Distribution</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(teamStats.departmentDistribution).map(([dept, count]) => (
                      <div key={dept} className="flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-700">{dept}</span>
                        <div className="flex items-center space-x-2">
                          <Progress value={(count / teamStats.totalMembers) * 100} className="w-20" />
                          <span className="text-sm font-bold text-slate-900">{count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Team Activity */}
              <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Activity className="h-5 w-5" />
                    <span>Team Activity</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-700">Tasks Completed</span>
                      <span className="text-lg font-bold text-emerald-600">{teamStats.tasksCompleted}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-700">Content Created</span>
                      <span className="text-lg font-bold text-blue-600">{teamStats.contentContributions}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-700">Projects Active</span>
                      <span className="text-lg font-bold text-purple-600">{teamStats.projectsActive}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-700">Avg Response Time</span>
                      <span className="text-lg font-bold text-orange-600">{teamStats.averageResponseTime}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Members Tab */}
          <TabsContent value="members" className="space-y-6">
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredMembers.map((member: TeamMember, index: number) => {
                  const role = enhancedRolePermissions[member.role as keyof typeof enhancedRolePermissions];
                  const RoleIcon = role?.icon || UserCheck;
                  const isOnline = member.lastActiveAt && new Date(member.lastActiveAt) > new Date(Date.now() - 10 * 60 * 1000);
                  
                  return (
                    <motion.div
                      key={member.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                        <CardContent className="p-6">
                          <div className="flex items-start space-x-4">
                            {bulkActionMode && (
                              <div className="mt-2">
                                <input
                                  type="checkbox"
                                  checked={selectedMembers.includes(member.id)}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setSelectedMembers([...selectedMembers, member.id]);
                                    } else {
                                      setSelectedMembers(selectedMembers.filter(id => id !== member.id));
                                    }
                                  }}
                                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                              </div>
                            )}
                            
                            <div className="relative">
                              <Avatar className="h-16 w-16 border-4 border-white shadow-lg">
                                <AvatarImage src={member.user.avatar} alt={member.user.displayName || member.user.username} />
                                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold text-lg">
                                  {member.user.displayName 
                                    ? member.user.displayName.split(' ').map(n => n[0]).join('')
                                    : member.user.username.substring(0, 2).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              {isOnline && (
                                <div className="absolute -top-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full border-4 border-white flex items-center justify-center">
                                  <Wifi className="w-3 h-3 text-white" />
                                </div>
                              )}
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-2">
                                <h3 className="font-bold text-lg text-slate-900 truncate">
                                  {member.user.displayName || member.user.username}
                                </h3>
                                {member.role === 'owner' && (
                                  <Crown className="h-5 w-5 text-purple-600" />
                                )}
                              </div>
                              
                              <p className="text-sm text-slate-600 mb-1">@{member.user.username}</p>
                              <p className="text-sm text-slate-500 mb-3">{member.user.email}</p>
                              
                              <div className="flex items-center space-x-2 mb-3">
                                <Badge className={`${role?.color || "bg-slate-100 text-slate-800"} shadow-sm`}>
                                  <RoleIcon className="w-3 h-3 mr-1" />
                                  {role?.label || member.role}
                                </Badge>
                                {member.department && (
                                  <Badge variant="outline" className="border-slate-300 text-slate-700">
                                    {member.department}
                                  </Badge>
                                )}
                              </div>
                              
                              <div className="flex items-center justify-between text-xs text-slate-500">
                                <span>Joined {new Date(member.joinedAt).toLocaleDateString()}</span>
                                {isOnline ? (
                                  <span className="text-emerald-600 font-medium">Online</span>
                                ) : (
                                  <span>Last seen {member.lastActiveAt ? new Date(member.lastActiveAt).toLocaleDateString() : 'Never'}</span>
                                )}
                              </div>
                            </div>
                            
                            {canManageTeam && member.userId !== user?.id && (
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit Profile
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <MessageSquare className="h-4 w-4 mr-2" />
                                    Send Message
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Key className="h-4 w-4 mr-2" />
                                    Change Role
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="text-red-600">
                                    <UserX className="h-4 w-4 mr-2" />
                                    Remove Member
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-0">
                  <div className="divide-y divide-slate-200">
                    {filteredMembers.map((member: TeamMember, index: number) => {
                      const role = enhancedRolePermissions[member.role as keyof typeof enhancedRolePermissions];
                      const RoleIcon = role?.icon || UserCheck;
                      const isOnline = member.lastActiveAt && new Date(member.lastActiveAt) > new Date(Date.now() - 10 * 60 * 1000);
                      
                      return (
                        <motion.div
                          key={member.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          className="p-6 hover:bg-white/50 transition-colors"
                        >
                          <div className="flex items-center space-x-4">
                            {bulkActionMode && (
                              <input
                                type="checkbox"
                                checked={selectedMembers.includes(member.id)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedMembers([...selectedMembers, member.id]);
                                  } else {
                                    setSelectedMembers(selectedMembers.filter(id => id !== member.id));
                                  }
                                }}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              />
                            )}
                            
                            <div className="relative">
                              <Avatar className="h-12 w-12 border-2 border-white shadow-md">
                                <AvatarImage src={member.user.avatar} alt={member.user.displayName || member.user.username} />
                                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                                  {member.user.displayName 
                                    ? member.user.displayName.split(' ').map(n => n[0]).join('')
                                    : member.user.username.substring(0, 2).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              {isOnline && (
                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white">
                                  <Wifi className="w-2 h-2 text-white ml-0.5 mt-0.5" />
                                </div>
                              )}
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2 mb-1">
                                <h3 className="font-semibold text-slate-900 truncate">
                                  {member.user.displayName || member.user.username}
                                </h3>
                                {member.role === 'owner' && (
                                  <Crown className="h-4 w-4 text-purple-600" />
                                )}
                                {isOnline && (
                                  <Badge variant="outline" className="border-emerald-300 text-emerald-700 text-xs">
                                    Online
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-slate-600">@{member.user.username} • {member.user.email}</p>
                            </div>
                            
                            <div className="flex items-center space-x-3">
                              <Badge className={`${role?.color || "bg-slate-100 text-slate-800"} shadow-sm`}>
                                <RoleIcon className="w-3 h-3 mr-1" />
                                {role?.label || member.role}
                              </Badge>
                              {member.department && (
                                <Badge variant="outline" className="border-slate-300 text-slate-700">
                                  {member.department}
                                </Badge>
                              )}
                              <span className="text-xs text-slate-500">
                                Joined {new Date(member.joinedAt).toLocaleDateString()}
                              </span>
                            </div>
                            
                            {canManageTeam && member.userId !== user?.id && (
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit Profile
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <MessageSquare className="h-4 w-4 mr-2" />
                                    Send Message
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Key className="h-4 w-4 mr-2" />
                                    Change Role
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="text-red-600">
                                    <UserX className="h-4 w-4 mr-2" />
                                    Remove Member
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Invitations Tab */}
          <TabsContent value="invitations" className="space-y-6">
            <div className="grid gap-6">
              {filteredInvitations.length === 0 ? (
                <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
                  <CardContent className="p-12 text-center">
                    <Mail className="h-20 w-20 text-slate-400 mx-auto mb-6" />
                    <h3 className="text-2xl font-bold text-slate-900 mb-3">No pending invitations</h3>
                    <p className="text-slate-600 mb-6">All invitations have been accepted or there are no pending invites.</p>
                    {canManageTeam && (
                      <Button onClick={() => setInviteDialogOpen(true)}>
                        <UserPlus className="w-4 h-4 mr-2" />
                        Send New Invitation
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {filteredInvitations.map((invitation: TeamInvitation, index: number) => {
                    const role = enhancedRolePermissions[invitation.role as keyof typeof enhancedRolePermissions];
                    const RoleIcon = role?.icon || UserCheck;
                    const isExpired = new Date(invitation.expiresAt) < new Date();
                    
                    return (
                      <motion.div
                        key={invitation.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
                          <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                <Avatar className="h-14 w-14 border-2 border-dashed border-slate-300">
                                  <AvatarFallback className="bg-slate-100 text-slate-600">
                                    <Mail className="h-7 w-7" />
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  <h3 className="font-bold text-lg text-slate-900">{invitation.email}</h3>
                                  <div className="flex items-center space-x-3 mt-2">
                                    <Badge className={`${role?.color || "bg-slate-100 text-slate-800"} shadow-sm`}>
                                      <RoleIcon className="w-3 h-3 mr-1" />
                                      {role?.label || invitation.role}
                                    </Badge>
                                    {invitation.department && (
                                      <Badge variant="outline" className="border-slate-300 text-slate-700">
                                        {invitation.department}
                                      </Badge>
                                    )}
                                    <Badge 
                                      className={isExpired 
                                        ? "bg-red-100 text-red-800 border-red-200" 
                                        : "bg-orange-100 text-orange-800 border-orange-200"
                                      }
                                    >
                                      {isExpired ? (
                                        <>
                                          <XCircle className="w-3 h-3 mr-1" />
                                          Expired
                                        </>
                                      ) : (
                                        <>
                                          <Clock className="w-3 h-3 mr-1" />
                                          Pending
                                        </>
                                      )}
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-slate-500 mt-2">
                                    Invited {new Date(invitation.createdAt).toLocaleDateString()} • 
                                    Expires {new Date(invitation.expiresAt).toLocaleDateString()}
                                  </p>
                                  {invitation.message && (
                                    <p className="text-sm text-slate-600 mt-2 italic">"{invitation.message}"</p>
                                  )}
                                </div>
                              </div>
                              
                              {canManageTeam && (
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                      <MoreVertical className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem>
                                      <Copy className="h-4 w-4 mr-2" />
                                      Copy Invite Link
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <Mail className="h-4 w-4 mr-2" />
                                      Resend Invitation
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <Edit className="h-4 w-4 mr-2" />
                                      Edit Invitation
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="text-red-600">
                                      <Trash2 className="h-4 w-4 mr-2" />
                                      Cancel Invitation
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          </TabsContent>

          {/* Roles & Permissions Tab */}
          <TabsContent value="roles" className="space-y-6">
            <div className="grid gap-6">
              {Object.entries(enhancedRolePermissions).map(([roleKey, role]) => {
                const RoleIcon = role.icon;
                const memberCount = members.filter((m: TeamMember) => m.role === roleKey).length;
                
                return (
                  <Card key={roleKey} className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="p-4 rounded-xl bg-slate-100 border border-slate-200">
                            <RoleIcon className="h-8 w-8 text-slate-700" />
                          </div>
                          <div>
                            <CardTitle className="text-2xl text-slate-900">{role.label}</CardTitle>
                            <CardDescription className="text-slate-600 mt-1">{role.description}</CardDescription>
                          </div>
                        </div>
                        <Badge className={`${role.color} text-lg px-4 py-2`}>
                          {memberCount} member{memberCount !== 1 ? 's' : ''}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-8">
                        <div>
                          <h4 className="text-lg font-bold text-emerald-700 mb-4 flex items-center">
                            <CheckCircle className="h-5 w-5 mr-2" />
                            Permissions
                          </h4>
                          <ul className="space-y-3">
                            {role.permissions.can.map((permission, index) => (
                              <li key={index} className="flex items-start space-x-3 text-sm">
                                <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                                <span className="text-slate-700">{permission}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        {role.permissions.cannot.length > 0 && (
                          <div>
                            <h4 className="text-lg font-bold text-red-700 mb-4 flex items-center">
                              <XCircle className="h-5 w-5 mr-2" />
                              Restrictions
                            </h4>
                            <ul className="space-y-3">
                              {role.permissions.cannot.map((restriction, index) => (
                                <li key={index} className="flex items-start space-x-3 text-sm">
                                  <XCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                                  <span className="text-slate-700">{restriction}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Team Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5" />
                    <span>Team Performance</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-slate-700">Collaboration Score</span>
                        <span className="text-lg font-bold text-purple-600">{teamStats.collaborationScore}%</span>
                      </div>
                      <Progress value={teamStats.collaborationScore} className="h-2" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-slate-700">Monthly Activity</span>
                        <span className="text-lg font-bold text-blue-600">{teamStats.monthlyActivity}%</span>
                      </div>
                      <Progress value={teamStats.monthlyActivity} className="h-2" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-slate-700">Task Completion Rate</span>
                        <span className="text-lg font-bold text-emerald-600">92%</span>
                      </div>
                      <Progress value={92} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Award className="h-5 w-5" />
                    <span>Top Contributors</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {members.slice(0, 5).map((member: TeamMember, index: number) => (
                      <div key={member.id} className="flex items-center space-x-3">
                        <div className="text-lg font-bold text-slate-400">#{index + 1}</div>
                        <Avatar className="h-10 w-10 border-2 border-white shadow-md">
                          <AvatarImage src={member.user.avatar} alt={member.user.displayName || member.user.username} />
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                            {member.user.displayName 
                              ? member.user.displayName.split(' ').map(n => n[0]).join('')
                              : member.user.username.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="font-semibold text-slate-900">{member.user.displayName || member.user.username}</div>
                          <div className="text-sm text-slate-500">
                            {Math.floor(Math.random() * 50) + 10} contributions
                          </div>
                        </div>
                        <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
                          <Star className="w-3 h-3 mr-1" />
                          {(Math.random() * 2 + 8).toFixed(1)}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="h-5 w-5" />
                  <span>Team Settings</span>
                </CardTitle>
                <CardDescription>
                  Configure team management settings and permissions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">Team Permissions</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-slate-700">Allow team members to invite others</div>
                          <div className="text-sm text-slate-500">Members with admin or manager roles can send invitations</div>
                        </div>
                        <Button variant="outline" size="sm">Configure</Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-slate-700">Auto-approve team invitations</div>
                          <div className="text-sm text-slate-500">Automatically accept invitations from trusted domains</div>
                        </div>
                        <Button variant="outline" size="sm">Configure</Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-slate-700">Team activity notifications</div>
                          <div className="text-sm text-slate-500">Notify admins of important team activities</div>
                        </div>
                        <Button variant="outline" size="sm">Configure</Button>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">Security Settings</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-slate-700">Two-factor authentication</div>
                          <div className="text-sm text-slate-500">Require 2FA for all team members</div>
                        </div>
                        <Button variant="outline" size="sm">Configure</Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-slate-700">Session timeout</div>
                          <div className="text-sm text-slate-500">Automatically log out inactive users</div>
                        </div>
                        <Button variant="outline" size="sm">Configure</Button>
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