"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";

interface CategoryData {
  name: string;
  value: number;
}

interface SalesByCategoryChartProps {
  data: CategoryData[];
}

const CATEGORY_COLORS = ["#9C6C29", "#B8923A", "#D4AC4E", "#8B7355", "#5A4A35"];

export function SalesByCategoryChart({ data }: SalesByCategoryChartProps) {
  return (
    <Card className="bg-card border-border card-hover">
      <CardHeader>
        <CardTitle className="text-foreground">Ventes par Catégorie</CardTitle>
        <CardDescription>
          Distribution à travers les catégories de boissons
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-6">
          <div className="h-[220px] flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {data.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => `${value}%`}
                  contentStyle={{
                    backgroundColor: "#1a1a1a",
                    border: "1px solid #35220D",
                    borderRadius: "8px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3">
            {data.map((category, index) => (
              <div key={category.name} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{
                    backgroundColor:
                      CATEGORY_COLORS[index % CATEGORY_COLORS.length],
                  }}
                />
                <span className="text-sm text-foreground min-w-[80px]">
                  {category.name}
                </span>
                <span className="text-sm font-semibold text-gold ml-auto">
                  {category.value}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
