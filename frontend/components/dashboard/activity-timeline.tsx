"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Activity } from "@/types/dashboard";
import {
  Clock,
  CreditCard,
  Package,
  UserCheck,
  ShoppingBag,
  DollarSign,
  AlertTriangle,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

interface ActivityTimelineProps {
  activities: Activity[];
}

const activityIcons = {
  sale: {
    icon: ShoppingBag,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  expense: { icon: DollarSign, color: "text-red-400", bg: "bg-red-400/10" },
  inventory: { icon: Package, color: "text-blue-400", bg: "bg-blue-400/10" },
  user: { icon: UserCheck, color: "text-purple-400", bg: "bg-purple-400/10" },
};

const activityBadges = {
  sale: { label: "Sale", variant: "default" as const },
  expense: { label: "Expense", variant: "secondary" as const },
  inventory: { label: "Inventory", variant: "outline" as const },
  user: { label: "User", variant: "outline" as const },
};

export function ActivityTimeline({ activities }: ActivityTimelineProps) {
  const rows = Array.isArray(activities) ? activities : [];
  return (
    <Card className="bg-card border-border card-hover">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-foreground">Recent Activity</CardTitle>
            <CardDescription>Latest actions and events</CardDescription>
          </div>
          <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center">
            <Clock className="w-5 h-5 text-gold" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {rows.map((activity, index) => {
            const IconConfig = activityIcons[activity.type];
            const BadgeConfig = activityBadges[activity.type];

            return (
              <div
                key={activity.id}
                className={cn(
                  "relative flex gap-4",
                  index !== activities.length - 1 &&
                    "pb-6 border-b border-border",
                )}
              >
                {/* Timeline connector */}
                {index !== activities.length - 1 && (
                  <div className="absolute left-5 top-10 w-px h-full bg-border" />
                )}

                {/* Icon */}
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
                    IconConfig.bg,
                  )}
                >
                  <IconConfig.icon
                    className={cn("w-5 h-5", IconConfig.color)}
                  />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-foreground text-sm">
                      {activity.description}
                    </span>
                    <Badge
                      variant={BadgeConfig.variant}
                      className={cn(
                        "text-xs",
                        BadgeConfig.variant === "default" &&
                          "bg-gold/20 text-gold hover:bg-gold/30",
                      )}
                    >
                      {BadgeConfig.label}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    {activity.amount && (
                      <span className="font-semibold text-foreground">
                        €{activity.amount.toLocaleString()}
                      </span>
                    )}
                    {activity.user && (
                      <div className="flex items-center gap-1.5">
                        <Avatar className="w-4 h-4">
                          <AvatarImage src={activity.user.avatar_url || ""} />
                          <AvatarFallback className="text-[8px] bg-gold/20 text-gold">
                            {activity.user.username
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <span>{activity.user.username}</span>
                      </div>
                    )}
                  </div>

                  <p className="text-xs text-muted-foreground mt-1">
                    {formatDistanceToNow(new Date(activity.timestamp), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
