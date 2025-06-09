import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { Settings, Save, Shield, Bell, Mail, Database, Server } from 'lucide-react';

interface AppSetting {
  id: string;
  key: string;
  value: string;
  description: string;
  category: string;
  isPublic: boolean;
}

interface SystemInfo {
  version: string;
  environment: string;
  database: string;
  uptime: string;
  memoryUsage: string;
}

export default function AdminSettings() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('general');

  // Fetch app settings
  const { data: settings = [], isLoading: settingsLoading } = useQuery({
    queryKey: ['/api/admin/settings'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/admin/settings');
      return response.json();
    }
  });

  // Fetch system info
  const { data: systemInfo } = useQuery({
    queryKey: ['/api/admin/system-info'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/admin/system-info');
      return response.json();
    }
  });

  // Update setting mutation
  const updateSettingMutation = useMutation({
    mutationFn: async ({ key, value }: { key: string; value: string }) => {
      const response = await apiRequest('PUT', `/api/admin/settings/${key}`, { value });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Setting Updated",
        description: "The setting has been successfully updated."
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/settings'] });
    },
    onError: () => {
      toast({
        title: "Update Failed",
        description: "Failed to update the setting. Please try again.",
        variant: "destructive"
      });
    }
  });

  const handleSettingUpdate = (key: string, value: string) => {
    updateSettingMutation.mutate({ key, value });
  };

  const getSettingsByCategory = (category: string) => {
    return settings.filter((setting: AppSetting) => setting.category === category);
  };

  const getSettingValue = (key: string) => {
    const setting = settings.find((s: AppSetting) => s.key === key);
    return setting?.value || '';
  };

  if (settingsLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <Settings className="h-6 w-6 text-purple-400" />
          <h1 className="text-2xl font-bold text-white">Admin Settings</h1>
        </div>
        <div className="animate-pulse space-y-4">
          <div className="h-32 bg-gray-800 rounded-lg"></div>
          <div className="h-32 bg-gray-800 rounded-lg"></div>
          <div className="h-32 bg-gray-800 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Settings className="h-6 w-6 text-purple-400" />
        <h1 className="text-2xl font-bold text-white">Admin Settings</h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 bg-gray-800">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="email" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Email
          </TabsTrigger>
          <TabsTrigger value="system" className="flex items-center gap-2">
            <Server className="h-4 w-4" />
            System
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">General Settings</CardTitle>
              <CardDescription>Configure basic application settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="app-name" className="text-white">Application Name</Label>
                  <Input
                    id="app-name"
                    defaultValue={getSettingValue('app_name') || 'VeeFore'}
                    onBlur={(e) => handleSettingUpdate('app_name', e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="app-version" className="text-white">Version</Label>
                  <Input
                    id="app-version"
                    defaultValue={getSettingValue('app_version') || '1.0.0'}
                    onBlur={(e) => handleSettingUpdate('app_version', e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="app-description" className="text-white">Application Description</Label>
                <Textarea
                  id="app-description"
                  defaultValue={getSettingValue('app_description') || 'AI-powered social media management platform'}
                  onBlur={(e) => handleSettingUpdate('app_description', e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white"
                  rows={3}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="maintenance-mode"
                  checked={getSettingValue('maintenance_mode') === 'true'}
                  onCheckedChange={(checked) => handleSettingUpdate('maintenance_mode', checked.toString())}
                />
                <Label htmlFor="maintenance-mode" className="text-white">Maintenance Mode</Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Security Settings</CardTitle>
              <CardDescription>Configure security and authentication settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="session-timeout" className="text-white">Session Timeout (minutes)</Label>
                  <Input
                    id="session-timeout"
                    type="number"
                    defaultValue={getSettingValue('session_timeout') || '60'}
                    onBlur={(e) => handleSettingUpdate('session_timeout', e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="max-login-attempts" className="text-white">Max Login Attempts</Label>
                  <Input
                    id="max-login-attempts"
                    type="number"
                    defaultValue={getSettingValue('max_login_attempts') || '5'}
                    onBlur={(e) => handleSettingUpdate('max_login_attempts', e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="two-factor-auth"
                    checked={getSettingValue('two_factor_auth') === 'true'}
                    onCheckedChange={(checked) => handleSettingUpdate('two_factor_auth', checked.toString())}
                  />
                  <Label htmlFor="two-factor-auth" className="text-white">Require Two-Factor Authentication</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="password-complexity"
                    checked={getSettingValue('password_complexity') === 'true'}
                    onCheckedChange={(checked) => handleSettingUpdate('password_complexity', checked.toString())}
                  />
                  <Label htmlFor="password-complexity" className="text-white">Enforce Password Complexity</Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Notification Settings</CardTitle>
              <CardDescription>Configure system notification preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="email-notifications"
                    checked={getSettingValue('email_notifications') === 'true'}
                    onCheckedChange={(checked) => handleSettingUpdate('email_notifications', checked.toString())}
                  />
                  <Label htmlFor="email-notifications" className="text-white">Email Notifications</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="admin-alerts"
                    checked={getSettingValue('admin_alerts') === 'true'}
                    onCheckedChange={(checked) => handleSettingUpdate('admin_alerts', checked.toString())}
                  />
                  <Label htmlFor="admin-alerts" className="text-white">Admin System Alerts</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="user-registration-notify"
                    checked={getSettingValue('user_registration_notify') === 'true'}
                    onCheckedChange={(checked) => handleSettingUpdate('user_registration_notify', checked.toString())}
                  />
                  <Label htmlFor="user-registration-notify" className="text-white">Notify on User Registration</Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="email" className="space-y-4">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Email Configuration</CardTitle>
              <CardDescription>Configure SMTP and email settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="smtp-host" className="text-white">SMTP Host</Label>
                  <Input
                    id="smtp-host"
                    defaultValue={getSettingValue('smtp_host')}
                    onBlur={(e) => handleSettingUpdate('smtp_host', e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtp-port" className="text-white">SMTP Port</Label>
                  <Input
                    id="smtp-port"
                    type="number"
                    defaultValue={getSettingValue('smtp_port') || '587'}
                    onBlur={(e) => handleSettingUpdate('smtp_port', e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="smtp-username" className="text-white">SMTP Username</Label>
                  <Input
                    id="smtp-username"
                    defaultValue={getSettingValue('smtp_username')}
                    onBlur={(e) => handleSettingUpdate('smtp_username', e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="from-email" className="text-white">From Email</Label>
                  <Input
                    id="from-email"
                    type="email"
                    defaultValue={getSettingValue('from_email')}
                    onBlur={(e) => handleSettingUpdate('from_email', e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-4">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">System Information</CardTitle>
              <CardDescription>View system status and configuration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {systemInfo && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-white">Application Version</Label>
                    <div className="text-gray-300">{systemInfo.version || '1.0.0'}</div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white">Environment</Label>
                    <div className="text-gray-300">{systemInfo.environment || 'Production'}</div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white">Database Status</Label>
                    <div className="text-green-400">{systemInfo.database || 'Connected'}</div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white">Uptime</Label>
                    <div className="text-gray-300">{systemInfo.uptime || 'Unknown'}</div>
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-4">Database Settings</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="backup-frequency" className="text-white">Backup Frequency (hours)</Label>
                    <Input
                      id="backup-frequency"
                      type="number"
                      defaultValue={getSettingValue('backup_frequency') || '24'}
                      onBlur={(e) => handleSettingUpdate('backup_frequency', e.target.value)}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="log-retention" className="text-white">Log Retention (days)</Label>
                    <Input
                      id="log-retention"
                      type="number"
                      defaultValue={getSettingValue('log_retention') || '30'}
                      onBlur={(e) => handleSettingUpdate('log_retention', e.target.value)}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}