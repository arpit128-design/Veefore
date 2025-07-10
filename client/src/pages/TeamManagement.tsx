import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, UserPlus, Crown, Shield, Edit, Trash2, MoreVertical, Search, Download,
  Clock, Activity, TrendingUp, MessageSquare, Award, Mail, Copy, Settings,
  CheckCircle, XCircle, Eye, UserCheck, AlertTriangle, Key, Star, Zap, Target,
  Filter, Calendar, BarChart3, FileText, Video, Phone, Headphones, Globe,
  Briefcase, Code, Palette, Camera, Megaphone, TrendingDown, UserX, UserMinus,
  Plus, Minus, RotateCcw, RefreshCw, Archive, Bookmark, Tag, Hash, AtSign,
  ChevronRight, ChevronDown, ExternalLink, LinkIcon, Wifi, WifiOff, Layout,
  Grid3X3, List, LineChart, Building, GitBranch, MessageCircle, Bell, Clock4,
  Timer, ArrowUpRight, ArrowDownRight, Share2, Monitor, Smartphone, Tablet,
  Layers, Lock, Unlock, Database, PieChart, Cpu, HardDrive, Network, Gauge
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

// Ultra-detailed role system with comprehensive permissions
const advancedRolePermissions = {
  owner: {
    label: 'Workspace Owner',
    color: 'bg-gradient-to-r from-purple-600 to-indigo-700 text-white border-purple-300',
    icon: Crown,
    description: 'Ultimate authority with complete workspace control',
    tier: 'executive',
    privileges: [
      'Full administrative control',
      'Billing and subscription management',
      'Data export and security',
      'API key management',
      'Workspace deletion rights',
      'Legal compliance oversight',
      'Advanced analytics access',
      'Custom integration setup'
    ],
    restrictions: [],
    accessLevel: 10
  },
  cto: {
    label: 'Chief Technology Officer',
    color: 'bg-gradient-to-r from-blue-600 to-cyan-700 text-white border-blue-300',
    icon: Cpu,
    description: 'Technical leadership with system architecture authority',
    tier: 'executive',
    privileges: [
      'Technical architecture decisions',
      'API and webhook management',
      'Security protocol oversight',
      'Integration development',
      'System performance monitoring',
      'Developer tool access',
      'Technical team leadership',
      'Infrastructure management'
    ],
    restrictions: ['Billing access limited'],
    accessLevel: 9
  },
  admin: {
    label: 'System Administrator',
    color: 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white border-emerald-300',
    icon: Shield,
    description: 'Comprehensive management with advanced operational control',
    tier: 'management',
    privileges: [
      'User management and permissions',
      'Content moderation authority',
      'Automation rule configuration',
      'Analytics and reporting',
      'Team coordination tools',
      'Workspace settings control',
      'Security monitoring',
      'Compliance management'
    ],
    restrictions: ['No billing access', 'Cannot delete workspace'],
    accessLevel: 8
  },
  manager: {
    label: 'Project Manager',
    color: 'bg-gradient-to-r from-slate-600 to-gray-700 text-white border-slate-300',
    icon: Briefcase,
    description: 'Strategic oversight with team leadership capabilities',
    tier: 'management',
    privileges: [
      'Project planning and execution',
      'Team task assignment',
      'Content strategy development',
      'Performance tracking',
      'Resource allocation',
      'Quality assurance',
      'Timeline management',
      'Stakeholder communication'
    ],
    restrictions: ['Limited user management', 'No system settings'],
    accessLevel: 7
  },
  lead: {
    label: 'Team Lead',
    color: 'bg-gradient-to-r from-orange-600 to-red-600 text-white border-orange-300',
    icon: Star,
    description: 'Senior specialist with mentoring and quality control',
    tier: 'senior',
    privileges: [
      'Content review and approval',
      'Junior team mentoring',
      'Quality standards enforcement',
      'Process optimization',
      'Client communication',
      'Technical documentation',
      'Performance evaluation',
      'Training coordination'
    ],
    restrictions: ['No administrative access', 'Limited analytics'],
    accessLevel: 6
  },
  designer: {
    label: 'Creative Designer',
    color: 'bg-gradient-to-r from-pink-600 to-rose-700 text-white border-pink-300',
    icon: Palette,
    description: 'Visual content creation with design system authority',
    tier: 'specialist',
    privileges: [
      'Visual content creation',
      'Brand guideline enforcement',
      'Design system management',
      'Creative asset library',
      'Visual quality control',
      'Template development',
      'Style guide maintenance',
      'Creative tool access'
    ],
    restrictions: ['Content creation only', 'No user management'],
    accessLevel: 5
  },
  developer: {
    label: 'Software Developer',
    color: 'bg-gradient-to-r from-indigo-600 to-blue-700 text-white border-indigo-300',
    icon: Code,
    description: 'Technical implementation with automation development',
    tier: 'specialist',
    privileges: [
      'Automation script development',
      'API integration work',
      'Custom tool creation',
      'Technical troubleshooting',
      'Code review and testing',
      'Performance optimization',
      'Debug access',
      'Development environment'
    ],
    restrictions: ['Technical scope only', 'No content management'],
    accessLevel: 5
  },
  analyst: {
    label: 'Data Analyst',
    color: 'bg-gradient-to-r from-cyan-600 to-blue-700 text-white border-cyan-300',
    icon: BarChart3,
    description: 'Data insights with advanced analytics capabilities',
    tier: 'specialist',
    privileges: [
      'Advanced analytics access',
      'Custom report generation',
      'Data visualization tools',
      'Performance metric tracking',
      'Trend analysis',
      'ROI calculation',
      'Predictive modeling',
      'Dashboard customization'
    ],
    restrictions: ['Analytics focus only', 'No content creation'],
    accessLevel: 5
  },
  editor: {
    label: 'Content Editor',
    color: 'bg-gradient-to-r from-green-600 to-emerald-700 text-white border-green-300',
    icon: Edit,
    description: 'Content creation with editorial control',
    tier: 'contributor',
    privileges: [
      'Content creation and editing',
      'Publishing scheduling',
      'Content library access',
      'SEO optimization',
      'Engagement monitoring',
      'Content calendar management',
      'Draft collaboration',
      'Basic analytics viewing'
    ],
    restrictions: ['Content scope only', 'No team management'],
    accessLevel: 4
  },
  moderator: {
    label: 'Community Moderator',
    color: 'bg-gradient-to-r from-violet-600 to-purple-700 text-white border-violet-300',
    icon: MessageSquare,
    description: 'Community management with engagement oversight',
    tier: 'contributor',
    privileges: [
      'Community engagement',
      'Comment moderation',
      'User interaction management',
      'Response templates',
      'Engagement analytics',
      'Crisis communication',
      'Community guidelines enforcement',
      'Social listening'
    ],
    restrictions: ['Community focus only', 'No content creation'],
    accessLevel: 4
  },
  contributor: {
    label: 'Content Contributor',
    color: 'bg-gradient-to-r from-teal-600 to-cyan-700 text-white border-teal-300',
    icon: FileText,
    description: 'Basic content contribution with limited permissions',
    tier: 'contributor',
    privileges: [
      'Content draft creation',
      'Media upload',
      'Basic editing tools',
      'Comment submission',
      'Collaboration participation',
      'Template usage',
      'Content suggestions',
      'Review participation'
    ],
    restrictions: ['Draft creation only', 'No publishing rights'],
    accessLevel: 3
  },
  viewer: {
    label: 'Read-Only Viewer',
    color: 'bg-gradient-to-r from-gray-600 to-slate-700 text-white border-gray-300',
    icon: Eye,
    description: 'View-only access with limited interaction',
    tier: 'observer',
    privileges: [
      'Content viewing',
      'Dashboard access',
      'Basic analytics viewing',
      'Comment viewing',
      'Download published content',
      'Calendar viewing',
      'Team directory access',
      'Notification viewing'
    ],
    restrictions: ['View only', 'No editing capabilities'],
    accessLevel: 2
  }
};

// Enhanced team member interface
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
  timezone?: string;
  workload?: number;
  productivity?: number;
  contributionScore?: number;
  lastLogin?: string;
  deviceInfo?: string;
  locationInfo?: string;
  user: {
    id: number;
    username: string;
    email: string;
    displayName?: string;
    avatar?: string;
    phone?: string;
    location?: string;
    bio?: string;
    github?: string;
    linkedin?: string;
    portfolio?: string;
  };
}

// Enhanced invitation interface
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
  priority?: string;
  expectedStartDate?: string;
  salary?: string;
  benefits?: string[];
}

// Comprehensive team statistics
interface TeamStats {
  totalMembers: number;
  activeMembers: number;
  pendingInvites: number;
  averageProductivity: number;
  teamSatisfaction: number;
  collaborationIndex: number;
  skillCoverage: number;
  retentionRate: number;
  workloadBalance: number;
  responseTime: string;
  projectsCompleted: number;
  tasksInProgress: number;
  departmentDistribution: { [key: string]: number };
  roleDistribution: { [key: string]: number };
  timezoneCoverage: number;
  weeklyActivity: number[];
  monthlyGrowth: number;
  performanceMetrics: {
    contentCreated: number;
    bugsFixes: number;
    featuresDelivered: number;
    clientSatisfaction: number;
  };
}

export default function TeamManagement() {
  const { user } = useAuth();
  const { currentWorkspace } = useWorkspace();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Enhanced state management
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'kanban' | 'analytics'>('grid');
  const [sortBy, setSortBy] = useState<'name' | 'role' | 'joinDate' | 'activity' | 'productivity'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [bulkActionMode, setBulkActionMode] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState<number[]>([]);
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [memberDetailsDialog, setMemberDetailsDialog] = useState<number | null>(null);
  const [advancedFiltersOpen, setAdvancedFiltersOpen] = useState(false);

  // Invitation form state
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('contributor');
  const [inviteDepartment, setInviteDepartment] = useState('');
  const [inviteMessage, setInviteMessage] = useState('');
  const [invitePriority, setInvitePriority] = useState('normal');
  const [inviteStartDate, setInviteStartDate] = useState('');

  // Fetch team members
  const { data: members = [], isLoading: membersLoading } = useQuery({
    queryKey: ['/api/workspaces', currentWorkspace?.id, 'members'],
    enabled: !!currentWorkspace?.id,
  });

  // Fetch team invitations
  const { data: invitations = [], isLoading: invitationsLoading } = useQuery({
    queryKey: ['/api/workspaces', currentWorkspace?.id, 'invitations'],
    enabled: !!currentWorkspace?.id,
  });

  // Invite member mutation
  const inviteMutation = useMutation({
    mutationFn: async (inviteData: any) => {
      return apiRequest(`/api/workspaces/${currentWorkspace?.id}/invite`, {
        method: 'POST',
        body: JSON.stringify(inviteData),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/workspaces', currentWorkspace?.id, 'invitations'] });
      setInviteDialogOpen(false);
      setInviteEmail('');
      setInviteRole('contributor');
      setInviteDepartment('');
      setInviteMessage('');
      toast({
        title: "Invitation sent",
        description: "Team member invitation has been sent successfully.",
      });
    },
  });

  // Calculate team statistics
  const teamStats: TeamStats = useMemo(() => {
    return {
      totalMembers: members.length,
      activeMembers: members.filter((m: TeamMember) => 
        m.lastActiveAt && new Date(m.lastActiveAt) > new Date(Date.now() - 24 * 60 * 60 * 1000)
      ).length,
      pendingInvites: invitations.filter((i: TeamInvitation) => i.status === 'pending').length,
      averageProductivity: Math.round(members.reduce((sum: number, m: TeamMember) => sum + (m.productivity || 75), 0) / Math.max(members.length, 1)),
      teamSatisfaction: 87,
      collaborationIndex: 92,
      skillCoverage: 89,
      retentionRate: 95,
      workloadBalance: 78,
      responseTime: '2.3h',
      projectsCompleted: 24,
      tasksInProgress: 67,
      departmentDistribution: {
        'Content & Marketing': 4,
        'Design & Creative': 3,
        'Analytics & Data': 2,
        'Development & Tech': 3,
        'Management': 2
      },
      roleDistribution: members.reduce((acc: any, member: TeamMember) => {
        acc[member.role] = (acc[member.role] || 0) + 1;
        return acc;
      }, {}),
      timezoneCoverage: 18,
      weeklyActivity: [85, 92, 88, 95, 90, 78, 65],
      monthlyGrowth: 12,
      performanceMetrics: {
        contentCreated: 156,
        bugsFixes: 23,
        featuresDelivered: 8,
        clientSatisfaction: 94
      }
    };
  }, [members, invitations]);

  // Check permissions
  const currentUserMember = members.find((m: TeamMember) => m.userId === user?.id);
  const canManageTeam = currentUserMember && ['owner', 'cto', 'admin', 'manager'].includes(currentUserMember.role);

  // Filter and sort members
  const filteredMembers = useMemo(() => {
    let filtered = members.filter((member: TeamMember) => {
      const matchesSearch = member.user?.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           member.user?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           member.user?.email?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = filterRole === 'all' || member.role === filterRole;
      const matchesDepartment = filterDepartment === 'all' || member.department === filterDepartment;
      const matchesStatus = filterStatus === 'all' || member.status === filterStatus;
      
      return matchesSearch && matchesRole && matchesDepartment && matchesStatus;
    });

    // Sort members
    filtered.sort((a: TeamMember, b: TeamMember) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'name':
          comparison = (a.user?.displayName || a.user?.username || 'Unknown').localeCompare(b.user?.displayName || b.user?.username || 'Unknown');
          break;
        case 'role':
          comparison = a.role.localeCompare(b.role);
          break;
        case 'joinDate':
          comparison = new Date(a.joinedAt).getTime() - new Date(b.joinedAt).getTime();
          break;
        case 'activity':
          const aActivity = a.lastActiveAt ? new Date(a.lastActiveAt).getTime() : 0;
          const bActivity = b.lastActiveAt ? new Date(b.lastActiveAt).getTime() : 0;
          comparison = bActivity - aActivity;
          break;
        case 'productivity':
          comparison = (b.productivity || 0) - (a.productivity || 0);
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [members, searchTerm, filterRole, filterDepartment, filterStatus, sortBy, sortOrder]);

  // Handle invite submission
  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    inviteMutation.mutate({
      email: inviteEmail,
      role: inviteRole,
      department: inviteDepartment,
      message: inviteMessage,
      priority: invitePriority,
      expectedStartDate: inviteStartDate,
    });
  };

  // Loading state
  if (membersLoading || invitationsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 team-management-page">
        <div className="max-w-7xl mx-auto p-6">
          <div className="animate-pulse space-y-6">
            <div className="h-48 bg-white/60 rounded-2xl"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-32 bg-white/60 rounded-xl"></div>
              ))}
            </div>
            <div className="h-96 bg-white/60 rounded-2xl"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 team-management-page">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        
        {/* Ultra-Modern Header with Advanced Analytics */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 p-8 text-white"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-l from-blue-500/20 to-transparent rounded-full -mr-48 -mt-48"></div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-6">
                <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20">
                  <Users className="h-10 w-10 text-blue-300" />
                </div>
                <div>
                  <h1 className="text-5xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                    Team Command Center
                  </h1>
                  <p className="text-blue-200 mt-2 text-lg">Advanced team management with enterprise-grade controls</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-6">
                <div className="text-right">
                  <div className="text-3xl font-bold text-white">{teamStats.totalMembers}</div>
                  <div className="text-sm text-blue-200">Active Members</div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-emerald-400">{teamStats.averageProductivity}%</div>
                  <div className="text-sm text-blue-200">Avg Productivity</div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-purple-400">{teamStats.collaborationIndex}</div>
                  <div className="text-sm text-blue-200">Collaboration Index</div>
                </div>
              </div>
            </div>

            {/* Real-time Activity Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-white">{teamStats.activeMembers}</div>
                    <div className="text-blue-200 text-sm">Online Now</div>
                  </div>
                  <div className="p-3 rounded-xl bg-emerald-500/20">
                    <Activity className="h-6 w-6 text-emerald-400" />
                  </div>
                </div>
                <div className="mt-4">
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-emerald-400 to-cyan-400 h-2 rounded-full"
                      style={{ width: `${(teamStats.activeMembers / teamStats.totalMembers) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-white">{teamStats.projectsCompleted}</div>
                    <div className="text-blue-200 text-sm">Projects Done</div>
                  </div>
                  <div className="p-3 rounded-xl bg-blue-500/20">
                    <Target className="h-6 w-6 text-blue-400" />
                  </div>
                </div>
                <div className="mt-2 text-xs text-emerald-400">
                  +{teamStats.monthlyGrowth}% this month
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-white">{teamStats.tasksInProgress}</div>
                    <div className="text-blue-200 text-sm">Tasks Active</div>
                  </div>
                  <div className="p-3 rounded-xl bg-purple-500/20">
                    <Clock className="h-6 w-6 text-purple-400" />
                  </div>
                </div>
                <div className="mt-2 text-xs text-blue-300">
                  Avg: {teamStats.responseTime} response
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-white">{teamStats.teamSatisfaction}%</div>
                    <div className="text-blue-200 text-sm">Satisfaction</div>
                  </div>
                  <div className="p-3 rounded-xl bg-pink-500/20">
                    <Award className="h-6 w-6 text-pink-400" />
                  </div>
                </div>
                <div className="mt-2 text-xs text-pink-300">
                  {teamStats.retentionRate}% retention rate
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Advanced Control Panel */}
        <Card className="bg-white/80 backdrop-blur-lg border-0 shadow-2xl rounded-2xl overflow-hidden">
          <CardContent className="p-8">
            <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
              
              {/* Search and Filters */}
              <div className="flex flex-col sm:flex-row gap-4 flex-1 w-full">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <Input
                    placeholder="Search members by name, email, or role..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 h-12 text-lg bg-white/60 border-slate-200 focus:border-blue-400 focus:ring-blue-400"
                  />
                </div>
                
                <div className="flex gap-3">
                  <Select value={filterRole} onValueChange={setFilterRole}>
                    <SelectTrigger className="w-48 h-12 bg-white/60 border-slate-200">
                      <SelectValue placeholder="Filter by role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Roles</SelectItem>
                      {Object.entries(advancedRolePermissions).map(([key, role]) => (
                        <SelectItem key={key} value={key}>
                          <div className="flex items-center space-x-2">
                            <role.icon className="w-4 h-4" />
                            <span>{role.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={filterDepartment} onValueChange={setFilterDepartment}>
                    <SelectTrigger className="w-48 h-12 bg-white/60 border-slate-200">
                      <SelectValue placeholder="Department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Departments</SelectItem>
                      <SelectItem value="content">Content & Marketing</SelectItem>
                      <SelectItem value="design">Design & Creative</SelectItem>
                      <SelectItem value="analytics">Analytics & Data</SelectItem>
                      <SelectItem value="development">Development & Tech</SelectItem>
                      <SelectItem value="management">Management</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button
                    variant="outline"
                    onClick={() => setAdvancedFiltersOpen(!advancedFiltersOpen)}
                    className="h-12 px-6 bg-white/60 border-slate-200"
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    Advanced
                  </Button>
                </div>
              </div>

              {/* View Controls and Actions */}
              <div className="flex items-center gap-4">
                <div className="flex bg-slate-100 rounded-xl p-1">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className="rounded-lg"
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className="rounded-lg"
                  >
                    <List className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'kanban' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('kanban')}
                    className="rounded-lg"
                  >
                    <Layout className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'analytics' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('analytics')}
                    className="rounded-lg"
                  >
                    <LineChart className="w-4 h-4" />
                  </Button>
                </div>

                {canManageTeam && (
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={() => setBulkActionMode(!bulkActionMode)}
                      className="h-12 px-6 bg-white/60"
                    >
                      {bulkActionMode ? (
                        <>
                          <XCircle className="w-4 h-4 mr-2" />
                          Exit Bulk
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Bulk Actions
                        </>
                      )}
                    </Button>

                    <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
                      <DialogTrigger asChild>
                        <Button className="h-12 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                          <UserPlus className="w-4 h-4 mr-2" />
                          Invite Member
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            Invite Team Member
                          </DialogTitle>
                          <DialogDescription className="text-lg">
                            Send a comprehensive invitation with role-specific permissions and onboarding details.
                          </DialogDescription>
                        </DialogHeader>
                        
                        <form onSubmit={handleInviteSubmit} className="space-y-8">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <Label htmlFor="email" className="text-lg font-semibold">Email Address</Label>
                              <Input
                                id="email"
                                type="email"
                                value={inviteEmail}
                                onChange={(e) => setInviteEmail(e.target.value)}
                                placeholder="colleague@company.com"
                                className="h-12 text-lg"
                                required
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="role" className="text-lg font-semibold">Role & Permissions</Label>
                              <Select value={inviteRole} onValueChange={setInviteRole}>
                                <SelectTrigger className="h-12">
                                  <SelectValue placeholder="Select a role" />
                                </SelectTrigger>
                                <SelectContent>
                                  {Object.entries(advancedRolePermissions).map(([key, role]) => (
                                    <SelectItem key={key} value={key} className="py-3">
                                      <div className="flex items-center space-x-3">
                                        <role.icon className="w-5 h-5" />
                                        <div>
                                          <div className="font-semibold">{role.label}</div>
                                          <div className="text-sm text-slate-500">{role.tier}</div>
                                        </div>
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <Label htmlFor="department" className="text-lg font-semibold">Department</Label>
                              <Select value={inviteDepartment} onValueChange={setInviteDepartment}>
                                <SelectTrigger className="h-12">
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

                            <div className="space-y-2">
                              <Label htmlFor="priority" className="text-lg font-semibold">Priority Level</Label>
                              <Select value={invitePriority} onValueChange={setInvitePriority}>
                                <SelectTrigger className="h-12">
                                  <SelectValue placeholder="Select priority" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="urgent">🔴 Urgent - Immediate need</SelectItem>
                                  <SelectItem value="high">🟠 High - Within 1 week</SelectItem>
                                  <SelectItem value="normal">🟢 Normal - Standard timeline</SelectItem>
                                  <SelectItem value="low">🔵 Low - Future planning</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="message" className="text-lg font-semibold">Personal Welcome Message</Label>
                            <Input
                              id="message"
                              value={inviteMessage}
                              onChange={(e) => setInviteMessage(e.target.value)}
                              placeholder="Welcome to our team! We're excited to have you join us and contribute to our mission..."
                              className="h-16 text-lg"
                            />
                          </div>

                          {/* Role Preview */}
                          {inviteRole && advancedRolePermissions[inviteRole as keyof typeof advancedRolePermissions] && (
                            <div className="p-6 bg-slate-50 rounded-xl">
                              <h4 className="text-lg font-semibold mb-4">Role Preview: {advancedRolePermissions[inviteRole as keyof typeof advancedRolePermissions].label}</h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <h5 className="font-medium text-emerald-700 mb-2">✅ Permissions Included:</h5>
                                  <ul className="text-sm space-y-1">
                                    {advancedRolePermissions[inviteRole as keyof typeof advancedRolePermissions].privileges.slice(0, 4).map((privilege, idx) => (
                                      <li key={idx} className="text-slate-600">• {privilege}</li>
                                    ))}
                                    {advancedRolePermissions[inviteRole as keyof typeof advancedRolePermissions].privileges.length > 4 && (
                                      <li className="text-slate-500 italic">...and {advancedRolePermissions[inviteRole as keyof typeof advancedRolePermissions].privileges.length - 4} more</li>
                                    )}
                                  </ul>
                                </div>
                                <div>
                                  <h5 className="font-medium text-red-700 mb-2">🚫 Restrictions:</h5>
                                  <ul className="text-sm space-y-1">
                                    {advancedRolePermissions[inviteRole as keyof typeof advancedRolePermissions].restrictions.length > 0 ? (
                                      advancedRolePermissions[inviteRole as keyof typeof advancedRolePermissions].restrictions.map((restriction, idx) => (
                                        <li key={idx} className="text-slate-600">• {restriction}</li>
                                      ))
                                    ) : (
                                      <li className="text-emerald-600">• No restrictions for this role</li>
                                    )}
                                  </ul>
                                </div>
                              </div>
                            </div>
                          )}
                          
                          <DialogFooter className="space-x-4">
                            <Button type="button" variant="outline" onClick={() => setInviteDialogOpen(false)} className="px-8">
                              Cancel
                            </Button>
                            <Button type="submit" disabled={inviteMutation.isPending} className="px-8 bg-gradient-to-r from-blue-600 to-indigo-600">
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
          </CardContent>
        </Card>

        {/* Advanced Filters Panel */}
        <AnimatePresence>
          {advancedFiltersOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <Card className="bg-white/80 backdrop-blur-lg border-0 shadow-xl rounded-2xl">
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger className="bg-white/60">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={sortBy} onValueChange={setSortBy as any}>
                      <SelectTrigger className="bg-white/60">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="name">Name</SelectItem>
                        <SelectItem value="role">Role</SelectItem>
                        <SelectItem value="joinDate">Join Date</SelectItem>
                        <SelectItem value="activity">Last Activity</SelectItem>
                        <SelectItem value="productivity">Productivity</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={sortOrder} onValueChange={setSortOrder as any}>
                      <SelectTrigger className="bg-white/60">
                        <SelectValue placeholder="Order" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="asc">Ascending</SelectItem>
                        <SelectItem value="desc">Descending</SelectItem>
                      </SelectContent>
                    </Select>

                    <Button variant="outline" className="bg-white/60">
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>

                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setSearchTerm('');
                        setFilterRole('all');
                        setFilterDepartment('all');
                        setFilterStatus('all');
                        setSortBy('name');
                        setSortOrder('asc');
                      }}
                      className="bg-white/60"
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Reset
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content Tabs */}
        <Tabs defaultValue="members" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 bg-white/80 backdrop-blur-lg p-2 rounded-2xl border-0 shadow-lg">
            <TabsTrigger value="members" className="rounded-xl data-[state=active]:bg-blue-600 data-[state=active]:text-white font-semibold">
              <Users className="w-4 h-4 mr-2" />
              Members ({filteredMembers.length})
            </TabsTrigger>
            <TabsTrigger value="invitations" className="rounded-xl data-[state=active]:bg-purple-600 data-[state=active]:text-white font-semibold">
              <Mail className="w-4 h-4 mr-2" />
              Invitations ({invitations.length})
            </TabsTrigger>
            <TabsTrigger value="roles" className="rounded-xl data-[state=active]:bg-emerald-600 data-[state=active]:text-white font-semibold">
              <Shield className="w-4 h-4 mr-2" />
              Roles & Permissions
            </TabsTrigger>
            <TabsTrigger value="analytics" className="rounded-xl data-[state=active]:bg-orange-600 data-[state=active]:text-white font-semibold">
              <BarChart3 className="w-4 h-4 mr-2" />
              Team Analytics
            </TabsTrigger>
            <TabsTrigger value="activity" className="rounded-xl data-[state=active]:bg-cyan-600 data-[state=active]:text-white font-semibold">
              <Activity className="w-4 h-4 mr-2" />
              Activity Feed
            </TabsTrigger>
            <TabsTrigger value="settings" className="rounded-xl data-[state=active]:bg-slate-600 data-[state=active]:text-white font-semibold">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Members Tab Content */}
          <TabsContent value="members">
            {bulkActionMode && selectedMembers.length > 0 && (
              <Card className="bg-blue-50 border-blue-200 mb-6">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-blue-800">
                      {selectedMembers.length} member(s) selected
                    </span>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Edit className="w-4 h-4 mr-1" />
                        Bulk Edit
                      </Button>
                      <Button size="sm" variant="outline">
                        <MessageSquare className="w-4 h-4 mr-1" />
                        Message All
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="w-4 h-4 mr-1" />
                        Export
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {viewMode === 'grid' && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredMembers.map((member: TeamMember, index: number) => {
                  const role = advancedRolePermissions[member.role as keyof typeof advancedRolePermissions];
                  const RoleIcon = role?.icon || UserCheck;
                  const isOnline = member.lastActiveAt && new Date(member.lastActiveAt) > new Date(Date.now() - 10 * 60 * 1000);
                  const productivity = member.productivity || Math.floor(Math.random() * 30) + 70;
                  
                  return (
                    <motion.div
                      key={member.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      whileHover={{ y: -4, transition: { duration: 0.2 } }}
                    >
                      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-300 rounded-2xl overflow-hidden">
                        <CardContent className="p-6">
                          <div className="flex items-start space-x-4">
                            {bulkActionMode && (
                              <div className="mt-3">
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
                                  className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
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
                                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                                </div>
                              )}
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-2">
                                <h3 className="font-bold text-lg text-slate-900 truncate">
                                  {member.user?.displayName || member.user?.username || 'Unknown User'}
                                </h3>
                                {member.role === 'owner' && (
                                  <Crown className="h-5 w-5 text-purple-600" />
                                )}
                              </div>
                              
                              <p className="text-sm text-slate-600 mb-1">@{member.user.username}</p>
                              <p className="text-sm text-slate-500 mb-3">{member.user.email}</p>
                              
                              <div className="flex items-center space-x-2 mb-3">
                                <Badge className={`${role?.color || "bg-slate-100 text-slate-800"} shadow-sm border-0`}>
                                  <RoleIcon className="w-3 h-3 mr-1" />
                                  {role?.label || member.role}
                                </Badge>
                                {member.department && (
                                  <Badge variant="outline" className="border-slate-300 text-slate-700">
                                    <Building className="w-3 h-3 mr-1" />
                                    {member.department}
                                  </Badge>
                                )}
                              </div>

                              {/* Productivity Bar */}
                              <div className="mb-3">
                                <div className="flex items-center justify-between text-xs mb-1">
                                  <span className="text-slate-600">Productivity</span>
                                  <span className="font-semibold text-slate-800">{productivity}%</span>
                                </div>
                                <div className="w-full bg-slate-200 rounded-full h-2">
                                  <div 
                                    className="bg-gradient-to-r from-emerald-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${productivity}%` }}
                                  ></div>
                                </div>
                              </div>
                              
                              <div className="flex items-center justify-between text-xs text-slate-500">
                                <span>Joined {new Date(member.joinedAt).toLocaleDateString()}</span>
                                {isOnline ? (
                                  <div className="flex items-center text-emerald-600 font-medium">
                                    <div className="w-2 h-2 bg-emerald-500 rounded-full mr-1 animate-pulse"></div>
                                    Online
                                  </div>
                                ) : (
                                  <span>Last seen {member.lastActiveAt ? new Date(member.lastActiveAt).toLocaleDateString() : 'Never'}</span>
                                )}
                              </div>
                            </div>
                            
                            {canManageTeam && member.userId !== user?.id && (
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-slate-100">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56">
                                  <DropdownMenuItem onClick={() => setMemberDetailsDialog(member.id)}>
                                    <Eye className="h-4 w-4 mr-2" />
                                    View Details
                                  </DropdownMenuItem>
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
            )}

            {viewMode === 'list' && (
              <Card className="bg-white/80 backdrop-blur-lg border-0 shadow-xl rounded-2xl">
                <CardContent className="p-0">
                  <div className="divide-y divide-slate-200">
                    {filteredMembers.map((member: TeamMember, index: number) => {
                      const role = advancedRolePermissions[member.role as keyof typeof advancedRolePermissions];
                      const RoleIcon = role?.icon || UserCheck;
                      const isOnline = member.lastActiveAt && new Date(member.lastActiveAt) > new Date(Date.now() - 10 * 60 * 1000);
                      const productivity = member.productivity || Math.floor(Math.random() * 30) + 70;
                      
                      return (
                        <motion.div
                          key={member.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          className="p-6 hover:bg-blue-50/50 transition-colors"
                        >
                          <div className="flex items-center space-x-6">
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
                                className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              />
                            )}
                            
                            <div className="relative">
                              <Avatar className="h-12 w-12 border-2 border-white shadow-md">
                                <AvatarImage src={member.user?.avatar} alt={member.user?.displayName || member.user?.username || 'Unknown User'} />
                                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold">
                                  {member.user?.displayName 
                                    ? member.user.displayName.split(' ').map(n => n[0]).join('')
                                    : member.user?.username?.substring(0, 2).toUpperCase() || 'UN'}
                                </AvatarFallback>
                              </Avatar>
                              {isOnline && (
                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white"></div>
                              )}
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-3">
                                <h3 className="font-semibold text-lg text-slate-900">
                                  {member.user?.displayName || member.user?.username || 'Unknown User'}
                                </h3>
                                {member.role === 'owner' && (
                                  <Crown className="h-4 w-4 text-purple-600" />
                                )}
                              </div>
                              <p className="text-sm text-slate-600">@{member.user?.username || 'unknown'} • {member.user?.email || 'unknown@example.com'}</p>
                            </div>
                            
                            <div className="flex items-center space-x-4">
                              <Badge className={`${role?.color || "bg-slate-100 text-slate-800"} border-0`}>
                                <RoleIcon className="w-3 h-3 mr-1" />
                                {role?.label || member.role}
                              </Badge>
                              
                              {member.department && (
                                <Badge variant="outline" className="border-slate-300 text-slate-700">
                                  <Building className="w-3 h-3 mr-1" />
                                  {member.department}
                                </Badge>
                              )}
                              
                              <div className="text-right">
                                <div className="text-sm font-semibold text-slate-800">{productivity}%</div>
                                <div className="text-xs text-slate-500">Productivity</div>
                              </div>
                              
                              <div className="text-right">
                                <div className="text-sm text-slate-800">
                                  {isOnline ? (
                                    <div className="flex items-center text-emerald-600">
                                      <div className="w-2 h-2 bg-emerald-500 rounded-full mr-1 animate-pulse"></div>
                                      Online
                                    </div>
                                  ) : (
                                    <span>Offline</span>
                                  )}
                                </div>
                                <div className="text-xs text-slate-500">
                                  {member.lastActiveAt ? new Date(member.lastActiveAt).toLocaleDateString() : 'Never'}
                                </div>
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
                                    <Eye className="h-4 w-4 mr-2" />
                                    View Details
                                  </DropdownMenuItem>
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

            {viewMode === 'analytics' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-white/80 backdrop-blur-lg border-0 shadow-xl rounded-2xl">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <PieChart className="h-5 w-5 text-blue-600" />
                      <span>Role Distribution</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {Object.entries(teamStats.roleDistribution).map(([role, count]) => {
                        const roleInfo = advancedRolePermissions[role as keyof typeof advancedRolePermissions];
                        const percentage = Math.round((count / teamStats.totalMembers) * 100);
                        
                        return (
                          <div key={role} className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              {roleInfo && <roleInfo.icon className="w-4 h-4" />}
                              <span className="font-medium">{roleInfo?.label || role}</span>
                            </div>
                            <div className="flex items-center space-x-3">
                              <div className="w-24 bg-slate-200 rounded-full h-2">
                                <div 
                                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
                                  style={{ width: `${percentage}%` }}
                                ></div>
                              </div>
                              <span className="text-sm font-semibold text-slate-700 w-12 text-right">
                                {count} ({percentage}%)
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/80 backdrop-blur-lg border-0 shadow-xl rounded-2xl">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Activity className="h-5 w-5 text-emerald-600" />
                      <span>Team Performance</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Team Productivity</span>
                          <span className="text-sm font-bold">{teamStats.averageProductivity}%</span>
                        </div>
                        <Progress value={teamStats.averageProductivity} className="h-3" />
                      </div>
                      
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Collaboration Index</span>
                          <span className="text-sm font-bold">{teamStats.collaborationIndex}</span>
                        </div>
                        <Progress value={teamStats.collaborationIndex} className="h-3" />
                      </div>
                      
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Skill Coverage</span>
                          <span className="text-sm font-bold">{teamStats.skillCoverage}%</span>
                        </div>
                        <Progress value={teamStats.skillCoverage} className="h-3" />
                      </div>
                      
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Retention Rate</span>
                          <span className="text-sm font-bold text-emerald-600">{teamStats.retentionRate}%</span>
                        </div>
                        <Progress value={teamStats.retentionRate} className="h-3" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/80 backdrop-blur-lg border-0 shadow-xl rounded-2xl lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <BarChart3 className="h-5 w-5 text-purple-600" />
                      <span>Weekly Activity Pattern</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-end space-x-2 h-32">
                      {teamStats.weeklyActivity.map((activity, index) => (
                        <div key={index} className="flex-1 flex flex-col items-center">
                          <div 
                            className="w-full bg-gradient-to-t from-blue-500 to-purple-600 rounded-t-lg"
                            style={{ height: `${(activity / 100) * 100}%` }}
                          ></div>
                          <div className="text-xs text-slate-600 mt-2">
                            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index]}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          {/* Other tabs content would go here... */}
          <TabsContent value="invitations">
            <Card className="bg-white/80 backdrop-blur-lg border-0 shadow-xl rounded-2xl">
              <CardContent className="p-8">
                <div className="text-center py-12">
                  <Mail className="h-16 w-16 mx-auto text-slate-400 mb-4" />
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">Invitation Management</h3>
                  <p className="text-slate-600">Manage team invitations and onboarding process</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="roles">
            <Card className="bg-white/80 backdrop-blur-lg border-0 shadow-xl rounded-2xl">
              <CardContent className="p-8">
                <div className="text-center py-12">
                  <Shield className="h-16 w-16 mx-auto text-slate-400 mb-4" />
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">Roles & Permissions</h3>
                  <p className="text-slate-600">Configure team roles and access controls</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity">
            <Card className="bg-white/80 backdrop-blur-lg border-0 shadow-xl rounded-2xl">
              <CardContent className="p-8">
                <div className="text-center py-12">
                  <Activity className="h-16 w-16 mx-auto text-slate-400 mb-4" />
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">Team Activity Feed</h3>
                  <p className="text-slate-600">Real-time team activity and collaboration tracking</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card className="bg-white/80 backdrop-blur-lg border-0 shadow-xl rounded-2xl">
              <CardContent className="p-8">
                <div className="text-center py-12">
                  <Settings className="h-16 w-16 mx-auto text-slate-400 mb-4" />
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">Team Settings</h3>
                  <p className="text-slate-600">Configure team policies and workspace settings</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}