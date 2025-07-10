import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProfessionalStatsCardProps {
  title: string;
  value: string | number;
  change?: {
    value: string;
    isPositive: boolean;
  };
  icon: React.ElementType;
  description?: string;
}

export function ProfessionalStatsCard({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  description 
}: ProfessionalStatsCardProps) {
  return (
    <Card className="bg-white border border-slate-200 dark:bg-slate-800 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-slate-500 dark:text-slate-400" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">{value}</div>
        {change && (
          <div className="flex items-center gap-1 mt-1">
            {change.isPositive ? (
              <TrendingUp className="h-3 w-3 text-green-500" />
            ) : (
              <TrendingDown className="h-3 w-3 text-red-500" />
            )}
            <span className={cn(
              "text-xs font-medium",
              change.isPositive ? "text-green-500" : "text-red-500"
            )}>
              {change.value}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">from last month</span>
          </div>
        )}
        {description && (
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}