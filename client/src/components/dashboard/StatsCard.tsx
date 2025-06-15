import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";
import { ReactNode } from "react";

interface StatsCardProps {
  title: string;
  value: string | number | null;
  change?: {
    value: string;
    isPositive: boolean;
  };
  icon: ReactNode;
  gradient: string;
  isLoading?: boolean;
  noDataMessage?: string;
}

export function StatsCard({ title, value, change, icon, gradient, isLoading, noDataMessage }: StatsCardProps) {
  const displayValue = () => {
    if (isLoading) {
      return (
        <div className="flex items-center space-x-2">
          <div className="animate-pulse text-asteroid-silver">Loading...</div>
        </div>
      );
    }
    if (value === null) {
      return (
        <div className="flex items-center space-x-2">
          <div className="text-asteroid-silver">{noDataMessage || "Connect account"}</div>
        </div>
      );
    }
    return value;
  };

  const displayChange = () => {
    if (isLoading) {
      return (
        <div className="flex items-center space-x-2 text-asteroid-silver">
          <div className="w-4 h-4 animate-pulse bg-asteroid-silver rounded"></div>
          <span className="text-sm animate-pulse">Loading data</span>
        </div>
      );
    }
    if (value === null) {
      return (
        <div className="flex items-center space-x-2 text-asteroid-silver">
          <span className="text-sm">No social account connected</span>
        </div>
      );
    }
    if (change) {
      return (
        <div className={`flex items-center space-x-2 ${change.isPositive ? 'text-green-400' : 'text-red-400'}`}>
          {change.isPositive ? (
            <TrendingUp className="h-4 w-4" />
          ) : (
            <TrendingDown className="h-4 w-4" />
          )}
          <span className="text-sm">{change.value}</span>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="content-card holographic">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${gradient} flex items-center justify-center`}>
            {icon}
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-electric-cyan">{displayValue()}</div>
            <div className="text-sm text-asteroid-silver">{title}</div>
          </div>
        </div>
        {displayChange()}
      </CardContent>
    </Card>
  );
}
