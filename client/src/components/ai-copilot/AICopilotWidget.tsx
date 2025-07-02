import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  Maximize2,
  Paperclip,
  Globe,
  FileText,
  Image,
  Video,
  Brain,
  TrendingUp
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
  language?: string;
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

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
  { code: 'de', name: 'German', flag: '🇩🇪' },
  { code: 'it', name: 'Italian', flag: '🇮🇹' },
  { code: 'pt', name: 'Portuguese', flag: '🇵🇹' },
  { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', flag: '🇰🇷' },
  { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
  { code: 'ru', name: 'Russian', flag: '🇷🇺' }
];

export function AICopilotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [activeTab, setActiveTab] = useState("chat");
  const [messages, setMessages] = useState<CopilotMessage[]>([]);
  const [tasks, setTasks] = useState<CopilotTask[]>([]);
  const [assets, setAssets] = useState<GeneratedAsset[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [isTyping, setIsTyping] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Initialize with welcome message
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage: CopilotMessage = {
        id: 'welcome-1',
        type: 'ai',
        content: getWelcomeMessage(selectedLanguage),
        timestamp: new Date(),
        language: selectedLanguage
      };
      setMessages([welcomeMessage]);
    }
  }, [selectedLanguage]);

  const getWelcomeMessage = (lang: string) => {
    const welcomeMessages = {
      en: "🚀 Hello! I'm your VeeFore AI Copilot. I can help you create content, schedule posts, analyze performance, set up automation, and manage your entire social media strategy. What would you like to work on?",
      es: "🚀 ¡Hola! Soy tu Copiloto AI de VeeFore. Puedo ayudarte a crear contenido, programar publicaciones, analizar rendimiento, configurar automatización y gestionar toda tu estrategia de redes sociales. ¿En qué te gustaría trabajar?",
      fr: "🚀 Bonjour ! Je suis votre Copilote AI VeeFore. Je peux vous aider à créer du contenu, programmer des publications, analyser les performances, configurer l'automatisation et gérer toute votre stratégie de médias sociaux. Sur quoi aimeriez-vous travailler ?",
      de: "🚀 Hallo! Ich bin Ihr VeeFore AI Copilot. Ich kann Ihnen helfen, Inhalte zu erstellen, Posts zu planen, Leistung zu analysieren, Automatisierung einzurichten und Ihre gesamte Social-Media-Strategie zu verwalten. Woran möchten Sie arbeiten?",
      hi: "🚀 नमस्ते! मैं आपका VeeFore AI Copilot हूं। मैं आपको कंटेंट बनाने, पोस्ट शेड्यूल करने, परफॉर्मेंस का विश्लेषण करने, ऑटोमेशन सेटअप करने और आपकी संपूर्ण सोशल मीडिया रणनीति प्रबंधित करने में मदद कर सकता हूं। आप किस पर काम करना चाहेंगे?",
      zh: "🚀 你好！我是你的VeeFore AI副驾驶。我可以帮助你创建内容、安排帖子、分析表现、设置自动化，并管理你的整个社交媒体策略。你想要做什么？",
      ja: "🚀 こんにちは！私はあなたのVeeFore AIコパイロットです。コンテンツの作成、投稿のスケジュール、パフォーマンスの分析、自動化の設定、そしてソーシャルメディア戦略全体の管理をお手伝いできます。何に取り組みたいですか？",
      ar: "🚀 مرحباً! أنا مساعد VeeFore AI الخاص بك. يمكنني مساعدتك في إنشاء المحتوى وجدولة المنشورات وتحليل الأداء وإعداد التشغيل التلقائي وإدارة استراتيجية وسائل التواصل الاجتماعي بأكملها. ما الذي تود العمل عليه؟"
    };
    return welcomeMessages[lang as keyof typeof welcomeMessages] || welcomeMessages.en;
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() && uploadedFiles.length === 0) return;

    const userMessage: CopilotMessage = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: inputMessage,
      timestamp: new Date(),
      language: selectedLanguage
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    try {
      // Get authentication token
      const token = localStorage.getItem('veefore_auth_token');
      if (!token) {
        throw new Error('Authentication required. Please refresh and try again.');
      }

      // Send to backend API with language preference
      const response = await fetch('/api/copilot/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          message: inputMessage,
          language: selectedLanguage,
          context: {
            currentPage: window.location.pathname,
            userActions: [],
            workspaceId: 'current'
          }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();

      const aiResponse: CopilotMessage = {
        id: `ai-${Date.now()}`,
        type: 'ai',
        content: data.message,
        timestamp: new Date(),
        needsConfirmation: data.needsConfirmation,
        action: data.actions?.[0]?.type,
        language: selectedLanguage
      };

      setMessages(prev => [...prev, aiResponse]);
      
      // Clear uploaded files after sending
      setUploadedFiles([]);
      
      // Add any suggested tasks
      if (data.actions) {
        const newTasks: CopilotTask[] = data.actions.map((action: any) => ({
          id: `task-${Date.now()}-${Math.random()}`,
          title: action.description,
          status: 'pending',
          type: action.type,
          parameters: action.parameters || {},
          createdAt: new Date()
        }));
        setTasks(prev => [...prev, ...newTasks]);
      }

    } catch (error) {
      const errorMessage: CopilotMessage = {
        id: `error-${Date.now()}`,
        type: 'system',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
        language: selectedLanguage
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setUploadedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const generateContent = async (type: string) => {
    const prompt = `Generate ${type} content`;
    setInputMessage(prompt);
    await sendMessage();
  };

  const executeTask = async (taskId: string) => {
    setTasks(prev => 
      prev.map(task => 
        task.id === taskId 
          ? { ...task, status: 'in_progress' as const }
          : task
      )
    );

    // Simulate task execution
    setTimeout(() => {
      setTasks(prev => 
        prev.map(task => 
          task.id === taskId 
            ? { ...task, status: 'completed' as const }
            : task
        )
      );
    }, 2000);
  };

  if (!isOpen) {
    return (
      <motion.div
        className="fixed bottom-20 right-6 z-40 md:bottom-6 md:z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        <Button
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-200"
          size="lg"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div
      className={cn(
        "fixed bottom-20 right-6 z-40 md:bottom-6 md:z-50 bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl flex flex-col",
        isMinimized ? "h-16" : "h-[500px] max-h-[calc(100vh-8rem)]",
        "w-96 max-w-[calc(100vw-3rem)]"
      )}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-700/50">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-white text-sm">AI Copilot</h3>
            <p className="text-xs text-slate-400">Ready to assist</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Language Selector */}
          <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
            <SelectTrigger className="w-12 h-8 border-slate-600 bg-slate-800">
              <Globe className="h-3 w-3" />
            </SelectTrigger>
            <SelectContent>
              {languages.map((lang) => (
                <SelectItem key={lang.code} value={lang.code}>
                  <span className="flex items-center gap-2">
                    <span>{lang.flag}</span>
                    <span>{lang.name}</span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMinimized(!isMinimized)}
            className="h-8 w-8 p-0 text-slate-400 hover:text-white"
          >
            {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(false)}
            className="h-8 w-8 p-0 text-slate-400 hover:text-white"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {!isMinimized && (
        <div className="flex flex-col h-[calc(100%-5rem)] overflow-hidden">
          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
            <TabsList className="grid w-full grid-cols-3 bg-slate-800 border-b border-slate-700/50 rounded-none">
              <TabsTrigger value="chat" className="flex items-center gap-2 text-xs">
                <MessageCircle className="h-3 w-3" />
                Chat
              </TabsTrigger>
              <TabsTrigger value="tasks" className="flex items-center gap-2 text-xs">
                <CheckSquare className="h-3 w-3" />
                Tasks
              </TabsTrigger>
              <TabsTrigger value="assets" className="flex items-center gap-2 text-xs">
                <Rocket className="h-3 w-3" />
                Assets
              </TabsTrigger>
            </TabsList>

            {/* Chat Tab */}
            <TabsContent value="chat" className="flex-1 flex flex-col m-0 h-0">
              {/* Messages Area - Fixed height with proper scrolling */}
              <div className="flex-1 overflow-hidden">
                <ScrollArea className="h-full px-4 py-2" ref={chatContainerRef}>
                  <div className="space-y-4 pb-4">
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
                            "max-w-[85%] rounded-2xl px-4 py-3 text-sm break-words",
                            message.type === 'user'
                              ? "bg-purple-600 text-white"
                              : message.type === 'ai'
                              ? "bg-slate-800 text-slate-100 border border-slate-700"
                              : "bg-slate-700 text-slate-300 border border-slate-600"
                          )}
                        >
                          <div className="whitespace-pre-wrap">
                            {message.content}
                          </div>
                          {message.needsConfirmation && (
                            <div className="flex gap-2 mt-3">
                              <Button size="sm" className="h-7 text-xs">
                                Confirm
                              </Button>
                              <Button variant="outline" size="sm" className="h-7 text-xs">
                                Cancel
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    
                    {isTyping && (
                      <div className="flex justify-start">
                        <div className="bg-slate-800 border border-slate-700 rounded-2xl px-4 py-3">
                          <div className="flex gap-1">
                            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>
              </div>

              {/* File Upload Area */}
              {uploadedFiles.length > 0 && (
                <div className="p-3 border-t border-slate-700/50">
                  <div className="flex flex-wrap gap-2">
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="flex items-center gap-2 bg-slate-800 rounded-lg px-3 py-2 text-xs">
                        {file.type.startsWith('image/') ? <Image className="h-3 w-3" /> :
                         file.type.startsWith('video/') ? <Video className="h-3 w-3" /> :
                         <FileText className="h-3 w-3" />}
                        <span className="text-slate-300 truncate max-w-20">{file.name}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(index)}
                          className="h-4 w-4 p-0 text-slate-400 hover:text-white"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Input Area */}
              <div className="p-4 border-t border-slate-700/50">
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <Textarea
                      placeholder={`Type your message in ${languages.find(l => l.code === selectedLanguage)?.name}...`}
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="min-h-[40px] max-h-24 bg-slate-800 border-slate-600 text-white placeholder-slate-400 pr-12 resize-none"
                    />
                    <div className="absolute right-2 top-2 flex gap-1">
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        multiple
                        accept="image/*,video/*,.pdf,.doc,.docx,.txt"
                        className="hidden"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                        className="h-6 w-6 p-0 text-slate-400 hover:text-white"
                      >
                        <Paperclip className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <Button
                    onClick={sendMessage}
                    disabled={!inputMessage.trim() && uploadedFiles.length === 0}
                    className="h-10 w-10 p-0 bg-purple-600 hover:bg-purple-700"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                
                {/* Quick Actions */}
                <div className="flex gap-2 mt-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => generateContent('caption')}
                    className="text-xs border-slate-600 text-slate-300 hover:text-white"
                  >
                    Generate Caption
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => generateContent('hashtags')}
                    className="text-xs border-slate-600 text-slate-300 hover:text-white"
                  >
                    Get Hashtags
                  </Button>
                </div>
              </div>
            </TabsContent>

            {/* Tasks Tab */}
            <TabsContent value="tasks" className="flex-1 m-0">
              <ScrollArea className="h-full p-4">
                <div className="space-y-3">
                  {tasks.length === 0 ? (
                    <div className="text-center text-slate-400 py-8">
                      <CheckSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No active tasks</p>
                    </div>
                  ) : (
                    tasks.map((task) => (
                      <Card key={task.id} className="bg-slate-800 border-slate-700">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-white text-sm">{task.title}</h4>
                            <Badge
                              variant={
                                task.status === 'completed' ? 'default' :
                                task.status === 'in_progress' ? 'secondary' : 'outline'
                              }
                              className="text-xs"
                            >
                              {task.status}
                            </Badge>
                          </div>
                          <p className="text-xs text-slate-400 mb-3">{task.type}</p>
                          {task.status === 'pending' && (
                            <Button
                              size="sm"
                              onClick={() => executeTask(task.id)}
                              className="h-7 text-xs"
                            >
                              Execute
                            </Button>
                          )}
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </ScrollArea>
            </TabsContent>

            {/* Assets Tab */}
            <TabsContent value="assets" className="flex-1 m-0">
              <ScrollArea className="h-full p-4">
                <div className="space-y-3">
                  {assets.length === 0 ? (
                    <div className="text-center text-slate-400 py-8">
                      <Rocket className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No generated assets</p>
                    </div>
                  ) : (
                    assets.map((asset) => (
                      <Card key={asset.id} className="bg-slate-800 border-slate-700">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-white text-sm">{asset.title}</h4>
                            <Badge variant="outline" className="text-xs">
                              {asset.type}
                            </Badge>
                          </div>
                          <p className="text-xs text-slate-400 mb-3">
                            {asset.createdAt.toLocaleDateString()}
                          </p>
                          <div className="flex gap-2">
                            <Button size="sm" className="h-7 text-xs">
                              <Eye className="h-3 w-3 mr-1" />
                              Preview
                            </Button>
                            <Button variant="outline" size="sm" className="h-7 text-xs">
                              Use
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </motion.div>
  );
}