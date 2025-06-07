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
import { useToast } from "@/hooks/use-toast";
import { UserPlus, Users, Mail, Shield, MoreVertical, Copy, Link, Trash2, Crown, Eye, Edit } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { useWorkspace } from "@/hooks/useWorkspace";

interface TeamMember {
  id: number;
  userId: number;
  workspaceId: number;
  role: string;
  status: string;
  joinedAt: string;
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

const rolePermissions = {
  owner: { 
    label: "Owner", 
    icon: Crown, 
    color: "bg-purple-100 text-purple-800", 
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
    color: "bg-yellow-100 text-yellow-800", 
    description: "Full access to all features",
    permissions: {
      can: [
        "Invite and remove team members",
        "Change Editor/Viewer roles (cannot change Owner or other Admins)",
        "Create, edit, and publish content",
        "View all analytics and reports",
        "Connect social media accounts",
        "Use AI suggestions and content generation",
        "Schedule and manage content",
        "Access team management",
        "Manage workspace settings (except billing)"
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
    color: "bg-blue-100 text-blue-800", 
    description: "Can create and manage content",
    permissions: {
      can: [
        "Create, edit, and publish content",
        "View analytics for their own content",
        "Use AI suggestions and content generation",
        "Schedule content",
        "Connect their own social media accounts",
        "Upload and manage media"
      ],
      cannot: [
        "Manage team members",
        "Change user roles",
        "View other members' content analytics",
        "Access billing information",
        "Delete workspace",
        "Manage workspace settings",
        "Remove other users' content"
      ]
    }
  },
  viewer: { 
    label: "Viewer", 
    icon: Eye, 
    color: "bg-gray-100 text-gray-800", 
    description: "Can view content and analytics",
    permissions: {
      can: [
        "View published content",
        "View basic analytics and reports",
        "Export reports",
        "View team members list"
      ],
      cannot: [
        "Create or edit content",
        "Publish content",
        "Manage team members",
        "Change user roles",
        "Connect social media accounts",
        "Use AI suggestions",
        "Schedule content",
        "Access billing information",
        "Delete workspace",
        "Manage workspace settings"
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
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("viewer");
  const [generatedInviteCode, setGeneratedInviteCode] = useState("");

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
    enabled: !!currentWorkspace?.id && currentWorkspace?.userId === user?.id
  });

  // Invite member mutation
  const inviteMutation = useMutation({
    mutationFn: async ({ email, role }: { email: string; role: string }) => {
      const response = await apiRequest('POST', `/api/workspaces/${currentWorkspace?.id}/invite`, {
        email,
        role
      });
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Invitation sent",
        description: "Team member invitation has been sent successfully."
      });
      setInviteDialogOpen(false);
      setInviteEmail("");
      setInviteRole("viewer");
      queryClient.invalidateQueries({ queryKey: ['workspace-invitations'] });
    },
    onError: (error: any) => {
      // Check if upgrade is needed (402 Payment Required)
      if (error.status === 402 && error.needsUpgrade) {
        toast({
          title: "Upgrade Required",
          description: error.message,
          variant: "destructive",
          action: (
            <button 
              onClick={() => window.location.href = '/pricing'}
              className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
            >
              Upgrade Now
            </button>
          )
        });
      } else {
        toast({
          title: "Failed to send invitation",
          description: error.message || "An error occurred while sending the invitation.",
          variant: "destructive"
        });
      }
    }
  });

  // Generate invite code mutation
  const generateCodeMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', `/api/workspaces/${currentWorkspace?.id}/invite-code`);
      return response.json();
    },
    onSuccess: (data) => {
      setGeneratedInviteCode(data.code);
      setInviteCodeDialogOpen(true);
    },
    onError: (error: any) => {
      toast({
        title: "Failed to generate invite code",
        description: error.message || "An error occurred while generating the invite code.",
        variant: "destructive"
      });
    }
  });

  // Remove member mutation
  const removeMemberMutation = useMutation({
    mutationFn: async (memberId: number) => {
      const response = await apiRequest('DELETE', `/api/workspaces/${currentWorkspace?.id}/members/${memberId}`);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Member removed",
        description: "Team member has been removed successfully."
      });
      queryClient.invalidateQueries({ queryKey: ['workspace-members'] });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to remove member",
        description: error.message || "An error occurred while removing the member.",
        variant: "destructive"
      });
    }
  });

  // Update member role mutation
  const updateRoleMutation = useMutation({
    mutationFn: async ({ memberId, role }: { memberId: number; role: string }) => {
      const response = await apiRequest('PATCH', `/api/workspaces/${currentWorkspace?.id}/members/${memberId}`, {
        role
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Role updated",
        description: "Member role has been updated successfully."
      });
      queryClient.invalidateQueries({ queryKey: ['workspace-members'] });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to update role",
        description: error.message || "An error occurred while updating the role.",
        variant: "destructive"
      });
    }
  });

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail || !inviteRole) return;
    inviteMutation.mutate({ email: inviteEmail, role: inviteRole });
  };

  const copyInviteCode = () => {
    navigator.clipboard.writeText(generatedInviteCode);
    toast({
      title: "Copied!",
      description: "Invite code copied to clipboard."
    });
  };

  const isOwner = currentWorkspace?.userId === user?.id;
  const userMember = members?.find((member: TeamMember) => member.userId === user?.id);
  const isAdmin = userMember?.role === 'admin';
  const canManageTeam = isOwner || isAdmin;

  if (!currentWorkspace) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-2">
          <Users className="h-6 w-6 text-blue-400" />
          <h1 className="text-2xl font-bold text-white">Team Management</h1>
        </div>
        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-6">
            <p className="text-gray-400">Please select a workspace to manage team members.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Users className="h-6 w-6 text-blue-400" />
          <h1 className="text-2xl font-bold text-white">Team Management</h1>
        </div>
        {canManageTeam && (
          <div className="flex space-x-2">
            <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Invite Member
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-gray-800 border-gray-700">
                <DialogHeader>
                  <DialogTitle className="text-white">Invite Team Member</DialogTitle>
                  <DialogDescription className="text-gray-400">
                    Send an invitation to join this workspace.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleInviteSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="email" className="text-white">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      placeholder="colleague@example.com"
                      className="bg-gray-700 border-gray-600 text-white"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="role" className="text-white">Role</Label>
                    <Select value={inviteRole} onValueChange={setInviteRole}>
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        <SelectItem value="viewer">Viewer</SelectItem>
                        <SelectItem value="editor">Editor</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <DialogFooter>
                    <Button type="submit" disabled={inviteMutation.isPending}>
                      {inviteMutation.isPending ? "Sending..." : "Send Invitation"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>

            <Button
              variant="outline"
              onClick={() => generateCodeMutation.mutate()}
              disabled={generateCodeMutation.isPending}
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              <Link className="w-4 h-4 mr-2" />
              Generate Invite Code
            </Button>
          </div>
        )}
      </div>

      {/* Current Members */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Team Members</CardTitle>
          <CardDescription className="text-gray-400">
            Manage workspace members and their permissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {membersLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center space-x-4 p-4 bg-gray-700/50 rounded-lg animate-pulse">
                  <div className="w-10 h-10 bg-gray-600 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-600 rounded w-1/4" />
                    <div className="h-3 bg-gray-600 rounded w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {members.map((member: TeamMember) => {
                const normalizedRole = member.role.toLowerCase() as keyof typeof rolePermissions;
                const roleInfo = rolePermissions[normalizedRole];
                const RoleIcon = roleInfo?.icon || Shield;
                
                return (
                  <div key={member.id} className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarImage src={member.user.avatar} />
                        <AvatarFallback className="bg-blue-600 text-white">
                          {member.user.displayName?.charAt(0) || member.user.username.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-white">
                          {member.user.displayName || member.user.username}
                        </p>
                        <p className="text-sm text-gray-400">{member.user.email}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Badge className={roleInfo?.color || "bg-gray-100 text-gray-800"}>
                        <RoleIcon className="w-3 h-3 mr-1" />
                        {roleInfo?.label || member.role}
                      </Badge>
                      
                      {canManageTeam && member.userId !== user?.id && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="bg-gray-800 border-gray-700">
                            {member.role !== 'admin' && (
                              <DropdownMenuItem
                                onClick={() => updateRoleMutation.mutate({ 
                                  memberId: member.userId, 
                                  role: 'admin'
                                })}
                                className="text-yellow-400 hover:bg-gray-700"
                              >
                                <Shield className="w-4 h-4 mr-2" />
                                Make Admin
                              </DropdownMenuItem>
                            )}
                            {member.role !== 'editor' && (
                              <DropdownMenuItem
                                onClick={() => updateRoleMutation.mutate({ 
                                  memberId: member.userId, 
                                  role: 'editor'
                                })}
                                className="text-blue-400 hover:bg-gray-700"
                              >
                                <Edit className="w-4 h-4 mr-2" />
                                Make Editor
                              </DropdownMenuItem>
                            )}
                            {member.role !== 'viewer' && (
                              <DropdownMenuItem
                                onClick={() => updateRoleMutation.mutate({ 
                                  memberId: member.userId, 
                                  role: 'viewer'
                                })}
                                className="text-gray-400 hover:bg-gray-700"
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                Make Viewer
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem
                              onClick={() => removeMemberMutation.mutate(member.userId)}
                              className="text-red-400 hover:bg-gray-700 hover:text-red-300"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Remove Member
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Role Permissions Guide */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Role Permissions</CardTitle>
          <CardDescription className="text-gray-400">
            Understand what each team role can and cannot do
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(rolePermissions).map(([roleKey, role]) => {
              const RoleIcon = role.icon;
              return (
                <div key={roleKey} className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Badge className={role.color}>
                      <RoleIcon className="w-3 h-3 mr-1" />
                      {role.label}
                    </Badge>
                    <span className="text-sm text-gray-400">{role.description}</span>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-sm font-semibold text-green-400 mb-2">✓ Can Do:</h4>
                      <ul className="text-xs text-gray-300 space-y-1">
                        {role.permissions.can.map((permission, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <span className="text-green-400 mt-1">•</span>
                            <span>{permission}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    {role.permissions.cannot.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-red-400 mb-2">✗ Cannot Do:</h4>
                        <ul className="text-xs text-gray-300 space-y-1">
                          {role.permissions.cannot.map((restriction, index) => (
                            <li key={index} className="flex items-start space-x-2">
                              <span className="text-red-400 mt-1">•</span>
                              <span>{restriction}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Pending Invitations */}
      {canManageTeam && (
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Pending Invitations</CardTitle>
            <CardDescription className="text-gray-400">
              Invitations that haven't been accepted yet
            </CardDescription>
          </CardHeader>
          <CardContent>
            {invitationsLoading ? (
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <div key={i} className="flex items-center space-x-4 p-4 bg-gray-700/50 rounded-lg animate-pulse">
                    <div className="w-10 h-10 bg-gray-600 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-600 rounded w-1/4" />
                      <div className="h-3 bg-gray-600 rounded w-1/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : invitations.length === 0 ? (
              <p className="text-gray-400 text-center py-8">No pending invitations</p>
            ) : (
              <div className="space-y-4">
                {invitations.map((invitation: TeamInvitation) => (
                  <div key={invitation.id} className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center">
                        <Mail className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-white">{invitation.email}</p>
                        <p className="text-sm text-gray-400">
                          Invited {new Date(invitation.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Badge className="bg-orange-100 text-orange-800">
                        {invitation.role}
                      </Badge>
                      <Badge variant="outline" className="border-orange-400 text-orange-400">
                        Pending
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Invite Code Dialog */}
      <Dialog open={inviteCodeDialogOpen} onOpenChange={setInviteCodeDialogOpen}>
        <DialogContent className="bg-gray-800 border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-white">Workspace Invite Code</DialogTitle>
            <DialogDescription className="text-gray-400">
              Share this code with team members to join the workspace instantly.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center space-x-2 p-3 bg-gray-700 rounded-lg">
              <code className="flex-1 text-green-400 font-mono text-lg">{generatedInviteCode}</code>
              <Button
                size="sm"
                onClick={copyInviteCode}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-sm text-gray-400">
              This code can be used by anyone to join the workspace with viewer permissions.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}