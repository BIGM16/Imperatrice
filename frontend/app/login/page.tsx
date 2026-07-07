"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Wine, Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login({
        email,
        password,
      });
      toast.success("Bon retour !");
      router.replace(
        "/dashboard"
      );
    } catch (err:any) {
      toast.error(
        err?.response?.data?.detail ??
        "Email ou mot de passe incorrect."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background with gradient overlay */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1470337455729-039a2a9c6448?w=1920)",
            filter: "brightness(0.3)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-pitch/80 via-coffee/60 to-walnut/80" />
      </div>

      {/* Decorative elements */}
      <div className="absolute top-20 left-20 w-64 h-64 bg-gold/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />

      {/* Login card */}
      <div className="relative z-10 w-full max-w-md px-4">
        <div className="glass rounded-2xl border-glow overflow-hidden">
          {/* Header */}
          <div className="px-8 pt-10 pb-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-gold to-gold-dark mb-6">
              <Wine className="w-8 h-8 text-pitch" />
            </div>
            <h1 className="text-2xl font-playfair font-bold text-foreground mb-2">
              Chez l&apos;Impératrice
            </h1>
            <p className="text-muted-foreground text-sm">
              Système de gestion de bar premium
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-8 pb-10 space-y-6">
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-sm font-medium text-foreground"
              >
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@imperatrice.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 bg-secondary/50 border-border focus:border-gold focus:ring-gold/30"
                required
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-sm font-medium text-foreground"
              >
                Mot de passe
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Entrer votre mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 bg-secondary/50 border-border focus:border-gold focus:ring-gold/30 pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-muted-foreground cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-border bg-secondary/50 checked:bg-gold checked:border-gold focus:ring-gold/30"
                />
                Se souvenir de moi
              </label>
              <button
                type="button"
                className="text-gold hover:text-gold-light transition-colors"
              >
                Oublié le mot de passe ?
              </button>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-gradient-to-r from-gold to-gold-dark hover:from-gold-light hover:to-gold text-pitch font-semibold rounded-lg transition-all"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Connexion...
                </>
              ) : (
                "Se connecter"
              )}
            </Button>
          </form>

          {/* Backend hint */}
          <div className="px-8 pb-8">
            <div className="bg-gold/10 border border-gold/20 rounded-lg p-4 text-center">
              <p className="text-xs text-muted-foreground mb-1">
                Accès aux données
              </p>
              <p className="text-sm text-foreground font-medium">
                Utilisez vos identifiants de compte
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Email ou nom d'utilisateur supporté
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-muted-foreground text-xs mt-6">
          © 2026 Chez l&apos;Impératrice. Tous droits réservés.
        </p>
      </div>
    </div>
  );
}
