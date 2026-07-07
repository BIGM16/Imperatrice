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
import { useAuth } from "@/hooks/useAuth";
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
            Paramètres
          </h1>
          <p className="text-muted-foreground mt-1">
            Gérer vos préférences de compte et d&apos;application
          </p>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="bg-card border border-border mb-6">
            <TabsTrigger
              value="profile"
              className="data-[state=active]:bg-gold data-[state=active]:text-pitch"
            >
              <User className="w-4 h-4 mr-2" />
              Profil
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
              Sécurité
            </TabsTrigger>
            <TabsTrigger
              value="appearance"
              className="data-[state=active]:bg-gold data-[state=active]:text-pitch"
            >
              <Palette className="w-4 h-4 mr-2" />
              Apparence
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">
                  Information sur le profil
                </CardTitle>
                <CardDescription>
                  Mettre à jour vos informations personnelles
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
                      {user?.full_name || user?.email || "Utilisateur"}
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
                      Prénom
                    </Label>
                    <Input
                      id="firstName"
                      defaultValue={firstName || ""}
                      className="bg-secondary/50 border-border focus:border-gold"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-foreground">
                      Nom
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
                      Adresse email
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
                      Numéro de téléphone
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
                    placeholder="Une brève description de vous..."
                    className="bg-secondary/50 border-border focus:border-gold resize-none"
                    rows={4}
                  />
                </div>

                <Button
                  className="bg-gold hover:bg-gold-light text-pitch font-semibold"
                  onClick={() => toast.success("Profile updated successfully")}
                >
                  <Save className="w-4 h-4 mr-2" />
                  Enregistrer les modifications
                </Button>
              </CardContent>
            </Card>

            {/* Team Members */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Membres de l&apos;équipe</CardTitle>
                <CardDescription>
                  Gérer l&apos;accès et les rôles de votre équipe
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
                  Préférences de notification
                </CardTitle>
                <CardDescription>
                  Personnaliser la façon dont vous recevez les notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">
                        Notifications par email
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Recevoir des mises à jour par email
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
                        Notifications Push
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Recevoir des notifications dans l&apos;application
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
                        Alerte de stock bas
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Être notifié lorsque les stocks sont bas
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
                        Notifications de nouvelles ventes
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Être notifié pour chaque nouvelle vente
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
                        Résumé du rapport quotidien
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Recevoir les résumés des rapports quotidiens
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
                  Changer le mot de passe
                </CardTitle>
                <CardDescription>Mettre à jour le mot de passe de votre compte</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="currentPassword"
                    className="text-foreground flex items-center gap-2"
                  >
                    <Lock className="w-4 h-4" />
                    Mot de passe actuel
                  </Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    className="bg-secondary/50 border-border focus:border-gold"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword" className="text-foreground">
                    Nouveau mot de passe
                  </Label>
                  <Input
                    id="newPassword"
                    type="password"
                    className="bg-secondary/50 border-border focus:border-gold"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-foreground">
                    Confirmer le nouveau mot de passe
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    className="bg-secondary/50 border-border focus:border-gold"
                  />
                </div>
                <Button
                  className="bg-gold hover:bg-gold-light text-pitch font-semibold"
                  onClick={() => toast.success("Mot de passe mis à jour avec succès")}
                >
                  Mettre à jour le mot de passe
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">
                  Authentification à deux facteurs
                </CardTitle>
                <CardDescription>
                  Ajouter une couche de sécurité supplémentaire
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  L&apos;authentification à deux facteurs ajoute une couche de sécurité supplémentaire
                  à votre compte en exigeant plus qu&apos;un mot de passe pour vous connecter.
                </p>
                <Button variant="outline" className="border-border">
                  <Shield className="w-4 h-4 mr-2" />
                  Activer l&apos;authentification à deux facteurs
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-red-500/10 border-red-500/30">
              <CardHeader>
                <CardTitle className="text-red-400">Zone de danger</CardTitle>
                <CardDescription>Actions irréversibles</CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant="destructive"
                  onClick={() =>
                    toast.error("Cette action nécessite confirmation")
                  }
                >
                  Supprimer le compte
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Appearance Tab */}
          <TabsContent value="appearance" className="space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">
                  Paramètres d'apparence
                </CardTitle>
                <CardDescription>
                  Personnaliser l'apparence de l'application
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-3 gap-4">
                  <button className="p-4 rounded-lg border-2 border-border bg-secondary/50 hover:border-gold/30 transition-colors text-center">
                    <div className="w-12 h-12 mx-auto rounded-lg bg-pitch mb-2" />
                    <p className="text-sm font-medium text-foreground">Sombre</p>
                    <p className="text-xs text-muted-foreground">Par défaut</p>
                  </button>
                  <button className="p-4 rounded-lg border-2 border-border bg-secondary/50 hover:border-gold/30 transition-colors text-center opacity-50 cursor-not-allowed">
                    <div className="w-12 h-12 mx-auto rounded-lg bg-white mb-2" />
                    <p className="text-sm font-medium text-foreground">Clair</p>
                    <p className="text-xs text-muted-foreground">Bientôt disponible</p>
                  </button>
                  <button className="p-4 rounded-lg border-2 border-border bg-secondary/50 hover:border-gold/30 transition-colors text-center opacity-50 cursor-not-allowed">
                    <div className="w-12 h-12 mx-auto rounded-lg bg-gradient-to-br from-pitch to-white mb-2" />
                    <p className="text-sm font-medium text-foreground">
                      Système
                    </p>
                    <p className="text-xs text-muted-foreground">Bientôt disponible</p>
                  </button>
                </div>

                <Separator className="bg-border" />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">Langue</p>
                      <p className="text-sm text-muted-foreground">
                        Choisissez votre langue préférée
                      </p>
                    </div>
                    <Select defaultValue="en">
                      <SelectTrigger className="w-[180px] bg-secondary/50 border-border">
                        <Globe className="w-4 h-4 mr-2" />
                        <SelectValue placeholder="Langue" />
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
                      <p className="font-medium text-foreground">Fuseau horaire</p>
                      <p className="text-sm text-muted-foreground">
                        Définissez votre fuseau horaire local
                      </p>
                    </div>
                    <Select defaultValue="europe">
                      <SelectTrigger className="w-[180px] bg-secondary/50 border-border">
                        <SelectValue placeholder="Fuseau horaire" />
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
