import { MessageCircle, Users, TrendingUp, Clock } from "lucide-react";
import { useInstantChatPerformance } from "@/hooks/useInstantData";
import { useWorkspaceContext } from "@/hooks/useWorkspace";

interface ChatMetric {
  platform: string;
  icon: string;
  color: string;
  responseTime: string;
  messagesHandled: number;
  satisfactionRate: number;
  activeChats: number;
}

export function ChatPerformance() {
  const { currentWorkspace } = useWorkspaceContext();

  // Use instant chat performance data
  const { data: chatData, isLoading } = useInstantChatPerformance();

  const defaultMetrics: ChatMetric[] = [
    {
      platform: "Instagram",
      icon: "fab fa-instagram",
      color: "text-pink-500",
      responseTime: "2.3m",
      messagesHandled: 147,
      satisfactionRate: 94,
      activeChats: 8
    },
    {
      platform: "Facebook",
      icon: "fab fa-facebook",
      color: "text-blue-500",
      responseTime: "1.8m",
      messagesHandled: 89,
      satisfactionRate: 91,
      activeChats: 5
    },
    {
      platform: "Twitter",
      icon: "fab fa-twitter",
      color: "text-sky-400",
      responseTime: "3.1m",
      messagesHandled: 203,
      satisfactionRate: 87,
      activeChats: 12
    }
  ];

  const metrics: ChatMetric[] = Array.isArray(chatData) ? chatData : defaultMetrics;

  const totalMessages = metrics.reduce((sum, metric) => sum + metric.messagesHandled, 0);
  const avgSatisfaction = Math.round(metrics.reduce((sum, metric) => sum + metric.satisfactionRate, 0) / metrics.length);
  const totalActiveChats = metrics.reduce((sum, metric) => sum + metric.activeChats, 0);

  return (
    <div className="content-card holographic">
      <div className="p-4 md:p-6">
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <div className="flex items-center space-x-2 md:space-x-3">
            <MessageCircle className="text-xl md:text-2xl text-electric-cyan" />
            <h3 className="text-lg md:text-xl font-orbitron font-semibold">Chat Performance</h3>
          </div>
          {isLoading && (
            <div className="w-5 h-5 md:w-6 md:h-6 border-2 border-electric-cyan border-t-transparent rounded-full animate-spin opacity-50" />
          )}
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-electric-cyan">{totalMessages}</div>
            <div className="text-xs text-asteroid-silver">Messages Today</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">{avgSatisfaction}%</div>
            <div className="text-xs text-asteroid-silver">Avg Satisfaction</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-500">{totalActiveChats}</div>
            <div className="text-xs text-asteroid-silver">Active Chats</div>
          </div>
        </div>

        {/* Platform Metrics */}
        <div className="space-y-4">
          {metrics.map((metric, index) => (
            <div key={index} className="border border-white/10 rounded-lg p-4 bg-white/5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <i className={`${metric.icon} text-lg ${metric.color}`} />
                  <span className="font-medium">{metric.platform}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-asteroid-silver" />
                  <span className="text-sm text-asteroid-silver">{metric.responseTime}</span>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-3 text-sm">
                <div>
                  <div className="text-white font-semibold">{metric.messagesHandled}</div>
                  <div className="text-asteroid-silver">Messages</div>
                </div>
                <div>
                  <div className="text-green-400 font-semibold">{metric.satisfactionRate}%</div>
                  <div className="text-asteroid-silver">Satisfaction</div>
                </div>
                <div>
                  <div className="text-blue-500 font-semibold">{metric.activeChats}</div>
                  <div className="text-asteroid-silver">Active</div>
                </div>
              </div>

              {/* Satisfaction Rate Bar */}
              <div className="mt-3">
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-green-400 to-emerald-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${metric.satisfactionRate}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mt-6 flex flex-wrap gap-2">
          <button className="px-3 py-1.5 bg-electric-cyan/20 text-electric-cyan rounded-md text-sm hover:bg-electric-cyan/30 transition-colors">
            View All Chats
          </button>
          <button className="px-3 py-1.5 bg-blue-500/20 text-blue-500 rounded-md text-sm hover:bg-blue-500/30 transition-colors">
            Response Templates
          </button>
          <button className="px-3 py-1.5 bg-white/10 text-white rounded-md text-sm hover:bg-white/20 transition-colors">
            Analytics Report
          </button>
        </div>
      </div>
    </div>
  );
}