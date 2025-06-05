import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";
import { ReactNode } from "react";

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: {
    value: string;
    isPositive: boolean;
  };
  icon: ReactNode;
  gradient: string;
}

export function StatsCard({ title, value, change, icon, gradient }: StatsCardProps) {
  return (
    <Card className="content-card holographic">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${gradient} flex items-center justify-center`}>
            {icon}
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-electric-cyan">{value}</div>
            <div className="text-sm text-asteroid-silver">{title}</div>
          </div>
        </div>
        {change && (
          <div className={`flex items-center space-x-2 ${change.isPositive ? 'text-green-400' : 'text-red-400'}`}>
            {change.isPositive ? (
              <TrendingUp className="h-4 w-4" />
            ) : (
              <TrendingDown className="h-4 w-4" />
            )}
            <span className="text-sm">{change.value}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
