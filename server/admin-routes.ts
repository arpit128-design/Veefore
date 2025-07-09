import type { Express } from "express";
import { z } from "zod";
import { storage } from "./storage";
import { requireAdminAuth, requireRole, logAdminAction, hashPassword, verifyPassword, generateToken, AdminRequest } from "./admin-auth";
import { insertAdminSchema, insertNotificationSchema, insertPopupSchema, insertAppSettingSchema, insertFeedbackMessageSchema } from "@shared/schema";

export function registerAdminRoutes(app: Express) {
  // Admin Authentication
  app.post("/api/admin/login", async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
      }

      const admin = await storage.getAdminByEmail(email);
      if (!admin || !admin.isActive) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const isValidPassword = await verifyPassword(password, admin.password);
      if (!isValidPassword) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Update last login
      await storage.updateAdmin(admin.id, { lastLogin: new Date() });

      const token = generateToken(admin);
      
      // Create admin session
      await storage.createAdminSession({
        adminId: admin.id,
        token,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
      });

      await logAdminAction(admin.id, "LOGIN", "admin", admin.id.toString(), undefined, undefined, req.ip, req.get('User-Agent'));

      res.json({
        token,
        admin: {
          id: admin.id,
          email: admin.email,
          username: admin.username,
          role: admin.role,
          lastLogin: admin.lastLogin
        }
      });
    } catch (error) {
      console.error('[ADMIN AUTH] Login error:', error);
      res.status(500).json({ error: "Authentication failed" });
    }
  });

  app.post("/api/admin/logout", requireAdminAuth, async (req: AdminRequest, res) => {
    try {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7);
        await storage.deleteAdminSession(token);
      }

      await logAdminAction(req.admin!.id, "LOGOUT", "admin", req.admin!.id.toString(), undefined, undefined, req.ip, req.get('User-Agent'));
      
      res.json({ message: "Logged out successfully" });
    } catch (error) {
      console.error('[ADMIN AUTH] Logout error:', error);
      res.status(500).json({ error: "Logout failed" });
    }
  });

  // Admin Dashboard Analytics
  app.get("/api/admin/stats", requireAdminAuth, async (req: AdminRequest, res) => {
    try {
      const stats = await storage.getAdminStats();
      res.json(stats);
    } catch (error) {
      console.error('[ADMIN STATS] Error:', error);
      res.status(500).json({ error: "Failed to fetch stats" });
    }
  });

  // User Management
  app.get("/api/admin/users", requireAdminAuth, async (req: AdminRequest, res) => {
    try {
      const { page = 1, limit = 10, search, filter } = req.query;
      const pageNum = parseInt(page as string);
      const limitNum = parseInt(limit as string);
      
      // Get users from MongoDB with pagination and search
      const result = await storage.getAdminUsers({
        page: pageNum,
        limit: limitNum,
        search: search as string,
        filter: filter as string
      });
      
      res.json(result);
    } catch (error) {
      console.error('[ADMIN USERS] Error:', error);
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });

  app.patch("/api/admin/users/:id", requireAdminAuth, requireRole(["admin", "superadmin"]), async (req: AdminRequest, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;

      const oldUser = await storage.getUser(parseInt(id));
      if (!oldUser) {
        return res.status(404).json({ error: "User not found" });
      }

      const updatedUser = await storage.updateUser(parseInt(id), updates);

      await logAdminAction(
        req.admin!.id,
        "UPDATE_USER",
        "user",
        id,
        oldUser,
        updates,
        req.ip,
        req.get('User-Agent')
      );

      res.json(updatedUser);
    } catch (error) {
      console.error('[ADMIN USER UPDATE] Error:', error);
      res.status(500).json({ error: "Failed to update user" });
    }
  });

  // Content Management
  app.get("/api/admin/content", requireAdminAuth, async (req: AdminRequest, res) => {
    try {
      const { page = 1, limit = 10, search, filter } = req.query;
      const pageNum = parseInt(page as string);
      const limitNum = parseInt(limit as string);
      
      const filters = filter !== 'all' ? { status: filter } : {};
      const result = await storage.getAdminContent(pageNum, limitNum, filters);
      
      res.json(result);
    } catch (error) {
      console.error('[ADMIN CONTENT] Error:', error);
      res.status(500).json({ error: "Failed to fetch content" });
    }
  });

  app.patch("/api/admin/content/:id", requireAdminAuth, requireRole(["admin", "superadmin"]), async (req: AdminRequest, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;

      const oldContent = await storage.getContent(parseInt(id));
      if (!oldContent) {
        return res.status(404).json({ error: "Content not found" });
      }

      const updatedContent = await storage.updateContent(parseInt(id), updates);

      await logAdminAction(
        req.admin!.id,
        "UPDATE_CONTENT",
        "content",
        id,
        oldContent,
        updates,
        req.ip,
        req.get('User-Agent')
      );

      res.json(updatedContent);
    } catch (error) {
      console.error('[ADMIN UPDATE CONTENT] Error:', error);
      res.status(500).json({ error: "Failed to update content" });
    }
  });

  app.delete("/api/admin/content/:id", requireAdminAuth, requireRole(["admin", "superadmin"]), async (req: AdminRequest, res) => {
    try {
      const { id } = req.params;

      const content = await storage.getContent(parseInt(id));
      if (!content) {
        return res.status(404).json({ error: "Content not found" });
      }

      await storage.deleteContent(parseInt(id));

      await logAdminAction(
        req.admin!.id,
        "DELETE_CONTENT",
        "content",
        id,
        content,
        undefined,
        req.ip,
        req.get('User-Agent')
      );

      res.json({ message: "Content deleted successfully" });
    } catch (error) {
      console.error('[ADMIN DELETE CONTENT] Error:', error);
      res.status(500).json({ error: "Failed to delete content" });
    }
  });

  // Notifications Management
  app.get("/api/admin/notifications", requireAdminAuth, async (req: AdminRequest, res) => {
    try {
      const { page = 1, limit = 10, type } = req.query;
      const pageNum = parseInt(page as string);
      const limitNum = parseInt(limit as string);
      
      const result = await storage.getAdminNotifications(pageNum, limitNum, type as string);
      
      res.json(result);
    } catch (error) {
      console.error('[ADMIN NOTIFICATIONS] Error:', error);
      res.status(500).json({ error: "Failed to fetch notifications" });
    }
  });

  app.post("/api/admin/notifications", requireAdminAuth, requireRole(["admin", "superadmin"]), async (req: AdminRequest, res) => {
    try {
      // Custom validation schema to handle frontend data format
      const notificationSchema = z.object({
        title: z.string().min(1, "Title is required"),
        message: z.string().min(1, "Message is required"),
        type: z.string().default("info"),
        targetUsers: z.string().default("all").transform((val) => [val]), // Transform string to array
        scheduledFor: z.string().optional().transform((val) => val ? new Date(val) : undefined), // Transform string to Date
        userId: z.number().optional()
      });

      const validatedData = notificationSchema.parse(req.body);
      const notification = await storage.createNotification(validatedData);

      await logAdminAction(
        req.admin!.id,
        "CREATE_NOTIFICATION",
        "notification",
        notification.id.toString(),
        undefined,
        notification,
        req.ip,
        req.get('User-Agent')
      );

      res.status(201).json(notification);
    } catch (error) {
      console.error('[ADMIN CREATE NOTIFICATION] Error:', error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid notification data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create notification" });
    }
  });

  app.patch("/api/admin/notifications/:id", requireAdminAuth, requireRole(["admin", "superadmin"]), async (req: AdminRequest, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;

      const oldNotification = await storage.getNotifications();
      const notification = await storage.updateNotification(parseInt(id), updates);

      await logAdminAction(
        req.admin!.id,
        "UPDATE_NOTIFICATION",
        "notification",
        id,
        oldNotification,
        updates,
        req.ip,
        req.get('User-Agent')
      );

      res.json(notification);
    } catch (error) {
      console.error('[ADMIN UPDATE NOTIFICATION] Error:', error);
      res.status(500).json({ error: "Failed to update notification" });
    }
  });

  app.delete("/api/admin/notifications/:id", requireAdminAuth, requireRole(["admin", "superadmin"]), async (req: AdminRequest, res) => {
    try {
      const { id } = req.params;
      await storage.deleteNotification(parseInt(id));

      await logAdminAction(
        req.admin!.id,
        "DELETE_NOTIFICATION",
        "notification",
        id,
        undefined,
        undefined,
        req.ip,
        req.get('User-Agent')
      );

      res.json({ message: "Notification deleted successfully" });
    } catch (error) {
      console.error('[ADMIN DELETE NOTIFICATION] Error:', error);
      res.status(500).json({ error: "Failed to delete notification" });
    }
  });

  // Popups Management
  app.get("/api/admin/popups", requireAdminAuth, async (req: AdminRequest, res) => {
    try {
      const popups = await storage.getActivePopups();
      res.json(popups);
    } catch (error) {
      console.error('[ADMIN POPUPS] Error:', error);
      res.status(500).json({ error: "Failed to fetch popups" });
    }
  });

  app.post("/api/admin/popups", requireAdminAuth, requireRole(["admin", "superadmin"]), async (req: AdminRequest, res) => {
    try {
      const validatedData = insertPopupSchema.parse(req.body);
      const popup = await storage.createPopup(validatedData);

      await logAdminAction(
        req.admin!.id,
        "CREATE_POPUP",
        "popup",
        popup.id.toString(),
        undefined,
        popup,
        req.ip,
        req.get('User-Agent')
      );

      res.status(201).json(popup);
    } catch (error) {
      console.error('[ADMIN CREATE POPUP] Error:', error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid popup data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create popup" });
    }
  });

  app.patch("/api/admin/popups/:id", requireAdminAuth, requireRole(["admin", "superadmin"]), async (req: AdminRequest, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;

      const oldPopup = await storage.getPopup(parseInt(id));
      const popup = await storage.updatePopup(parseInt(id), updates);

      await logAdminAction(
        req.admin!.id,
        "UPDATE_POPUP",
        "popup",
        id,
        oldPopup,
        updates,
        req.ip,
        req.get('User-Agent')
      );

      res.json(popup);
    } catch (error) {
      console.error('[ADMIN UPDATE POPUP] Error:', error);
      res.status(500).json({ error: "Failed to update popup" });
    }
  });

  app.delete("/api/admin/popups/:id", requireAdminAuth, requireRole(["admin", "superadmin"]), async (req: AdminRequest, res) => {
    try {
      const { id } = req.params;
      await storage.deletePopup(parseInt(id));

      await logAdminAction(
        req.admin!.id,
        "DELETE_POPUP",
        "popup",
        id,
        undefined,
        undefined,
        req.ip,
        req.get('User-Agent')
      );

      res.json({ message: "Popup deleted successfully" });
    } catch (error) {
      console.error('[ADMIN DELETE POPUP] Error:', error);
      res.status(500).json({ error: "Failed to delete popup" });
    }
  });

  // Waitlist Management
  app.get("/api/admin/waitlist", requireAdminAuth, async (req: AdminRequest, res) => {
    try {
      const { page = 1, limit = 10, search, filter } = req.query;
      const pageNum = parseInt(page as string);
      const limitNum = parseInt(limit as string);
      
      // Get all waitlist users
      const allUsers = await storage.getAllWaitlistUsers();
      
      // Apply search filter
      let filteredUsers = allUsers;
      if (search) {
        const searchTerm = (search as string).toLowerCase();
        filteredUsers = allUsers.filter(user => 
          user.name.toLowerCase().includes(searchTerm) ||
          user.email.toLowerCase().includes(searchTerm) ||
          user.referralCode.toLowerCase().includes(searchTerm)
        );
      }
      
      // Apply status filter
      if (filter && filter !== 'all') {
        filteredUsers = filteredUsers.filter(user => user.status === filter);
      }
      
      // Apply pagination
      const startIndex = (pageNum - 1) * limitNum;
      const paginatedUsers = filteredUsers.slice(startIndex, startIndex + limitNum);
      
      res.json({
        users: paginatedUsers,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total: filteredUsers.length,
          pages: Math.ceil(filteredUsers.length / limitNum)
        }
      });
    } catch (error) {
      console.error('[ADMIN WAITLIST] Error:', error);
      res.status(500).json({ error: "Failed to fetch waitlist users" });
    }
  });

  app.post("/api/admin/waitlist/:id/grant-early-access", requireAdminAuth, requireRole(["admin", "superadmin"]), async (req: AdminRequest, res) => {
    try {
      const { id } = req.params;
      
      const updatedUser = await storage.updateWaitlistUser(id, {
        status: 'early_access',
        updatedAt: new Date()
      });

      await logAdminAction(
        req.admin!.id,
        "GRANT_EARLY_ACCESS",
        "waitlist_user",
        id,
        undefined,
        { status: 'early_access' },
        req.ip,
        req.get('User-Agent')
      );

      res.json({ message: "Early access granted successfully", user: updatedUser });
    } catch (error) {
      console.error('[ADMIN GRANT ACCESS] Error:', error);
      res.status(500).json({ error: "Failed to grant early access" });
    }
  });

  app.post("/api/admin/waitlist/:id/remove", requireAdminAuth, requireRole(["admin", "superadmin"]), async (req: AdminRequest, res) => {
    try {
      const { id } = req.params;
      
      // Note: Since there's no delete method, we'll mark as removed
      const updatedUser = await storage.updateWaitlistUser(id, {
        status: 'removed',
        updatedAt: new Date()
      });

      await logAdminAction(
        req.admin!.id,
        "REMOVE_WAITLIST_USER",
        "waitlist_user",
        id,
        undefined,
        { status: 'removed' },
        req.ip,
        req.get('User-Agent')
      );

      res.json({ message: "User removed from waitlist successfully", user: updatedUser });
    } catch (error) {
      console.error('[ADMIN REMOVE WAITLIST] Error:', error);
      res.status(500).json({ error: "Failed to remove user from waitlist" });
    }
  });

  // App Settings Management
  app.get("/api/admin/settings", requireAdminAuth, async (req: AdminRequest, res) => {
    try {
      const settings = await storage.getAllAppSettings();
      res.json(settings);
    } catch (error) {
      console.error('[ADMIN SETTINGS] Error:', error);
      res.status(500).json({ error: "Failed to fetch settings" });
    }
  });

  app.post("/api/admin/settings", requireAdminAuth, requireRole(["admin", "superadmin"]), async (req: AdminRequest, res) => {
    try {
      const validatedData = insertAppSettingSchema.parse({
        ...req.body,
        updatedBy: req.admin!.id
      });
      
      const setting = await storage.createAppSetting(validatedData);

      await logAdminAction(
        req.admin!.id,
        "CREATE_SETTING",
        "setting",
        setting.key,
        undefined,
        setting,
        req.ip,
        req.get('User-Agent')
      );

      res.status(201).json(setting);
    } catch (error) {
      console.error('[ADMIN CREATE SETTING] Error:', error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid setting data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create setting" });
    }
  });

  app.patch("/api/admin/settings/:key", requireAdminAuth, requireRole(["admin", "superadmin"]), async (req: AdminRequest, res) => {
    try {
      const { key } = req.params;
      const { value } = req.body;

      const oldSetting = await storage.getAppSetting(key);
      const setting = await storage.updateAppSetting(key, value, req.admin!.id);

      await logAdminAction(
        req.admin!.id,
        "UPDATE_SETTING",
        "setting",
        key,
        oldSetting,
        { value },
        req.ip,
        req.get('User-Agent')
      );

      res.json(setting);
    } catch (error) {
      console.error('[ADMIN UPDATE SETTING] Error:', error);
      res.status(500).json({ error: "Failed to update setting" });
    }
  });

  app.delete("/api/admin/settings/:key", requireAdminAuth, requireRole(["superadmin"]), async (req: AdminRequest, res) => {
    try {
      const { key } = req.params;
      await storage.deleteAppSetting(key);

      await logAdminAction(
        req.admin!.id,
        "DELETE_SETTING",
        "setting",
        key,
        undefined,
        undefined,
        req.ip,
        req.get('User-Agent')
      );

      res.json({ message: "Setting deleted successfully" });
    } catch (error) {
      console.error('[ADMIN DELETE SETTING] Error:', error);
      res.status(500).json({ error: "Failed to delete setting" });
    }
  });

  // Feedback Management
  app.get("/api/admin/feedback", requireAdminAuth, async (req: AdminRequest, res) => {
    try {
      const { status } = req.query;
      const feedback = await storage.getFeedbackMessages(status as string);
      res.json(feedback);
    } catch (error) {
      console.error('[ADMIN FEEDBACK] Error:', error);
      res.status(500).json({ error: "Failed to fetch feedback" });
    }
  });

  app.patch("/api/admin/feedback/:id", requireAdminAuth, requireRole(["admin", "superadmin"]), async (req: AdminRequest, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;

      const feedback = await storage.updateFeedbackMessage(parseInt(id), {
        ...updates,
        respondedAt: new Date()
      });

      await logAdminAction(
        req.admin!.id,
        "UPDATE_FEEDBACK",
        "feedback",
        id,
        undefined,
        updates,
        req.ip,
        req.get('User-Agent')
      );

      res.json(feedback);
    } catch (error) {
      console.error('[ADMIN UPDATE FEEDBACK] Error:', error);
      res.status(500).json({ error: "Failed to update feedback" });
    }
  });

  // Audit Logs
  app.get("/api/admin/audit-logs", requireAdminAuth, requireRole(["admin", "superadmin"]), async (req: AdminRequest, res) => {
    try {
      const { limit = 50, adminId } = req.query;
      const logs = await storage.getAuditLogs(
        parseInt(limit as string),
        adminId ? parseInt(adminId as string) : undefined
      );
      res.json(logs);
    } catch (error) {
      console.error('[ADMIN AUDIT LOGS] Error:', error);
      res.status(500).json({ error: "Failed to fetch audit logs" });
    }
  });

  // Admin Management (Super Admin only)
  app.get("/api/admin/admins", requireAdminAuth, requireRole(["superadmin"]), async (req: AdminRequest, res) => {
    try {
      const admins = await storage.getAllAdmins();
      // Remove password from response
      const safeAdmins = admins.map(({ password, ...admin }) => admin);
      res.json(safeAdmins);
    } catch (error) {
      console.error('[ADMIN ADMINS] Error:', error);
      res.status(500).json({ error: "Failed to fetch admins" });
    }
  });

  app.post("/api/admin/admins", requireAdminAuth, requireRole(["superadmin"]), async (req: AdminRequest, res) => {
    try {
      const { password, ...adminData } = insertAdminSchema.parse(req.body);
      const hashedPassword = await hashPassword(password);
      
      const admin = await storage.createAdmin({
        ...adminData,
        password: hashedPassword
      });

      await logAdminAction(
        req.admin!.id,
        "CREATE_ADMIN",
        "admin",
        admin.id.toString(),
        undefined,
        { ...adminData, password: "[REDACTED]" },
        req.ip,
        req.get('User-Agent')
      );

      // Remove password from response
      const { password: _, ...safeAdmin } = admin;
      res.status(201).json(safeAdmin);
    } catch (error) {
      console.error('[ADMIN CREATE ADMIN] Error:', error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid admin data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create admin" });
    }
  });

  app.patch("/api/admin/admins/:id", requireAdminAuth, requireRole(["superadmin"]), async (req: AdminRequest, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;

      // Hash password if provided
      if (updates.password) {
        updates.password = await hashPassword(updates.password);
      }

      const oldAdmin = await storage.getAdmin(parseInt(id));
      const admin = await storage.updateAdmin(parseInt(id), updates);

      await logAdminAction(
        req.admin!.id,
        "UPDATE_ADMIN",
        "admin",
        id,
        oldAdmin ? { ...oldAdmin, password: "[REDACTED]" } : undefined,
        { ...updates, password: updates.password ? "[REDACTED]" : undefined },
        req.ip,
        req.get('User-Agent')
      );

      // Remove password from response
      const { password: _, ...safeAdmin } = admin;
      res.json(safeAdmin);
    } catch (error) {
      console.error('[ADMIN UPDATE ADMIN] Error:', error);
      res.status(500).json({ error: "Failed to update admin" });
    }
  });

  app.delete("/api/admin/admins/:id", requireAdminAuth, requireRole(["superadmin"]), async (req: AdminRequest, res) => {
    try {
      const { id } = req.params;
      
      // Prevent self-deletion
      if (parseInt(id) === req.admin!.id) {
        return res.status(400).json({ error: "Cannot delete your own admin account" });
      }

      await storage.deleteAdmin(parseInt(id));

      await logAdminAction(
        req.admin!.id,
        "DELETE_ADMIN",
        "admin",
        id,
        undefined,
        undefined,
        req.ip,
        req.get('User-Agent')
      );

      res.json({ message: "Admin deleted successfully" });
    } catch (error) {
      console.error('[ADMIN DELETE ADMIN] Error:', error);
      res.status(500).json({ error: "Failed to delete admin" });
    }
  });
}