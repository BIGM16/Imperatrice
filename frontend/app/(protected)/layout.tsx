"use client";

import RouteGuard from "@/components/auth/RouteGuard";
import { DashboardLayout } from "@/components/layout/dashboard-layout";

export default function ProtectedLayout({
    children,
}: {
    children: React.ReactNode
    }) {
    return (
        <RouteGuard>
            <DashboardLayout>
                {children}
            </DashboardLayout>
        </RouteGuard>
    );
}