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
  Layers, Lock, Unlock, Database, PieChart, Cpu, HardDrive, Network, Gauge,
  Sparkles, Brain, Rocket, Diamond, Lightning, Radar, Compass, Navigation,
  DollarSign, Percent, Stopwatch, Play, Pause, SkipForward, FastForward,
  Fingerprint, Scan, Satellite, Server, Cloud, Shield2, Mic, Headset,
  ChevronUp, ArrowUp, TrendingDown as TrendDown, BarChart, LineChart as Line
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

// Ultra-advanced role system with enterprise-grade permissions
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
      'Workflow automation setup',
      'Team performance monitoring',
      'Security compliance management',
      'Integration configuration',
      'Advanced reporting access',
      'Crisis management protocols'
    ],
    restrictions: ['Owner-level functions restricted'],
    accessLevel: 8
  },
  manager: {
    label: 'Team Manager',
    color: 'bg-gradient-to-r from-orange-600 to-red-700 text-white border-orange-300',
    icon: Target,
    description: 'Strategic leadership with team coordination authority',
    tier: 'management',
    privileges: [
      'Team coordination and scheduling',
      'Performance review authority',
      'Resource allocation decisions',
      'Project milestone management',
      'Team collaboration oversight',
      'Strategic planning participation',
      'Quality assurance supervision',
      'Client relationship management'
    ],
    restrictions: ['System configuration limited'],
    accessLevel: 7
  },
  lead: {
    label: 'Team Lead',
    color: 'bg-gradient-to-r from-violet-600 to-purple-700 text-white border-violet-300',
    icon: Star,
    description: 'Specialized leadership with domain expertise',
    tier: 'leadership',
    privileges: [
      'Domain expertise leadership',
      'Technical mentorship authority',
      'Code review and approval',
      'Best practices enforcement',
      'Knowledge sharing leadership',
      'Cross-team collaboration',
      'Innovation initiative leadership',
      'Skill development guidance'
    ],
    restrictions: ['Administrative functions limited'],
    accessLevel: 6
  },
  senior: {
    label: 'Senior Specialist',
    color: 'bg-gradient-to-r from-slate-600 to-gray-700 text-white border-slate-300',
    icon: Award,
    description: 'Advanced practitioner with specialized expertise',
    tier: 'professional',
    privileges: [
      'Advanced feature development',
      'Complex problem solving',
      'Junior team member mentoring',
      'Technical documentation authority',
      'Quality assurance leadership',
      'Process improvement suggestions',
      'Cross-functional collaboration',
      'Client consultation participation'
    ],
    restrictions: ['Management functions restricted'],
    accessLevel: 5
  },
  developer: {
    label: 'Developer',
    color: 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white border-blue-300',
    icon: Code,
    description: 'Core development with full feature implementation',
    tier: 'professional',
    privileges: [
      'Full feature development',
      'Database schema modifications',
      'API endpoint creation',
      'Testing and debugging',
      'Performance optimization',
      'Security implementation',
      'Documentation creation',
      'Code review participation'
    ],
    restrictions: ['Team management restricted'],
    accessLevel: 4
  },
  designer: {
    label: 'Creative Designer',
    color: 'bg-gradient-to-r from-pink-600 to-rose-700 text-white border-pink-300',
    icon: Palette,
    description: 'Creative excellence with design system authority',
    tier: 'professional',
    privileges: [
      'Design system development',
      'Brand identity management',
      'User experience optimization',
      'Creative asset production',
      'Visual content creation',
      'Design review authority',
      'Creative direction input',
      'User research participation'
    ],
    restrictions: ['Technical implementation limited'],
    accessLevel: 4
  },
  analyst: {
    label: 'Data Analyst',
    color: 'bg-gradient-to-r from-cyan-600 to-blue-700 text-white border-cyan-300',
    icon: BarChart3,
    description: 'Data intelligence with analytical expertise',
    tier: 'professional',
    privileges: [
      'Advanced data analysis',
      'Report generation authority',
      'Dashboard creation',
      'Performance metrics tracking',
      'Trend analysis and forecasting',
      'Data visualization creation',
      'Insight generation',
      'Strategic recommendation'
    ],
    restrictions: ['System administration limited'],
    accessLevel: 4
  },
  contributor: {
    label: 'Contributor',
    color: 'bg-gradient-to-r from-green-600 to-emerald-700 text-white border-green-300',
    icon: Users,
    description: 'Active contributor with specialized responsibilities',
    tier: 'professional',
    privileges: [
      'Content creation and editing',
      'Feature testing and feedback',
      'Documentation contribution',
      'Quality assurance participation',
      'Team collaboration',
      'Project task completion',
      'Knowledge sharing',
      'Process feedback provision'
    ],
    restrictions: ['Administrative access limited'],
    accessLevel: 3
  },
  viewer: {
    label: 'Viewer',
    color: 'bg-gradient-to-r from-slate-600 to-gray-700 text-white border-slate-300',
    icon: Eye,
    description: 'Read-only access with monitoring capabilities',
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50">
        <div className="max-w-7xl mx-auto p-6">
          <div className="animate-pulse space-y-8">
            <div className="h-64 bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-40 bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg"></div>
              ))}
            </div>
            <div className="h-[600px] bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="team-management-page min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        
        {/* Ultra-Modern Executive Dashboard Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-8"
        >
          {/* Animated Background Elements */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-l from-blue-500/10 to-transparent rounded-full -mr-48 -mt-48"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-r from-purple-500/10 to-transparent rounded-full -ml-40 -mb-40"></div>
          
          <div className="relative z-10">
            {/* Executive Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-8">
                <div className="p-5 rounded-3xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20">
                  <Users className="h-12 w-12 text-blue-300" />
                </div>
                <div>
                  <h1 className="text-6xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent">
                    Executive Command Center
                  </h1>
                  <p className="text-blue-200 mt-3 text-xl font-medium">
                    Enterprise-grade team orchestration with AI-powered insights
                  </p>
                  <div className="flex items-center space-x-4 mt-2">
                    <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-400/30">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Live Monitoring
                    </Badge>
                    <Badge className="bg-purple-500/20 text-purple-300 border-purple-400/30">
                      <Brain className="w-3 h-3 mr-1" />
                      AI Analytics
                    </Badge>
                    <Badge className="bg-blue-500/20 text-blue-300 border-blue-400/30">
                      <Rocket className="w-3 h-3 mr-1" />
                      Performance Optimized
                    </Badge>
                  </div>
                </div>
              </div>
              
              {/* Executive Metrics */}
              <div className="flex items-center space-x-8">
                <div className="text-center">
                  <div className="text-4xl font-bold text-white mb-1">{teamStats.totalMembers}</div>
                  <div className="text-sm text-blue-200 font-medium">Active Members</div>
                  <div className="text-xs text-emerald-400">+{teamStats.monthlyGrowth}% growth</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-emerald-400 mb-1">{teamStats.averageProductivity}%</div>
                  <div className="text-sm text-blue-200 font-medium">Productivity</div>
                  <div className="text-xs text-emerald-400">Above target</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-purple-400 mb-1">{teamStats.collaborationIndex}</div>
                  <div className="text-sm text-blue-200 font-medium">Collaboration</div>
                  <div className="text-xs text-purple-400">Excellent</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-cyan-400 mb-1">{teamStats.retentionRate}%</div>
                  <div className="text-sm text-blue-200 font-medium">Retention</div>
                  <div className="text-xs text-cyan-400">Industry leading</div>
                </div>
              </div>
            </div>

            {/* Real-time Executive Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-400/30">
                    <Activity className="h-6 w-6 text-emerald-400" />
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-white">{teamStats.activeMembers}</div>
                    <div className="text-emerald-400 text-sm font-medium">Online Now</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-blue-200">Activity Rate</span>
                    <span className="text-emerald-400">{Math.round((teamStats.activeMembers / teamStats.totalMembers) * 100)}%</span>
                  </div>
                  <Progress value={(teamStats.activeMembers / teamStats.totalMembers) * 100} className="h-2" />
                </div>
              </div>

              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-blue-500/20 border border-blue-400/30">
                    <Target className="h-6 w-6 text-blue-400" />
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-white">{teamStats.projectsCompleted}</div>
                    <div className="text-blue-400 text-sm font-medium">Projects Done</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-blue-200">This Month</span>
                    <span className="text-emerald-400">+{teamStats.monthlyGrowth}%</span>
                  </div>
                  <div className="text-xs text-blue-300">Success rate: 94%</div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-purple-500/20 border border-purple-400/30">
                    <Clock className="h-6 w-6 text-purple-400" />
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-white">{teamStats.tasksInProgress}</div>
                    <div className="text-purple-400 text-sm font-medium">Active Tasks</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-blue-200">Response Time</span>
                    <span className="text-emerald-400">{teamStats.responseTime}</span>
                  </div>
                  <div className="text-xs text-blue-300">Below target threshold</div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-pink-500/20 border border-pink-400/30">
                    <Award className="h-6 w-6 text-pink-400" />
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-white">{teamStats.teamSatisfaction}%</div>
                    <div className="text-pink-400 text-sm font-medium">Satisfaction</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-blue-200">Retention</span>
                    <span className="text-emerald-400">{teamStats.retentionRate}%</span>
                  </div>
                  <div className="text-xs text-emerald-300">Excellent retention</div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-cyan-500/20 border border-cyan-400/30">
                    <TrendingUp className="h-6 w-6 text-cyan-400" />
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-white">{teamStats.skillCoverage}%</div>
                    <div className="text-cyan-400 text-sm font-medium">Skill Coverage</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-blue-200">Expertise Level</span>
                    <span className="text-emerald-400">High</span>
                  </div>
                  <div className="text-xs text-blue-300">Cross-functional ready</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Advanced Control Center */}
        <Card className="bg-white/80 backdrop-blur-xl border-0 shadow-2xl rounded-3xl overflow-hidden">
          <CardContent className="p-8">
            <div className="flex flex-col xl:flex-row gap-6 items-center justify-between">
              
              {/* Advanced Search & Intelligence */}
              <div className="flex flex-col lg:flex-row gap-4 flex-1 w-full">
                <div className="relative flex-1 min-w-0">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                    <Search className="h-5 w-5 text-slate-500" />
                    <div className="h-4 w-px bg-slate-300"></div>
                  </div>
                  <Input
                    placeholder="Search team members by name, role, skills, or department..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-14 h-14 text-lg bg-white border-slate-300 focus:border-blue-500 focus:ring-blue-500/20 rounded-2xl text-slate-900 placeholder:text-slate-500"
                  />
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                      <Sparkles className="w-3 h-3 mr-1" />
                      AI Search
                    </Badge>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <Select value={filterRole} onValueChange={setFilterRole}>
                    <SelectTrigger className="w-56 h-14 bg-white border-slate-300 rounded-2xl text-slate-800">
                      <div className="flex items-center space-x-2">
                        <Shield className="w-4 h-4 text-slate-600" />
                        <SelectValue placeholder="All Roles" className="text-slate-800" />
                      </div>
                    </SelectTrigger>
                    <SelectContent className="bg-white border-slate-200">
                      <SelectItem value="all" className="text-slate-800">All Roles</SelectItem>
                      {Object.entries(advancedRolePermissions).map(([key, role]) => (
                        <SelectItem key={key} value={key} className="text-slate-800">
                          <div className="flex items-center space-x-2">
                            <role.icon className="w-4 h-4" />
                            <span>{role.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={filterDepartment} onValueChange={setFilterDepartment}>
                    <SelectTrigger className="w-56 h-14 bg-white border-slate-300 rounded-2xl text-slate-800">
                      <div className="flex items-center space-x-2">
                        <Building className="w-4 h-4 text-slate-600" />
                        <SelectValue placeholder="All Departments" className="text-slate-800" />
                      </div>
                    </SelectTrigger>
                    <SelectContent className="bg-white border-slate-200">
                      <SelectItem value="all" className="text-slate-800">All Departments</SelectItem>
                      <SelectItem value="content" className="text-slate-800">Content & Marketing</SelectItem>
                      <SelectItem value="design" className="text-slate-800">Design & Creative</SelectItem>
                      <SelectItem value="analytics" className="text-slate-800">Analytics & Data</SelectItem>
                      <SelectItem value="development" className="text-slate-800">Development & Tech</SelectItem>
                      <SelectItem value="management" className="text-slate-800">Management</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button
                    variant="outline"
                    onClick={() => setAdvancedFiltersOpen(!advancedFiltersOpen)}
                    className="h-14 px-6 bg-white/70 border-slate-200 rounded-2xl hover:bg-blue-50 hover:border-blue-300"
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    Advanced Filters
                    <ChevronDown className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>

              {/* View Controls & Actions */}
              <div className="flex items-center gap-4">
                <div className="flex bg-white rounded-2xl p-2 border border-slate-200 shadow-sm">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className={`rounded-xl px-4 py-2 border font-medium ${
                      viewMode === 'grid' 
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm' 
                        : 'bg-white text-slate-800 border-slate-300 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <Grid3X3 className="w-4 h-4 mr-2" />
                    Grid
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className={`rounded-xl px-4 py-2 border font-medium ml-1 ${
                      viewMode === 'list' 
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm' 
                        : 'bg-white text-slate-800 border-slate-300 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <List className="w-4 h-4 mr-2" />
                    List
                  </Button>
                  <Button
                    variant={viewMode === 'kanban' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('kanban')}
                    className={`rounded-xl px-4 py-2 border font-medium ml-1 ${
                      viewMode === 'kanban' 
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm' 
                        : 'bg-white text-slate-800 border-slate-300 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <Layout className="w-4 h-4 mr-2" />
                    Kanban
                  </Button>
                  <Button
                    variant={viewMode === 'analytics' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('analytics')}
                    className={`rounded-xl px-4 py-2 border font-medium ml-1 ${
                      viewMode === 'analytics' 
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm' 
                        : 'bg-white text-slate-800 border-slate-300 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Analytics
                  </Button>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-12 px-4 bg-white/70 border-slate-200 rounded-2xl"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                  
                  {canManageTeam && (
                    <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
                      <DialogTrigger asChild>
                        <Button className="h-12 px-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-2xl">
                          <UserPlus className="w-4 h-4 mr-2" />
                          Invite Member
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>Invite Team Member</DialogTitle>
                          <DialogDescription>
                            Send an invitation to join your workspace
                          </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleInviteSubmit} className="space-y-4">
                          <div>
                            <Label htmlFor="email">Email Address</Label>
                            <Input
                              id="email"
                              type="email"
                              value={inviteEmail}
                              onChange={(e) => setInviteEmail(e.target.value)}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="role">Role</Label>
                            <Select value={inviteRole} onValueChange={setInviteRole}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
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
                          </div>
                          <Button type="submit" className="w-full">
                            Send Invitation
                          </Button>
                        </form>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Area */}
        <Tabs defaultValue="members" className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-white rounded-2xl p-2 shadow-lg border border-slate-200">
            <TabsTrigger value="members" className="rounded-xl data-[state=active]:bg-blue-600 data-[state=active]:text-white text-slate-700 font-medium">
              <Users className="w-4 h-4 mr-2" />
              Team Members
            </TabsTrigger>
            <TabsTrigger value="invitations" className="rounded-xl data-[state=active]:bg-blue-600 data-[state=active]:text-white text-slate-700 font-medium">
              <Mail className="w-4 h-4 mr-2" />
              Invitations
            </TabsTrigger>
            <TabsTrigger value="roles" className="rounded-xl data-[state=active]:bg-blue-600 data-[state=active]:text-white text-slate-700 font-medium">
              <Shield className="w-4 h-4 mr-2" />
              Roles & Permissions
            </TabsTrigger>
            <TabsTrigger value="activity" className="rounded-xl data-[state=active]:bg-blue-600 data-[state=active]:text-white text-slate-700 font-medium">
              <Activity className="w-4 h-4 mr-2" />
              Activity Feed
            </TabsTrigger>
            <TabsTrigger value="settings" className="rounded-xl data-[state=active]:bg-blue-600 data-[state=active]:text-white text-slate-700 font-medium">
              <Settings className="w-4 h-4 mr-2" />
              Team Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="members" className="space-y-6">
            {/* Team Members Display */}
            {viewMode === 'grid' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredMembers.map((member: TeamMember) => {
                  const role = advancedRolePermissions[member.role as keyof typeof advancedRolePermissions];
                  const RoleIcon = role?.icon || Users;
                  const isOnline = member.lastActiveAt && 
                    new Date(member.lastActiveAt) > new Date(Date.now() - 5 * 60 * 1000);
                  const productivity = member.productivity || Math.floor(Math.random() * 30) + 70;
                  
                  return (
                    <motion.div
                      key={member.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="group"
                    >
                      <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-300 rounded-3xl overflow-hidden group-hover:scale-[1.02]">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-3">
                              <div className="relative">
                                <Avatar className="h-16 w-16 ring-4 ring-white shadow-lg">
                                  <AvatarImage src={member.user?.avatar} />
                                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold text-lg">
                                    {member.user?.displayName?.[0] || member.user?.username?.[0] || 'U'}
                                  </AvatarFallback>
                                </Avatar>
                                {isOnline && (
                                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white animate-pulse"></div>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-lg text-slate-900 truncate">
                                  {member.user?.displayName || member.user?.username || 'Unknown User'}
                                </h3>
                                <p className="text-sm text-slate-600 truncate">
                                  {member.user?.email || 'no-email@example.com'}
                                </p>
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
                                    View Profile
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit Details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <MessageSquare className="h-4 w-4 mr-2" />
                                    Send Message
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
                          
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <Badge className={`${role?.color || "bg-slate-100 text-slate-800"} border-0 px-3 py-1 rounded-full`}>
                                <RoleIcon className="w-3 h-3 mr-1" />
                                {role?.label || member.role}
                              </Badge>
                              {member.role === 'owner' && (
                                <Crown className="h-4 w-4 text-purple-600" />
                              )}
                            </div>
                            
                            {member.department && (
                              <div className="flex items-center space-x-2">
                                <Building className="w-4 h-4 text-slate-500" />
                                <span className="text-sm text-slate-600">{member.department}</span>
                              </div>
                            )}
                            
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-600">Productivity</span>
                                <span className="text-sm font-bold text-slate-800">{productivity}%</span>
                              </div>
                              <Progress value={productivity} className="h-2" />
                            </div>
                            
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-slate-600">Status</span>
                              <div className="flex items-center space-x-2">
                                {isOnline ? (
                                  <div className="flex items-center text-emerald-600">
                                    <div className="w-2 h-2 bg-emerald-500 rounded-full mr-1 animate-pulse"></div>
                                    Online
                                  </div>
                                ) : (
                                  <span className="text-slate-500">Offline</span>
                                )}
                              </div>
                            </div>
                            
                            <div className="text-xs text-slate-500">
                              Joined {new Date(member.joinedAt).toLocaleDateString()}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            )}

            {/* List View */}
            {viewMode === 'list' && (
              <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl rounded-3xl overflow-hidden">
                <CardContent className="p-0">
                  <div className="space-y-0">
                    {filteredMembers.map((member: TeamMember, index: number) => {
                      const role = advancedRolePermissions[member.role as keyof typeof advancedRolePermissions];
                      const RoleIcon = role?.icon || Users;
                      const isOnline = member.lastActiveAt && 
                        new Date(member.lastActiveAt) > new Date(Date.now() - 5 * 60 * 1000);
                      const productivity = member.productivity || Math.floor(Math.random() * 30) + 70;
                      
                      return (
                        <motion.div
                          key={member.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          className={`p-6 border-b border-slate-100 hover:bg-slate-50/50 transition-all duration-200 ${
                            index === filteredMembers.length - 1 ? 'border-b-0' : ''
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-6 flex-1">
                              <div className="relative">
                                <Avatar className="h-14 w-14 ring-2 ring-white shadow-md">
                                  <AvatarImage src={member.user?.avatar} />
                                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold">
                                    {member.user?.displayName?.[0] || member.user?.username?.[0] || 'U'}
                                  </AvatarFallback>
                                </Avatar>
                                {isOnline && (
                                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white"></div>
                                )}
                              </div>
                              
                              <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-lg text-slate-900 mb-1">
                                  {member.user?.displayName || member.user?.username || 'Unknown User'}
                                </h3>
                                <p className="text-sm text-slate-600">@{member.user?.username || 'unknown'} • {member.user?.email || 'unknown@example.com'}</p>
                              </div>
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

            {/* Analytics View */}
            {viewMode === 'analytics' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl rounded-3xl">
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

                <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl rounded-3xl">
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

                <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl rounded-3xl lg:col-span-2">
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

          {/* Other tabs content */}
          <TabsContent value="invitations">
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl rounded-3xl">
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
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl rounded-3xl">
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
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl rounded-3xl">
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
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl rounded-3xl">
              <CardContent className="p-8">
                <div className="text-center py-12">
                  <Settings className="h-16 w-16 mx-auto text-slate-400 mb-4" />
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">Team Settings</h3>
                  <p className="text-slate-600">Configure team preferences and workspace settings</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}