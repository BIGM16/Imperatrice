"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import FullScreenLoader from "../ui/FullScreenLoader";

interface RouteGuardProps {
  children: React.ReactNode;
  requireAdmin?: Boolean;
}

export default function RouteGuard({
  children,
  requireAdmin = false,
}: RouteGuardProps) {
  const { user, loading, isAuthenticated } = useAuth();

  const router = useRouter();

  useEffect(() => {
    if (loading) {
      return;
    } 

    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }
    if (requireAdmin && !user?.is_staff) {
      router.replace("/dashboard");
    }
  }, [loading, isAuthenticated, requireAdmin, router, user]);

  if (!isAuthenticated) return null;

  if (requireAdmin && !user?.is_staff) return null;
  return <>{children}</>;
}
