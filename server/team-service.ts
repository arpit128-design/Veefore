import type { User, Workspace, WorkspaceMember, TeamInvitation, InsertWorkspaceMember, InsertTeamInvitation } from '@shared/schema';
import crypto from 'crypto';

function generateRandomString(length: number): string {
  return crypto.randomBytes(Math.ceil(length / 2)).toString('hex').slice(0, length);
}

export const ROLE_PERMISSIONS = {
  owner: {
    workspace: ['read', 'update', 'delete', 'invite', 'manage_members'],
    content: ['create', 'read', 'update', 'delete', 'publish', 'schedule'],
    analytics: ['read', 'export'],
    social_accounts: ['connect', 'disconnect', 'manage'],
    billing: ['read', 'update', 'cancel'],
    ai_features: ['use', 'configure']
  },
  admin: {
    workspace: ['read', 'update', 'invite', 'manage_members'],
    content: ['create', 'read', 'update', 'delete', 'publish', 'schedule'],
    analytics: ['read', 'export'],
    social_accounts: ['connect', 'disconnect', 'manage'],
    billing: [],
    ai_features: ['use', 'configure']
  },
  editor: {
    workspace: ['read'],
    content: ['create', 'read', 'update', 'delete', 'publish', 'schedule'],
    analytics: ['read'],
    social_accounts: ['read', 'manage'],
    billing: [],
    ai_features: ['use']
  },
  viewer: {
    workspace: ['read'],
    content: ['read'],
    analytics: ['read'],
    social_accounts: ['read'],
    billing: [],
    ai_features: []
  }
} as const;

export class TeamService {
  static hasPermission(memberRole: string, resource: string, action: string): boolean {
    const permissions = ROLE_PERMISSIONS[memberRole as keyof typeof ROLE_PERMISSIONS];
    if (!permissions) return false;
    
    const resourcePermissions = permissions[resource as keyof typeof permissions] as readonly string[];
    return resourcePermissions ? resourcePermissions.includes(action) : false;
  }

  static async canInviteMembers(workspace: Workspace, user: User): Promise<{ canInvite: boolean; reason?: string }> {
    if (workspace.userId === user.id) {
      return { canInvite: true };
    }
    return { canInvite: false, reason: 'Only workspace owners and admins can invite members' };
  }

  static async inviteTeamMember(
    workspaceId: number, 
    email: string, 
    role: 'admin' | 'editor' | 'viewer',
    invitedBy: number,
    storage: any
  ): Promise<{ success: boolean; invitation?: TeamInvitation; error?: string }> {
    try {
      const token = generateRandomString(32);
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);

      const invitation: InsertTeamInvitation = {
        workspaceId,
        invitedBy,
        email: email.toLowerCase(),
        role,
        permissions: ROLE_PERMISSIONS[role] || {},
        token,
        expiresAt
      };

      const createdInvitation = await storage.createTeamInvitation(invitation);
      return { success: true, invitation: createdInvitation };
    } catch (error: any) {
      console.error('[TEAM SERVICE] Invite error:', error);
      return { success: false, error: 'Failed to create invitation' };
    }
  }
}