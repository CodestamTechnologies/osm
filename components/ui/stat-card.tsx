"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { cn } from "../../lib/utils";

interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  value: string | number;
  icon: React.ElementType;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export function StatCard({ title, value, icon: Icon, trend, className, ...props }: StatCardProps) {
  return (
    <Card className={cn("overflow-hidden", className)} {...props}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-brand-text-secondary">
          {title}
        </CardTitle>
        <div className="h-10 w-10 rounded-full bg-brand-primary/10 flex items-center justify-center">
          <Icon className="h-5 w-5 text-brand-primary" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-brand-text-primary">{value}</div>
        {trend && (
          <p className={cn("text-xs mt-1", trend.isPositive ? "text-brand-success" : "text-brand-danger")}>
            {trend.isPositive ? "+" : "-"}{trend.value}% from last month
          </p>
        )}
      </CardContent>
    </Card>
  );
}
