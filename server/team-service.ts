import { storage } from './storage';
import type { User, Workspace, WorkspaceMember, TeamInvitation, InsertWorkspaceMember, InsertTeamInvitation } from '@shared/schema';
import { generateRandomString } from './utils';

// Role-based permissions system
export const ROLE_PERMISSIONS = {
  owner: {
    // Full access to everything
    workspace: ['read', 'update', 'delete', 'invite', 'manage_members'],
    content: ['create', 'read', 'update', 'delete', 'publish', 'schedule'],
    analytics: ['read', 'export'],
    social_accounts: ['connect', 'disconnect', 'manage'],
    billing: ['read', 'update', 'cancel'],
    ai_features: ['use', 'configure']
  },
  editor: {
    // Can create and manage content, limited workspace access
    workspace: ['read'],
    content: ['create', 'read', 'update', 'delete', 'publish', 'schedule'],
    analytics: ['read'],
    social_accounts: ['read', 'manage'], // Can post but not disconnect
    billing: [],
    ai_features: ['use']
  },
  viewer: {
    // Read-only access
    workspace: ['read'],
    content: ['read'],
    analytics: ['read'],
    social_accounts: ['read'],
    billing: [],
    ai_features: []
  }
} as const;

// Subscription-based team limits
export const SUBSCRIPTION_TEAM_LIMITS = {
  free: { maxMembers: 1, canInvite: false },
  creator: { maxMembers: 3, canInvite: true },
  pro: { maxMembers: 10, canInvite: true },
  enterprise: { maxMembers: 50, canInvite: true }
} as const;

export class TeamService {
  // Check if user has permission for specific action
  static hasPermission(memberRole: string, resource: string, action: string): boolean {
    const permissions = ROLE_PERMISSIONS[memberRole as keyof typeof ROLE_PERMISSIONS];
    if (!permissions) return false;
    
    const resourcePermissions = permissions[resource as keyof typeof permissions];
    return resourcePermissions?.includes(action) || false;
  }

  // Get workspace member with role
  static async getWorkspaceMember(workspaceId: number, userId: number): Promise<WorkspaceMember | null> {
    return await storage.getWorkspaceMember(workspaceId, userId);
  }

  // Get all workspace members
  static async getWorkspaceMembers(workspaceId: number): Promise<(WorkspaceMember & { user: User })[]> {
    return await storage.getWorkspaceMembers(workspaceId);
  }

  // Check if user can invite members based on subscription
  static async canInviteMembers(workspace: Workspace, currentUser: User): Promise<{ canInvite: boolean; reason?: string }> {
    const limits = SUBSCRIPTION_TEAM_LIMITS[currentUser.plan as keyof typeof SUBSCRIPTION_TEAM_LIMITS] || SUBSCRIPTION_TEAM_LIMITS.free;
    
    if (!limits.canInvite) {
      return { canInvite: false, reason: 'Upgrade to Creator plan or higher to invite team members' };
    }

    const currentMembers = await this.getWorkspaceMembers(workspace.id);
    if (currentMembers.length >= limits.maxMembers) {
      return { canInvite: false, reason: `Team size limit reached (${limits.maxMembers} members max)` };
    }

    return { canInvite: true };
  }

  // Create team invitation
  static async inviteTeamMember(
    workspaceId: number, 
    invitedBy: number, 
    email: string, 
    role: 'editor' | 'viewer',
    permissions?: any
  ): Promise<TeamInvitation> {
    const token = generateRandomString(32);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days expiry

    const invitation: InsertTeamInvitation = {
      workspaceId,
      invitedBy,
      email: email.toLowerCase(),
      role,
      permissions: permissions || ROLE_PERMISSIONS[role],
      token,
      expiresAt
    };

    return await storage.createTeamInvitation(invitation);
  }

  // Accept team invitation
  static async acceptInvitation(token: string, userId: number): Promise<{ success: boolean; member?: WorkspaceMember; error?: string }> {
    const invitation = await storage.getTeamInvitationByToken(token);
    
    if (!invitation) {
      return { success: false, error: 'Invalid invitation token' };
    }

    if (invitation.status !== 'pending') {
      return { success: false, error: 'Invitation already used or expired' };
    }

    if (new Date() > invitation.expiresAt) {
      return { success: false, error: 'Invitation has expired' };
    }

    // Check if user is already a member
    const existingMember = await this.getWorkspaceMember(invitation.workspaceId, userId);
    if (existingMember) {
      return { success: false, error: 'Already a member of this workspace' };
    }

    // Add user to workspace
    const memberData: InsertWorkspaceMember = {
      workspaceId: invitation.workspaceId,
      userId,
      role: invitation.role,
      permissions: invitation.permissions,
      invitedBy: invitation.invitedBy
    };

    const member = await storage.addWorkspaceMember(memberData);
    
    // Mark invitation as accepted
    await storage.updateTeamInvitation(invitation.id, {
      status: 'accepted',
      acceptedAt: new Date()
    });

    return { success: true, member };
  }

  // Remove team member
  static async removeMember(workspaceId: number, userId: number, removedBy: number): Promise<{ success: boolean; error?: string }> {
    // Check if remover has permission
    const removerMember = await this.getWorkspaceMember(workspaceId, removedBy);
    if (!removerMember || !this.hasPermission(removerMember.role, 'workspace', 'manage_members')) {
      return { success: false, error: 'Permission denied' };
    }

    // Cannot remove workspace owner
    const targetMember = await this.getWorkspaceMember(workspaceId, userId);
    if (targetMember?.role === 'owner') {
      return { success: false, error: 'Cannot remove workspace owner' };
    }

    await storage.removeWorkspaceMember(workspaceId, userId);
    return { success: true };
  }

  // Update member role
  static async updateMemberRole(
    workspaceId: number, 
    userId: number, 
    newRole: 'editor' | 'viewer', 
    updatedBy: number
  ): Promise<{ success: boolean; error?: string }> {
    // Check if updater has permission
    const updaterMember = await this.getWorkspaceMember(workspaceId, updatedBy);
    if (!updaterMember || !this.hasPermission(updaterMember.role, 'workspace', 'manage_members')) {
      return { success: false, error: 'Permission denied' };
    }

    // Cannot change owner role
    const targetMember = await this.getWorkspaceMember(workspaceId, userId);
    if (targetMember?.role === 'owner') {
      return { success: false, error: 'Cannot change owner role' };
    }

    await storage.updateWorkspaceMember(workspaceId, userId, {
      role: newRole,
      permissions: ROLE_PERMISSIONS[newRole]
    });

    return { success: true };
  }

  // Get pending invitations for workspace
  static async getPendingInvitations(workspaceId: number): Promise<TeamInvitation[]> {
    return await storage.getTeamInvitations(workspaceId, 'pending');
  }

  // Cancel invitation
  static async cancelInvitation(invitationId: number, cancelledBy: number): Promise<{ success: boolean; error?: string }> {
    const invitation = await storage.getTeamInvitation(invitationId);
    if (!invitation) {
      return { success: false, error: 'Invitation not found' };
    }

    // Check if canceller has permission
    const member = await this.getWorkspaceMember(invitation.workspaceId, cancelledBy);
    if (!member || !this.hasPermission(member.role, 'workspace', 'manage_members')) {
      return { success: false, error: 'Permission denied' };
    }

    await storage.updateTeamInvitation(invitationId, { status: 'cancelled' });
    return { success: true };
  }

  // Generate workspace invite code for easy sharing
  static async generateInviteCode(workspaceId: number, generatedBy: number): Promise<{ success: boolean; code?: string; error?: string }> {
    const member = await this.getWorkspaceMember(workspaceId, generatedBy);
    if (!member || !this.hasPermission(member.role, 'workspace', 'invite')) {
      return { success: false, error: 'Permission denied' };
    }

    const inviteCode = generateRandomString(8).toUpperCase();
    await storage.updateWorkspace(workspaceId, { inviteCode });
    
    return { success: true, code: inviteCode };
  }

  // Join workspace by invite code
  static async joinByInviteCode(inviteCode: string, userId: number): Promise<{ success: boolean; workspace?: Workspace; error?: string }> {
    const workspace = await storage.getWorkspaceByInviteCode(inviteCode);
    if (!workspace) {
      return { success: false, error: 'Invalid invite code' };
    }

    // Check if user is already a member
    const existingMember = await this.getWorkspaceMember(workspace.id, userId);
    if (existingMember) {
      return { success: false, error: 'Already a member of this workspace' };
    }

    // Check team size limits
    const owner = await storage.getUser(workspace.userId);
    if (!owner) {
      return { success: false, error: 'Workspace owner not found' };
    }

    const canInvite = await this.canInviteMembers(workspace, owner);
    if (!canInvite.canInvite) {
      return { success: false, error: canInvite.reason };
    }

    // Add as viewer by default when joining via invite code
    const memberData: InsertWorkspaceMember = {
      workspaceId: workspace.id,
      userId,
      role: 'viewer',
      permissions: ROLE_PERMISSIONS.viewer,
      invitedBy: workspace.userId
    };

    await storage.addWorkspaceMember(memberData);
    return { success: true, workspace };
  }
}

// Utility function to generate random strings
function generateRandomString(length: number): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}