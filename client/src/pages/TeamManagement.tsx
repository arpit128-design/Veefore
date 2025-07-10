import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Mail, 
  Shield, 
  Settings, 
  Activity,
  Grid3X3,
  List,
  Calendar,
  Star,
  Clock,
  CheckCircle,
  AlertTriangle,
  ChevronDown,
  Edit3,
  Trash2,
  UserPlus,
  Download,
  Eye,
  Crown,
  Badge as BadgeIcon,
  MapPin,
  Calendar as CalendarIcon
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useWorkspace } from '@/hooks/useWorkspace';

// Role definitions
const roles = {
  owner: { label: 'Owner', color: 'bg-purple-100 text-purple-700', icon: Crown },
  admin: { label: 'Admin', color: 'bg-blue-100 text-blue-700', icon: Shield },
  editor: { label: 'Editor', color: 'bg-green-100 text-green-700', icon: Edit3 },
  viewer: { label: 'Viewer', color: 'bg-gray-100 text-gray-700', icon: Eye },
  manager: { label: 'Manager', color: 'bg-orange-100 text-orange-700', icon: BadgeIcon },
};

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: keyof typeof roles;
  avatar?: string;
  status: 'active' | 'inactive' | 'pending';
  lastActive: string;
  department: string;
  location: string;
  joinDate: string;
}

// Mock data for team members
const mockTeamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah@company.com',
    role: 'admin',
    status: 'active',
    lastActive: '2 minutes ago',
    department: 'Design',
    location: 'New York, US',
    joinDate: '2024-01-15'
  },
  {
    id: '2',
    name: 'Michael Chen',
    email: 'michael@company.com',
    role: 'editor',
    status: 'active',
    lastActive: '15 minutes ago',
    department: 'Development',
    location: 'San Francisco, US',
    joinDate: '2024-02-20'
  },
  {
    id: '3',
    name: 'Emma Wilson',
    email: 'emma@company.com',
    role: 'manager',
    status: 'inactive',
    lastActive: '2 hours ago',
    department: 'Marketing',
    location: 'London, UK',
    joinDate: '2024-01-10'
  },
  {
    id: '4',
    name: 'David Rodriguez',
    email: 'david@company.com',
    role: 'viewer',
    status: 'pending',
    lastActive: 'Never',
    department: 'Sales',
    location: 'Madrid, Spain',
    joinDate: '2024-03-05'
  },
  {
    id: '5',
    name: 'Lisa Chang',
    email: 'lisa@company.com',
    role: 'editor',
    status: 'active',
    lastActive: '1 hour ago',
    department: 'Content',
    location: 'Toronto, Canada',
    joinDate: '2024-02-28'
  }
];

export default function TeamManagement() {
  const [members, setMembers] = useState<TeamMember[]>(mockTeamMembers);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('viewer');

  // Filter members based on search and filters
  const filteredMembers = members.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || member.role === filterRole;
    const matchesStatus = filterStatus === 'all' || member.status === filterStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Team statistics
  const stats = {
    total: members.length,
    active: members.filter(m => m.status === 'active').length,
    pending: members.filter(m => m.status === 'pending').length,
    inactive: members.filter(m => m.status === 'inactive').length
  };

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle invite logic
    console.log('Inviting:', inviteEmail, 'as', inviteRole);
    setInviteDialogOpen(false);
    setInviteEmail('');
    setInviteRole('viewer');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Team Management</h1>
            <p className="text-gray-600 mt-1">Manage your team members and their permissions</p>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Stats */}
            <div className="flex items-center gap-6 text-sm bg-white rounded-lg px-6 py-3 shadow-sm border">
              <div className="text-center">
                <div className="text-2xl font-semibold text-gray-900">{stats.total}</div>
                <div className="text-gray-500">Total</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-semibold text-green-600">{stats.active}</div>
                <div className="text-gray-500">Active</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-semibold text-orange-600">{stats.pending}</div>
                <div className="text-gray-500">Pending</div>
              </div>
            </div>
            
            <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Invite Member
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Invite Team Member</DialogTitle>
                  <DialogDescription>
                    Send an invitation to join your team
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleInvite} className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      placeholder="Enter email address"
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
                        {Object.entries(roles).map(([key, role]) => (
                          <SelectItem key={key} value={key}>
                            {role.label}
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
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white rounded-lg p-4 shadow-sm border">
          <div className="flex flex-1 items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search members..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={filterRole} onValueChange={setFilterRole}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All Roles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                {Object.entries(roles).map(([key, role]) => (
                  <SelectItem key={key} value={key}>
                    {role.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex border rounded-md">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="rounded-r-none"
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="rounded-l-none"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
            
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Team Members */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-900">Team Members</h2>
            <p className="text-sm text-gray-600 mt-1">
              {filteredMembers.length} of {members.length} members
            </p>
          </div>
          
          <div className="p-6">
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMembers.map((member) => {
                  const RoleIcon = roles[member.role].icon;
                  return (
                    <motion.div
                      key={member.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Card className="hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className="relative">
                                <Avatar className="h-12 w-12">
                                  <AvatarImage src={member.avatar} />
                                  <AvatarFallback className="bg-blue-100 text-blue-600 font-medium">
                                    {member.name.split(' ').map(n => n[0]).join('')}
                                  </AvatarFallback>
                                </Avatar>
                                <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                                  member.status === 'active' ? 'bg-green-500' :
                                  member.status === 'pending' ? 'bg-orange-500' : 'bg-gray-400'
                                }`} />
                              </div>
                              <div>
                                <h3 className="font-medium text-gray-900">{member.name}</h3>
                                <p className="text-sm text-gray-500">{member.email}</p>
                              </div>
                            </div>
                            
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <Edit3 className="w-4 h-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-red-600">
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Remove
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                          
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <Badge className={roles[member.role].color}>
                                <RoleIcon className="w-3 h-3 mr-1" />
                                {roles[member.role].label}
                              </Badge>
                              <span className="text-sm text-gray-500">{member.department}</span>
                            </div>
                            
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <MapPin className="w-4 h-4" />
                              {member.location}
                            </div>
                            
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <Clock className="w-4 h-4" />
                              Last active: {member.lastActive}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredMembers.map((member) => {
                  const RoleIcon = roles[member.role].icon;
                  return (
                    <motion.div
                      key={member.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-center gap-6 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="relative">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={member.avatar} />
                          <AvatarFallback className="bg-blue-100 text-blue-600 font-medium">
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                          member.status === 'active' ? 'bg-green-500' :
                          member.status === 'pending' ? 'bg-orange-500' : 'bg-gray-400'
                        }`} />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h3 className="font-medium text-gray-900">{member.name}</h3>
                          <Badge className={roles[member.role].color}>
                            <RoleIcon className="w-3 h-3 mr-1" />
                            {roles[member.role].label}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-500">{member.email}</p>
                      </div>
                      
                      <div className="text-sm text-gray-500">
                        <div>{member.department}</div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {member.location}
                        </div>
                      </div>
                      
                      <div className="text-sm text-gray-500 text-right">
                        <div>Last active:</div>
                        <div>{member.lastActive}</div>
                      </div>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Edit3 className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Remove
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}