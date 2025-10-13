import { Navigation } from "@/components/layout/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { Settings as SettingsIcon, Bell, Shield, Users, Database, Mail, Zap } from "lucide-react";
import { useState } from "react";

const Settings = () => {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [criticalAlerts, setCriticalAlerts] = useState(true);
  const [weeklyReports, setWeeklyReports] = useState(false);
  const [autoAssessment, setAutoAssessment] = useState(true);

  const handleSave = () => {
    toast({
      title: "Settings Saved",
      description: "Your preferences have been updated successfully"
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground">Settings</h1>
            <p className="text-muted-foreground mt-2">Manage your platform configuration</p>
          </div>
          <Button onClick={handleSave} className="bg-gradient-primary hover:opacity-90">
            Save Changes
          </Button>
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-6">
            <Card className="bg-card border-border p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Organization Details</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="org-name">Organization Name</Label>
                  <Input id="org-name" defaultValue="Acme Corporation" />
                </div>
                <div>
                  <Label htmlFor="industry">Industry</Label>
                  <Select defaultValue="financial">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="financial">Financial Services</SelectItem>
                      <SelectItem value="technology">Technology</SelectItem>
                      <SelectItem value="healthcare">Healthcare</SelectItem>
                      <SelectItem value="manufacturing">Manufacturing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select defaultValue="utc">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="utc">UTC</SelectItem>
                      <SelectItem value="est">EST</SelectItem>
                      <SelectItem value="pst">PST</SelectItem>
                      <SelectItem value="gmt">GMT</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Card>

            <Card className="bg-card border-border p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Assessment Defaults</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Auto-start Assessments</Label>
                    <p className="text-sm text-muted-foreground">Automatically begin assessments for new vendors</p>
                  </div>
                  <Switch checked={autoAssessment} onCheckedChange={setAutoAssessment} />
                </div>
                <div>
                  <Label htmlFor="default-priority">Default Priority Level</Label>
                  <Select defaultValue="medium">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="critical">Critical</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card className="bg-card border-border p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Bell className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold text-foreground">Notification Preferences</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive updates via email</p>
                  </div>
                  <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Critical Alerts</Label>
                    <p className="text-sm text-muted-foreground">Instant notifications for critical issues</p>
                  </div>
                  <Switch checked={criticalAlerts} onCheckedChange={setCriticalAlerts} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Weekly Reports</Label>
                    <p className="text-sm text-muted-foreground">Receive weekly summary reports</p>
                  </div>
                  <Switch checked={weeklyReports} onCheckedChange={setWeeklyReports} />
                </div>
              </div>
            </Card>

            <Card className="bg-card border-border p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Email Recipients</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                  <span className="text-sm text-foreground">admin@acme.com</span>
                  <Button variant="ghost" size="sm">Remove</Button>
                </div>
                <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                  <span className="text-sm text-foreground">risk@acme.com</span>
                  <Button variant="ghost" size="sm">Remove</Button>
                </div>
                <Button variant="outline" className="w-full mt-2">
                  <Mail className="mr-2 h-4 w-4" />
                  Add Email Recipient
                </Button>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card className="bg-card border-border p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Shield className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold text-foreground">Security Settings</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                  <Input id="session-timeout" type="number" defaultValue="30" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">Require 2FA for all users</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>IP Whitelisting</Label>
                    <p className="text-sm text-muted-foreground">Restrict access by IP address</p>
                  </div>
                  <Switch />
                </div>
              </div>
            </Card>

            <Card className="bg-card border-border p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">API Access</h3>
              <div className="space-y-4">
                <div>
                  <Label>API Key</Label>
                  <div className="flex items-center space-x-2 mt-2">
                    <Input type="password" value="sk_live_..." readOnly />
                    <Button variant="outline">Regenerate</Button>
                  </div>
                </div>
                <div>
                  <Label>Webhook URL</Label>
                  <Input placeholder="https://your-domain.com/webhook" />
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="integrations" className="space-y-6">
            <Card className="bg-card border-border p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Zap className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold text-foreground">Connected Integrations</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Database className="h-8 w-8 text-primary" />
                    <div>
                      <h4 className="font-semibold text-foreground">Data Sources API</h4>
                      <p className="text-sm text-muted-foreground">52 sources connected</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Configure</Button>
                </div>
                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Shield className="h-8 w-8 text-primary" />
                    <div>
                      <h4 className="font-semibold text-foreground">Compliance Database</h4>
                      <p className="text-sm text-muted-foreground">Real-time regulatory updates</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Configure</Button>
                </div>
                <div className="flex items-center justify-between p-4 border border-border rounded-lg opacity-50">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-8 w-8 text-muted-foreground" />
                    <div>
                      <h4 className="font-semibold text-foreground">Email Integration</h4>
                      <p className="text-sm text-muted-foreground">Not connected</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Connect</Button>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="team" className="space-y-6">
            <Card className="bg-card border-border p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <Users className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold text-foreground">Team Members</h3>
                </div>
                <Button className="bg-gradient-primary hover:opacity-90">
                  <Users className="mr-2 h-4 w-4" />
                  Invite Member
                </Button>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">John Doe</p>
                    <p className="text-sm text-muted-foreground">john@acme.com - Admin</p>
                  </div>
                  <Button variant="ghost" size="sm">Edit</Button>
                </div>
                <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">Jane Smith</p>
                    <p className="text-sm text-muted-foreground">jane@acme.com - Analyst</p>
                  </div>
                  <Button variant="ghost" size="sm">Edit</Button>
                </div>
                <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">Mike Johnson</p>
                    <p className="text-sm text-muted-foreground">mike@acme.com - Viewer</p>
                  </div>
                  <Button variant="ghost" size="sm">Edit</Button>
                </div>
              </div>
            </Card>

            <Card className="bg-card border-border p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Role Permissions</h3>
              <div className="space-y-3">
                <div className="p-3 bg-secondary/50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-foreground">Admin</span>
                    <span className="text-sm text-muted-foreground">Full access</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Can manage all settings, users, and perform all actions
                  </p>
                </div>
                <div className="p-3 bg-secondary/50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-foreground">Analyst</span>
                    <span className="text-sm text-muted-foreground">Limited access</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Can create assessments, view reports, and manage vendors
                  </p>
                </div>
                <div className="p-3 bg-secondary/50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-foreground">Viewer</span>
                    <span className="text-sm text-muted-foreground">Read-only</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Can only view dashboards and reports
                  </p>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Settings;
