import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Filter,
  Grid3X3,
  List,
  Plus,
  Settings,
  Share,
  X,
  Clock,
  Image,
  Video,
  FileText,
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  Youtube
} from 'lucide-react';

interface ScheduledPost {
  id: string;
  title: string;
  content: string;
  platform: string;
  scheduledAt: Date;
  status: 'scheduled' | 'published' | 'failed';
  type: 'post' | 'story' | 'reel' | 'video';
  thumbnail?: string;
}

interface RecommendedTime {
  time: string;
  platform: string;
  engagement: string;
}

const ProfessionalScheduler: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'calendar' | 'list' | 'grid'>('calendar');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [selectedPost, setSelectedPost] = useState<ScheduledPost | null>(null);

  // Sample data - replace with real API calls
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([
    {
      id: '1',
      title: 'National Mac n Cheese Day',
      content: 'Celebrating the comfort food that brings us all together! 🧀 #MacAndCheese #NationalDay',
      platform: 'instagram',
      scheduledAt: new Date(2025, 6, 14, 14, 0),
      status: 'scheduled',
      type: 'post'
    },
    {
      id: '2',
      title: 'Social Media Giving Day',
      content: 'Today we give back to our amazing community! Thank you for your support 💙',
      platform: 'facebook',
      scheduledAt: new Date(2025, 6, 15, 10, 30),
      status: 'scheduled',
      type: 'post'
    },
    {
      id: '3',
      title: 'World Day for International Justice',
      content: 'Happy World Day for International Justice! Today we celebrate the power of justice, unity, and human rights for all! 🌍⚖️ #WorldJusticeDay #StandTogether',
      platform: 'twitter',
      scheduledAt: new Date(2025, 6, 17, 9, 0),
      status: 'scheduled',
      type: 'post'
    },
    {
      id: '4',
      title: 'Nelson Mandela International Day',
      content: 'Honoring the legacy of Nelson Mandela and his fight for justice and equality 🕊️',
      platform: 'linkedin',
      scheduledAt: new Date(2025, 6, 18, 16, 0),
      status: 'scheduled',
      type: 'post'
    }
  ]);

  const recommendedTimes: RecommendedTime[] = [
    { time: '2:00 AM', platform: 'instagram', engagement: 'High' },
    { time: '9:00 AM', platform: 'facebook', engagement: 'Peak' },
    { time: '11:00 PM', platform: 'twitter', engagement: 'High' }
  ];

  // Get current week dates
  const getWeekDates = (date: Date) => {
    const week = [];
    const startDate = new Date(date);
    const day = startDate.getDay();
    const diff = startDate.getDate() - day;
    startDate.setDate(diff);

    for (let i = 0; i < 7; i++) {
      const day = new Date(startDate);
      day.setDate(startDate.getDate() + i);
      week.push(day);
    }
    return week;
  };

  const weekDates = getWeekDates(currentDate);
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Get posts for a specific date
  const getPostsForDate = (date: Date) => {
    return scheduledPosts.filter(post => {
      const postDate = new Date(post.scheduledAt);
      return postDate.toDateString() === date.toDateString();
    });
  };

  // Platform icon mapping
  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'instagram': return <Instagram className="h-4 w-4" />;
      case 'facebook': return <Facebook className="h-4 w-4" />;
      case 'twitter': return <Twitter className="h-4 w-4" />;
      case 'linkedin': return <Linkedin className="h-4 w-4" />;
      case 'youtube': return <Youtube className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  // Platform color mapping
  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'instagram': return 'bg-pink-500';
      case 'facebook': return 'bg-blue-600';
      case 'twitter': return 'bg-sky-500';
      case 'linkedin': return 'bg-blue-700';
      case 'youtube': return 'bg-red-600';
      default: return 'bg-gray-500';
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatMonth = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'long',
      year: 'numeric'
    });
  };

  const formatWeekRange = (dates: Date[]) => {
    const start = dates[0];
    const end = dates[6];
    const startStr = start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const endStr = end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    return `${startStr} - ${endStr}`;
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const goToPreviousWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() - 7);
    setCurrentDate(newDate);
  };

  const goToNextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + 7);
    setCurrentDate(newDate);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="text-blue-600 bg-blue-50">
                Calendar
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-600">
                Drafts
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-600">
                Content
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-600">
                DM automation
              </Button>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Share className="h-4 w-4" />
            </Button>
            <Button 
              className="bg-teal-700 hover:bg-teal-800 text-white"
              onClick={() => setShowCreatePost(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Create a post
            </Button>
          </div>
        </div>
      </div>

      {/* Calendar Navigation */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={goToPreviousWeek}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" className="font-medium" onClick={goToToday}>
                Today
              </Button>
              <span className="text-lg font-semibold">
                {formatWeekRange(weekDates)}
              </span>
            </div>
            
            <Button variant="ghost" size="sm" onClick={goToNextWeek}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1">
              <Button 
                variant={viewMode === 'list' ? 'default' : 'ghost'} 
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
              <Button 
                variant={viewMode === 'calendar' ? 'default' : 'ghost'} 
                size="sm"
                onClick={() => setViewMode('calendar')}
              >
                <Calendar className="h-4 w-4" />
              </Button>
              <Button 
                variant={viewMode === 'grid' ? 'default' : 'ghost'} 
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
            </div>

            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-200px)]">
        {/* Main Calendar View */}
        <div className="flex-1 bg-white">
          {viewMode === 'calendar' && (
            <div className="h-full">
              {/* Week Header */}
              <div className="grid grid-cols-7 border-b border-gray-200">
                {weekDates.map((date, index) => (
                  <div key={index} className="p-4 text-center border-r border-gray-200 last:border-r-0">
                    <div className="text-sm text-gray-600 mb-1">
                      {dayNames[index]}
                    </div>
                    <div className="text-2xl font-semibold text-gray-900">
                      {date.getDate()}
                    </div>
                  </div>
                ))}
              </div>

              {/* Week Content */}
              <div className="grid grid-cols-7 h-full">
                {weekDates.map((date, index) => {
                  const dayPosts = getPostsForDate(date);
                  const dayRecommendedTimes = recommendedTimes.filter((_, i) => i === index % 3);
                  
                  return (
                    <div key={index} className="border-r border-gray-200 last:border-r-0 p-3 space-y-2 overflow-y-auto">
                      {/* Day Events */}
                      {date.getDate() === 14 && (
                        <div className="bg-teal-600 text-white text-xs px-2 py-1 rounded text-center">
                          National Mac n Cheese Day
                        </div>
                      )}
                      {date.getDate() === 15 && (
                        <div className="bg-blue-600 text-white text-xs px-2 py-1 rounded text-center">
                          Social Media Giving Day
                        </div>
                      )}
                      {date.getDate() === 17 && (
                        <div className="bg-teal-600 text-white text-xs px-2 py-1 rounded text-center">
                          World Day for International Justice
                        </div>
                      )}
                      {date.getDate() === 18 && (
                        <div className="bg-purple-600 text-white text-xs px-2 py-1 rounded text-center">
                          Nelson Mandela International Day
                        </div>
                      )}

                      {/* Recommended Times */}
                      {dayRecommendedTimes.map((rec, i) => (
                        <div key={i} className="bg-purple-100 border border-purple-200 rounded p-2 text-xs">
                          <div className="text-purple-700 font-medium">Recommended time</div>
                          <div className="text-purple-600">{rec.time}</div>
                          <Clock className="h-3 w-3 text-purple-500 mt-1" />
                        </div>
                      ))}

                      {/* Scheduled Posts */}
                      {dayPosts.map((post) => (
                        <div 
                          key={post.id}
                          className={`${getPlatformColor(post.platform)} text-white rounded p-2 text-xs cursor-pointer hover:opacity-90`}
                          onClick={() => setSelectedPost(post)}
                        >
                          <div className="flex items-center justify-between mb-1">
                            {getPlatformIcon(post.platform)}
                            <span>{formatTime(post.scheduledAt)}</span>
                          </div>
                          <div className="font-medium truncate">{post.title}</div>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Side Panel */}
        {(showCreatePost || selectedPost) && (
          <div className="w-96 bg-white border-l border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">
                {selectedPost ? selectedPost.title : 'Create a post'}
              </h2>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => {
                  setShowCreatePost(false);
                  setSelectedPost(null);
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {selectedPost ? (
              /* View Post Details */
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Content</Label>
                  <div className="mt-1 p-3 bg-gray-50 rounded text-sm">
                    {selectedPost.content}
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700">Platform</Label>
                  <div className="mt-1 flex items-center space-x-2">
                    {getPlatformIcon(selectedPost.platform)}
                    <span className="capitalize">{selectedPost.platform}</span>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700">Scheduled Time</Label>
                  <div className="mt-1 text-sm">
                    {selectedPost.scheduledAt.toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit'
                    })}
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700">Status</Label>
                  <div className="mt-1">
                    <Badge variant={selectedPost.status === 'scheduled' ? 'default' : 'secondary'}>
                      {selectedPost.status}
                    </Badge>
                  </div>
                </div>

                <div className="pt-4 space-y-2">
                  <Button className="w-full">Edit Post</Button>
                  <Button variant="outline" className="w-full">Duplicate</Button>
                  <Button variant="destructive" className="w-full">Delete</Button>
                </div>
              </div>
            ) : (
              /* Create New Post */
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Platform</Label>
                  <Select>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select platform" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="instagram">Instagram</SelectItem>
                      <SelectItem value="facebook">Facebook</SelectItem>
                      <SelectItem value="twitter">Twitter</SelectItem>
                      <SelectItem value="linkedin">LinkedIn</SelectItem>
                      <SelectItem value="youtube">YouTube</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700">Content Type</Label>
                  <Select>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="post">Post</SelectItem>
                      <SelectItem value="story">Story</SelectItem>
                      <SelectItem value="reel">Reel</SelectItem>
                      <SelectItem value="video">Video</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700">Caption</Label>
                  <Textarea 
                    className="mt-1" 
                    rows={4}
                    placeholder="Write your caption here..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Date</Label>
                    <Input type="date" className="mt-1" />
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Time</Label>
                    <Input type="time" className="mt-1" />
                  </div>
                </div>

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <div className="flex justify-center space-x-2 mb-2">
                    <Image className="h-6 w-6 text-gray-400" />
                    <Video className="h-6 w-6 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-600">
                    Drag and drop media or click to upload
                  </p>
                </div>

                <div className="pt-4">
                  <Button className="w-full bg-teal-700 hover:bg-teal-800">
                    Schedule Post
                  </Button>
                </div>

                <div className="bg-blue-50 p-3 rounded">
                  <div className="text-sm font-medium text-blue-900 mb-1">
                    AI Suggestions
                  </div>
                  <div className="text-xs text-blue-800">
                    Best time to post: 2:00 PM - 4:00 PM<br />
                    Trending hashtags: #MondayMotivation #ContentCreator
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfessionalScheduler;