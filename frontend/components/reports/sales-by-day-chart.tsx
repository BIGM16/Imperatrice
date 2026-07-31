"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

interface DayData {
  name: string;
  value: number;
}

interface SalesByDayChartProps {
  data: DayData[];
}

export function SalesByDayChart({ data }: SalesByDayChartProps) {
  return (
    <Card className="bg-card border-border card-hover">
      <CardHeader>
        <CardTitle className="text-foreground">Ventes par jour</CardTitle>
        <CardDescription>Performance journalière des ventes</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[220px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#35220D" />
              <XAxis
                dataKey="name"
                stroke="#8B7355"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#8B7355"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value} FC`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1a1a1a",
                  border: "1px solid #35220D",
                  borderRadius: "8px",
                }}
                formatter={(val: number) => [`${val.toLocaleString()} FC`, "Chiffre d'affaires"]}
              />
              <Bar
                dataKey="value"
                name="Ventes"
                fill="#9C6C29"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
