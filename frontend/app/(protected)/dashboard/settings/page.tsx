"use client";

import { useEffect, useMemo, useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/auth-context";
import { toast } from "sonner";
import api from "@/lib/axios";
import {
  User,
  Settings as SettingsIcon,
  Bell,
  Shield,
  Palette,
  CreditCard,
  Camera,
  Mail,
  Lock,
  Globe,
  Save,
} from "lucide-react";

export default function SettingsPage() {
  const { user } = useAuth();
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    lowStock: true,
    newSales: true,
    dailyReport: false,
  });

  useEffect(() => {
    const loadTeamMembers = async () => {
      try {
        const response = await api.get("/users/");
        setTeamMembers(response.data || []);
      } catch {
        setTeamMembers([]);
      }
    };

    loadTeamMembers();
  }, []);

  const profileName = user?.full_name || user?.email || "";
  const profileInitials = useMemo(() => {
    return (
      profileName
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase() || "U"
    );
  }, [profileName]);
  const firstName = profileName.split(" ")[0] || "";
  const lastName = profileName.split(" ").slice(1).join(" ") || "";

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page header */}
        <div>
          <h1 className="text-3xl font-playfair font-bold text-foreground">
            Settings
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your account and application preferences
          </p>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="bg-card border border-border mb-6">
            <TabsTrigger
              value="profile"
              className="data-[state=active]:bg-gold data-[state=active]:text-pitch"
            >
              <User className="w-4 h-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger
              value="notifications"
              className="data-[state=active]:bg-gold data-[state=active]:text-pitch"
            >
              <Bell className="w-4 h-4 mr-2" />
              Notifications
            </TabsTrigger>
            <TabsTrigger
              value="security"
              className="data-[state=active]:bg-gold data-[state=active]:text-pitch"
            >
              <Shield className="w-4 h-4 mr-2" />
              Security
            </TabsTrigger>
            <TabsTrigger
              value="appearance"
              className="data-[state=active]:bg-gold data-[state=active]:text-pitch"
            >
              <Palette className="w-4 h-4 mr-2" />
              Appearance
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">
                  Profile Information
                </CardTitle>
                <CardDescription>
                  Update your personal information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Avatar */}
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <Avatar className="w-24 h-24 border-2 border-gold/30">
                      <AvatarImage src={user?.avatar_url || ""} />
                      <AvatarFallback className="text-2xl bg-gold/20 text-gold">
                        {profileInitials}
                      </AvatarFallback>
                    </Avatar>
                    <Button
                      variant="outline"
                      size="icon"
                      className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-gold hover:bg-gold-light text-pitch"
                    >
                      <Camera className="w-4 h-4" />
                    </Button>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">
                      {user?.full_name || user?.email || "User"}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {user?.email}
                    </p>
                    <Badge className="mt-2 capitalize bg-gold/20 text-gold hover:bg-gold/30">
                      {user?.role || "staff"}
                    </Badge>
                  </div>
                </div>

                <Separator className="bg-border" />

                {/* Form fields */}
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-foreground">
                      First Name
                    </Label>
                    <Input
                      id="firstName"
                      defaultValue={firstName || ""}
                      className="bg-secondary/50 border-border focus:border-gold"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-foreground">
                      Last Name
                    </Label>
                    <Input
                      id="lastName"
                      defaultValue={lastName || ""}
                      className="bg-secondary/50 border-border focus:border-gold"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="email"
                      className="text-foreground flex items-center gap-2"
                    >
                      <Mail className="w-4 h-4" />
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      defaultValue={user?.email || ""}
                      className="bg-secondary/50 border-border focus:border-gold"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-foreground">
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+33 1 42 68 53 00"
                      className="bg-secondary/50 border-border focus:border-gold"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio" className="text-foreground">
                    Bio
                  </Label>
                  <Textarea
                    id="bio"
                    placeholder="A brief description about yourself..."
                    className="bg-secondary/50 border-border focus:border-gold resize-none"
                    rows={4}
                  />
                </div>

                <Button
                  className="bg-gold hover:bg-gold-light text-pitch font-semibold"
                  onClick={() => toast.success("Profile updated successfully")}
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </CardContent>
            </Card>

            {/* Team Members */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Team Members</CardTitle>
                <CardDescription>
                  Manage your team&apos;s access and roles
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {teamMembers.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between p-4 rounded-lg bg-secondary/30 border border-border hover:border-gold/30 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={member.avatar_url || ""} />
                          <AvatarFallback className="bg-gold/20 text-gold">
                            {String(member.full_name || member.email || "U")
                              .split(" ")
                              .map((n: string) => n[0])
                              .join("")
                              .slice(0, 2)
                              .toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-foreground">
                            {member.full_name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {member.email}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge
                          variant="secondary"
                          className={cn(
                            "capitalize",
                            member.role === "admin" && "bg-gold/20 text-gold",
                            member.role === "manager" &&
                              "bg-purple-500/20 text-purple-400",
                            member.role === "staff" &&
                              "bg-blue-500/20 text-blue-400",
                          )}
                        >
                          {member.role}
                        </Badge>
                        <Badge
                          variant={member.is_active ? "default" : "secondary"}
                          className={
                            member.is_active
                              ? "bg-emerald-500/20 text-emerald-500"
                              : ""
                          }
                        >
                          {member.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">
                  Notification Preferences
                </CardTitle>
                <CardDescription>
                  Customize how you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">
                        Email Notifications
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Receive updates via email
                      </p>
                    </div>
                    <Switch
                      checked={notifications.email}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, email: checked })
                      }
                    />
                  </div>

                  <Separator className="bg-border" />

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">
                        Push Notifications
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Receive in-app notifications
                      </p>
                    </div>
                    <Switch
                      checked={notifications.push}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, push: checked })
                      }
                    />
                  </div>

                  <Separator className="bg-border" />

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">
                        Low Stock Alerts
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Get notified when items are low on stock
                      </p>
                    </div>
                    <Switch
                      checked={notifications.lowStock}
                      onCheckedChange={(checked) =>
                        setNotifications({
                          ...notifications,
                          lowStock: checked,
                        })
                      }
                    />
                  </div>

                  <Separator className="bg-border" />

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">
                        New Sales Notifications
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Get notified for each new sale
                      </p>
                    </div>
                    <Switch
                      checked={notifications.newSales}
                      onCheckedChange={(checked) =>
                        setNotifications({
                          ...notifications,
                          newSales: checked,
                        })
                      }
                    />
                  </div>

                  <Separator className="bg-border" />

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">
                        Daily Report Summary
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Receive daily summary reports
                      </p>
                    </div>
                    <Switch
                      checked={notifications.dailyReport}
                      onCheckedChange={(checked) =>
                        setNotifications({
                          ...notifications,
                          dailyReport: checked,
                        })
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">
                  Change Password
                </CardTitle>
                <CardDescription>Update your account password</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="currentPassword"
                    className="text-foreground flex items-center gap-2"
                  >
                    <Lock className="w-4 h-4" />
                    Current Password
                  </Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    className="bg-secondary/50 border-border focus:border-gold"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword" className="text-foreground">
                    New Password
                  </Label>
                  <Input
                    id="newPassword"
                    type="password"
                    className="bg-secondary/50 border-border focus:border-gold"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-foreground">
                    Confirm New Password
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    className="bg-secondary/50 border-border focus:border-gold"
                  />
                </div>
                <Button
                  className="bg-gold hover:bg-gold-light text-pitch font-semibold"
                  onClick={() => toast.success("Password updated successfully")}
                >
                  Update Password
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">
                  Two-Factor Authentication
                </CardTitle>
                <CardDescription>
                  Add an extra layer of security
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Two-factor authentication adds an additional layer of security
                  to your account by requiring more than just a password to sign
                  in.
                </p>
                <Button variant="outline" className="border-border">
                  <Shield className="w-4 h-4 mr-2" />
                  Enable 2FA
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-red-500/10 border-red-500/30">
              <CardHeader>
                <CardTitle className="text-red-400">Danger Zone</CardTitle>
                <CardDescription>Irreversible actions</CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant="destructive"
                  onClick={() =>
                    toast.error("This action requires confirmation")
                  }
                >
                  Delete Account
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Appearance Tab */}
          <TabsContent value="appearance" className="space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">
                  Theme Settings
                </CardTitle>
                <CardDescription>
                  Customize the application appearance
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-3 gap-4">
                  <button className="p-4 rounded-lg border-2 border-border bg-secondary/50 hover:border-gold/30 transition-colors text-center">
                    <div className="w-12 h-12 mx-auto rounded-lg bg-pitch mb-2" />
                    <p className="text-sm font-medium text-foreground">Dark</p>
                    <p className="text-xs text-muted-foreground">Default</p>
                  </button>
                  <button className="p-4 rounded-lg border-2 border-border bg-secondary/50 hover:border-gold/30 transition-colors text-center opacity-50 cursor-not-allowed">
                    <div className="w-12 h-12 mx-auto rounded-lg bg-white mb-2" />
                    <p className="text-sm font-medium text-foreground">Light</p>
                    <p className="text-xs text-muted-foreground">Coming soon</p>
                  </button>
                  <button className="p-4 rounded-lg border-2 border-border bg-secondary/50 hover:border-gold/30 transition-colors text-center opacity-50 cursor-not-allowed">
                    <div className="w-12 h-12 mx-auto rounded-lg bg-gradient-to-br from-pitch to-white mb-2" />
                    <p className="text-sm font-medium text-foreground">
                      System
                    </p>
                    <p className="text-xs text-muted-foreground">Coming soon</p>
                  </button>
                </div>

                <Separator className="bg-border" />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">Language</p>
                      <p className="text-sm text-muted-foreground">
                        Select your preferred language
                      </p>
                    </div>
                    <Select defaultValue="en">
                      <SelectTrigger className="w-[180px] bg-secondary/50 border-border">
                        <Globe className="w-4 h-4 mr-2" />
                        <SelectValue placeholder="Language" />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border">
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="fr">Français</SelectItem>
                        <SelectItem value="es">Español</SelectItem>
                        <SelectItem value="de">Deutsch</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Separator className="bg-border" />

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">Timezone</p>
                      <p className="text-sm text-muted-foreground">
                        Set your local timezone
                      </p>
                    </div>
                    <Select defaultValue="europe">
                      <SelectTrigger className="w-[180px] bg-secondary/50 border-border">
                        <SelectValue placeholder="Timezone" />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border">
                        <SelectItem value="europe">Europe/Paris</SelectItem>
                        <SelectItem value="london">Europe/London</SelectItem>
                        <SelectItem value="ny">America/New York</SelectItem>
                        <SelectItem value="la">America/Los Angeles</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
