"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format, formatDistanceToNow } from "date-fns";
import { AuditLog } from "@/types/types";
import { getAuditLogs } from "@/services/audit";
import { useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  Search,
  Filter,
  UserPlus,
  Edit3,
  Trash2,
  Plus,
  Eye,
  Shield,
  Clock,
} from "lucide-react";
import RouteGuard from "@/components/auth/RouteGuard";

const actionConfig: Record<
  string,
  { icon: typeof UserPlus; color: string; bg: string; label: string }
> = {
  CREATE: {
    icon: Plus,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    label: "Created",
  },
  UPDATE: {
    icon: Edit3,
    color: "text-blue-400",
    bg: "bg-blue-400/10",
    label: "Updated",
  },
  DELETE: {
    icon: Trash2,
    color: "text-red-400",
    bg: "bg-red-400/10",
    label: "Deleted",
  },
  VIEW: {
    icon: Eye,
    color: "text-muted-foreground",
    bg: "bg-secondary",
    label: "Viewed",
  },
  LOGIN: {
    icon: UserPlus,
    color: "text-purple-400",
    bg: "bg-purple-400/10",
    label: "Login",
  },
};

const entityTypeConfig: Record<string, string> = {
  user: "text-purple-400",
  drink: "text-amber-400",
  sale: "text-emerald-400",
  expense: "text-red-400",
  category: "text-blue-400",
};

export default function AuditLogsPage() {
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState<string>("all");
  const [entityFilter, setEntityFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const itemsPerPage = 15;

  useEffect(() => {
    const loadLogs = async () => {
      try {
        const data = await getAuditLogs();
        setAuditLogs(data || []);
      } catch {
        setAuditLogs([]);
      }
    };

    loadLogs();
  }, []);

  const filteredLogs = auditLogs.filter((log) => {
    const userName = log.user?.full_name?.toLowerCase() || "";
    const matchesSearch =
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.entity_type.toLowerCase().includes(search.toLowerCase()) ||
      userName.includes(search.toLowerCase());
    const matchesAction = actionFilter === "all" || log.action === actionFilter;
    const matchesEntity =
      entityFilter === "all" || log.entity_type === entityFilter;
    return matchesSearch && matchesAction && matchesEntity;
  });

  // Paginate
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const paginatedLogs = filteredLogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // Group logs by date
  const groupedLogs = paginatedLogs.reduce(
    (groups, log) => {
      const date = format(new Date(log.created_at), "yyyy-MM-dd");
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(log);
      return groups;
    },
    {} as Record<string, AuditLog[]>,
  );

  return (
    <RouteGuard requireAdmin>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Page header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-playfair font-bold text-foreground">
                Audit Logs
              </h1>
              <p className="text-muted-foreground mt-1">
                Track all system activities and changes
              </p>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <Shield className="w-4 h-4" />
              <span>{filteredLogs.length} log entries</span>
            </div>
          </div>

          {/* Filters */}
          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search logs by action, entity, or user..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10 bg-secondary/50 border-border focus:border-gold"
                  />
                </div>
                <Select value={actionFilter} onValueChange={setActionFilter}>
                  <SelectTrigger className="w-full sm:w-[160px] bg-secondary/50 border-border">
                    <SelectValue placeholder="Action type" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    <SelectItem value="all">All Actions</SelectItem>
                    <SelectItem value="CREATE">Create</SelectItem>
                    <SelectItem value="UPDATE">Update</SelectItem>
                    <SelectItem value="DELETE">Delete</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={entityFilter} onValueChange={setEntityFilter}>
                  <SelectTrigger className="w-full sm:w-[160px] bg-secondary/50 border-border">
                    <SelectValue placeholder="Entity type" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    <SelectItem value="all">All Entities</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="drink">Drink</SelectItem>
                    <SelectItem value="sale">Sale</SelectItem>
                    <SelectItem value="expense">Expense</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card className="bg-card border-border">
            <CardHeader className="pb-0">
              <CardTitle className="text-foreground text-lg">
                Activity Timeline
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <ScrollArea className="h-[600px] pr-4">
                {Object.entries(groupedLogs).map(([date, logs], groupIndex) => (
                  <div key={date} className="relative mb-8 last:mb-0">
                    {/* Date separator */}
                    <div className="sticky top-0 z-10 -ml-2 mb-4 flex items-center gap-2 bg-card py-1">
                      <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center">
                        <Clock className="w-4 h-4 text-gold" />
                      </div>
                      <span className="text-sm font-semibold text-foreground">
                        {format(new Date(date), "EEEE, MMMM d, yyyy")}
                      </span>
                      <Badge variant="secondary" className="bg-secondary/50">
                        {logs.length} events
                      </Badge>
                    </div>

                    {/* Timeline items */}
                    <div className="space-y-4 ml-4 border-l-2 border-border pl-6">
                      {logs.map((log, index) => {
                        const ActionIcon =
                          actionConfig[log.action]?.icon || Edit3;
                        const actionInfo = actionConfig[log.action] || {
                          icon: Edit3,
                          color: "text-muted-foreground",
                          bg: "bg-secondary",
                          label: log.action,
                        };

                        return (
                          <div
                            key={log.id}
                            className={cn(
                              "relative",
                              index !== logs.length - 1 && "pb-4",
                            )}
                          >
                            {/* Timeline dot */}
                            <div
                              className={cn(
                                "absolute -left-[30px] w-4 h-4 rounded-full border-2 border-background",
                                actionInfo.bg,
                              )}
                            />

                            {/* Log card */}
                            <div className="rounded-lg bg-secondary/30 border border-border p-4 hover:border-gold/30 transition-colors">
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex items-start gap-3">
                                  {/* Action icon */}
                                  <div
                                    className={cn(
                                      "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
                                      actionInfo.bg,
                                    )}
                                  >
                                    <ActionIcon
                                      className={cn(
                                        "w-5 h-5",
                                        actionInfo.color,
                                      )}
                                    />
                                  </div>

                                  <div>
                                    {/* Action details */}
                                    <div className="flex items-center gap-2 mb-1">
                                      <span
                                        className={cn(
                                          "font-medium",
                                          actionInfo.color,
                                        )}
                                      >
                                        {actionInfo.label}
                                      </span>
                                      <Badge
                                        variant="outline"
                                        className={cn(
                                          "text-xs",
                                          entityTypeConfig[log.entity_type] ||
                                            "text-muted-foreground",
                                        )}
                                      >
                                        {log.entity_type}
                                      </Badge>
                                    </div>

                                    {/* User info */}
                                    {log.user && (
                                      <div className="flex items-center gap-2 mt-2">
                                        <Avatar className="w-5 h-5">
                                          <AvatarImage
                                            src={log.user.avatar_url || ""}
                                          />
                                          <AvatarFallback className="text-[8px] bg-gold/20 text-gold">
                                            {(log.user?.full_name || "U")
                                              .split(" ")
                                              .map((n) => n[0])
                                              .join("")
                                              .slice(0, 2)}
                                          </AvatarFallback>
                                        </Avatar>
                                        <span className="text-sm text-muted-foreground">
                                          {log.user?.full_name || "System"}
                                        </span>
                                      </div>
                                    )}

                                    {/* Additional details */}
                                    {log.details &&
                                      Object.keys(log.details).length > 0 && (
                                        <div className="mt-3 flex flex-wrap gap-2">
                                          {Object.entries(log.details).map(
                                            ([key, value]) => (
                                              <Badge
                                                key={key}
                                                variant="secondary"
                                                className="bg-secondary/50 text-xs"
                                              >
                                                {key}: {String(value)}
                                              </Badge>
                                            ),
                                          )}
                                        </div>
                                      )}
                                  </div>
                                </div>

                                {/* Time */}
                                <div className="text-right flex-shrink-0">
                                  <p className="text-xs text-muted-foreground">
                                    {format(
                                      new Date(log.created_at),
                                      "HH:mm:ss",
                                    )}
                                  </p>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    {formatDistanceToNow(
                                      new Date(log.created_at),
                                      { addSuffix: true },
                                    )}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </ScrollArea>

              {/* Pagination */}
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                  {Math.min(currentPage * itemsPerPage, filteredLogs.length)} of{" "}
                  {filteredLogs.length} logs
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(currentPage + 1)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </RouteGuard>
  );
}
