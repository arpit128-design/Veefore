import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { 
  MessageCircle, 
  Rocket, 
  CheckSquare, 
  Sparkles,
  Send,
  Mic,
  Upload,
  Eye,
  X,
  Minimize2,
  Maximize2
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CopilotMessage {
  id: string;
  type: 'user' | 'ai' | 'system';
  content: string;
  timestamp: Date;
  needsConfirmation?: boolean;
  preview?: any;
  action?: string;
}

interface CopilotTask {
  id: string;
  title: string;
  status: 'pending' | 'in_progress' | 'completed' | 'requires_input';
  type: string;
  parameters: Record<string, any>;
  preview?: any;
  createdAt: Date;
}

interface GeneratedAsset {
  id: string;
  type: 'caption' | 'thumbnail' | 'post' | 'brief' | 'contract';
  title: string;
  content: any;
  createdAt: Date;
  isApproved?: boolean;
}

export function AICopilotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [activeTab, setActiveTab] = useState("chat");
  const [messages, setMessages] = useState<CopilotMessage[]>([
    {
      id: '1',
      type: 'ai',
      content: "🚀 Hello! I'm your VeeFore AI Copilot. I can help you create content, schedule posts, analyze performance, set up automation, and manage your entire social media strategy. What would you like to work on?",
      timestamp: new Date()
    }
  ]);
  const [tasks, setTasks] = useState<CopilotTask[]>([]);
  const [assets, setAssets] = useState<GeneratedAsset[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: CopilotMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    // Simulate AI processing
    setTimeout(() => {
      const aiResponse: CopilotMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: getAIResponse(inputValue),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1500);
  };

  const getAIResponse = (input: string): string => {
    const lowercaseInput = input.toLowerCase();
    
    if (lowercaseInput.includes('create') && lowercaseInput.includes('content')) {
      return "I'd love to help you create content! Let me gather some details:\n\n📝 What type of content? (carousel, reel, static post, etc.)\n🎯 What platform? (Instagram, YouTube, etc.)\n📋 What's your topic or goal?\n🎭 Any specific tone or persona?\n\nOnce you provide these, I'll generate amazing content for you!";
    }
    
    if (lowercaseInput.includes('schedule') || lowercaseInput.includes('publish')) {
      return "Perfect! I can help you schedule posts. Here's what I need:\n\n📱 Which platform and account?\n📅 When do you want to publish?\n🖼️ Do you have media ready or need me to create it?\n✍️ Caption and hashtags ready?\n\nI'll show you a preview before scheduling anything!";
    }
    
    if (lowercaseInput.includes('analytics') || lowercaseInput.includes('performance')) {
      return "Great! Let's dive into your analytics. I can help you:\n\n📊 View key metrics and insights\n📈 Identify top-performing content\n🎯 Get optimization suggestions\n📋 Schedule follow-up actions\n\nWhich platform's analytics would you like to explore first?";
    }
    
    if (lowercaseInput.includes('automation') || lowercaseInput.includes('auto')) {
      return "Automation is powerful! I can set up:\n\n🤖 Auto-DM responses for new followers\n💬 Comment automation with smart replies\n🔄 Content reposting schedules\n🎯 Keyword-triggered actions\n\nWhat type of automation interests you most? I'll walk you through the setup!";
    }
    
    return "I understand you want help with that! I can assist with:\n\n🧾 Content creation (captions, thumbnails, posts)\n⏱️ Scheduling and publishing\n📊 Analytics and insights\n🔁 Setting up automation\n👥 Influencer discovery\n📂 Creative briefs\n🤝 Team collaboration\n\nWhat specific task would you like to tackle first?";
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 rounded-full bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-300 group"
        >
          <div className="relative">
            <Rocket className="h-6 w-6 text-white group-hover:scale-110 transition-transform" />
            <div className="absolute -top-1 -right-1 h-3 w-3 bg-green-400 rounded-full animate-pulse" />
          </div>
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Card className={cn(
        "bg-slate-900/95 backdrop-blur-sm border-violet-500/20 shadow-2xl transition-all duration-300",
        isMinimized ? "w-80 h-16" : "w-96 h-[600px]"
      )}>
        <div className="flex items-center justify-between p-4 border-b border-violet-500/20">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-violet-600 to-blue-600 flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">AI Copilot</h3>
              <p className="text-xs text-slate-400">Ready to assist</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMinimized(!isMinimized)}
              className="h-8 w-8 text-slate-400 hover:text-white"
            >
              {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="h-8 w-8 text-slate-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {!isMinimized && (
          <CardContent className="p-0 h-[544px] flex flex-col">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
              <TabsList className="grid w-full grid-cols-3 bg-slate-800/50 border-b border-violet-500/20">
                <TabsTrigger value="chat" className="data-[state=active]:bg-violet-600/20">
                  <MessageCircle className="h-4 w-4 mr-1" />
                  Chat
                </TabsTrigger>
                <TabsTrigger value="tasks" className="data-[state=active]:bg-violet-600/20">
                  <CheckSquare className="h-4 w-4 mr-1" />
                  Tasks
                  {tasks.length > 0 && (
                    <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 text-xs">
                      {tasks.length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="assets" className="data-[state=active]:bg-violet-600/20">
                  <Sparkles className="h-4 w-4 mr-1" />
                  Assets
                  {assets.length > 0 && (
                    <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 text-xs">
                      {assets.length}
                    </Badge>
                  )}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="chat" className="flex-1 flex flex-col m-0">
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={cn(
                          "flex",
                          message.type === 'user' ? "justify-end" : "justify-start"
                        )}
                      >
                        <div
                          className={cn(
                            "max-w-[80%] rounded-lg p-3 text-sm",
                            message.type === 'user'
                              ? "bg-violet-600 text-white"
                              : "bg-slate-800 text-slate-200 border border-violet-500/20"
                          )}
                        >
                          <div className="whitespace-pre-wrap">{message.content}</div>
                          {message.needsConfirmation && (
                            <div className="flex gap-2 mt-3">
                              <Button size="sm" className="bg-green-600 hover:bg-green-700">
                                Confirm
                              </Button>
                              <Button size="sm" variant="outline">
                                Cancel
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex justify-start">
                        <div className="bg-slate-800 border border-violet-500/20 rounded-lg p-3">
                          <div className="flex items-center gap-2">
                            <div className="flex gap-1">
                              <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" />
                              <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                              <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                            </div>
                            <span className="text-xs text-slate-400">AI is thinking...</span>
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>
                
                <div className="p-4 border-t border-violet-500/20">
                  <div className="flex gap-2">
                    <Input
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Ask me anything about your social media..."
                      className="bg-slate-800 border-violet-500/20 text-white placeholder:text-slate-400"
                      disabled={isLoading}
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!inputValue.trim() || isLoading}
                      className="bg-violet-600 hover:bg-violet-700"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                      <Mic className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                      <Upload className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="tasks" className="flex-1 m-0 p-4">
                <ScrollArea className="h-full">
                  {tasks.length === 0 ? (
                    <div className="text-center text-slate-400 mt-8">
                      <CheckSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No active tasks</p>
                      <p className="text-sm">Start a conversation to create tasks</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {tasks.map((task) => (
                        <Card key={task.id} className="bg-slate-800/50 border-violet-500/20">
                          <CardContent className="p-3">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 className="text-sm font-medium text-white mb-1">{task.title}</h4>
                                <p className="text-xs text-slate-400 mb-2">{task.type}</p>
                                <Badge
                                  variant={task.status === 'completed' ? 'default' : 'secondary'}
                                  className="text-xs"
                                >
                                  {task.status.replace('_', ' ')}
                                </Badge>
                              </div>
                              {task.preview && (
                                <Button variant="ghost" size="sm">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </TabsContent>

              <TabsContent value="assets" className="flex-1 m-0 p-4">
                <ScrollArea className="h-full">
                  {assets.length === 0 ? (
                    <div className="text-center text-slate-400 mt-8">
                      <Sparkles className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No generated assets</p>
                      <p className="text-sm">Ask me to create content, captions, or briefs</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {assets.map((asset) => (
                        <Card key={asset.id} className="bg-slate-800/50 border-violet-500/20">
                          <CardContent className="p-3">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 className="text-sm font-medium text-white mb-1">{asset.title}</h4>
                                <Badge variant="outline" className="text-xs mb-2">
                                  {asset.type}
                                </Badge>
                                <p className="text-xs text-slate-400">
                                  {asset.createdAt.toLocaleDateString()}
                                </p>
                              </div>
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </CardContent>
        )}
      </Card>
    </div>
  );
}