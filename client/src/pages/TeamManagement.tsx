import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { 
  UserPlus, 
  Users, 
  Mail, 
  Shield, 
  MoreVertical, 
  Copy, 
  Link, 
  Trash2, 
  Crown, 
  Eye, 
  Edit, 
  AlertTriangle, 
  Star,
  Search,
  Filter,
  Calendar,
  Activity,
  TrendingUp,
  Award,
  Zap,
  Globe,
  Lock,
  Plus,
  Download,
  Upload,
  MessageSquare,
  Clock,
  CheckCircle,
  XCircle,
  UserCheck
} from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { useWorkspace } from "@/hooks/useWorkspace";
import { motion, AnimatePresence } from "framer-motion";

interface TeamMember {
  id: number;
  userId: number;
  workspaceId: number;
  role: string;
  status: string;
  joinedAt: string;
  lastActiveAt?: string;
  user: {
    id: number;
    username: string;
    email: string;
    displayName: string;
    avatar: string;
  };
}

interface TeamInvitation {
  id: number;
  email: string;
  role: string;
  status: string;
  createdAt: string;
  expiresAt: string;
  invitedBy: number;
}

interface TeamStats {
  totalMembers: number;
  activeMembers: number;
  pendingInvites: number;
  monthlyActivity: number;
  averageResponseTime: string;
  collaborationScore: number;
}

const rolePermissions = {
  owner: { 
    label: "Owner", 
    icon: Crown, 
    color: "bg-purple-100 text-purple-800 border-purple-200", 
    darkColor: "bg-purple-900 text-purple-100 border-purple-700",
    description: "Full workspace control and billing",
    permissions: {
      can: [
        "Manage billing and subscription",
        "Invite and remove team members",
        "Change member roles (including Admin)",
        "Delete workspace",
        "Manage workspace settings",
        "Create, edit, and publish content",
        "View all analytics and reports",
        "Connect social media accounts",
        "Use AI suggestions and content generation",
        "Schedule and manage content",
        "Access team management"
      ],
      cannot: []
    }
  },
  admin: { 
    label: "Admin", 
    icon: Shield, 
    color: "bg-blue-100 text-blue-800 border-blue-200", 
    darkColor: "bg-blue-900 text-blue-100 border-blue-700",
    description: "Full access to all features",
    permissions: {
      can: [
        "Invite and remove team members",
        "Change Editor/Viewer roles",
        "Create, edit, and publish content",
        "View all analytics and reports",
        "Connect social media accounts",
        "Use AI suggestions and content generation",
        "Schedule and manage content",
        "Access team management",
        "Manage workspace settings"
      ],
      cannot: [
        "Manage billing and subscription",
        "Delete workspace",
        "Change Owner role",
        "Remove or demote other Admins"
      ]
    }
  },
  editor: { 
    label: "Editor", 
    icon: Edit, 
    color: "bg-emerald-100 text-emerald-800 border-emerald-200", 
    darkColor: "bg-emerald-900 text-emerald-100 border-emerald-700",
    description: "Can create and manage content",
    permissions: {
      can: [
        "Create, edit, and publish content",
        "View analytics for their own content",
        "Use AI suggestions and content generation",
        "Schedule content",
        "Connect personal social media accounts",
        "Collaborate on content creation"
      ],
      cannot: [
        "Invite or remove team members",
        "Change member roles",
        "Access billing information",
        "View other members' analytics",
        "Manage workspace settings",
        "Delete workspace"
      ]
    }
  },
  viewer: { 
    label: "Viewer", 
    icon: Eye, 
    color: "bg-slate-100 text-slate-800 border-slate-200", 
    darkColor: "bg-slate-700 text-slate-100 border-slate-600",
    description: "Read-only access to content",
    permissions: {
      can: [
        "View published content",
        "View basic analytics",
        "Comment on content (if enabled)",
        "Export content reports",
        "View content calendar"
      ],
      cannot: [
        "Create or edit content",
        "Invite team members",
        "Change any settings",
        "Access billing information",
        "Use AI suggestions",
        "Schedule content",
        "Connect social media accounts"
      ]
    }
  }
};

export default function TeamManagement() {
  const { user } = useAuth();
  const { currentWorkspace } = useWorkspace();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [inviteCodeDialogOpen, setInviteCodeDialogOpen] = useState(false);
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("viewer");
  const [generatedInviteCode, setGeneratedInviteCode] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedTab, setSelectedTab] = useState("members");

  // Mock team stats (in real app this would come from API)
  const teamStats: TeamStats = {
    totalMembers: 8,
    activeMembers: 7,
    pendingInvites: 2,
    monthlyActivity: 92,
    averageResponseTime: "2.3h",
    collaborationScore: 87
  };

  // Fetch team members
  const { data: members = [], isLoading: membersLoading } = useQuery({
    queryKey: ['workspace-members', currentWorkspace?.id],
    queryFn: async () => {
      if (!currentWorkspace?.id) return [];
      const response = await apiRequest('GET', `/api/workspaces/${currentWorkspace.id}/members`);
      return response.json();
    },
    enabled: !!currentWorkspace?.id
  });

  // Fetch pending invitations
  const { data: invitations = [], isLoading: invitationsLoading } = useQuery({
    queryKey: ['workspace-invitations', currentWorkspace?.id],
    queryFn: async () => {
      if (!currentWorkspace?.id) return [];
      const response = await apiRequest('GET', `/api/workspaces/${currentWorkspace.id}/invitations`);
      return response.json();
    },
    enabled: !!currentWorkspace?.id
  });

  const canManageTeam = currentWorkspace?.userId === user?.id || 
    members.find(m => m.userId === user?.id && ['owner', 'admin'].includes(m.role));

  // Enhanced invite member mutation
  const inviteMutation = useMutation({
    mutationFn: async (data: { email: string; role: string }) => {
      const response = await apiRequest('POST', `/api/workspaces/${currentWorkspace?.id}/invitations`, {
        json: data
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspace-invitations'] });
      setInviteDialogOpen(false);
      setInviteEmail("");
      setInviteRole("viewer");
      toast({
        title: "Invitation sent",
        description: "Team member invitation has been sent successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error sending invitation",
        description: error.message || "Failed to send invitation",
        variant: "destructive",
      });
    }
  });

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    inviteMutation.mutate({ email: inviteEmail, role: inviteRole });
  };

  // Filter and search logic
  const filteredMembers = members.filter(member => {
    const matchesSearch = member.user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.user.displayName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "all" || member.role === filterRole;
    const matchesStatus = filterStatus === "all" || member.status === filterStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const filteredInvitations = invitations.filter(invitation => {
    const matchesSearch = invitation.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "all" || invitation.role === filterRole;
    return matchesSearch && matchesRole;
  });

  if (!currentWorkspace) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#ffffff' }}>
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center space-x-3 mb-8">
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Team Management</h1>
              <p className="text-slate-600 mt-1">Collaborate and manage your workspace team</p>
            </div>
          </div>
          <Card style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0' }}>
            <CardContent className="p-8 text-center">
              <Users className="h-16 w-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">No Workspace Selected</h3>
              <p className="text-slate-600">Please select a workspace to manage team members.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen team-management-page" style={{ backgroundColor: '#ffffff' }}>
      <div className="container mx-auto px-6 py-8">
        {/* Enhanced Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Team Management</h1>
              <p className="text-slate-600 mt-1">Collaborate and manage your workspace team</p>
            </div>
          </div>
          
          {canManageTeam && (
            <div className="flex space-x-3">
              <Button variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-50">
                <Download className="w-4 h-4 mr-2" />
                Export Team Data
              </Button>
              <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Invite Member
                  </Button>
                </DialogTrigger>
                <DialogContent style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0' }}>
                  <DialogHeader>
                    <DialogTitle className="text-slate-900">Invite Team Member</DialogTitle>
                    <DialogDescription className="text-slate-600">
                      Send an invitation to join this workspace. They'll receive an email with instructions.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleInviteSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="email" className="text-slate-700">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        placeholder="colleague@example.com"
                        className="mt-1"
                        style={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1' }}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="role" className="text-slate-700">Role</Label>
                      <Select value={inviteRole} onValueChange={setInviteRole}>
                        <SelectTrigger style={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1' }}>
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                        <SelectContent style={{ backgroundColor: '#ffffff' }}>
                          <SelectItem value="viewer">Viewer - Read-only access</SelectItem>
                          <SelectItem value="editor">Editor - Create and edit content</SelectItem>
                          <SelectItem value="admin">Admin - Full access to features</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <DialogFooter>
                      <Button type="button" variant="outline" onClick={() => setInviteDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button 
                        type="submit" 
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                        disabled={inviteMutation.isPending}
                      >
                        {inviteMutation.isPending ? "Sending..." : "Send Invitation"}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          )}
        </div>

        {/* Enhanced Team Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
          <Card style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0' }} className="shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Total Members</p>
                  <p className="text-2xl font-bold text-slate-900">{teamStats.totalMembers}</p>
                </div>
                <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0' }} className="shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Active Now</p>
                  <p className="text-2xl font-bold text-emerald-600">{teamStats.activeMembers}</p>
                </div>
                <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200">
                  <Activity className="h-5 w-5 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0' }} className="shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Pending Invites</p>
                  <p className="text-2xl font-bold text-orange-600">{teamStats.pendingInvites}</p>
                </div>
                <div className="p-3 rounded-lg bg-orange-50 border border-orange-200">
                  <Clock className="h-5 w-5 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0' }} className="shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Monthly Activity</p>
                  <p className="text-2xl font-bold text-purple-600">{teamStats.monthlyActivity}%</p>
                </div>
                <div className="p-3 rounded-lg bg-purple-50 border border-purple-200">
                  <TrendingUp className="h-5 w-5 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0' }} className="shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Avg Response</p>
                  <p className="text-2xl font-bold text-indigo-600">{teamStats.averageResponseTime}</p>
                </div>
                <div className="p-3 rounded-lg bg-indigo-50 border border-indigo-200">
                  <MessageSquare className="h-5 w-5 text-indigo-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0' }} className="shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Team Score</p>
                  <p className="text-2xl font-bold text-cyan-600">{teamStats.collaborationScore}</p>
                </div>
                <div className="p-3 rounded-lg bg-cyan-50 border border-cyan-200">
                  <Award className="h-5 w-5 text-cyan-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Search and Filter Bar */}
        <Card style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0' }} className="mb-6 shadow-sm">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search team members..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                    style={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1' }}
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <Select value={filterRole} onValueChange={setFilterRole}>
                  <SelectTrigger className="w-[160px]" style={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1' }}>
                    <SelectValue placeholder="Filter by role" />
                  </SelectTrigger>
                  <SelectContent style={{ backgroundColor: '#ffffff' }}>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="owner">Owner</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="editor">Editor</SelectItem>
                    <SelectItem value="viewer">Viewer</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-[160px]" style={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1' }}>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent style={{ backgroundColor: '#ffffff' }}>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-[500px]" style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
            <TabsTrigger value="members" className="data-[state=active]:bg-white data-[state=active]:text-slate-900">
              <Users className="h-4 w-4 mr-2" />
              Members ({filteredMembers.length})
            </TabsTrigger>
            <TabsTrigger value="invitations" className="data-[state=active]:bg-white data-[state=active]:text-slate-900">
              <Mail className="h-4 w-4 mr-2" />
              Invitations ({filteredInvitations.length})
            </TabsTrigger>
            <TabsTrigger value="roles" className="data-[state=active]:bg-white data-[state=active]:text-slate-900">
              <Shield className="h-4 w-4 mr-2" />
              Roles & Permissions
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-white data-[state=active]:text-slate-900">
              <TrendingUp className="h-4 w-4 mr-2" />
              Team Analytics
            </TabsTrigger>
          </TabsList>

          {/* Members Tab */}
          <TabsContent value="members" className="space-y-4">
            <div className="grid gap-4">
              {membersLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Card key={i} style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0' }}>
                      <CardContent className="p-6">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-slate-200 rounded-full animate-pulse"></div>
                          <div className="flex-1 space-y-2">
                            <div className="h-4 bg-slate-200 rounded animate-pulse"></div>
                            <div className="h-3 bg-slate-200 rounded w-2/3 animate-pulse"></div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : filteredMembers.length === 0 ? (
                <Card style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0' }}>
                  <CardContent className="p-8 text-center">
                    <Users className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">No team members found</h3>
                    <p className="text-slate-600">
                      {searchTerm || filterRole !== "all" || filterStatus !== "all" 
                        ? "Try adjusting your search or filter criteria."
                        : "Start by inviting team members to collaborate on your workspace."
                      }
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <AnimatePresence>
                  {filteredMembers.map((member, index) => {
                    const role = rolePermissions[member.role as keyof typeof rolePermissions];
                    const RoleIcon = role?.icon || UserCheck;
                    
                    return (
                      <motion.div
                        key={member.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <Card style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0' }} className="shadow-sm hover:shadow-md transition-all duration-200">
                          <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                <Avatar className="h-12 w-12 border-2 border-slate-200">
                                  <AvatarImage src={member.user.avatar} alt={member.user.displayName} />
                                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                                    {member.user.displayName ? member.user.displayName.split(' ').map(n => n[0]).join('') : member.user.username.substring(0, 2).toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  <div className="flex items-center space-x-2">
                                    <h3 className="font-semibold text-slate-900">{member.user.displayName || member.user.username}</h3>
                                    {member.role === 'owner' && (
                                      <Crown className="h-4 w-4 text-purple-600" />
                                    )}
                                    {member.lastActiveAt && new Date(member.lastActiveAt) > new Date(Date.now() - 10 * 60 * 1000) && (
                                      <div className="flex items-center space-x-1">
                                        <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                                        <span className="text-xs text-emerald-600 font-medium">Online</span>
                                      </div>
                                    )}
                                  </div>
                                  <p className="text-sm text-slate-600">@{member.user.username}</p>
                                  <p className="text-sm text-slate-500">{member.user.email}</p>
                                  <div className="flex items-center space-x-3 mt-2">
                                    <Badge className={role?.color || "bg-slate-100 text-slate-800"} style={{ border: '1px solid' }}>
                                      <RoleIcon className="w-3 h-3 mr-1" />
                                      {role?.label || member.role}
                                    </Badge>
                                    <span className="text-xs text-slate-500">
                                      Joined {new Date(member.joinedAt).toLocaleDateString()}
                                    </span>
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
                                  <DropdownMenuContent align="end" style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0' }}>
                                    <DropdownMenuItem className="text-slate-700 hover:bg-slate-50">
                                      <Edit className="h-4 w-4 mr-2" />
                                      Change Role
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="text-slate-700 hover:bg-slate-50">
                                      <MessageSquare className="h-4 w-4 mr-2" />
                                      Send Message
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="text-red-600 hover:bg-red-50">
                                      <Trash2 className="h-4 w-4 mr-2" />
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
                </AnimatePresence>
              )}
            </div>
          </TabsContent>

          {/* Invitations Tab */}
          <TabsContent value="invitations" className="space-y-4">
            <div className="grid gap-4">
              {invitationsLoading ? (
                <div className="space-y-4">
                  {[1, 2].map((i) => (
                    <Card key={i} style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0' }}>
                      <CardContent className="p-6">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-slate-200 rounded-full animate-pulse"></div>
                          <div className="flex-1 space-y-2">
                            <div className="h-4 bg-slate-200 rounded animate-pulse"></div>
                            <div className="h-3 bg-slate-200 rounded w-2/3 animate-pulse"></div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : filteredInvitations.length === 0 ? (
                <Card style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0' }}>
                  <CardContent className="p-8 text-center">
                    <Mail className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">No pending invitations</h3>
                    <p className="text-slate-600">All invitations have been accepted or there are no pending invites.</p>
                  </CardContent>
                </Card>
              ) : (
                <AnimatePresence>
                  {filteredInvitations.map((invitation, index) => {
                    const role = rolePermissions[invitation.role as keyof typeof rolePermissions];
                    const RoleIcon = role?.icon || UserCheck;
                    const isExpired = new Date(invitation.expiresAt) < new Date();
                    
                    return (
                      <motion.div
                        key={invitation.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <Card style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0' }} className="shadow-sm">
                          <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                <Avatar className="h-12 w-12 border-2 border-dashed border-slate-300">
                                  <AvatarFallback className="bg-slate-100 text-slate-600">
                                    <Mail className="h-6 w-6" />
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  <h3 className="font-semibold text-slate-900">{invitation.email}</h3>
                                  <div className="flex items-center space-x-3 mt-1">
                                    <Badge className={role?.color || "bg-slate-100 text-slate-800"} style={{ border: '1px solid' }}>
                                      <RoleIcon className="w-3 h-3 mr-1" />
                                      {role?.label || invitation.role}
                                    </Badge>
                                    <Badge 
                                      className={isExpired ? "bg-red-100 text-red-800 border-red-200" : "bg-orange-100 text-orange-800 border-orange-200"}
                                      style={{ border: '1px solid' }}
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
                                  <p className="text-sm text-slate-500 mt-1">
                                    Invited {new Date(invitation.createdAt).toLocaleDateString()} • 
                                    Expires {new Date(invitation.expiresAt).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                              
                              {canManageTeam && (
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                      <MoreVertical className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end" style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0' }}>
                                    <DropdownMenuItem className="text-slate-700 hover:bg-slate-50">
                                      <Copy className="h-4 w-4 mr-2" />
                                      Copy Invite Link
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="text-slate-700 hover:bg-slate-50">
                                      <Mail className="h-4 w-4 mr-2" />
                                      Resend Invitation
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="text-red-600 hover:bg-red-50">
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
                </AnimatePresence>
              )}
            </div>
          </TabsContent>

          {/* Roles & Permissions Tab */}
          <TabsContent value="roles" className="space-y-6">
            <div className="grid gap-6">
              {Object.entries(rolePermissions).map(([roleKey, role]) => {
                const RoleIcon = role.icon;
                return (
                  <Card key={roleKey} style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0' }} className="shadow-sm">
                    <CardHeader>
                      <div className="flex items-center space-x-3">
                        <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                          <RoleIcon className="h-6 w-6 text-slate-700" />
                        </div>
                        <div>
                          <CardTitle className="text-slate-900">{role.label}</CardTitle>
                          <CardDescription className="text-slate-600">{role.description}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="text-sm font-semibold text-emerald-700 mb-3 flex items-center">
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Permissions
                          </h4>
                          <ul className="space-y-2">
                            {role.permissions.can.map((permission, index) => (
                              <li key={index} className="flex items-start space-x-2 text-sm">
                                <CheckCircle className="h-4 w-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                                <span className="text-slate-700">{permission}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        {role.permissions.cannot.length > 0 && (
                          <div>
                            <h4 className="text-sm font-semibold text-red-700 mb-3 flex items-center">
                              <XCircle className="h-4 w-4 mr-2" />
                              Restrictions
                            </h4>
                            <ul className="space-y-2">
                              {role.permissions.cannot.map((restriction, index) => (
                                <li key={index} className="flex items-start space-x-2 text-sm">
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
              {/* Collaboration Score */}
              <Card style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0' }} className="shadow-sm">
                <CardHeader>
                  <CardTitle className="text-slate-900 flex items-center">
                    <Award className="h-5 w-5 mr-2 text-cyan-600" />
                    Team Collaboration Score
                  </CardTitle>
                  <CardDescription className="text-slate-600">
                    Overall team performance and collaboration metrics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-700">Overall Score</span>
                      <span className="text-2xl font-bold text-cyan-600">{teamStats.collaborationScore}/100</span>
                    </div>
                    <Progress value={teamStats.collaborationScore} className="h-3" />
                    <div className="grid grid-cols-2 gap-4 pt-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-emerald-600">{teamStats.activeMembers}</p>
                        <p className="text-sm text-slate-600">Active Members</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-purple-600">{teamStats.monthlyActivity}%</p>
                        <p className="text-sm text-slate-600">Monthly Activity</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Response Time Analytics */}
              <Card style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0' }} className="shadow-sm">
                <CardHeader>
                  <CardTitle className="text-slate-900 flex items-center">
                    <Clock className="h-5 w-5 mr-2 text-indigo-600" />
                    Response Time Analytics
                  </CardTitle>
                  <CardDescription className="text-slate-600">
                    Team communication and response metrics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-700">Average Response Time</span>
                      <span className="text-2xl font-bold text-indigo-600">{teamStats.averageResponseTime}</span>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-600">Urgent Messages</span>
                        <span className="text-sm font-medium text-slate-900">&lt; 30 min</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-600">Regular Messages</span>
                        <span className="text-sm font-medium text-slate-900">&lt; 4 hours</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-600">Non-urgent</span>
                        <span className="text-sm font-medium text-slate-900">&lt; 24 hours</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Activity Overview */}
              <Card style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0' }} className="shadow-sm lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-slate-900 flex items-center">
                    <Activity className="h-5 w-5 mr-2 text-blue-600" />
                    Team Activity Overview
                  </CardTitle>
                  <CardDescription className="text-slate-600">
                    Recent team activities and engagement metrics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="text-center p-4 rounded-lg bg-blue-50 border border-blue-200">
                      <MessageSquare className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-blue-900">1,247</p>
                      <p className="text-sm text-blue-700">Messages Sent</p>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-emerald-50 border border-emerald-200">
                      <Edit className="h-8 w-8 text-emerald-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-emerald-900">89</p>
                      <p className="text-sm text-emerald-700">Content Created</p>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-purple-50 border border-purple-200">
                      <TrendingUp className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-purple-900">156</p>
                      <p className="text-sm text-purple-700">Collaborations</p>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-orange-50 border border-orange-200">
                      <Star className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-orange-900">4.8</p>
                      <p className="text-sm text-orange-700">Team Rating</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}